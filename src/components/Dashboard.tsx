import { CivicReport, IssueCategory, ReportStatus } from "../types";
import { Plus, Users, ShieldCheck, Flame, ChevronRight, Scale, AlertTriangle } from "lucide-react";
import { GOVERN_DEPARTMENTS } from "../data";

interface DashboardProps {
  reports: CivicReport[];
  onReportIssue: () => void;
  onSelectReport: (report: CivicReport) => void;
}

export default function Dashboard({ reports, onReportIssue, onSelectReport }: DashboardProps) {
  // Compute some stats
  const total = reports.length;
  const resolved = reports.filter((r) => r.status === ReportStatus.RESOLVED).length;
  const pending = reports.filter((r) => r.status !== ReportStatus.RESOLVED).length;
  const communityPressureCount = reports.filter((r) => r.communityScore > 800).length;

  // Let's grab the most active report (highest communityScore)
  const activeCase = reports.reduce((prev, current) => 
    (prev.communityScore > current.communityScore) ? prev : current
  , reports[0]);

  // Unique glow mapping for visual aesthetics
  const glowColorsMap = {
    green: "shadow-[0_0_20px_rgba(34,197,94,0.4)] border-green-500/40 bg-green-950/20",
    red: "shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-500/40 bg-red-950/20",
    blue: "shadow-[0_0_20px_rgba(59,130,246,0.4)] border-blue-500/40 bg-blue-950/20",
    purple: "shadow-[0_0_20px_rgba(168,85,247,0.4)] border-purple-500/40 bg-purple-950/20",
    yellow: "shadow-[0_0_20_rgba(234,179,8,0.4)] border-yellow-500/40 bg-yellow-950/20"
  };

  const getGlowColor = (cat: IssueCategory): keyof typeof glowColorsMap => {
    if (cat === IssueCategory.ELECTRICITY) return "purple";
    if (cat === IssueCategory.WATER) return "blue";
    if (cat === IssueCategory.SAFETY) return "red";
    if (cat === IssueCategory.ROADS) return "yellow";
    return "green";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Unit */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h2 className="font-headline-lg font-mono text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
            Welcome to NagarikAI
          </h2>
          <p className="font-sans text-sm text-gray-400 mt-2">
            Your voice, written in the language of the law. Secure civic coordination dashboard.
          </p>
        </div>
        <button
          onClick={onReportIssue}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-gray-200 active:scale-95 transition-all duration-300 font-sans font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.25)] text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Metrics Row (Bento Style Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
          <span className="font-sans text-[11px] font-medium text-gray-400 uppercase tracking-widest">Total Reports</span>
          <div className="flex justify-between items-end">
            <span className="font-headline-lg font-mono text-3xl font-bold text-white">{total}</span>
            <span className="p-1.5 rounded-full bg-white/5 text-gray-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
          <span className="font-sans text-[11px] font-medium text-gray-400 uppercase tracking-widest">Resolved Cases</span>
          <div className="flex justify-between items-end">
            <span className="font-headline-lg font-mono text-3xl font-bold text-green-400">{resolved}</span>
            <span className="p-1.5 rounded-full bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
          <span className="font-sans text-[11px] font-medium text-gray-400 uppercase tracking-widest">Pending Dispatches</span>
          <div className="flex justify-between items-end">
            <span className="font-headline-lg font-mono text-3xl font-bold text-yellow-500">{pending}</span>
            <span className="p-1.5 rounded-full bg-yellow-500/10 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
              <Scale className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
          <span className="font-sans text-[11px] font-medium text-gray-400 uppercase tracking-widest">Community Pressure</span>
          <div className="flex justify-between items-end">
            <span className="font-headline-lg font-mono text-3xl font-bold text-purple-400">{communityPressureCount}</span>
            <span className="p-1.5 rounded-full bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <Flame className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Primary Overview Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Report Glowing Avatars group + Overlapping Featured active case (9 columns on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-headline-md font-mono text-lg font-semibold text-white">Active Case Oversight</h3>
            <span className="font-sans text-xs text-gray-400 uppercase tracking-widest">Priority Index</span>
          </div>

          {/* Active Case Card (Overlapping Style) */}
          {activeCase && (
            <div 
              onClick={() => onSelectReport(activeCase)}
              className="glass-card rounded-2xl p-6 hover:border-purple-500/40 cursor-pointer group transition-all duration-300 relative overflow-hidden"
            >
              {/* Soft purple gradient blur underneath */}
              <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center relative overflow-visible ${glowColorsMap[getGlowColor(activeCase.category)]}`}>
                    <div className={`glow-dot glow-${getGlowColor(activeCase.category)} absolute w-12 h-12 rounded-full opacity-60 blur-md`} />
                    <Scale className="w-4 h-4 text-white relative z-10" />
                  </div>
                  <div>
                    <h4 className="font-headline-md font-mono text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                      {activeCase.title}
                    </h4>
                    <p className="font-sans text-xs text-gray-400">
                      {activeCase.location.display_name} • {activeCase.location.zone}
                    </p>
                  </div>
                </div>
                <span className="font-sans text-[10px] font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-widest">
                  {activeCase.urgency}
                </span>
              </div>

              <p className="font-sans text-sm text-gray-300 line-clamp-3 mb-6">
                {activeCase.description}
              </p>

              {/* Stat rows & Anchor values inside case card */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
                <div>
                  <span className="text-gray-400 font-sans block mb-0.5">Assigned To</span>
                  <span className="text-white font-sans font-bold">
                    {GOVERN_DEPARTMENTS.find((d) => d.id === activeCase.department)?.abbreviation || "Admin Oversight"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-sans block mb-0.5">Status</span>
                  <span className="text-green-400 font-sans font-bold animate-pulse flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {activeCase.status}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="text-gray-400 font-sans block mb-0.5">Signatures Required</span>
                  <span className="text-white font-mono font-bold">
                    {activeCase.communityScore} / 1500
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Citizen Avatar Rows */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h4 className="font-headline-md font-mono text-sm font-bold text-white">Verified Local Advocates</h4>
            <div className="flex flex-wrap items-center gap-4">
              {reports.slice(0, 5).map((rep, idx) => {
                const colors = ["bg-red-500", "bg-purple-500", "bg-blue-500", "bg-yellow-500", "bg-green-500"];
                const glowNames = ["red", "purple", "blue", "yellow", "green"];
                const glow = [
                  "shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500/40",
                  "shadow-[0_0_15px_rgba(168,85,247,0.5)] border-purple-500/40",
                  "shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-500/40",
                  "shadow-[0_0_15px_rgba(234,179,8,0.5)] border-yellow-500/40",
                  "shadow-[0_0_15px_rgba(34,197,94,0.5)] border-green-500/40",
                ];
                const colIdx = idx % colors.length;

                return (
                  <div key={rep.id} className="flex items-center gap-2 group">
                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs text-white font-mono font-bold relative overflow-visible ${colors[colIdx]} ${glow[colIdx]}`}>
                      <div className={`glow-dot glow-${glowNames[colIdx]} absolute w-10 h-10 rounded-full opacity-50 blur-md`} />
                      <span className="relative z-10">{rep.reporterName.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-sans font-bold text-white">{rep.reporterName}</p>
                      <p className="text-[10px] font-sans text-gray-400">ID: {rep.reporterId}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-center w-9 h-9 rounded-full border border-dashed border-white/20 text-xs text-gray-400 bg-white/5 font-mono">
                +{reports.length}
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed Sidebar list (4 columns on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-headline-md font-mono text-sm font-semibold text-white">Live Intake Feed</h3>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {reports.slice().reverse().map((rep) => {
              const glowCol = getGlowColor(rep.category);
              const colorDot = {
                green: "bg-green-400",
                red: "bg-red-400",
                blue: "bg-blue-400",
                purple: "bg-purple-400",
                yellow: "bg-yellow-400"
              }[glowCol];

              return (
                <div
                  key={rep.id}
                  onClick={() => onSelectReport(rep)}
                  className="glass-card rounded-xl p-4 hover:border-white/20 cursor-pointer transition-all duration-300 group flex items-start gap-3"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colorDot}`} />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-sans text-xs font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                      {rep.title}
                    </h5>
                    <p className="font-sans text-[11px] text-gray-400 truncate mt-0.5">
                      {rep.location.display_name}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                        {rep.status}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
