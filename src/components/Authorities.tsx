import { GOVERN_DEPARTMENTS } from "../data";
import { Shield, Clock, Lightning, Drop, Phone, Envelope } from "@phosphor-icons/react";
import { TRANSLATIONS } from "../translations";

interface AuthoritiesProps {
  language?: "en" | "kn" | "hi";
}

export default function Authorities({ language = "en" }: AuthoritiesProps) {
  const t = TRANSLATIONS[language];

  const getDeptIcon = (iconName: string) => {
    if (iconName === "water_drop") return Drop;
    if (iconName === "electric_bolt") return Lightning;
    if (iconName === "local_police") return Phone;
    return Shield;
  };

  const glowColorsMap = {
    green: "shadow-[0_0_20px_rgba(34,197,94,0.4)] border-green-500/30 text-green-400 bg-green-950/10",
    red: "shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-500/30 text-red-400 bg-red-950/10",
    blue: "shadow-[0_0_20px_rgba(59,130,246,0.4)] border-blue-500/30 text-blue-400 bg-blue-950/10",
    purple: "shadow-[0_0_20px_rgba(168,85,247,0.4)] border-purple-500/30 text-purple-400 bg-purple-950/10",
    yellow: "shadow-[0_0_20px_rgba(234,179,8,0.4)] border-yellow-500/30 text-yellow-400 bg-yellow-950/10"
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none uppercase">
          {t.authTitle}
        </h2>
        <p className="font-sans text-sm text-gray-400 mt-2">
          {t.authSubtitle}
        </p>
      </div>

      {/* Grid of Authorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GOVERN_DEPARTMENTS.map((dept) => {
          const IconComponent = getDeptIcon(dept.icon);
          const glowStyles = glowColorsMap[dept.glowColor];

          // Localized Department Name/Desc
          let deptName = dept.name;
          let deptDesc = dept.description;
          if (language === "kn") {
            if (dept.id === "bwssb") {
              deptName = "ಬೆಂಗಳೂರು ನೀರು ಸರಬರಾಜು ಮತ್ತು ಒಳಚರಂಡಿ ಮಂಡಳಿ";
              deptDesc = "ನಗರದಾದ್ಯಂತ ಕುಡಿಯುವ ನೀರು ವಿತರಣೆ ಮತ್ತು ದಕ್ಷ ಒಳಚರಂಡಿ ಮಂಡಳಿಯ ಕಾರ್ಯಾಚರಣೆ ನಿಯಂತ್ರಣ.";
            } else if (dept.id === "bbmp") {
              deptName = "ಬೃಹತ್ ಬೆಂಗಳೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ";
              deptDesc = "ರಸ್ತೆ ಗುಂಡಿ ದುರಸ್ತಿ, ಕಸ ಮುಕ್ತ ನಗರ ನಿರ್ಮಾಣ, ಬೀದಿ ದೀಪ ಮತ್ತು ನಾಗರಿಕ ಮೂಲಸೌಕರ್ಯಗಳ ನಿಯಂತ್ರಣ.";
            } else if (dept.id === "bescom") {
              deptName = "ಬೆಂಗಳೂರು ವಿದ್ಯುತ್ ಸರಬರಾಜು ಕಂಪನಿ ಲಿಮಿಟೆಡ್";
              deptDesc = "ವಿದ್ಯುತ್ ವಿತರಣಾ ಜಾಲ ನಿರ್ವಹಣೆ, ಹೈ-ವೋಲ್ಟೇಜ್ ತಂತಿ ದುರಸ್ತಿ ಮತ್ತು ಬೀದಿ ದೀಪಗಳಿಗೆ ಉಸ್ತುವಾರಿ.";
            } else if (dept.id === "bcp") {
              deptName = "ಬೆಂಗಳೂರು ನಗರ ಪೊಲೀಸ್ ಇಲಾಖೆ";
              deptDesc = "ಸಾರ್ವಜನಿಕ ಕಾನೂನು ಮತ್ತು ಸುವ್ಯವಸ್ಥೆ ಪಾಲನೆ, ಅತಿ ಗದ್ದಲ ನಿಯಂತ್ರಣ ಮತ್ತು ತುರ್ತು ನಾಗರಿಕ ಭದ್ರತಾ ಸ್ಪಂದನೆ.";
            }
          } else if (language === "hi") {
            if (dept.id === "bwssb") {
              deptName = "बेंगलुरु जल आपूर्ति और सीवरेज बोर्ड";
              deptDesc = "पूरे शहर में पीने के पानी का वितरण और कुशल जल निकासी प्रणालियों का संचालन नियंत्रण।";
            } else if (dept.id === "bbmp") {
              deptName = "बृहत बेंगलुरु महानगर पालिका";
              deptDesc = "सड़क के गड्ढों की मरम्मत, कचरा मुक्त शहर निर्माण, स्ट्रीट लाइट और नागरिक बुनियादी ढांचे का विनियमन।";
            } else if (dept.id === "bescom") {
              deptName = "बेंगलुरु बिजली आपूर्ति कंपनी लिमिटेड";
              deptDesc = "बिजली वितरण नेटवर्क रखरखाव, हाई-वोल्टेज लाइनों की मरम्मत और सार्वजनिक रोशनी की निगरानी।";
            } else if (dept.id === "bcp") {
              deptName = "बेंगलुरु शहर पुलिस विभाग";
              deptDesc = "सार्वजनिक कानून व्यवस्था का पालन, शोर नियंत्रण और आपातकालीन नागरिक सुरक्षा प्रतिक्रिया।";
            }
          }

          return (
            <div
              key={dept.id}
              className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Soft atmospheric background gradient matching department */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 opacity-10 blur-xl rounded-full" />

              <div className="space-y-4">
                {/* Department Identity Row */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center relative overflow-visible shrink-0 ${glowStyles}`}>
                    <div className={`glow-dot glow-${dept.glowColor} absolute w-14 h-14 rounded-full opacity-60 blur-md`} />
                    <IconComponent className="w-5 h-5 text-white relative z-10" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-headline-md font-mono text-base font-bold text-white">
                      {deptName}
                    </h3>
                    <span className="font-mono text-[10px] text-gray-500 tracking-widest block uppercase mt-0.5">
                      {dept.abbreviation} {language === "kn" ? "ನಿಯಂತ್ರಣ ಕೊಠಡಿ" : language === "hi" ? "नियंत्रण कक्ष" : "Control Room"}
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs text-gray-400 leading-relaxed">
                  {deptDesc}
                </p>

                {/* Email and Contact channel */}
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-[#000000]/20 px-3 py-2 rounded-xl border border-white/5">
                  <Envelope className="w-3.5 h-3.5" weight="duotone" />
                  <span className="truncate">{dept.contactEmail}</span>
                </div>
              </div>

              {/* Department Statistics Section */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 mt-6 text-xs">
                <div>
                  <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">{t.responseEfficiency}</span>
                  <span className="text-white font-mono font-bold block mt-0.5">{dept.stats.efficiency}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">{t.casesSolved}</span>
                  <span className="text-green-400 font-mono font-bold block mt-0.5">{dept.stats.solved}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-sans block uppercase text-[9px] tracking-widest">{t.pending}</span>
                  <span className="text-yellow-500 font-mono font-bold block mt-0.5">{dept.stats.pending}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SLA Integrity Policy Note */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 bg-[#000000]/30 space-y-2">
        <h4 className="font-headline-md font-mono text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" weight="duotone" />
          {language === "kn" ? "ಸ್ವಾಯತ್ತ ಕುಂದುಕೊರತೆ ನಿಯಮಾವಳಿಗಳು" : language === "hi" ? "स्वायत्त शिकायत प्रोटोकॉल" : "Autonomous Grievance Protocols"}
        </h4>
        <p className="font-sans text-xs text-gray-400 leading-relaxed">
          {language === "kn" 
            ? "ಮ್ಯಾನುಯಲ್ ಅಧಿಕಾರಶಾಹಿಯನ್ನು ತಪ್ಪಿಸಲು Nagarikdesu ನೇರ API ಸಂಪರ್ಕ ಮಾರ್ಗಗಳನ್ನು ಅವಲಂಬಿಸಿದೆ. ನಿಗದಿತ ೧೦ ದಿನಗಳ SLA ಮಿತಿ ಮೀರಿದ ವರದಿಗಳು ಸಿಟಿ ಕೌನ್ಸಿಲ್ ಒಂಬುಡ್ಸ್‌ಮನ್‌ಗಳಿಗೆ ಸ್ವಯಂಚಾಲಿತ ಎಚ್ಚರಿಕೆಯನ್ನು ಕಳುಹಿಸುತ್ತವೆ."
            : language === "hi"
            ? "मैन्युअल लालफीताशाही से बचने के लिए Nagarikdesu सीधे API एकीकरण चैनलों पर निर्भर करता है। मानक 10-दिवसीय SLA से अधिक होने वाली रिपोर्टें नगर परिषद लोकपालों को स्वचालित चेतावनी प्रेषित करती हैं।"
            : "Nagarikdesu relies on Direct API integration channels to bypass manual bureaucracy. Reports exceeding standard 10-day SLAs (Service Level Agreements) trigger auto-generated escalation notifications to City Council ombudsmen."
          }
        </p>
      </div>
    </div>
  );
}
