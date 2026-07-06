import { CivicReport, IssueCategory, ReportStatus, UrgencyLevel } from "../types";
import { Scales, Users, Flame, CaretRight, ShieldWarning, Drop, Lightning, Eye } from "@phosphor-icons/react";
import { TRANSLATIONS } from "../translations";

interface CaseListProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  language?: "en" | "kn" | "hi";
}

export default function CaseList({ reports, onSelectReport, language = "en" }: CaseListProps) {
  const t = TRANSLATIONS[language];
  const categories = [
    {
      id: IssueCategory.WATER,
      title: language === "kn" ? "ನೀರು ಸರಬರಾಜು ಮತ್ತು ಒಳಚರಂಡಿ" : language === "hi" ? "जलापूर्ति और सीवेज" : "Water Supply & Sewage",
      icon: Drop,
      color: "blue",
      glowColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      description: language === "kn" ? "ಸೋರಿಕೆಗಳು, ಕೊಳವೆ ಒಡೆತ, ಕಲುಷಿತ ನೀರು ಮತ್ತು ಚರಂಡಿ ಸಮಸ್ಯೆಗಳ ನಿರ್ವಹಣೆ." : language === "hi" ? "लीक, पाइप फटना, दूषित जलापूर्ति और जल निकासी प्रबंधन।" : "Managing leaks, bursts, supply contamination, and stormwater drainage."
    },
    {
      id: "Roads & Infrastructure", // Matching key format or value
      title: language === "kn" ? "ರಸ್ತೆಗಳು ಮತ್ತು ಮೂಲಸೌಕರ್ಯ" : language === "hi" ? "सड़कें और बुनियादी ढांचा" : "Roads & Infrastructure",
      categoryEnum: IssueCategory.ROADS,
      icon: Scales,
      color: "yellow",
      glowColor: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      description: language === "kn" ? "ಗುಂಡಿಗಳು, ಪಾದಚಾರಿ ಮಾರ್ಗಗಳು, ಟ್ರಾಫಿಕ್ ದೀಪಗಳು ಮತ್ತು ಸುರಕ್ಷತೆಯ ವರದಿ." : language === "hi" ? "गड्ढों, फुटपाथों, ट्रैफिक लाइटों और संरचनात्मक सुरक्षा की रिपोर्ट।" : "Handling potholes, sidewalk disruptions, traffic lights, and structural safety."
    },
    {
      id: IssueCategory.ELECTRICITY,
      title: language === "kn" ? "ವಿದ್ಯುತ್ ಮತ್ತು ವಿದ್ಯುತ್ ಗ್ರಿಡ್" : language === "hi" ? "बिजली और पावर ग्रिड" : "Electricity & Power Grid",
      icon: Lightning,
      color: "purple",
      glowColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      description: language === "kn" ? "ವಿದ್ಯುತ್ ಕಡಿತ, ಅಧಿಕ ವೋಲ್ಟೇಜ್ ಕಿಡಿಗಳು, ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್ ಸಮಸ್ಯೆ ಮತ್ತು ಬೀದಿ ದೀಪಗಳು." : language === "hi" ? "बिजली कटौती, हाई-वोल्टेज स्पार्क्स, ट्रांसफार्मर खराबी और स्ट्रीटलाइट्स।" : "Monitoring blackouts, high-voltage sparks, transformer decay, and streetlights."
    },
    {
      id: IssueCategory.SAFETY,
      title: language === "kn" ? "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ ಮತ್ತು ಕಾನೂನು" : language === "hi" ? "सार्वजनिक सुरक्षा और कानून" : "Public Safety & Law",
      icon: ShieldWarning,
      color: "red",
      glowColor: "bg-red-500/10",
      iconColor: "text-red-400",
      description: language === "kn" ? "ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯಕ್ಕೆ ಹಾನಿ, ಕಸ ಸುರಿಯುವುದು, ಅಕ್ರಮ ಗದ್ದಲ ಮತ್ತು ತುರ್ತು ಸಮಸ್ಯೆಗಳು." : language === "hi" ? "सार्वजनिक स्वास्थ्य के खतरे, कचरा फेंकना, अवैध शोर और आपातकालीन मुद्दे।" : "Reporting public health hazards, trash dumping, illegal noise, and emergency nodes."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none uppercase">
          {t.historyTitle}
        </h2>
        <p className="font-sans text-sm text-gray-400 mt-2">
          {t.historySubtitle}
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const categoryValue = cat.categoryEnum || (cat.id as IssueCategory);
          const catReports = reports.filter((r) => r.category === categoryValue);
          const totalCatReports = catReports.length;
          const resolvedCatReports = catReports.filter((r) => r.status === ReportStatus.RESOLVED).length;
          const criticalCatCount = catReports.filter((r) => r.urgency === UrgencyLevel.CRITICAL || r.urgency === UrgencyLevel.URGENT).length;

          const IconComponent = cat.icon;

          return (
            <div key={cat.title} className="space-y-4">
              {/* Category summary header card */}
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-white/5 bg-[#000000]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-visible shrink-0 ${cat.iconColor} ${cat.glowColor}`}>
                    <IconComponent className="w-5 h-5 relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-headline-md font-mono text-lg font-bold text-white leading-none">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-xs text-gray-400 mt-1 max-w-md">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Stat rows inside category row */}
                <div className="flex gap-6 text-xs border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-6 shrink-0">
                  <div>
                    <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">{t.totalReports}</span>
                    <span className="text-white font-mono font-bold text-base mt-0.5 block">{totalCatReports}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">{t.resolvedCases}</span>
                    <span className="text-green-400 font-mono font-bold text-base mt-0.5 block">{resolvedCatReports}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">{t.urgencyText}</span>
                    <span className="text-red-400 font-mono font-bold text-base mt-0.5 block">{criticalCatCount}</span>
                  </div>
                </div>
              </div>

              {/* Sub list of cards for this category */}
              {totalCatReports > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catReports.map((rep) => (
                    <div
                      key={rep.id}
                      onClick={() => onSelectReport(rep)}
                      className="glass-card rounded-2xl p-5 hover:border-purple-500/30 cursor-pointer group transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="font-sans text-[10px] text-gray-500 uppercase tracking-widest block">
                            {rep.referenceId}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-sans font-bold border rounded-full ${
                            rep.urgency === UrgencyLevel.CRITICAL
                              ? "text-red-400 border-red-500/20 bg-red-950/20"
                              : rep.urgency === UrgencyLevel.URGENT
                              ? "text-orange-400 border-orange-500/20 bg-orange-950/20"
                              : "text-gray-400 border-white/10 bg-white/5"
                          }`}>
                            {rep.urgency}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-headline-md font-mono text-sm font-bold text-white group-hover:text-purple-400 transition-colors leading-snug">
                            {rep.title}
                          </h4>
                          <p className="font-sans text-xs text-gray-400 line-clamp-2 mt-1">
                            {rep.description}
                          </p>
                        </div>
                      </div>

                      {/* Stat rows & icons at the bottom of the card */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-[11px] font-sans text-gray-400">
                        <span className="text-white font-bold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          {rep.communityScore} {t.signatures}
                        </span>
                        <span className="flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.viewDetails}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600 font-sans text-xs italic">
                  {language === "kn" ? "ಈ ವರ್ಗದ ಅಡಿಯಲ್ಲಿ ಯಾವುದೇ ಸಕ್ರಿಯ ವರದಿಗಳಿಲ್ಲ." : language === "hi" ? "इस श्रेणी के तहत कोई सक्रिय रिपोर्ट नहीं है।" : "No active reports filed under this category."}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
