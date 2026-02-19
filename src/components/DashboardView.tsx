import { DbPatient, DbAppointment, DbReminder } from "@/hooks/useMediData";
import { ActiveView } from "@/pages/Index";
import { 
  Calendar, Users, Clock, AlertTriangle, TrendingUp,
  Bell, ChevronRight, Activity, ArrowRight, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  patients: DbPatient[];
  appointments: DbAppointment[];
  reminders: DbReminder[];
  doctorName: string;
  onViewPatient: (patient: DbPatient) => void;
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

const riskColors: Record<string, string> = {
  high: 'bg-danger-subtle text-danger',
  medium: 'bg-warning-subtle text-warning',
  low: 'bg-success-subtle text-success',
};

const DashboardView = ({ patients, appointments, reminders, doctorName, onViewPatient, onNavigate }: DashboardViewProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === today && a.status === 'scheduled');
  const urgentAppts = todayAppts.filter(a => a.priority === 'urgent' || a.priority === 'emergency');
  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const highRiskPatients = patients.filter(p => p.risk_level === 'high');
  const firstName = doctorName.split(' ').find(n => n.toLowerCase() !== 'dr.' && n.toLowerCase() !== 'dr') || doctorName;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">{getGreeting()}, Dr. {firstName} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · Here's your daily overview</p>
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
            <p className="text-xs text-muted-foreground">{urgentAppts[0].patient_name} · {urgentAppts[0].appointment_time} · {urgentAppts[0].notes}</p>
          </div>
          <button onClick={() => onNavigate('scheduler')} className="text-xs font-semibold text-warning flex items-center gap-1 hover:underline">
            View <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Empty state for new users */}
      {patients.length === 0 && appointments.length === 0 && (
        <div className="bg-primary-subtle border border-primary/20 rounded-xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Welcome to MediAI! 🎉</p>
            <p className="text-sm text-muted-foreground mt-1">Your dashboard is ready. Start by adding patients and scheduling appointments.</p>
            <div className="flex gap-3 mt-3">
              <button onClick={() => onNavigate('patients')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-semibold">
                <Plus className="w-3 h-3" /> Add Patient
              </button>
              <button onClick={() => onNavigate('scheduler')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary-subtle">
                <Calendar className="w-3 h-3" /> Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Today's Appointments" value={todayAppts.length} sub={`${urgentAppts.length} urgent`} color="bg-primary-subtle text-primary" />
        <StatCard icon={Users} label="Total Patients" value={patients.length} sub={`${highRiskPatients.length} high risk`} color="bg-info-subtle text-info" />
        <StatCard icon={AlertTriangle} label="Urgent Cases" value={urgentAppts.length} sub="Require attention" color="bg-warning-subtle text-warning" />
        <StatCard icon={Bell} label="Pending Reminders" value={pendingReminders.length} sub="To be sent" color="bg-success-subtle text-success" />
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
          {todayAppts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No appointments today</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {todayAppts.slice(0, 5).map(appt => (
                <div key={appt.id} className={cn("px-5 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors", appt.priority === 'urgent' && "border-l-2 border-warning")}>
                  <div className="w-14 text-center flex-shrink-0">
                    <p className="text-sm font-bold text-foreground">{appt.appointment_time.slice(0, 5)}</p>
                    <p className="text-xs text-muted-foreground">{appt.duration}min</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{appt.patient_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{appt.notes || appt.type}</p>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0", typeConfig[appt.type]?.color)}>
                    {typeConfig[appt.type]?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Patient Access */}
        <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Patient Overview</h2>
            </div>
            <button onClick={() => onNavigate('patients')} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              All patients <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {patients.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No patients yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {patients.slice(0, 5).map(patient => (
                <button
                  key={patient.id}
                  onClick={() => onViewPatient(patient)}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{patient.conditions.join(', ') || 'No conditions recorded'}</p>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0", riskColors[patient.risk_level])}>
                    {patient.risk_level}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Predictions */}
      {patients.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2" style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%, 0.06), hsl(174, 72%, 26%, 0.06))' }}>
            <div className="w-7 h-7 rounded-lg gradient-ai flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-foreground">AI Follow-up Predictions</h2>
            <span className="ml-auto text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">AI Powered</span>
          </div>
          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            {patients.filter(p => p.risk_level === 'high').slice(0, 3).map(patient => (
              <div key={patient.id} className="px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => onViewPatient(patient)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{patient.name.split(' ')[0]}</p>
                </div>
                <p className="text-xs text-muted-foreground">{patient.conditions[0] || 'Follow-up needed'}</p>
                <p className="text-sm font-bold mt-1 text-danger">High risk — review soon</p>
              </div>
            ))}
            {patients.filter(p => p.risk_level === 'high').length === 0 && (
              <div className="col-span-3 p-6 text-center text-muted-foreground text-sm">
                <p>No high-risk patients — great work! 🎉</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
