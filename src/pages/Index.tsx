import { useState } from "react";
import { patients, appointments, reminders } from "@/data/mockData";
import { Patient, Appointment } from "@/data/mockData";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import PatientsView from "@/components/PatientsView";
import SchedulerView from "@/components/SchedulerView";
import RemindersView from "@/components/RemindersView";
import VoiceAssistant from "@/components/VoiceAssistant";

export type ActiveView = 'dashboard' | 'patients' | 'scheduler' | 'reminders';

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(appointments);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleBookAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppt: Appointment = {
      ...appointment,
      id: `A${String(appointmentList.length + 1).padStart(3, '0')}`,
    };
    setAppointmentList(prev => [...prev, newAppt]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointmentList(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a)
    );
  };

  const handleVoiceCommand = (command: string) => {
    const lower = command.toLowerCase();
    if (lower.includes('dashboard') || lower.includes('home')) {
      setActiveView('dashboard');
    } else if (lower.includes('patient') && !lower.includes('next')) {
      setActiveView('patients');
    } else if (lower.includes('schedule') || lower.includes('appointment')) {
      setActiveView('scheduler');
    } else if (lower.includes('reminder')) {
      setActiveView('reminders');
    } else if (lower.includes('next patient')) {
      const todayAppts = appointmentList.filter(a => a.date === '2026-02-17' && a.status === 'scheduled');
      if (todayAppts.length > 0) {
        const nextAppt = todayAppts[0];
        const patient = patients.find(p => p.id === nextAppt.patientId);
        if (patient) {
          setSelectedPatient(patient);
          setActiveView('patients');
        }
      }
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} onNavigate={setActiveView} onVoiceOpen={() => setVoiceOpen(true)} />
      
      <main className="flex-1 overflow-auto scrollbar-thin">
        {activeView === 'dashboard' && (
          <DashboardView
            patients={patients}
            appointments={appointmentList}
            reminders={reminders}
            onViewPatient={(patient) => { setSelectedPatient(patient); setActiveView('patients'); }}
            onNavigate={setActiveView}
          />
        )}
        {activeView === 'patients' && (
          <PatientsView
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />
        )}
        {activeView === 'scheduler' && (
          <SchedulerView
            appointments={appointmentList}
            patients={patients}
            onBook={handleBookAppointment}
            onCancel={handleCancelAppointment}
          />
        )}
        {activeView === 'reminders' && (
          <RemindersView reminders={reminders} />
        )}
      </main>

      <VoiceAssistant
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onCommand={handleVoiceCommand}
        appointments={appointmentList}
        patients={patients}
      />
    </div>
  );
};

export default Index;
