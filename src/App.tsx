import { useState, useEffect } from "react";
import { CivicReport, Coordinates, NotificationAlert, ReportStatus, IssueCategory, UrgencyLevel } from "./types";
import { INITIAL_REPORTS, INITIAL_NOTIFICATIONS, GOVERN_DEPARTMENTS } from "./data";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import NewReport from "./components/NewReport";
import CaseDetails from "./components/CaseDetails";
import CaseList from "./components/CaseList";
import Authorities from "./components/Authorities";
import Heatmap from "./components/Heatmap";
import NotificationsScreen from "./components/NotificationsScreen";
import { Shield, Sparkles, Languages, Monitor, Smartphone, Scale, Radio } from "lucide-react";

// Multi-language translation map
const TRANSLATIONS = {
  en: {
    dashboard: "Live Dashboard",
    report: "Report Issue",
    history: "Filing History",
    grid: "Government Grid",
    alerts: "Communications",
    motto: "Your voice, written in the language of the law.",
    tagline: "Secure Civic AI Portal",
    newReportBtn: "Report an Issue",
    langLabel: "Language",
    viewLabel: "Workspace Layout",
    desktopMode: "Fluid Widescreen",
    mobileMode: "Mobile Device Frame",
  },
  kn: {
    dashboard: "ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    report: "ದೂರು ಸಲ್ಲಿಸಿ",
    history: "ದಾಖಲಾತಿ ಇತಿಹಾಸ",
    grid: "ಸರ್ಕಾರಿ ಗ್ರಿಡ್",
    alerts: "ಸಂಪರ್ಕಗಳು",
    motto: "ನಿಮ್ಮ ಧ್ವನಿ, ಕಾನೂನಿನ ಭಾಷೆಯಲ್ಲಿ ಲಿಖಿತವಾಗಿದೆ.",
    tagline: "ಸುರಕ್ಷಿತ ನಾಗರಿಕ ಎಐ ಪೋರ್ಟಲ್",
    newReportBtn: "ದೂರು ವರದಿ ಮಾಡಿ",
    langLabel: "ಭಾಷೆ",
    viewLabel: "ಲೇಔಟ್ ಬದಲಿಸಿ",
    desktopMode: "ಡೆಸ್ಕ್‌ಟಾಪ್ ವೀಕ್ಷಣೆ",
    mobileMode: "ಮೊಬೈಲ್ ಚೌಕಟ್ಟು",
  },
  hi: {
    dashboard: "लाइव डैशबोर्ड",
    report: "शिकायत दर्ज करें",
    history: "शिकायत इतिहास",
    grid: "सरकारी ग्रिड",
    alerts: "सूचनाएं",
    motto: "आपकी आवाज़, कानून की भाषा में लिखित।",
    tagline: "सुरक्षित नागरिक एआई पोर्टल",
    newReportBtn: "समस्या की रिपोर्ट करें",
    langLabel: "भाषा",
    viewLabel: "लेआउट बदलें",
    desktopMode: "डेस्कटॉप दृश्य",
    mobileMode: "मोबाइल फ़्रेम",
  }
};

