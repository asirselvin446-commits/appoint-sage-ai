import { 
  LayoutDashboard, Users, Calendar, Bell, Mic, 
  Activity, ChevronRight, Stethoscope
} from "lucide-react";
import { ActiveView } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onVoiceOpen: () => void;
}

const navItems = [
  { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients' as ActiveView, label: 'Patients', icon: Users },
  { id: 'scheduler' as ActiveView, label: 'Scheduler', icon: Calendar },
  { id: 'reminders' as ActiveView, label: 'Reminders', icon: Bell },
];

const Sidebar = ({ activeView, onNavigate, onVoiceOpen }: SidebarProps) => {
  return (
    <aside className="w-64 h-full flex flex-col" style={{ background: 'hsl(var(--sidebar-background))' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary shadow-primary">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-lg leading-tight">MediAI</h1>
            <p className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)' }}>Assistant</p>
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">MC</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Dr. Michael Chen</p>
            <p className="text-xs truncate" style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)' }}>General Medicine</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-success flex-shrink-0 animate-pulse-glow" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider mb-3 px-3" style={{ color: 'hsl(var(--sidebar-foreground) / 0.4)' }}>
          Navigation
        </p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              activeView === id
                ? "text-white shadow-soft-sm"
                : "hover:bg-sidebar-accent"
            )}
            style={activeView === id ? { background: 'hsl(var(--sidebar-primary))' } : { color: 'hsl(var(--sidebar-foreground) / 0.7)' }}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {activeView === id && <ChevronRight className="w-3 h-3 opacity-60" />}
          </button>
        ))}
      </nav>

      {/* Voice Assistant Button */}
      <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <button
          onClick={onVoiceOpen}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
          style={{ background: 'hsl(var(--sidebar-primary))' }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-semibold text-xs">Voice Assistant</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Say a command</p>
          </div>
          <Stethoscope className="w-4 h-4 text-white opacity-60" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
