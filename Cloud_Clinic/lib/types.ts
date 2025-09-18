export type UserRole = 'doctor' | 'patient';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  status: 'booked' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Prescription {
  id: string;
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  prescription_text: string;
  prescription_file_url?: string;
  created_at: string;
}

export interface Document {
  id: string;
  patient_id: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}