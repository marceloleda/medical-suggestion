import OpenAI from 'openai';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { StorageService } from './storage.service';
import fs from 'fs';
import path from 'path';
import https from 'https';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storageService = new StorageService();

export class TranscriptionService {
  async transcribeAudio(consultationId: string, doctorId: string) {
    // Buscar consulta
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        doctorId,
      },
    });

    if (!consultation) {
      throw new AppError('Consulta não encontrada', 404);
    }

    if (!consultation.audioKey) {
      throw new AppError('Consulta não possui áudio', 400);
    }

    if (consultation.status !== 'UPLOADED') {
      throw new AppError('Consulta não está pronta para transcrição', 400);
    }

    try {
      // Atualizar status
      await prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'TRANSCRIBING' },
      });

      // Obter URL assinada do áudio
      const audioUrl = await storageService.getSignedUrl(consultation.audioKey, 3600);

      // Baixar áudio temporariamente
      const tempFilePath = path.join('/tmp', `${consultationId}.mp3`);
      await this.downloadFile(audioUrl, tempFilePath);

      // Transcrever com Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
        language: 'pt',
        response_format: 'verbose_json',
      });

      // Deletar arquivo temporário
      fs.unlinkSync(tempFilePath);

      // Salvar transcrição
      const updatedConsultation = await prisma.consultation.update({
        where: { id: consultationId },
        data: {
          transcription: transcription.text,
          status: 'TRANSCRIBED',
        },
        include: {
          diagnosis: true,
        },
      });

      return updatedConsultation;
    } catch (error) {
      console.error('Erro na transcrição:', error);

      // Reverter status em caso de erro
      await prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'UPLOADED' },
      });

      throw new AppError('Erro ao transcrever áudio', 500);
    }
  }

  private downloadFile(url: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destination);

      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (error) => {
        fs.unlink(destination, () => {});
        reject(error);
      });
    });
  }
}
