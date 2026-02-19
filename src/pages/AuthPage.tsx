import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Eye, EyeOff, Loader2, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, specialty },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setMessage("Account created! Please check your email to verify your account before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    "General Medicine", "Cardiology", "Neurology", "Pediatrics",
    "Orthopedics", "Dermatology", "Psychiatry", "Emergency Medicine",
    "Internal Medicine", "Family Medicine"
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(var(--background))' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(174 72% 50%), transparent 60%), radial-gradient(circle at 80% 20%, hsl(262 83% 70%), transparent 50%)' }} />
        
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-primary shadow-primary">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-2xl leading-tight">MediAI</h1>
            <p className="text-white/60 text-xs">Assistant</p>
          </div>
        </div>

        {/* Features */}
        <div className="relative space-y-6">
          <div>
            <h2 className="text-white font-display font-bold text-4xl leading-tight mb-4">
              AI-Powered<br />Medical Assistant
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Streamline your practice with intelligent scheduling, instant patient records, and AI-generated summaries.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: "🧠", title: "AI Patient Summaries", desc: "NLP-powered visit history analysis" },
              { icon: "📅", title: "Smart Scheduling", desc: "Conflict detection & slot suggestions" },
              { icon: "🔔", title: "Automated Reminders", desc: "SMS & email patient notifications" },
              { icon: "🎙️", title: "Voice Commands", desc: "Hands-free patient record access" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-white/60 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">© 2026 MediAI. Built for healthcare professionals.</p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">MediAI</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display font-bold text-3xl text-foreground">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {mode === "login" ? "Sign in to your MediAI dashboard" : "Join MediAI as a healthcare professional"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex p-1 rounded-xl bg-muted mb-6">
            {(["login", "signup"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setMessage(""); }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
                  mode === m ? "bg-card text-foreground shadow-soft-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Dr. Jane Smith"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="doctor@hospital.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Specialty</label>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-danger-subtle border border-danger/20 text-danger text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-xl bg-success-subtle border border-success/20 text-success text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-primary hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {mode === "login" ? "Signing in..." : "Creating account..."}</>
              ) : (
                <><Stethoscope className="w-4 h-4" /> {mode === "login" ? "Sign In to Dashboard" : "Create Doctor Account"}</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "New to MediAI? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }} className="text-primary font-semibold hover:underline">
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
