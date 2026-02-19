import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DbPatient {
  id: string;
  patient_code: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  blood_type: string;
  allergies: string[];
  conditions: string[];
  risk_level: string;
  doctor_id: string;
}

export interface DbAppointment {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  type: string;
  status: string;
  priority: string;
  notes: string | null;
  doctor_id: string;
}

export interface DbReminder {
  id: string;
  patient_id: string;
  patient_name: string;
  type: string;
  message: string;
  scheduled_at: string;
  status: string;
  appointment_id: string | null;
  doctor_id: string;
}

export interface DbPrescription {
  id: string;
  patient_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  status: string;
}

export interface DbVisit {
  id: string;
  patient_id: string;
  visit_date: string;
  reason: string;
  diagnosis: string;
  notes: string;
  follow_up: string | null;
}

export const useMediData = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<DbPatient[]>([]);
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  const [reminders, setReminders] = useState<DbReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; specialty: string } | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [pRes, aRes, rRes, prRes] = await Promise.all([
        supabase.from("patients").select("*").order("name"),
        supabase.from("appointments").select("*").order("appointment_date").order("appointment_time"),
        supabase.from("reminders").select("*").order("scheduled_at"),
        supabase.from("profiles").select("full_name, specialty").eq("id", user.id).single(),
      ]);
      if (pRes.data) setPatients(pRes.data);
      if (aRes.data) setAppointments(aRes.data);
      if (rRes.data) setReminders(rRes.data);
      if (prRes.data) setProfile(prRes.data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addPatient = async (data: Omit<DbPatient, 'id' | 'doctor_id'>) => {
    if (!user) return;
    const { data: p, error } = await supabase.from("patients").insert({ ...data, doctor_id: user.id }).select().single();
    if (!error && p) setPatients(prev => [...prev, p]);
    return { error };
  };

  const bookAppointment = async (data: Omit<DbAppointment, 'id' | 'doctor_id'>) => {
    if (!user) return;
    const { data: a, error } = await supabase.from("appointments").insert({ ...data, doctor_id: user.id }).select().single();
    if (!error && a) {
      setAppointments(prev => [...prev, a]);
      // Auto-create reminder
      const apptDate = new Date(`${data.appointment_date}T${data.appointment_time}`);
      apptDate.setHours(apptDate.getHours() - 24);
      await supabase.from("reminders").insert({
        doctor_id: user.id,
        patient_id: data.patient_id,
        appointment_id: a.id,
        patient_name: data.patient_name,
        type: 'email',
        message: `Reminder: Your appointment is scheduled for ${data.appointment_date} at ${data.appointment_time}. Please arrive 10 minutes early.`,
        scheduled_at: apptDate.toISOString(),
        status: 'pending',
      });
      await fetchAll();
    }
    return { error };
  };

  const cancelAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (!error) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const sendReminder = async (id: string) => {
    const { error } = await supabase.from("reminders").update({ status: "sent" }).eq("id", id);
    if (!error) setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'sent' } : r));
  };

  const sendAllReminders = async () => {
    const pendingIds = reminders.filter(r => r.status === 'pending').map(r => r.id);
    if (!pendingIds.length) return;
    await supabase.from("reminders").update({ status: "sent" }).in("id", pendingIds);
    setReminders(prev => prev.map(r => r.status === 'pending' ? { ...r, status: 'sent' } : r));
  };

  const fetchPatientDetails = async (patientId: string) => {
    const [pRes, vRes] = await Promise.all([
      supabase.from("prescriptions").select("*").eq("patient_id", patientId),
      supabase.from("visits").select("*").eq("patient_id", patientId).order("visit_date", { ascending: false }),
    ]);
    return {
      prescriptions: (pRes.data || []) as DbPrescription[],
      visits: (vRes.data || []) as DbVisit[],
    };
  };

  return {
    patients, appointments, reminders, profile, loading,
    addPatient, bookAppointment, cancelAppointment, sendReminder, sendAllReminders,
    fetchPatientDetails, refetch: fetchAll,
  };
};
