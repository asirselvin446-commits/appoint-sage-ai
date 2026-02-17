import { Patient, Appointment, Reminder } from "@/data/mockData";
import { ActiveView } from "@/pages/Index";
import { 
  Calendar, Users, Clock, AlertTriangle, TrendingUp,
  Bell, CheckCircle, ChevronRight, Activity, Star,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  patients: Patient[];
  appointments: Appointment[];
  reminders: Reminder[];
  onViewPatient: (patient: Patient) => void;
  onNavigate: (view: ActiveView) => void;
}

const StatCard = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub: string; color: string }) => (
  <div className="bg-card rounded-xl border border-border p-5 shadow-soft-sm hover:shadow-soft-md transition-all duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-3xl font-display font-bold text-foreground mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const typeConfig: Record<string, { label: string; color: string }> = {
  checkup: { label: 'Checkup', color: 'bg-info-subtle text-info' },
  followup: { label: 'Follow-up', color: 'bg-primary-subtle text-primary' },
  consultation: { label: 'Consultation', color: 'bg-warning-subtle text-warning' },
  emergency: { label: 'Emergency', color: 'bg-danger-subtle text-danger' },
  procedure: { label: 'Procedure', color: 'bg-muted text-muted-foreground' },
};

const DashboardView = ({ patients, appointments, reminders, onViewPatient, onNavigate }: DashboardViewProps) => {
  const today = '2026-02-17';
  const todayAppts = appointments.filter(a => a.date === today && a.status === 'scheduled');
  const urgentAppts = todayAppts.filter(a => a.priority === 'urgent' || a.priority === 'emergency');
  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const highRiskPatients = patients.filter(p => p.riskLevel === 'high');

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Good Morning, Dr. Chen 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Monday, February 17, 2026 · Here's your daily overview</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 shadow-soft-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-foreground">On Duty</span>
        </div>
      </div>

      {/* Urgent Alert */}
      {urgentAppts.length > 0 && (
        <div className="bg-warning-subtle border border-warning/30 rounded-xl p-4 flex items-center gap-3 animate-slide-in">
          <div className="w-9 h-9 rounded-lg bg-warning flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Urgent Appointment Alert</p>
            <p className="text-xs text-muted-foreground">{urgentAppts[0].patientName} · {urgentAppts[0].time} · {urgentAppts[0].notes}</p>
          </div>
          <button onClick={() => onNavigate('scheduler')} className="text-xs font-semibold text-warning flex items-center gap-1 hover:underline">
            View <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Today's Appointments" value={todayAppts.length} sub="2 before noon" color="bg-primary-subtle text-primary" />
        <StatCard icon={Users} label="Total Patients" value={patients.length} sub="2 high risk" color="bg-info-subtle text-info" />
        <StatCard icon={AlertTriangle} label="Urgent Cases" value={urgentAppts.length} sub="Require attention" color="bg-warning-subtle text-warning" />
        <StatCard icon={Bell} label="Pending Reminders" value={pendingReminders.length} sub="To be sent today" color="bg-success-subtle text-success" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Today's Schedule</h2>
            </div>
            <button onClick={() => onNavigate('scheduler')} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              Full view <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {todayAppts.slice(0, 5).map((appt, i) => (
              <div key={appt.id} className={cn("px-5 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors", appt.priority === 'urgent' && "border-l-2 border-warning")}>
                <div className="w-14 text-center flex-shrink-0">
                  <p className="text-sm font-bold text-foreground">{appt.time}</p>
                  <p className="text-xs text-muted-foreground">{appt.duration}min</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{appt.patientName}</p>
                  <p className="text-xs text-muted-foreground truncate">{appt.notes || appt.type}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {appt.priority === 'urgent' && (
                    <span className="text-xs bg-warning-subtle text-warning px-2 py-0.5 rounded-full font-medium">Urgent</span>
                  )}
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", typeConfig[appt.type]?.color)}>
                    {typeConfig[appt.type]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Patient Access */}
        <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Quick Patient Access</h2>
            </div>
            <button onClick={() => onNavigate('patients')} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              All patients <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {patients.map(patient => {
              const riskColors = { high: 'bg-danger-subtle text-danger', medium: 'bg-warning-subtle text-warning', low: 'bg-success-subtle text-success' };
              return (
                <button
                  key={patient.id}
                  onClick={() => onViewPatient(patient)}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{patient.conditions.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", riskColors[patient.riskLevel])}>
                      {patient.riskLevel}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Follow-up Predictions */}
      <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2" style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%, 0.06), hsl(174, 72%, 26%, 0.06))' }}>
          <div className="w-7 h-7 rounded-lg gradient-ai flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-semibold text-foreground">AI Follow-up Predictions</h2>
          <span className="ml-auto text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">AI Powered</span>
        </div>
        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { patient: patients[0], due: '3 months', reason: 'HbA1c monitoring', urgency: 'medium' },
            { patient: patients[1], due: '2 weeks', reason: 'COPD follow-up critical', urgency: 'high' },
            { patient: patients[4], due: '8 weeks', reason: 'CBC recheck needed', urgency: 'low' },
          ].map(({ patient, due, reason, urgency }) => {
            const urgencyColor = { high: 'text-danger', medium: 'text-warning', low: 'text-success' };
            return (
              <div key={patient.id} className="px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => onViewPatient(patient)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{patient.name.split(' ')[0]}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{reason}</p>
                <p className={cn("text-sm font-bold mt-1", urgencyColor[urgency as keyof typeof urgencyColor])}>Return in {due}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
