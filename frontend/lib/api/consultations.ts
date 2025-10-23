import api from '../api';
import { Consultation } from '@/types';

export interface CreateConsultationInput {
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  chiefComplaint?: string;
}

export const consultationService = {
  async create(data: CreateConsultationInput): Promise<{ consultation: Consultation }> {
    const response = await api.post('/consultations', data);
    return response.data;
  },

  async uploadAudio(consultationId: string, audioBlob: Blob): Promise<{ consultation: Consultation }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await api.post(`/consultations/${consultationId}/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAll(page = 1, limit = 10) {
    const response = await api.get(`/consultations?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getById(id: string): Promise<{ consultation: Consultation }> {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<CreateConsultationInput>): Promise<{ consultation: Consultation }> {
    const response = await api.patch(`/consultations/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/consultations/${id}`);
    return response.data;
  },

  async transcribe(id: string): Promise<{ consultation: Consultation }> {
    const response = await api.post(`/consultations/${id}/transcribe`);
    return response.data;
  },

  async generateDiagnosis(id: string) {
    const response = await api.post(`/consultations/${id}/diagnosis`);
    return response.data;
  },

  async getStatistics() {
    const response = await api.get('/consultations/statistics');
    return response.data;
  },
};
