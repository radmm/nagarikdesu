import { useState } from "react";
import { CivicReport, ReportStatus, UrgencyLevel } from "../types";
import { GOVERN_DEPARTMENTS } from "../data";
import { CaretLeft, ShareNetwork, Clipboard, Check, Scales, Clock, Warning, FileText, PaperPlaneRight, User } from "@phosphor-icons/react";
import { TRANSLATIONS } from "../translations";

interface CaseDetailsProps {
  report: CivicReport;
  onBack: () => void;
  onUpdateReport: (updatedReport: CivicReport) => void;
  language?: "en" | "kn" | "hi";
}

export default function CaseDetails({ report, onBack, onUpdateReport, language = "en" }: CaseDetailsProps) {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"initial" | "followup">("initial");
  const [escalating, setEscalating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dept = GOVERN_DEPARTMENTS.find((d) => d.id === report.department);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerFollowUpDraft = () => {
    if (report.isFollowUpDrafted) {
      setTab("followup");
      return;
    }

    const followUpText = `Subject: URGENT SECOND NOTICE: Unresolved Civic Infraction - Escalation (Ref: ${report.referenceId})\n\nTo the Department Commissioner,\n${dept?.name || "Target Department Control Office"},\nBengaluru.\n\nDear Sir/Madam,\n\nThis is an automated legal reminder and community escalation concerning Case Reference: ${report.referenceId}, originally filed on ${new Date(report.createdAt).toLocaleDateString()} regarding: "${report.title}".\n\nThis ticket has remained in '${report.status}' status for over ${report.daysActive} days with no active tarmac patching or engineering resolution logged.\n\nUnder Municipal Code Section 51 (Public Redress and Administrative Vigilance), state agencies hold a 10-day SLA to initiate physical repair site audits for high-tension grids or transit blocks.\n\nWe kindly request immediate escalation of this ticket to active dispatch or a formal explanation of municipal latency.\n\nSincerely,\nCivic Advocacy Bot (Nagarikdesu) on behalf of ${report.reporterName}`;

    const updated: CivicReport = {
      ...report,
      isFollowUpDrafted: true,
      followUpLetter: followUpText
    };

    onUpdateReport(updated);
    setTab("followup");
  };

  const escalateToCouncil = () => {
    setEscalating(true);
    setTimeout(() => {
      const updated: CivicReport = {
        ...report,
        communityScore: Math.min(1500, report.communityScore + 85),
      };
      onUpdateReport(updated);
      setEscalating(false);
      setToastMessage("This case has been officially escalated to the Bengaluru City Council and District Commissioner! We've generated 85 more community signatures.");
    }, 1000);
  };

  const getUrgencyColor = (urg: UrgencyLevel) => {
    if (urg === UrgencyLevel.CRITICAL) return "text-red-400 bg-red-950/40 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
    if (urg === UrgencyLevel.URGENT) return "text-orange-400 bg-orange-950/40 border-orange-500/30";
    if (urg === UrgencyLevel.MEDIUM) return "text-yellow-400 bg-yellow-950/40 border-yellow-500/30";
    return "text-green-400 bg-green-950/40 border-green-500/30";
  };

  // Stepper helper
  const steps = [
    { label: language === "kn" ? "ಸಲ್ಲಿಸಲಾಗಿದೆ" : language === "hi" ? "सबमिट किया गया" : "Submitted", status: ReportStatus.SUBMITTED },
    { label: language === "kn" ? "ಸ್ವೀಕರಿಸಲಾಗಿದೆ" : language === "hi" ? "स्वीकार किया गया" : "Acknowledged", status: ReportStatus.ACKNOWLEDGED },
    { label: language === "kn" ? "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ" : language === "hi" ? "समीक्षा के अधीन" : "Under Review", status: ReportStatus.UNDER_REVIEW },
    { label: language === "kn" ? "ಪರಿಹರಿಸಲಾಗಿದೆ" : language === "hi" ? "सुलझाया गया" : "Resolved", status: ReportStatus.RESOLVED },
  ];

  const currentStepIdx = steps.findIndex((s) => s.status === report.status);

  // Active glow depending on department
  const glowColors = {
    green: "border-green-500/40 shadow-[0_0_25px_rgba(34,197,94,0.4)]",
    red: "border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.4)]",
    blue: "border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.4)]",
    purple: "border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.4)]",
    yellow: "border-yellow-500/40 shadow-[0_0_25px_rgba(234,179,8,0.4)]"
  };

  const avatarGlow = glowColors[dept?.glowColor || "purple"];

  const communityPercentage = Math.round((report.communityScore / 1500) * 100);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-sans text-gray-400 hover:text-white transition-colors"
        >
          <CaretLeft className="w-4 h-4" weight="bold" />
          <span>{t.backToGrid}</span>
        </button>
        <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-widest">
          {report.referenceId}
        </span>
      </div>

      {/* Hero Stat Panel (Community Pressure Score) */}
      <section className="relative flex flex-col items-center justify-center text-center py-6">
        <div className="absolute -z-10 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full"></div>
        <span className="font-headline-lg font-mono text-7xl md:text-8xl font-bold text-white tracking-tighter leading-none relative">
          {communityPercentage}%
        </span>
        <span className="font-headline-md font-mono text-sm tracking-widest text-gray-400 uppercase mt-2">
          {t.communityPressure}
        </span>
        <span className="font-sans text-[11px] text-gray-500 mt-1 block">
          {report.communityScore} {t.signatures} (Goal: 1500 for legal escalation)
        </span>
      </section>

      {/* Case Details Cards Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
          <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">{t.urgencyText}</span>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-3 py-1 text-xs font-sans font-bold border rounded-full ${getUrgencyColor(report.urgency)}`}>
              {report.urgency.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-28 relative overflow-hidden">
          <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">Sector Grid</span>
          <div className="flex flex-col mt-2">
            <span className="text-white font-sans font-bold text-sm">{report.location.zone}</span>
            <span className="text-gray-500 text-[10px] font-sans truncate">{report.location.display_name}</span>
          </div>
        </div>
      </div>

      {/* Status Pipeline Step Stepper */}
      <section className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-headline-md font-mono text-sm font-bold text-white uppercase tracking-wider">{t.caseStatus} Pipeline</h3>
        <div className="relative flex justify-between items-center pt-2">
          {/* Connector Line */}
          <div className="absolute top-5 left-4 right-4 h-0.5 bg-white/10 -z-0"></div>
          <div 
            className="absolute top-5 left-4 h-0.5 bg-purple-500 -z-0 transition-all duration-500" 
            style={{ width: `${(currentStepIdx / (steps.length - 1)) * 95}%` }}
          />

          {steps.map((s, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isFuture = idx > currentStepIdx;

            return (
              <div key={s.label} className="flex flex-col items-center gap-2 z-10 relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isCompleted
                      ? "bg-purple-500 border-purple-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : isCurrent
                      ? "bg-[#0A0A0C] border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                      : "bg-[#0A0A0C] border-white/10 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" weight="bold" />
                  ) : (
                    <span className="text-xs font-mono">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] font-sans font-bold ${isCurrent ? "text-purple-400" : "text-gray-500"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assigned Authority */}
      {dept && (
        <section className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full border flex items-center justify-center relative overflow-visible shrink-0 ${avatarGlow}`}>
            <Scales className="w-5 h-5 text-white relative z-10" weight="duotone" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-sans text-[10px] text-gray-500 uppercase tracking-widest block">{t.actionDepartment}</span>
            <h4 className="font-headline-md font-mono text-sm font-bold text-white truncate uppercase mt-0.5">
              {dept.name} ({dept.abbreviation})
            </h4>
            <p className="font-sans text-[11px] text-gray-400 truncate">SLA Target Resolution Efficiency: {dept.stats.efficiency}</p>
          </div>
        </section>
      )}

      {/* AI Letter Panel Container */}
      <section className="glass-card rounded-2xl overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b border-white/5 bg-[#0A0A0C]/40">
          <button
            onClick={() => setTab("initial")}
            className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest text-center border-r border-white/5 ${
              tab === "initial" ? "bg-white/5 text-purple-400 font-bold" : "text-gray-500 hover:text-white"
            }`}
          >
            {t.officialComplaintDraft}
          </button>
          <button
            onClick={triggerFollowUpDraft}
            className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest text-center relative ${
              tab === "followup" ? "bg-white/5 text-purple-400 font-bold" : "text-gray-500 hover:text-white"
            }`}
          >
            {t.escalatedTag}
            {report.daysActive > 10 && !report.isFollowUpDrafted && (
              <span className="absolute top-3.5 right-4 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        {/* Scrolling paper container */}
        <div className="p-6 md:p-8 bg-black/40 min-h-[300px] relative font-mono text-xs text-gray-300 leading-relaxed space-y-4 max-h-[360px] overflow-y-auto">
          {tab === "initial" ? (
            <div className="whitespace-pre-wrap select-all">{report.formalLetter}</div>
          ) : (
            <div className="whitespace-pre-wrap select-all">
              {report.followUpLetter || "No escalation notice drafted yet. Click this tab to automatically generate a formal statutory reminder notice."}
            </div>
          )}
        </div>

        {/* Scrolling Action bottom */}
        <div className="p-4 bg-white/5 border-t border-white/5 flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(tab === "initial" ? report.formalLetter : report.followUpLetter || "")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all text-[11px] font-sans border border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" weight="bold" />
                  <span className="text-green-400 font-bold">{t.copiedText}</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" weight="duotone" />
                  <span>{t.copyDraft}</span>
                </>
              )}
            </button>
          </div>

          {/* Sits too long helper trigger */}
          {report.daysActive > 10 && !report.isFollowUpDrafted && tab === "initial" && (
            <span className="text-[10px] text-red-400 font-sans font-medium flex items-center gap-1">
              <Warning className="w-3 h-3" weight="duotone" /> Report unresolved over 10 days. Follow-up drafted.
            </span>
          )}
        </div>
      </section>

      {/* Escalate & Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <button
          onClick={escalateToCouncil}
          disabled={escalating}
          className="w-full glass-card py-4 flex items-center justify-center gap-2 hover:bg-white/5 text-white active:scale-95 transition-all text-sm font-sans font-bold border border-white/10 rounded-full"
        >
          <ShareNetwork className="w-4 h-4 text-purple-400" weight="duotone" />
          <span>{escalating ? t.escalatingText : t.escalateBtn}</span>
        </button>
        
        {report.daysActive > 10 ? (
          <button
            onClick={() => setTab("followup")}
            className="w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm font-sans font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            <PaperPlaneRight className="w-4 h-4" weight="duotone" />
            <span>Transmit Escalation Letter</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setToastMessage("Formal letter submitted to government channel! Recipient departments notified by automated email.");
            }}
            className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-sans font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <PaperPlaneRight className="w-4 h-4" weight="duotone" />
            <span>{t.submitToGov}</span>
          </button>
        )}
      </div>

      {/* Modern in-app Toast Notification Alert Modal */}
      {toastMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 text-center space-y-4 border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.3)] bg-[#0C0C0C]/90 relative overflow-hidden">
            <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto relative overflow-visible">
              <Scales className="w-5 h-5 relative z-10" weight="duotone" />
            </div>
            <h4 className="font-headline-md font-mono text-sm uppercase tracking-widest text-purple-400 font-bold">{t.systemBroadcast}</h4>
            <p className="font-sans text-xs text-gray-300 leading-relaxed">{toastMessage}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="w-full py-2.5 bg-white text-black hover:bg-gray-200 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all active:scale-95"
            >
              {t.acknowledgeBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
