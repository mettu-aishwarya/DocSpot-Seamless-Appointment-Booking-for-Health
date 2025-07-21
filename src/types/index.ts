export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  date_of_birth?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  license_number: string;
  years_of_experience: number;
  education: string;
  bio?: string;
  consultation_fee: number;
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
  total_reviews?: number;
  availability?: DoctorAvailability[];
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
  patient?: User;
  doctor?: Doctor;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  patient?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalDoctors?: number;
  totalPatients?: number;
  pendingApprovals?: number;
}