import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { StorageService } from './storage.service';
import { CreateConsultationInput, UpdateConsultationInput } from '../utils/consultations.validations';
import { ConsultationStatus } from '@prisma/client';

const storageService = new StorageService();

export class ConsultationService {
  async create(doctorId: string, data: CreateConsultationInput) {
    const consultation = await prisma.consultation.create({
      data: {
        doctorId,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        chiefComplaint: data.chiefComplaint,
        status: 'RECORDING',
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return consultation;
  }

  async findAll(doctorId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where: { doctorId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          diagnosis: true,
        },
      }),
      prisma.consultation.count({ where: { doctorId } }),
    ]);

    return {
      consultations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(consultationId: string, doctorId: string) {
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        doctorId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            crm: true,
          },
        },
        diagnosis: true,
      },
    });

    if (!consultation) {
      throw new AppError('Consulta não encontrada', 404);
    }

    // Gerar URL assinada se tiver áudio
    if (consultation.audioKey) {
      const signedUrl = await storageService.getSignedUrl(consultation.audioKey);
      return { ...consultation, audioUrl: signedUrl };
    }

    return consultation;
  }

  async update(consultationId: string, doctorId: string, data: UpdateConsultationInput) {
    // Verificar se a consulta existe e pertence ao médico
    const existingConsultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        doctorId,
      },
    });

    if (!existingConsultation) {
      throw new AppError('Consulta não encontrada', 404);
    }

    const consultation = await prisma.consultation.update({
      where: { id: consultationId },
      data,
      include: {
        diagnosis: true,
      },
    });

    return consultation;
  }

  async delete(consultationId: string, doctorId: string) {
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        doctorId,
      },
    });

    if (!consultation) {
      throw new AppError('Consulta não encontrada', 404);
    }

    // Deletar áudio do S3 se existir
    if (consultation.audioKey) {
      await storageService.deleteFile(consultation.audioKey);
    }

    await prisma.consultation.delete({
      where: { id: consultationId },
    });

    return { message: 'Consulta deletada com sucesso' };
  }

  async uploadAudio(consultationId: string, doctorId: string, file: Express.Multer.File) {
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        doctorId,
      },
    });

    if (!consultation) {
      throw new AppError('Consulta não encontrada', 404);
    }

    // Gerar chave única para o arquivo
    const timestamp = Date.now();
    const extension = file.mimetype.split('/')[1];
    const key = `consultations/${consultationId}/${timestamp}.${extension}`;

    // Upload para S3
    const audioUrl = await storageService.uploadFile(file, key);

    // Atualizar consulta
    const updatedConsultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        audioUrl,
        audioKey: key,
        audioSize: file.size,
        status: 'UPLOADED',
      },
    });

    return updatedConsultation;
  }

  async getStatistics(doctorId: string) {
    const [total, completed, transcribed, diagnosing] = await Promise.all([
      prisma.consultation.count({ where: { doctorId } }),
      prisma.consultation.count({ where: { doctorId, status: 'COMPLETED' } }),
      prisma.consultation.count({ where: { doctorId, status: 'TRANSCRIBED' } }),
      prisma.consultation.count({ where: { doctorId, status: 'DIAGNOSING' } }),
    ]);

    return {
      total,
      completed,
      transcribed,
      diagnosing,
      pending: total - completed,
    };
  }
}
