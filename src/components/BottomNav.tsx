import { LayoutDashboard, PlusCircle, Map, History, Bell, Shield } from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  setTab: (tab: string) => void;
  unreadCount: number;
}

export default function BottomNav({ currentTab, setTab, unreadCount }: BottomNavProps) {
  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "new-report", icon: PlusCircle, label: "Report" },
    { id: "map", icon: Map, label: "Map" },
    { id: "cases", icon: History, label: "History" },
    { id: "authorities", icon: Shield, label: "Authorities" },
    { id: "notifications", icon: Bell, label: "Alerts", badge: true },
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
            <IconComponent className="w-5 h-5" />
            {tab.badge && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
