import React, { useState, useEffect } from "react";
import { CivicReport, IssueCategory, UrgencyLevel, Coordinates } from "../types";
import { Mic, MicOff, MapPin, Sparkles, Send, FileImage, X, AlertCircle, RefreshCw } from "lucide-react";
import { TRANSLATIONS } from "../translations";

interface NewReportProps {
  onSubmitReport: (reportData: {
    description: string;
    location: Coordinates;
    mediaUrl?: string;
  }) => Promise<CivicReport | null>;
  language?: "en" | "kn" | "hi";
}

export default function NewReport({ onSubmitReport, language = "en" }: NewReportProps) {
  const t = TRANSLATIONS[language];
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Setup Web Speech API for real-time speech-to-text transcription
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = language === "kn" ? "kn-IN" : language === "hi" ? "hi-IN" : "en-IN";

      rec.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setSpeechError(null);
          setDescription((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${finalTranscript}` : `${prev}${finalTranscript}`;
          });
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e.error, e);
        let message = "Speech recognition error. Please check your microphone.";
        if (e.error === "not-allowed") {
          message = "Microphone access blocked. Please allow microphone permission or click the 'Open in a New Tab' button (top-right of preview window) to bypass iframe security.";
        } else if (e.error === "network") {
          message = "Network error. Speech recognition requires an active internet connection.";
        } else if (e.error === "no-speech") {
          message = "No speech detected. Please speak closer to your microphone.";
        }
        setSpeechError(message);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, [language]);

  // Manual input fields for region/street address and ward/zone overrides
  const [manualRegion, setManualRegion] = useState("");
  const [manualZone, setManualZone] = useState("");

  useEffect(() => {
    if (location) {
      setManualRegion(location.display_name);
      setManualZone(location.zone);
    }
  }, [location]);

  // Live preview matches
  const [liveCategory, setLiveCategory] = useState<IssueCategory>(IssueCategory.OTHER);
  const [liveUrgency, setLiveUrgency] = useState<UrgencyLevel>(UrgencyLevel.ROUTINE);
  const [liveDept, setLiveDept] = useState("bbmp");

  // Voice recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Geolocation trigger on mount
  useEffect(() => {
    detectLocation();
  }, []);

  // Simple rule-based live analysis as the user types to update the Live preview card
  useEffect(() => {
    const text = description.toLowerCase();
    
    // Default
    let cat = IssueCategory.OTHER;
    let urg = UrgencyLevel.ROUTINE;
    let dept = "bbmp";

    if (text.includes("water") || text.includes("leak") || text.includes("sewage") || text.includes("drain") || text.includes("pipe") || text.includes("burst") || text.includes("flooding") || text.includes("flood")) {
      cat = IssueCategory.WATER;
      dept = "bwssb";
      urg = text.includes("burst") || text.includes("flooding") || text.includes("major") ? UrgencyLevel.CRITICAL : UrgencyLevel.URGENT;
    } else if (text.includes("pothole") || text.includes("road") || text.includes("street") || text.includes("bridge") || text.includes("pavement") || text.includes("transit") || text.includes("metro") || text.includes("bus")) {
      cat = IssueCategory.ROADS;
      dept = "bbmp";
      urg = text.includes("accident") || text.includes("danger") ? UrgencyLevel.CRITICAL : UrgencyLevel.MEDIUM;
    } else if (text.includes("electricity") || text.includes("power") || text.includes("blackout") || text.includes("outage") || text.includes("spark") || text.includes("transformer") || text.includes("wire") || text.includes("voltage") || text.includes("streetlight") || text.includes("light")) {
      cat = IssueCategory.ELECTRICITY;
      dept = "bescom";
      urg = text.includes("spark") || text.includes("transformer") || text.includes("wires") ? UrgencyLevel.CRITICAL : UrgencyLevel.URGENT;
    } else if (text.includes("safety") || text.includes("police") || text.includes("theft") || text.includes("fight") || text.includes("noise") || text.includes("illegal") || text.includes("assault") || text.includes("security") || text.includes("dumping") || text.includes("trash") || text.includes("rubbish")) {
      cat = IssueCategory.SAFETY;
      dept = "police";
      urg = text.includes("hazardous") || text.includes("weapon") || text.includes("dumping") ? UrgencyLevel.URGENT : UrgencyLevel.MEDIUM;
    }

    if (text.includes("emergency") || text.includes("critical") || text.includes("deadly") || text.includes("severe")) {
      urg = UrgencyLevel.CRITICAL;
    }

    setLiveCategory(cat);
    setLiveUrgency(urg);
    setLiveDept(dept);
  }, [description]);

  const detectLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setLocation({
        latitude: 12.9716,
        longitude: 77.5946,
        display_name: "Indiranagar Central Grid, Bengaluru",
        zone: "Zone 03-A"
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: Coordinates = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          display_name: "Locating area...",
          zone: "Identifying Grid..."
        };

        try {
          // Keyless Nominatim OSM reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1`
          );
          if (response.ok) {
            const data = await response.json();
            const road = data.address?.road || data.address?.suburb || "Unnamed Road";
            const city = data.address?.city || data.address?.town || "Bengaluru";
            const postcode = data.address?.postcode || "560001";
            coords.display_name = `${road}, ${city} - ${postcode}`;
            coords.zone = `Zone 0${Math.floor(Math.random() * 9 + 1)}-A`;
          } else {
            throw new Error("OSM reverse geolocation failed");
          }
        } catch {
          coords.display_name = "Richmond Town, Bengaluru - 560025";
          coords.zone = "Zone 02-B";
        }
        setLocation(coords);
        setIsLocating(false);
      },
      () => {
        // Fallback
        setLocation({
          latitude: 12.9716,
          longitude: 77.5946,
          display_name: "Koramanagala 4th Block, Bengaluru - 560034",
          zone: "Zone 04-A"
        });
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  // Real Voice recording to Text using Web Speech API
  const toggleRecording = () => {
    if (isRecording) {
      if (recognition) {
        recognition.stop();
      }
      setIsRecording(false);
    } else {
      setSpeechError(null);
      if (recognition) {
        setIsRecording(true);
        try {
          recognition.start();
        } catch (e: any) {
          console.error(e);
          setIsRecording(false);
          setSpeechError("Failed to start speech recognition. " + (e.message || ""));
        }
      } else {
        setSpeechError("Speech recognition (Web Speech API) is not supported or active in your browser context. Please make sure you are in a supported browser (Chrome, Safari, Edge) and not blocking permission.");
      }
    }
  };

  const handleSimulateText = () => {
    setSpeechError(null);
    const sampleTranscripts = [
      "Major power failure in Sector 7. Sparks coming out from the low voltage transformer on the street corner.",
      "A huge water pipe burst near the transit terminal and it is flooding the whole road.",
      "Illegal chemical dumping happening under the flyover bridge. Commercial trucks dump garbage at midnight.",
      "Deep dangerous potholes at Maple & 4th Street intersection causing massive traffic jams and accidents."
    ];
    const randomText = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
    setDescription(randomText);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    const activeLocation: Coordinates = {
      latitude: location?.latitude || 12.9716,
      longitude: location?.longitude || 77.5946,
      display_name: manualRegion.trim() || location?.display_name || "Indiranagar, Bengaluru",
      zone: manualZone.trim() || location?.zone || "Zone 03-A"
    };

    const newReport = await onSubmitReport({
      description,
      location: activeLocation,
      mediaUrl: mediaPreview || undefined
    });

    setSubmitting(false);
    if (newReport) {
      setDescription("");
      clearMedia();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none uppercase">
          {t.submitCivicComplaint}
        </h2>
        <p className="font-sans text-sm text-gray-400 mt-2">
          {t.newReportSubtitle}
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Geolocation Tag Card with Manual Overrides */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 bg-[#000000]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-sans text-[10px] text-gray-400 uppercase tracking-widest block">{t.autoDetectedCoords}</span>
                {isLocating ? (
                  <span className="text-xs font-sans text-purple-400 flex items-center gap-1.5 mt-0.5">
                    <RefreshCw className="w-3.5 h-3.5" /> {t.gpsPinpointing}
                  </span>
                ) : (
                  <span className="text-xs font-sans text-white font-bold block mt-0.5">
                    {location?.display_name || t.pinpointPending} ({location?.zone || "Detecting Sector..."})
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={detectLocation}
              className="p-2 hover:bg-white/5 active:scale-90 transition-all rounded-full text-gray-400 hover:text-white"
              title="Refresh GPS location"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="border-t border-white/5 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-sans">
                {t.manualRegionLabel}
              </label>
              <input
                type="text"
                value={manualRegion}
                onChange={(e) => setManualRegion(e.target.value)}
                placeholder={t.manualRegionPlaceholder}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 font-sans text-xs transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-sans">
                {t.manualZoneLabel}
              </label>
              <input
                type="text"
                value={manualZone}
                onChange={(e) => setManualZone(e.target.value)}
                placeholder={t.manualZonePlaceholder}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 font-sans text-xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Text/Voice Input Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="font-sans text-[11px] text-gray-400 uppercase tracking-widest">{t.citizenStatement}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-bold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 border border-purple-500/20 transition-all active:scale-95"
                title="Populate dynamic complaint details instantly for quick testing"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Text</span>
              </button>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-bold transition-all ${
                  isRecording 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{t.stopBtn} ({recordingSeconds}s)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>{t.voiceInput}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {isRecording ? (
            <div className="h-28 flex flex-col items-center justify-center text-center space-y-3 bg-[#050505] rounded-xl border border-dashed border-red-500/20 p-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <Mic className="w-5 h-5" />
              </div>
              <p className="font-sans text-xs text-red-400 font-bold tracking-wider uppercase">
                {t.systemListening}
              </p>
            </div>
          ) : (
            <>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder={t.textPlaceholder}
                className="w-full h-32 bg-transparent border-0 focus:ring-0 text-white placeholder-gray-600 font-sans text-sm resize-none"
                required
              />
              {speechError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-sans text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Voice Input Restricted:</span>
                    {speechError}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Media Upload and Preview Card */}
        <div className="glass-card rounded-2xl p-5">
          <span className="font-sans text-[11px] text-gray-400 uppercase tracking-widest block mb-3">{t.attachProof}</span>
          
          {mediaPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10 h-40">
              <img src={mediaPreview} alt="Civic proof" className="w-full h-full object-cover grayscale brightness-75" />
              <button
                type="button"
                onClick={clearMedia}
                className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-black text-white rounded-full transition-colors border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-24 rounded-xl border border-dashed border-white/10 hover:border-purple-500/40 cursor-pointer bg-white/5 transition-all text-gray-400 hover:text-white">
              <FileImage className="w-6 h-6 mb-2 text-gray-500" />
              <span className="text-xs font-sans">{t.uploadPlaceholder}</span>
              <input type="file" accept="image/*" onChange={handleMediaChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Live Category and Urgency Preview Indicator */}
        {description.trim().length > 4 && (
          <div className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-purple-950/10 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              {t.liveParsing}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">{t.detectedClassification}</span>
                <span className="text-white font-sans font-bold">{liveCategory}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">{t.urgencyMatrix}</span>
                <span className="text-white font-sans font-bold">{liveUrgency}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">{t.responsibleAuthority}</span>
                <span className="text-white font-sans font-bold uppercase">{liveDept.toUpperCase()} {t.controlRoom}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !description.trim() || isLocating}
          className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 rounded-full font-headline-md font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>{t.aiAnalyzing}</span>
            </>
          ) : (
            <>
              <span>{t.submitReportBtn}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
