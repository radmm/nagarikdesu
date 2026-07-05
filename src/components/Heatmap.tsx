import { useState } from "react";
import { CivicReport, IssueCategory } from "../types";
import { MapPin, Sparkles, Scale, AlertCircle, Eye, ShieldAlert } from "lucide-react";
import { TRANSLATIONS } from "../translations";

interface HeatmapProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  language?: "en" | "kn" | "hi";
}

export default function Heatmap({ reports, onSelectReport, language = "en" }: HeatmapProps) {
  const t = TRANSLATIONS[language];
  const [selectedPin, setSelectedPin] = useState<CivicReport | null>(null);

  // Group into sectors or list active coordinates
  const pins = reports.map((rep, idx) => {
    // Deterministic position mapping within our 100% responsive SVG coordinate viewbox (e.g. 0 to 800)
    // Map latitude/longitude to coordinate space [100, 700]
    const minLat = 12.91;
    const maxLat = 12.99;
    const minLng = 77.55;
    const maxLng = 77.67;

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    const x = 50 + ((rep.location.longitude - minLng) / lngRange) * 700;
    const y = 450 - ((rep.location.latitude - minLat) / latRange) * 400; // Invert Y since SVG (0,0) is top-left

    return {
      report: rep,
      x: isNaN(x) ? 200 + (idx * 60) : Math.max(50, Math.min(750, x)),
      y: isNaN(y) ? 150 + (idx * 45) : Math.max(50, Math.min(450, y))
    };
  });

  const getMarkerColor = (cat: IssueCategory) => {
    if (cat === IssueCategory.ELECTRICITY) return "text-purple-400 fill-purple-400";
    if (cat === IssueCategory.WATER) return "text-blue-400 fill-blue-400";
    if (cat === IssueCategory.SAFETY) return "text-red-400 fill-red-400";
    return "text-yellow-400 fill-yellow-400";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none uppercase">
          {t.mapTitle}
        </h2>
        <p className="font-sans text-sm text-gray-400 mt-2">
          {t.mapSubtitle}
        </p>
      </div>

      {/* Interactive Map Visual Board */}
      <div className="glass-card rounded-[32px] overflow-hidden border border-white/10 relative bg-[#050508] p-1">
        {/* Ambient coordinate text markings overlay */}
        <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-gray-500 space-y-0.5 pointer-events-none select-none">
          <div>NODE ID: BLR-INTELLIGENCE-712</div>
          <div>BOUNDS: 12.91° N - 77.55° E</div>
        </div>

        {/* Map Vector Graphic Screen */}
        <div className="relative w-full aspect-[4/3] bg-black/40 rounded-[28px] overflow-hidden">
          {/* Cybergrid background lines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5 pointer-events-none">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-t border-l border-white" />
            ))}
          </div>

          <svg className="w-full h-full text-gray-800" viewBox="0 0 800 500">
            {/* Street Path Network lines */}
            <path d="M 50 150 L 750 150 M 50 350 L 750 350 M 200 50 L 200 450 M 600 50 L 600 450 M 100 50 L 400 450 M 700 50 L 500 450" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <path d="M 50 250 C 300 200, 500 300, 750 250" fill="none" stroke="rgba(168,85,247,0.04)" strokeWidth="4" />

            {/* Glowing Map Mark Pulsing Pins */}
            {pins.map((pin) => {
              const markerColor = getMarkerColor(pin.report.category);
              const isSelected = selectedPin?.id === pin.report.id;

              return (
                <g
                  key={pin.report.id}
                  onClick={() => setSelectedPin(pin.report)}
                  className="cursor-pointer group"
                >
                  {/* Invisible broad click target helper */}
                  <circle cx={pin.x} cy={pin.y} r="25" fill="transparent" />

                  {/* Dynamic animating aura ring */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? "18" : "12"}
                    className={`animate-ping origin-center opacity-25 fill-none stroke-current ${markerColor}`}
                    strokeWidth="1.5"
                    style={{ animationDuration: "2.5s" }}
                  />

                  {/* Core Pin Dot */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? "8" : "5"}
                    className={`transition-all duration-300 stroke-black stroke-2 shadow-2xl relative z-10 ${markerColor}`}
                  />
                </g>
              );
            })}
          </svg>

          {/* Connected Popover Overlay info board */}
          {selectedPin && (
            <div className="absolute inset-x-4 bottom-4 z-20 glass-card rounded-2xl p-4 bg-black/85 backdrop-blur-xl border border-white/10 animate-fade-in flex flex-col justify-between gap-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest block">
                    {selectedPin.location.zone} • {selectedPin.referenceId}
                  </span>
                  <h4 className="font-headline-md font-mono text-sm font-bold text-white mt-1">
                    {selectedPin.title}
                  </h4>
                  <p className="font-sans text-xs text-gray-400 line-clamp-2 mt-0.5">
                    {selectedPin.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 rotate-45" />
                </button>
              </div>

              {/* Stat rows & Inspect letter button */}
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-sans font-bold">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  {selectedPin.communityScore} {language === "kn" ? "ಬೆಂಬಲಿಗರು" : language === "hi" ? "समर्थक जुड़े" : "Advocates Engaged"}
                </div>
                <button
                  onClick={() => onSelectReport(selectedPin)}
                  className="flex items-center gap-1 px-4 py-1.5 bg-white text-black font-sans font-bold text-[11px] rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.viewDetails}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Legend Row */}
      <div className="flex flex-wrap gap-4 justify-center items-center text-xs font-mono text-gray-400 bg-white/5 px-6 py-3.5 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span>{language === "kn" ? "ನೀರು ಸರಬರಾಜು" : language === "hi" ? "जलापूर्ति" : "Water Supply"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          <span>{language === "kn" ? "ಮೂಲಸೌಕರ್ಯ" : language === "hi" ? "बुनियादी ढांचा" : "Infrastructure"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          <span>{language === "kn" ? "ವಿದ್ಯುತ್" : language === "hi" ? "बिजली" : "Electricity"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <span>{language === "kn" ? "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ" : language === "hi" ? "सार्वजनिक सुरक्षा" : "Public Safety"}</span>
        </div>
      </div>
    </div>
  );
}
