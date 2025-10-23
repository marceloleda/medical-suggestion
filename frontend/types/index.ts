export interface User {
  id: string;
  email: string;
  name: string;
  crm: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  crm: string;
}

export interface Consultation {
  id: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  chiefComplaint?: string;
  audioUrl?: string;
  audioKey?: string;
  transcription?: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
  diagnosis?: Diagnosis;
}

export type ConsultationStatus =
  | 'RECORDING'
  | 'UPLOADED'
  | 'TRANSCRIBING'
  | 'TRANSCRIBED'
  | 'DIAGNOSING'
  | 'COMPLETED';

export interface Diagnosis {
  id: string;
  symptoms: string[];
  preliminaryDiagnosis: string;
  recommendations: string;
  suggestedExams: string[];
  observations?: string;
  confirmed: boolean;
  confirmedAt?: string;
  createdAt: string;
}
