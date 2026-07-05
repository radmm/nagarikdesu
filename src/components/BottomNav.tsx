import { SquaresFour, PlusCircle, MapTrifold, Clock, Bell, Shield } from "@phosphor-icons/react";
import { TRANSLATIONS } from "../translations";

interface BottomNavProps {
  currentTab: string;
  setTab: (tab: string) => void;
  unreadCount: number;
  language?: "en" | "kn" | "hi";
}

export default function BottomNav({ currentTab, setTab, unreadCount, language = "en" }: BottomNavProps) {
  const t = TRANSLATIONS[language];

  const tabs = [
    { id: "dashboard", icon: SquaresFour, label: t.dashboard },
    { id: "new-report", icon: PlusCircle, label: t.report },
    { id: "map", icon: MapTrifold, label: t.map },
    { id: "cases", icon: Clock, label: t.history },
    { id: "authorities", icon: Shield, label: t.grid },
    { id: "notifications", icon: Bell, label: t.alerts, badge: true },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-between items-center px-4 py-2 w-[92%] max-w-md bg-[#000000]/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl md:hidden">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`btn-nav-mob-${tab.id}`}
            onClick={() => setTab(tab.id)}
            className={`relative p-3 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${
              isActive
                ? "bg-white text-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                : "text-gray-400 hover:text-white"
            }`}
            title={tab.label}
          >
            <IconComponent className="w-5 h-5" weight={isActive ? "bold" : "duotone"} />
            {tab.badge && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
