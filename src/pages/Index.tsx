import { useState } from "react";
import { useMediData, DbPatient } from "@/hooks/useMediData";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import PatientsView from "@/components/PatientsView";
import SchedulerView from "@/components/SchedulerView";
import RemindersView from "@/components/RemindersView";
import VoiceAssistant from "@/components/VoiceAssistant";
import { Loader2 } from "lucide-react";

export type ActiveView = 'dashboard' | 'patients' | 'scheduler' | 'reminders';

const Index = () => {
  const { user, signOut } = useAuth();
  const {
    patients, appointments, reminders, profile, loading,
    bookAppointment, cancelAppointment, sendReminder, sendAllReminders,
    fetchPatientDetails, addPatient,
  } = useMediData();

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<DbPatient | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleVoiceCommand = (command: string) => {
    const lower = command.toLowerCase();
    if (lower.includes('dashboard') || lower.includes('home')) setActiveView('dashboard');
    else if (lower.includes('schedule') || lower.includes('appointment')) setActiveView('scheduler');
    else if (lower.includes('reminder')) setActiveView('reminders');
    else if (lower.includes('next patient')) {
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(a => a.appointment_date === today && a.status === 'scheduled');
      if (todayAppts.length > 0) {
        const patient = patients.find(p => p.id === todayAppts[0].patient_id);
        if (patient) { setSelectedPatient(patient); setActiveView('patients'); }
      }
    } else {
      setActiveView('patients');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm">Loading your data...</p>
        </div>
      </div>
    );
  }

  const doctorName = profile?.full_name || user?.email?.split('@')[0] || 'Doctor';
  const doctorInitials = doctorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onVoiceOpen={() => setVoiceOpen(true)}
        doctorName={doctorName}
        doctorInitials={doctorInitials}
        specialty={profile?.specialty || 'General Medicine'}
        onSignOut={signOut}
      />
      
      <main className="flex-1 overflow-auto scrollbar-thin">
        {activeView === 'dashboard' && (
          <DashboardView
            patients={patients}
            appointments={appointments}
            reminders={reminders}
            doctorName={doctorName}
            onViewPatient={(patient) => { setSelectedPatient(patient); setActiveView('patients'); }}
            onNavigate={setActiveView}
          />
        )}
        {activeView === 'patients' && (
          <PatientsView
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
            onAddPatient={addPatient}
            fetchPatientDetails={fetchPatientDetails}
          />
        )}
        {activeView === 'scheduler' && (
          <SchedulerView
            appointments={appointments}
            patients={patients}
            onBook={bookAppointment}
            onCancel={cancelAppointment}
          />
        )}
        {activeView === 'reminders' && (
          <RemindersView
            reminders={reminders}
            onSend={sendReminder}
            onSendAll={sendAllReminders}
          />
        )}
      </main>

      <VoiceAssistant
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onCommand={handleVoiceCommand}
        appointments={appointments}
        patients={patients}
      />
    </div>
  );
};

export default Index;
