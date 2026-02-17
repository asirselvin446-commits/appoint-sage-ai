import { useState } from "react";
import { Patient, aiSummaries } from "@/data/mockData";
import { 
  Search, User, AlertTriangle, Pill, Clock, FileText, 
  ChevronRight, Activity, Shield, Brain, Calendar,
  Phone, Mail, Droplets, ChevronDown, ChevronUp, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface PatientsViewProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
}

const riskConfig = {
  high: { label: 'High Risk', className: 'text-danger bg-danger-subtle', icon: AlertTriangle },
  medium: { label: 'Medium Risk', className: 'text-warning bg-warning-subtle', icon: Activity },
  low: { label: 'Low Risk', className: 'text-success bg-success-subtle', icon: Shield },
};

const PatientCard = ({ patient, isSelected, onClick }: { patient: Patient; isSelected: boolean; onClick: () => void }) => {
  const risk = riskConfig[patient.riskLevel];
  const RiskIcon = risk.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200 group",
        isSelected
          ? "border-primary bg-primary-subtle shadow-soft-md"
          : "border-border bg-card hover:border-primary/30 hover:shadow-soft-sm"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0", isSelected ? "gradient-primary text-white" : "bg-muted text-muted-foreground")}>
          {patient.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{patient.name}</p>
          <p className="text-xs text-muted-foreground">{patient.id} · {patient.age}y {patient.gender[0]}</p>
        </div>
        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", risk.className)}>
          <RiskIcon className="w-3 h-3" />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {patient.conditions.slice(0, 2).map(c => (
          <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c}</span>
        ))}
      </div>
    </button>
  );
};

const AISummaryPanel = ({ patient }: { patient: Patient }) => {
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const summary = aiSummaries[patient.id];

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setShown(true); }, 1800);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border" style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%, 0.08), hsl(174, 72%, 26%, 0.08))' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-ai flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">AI Patient Summary</h3>
            <p className="text-xs text-muted-foreground">NLP-powered analysis</p>
          </div>
        </div>
        {!shown && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-primary text-white transition-all hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
            {loading ? 'Analyzing...' : 'Generate Summary'}
          </button>
        )}
      </div>
      {shown && summary && (
        <div className="p-5 prose prose-sm max-w-none text-foreground animate-slide-in">
          <ReactMarkdown
            components={{
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              p: ({ children }) => <p className="text-sm leading-relaxed mb-3 text-foreground">{children}</p>,
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      )}
      {!shown && !loading && (
        <div className="p-5 text-center text-muted-foreground text-sm">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Click Generate to create an AI-powered summary of this patient's history.</p>
        </div>
      )}
      {loading && (
        <div className="p-8 flex flex-col items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Analyzing patient history with NLP...</p>
        </div>
      )}
    </div>
  );
};

const PatientsView = ({ patients, selectedPatient, onSelectPatient }: PatientsViewProps) => {
  const [search, setSearch] = useState('');
  const [showVisits, setShowVisits] = useState(true);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  const patient = selectedPatient;

  return (
    <div className="flex h-full">
      {/* Patient List */}
      <div className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-bold text-foreground mb-3">Patient Records</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2 scrollbar-thin">
          {filtered.map(p => (
            <PatientCard
              key={p.id}
              patient={p}
              isSelected={patient?.id === p.id}
              onClick={() => onSelectPatient(p)}
            />
          ))}
        </div>
      </div>

      {/* Patient Detail */}
      <div className="flex-1 overflow-auto p-6 scrollbar-thin">
        {!patient ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
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
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display font-bold text-xl text-foreground">{patient.name}</h2>
                      <p className="text-muted-foreground text-sm">{patient.id} · {patient.age} years old · {patient.gender}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">DOB: {patient.dob}</p>
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold", riskConfig[patient.riskLevel].className)}>
                      {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)} Risk
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Phone className="w-3.5 h-3.5" /> {patient.phone}</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Mail className="w-3.5 h-3.5" /> {patient.email}</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Droplets className="w-3.5 h-3.5 text-danger" /> {patient.bloodType}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.conditions.map(c => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-info-subtle text-info font-medium">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Allergies</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.length ? patient.allergies.map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-danger-subtle text-danger font-medium">{a}</span>
                    )) : <span className="text-xs text-muted-foreground">No known allergies</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <AISummaryPanel patient={patient} />

            {/* Prescriptions */}
            <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Active Prescriptions</h3>
                <span className="ml-auto text-xs bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">
                  {patient.prescriptions.filter(p => p.status === 'active').length} active
                </span>
              </div>
              <div className="divide-y divide-border">
                {patient.prescriptions.map(rx => (
                  <div key={rx.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center">
                      <Pill className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{rx.name} <span className="font-normal text-muted-foreground">{rx.dosage}</span></p>
                      <p className="text-xs text-muted-foreground">{rx.frequency}</p>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", rx.status === 'active' ? 'bg-success-subtle text-success' : 'bg-muted text-muted-foreground')}>
                      {rx.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visit History */}
            <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
              <button
                onClick={() => setShowVisits(!showVisits)}
                className="w-full px-5 py-4 border-b border-border flex items-center gap-2 hover:bg-muted/50 transition-colors"
              >
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Visit History</h3>
                <span className="ml-auto flex items-center gap-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{patient.visits.length} visits</span>
                  {showVisits ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </span>
              </button>
              {showVisits && (
                <div className="divide-y divide-border">
                  {patient.visits.map(visit => (
                    <div key={visit.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{visit.reason}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{visit.date} · {visit.doctor}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-info-subtle text-info font-medium flex-shrink-0">{visit.diagnosis.split(' ').slice(0, 3).join(' ')}...</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{visit.notes}</p>
                      {visit.followUp && (
                        <p className="text-xs text-primary font-medium mt-2">↩ Follow-up in {visit.followUp}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsView;
