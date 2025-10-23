'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const consultationSchema = z.object({
  patientName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  patientAge: z.number().int().positive().optional(),
  patientGender: z.enum(['M', 'F', 'Outro']).optional(),
  chiefComplaint: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface NewConsultationFormProps {
  onSubmit: (data: ConsultationFormData) => void;
  isLoading?: boolean;
}

export default function NewConsultationForm({ onSubmit, isLoading }: NewConsultationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientName">Nome do Paciente *</Label>
        <Input
          id="patientName"
          placeholder="Nome completo"
          {...register('patientName')}
          disabled={isLoading}
        />
        {errors.patientName && (
          <p className="text-sm text-red-500">{errors.patientName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientAge">Idade</Label>
          <Input
            id="patientAge"
            type="number"
            placeholder="35"
            {...register('patientAge', { valueAsNumber: true })}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientGender">Sexo</Label>
          <Select
            onValueChange={(value) => setValue('patientGender', value as any)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Feminino</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chiefComplaint">Queixa Principal</Label>
        <Textarea
          id="chiefComplaint"
          placeholder="Ex: Dor de cabeça há 3 dias"
          {...register('chiefComplaint')}
          disabled={isLoading}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Criando...' : 'Criar Consulta'}
      </Button>
    </form>
  );
}
