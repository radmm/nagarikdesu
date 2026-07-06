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
import { Shield } from "@phosphor-icons/react";
import { TRANSLATIONS } from "./translations";

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

  // Dynamic Floating Mountain-Like Gradient Configuration
  const getMountainStyle = () => {
    switch (tab) {
      case "dashboard":
        return {
          colors: "from-purple-600/20 via-indigo-600/8 to-transparent",
          transform: "translate(-15%, 5%) scale(1.3) rotate(-5deg)",
          height: "h-[50vh]",
          width: "w-[120vw]"
        };
      case "new-report":
        return {
          colors: "from-amber-600/20 via-orange-600/8 to-transparent",
          transform: "translate(15%, 15%) scale(1.4) rotate(10deg)",
          height: "h-[65vh]",
          width: "w-[140vw]"
        };
      case "case-detail":
        return {
          colors: "from-pink-600/20 via-purple-600/8 to-transparent",
          transform: "translate(-25%, 10%) scale(1.35) rotate(-15deg)",
          height: "h-[60vh]",
          width: "w-[130vw]"
        };
      case "cases":
        return {
          colors: "from-emerald-600/20 via-teal-600/8 to-transparent",
          transform: "translate(0%, 20%) scale(1.25) rotate(5deg)",
          height: "h-[55vh]",
          width: "w-[120vw]"
        };
      case "authorities":
        return {
          colors: "from-blue-600/20 via-indigo-600/8 to-transparent",
          transform: "translate(-10%, 5%) scale(1.45) rotate(-8deg)",
          height: "h-[70vh]",
          width: "w-[140vw]"
        };
      case "map":
        return {
          colors: "from-teal-600/20 via-blue-600/8 to-transparent",
          transform: "translate(20%, 25%) scale(1.3) rotate(12deg)",
          height: "h-[50vh]",
          width: "w-[130vw]"
        };
      case "notifications":
        return {
          colors: "from-rose-600/20 via-red-600/8 to-transparent",
          transform: "translate(5%, 10%) scale(1.4) rotate(-3deg)",
          height: "h-[60vh]",
          width: "w-[135vw]"
        };
      default:
        return {
          colors: "from-purple-600/20 via-indigo-600/8 to-transparent",
          transform: "translate(-15%, 5%) scale(1.3) rotate(-5deg)",
          height: "h-[50vh]",
          width: "w-[120vw]"
        };
    }
  };

  const mountain = getMountainStyle();

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
            language={language}
          />
        );
      case "new-report":
        return <NewReport onSubmitReport={handleNewReportSubmit} language={language} />;
      case "case-detail":
        return selectedReport ? (
          <CaseDetails
            report={selectedReport}
            onBack={() => setTab("dashboard")}
            onUpdateReport={handleUpdateReport}
            language={language}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">Select a case to inspect details.</div>
        );
      case "cases":
        return <CaseList reports={reports} onSelectReport={handleSelectReport} language={language} />;
      case "authorities":
        return <Authorities language={language} />;
      case "map":
        return <Heatmap reports={reports} onSelectReport={handleSelectReport} language={language} />;
      case "notifications":
        return (
          <NotificationsScreen
            alerts={alerts}
            onMarkRead={handleMarkAlertRead}
            onMarkAllRead={handleMarkAllAlertsRead}
            language={language}
          />
        );
      default:
        return (
          <Dashboard
            reports={reports}
            onReportIssue={() => setTab("new-report")}
            onSelectReport={handleSelectReport}
            language={language}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col relative overflow-x-hidden select-none">
      {/* Dynamic Floating Mountain-Like Gradient Backdrop (Smoothly transitions color, scale, angle, and translation on page change) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#0A0A0A]">
        {/* Mountain Shape 1 */}
        <div 
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[100%] blur-[130px] bg-gradient-to-t ${mountain.colors} transition-all duration-1000 ease-out`}
          style={{ 
            width: mountain.width,
            height: mountain.height,
            transform: `translate(-50%, 45%) ${mountain.transform.replace('translate(', '').replace(')', '')}`
          }}
        />
        {/* Mountain Shape 2 (Secondary overlapping ridge for depth) */}
        <div 
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[100%] blur-[160px] bg-gradient-to-t ${mountain.colors} opacity-60 transition-all duration-1000 ease-out delay-75`}
          style={{ 
            width: `calc(${mountain.width} * 0.8)`,
            height: `calc(${mountain.height} * 0.9)`,
            transform: `translate(-30%, 35%) ${mountain.transform.replace('translate(', '').replace(')', '')} scaleY(0.8) rotate(15deg)`
          }}
        />
      </div>

      {/* Top Universal Control Header (Allows language switching seamlessly) */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 overflow-visible">
            <div className="glow-dot glow-purple absolute w-10 h-10 rounded-full opacity-60 blur-md" />
            <Shield className="w-4.5 h-4.5 text-purple-400 relative z-10" weight="duotone" />
          </div>
          <div>
            <h1 className="font-headline-lg font-mono text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              Nagarikdesu
            </h1>
            <p className="text-[10px] text-gray-500 font-sans tracking-tight mt-0.5">{t.motto}</p>
          </div>
        </div>

        {/* Workspace controls */}
        <div className="flex flex-wrap items-center gap-4">
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
      <div className="flex-1 flex">
        {/* Sidebar Left */}
        <Sidebar currentTab={tab} setTab={setTab} unreadCount={unreadAlertsCount} language={language} />

        {/* Desktop main scroll context */}
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 max-w-5xl mx-auto pb-28 md:pb-12">
          {renderTabContent()}
        </main>

        {/* Floating bottom nav for mobile fallback when layout is desktop but browser is tiny */}
        <BottomNav currentTab={tab} setTab={setTab} unreadCount={unreadAlertsCount} language={language} />
      </div>
    </div>
  );
}
