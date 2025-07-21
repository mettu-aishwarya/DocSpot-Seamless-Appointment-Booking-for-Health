import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const createUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: userId, ...profileData }])
    .select()
    .single();
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const getDoctors = async (filters?: any) => {
  let query = supabase
    .from('doctors')
    .select(`
      *,
      user:users(*)
    `)
    .eq('status', 'approved');

  if (filters?.specialty) {
    query = query.eq('specialty', filters.specialty);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getAppointments = async (userId: string, role: string) => {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      patient:users!appointments_patient_id_fkey(*),
      doctor:doctors!appointments_doctor_id_fkey(*, user:users(*))
    `);

  if (role === 'patient') {
    query = query.eq('patient_id', userId);
  } else if (role === 'doctor') {
    query = query.eq('doctor_id', userId);
  }

  const { data, error } = await query.order('appointment_date', { ascending: true });
  return { data, error };
};

export const createAppointment = async (appointmentData: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();
  return { data, error };
};

export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select()
    .single();
  return { data, error };
};