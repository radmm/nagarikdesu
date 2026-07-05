import { GOVERN_DEPARTMENTS } from "../data";
import { Shield, CheckCircle, Clock, Zap, Droplet, AlertCircle, PhoneCall, Mail } from "lucide-react";

export default function Authorities() {
  const getDeptIcon = (iconName: string) => {
    if (iconName === "water_drop") return Droplet;
    if (iconName === "electric_bolt") return Zap;
    if (iconName === "local_police") return PhoneCall;
    return Shield;
  };

  const glowColorsMap = {
    green: "shadow-[0_0_20px_rgba(34,197,94,0.4)] border-green-500/30 text-green-400 bg-green-950/10",
    red: "shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-500/30 text-red-400 bg-red-950/10",
    blue: "shadow-[0_0_20px_rgba(59,130,246,0.4)] border-blue-500/30 text-blue-400 bg-blue-950/10",
    purple: "shadow-[0_0_20px_rgba(168,85,247,0.4)] border-purple-500/30 text-purple-400 bg-purple-950/10",
    yellow: "shadow-[0_0_20px_rgba(234,179,8,0.4)] border-yellow-500/30 text-yellow-400 bg-yellow-950/10"
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none">
          Government Authorities Grid
        </h2>
        <p className="font-sans text-sm text-gray-400 mt-2">
          Secure, direct-to-bureau communication integration layers for Bengaluru municipal utilities.
        </p>
      </div>

      {/* Grid of Authorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GOVERN_DEPARTMENTS.map((dept) => {
          const IconComponent = getDeptIcon(dept.icon);
          const glowStyles = glowColorsMap[dept.glowColor];

          return (
            <div
              key={dept.id}
              className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Soft atmospheric background gradient matching department */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 opacity-10 blur-xl rounded-full" />

              <div className="space-y-4">
                {/* Department Identity Row */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center relative overflow-visible shrink-0 ${glowStyles}`}>
                    <div className={`glow-dot glow-${dept.glowColor} absolute w-14 h-14 rounded-full opacity-60 blur-md`} />
                    <IconComponent className="w-5 h-5 text-white relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-headline-md font-mono text-base font-bold text-white">
                      {dept.name}
                    </h3>
                    <span className="font-mono text-[10px] text-gray-500 tracking-widest block uppercase mt-0.5">
                      {dept.abbreviation} Dispatch Center
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs text-gray-400 leading-relaxed">
                  {dept.description}
                </p>

                {/* Email and Contact channel */}
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-[#000000]/20 px-3 py-2 rounded-xl border border-white/5">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{dept.contactEmail}</span>
                </div>
              </div>

              {/* Department Statistics Section */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 mt-6 text-xs">
                <div>
                  <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">Efficiency</span>
                  <span className="text-white font-mono font-bold block mt-0.5">{dept.stats.efficiency}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">Solved</span>
                  <span className="text-green-400 font-mono font-bold block mt-0.5">{dept.stats.solved}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">Unresolved</span>
                  <span className="text-yellow-500 font-mono font-bold block mt-0.5">{dept.stats.pending}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SLA Integrity Policy Note */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 bg-[#000000]/30 space-y-2">
        <h4 className="font-headline-md font-mono text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          Autonomous Grievance Protocols
        </h4>
        <p className="font-sans text-xs text-gray-400 leading-relaxed">
          NagarikAI relies on Direct API integration channels to bypass manual bureaucracy. Reports exceeding standard 10-day SLAs (Service Level Agreements) trigger auto-generated escalation notifications to City Council ombudsmen.
        </p>
      </div>
    </div>
  );
}
