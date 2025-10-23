import { Response } from 'express';
import { AuthRequest } from '../types';
import { TranscriptionService } from '../services/transcription.service';
import { AppError } from '../utils/errors';

const transcriptionService = new TranscriptionService();

export class TranscriptionController {
  async transcribe(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = req.params;

      const consultation = await transcriptionService.transcribeAudio(id, doctorId);

      return res.status(200).json({
        message: 'Transcrição realizada com sucesso',
        consultation,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao transcrever:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
