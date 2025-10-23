import { Response } from 'express';
import { AuthRequest } from '../types';
import { DiagnosisService } from '../services/diagnosis.service';
import { AppError } from '../utils/errors';
import { z } from 'zod';

const diagnosisService = new DiagnosisService();

const confirmDiagnosisSchema = z.object({
  observations: z.string().optional(),
});

const updateDiagnosisSchema = z.object({
  symptoms: z.array(z.string()).optional(),
  preliminaryDiagnosis: z.string().optional(),
  recommendations: z.string().optional(),
  suggestedExams: z.array(z.string()).optional(),
});

export class DiagnosisController {
  async generate(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = req.params;

      const diagnosis = await diagnosisService.generateDiagnosis(id, doctorId);

      return res.status(200).json({
        message: 'Diagnóstico gerado com sucesso',
        diagnosis,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao gerar diagnóstico:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async confirm(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.userId;
      if (!doctorId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = req.params;
      const validatedData = confirmDiagnosisSchema.parse(req.body);

      const diagnosis = await diagnosisService.confirmDiagnosis(
        id,
        doctorId,
        validatedData.observations
      );

      return res.status(200).json({
        message: 'Diagnóstico confirmado com sucesso',
        diagnosis,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao confirmar diagnóstico:', error);
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
      const validatedData = updateDiagnosisSchema.parse(req.body);

      const diagnosis = await diagnosisService.updateDiagnosis(id, doctorId, validatedData);

      return res.status(200).json({
        message: 'Diagnóstico atualizado com sucesso',
        diagnosis,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao atualizar diagnóstico:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
