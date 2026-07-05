import { LayoutDashboard, PlusCircle, Map, History, Bell, Shield, Radio } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  unreadCount: number;
}

export default function Sidebar({ currentTab, setTab, unreadCount }: SidebarProps) {
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Live Dashboard" },
    { id: "new-report", icon: PlusCircle, label: "Report Issue" },
    { id: "map", icon: Map, label: "Community Heatmap" },
    { id: "cases", icon: History, label: "Filing History" },
    { id: "authorities", icon: Shield, label: "Government Grid" },
    { id: "notifications", icon: Bell, label: "Communications", count: unreadCount },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0A]/90 backdrop-blur-md border-r border-white/10 h-screen sticky top-0 p-6 z-40">
      {/* App Branding Header */}
      <div className="flex items-center gap-3 mb-12">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 overflow-visible">
          <div className="glow-dot glow-purple absolute w-10 h-10 rounded-full opacity-60 blur-md" />
          <Radio className="w-4 h-4 text-purple-400 animate-pulse relative z-10" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-lg font-mono text-xl tracking-tighter text-white font-bold leading-none">NagarikAI</span>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-purple-400/80">Civic Command</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`btn-nav-dt-${item.id}`}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left relative overflow-hidden group ${
                isActive
                  ? "bg-white/10 text-white border border-white/10 font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              )}
              <IconComponent className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-purple-400 scale-110" : "text-gray-500 group-hover:scale-105"}`} />
              <span className="font-sans text-sm">{item.label}</span>
              
              {item.count !== undefined && item.count > 0 ? (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold animate-pulse">
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Onboard Terminal Status Foot */}
      <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Network Node</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-[9px] text-green-400 font-bold">ONLINE</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-gray-600 leading-normal">
          SECURE PROTOCOL v4.02
        </div>
      </div>
    </aside>
  );
}
