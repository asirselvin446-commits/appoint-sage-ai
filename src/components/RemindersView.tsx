import { DbReminder } from "@/hooks/useMediData";
import { Bell, Mail, MessageSquare, CheckCircle, Clock, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface RemindersViewProps {
  reminders: DbReminder[];
  onSend: (id: string) => void;
  onSendAll: () => void;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-warning bg-warning-subtle' },
  sent: { label: 'Sent', icon: CheckCircle, color: 'text-success bg-success-subtle' },
  failed: { label: 'Failed', icon: AlertCircle, color: 'text-danger bg-danger-subtle' },
};

const RemindersView = ({ reminders, onSend, onSendAll }: RemindersViewProps) => {
  const pendingCount = reminders.filter(r => r.status === 'pending').length;
  const sentCount = reminders.filter(r => r.status === 'sent').length;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Reminder System</h1>
          <p className="text-muted-foreground text-sm">Automated SMS & Email notifications for patients</p>
        </div>
        {pendingCount > 0 && (
          <button onClick={onSendAll} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-primary hover:opacity-90">
            <Send className="w-4 h-4" /> Send All ({pendingCount})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: reminders.length, icon: Bell, color: 'bg-info-subtle text-info' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'bg-warning-subtle text-warning' },
          { label: 'Sent', value: sentCount, icon: CheckCircle, color: 'bg-success-subtle text-success' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4 shadow-soft-sm flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", color)}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label} reminders</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reminders List */}
      <div className="bg-card rounded-xl border border-border shadow-soft-sm overflow-hidden">
        {reminders.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No reminders yet</p>
            <p className="text-sm">Reminders are auto-created when you book appointments</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reminders.map(reminder => {
              const status = statusConfig[reminder.status as keyof typeof statusConfig] || statusConfig.pending;
              const StatusIcon = status.icon;
              const isEmail = reminder.type === 'email';
              return (
                <div key={reminder.id} className="px-5 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", isEmail ? 'bg-info-subtle text-info' : 'bg-primary-subtle text-primary')}>
                    {isEmail ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{reminder.patient_name}</p>
                      <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium", status.color)}>
                        <StatusIcon className="w-3 h-3" />{status.label}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase">{reminder.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reminder.message}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(reminder.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                  {reminder.status === 'pending' && (
                    <button onClick={() => onSend(reminder.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-white text-xs font-semibold hover:opacity-90 flex-shrink-0 shadow-primary">
                      <Send className="w-3 h-3" /> Send
                    </button>
                  )}
                  {reminder.status === 'sent' && (
                    <div className="flex items-center gap-1 text-xs text-success font-medium flex-shrink-0">
                      <CheckCircle className="w-4 h-4" /> Delivered
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-primary-subtle rounded-xl border border-primary/20 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0"><Bell className="w-4 h-4 text-white" /></div>
        <div>
          <p className="text-sm font-semibold text-foreground">Automated Reminders</p>
          <p className="text-xs text-muted-foreground mt-0.5">Reminders are auto-created 24 hours before each appointment when you book. Click "Send" to mark them as delivered to the patient.</p>
        </div>
      </div>
    </div>
  );
};

export default RemindersView;
