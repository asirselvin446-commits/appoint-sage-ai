import { useState, useEffect } from "react";
import { Mic, MicOff, X, ChevronRight, Loader2 } from "lucide-react";
import { Patient, Appointment } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface VoiceAssistantProps {
  open: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
  appointments: Appointment[];
  patients: Patient[];
}

const DEMO_COMMANDS = [
  "Show next patient",
  "Open patient records",
  "Go to scheduler",
  "Show today's schedule",
  "Open reminders",
  "Go to dashboard",
];

const AI_RESPONSES: Record<string, string> = {
  "show next patient": "Opening next patient record — Emily Chen, scheduled at 9:00 AM for anxiety management follow-up.",
  "open patient records": "Navigating to patient records. You have 5 active patients.",
  "go to scheduler": "Opening the appointment scheduler. You have 5 appointments today.",
  "show today's schedule": "Today you have 5 appointments: Emily Chen at 9:00 AM, David Thompson at 9:30 AM, Sarah Johnson at 10:30 AM, Robert Martinez at 11:15 AM (urgent), and Maria Rodriguez at 2:00 PM.",
  "open reminders": "Opening the reminders panel. You have 3 pending reminders.",
  "go to dashboard": "Returning to the main dashboard.",
};

const VoiceAssistant = ({ open, onClose, onCommand, appointments, patients }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pulseRings, setPulseRings] = useState(false);

  const todayAppts = appointments.filter(a => a.date === '2026-02-17' && a.status === 'scheduled');

  const handleCommand = (command: string) => {
    setTranscript(command);
    setIsListening(false);
    setIsProcessing(true);
    setPulseRings(false);

    setTimeout(() => {
      const lower = command.toLowerCase();
      const responseKey = Object.keys(AI_RESPONSES).find(k => lower.includes(k));
      const aiResponse = responseKey ? AI_RESPONSES[responseKey] : `Processing command: "${command}". Navigating as requested.`;
      setResponse(aiResponse);
      setIsProcessing(false);
      onCommand(command);
    }, 1200);
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');
    setPulseRings(true);
  };

  const stopListening = () => {
    setIsListening(false);
    setPulseRings(false);
    if (!transcript) setTranscript('');
  };

  useEffect(() => {
    if (!open) {
      setIsListening(false);
      setTranscript('');
      setResponse('');
      setIsProcessing(false);
      setPulseRings(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft-lg overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="gradient-hero px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center gradient-primary">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-display font-bold">Voice Assistant</h2>
              <p className="text-xs text-white/60">AI-Powered Medical Commands</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Microphone Button */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {pulseRings && (
                <>
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-150" />
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping scale-[2.2]" style={{ animationDelay: '0.3s' }} />
                </>
              )}
              <button
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-primary",
                  isListening ? "gradient-primary scale-110" : "gradient-primary hover:scale-105"
                )}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
            </div>

            <div className="text-center">
              {isListening && (
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 bg-primary rounded-full animate-typing" style={{ height: `${12 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                  <span className="text-sm text-primary font-medium ml-2">Listening...</span>
                </div>
              )}
              {isProcessing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing command...</span>
                </div>
              )}
              {!isListening && !isProcessing && !transcript && (
                <p className="text-sm text-muted-foreground">Tap to start speaking</p>
              )}
            </div>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-primary-subtle rounded-xl p-4 border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">You said:</p>
              <p className="text-sm text-foreground font-medium">"{transcript}"</p>
            </div>
          )}

          {/* AI Response */}
          {response && (
            <div className="bg-success-subtle rounded-xl p-4 border border-success/20 animate-slide-in">
              <p className="text-xs font-medium text-success mb-1">AI Response:</p>
              <p className="text-sm text-foreground">{response}</p>
            </div>
          )}

          {/* Quick Commands */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Quick Commands</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_COMMANDS.map(cmd => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left hover:bg-primary-subtle hover:text-primary transition-all duration-200 group"
                  style={{ background: 'hsl(var(--muted))' }}
                >
                  <ChevronRight className="w-3 h-3 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                  <span className="truncate">{cmd}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Context */}
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Today's Context</p>
            <div className="space-y-1">
              <p className="text-xs text-foreground"><span className="font-medium">{todayAppts.length}</span> appointments scheduled</p>
              <p className="text-xs text-foreground">Next: <span className="font-medium text-primary">{todayAppts[0]?.patientName || 'None'}</span> at {todayAppts[0]?.time || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
