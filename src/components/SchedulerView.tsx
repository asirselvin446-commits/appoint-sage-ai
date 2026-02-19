import { useState } from "react";
import { DbPatient, DbAppointment } from "@/hooks/useMediData";
import { Calendar, Plus, X, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SchedulerViewProps {
  appointments: DbAppointment[];
  patients: DbPatient[];
  onBook: (data: Omit<DbAppointment, 'id' | 'doctor_id'>) => Promise<any>;
  onCancel: (id: string) => void;
}

const AVAILABLE_TIMES = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'
];

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  checkup: { label: 'Checkup', color: 'text-info', bg: 'bg-info-subtle border-info/20' },
  followup: { label: 'Follow-up', color: 'text-primary', bg: 'bg-primary-subtle border-primary/20' },
  consultation: { label: 'Consultation', color: 'text-warning', bg: 'bg-warning-subtle border-warning/20' },
  emergency: { label: 'Emergency', color: 'text-danger', bg: 'bg-danger-subtle border-danger/20' },
  procedure: { label: 'Procedure', color: 'text-muted-foreground', bg: 'bg-muted border-border' },
};

const getWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
};

const BookingModal = ({ patients, existingAppts, onBook, onClose }: {
  patients: DbPatient[];
  existingAppts: DbAppointment[];
  onBook: (d: Omit<DbAppointment, 'id' | 'doctor_id'>) => Promise<any>;
  onClose: () => void;
}) => {
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [type, setType] = useState<DbAppointment['type']>('checkup');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<DbAppointment['priority']>('normal');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const bookedSlots = existingAppts.filter(a => a.appointment_date === date && a.status === 'scheduled').map(a => a.appointment_time.slice(0, 5));
  const freeSlots = AVAILABLE_TIMES.filter(s => !bookedSlots.includes(s));
  const isConflict = time && bookedSlots.includes(time);

  const handleSubmit = async () => {
    if (!patientId || !date || !time || isConflict) return;
    const patient = patients.find(p => p.id === patientId)!;
    setLoading(true);
    await onBook({ patient_id: patientId, patient_name: patient.name, appointment_date: date, appointment_time: time + ':00', duration: 30, type, status: 'scheduled', notes, priority });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-soft-lg overflow-hidden animate-slide-in">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between gradient-primary">
          <div className="flex items-center gap-2"><Plus className="w-5 h-5 text-white" /><h2 className="font-display font-bold text-white">Book Appointment</h2></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"><X className="w-4 h-4 text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Patient *</label>
            <select value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">Select patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.patient_code})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Date *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time Slot *</label>
              <button onClick={() => setSuggestions(freeSlots.slice(0, 3))} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"><Zap className="w-3 h-3" /> AI Suggest</button>
            </div>
            {suggestions.length > 0 && (
              <div className="flex gap-2 mb-2">
                {suggestions.map(s => <button key={s} onClick={() => setTime(s)} className="text-xs px-3 py-1.5 rounded-lg bg-primary-subtle text-primary font-medium border border-primary/20 hover:bg-primary hover:text-white transition-all">⚡ {s}</button>)}
              </div>
            )}
            <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-auto scrollbar-thin">
              {AVAILABLE_TIMES.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = time === slot;
                return (
                  <button key={slot} onClick={() => !isBooked && setTime(slot)} disabled={isBooked} className={cn("py-2 rounded-lg text-xs font-medium transition-all border", isBooked ? "bg-muted text-muted-foreground opacity-40 cursor-not-allowed border-border" : isSelected ? "gradient-primary text-white border-primary shadow-primary" : "bg-background border-border hover:border-primary/40 hover:bg-primary-subtle text-foreground")}>
                    {slot}
                  </button>
                );
              })}
            </div>
            {isConflict && <p className="text-xs text-danger flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" /> Conflict detected!</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Priority</label>
            <div className="flex gap-2">
              {(['normal', 'urgent', 'emergency'] as const).map(p => (
                <button key={p} onClick={() => setPriority(p)} className={cn("flex-1 py-2 rounded-lg text-xs font-semibold border capitalize transition-all", priority === p ? p === 'emergency' ? 'bg-danger text-white border-danger' : p === 'urgent' ? 'bg-warning text-white border-warning' : 'gradient-primary text-white border-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/30')}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Appointment notes..." className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
            <button onClick={handleSubmit} disabled={!patientId || !date || !time || !!isConflict || loading} className="flex-1 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold disabled:opacity-40 shadow-primary">
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SchedulerView = ({ appointments, patients, onBook, onCancel }: SchedulerViewProps) => {
  const weekDates = getWeekDates();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const dateAppts = appointments.filter(a => a.appointment_date === selectedDate && a.status !== 'cancelled');

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Appointment Scheduler</h1>
          <p className="text-muted-foreground text-sm">Smart scheduling with conflict detection</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-primary hover:opacity-90">
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* Week View */}
      <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> This Week</h2>
        </div>
        <div className="grid grid-cols-5 divide-x divide-border">
          {weekDates.map((date, i) => {
            const count = appointments.filter(a => a.appointment_date === date && a.status === 'scheduled').length;
            const isSelected = date === selectedDate;
            const isToday = date === new Date().toISOString().split('T')[0];
            return (
              <button key={date} onClick={() => setSelectedDate(date)} className={cn("p-4 text-center transition-all hover:bg-muted/40", isSelected && "bg-primary-subtle")}>
                <p className={cn("text-xs font-medium uppercase tracking-wide mb-1", isSelected ? 'text-primary' : 'text-muted-foreground')}>{dayLabels[i]}</p>
                <div className={cn("w-9 h-9 rounded-xl mx-auto flex items-center justify-center text-sm font-bold mb-2", isSelected ? 'gradient-primary text-white shadow-primary' : isToday ? 'border-2 border-primary text-primary' : 'text-foreground')}>
                  {date.split('-')[2]}
                </div>
                <div className={cn("text-xs font-medium", count > 0 ? 'text-primary' : 'text-muted-foreground')}>
                  {count > 0 ? `${count} appt${count > 1 ? 's' : ''}` : 'Free'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Appointments */}
      <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">
            {selectedDate === new Date().toISOString().split('T')[0] ? "Today's" : selectedDate} Appointments
            <span className="ml-2 text-sm text-muted-foreground font-normal">({dateAppts.length} scheduled)</span>
          </h2>
        </div>
        {dateAppts.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No appointments scheduled</p>
            <p className="text-sm">Click "Book Appointment" to add one</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {dateAppts.sort((a, b) => a.appointment_time.localeCompare(b.appointment_time)).map(appt => {
              const cfg = typeConfig[appt.type];
              return (
                <div key={appt.id} className={cn("px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors", appt.priority === 'urgent' && "border-l-2 border-warning", appt.priority === 'emergency' && "border-l-2 border-danger")}>
                  <div className="w-16 text-center flex-shrink-0">
                    <p className="text-base font-bold text-foreground">{appt.appointment_time.slice(0, 5)}</p>
                    <p className="text-xs text-muted-foreground">{appt.duration}min</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{appt.patient_name}</p>
                      {appt.priority !== 'normal' && (
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", appt.priority === 'urgent' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger')}>{appt.priority}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{appt.notes || 'No notes'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium border", cfg?.bg, cfg?.color)}>{cfg?.label}</span>
                    <button onClick={() => onCancel(appt.id)} className="p-1.5 rounded-lg hover:bg-danger-subtle text-muted-foreground hover:text-danger transition-all" title="Cancel">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showModal && <BookingModal patients={patients} existingAppts={appointments} onBook={onBook} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SchedulerView;
