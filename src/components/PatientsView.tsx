import { useState, useEffect } from "react";
import { DbPatient, DbPrescription, DbVisit } from "@/hooks/useMediData";
import { 
  Search, User, AlertTriangle, Pill, Clock, Brain,
  ChevronDown, ChevronUp, Loader2, Plus, Phone, Mail,
  Droplets, Shield, Activity, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";

interface PatientsViewProps {
  patients: DbPatient[];
  selectedPatient: DbPatient | null;
  onSelectPatient: (patient: DbPatient) => void;
  onAddPatient: (data: Omit<DbPatient, 'id' | 'doctor_id'>) => Promise<any>;
  fetchPatientDetails: (id: string) => Promise<{ prescriptions: DbPrescription[]; visits: DbVisit[] }>;
}

const riskConfig = {
  high: { label: 'High Risk', className: 'text-danger bg-danger-subtle', icon: AlertTriangle },
  medium: { label: 'Medium Risk', className: 'text-warning bg-warning-subtle', icon: Activity },
  low: { label: 'Low Risk', className: 'text-success bg-success-subtle', icon: Shield },
};

const AddPatientModal = ({ onAdd, onClose }: { onAdd: (data: any) => Promise<any>; onClose: () => void }) => {
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', dob: '', phone: '', email: '',
    blood_type: '', allergies: '', conditions: '', risk_level: 'low', patient_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const code = form.patient_code || `P${Date.now().toString().slice(-4)}`;
    const { error } = await onAdd({
      ...form,
      patient_code: code,
      age: parseInt(form.age),
      allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()) : [],
      conditions: form.conditions ? form.conditions.split(',').map(s => s.trim()) : [],
    });
    if (error) { setError(error.message); setLoading(false); }
    else onClose();
  };

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-soft-lg overflow-hidden animate-slide-in max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gradient-primary">
          <h2 className="font-display font-bold text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Patient</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Full Name *</label>
              <input required value={form.name} onChange={e => f('name', e.target.value)} placeholder="John Smith" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Age *</label>
              <input required type="number" value={form.age} onChange={e => f('age', e.target.value)} placeholder="45" min="0" max="150" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Gender *</label>
              <select value={form.gender} onChange={e => f('gender', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Date of Birth *</label>
              <input required type="date" value={form.dob} onChange={e => f('dob', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Blood Type</label>
              <select value={form.blood_type} onChange={e => f('blood_type', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option value="">Unknown</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => <option key={bt}>{bt}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Phone</label>
              <input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+1 555 000 0000" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="patient@email.com" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Conditions (comma-separated)</label>
              <input value={form.conditions} onChange={e => f('conditions', e.target.value)} placeholder="Type 2 Diabetes, Hypertension" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Allergies (comma-separated)</label>
              <input value={form.allergies} onChange={e => f('allergies', e.target.value)} placeholder="Penicillin, Latex" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Risk Level</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(r => (
                  <button key={r} type="button" onClick={() => f('risk_level', r)} className={cn("flex-1 py-2 rounded-lg text-xs font-semibold capitalize border transition-all", form.risk_level === r ? r === 'high' ? 'bg-danger text-white border-danger' : r === 'medium' ? 'bg-warning text-white border-warning' : 'bg-success text-white border-success' : 'border-border text-muted-foreground hover:border-primary/30')}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold disabled:opacity-40">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AISummaryPanel = ({ patient, prescriptions, visits }: { patient: DbPatient; prescriptions: DbPrescription[]; visits: DbVisit[] }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const { user } = useAuth();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const visitHistory = visits.map(v => `${v.visit_date}: ${v.reason} — ${v.diagnosis}. ${v.notes}`).join('\n');
      const rxList = prescriptions.filter(p => p.status === 'active').map(p => `${p.name} ${p.dosage} ${p.frequency}`).join(', ');
      
      const { data, error } = await supabase.functions.invoke('ai-summary', {
        body: {
          patientName: patient.name,
          age: patient.age,
          gender: patient.gender,
          conditions: patient.conditions,
          allergies: patient.allergies,
          bloodType: patient.blood_type,
          riskLevel: patient.risk_level,
          activeMedications: rxList,
          visitHistory,
        }
      });
      if (error) throw error;
      setSummary(data.summary || 'Unable to generate summary.');
    } catch {
      setSummary('AI summary unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border" style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%, 0.08), hsl(174, 72%, 26%, 0.08))' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-ai flex items-center justify-center"><Brain className="w-4 h-4 text-white" /></div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">AI Patient Summary</h3>
            <p className="text-xs text-muted-foreground">NLP-powered analysis</p>
          </div>
        </div>
        {!summary && (
          <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-primary text-white hover:opacity-90 disabled:opacity-60">
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
            {loading ? 'Analyzing...' : 'Generate Summary'}
          </button>
        )}
      </div>
      {summary && (
        <div className="p-5 prose prose-sm max-w-none animate-slide-in">
          <ReactMarkdown components={{ strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>, p: ({ children }) => <p className="text-sm leading-relaxed mb-3 text-foreground">{children}</p> }}>
            {summary}
          </ReactMarkdown>
        </div>
      )}
      {!summary && !loading && (
        <div className="p-5 text-center text-muted-foreground text-sm">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Click Generate to create an AI-powered summary.</p>
        </div>
      )}
      {loading && (
        <div className="p-8 flex flex-col items-center gap-3">
          <div className="flex gap-1">{[0,1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
          <p className="text-sm text-muted-foreground">Analyzing patient history with AI...</p>
        </div>
      )}
    </div>
  );
};

const PatientsView = ({ patients, selectedPatient, onSelectPatient, onAddPatient, fetchPatientDetails }: PatientsViewProps) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showVisits, setShowVisits] = useState(true);
  const [details, setDetails] = useState<{ prescriptions: DbPrescription[]; visits: DbVisit[] } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!selectedPatient) return;
    setLoadingDetails(true);
    fetchPatientDetails(selectedPatient.id).then(d => { setDetails(d); setLoadingDetails(false); });
  }, [selectedPatient?.id]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_code.toLowerCase().includes(search.toLowerCase()) ||
    p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full">
      {/* Patient List */}
      <div className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground">Patient Records</h2>
            <button onClick={() => setShowModal(true)} className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white hover:opacity-90">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2 scrollbar-thin">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <User className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>{patients.length === 0 ? 'No patients yet' : 'No results found'}</p>
            </div>
          )}
          {filtered.map(patient => {
            const risk = riskConfig[patient.risk_level as keyof typeof riskConfig] || riskConfig.low;
            const RiskIcon = risk.icon;
            const isSelected = selectedPatient?.id === patient.id;
            return (
              <button key={patient.id} onClick={() => onSelectPatient(patient)} className={cn("w-full text-left p-4 rounded-xl border transition-all", isSelected ? "border-primary bg-primary-subtle shadow-soft-md" : "border-border bg-card hover:border-primary/30 hover:shadow-soft-sm")}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0", isSelected ? "gradient-primary text-white" : "bg-muted text-muted-foreground")}>
                    {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.patient_code} · {patient.age}y {patient.gender[0]}</p>
                  </div>
                  <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", risk.className)}>
                    <RiskIcon className="w-3 h-3" />
                  </div>
                </div>
                {patient.conditions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {patient.conditions.slice(0, 2).map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c}</span>)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient Detail */}
      <div className="flex-1 overflow-auto p-6 scrollbar-thin">
        {!selectedPatient ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center"><User className="w-10 h-10 text-muted-foreground" /></div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">Select a Patient</h3>
              <p className="text-muted-foreground text-sm">Choose a patient from the list to view their records</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-5 animate-slide-in">
            {/* Header */}
            <div className="bg-card rounded-xl border border-border shadow-soft-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display font-bold text-xl text-foreground">{selectedPatient.name}</h2>
                      <p className="text-muted-foreground text-sm">{selectedPatient.patient_code} · {selectedPatient.age} years old · {selectedPatient.gender}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">DOB: {selectedPatient.dob}</p>
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold", riskConfig[selectedPatient.risk_level as keyof typeof riskConfig]?.className)}>
                      {selectedPatient.risk_level.charAt(0).toUpperCase() + selectedPatient.risk_level.slice(1)} Risk
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    {selectedPatient.phone && <span className="flex items-center gap-1.5 text-muted-foreground"><Phone className="w-3.5 h-3.5" /> {selectedPatient.phone}</span>}
                    {selectedPatient.email && <span className="flex items-center gap-1.5 text-muted-foreground"><Mail className="w-3.5 h-3.5" /> {selectedPatient.email}</span>}
                    {selectedPatient.blood_type && <span className="flex items-center gap-1.5 text-muted-foreground"><Droplets className="w-3.5 h-3.5 text-danger" /> {selectedPatient.blood_type}</span>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.conditions.length ? selectedPatient.conditions.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-info-subtle text-info font-medium">{c}</span>) : <span className="text-xs text-muted-foreground">None recorded</span>}
                  </div>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Allergies</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.allergies.length ? selectedPatient.allergies.map(a => <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-danger-subtle text-danger font-medium">{a}</span>) : <span className="text-xs text-muted-foreground">No known allergies</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            {loadingDetails ? (
              <div className="bg-card rounded-xl border border-border p-8 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : (
              <AISummaryPanel patient={selectedPatient} prescriptions={details?.prescriptions || []} visits={details?.visits || []} />
            )}

            {/* Prescriptions */}
            {details?.prescriptions && details.prescriptions.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Pill className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Prescriptions</h3>
                  <span className="ml-auto text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">{details.prescriptions.filter(p => p.status === 'active').length} active</span>
                </div>
                <div className="divide-y divide-border">
                  {details.prescriptions.map(rx => (
                    <div key={rx.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center"><Pill className="w-4 h-4 text-primary" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{rx.name} <span className="font-normal text-muted-foreground">{rx.dosage}</span></p>
                        <p className="text-xs text-muted-foreground">{rx.frequency}</p>
                      </div>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", rx.status === 'active' ? 'bg-success-subtle text-success' : 'bg-muted text-muted-foreground')}>{rx.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visit History */}
            {details?.visits && details.visits.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
                <button onClick={() => setShowVisits(!showVisits)} className="w-full px-5 py-4 border-b border-border flex items-center gap-2 hover:bg-muted/50 transition-colors">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Visit History</h3>
                  <span className="ml-auto flex items-center gap-2">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{details.visits.length} visits</span>
                    {showVisits ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </span>
                </button>
                {showVisits && (
                  <div className="divide-y divide-border">
                    {details.visits.map(visit => (
                      <div key={visit.id} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{visit.reason}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{visit.visit_date}</p>
                          </div>
                          {visit.diagnosis && <span className="text-xs px-2 py-0.5 rounded-full bg-info-subtle text-info font-medium flex-shrink-0">{visit.diagnosis.split(' ').slice(0, 3).join(' ')}</span>}
                        </div>
                        {visit.notes && <p className="text-xs text-muted-foreground leading-relaxed">{visit.notes}</p>}
                        {visit.follow_up && <p className="text-xs text-primary font-medium mt-2">↩ Follow-up in {visit.follow_up}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {details?.visits?.length === 0 && details?.prescriptions?.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No visit history or prescriptions yet</p>
              </div>
            )}
          </div>
        )}
      </div>
      {showModal && <AddPatientModal onAdd={onAddPatient} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PatientsView;