export default function App() {
  // Persistence state
  const [reports, setReports] = useState<CivicReport[]>(() => {
    const saved = localStorage.getItem("nagarikai_reports");
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [alerts, setAlerts] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem("nagarikai_alerts");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [tab, setTab] = useState<string>("dashboard");
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [language, setLanguage] = useState<"en" | "kn" | "hi">("en");
  const [layoutMode, setLayoutMode] = useState<"desktop" | "mobile">("desktop");

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("nagarikai_reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("nagarikai_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const handleSelectReport = (report: CivicReport) => {
    setSelectedReport(report);
    setTab("case-detail");
  };

  const handleUpdateReport = (updated: CivicReport) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (selectedReport?.id === updated.id) {
      setSelectedReport(updated);
    }
  };

  // Submit and call our backend Express/Gemini API
  const handleNewReportSubmit = async (data: {
    description: string;
    location: Coordinates;
    mediaUrl?: string;
  }): Promise<CivicReport | null> => {
    try {
      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: data.description,
          userLocation: data.location
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process complaint with backend.");
      }

      const analyzed = await response.json();

      const newId = `rep-00${reports.length + 1}`;
      const referenceId = `Ref: #${Math.floor(1000 + Math.random() * 9000)}`;

      const newReport: CivicReport = {
        id: newId,
        referenceId,
        title: analyzed.title || "Reported Civic Hazard",
        description: data.description,
        category: analyzed.category as IssueCategory,
        urgency: analyzed.urgency as UrgencyLevel,
        status: ReportStatus.SUBMITTED,
        location: {
          latitude: analyzed.latitude,
          longitude: analyzed.longitude,
          display_name: analyzed.display_name,
          zone: analyzed.zone
        },
        department: analyzed.departmentId || "bbmp",
        formalLetter: analyzed.formalLetter,
        createdAt: new Date().toISOString(),
        daysActive: 1,
        communityScore: Math.floor(100 + Math.random() * 200), // initial signatures
        needsHumanReview: analyzed.needsHumanReview || false,
        reporterName: "Marcus Chen",
        reporterId: "8824-X",
        mediaUrl: data.mediaUrl,
        isFollowUpDrafted: false
      };

      // Add report
      setReports((prev) => [...prev, newReport]);

      // Add critical alert notification
      const newAlert: NotificationAlert = {
        id: `notif-00${alerts.length + 1}`,
        title: newReport.needsHumanReview ? "Awaiting Manual Review" : "Formal Legal Draft Created",
        message: newReport.needsHumanReview
          ? `Your issue '${newReport.title}' requires manual human parsing due to text ambiguity. Set aside for review.`
          : `CivicAI parsed your report on '${newReport.title}' and drafted a legal letter for ${newReport.category}. Check details!`,
        time: "Just now",
        type: newReport.needsHumanReview ? "warning" : "success",
        glowColor: newReport.needsHumanReview ? "yellow" : "purple",
        read: false
      };

      setAlerts((prev) => [newAlert, ...prev]);

      // Open detail view for this newly compiled case immediately so user can see their letter!
      setSelectedReport(newReport);
      setTab("case-detail");

      return newReport;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleMarkAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const t = TRANSLATIONS[language];

  // Render proper sub-screen view
  const renderTabContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <Dashboard
            reports={reports}
            onReportIssue={() => setTab("new-report")}
            onSelectReport={handleSelectReport}
          />
        );
      case "new-report":
        return <NewReport onSubmitReport={handleNewReportSubmit} />;
      case "case-detail":
        return selectedReport ? (
          <CaseDetails
            report={selectedReport}
            onBack={() => setTab("dashboard")}
            onUpdateReport={handleUpdateReport}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">Select a case to inspect details.</div>
        );
      case "cases":
        return <CaseList reports={reports} onSelectReport={handleSelectReport} />;
      case "authorities":
        return <Authorities />;
      case "map":
        return <Heatmap reports={reports} onSelectReport={handleSelectReport} />;
      case "notifications":
        return (
          <NotificationsScreen
            alerts={alerts}
            onMarkRead={handleMarkAlertRead}
            onMarkAllRead={handleMarkAllAlertsRead}
          />
        );
      default:
        return (
          <Dashboard
            reports={reports}
            onReportIssue={() => setTab("new-report")}
            onSelectReport={handleSelectReport}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col relative overflow-x-hidden select-none">
      {/* Soft background ambient purple-to-black glow */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-b from-purple-600/15 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Universal Control Header (Allows layout mode and language switching seamlessly) */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 overflow-visible">
            <div className="glow-dot glow-purple absolute w-10 h-10 rounded-full opacity-60 blur-md" />
            <Radio className="w-4.5 h-4.5 text-purple-400 animate-pulse relative z-10" />
          </div>
          <div>
            <h1 className="font-headline-lg font-mono text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              NagarikAI <span className="text-[10px] text-purple-400 font-mono bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-500/20">CIVIC LAW AI</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-sans tracking-tight mt-0.5">{t.motto}</p>
          </div>
        </div>

        {/* Workspace controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Layout switcher */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs font-sans">
            <button
              onClick={() => setLayoutMode("desktop")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                layoutMode === "desktop" ? "bg-white text-black font-bold" : "text-gray-400 hover:text-white"
              }`}
              title="Fluid widescreen"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.desktopMode}</span>
            </button>
            <button
              onClick={() => setLayoutMode("mobile")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                layoutMode === "mobile" ? "bg-white text-black font-bold" : "text-gray-400 hover:text-white"
              }`}
              title="Mobile device frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.mobileMode}</span>
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs font-mono">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-full transition-all ${
                language === "en" ? "bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30" : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("kn")}
              className={`px-3 py-1 rounded-full transition-all ${
                language === "kn" ? "bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30" : "text-gray-400 hover:text-white"
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1 rounded-full transition-all ${
                language === "hi" ? "bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30" : "text-gray-400 hover:text-white"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </header>

      {/* Primary Workspace container */}
      {layoutMode === "mobile" ? (
        /* Mobile Device Frame Mockup Wrapper */
        <div className="flex-1 flex items-center justify-center py-10 px-4 bg-[#0A0A0A]">
          <div className="relative w-full max-w-[410px] aspect-[9/19.5] bg-[#0E0E0E] rounded-[48px] border-[12px] border-[#1A1A1D] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-0 inset-x-0 h-7 bg-black z-50 flex items-center justify-center">
              <div className="w-20 h-4 bg-black rounded-b-xl flex justify-center items-center">
                <div className="w-12 h-1 bg-[#1A1A1A] rounded-full" />
              </div>
            </div>

            {/* In-Frame scrollable content area */}
            <div className="flex-1 overflow-y-auto pt-10 pb-24 px-5 scrollbar-thin">
              {renderTabContent()}
            </div>

            {/* Mobile Bottom Navigation Inside Frame */}
            <BottomNav currentTab={tab} setTab={setTab} unreadCount={unreadAlertsCount} />
          </div>
        </div>
      ) : (
        /* Full Widescreen Widespan Desktop Workspace */
        <div className="flex-1 flex">
          {/* Sidebar Left */}
          <Sidebar currentTab={tab} setTab={setTab} unreadCount={unreadAlertsCount} />

          {/* Desktop main scroll context */}
          <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-5xl mx-auto pb-28 md:pb-12">
            {renderTabContent()}
          </main>

          {/* Floating bottom nav for mobile fallback when layout is desktop but browser is tiny */}
          <BottomNav currentTab={tab} setTab={setTab} unreadCount={unreadAlertsCount} />
        </div>
      )}
    </div>
  );
}
