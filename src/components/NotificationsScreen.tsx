import { NotificationAlert } from "../types";
import { Check, Bell, Flame, ShieldAlert, Award, Inbox } from "lucide-react";
import { TRANSLATIONS } from "../translations";

interface NotificationsScreenProps {
  alerts: NotificationAlert[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  language?: "en" | "kn" | "hi";
}

export default function NotificationsScreen({ alerts, onMarkRead, onMarkAllRead, language = "en" }: NotificationsScreenProps) {
  const t = TRANSLATIONS[language];
  
  const getAlertIcon = (type: string) => {
    if (type === "success") return Check;
    if (type === "warning") return ShieldAlert;
    if (type === "alert") return Flame;
    return Bell;
  };

  const glowColorsMap = {
    green: "shadow-[0_0_15px_rgba(34,197,94,0.35)] border-green-500/20 bg-green-950/10 text-green-400",
    red: "shadow-[0_0_15px_rgba(239,68,68,0.35)] border-red-500/20 bg-red-950/10 text-red-400",
    blue: "shadow-[0_0_15px_rgba(59,130,246,0.35)] border-blue-500/20 bg-blue-950/10 text-blue-400",
    purple: "shadow-[0_0_15px_rgba(168,85,247,0.35)] border-purple-500/20 bg-purple-950/10 text-purple-400",
    yellow: "shadow-[0_0_15px_rgba(234,179,8,0.35)] border-yellow-500/20 bg-yellow-950/10 text-yellow-400"
  };

  const hasUnread = alerts.some((a) => !a.read);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none uppercase">
            {t.alertsTitle}
          </h2>
          <p className="font-sans text-sm text-gray-400 mt-2">
            {t.alertsSubtitleTitle}
          </p>
        </div>
        {hasUnread && (
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 hover:bg-white/5 border border-white/10 rounded-full transition-all text-xs font-sans text-white font-bold whitespace-nowrap active:scale-95"
          >
            {t.markAllRead}
          </button>
        )}
      </div>

      {/* List of alerts */}
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const IconComponent = getAlertIcon(alert.type);
            const glowStyles = glowColorsMap[alert.glowColor];

            return (
              <div
                key={alert.id}
                onClick={() => onMarkRead(alert.id)}
                className={`glass-card rounded-2xl p-5 border border-white/5 transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  alert.read ? "opacity-60 hover:opacity-100" : "bg-[#050508]"
                }`}
              >
                {/* Glowing alert dot for unread */}
                {!alert.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                )}

                <div className="flex items-start gap-4">
                  {/* Glowing circular avatar placeholder for notifications */}
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center relative overflow-visible shrink-0 ${glowStyles}`}>
                    <div className={`glow-dot glow-${alert.glowColor} absolute w-12 h-12 rounded-full opacity-60 blur-md`} />
                    <IconComponent className="w-4 h-4 relative z-10" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-[10px] text-gray-500 block uppercase tracking-wider">
                      {alert.time}
                    </span>
                    <h4 className="font-headline-md font-mono text-sm font-bold text-white mt-1 leading-snug">
                      {alert.title}
                    </h4>
                    <p className="font-sans text-xs text-gray-300 leading-relaxed mt-1">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-60 flex flex-col items-center justify-center text-center space-y-3 bg-[#000000]/15 rounded-2xl border border-dashed border-white/5">
          <Inbox className="w-8 h-8 text-gray-600" />
          <p className="font-sans text-sm text-gray-400">{t.noActiveAlerts}</p>
        </div>
      )}
    </div>
  );
}
