'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import NewConsultationForm from '@/components/forms/NewConsultationForm';
import AudioRecorder from '@/components/audio/AudioRecorder';
import { consultationService } from '@/lib/api/consultations';
import { Consultation } from '@/types';

export default function NewConsultationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'recording'>('form');
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await consultationService.create(data);
      setConsultation(response.consultation);
      setStep('recording');

      toast({
        title: 'Consulta criada!',
        description: 'Agora você pode gravar o áudio da consulta.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar consulta',
        description: error.response?.data?.error || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!consultation) return;

    try {
      setIsLoading(true);
      await consultationService.uploadAudio(consultation.id, audioBlob);

      toast({
        title: 'Áudio enviado!',
        description: 'O áudio foi salvo com sucesso.',
      });

      router.push(`/consultations/${consultation.id}`);
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar áudio',
        description: error.response?.data?.error || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nova Consulta</h1>
        <p className="text-gray-600">Preencha os dados e grave a consulta</p>
      </div>

      {step === 'form' && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Preencha as informações básicas antes de iniciar a gravação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewConsultationForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      )}

      {step === 'recording' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paciente: {consultation?.patientName}</CardTitle>
              <CardDescription>
                Grave o áudio da consulta médica
              </CardDescription>
            </CardHeader>
          </Card>

          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}
