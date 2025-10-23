import { Response } from 'express';
import { AuthRequest } from '../types';
import { ConsultationService } from '../services/consultation.service';
import { createConsultationSchema, updateConsultationSchema } from '../utils/consultations.validations';
import { AppError } from '../utils/errors';

const consultationService = new ConsultationService();

export class ConsultationController {
  async create(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const validatedData = createConsultationSchema.parse(req.body);
      const consultation = await consultationService.create(doctorId, validatedData);

      return res.status(201).json({
        message: 'Consulta criada com sucesso',
        consultation,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao criar consulta:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findAll(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await consultationService.findAll(doctorId, page, limit);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao listar consultas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findById(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = req.params;
      const consultation = await consultationService.findById(id, doctorId);

      return res.status(200).json({ consultation });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao buscar consulta:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = req.params;
      const validatedData = updateConsultationSchema.parse(req.body);
      const consultation = await consultationService.update(id, doctorId, validatedData);

      return res.status(200).json({
        message: 'Consulta atualizada com sucesso',
        consultation,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao atualizar consulta:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = req.params;
      const result = await consultationService.delete(id, doctorId);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao deletar consulta:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async uploadAudio(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = req.params;
      const file = req.file;

      if (!file) {
        throw new AppError('Arquivo de áudio não fornecido', 400);
      }

      const consultation = await consultationService.uploadAudio(id, doctorId, file);

      return res.status(200).json({
        message: 'Áudio enviado com sucesso',
        consultation,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao fazer upload de áudio:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getStatistics(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const statistics = await consultationService.getStatistics(doctorId);

      return res.status(200).json({ statistics });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
