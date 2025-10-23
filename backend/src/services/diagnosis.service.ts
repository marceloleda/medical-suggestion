import OpenAI from 'openai';
import prisma from '../config/database';
import { AppError } from '../utils/errors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DiagnosisResponse {
  symptoms: string[];
  preliminaryDiagnosis: string;
  recommendations: string;
  suggestedExams: string[];
}

export class DiagnosisService {
  async generateDiagnosis(consultationId: string, doctorId: string) {
    // Buscar consulta
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        doctorId,
      },
      include: {
        doctor: true,
      },
    });

    if (!consultation) {
      throw new AppError('Consulta não encontrada', 404);
    }

    if (!consultation.transcription) {
      throw new AppError('Consulta não possui transcrição', 400);
    }

    if (consultation.status !== 'TRANSCRIBED') {
      throw new AppError('Consulta não está pronta para diagnóstico', 400);
    }

    try {
      // Atualizar status
      await prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'DIAGNOSING' },
      });

      // Criar prompt para GPT-4
      const prompt = this.buildDiagnosisPrompt(consultation.transcription, {
        patientName: consultation.patientName,
        patientAge: consultation.patientAge,
        patientGender: consultation.patientGender,
        chiefComplaint: consultation.chiefComplaint,
      });

      // Chamar GPT-4
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new AppError('Resposta vazia da IA', 500);
      }

      const diagnosisData: DiagnosisResponse = JSON.parse(responseContent);

      // Criar ou atualizar diagnóstico
      const diagnosis = await prisma.diagnosis.upsert({
        where: { consultationId },
        create: {
          consultationId,
          symptoms: diagnosisData.symptoms,
          preliminaryDiagnosis: diagnosisData.preliminaryDiagnosis,
          recommendations: diagnosisData.recommendations,
          suggestedExams: diagnosisData.suggestedExams,
        },
        update: {
          symptoms: diagnosisData.symptoms,
          preliminaryDiagnosis: diagnosisData.preliminaryDiagnosis,
          recommendations: diagnosisData.recommendations,
          suggestedExams: diagnosisData.suggestedExams,
        },
      });

      // Atualizar status da consulta
      await prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'COMPLETED' },
      });

      return diagnosis;
    } catch (error) {
      console.error('Erro ao gerar diagnóstico:', error);

      // Reverter status em caso de erro
      await prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'TRANSCRIBED' },
      });

      throw new AppError('Erro ao gerar diagnóstico', 500);
    }
  }

  async confirmDiagnosis(consultationId: string, doctorId: string, observations?: string) {
    const diagnosis = await prisma.diagnosis.findFirst({
      where: {
        consultationId,
        consultation: {
          doctorId,
        },
      },
    });

    if (!diagnosis) {
      throw new AppError('Diagnóstico não encontrado', 404);
    }

    const updatedDiagnosis = await prisma.diagnosis.update({
      where: { id: diagnosis.id },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        observations,
      },
    });

    return updatedDiagnosis;
  }

  async updateDiagnosis(
    consultationId: string,
    doctorId: string,
    data: Partial<DiagnosisResponse>
  ) {
    const diagnosis = await prisma.diagnosis.findFirst({
      where: {
        consultationId,
        consultation: {
          doctorId,
        },
      },
    });

    if (!diagnosis) {
      throw new AppError('Diagnóstico não encontrado', 404);
    }

    const updatedDiagnosis = await prisma.diagnosis.update({
      where: { id: diagnosis.id },
      data: {
        symptoms: data.symptoms,
        preliminaryDiagnosis: data.preliminaryDiagnosis,
        recommendations: data.recommendations,
        suggestedExams: data.suggestedExams,
      },
    });

    return updatedDiagnosis;
  }

  private getSystemPrompt(): string {
    return `Você é um assistente médico especializado em analisar transcrições de consultas médicas.
Sua função é auxiliar médicos identificando sintomas, sugerindo hipóteses diagnósticas e recomendações.

IMPORTANTE:
- Você está AUXILIANDO um médico, não substituindo.
- Suas sugestões são PRÉ-DIAGNÓSTICOS que DEVEM ser revisados pelo médico.
- Sempre reforce que o diagnóstico final é responsabilidade do médico.
- Base suas análises APENAS nas informações fornecidas na transcrição.
- Use terminologia médica precisa.
- Sempre que possível, sugira códigos CID-10 para as hipóteses diagnósticas.

Sua resposta DEVE ser um JSON válido no seguinte formato:
{
  "symptoms": ["sintoma1", "sintoma2", "sintoma3"],
  "preliminaryDiagnosis": "Descrição detalhada das hipóteses diagnósticas com códigos CID-10 quando aplicável",
  "recommendations": "Recomendações de tratamento e orientações gerais",
  "suggestedExams": ["exame1", "exame2", "exame3"]
}`;
  }

  private buildDiagnosisPrompt(
    transcription: string,
    patientInfo: {
      patientName: string;
      patientAge?: number | null;
      patientGender?: string | null;
      chiefComplaint?: string | null;
    }
  ): string {
    return `Analise a seguinte consulta médica e forneça um pré-diagnóstico:

INFORMAÇÕES DO PACIENTE:
- Nome: ${patientInfo.patientName}
- Idade: ${patientInfo.patientAge || 'Não informada'}
- Sexo: ${patientInfo.patientGender || 'Não informado'}
- Queixa Principal: ${patientInfo.chiefComplaint || 'Ver transcrição'}

TRANSCRIÇÃO DA CONSULTA:
${transcription}

Por favor, analise cuidadosamente a transcrição e forneça:
1. Lista de sintomas identificados
2. Hipóteses diagnósticas (com CID-10 quando possível)
3. Recomendações de tratamento e orientações
4. Exames complementares sugeridos

Lembre-se: Este é um PRÉ-DIAGNÓSTICO que será revisado pelo médico responsável.`;
  }
}
