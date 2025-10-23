import { z } from 'zod';

export const createConsultationSchema = z.object({
  patientName: z.string().min(3, 'Nome do paciente é obrigatório'),
  patientAge: z.number().int().positive().optional(),
  patientGender: z.enum(['M', 'F', 'Outro']).optional(),
  chiefComplaint: z.string().optional(),
});

export const updateConsultationSchema = z.object({
  patientName: z.string().min(3).optional(),
  patientAge: z.number().int().positive().optional(),
  patientGender: z.enum(['M', 'F', 'Outro']).optional(),
  chiefComplaint: z.string().optional(),
  transcription: z.string().optional(),
});

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
export type UpdateConsultationInput = z.infer<typeof updateConsultationSchema>;
