import { useState, useEffect } from "react";
import { Mic, MicOff, X, ChevronRight, Loader2 } from "lucide-react";
import { DbPatient, DbAppointment } from "@/hooks/useMediData";
import { cn } from "@/lib/utils";

interface VoiceAssistantProps {
  open: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
  appointments: DbAppointment[];
  patients: DbPatient[];
}

const DEMO_COMMANDS = [
  "Show next patient",
  "Open patient records",
  "Go to scheduler",
  "Show today's schedule",
  "Open reminders",
  "Go to dashboard",
];

const VoiceAssistant = ({ open, onClose, onCommand, appointments, patients }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pulseRings, setPulseRings] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === today && a.status === 'scheduled');

  const handleCommand = (command: string) => {
    setTranscript(command);
    setIsListening(false);
    setIsProcessing(true);
    setPulseRings(false);

    setTimeout(() => {
      const lower = command.toLowerCase();
      let aiResponse = `Processing: "${command}"`;
      if (lower.includes('next patient') && todayAppts.length > 0) {
        aiResponse = `Opening next patient: ${todayAppts[0].patient_name} at ${todayAppts[0].appointment_time.slice(0, 5)}.`;
      } else if (lower.includes('dashboard') || lower.includes('home')) {
        aiResponse = 'Navigating to dashboard.';
      } else if (lower.includes('schedule') || lower.includes('appointment')) {
        aiResponse = `Opening scheduler. You have ${todayAppts.length} appointments today.`;
      } else if (lower.includes('reminder')) {
        aiResponse = 'Opening reminders panel.';
      } else if (lower.includes('patient')) {
        aiResponse = `Opening patient records. ${patients.length} patients on file.`;
      } else if (lower.includes("today")) {
        aiResponse = todayAppts.length > 0 ? `Today: ${todayAppts.length} appointments. Next: ${todayAppts[0].patient_name} at ${todayAppts[0].appointment_time.slice(0, 5)}.` : 'No appointments today.';
      }
      setResponse(aiResponse);
      setIsProcessing(false);
      onCommand(command);
    }, 1200);
  };

  useEffect(() => {
    if (!open) { setIsListening(false); setTranscript(''); setResponse(''); setIsProcessing(false); setPulseRings(false); }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft-lg overflow-hidden animate-slide-in">
        <div className="gradient-hero px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center gradient-primary"><Mic className="w-5 h-5 text-white" /></div>
            <div>
              <h2 className="text-white font-display font-bold">Voice Assistant</h2>
              <p className="text-xs text-white/60">AI-Powered Medical Commands</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><X className="w-4 h-4 text-white" /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {pulseRings && (<><div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-150" /><div className="absolute inset-0 rounded-full bg-primary/10 animate-ping scale-[2.2]" style={{ animationDelay: '0.3s' }} /></>)}
              <button onClick={() => { setIsListening(!isListening); setPulseRings(!isListening); }} className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-primary gradient-primary hover:scale-105">
                {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
              </button>
            </div>
            {isListening && (
              <div className="flex items-center gap-1.5">
                {[0,1,2,3].map(i => <div key={i} className="w-1.5 bg-primary rounded-full animate-typing" style={{ height: `${12 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />)}
                <span className="text-sm text-primary font-medium ml-2">Listening...</span>
              </div>
            )}
            {isProcessing && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Processing...</span></div>}
            {!isListening && !isProcessing && !transcript && <p className="text-sm text-muted-foreground">Tap to speak or use quick commands</p>}
          </div>

          {transcript && (
            <div className="bg-primary-subtle rounded-xl p-3 border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">You said:</p>
              <p className="text-sm text-foreground font-medium">"{transcript}"</p>
            </div>
          )}
          {response && (
            <div className="bg-success-subtle rounded-xl p-3 border border-success/20 animate-slide-in">
              <p className="text-xs font-medium text-success mb-1">AI Response:</p>
              <p className="text-sm text-foreground">{response}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Quick Commands</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_COMMANDS.map(cmd => (
                <button key={cmd} onClick={() => handleCommand(cmd)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left hover:bg-primary-subtle hover:text-primary transition-all group bg-muted">
                  <ChevronRight className="w-3 h-3 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                  <span className="truncate">{cmd}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Today's Context</p>
            <p className="text-xs text-foreground"><span className="font-medium">{todayAppts.length}</span> appointments today</p>
            {todayAppts[0] && <p className="text-xs text-foreground mt-0.5">Next: <span className="font-medium text-primary">{todayAppts[0].patient_name}</span> at {todayAppts[0].appointment_time.slice(0, 5)}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
