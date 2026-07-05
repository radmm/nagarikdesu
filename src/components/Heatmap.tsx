import { useState, useEffect, useRef } from "react";
import { CivicReport, IssueCategory, ReportStatus, UrgencyLevel } from "../types";
import { MapPin, Sparkle, Eye, Warning, Trash, Crosshair } from "@phosphor-icons/react";
import { TRANSLATIONS } from "../translations";
import L from "leaflet";

interface HeatmapProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  language?: "en" | "kn" | "hi";
}

// Seeded real-world mock reports based on user instructions across the 5 target cities
const SEEDED_RAW_REPORTS: Omit<CivicReport, "formalLetter">[] = [
  // Delhi
  {
    id: "del-w1",
    referenceId: "Ref: #DEL-W01",
    title: "Sewage Water Intrusion",
    description: "Water contamination and sewage line block causing backflow near Block C. Overlooked by DJB (Delhi Jal Board).",
    category: IssueCategory.WATER,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 28.6139, longitude: 77.2090, display_name: "Connaught Place, New Delhi", zone: "New Delhi Central" },
    department: "DJB",
    createdAt: "2026-07-04T12:00:00Z",
    daysActive: 1,
    communityScore: 245,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-01",
    isFollowUpDrafted: false
  },
  {
    id: "del-e1",
    referenceId: "Ref: #DEL-E01",
    title: "Substation Arc Flashing",
    description: "Critical high-voltage short-circuits in local residential substation. Monitored by BSES / Tata Power Delhi.",
    category: IssueCategory.ELECTRICITY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.UNDER_REVIEW,
    location: { latitude: 28.6250, longitude: 77.2340, display_name: "Mandi House, New Delhi", zone: "New Delhi East" },
    department: "BSES / Tata Power Delhi",
    createdAt: "2026-07-03T14:30:00Z",
    daysActive: 2,
    communityScore: 180,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-01",
    isFollowUpDrafted: false
  },
  {
    id: "del-r1",
    referenceId: "Ref: #DEL-R01",
    title: "Dangerous Ring Road Craters",
    description: "Extremely deep road craters and split asphalt causing major vehicle hazards. Under action by PWD Delhi.",
    category: IssueCategory.ROADS,
    urgency: UrgencyLevel.MEDIUM,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 28.5900, longitude: 77.1980, display_name: "Safdarjung Enclave, New Delhi", zone: "New Delhi South" },
    department: "PWD Delhi",
    createdAt: "2026-07-02T10:00:00Z",
    daysActive: 3,
    communityScore: 310,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-01",
    isFollowUpDrafted: false
  },
  {
    id: "del-s1",
    referenceId: "Ref: #DEL-S01",
    title: "Unsecured Chemical Dump",
    description: "Hazardous commercial waste containers left open next to public park walkway. Handled by PWD Delhi & Police.",
    category: IssueCategory.SAFETY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 28.6400, longitude: 77.1500, display_name: "Kirti Nagar, New Delhi", zone: "New Delhi West" },
    department: "PWD Delhi",
    createdAt: "2026-07-04T16:00:00Z",
    daysActive: 1,
    communityScore: 155,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-01",
    isFollowUpDrafted: false
  },

  // Mumbai
  {
    id: "bom-w1",
    referenceId: "Ref: #BOM-W01",
    title: "High-Volume Pipeline Burst",
    description: "Primary municipal main water pipeline rupture causing localized water logging. Handled by BMC.",
    category: IssueCategory.WATER,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 19.0760, longitude: 72.8777, display_name: "Bandra Kurla Complex, Mumbai", zone: "BKC Zone" },
    department: "BMC",
    createdAt: "2026-07-04T15:00:00Z",
    daysActive: 1,
    communityScore: 420,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-02",
    isFollowUpDrafted: false
  },
  {
    id: "bom-e1",
    referenceId: "Ref: #BOM-E01",
    title: "Fallen Overhead Power Lines",
    description: "Exposed distribution cables sparked on a crowded street margin during rains. Monitored by BEST.",
    category: IssueCategory.ELECTRICITY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.UNDER_REVIEW,
    location: { latitude: 19.0550, longitude: 72.8300, display_name: "Bandra West, Mumbai", zone: "Bandra Zone" },
    department: "BEST",
    createdAt: "2026-07-03T18:20:00Z",
    daysActive: 2,
    communityScore: 205,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-02",
    isFollowUpDrafted: false
  },
  {
    id: "bom-r1",
    referenceId: "Ref: #BOM-R01",
    title: "Sidewalk Asphalt Subsidence",
    description: "Major structural sidewalk collapse near a high-traffic pedestrian crossing. Under BMC action.",
    category: IssueCategory.ROADS,
    urgency: UrgencyLevel.MEDIUM,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 19.1100, longitude: 72.9000, display_name: "Powai, Mumbai", zone: "Powai Zone" },
    department: "BMC",
    createdAt: "2026-07-02T11:00:00Z",
    daysActive: 3,
    communityScore: 190,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-02",
    isFollowUpDrafted: false
  },
  {
    id: "bom-s1",
    referenceId: "Ref: #BOM-S01",
    title: "Open Stormwater Manholes",
    description: "Deep storm drain completely uncovered near a primary school crossing. Emergency hazard BMC.",
    category: IssueCategory.SAFETY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 19.0180, longitude: 72.8430, display_name: "Dadar, Mumbai", zone: "Dadar Central" },
    department: "BMC",
    createdAt: "2026-07-04T17:15:00Z",
    daysActive: 1,
    communityScore: 512,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-02",
    isFollowUpDrafted: false
  },

  // Bangalore
  {
    id: "blr-w1",
    referenceId: "Ref: #BLR-W01",
    title: "Sewer Flow Mixing with Borewell",
    description: "Direct sewage contamination leaking into local domestic fresh water borewell. Action required by BWSSB.",
    category: IssueCategory.WATER,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 12.9716, longitude: 77.5946, display_name: "Cubbon Park, Bengaluru", zone: "Zone Central" },
    department: "BWSSB",
    createdAt: "2026-07-04T08:00:00Z",
    daysActive: 1,
    communityScore: 350,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-03",
    isFollowUpDrafted: false
  },
  {
    id: "blr-e1",
    referenceId: "Ref: #BLR-E01",
    title: "Damaged Tilted Power Pole",
    description: "Primary transformer support pole listing heavily post strong storm. Supervised by BESCOM.",
    category: IssueCategory.ELECTRICITY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.UNDER_REVIEW,
    location: { latitude: 12.9300, longitude: 77.6100, display_name: "Koramangala, Bengaluru", zone: "Zone South" },
    department: "BESCOM",
    createdAt: "2026-07-03T10:15:00Z",
    daysActive: 2,
    communityScore: 280,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-03",
    isFollowUpDrafted: false
  },
  {
    id: "blr-r1",
    referenceId: "Ref: #BLR-R01",
    title: "100-Ft Road Structural Potholes",
    description: "Deep roadway fractures causing dangerous commuter bypass shifts on primary arterial corridor. Managed by BBMP.",
    category: IssueCategory.ROADS,
    urgency: UrgencyLevel.MEDIUM,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 12.9800, longitude: 77.6400, display_name: "Indiranagar, Bengaluru", zone: "Zone East" },
    department: "BBMP",
    createdAt: "2026-07-02T09:00:00Z",
    daysActive: 3,
    communityScore: 410,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-03",
    isFollowUpDrafted: false
  },
  {
    id: "blr-s1",
    referenceId: "Ref: #BLR-S01",
    title: "Hazardous Chemical Disposal",
    description: "Surgical waste packets dumped illicitly inside public recreational playground. Action pending with BBMP.",
    category: IssueCategory.SAFETY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 12.9100, longitude: 77.6000, display_name: "JP Nagar, Bengaluru", zone: "Zone South-West" },
    department: "BBMP",
    createdAt: "2026-07-04T14:22:00Z",
    daysActive: 1,
    communityScore: 175,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-03",
    isFollowUpDrafted: false
  },

  // Chennai
  {
    id: "maa-w1",
    referenceId: "Ref: #MAA-W01",
    title: "Sewage Odor in Municipal Taps",
    description: "Strong saline discolored sewage contaminants entering community main pipes. Under investigation by CMWSSB.",
    category: IssueCategory.WATER,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 13.0827, longitude: 80.2707, display_name: "George Town, Chennai", zone: "Chennai North" },
    department: "CMWSSB",
    createdAt: "2026-07-04T09:30:00Z",
    daysActive: 1,
    communityScore: 290,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-04",
    isFollowUpDrafted: false
  },
  {
    id: "maa-e1",
    referenceId: "Ref: #MAA-E01",
    title: "Exposed Corroded Feeder Pillar",
    description: "Power sub-feeder pillar heavily corroded, standing open in waterlogging region. Supervised by TANGEDCO.",
    category: IssueCategory.ELECTRICITY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.UNDER_REVIEW,
    location: { latitude: 13.0400, longitude: 80.2400, display_name: "T. Nagar, Chennai", zone: "Chennai South" },
    department: "TANGEDCO",
    createdAt: "2026-07-03T16:40:00Z",
    daysActive: 2,
    communityScore: 150,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-04",
    isFollowUpDrafted: false
  },
  {
    id: "maa-r1",
    referenceId: "Ref: #MAA-R01",
    title: "Damaged Concrete Bridge Slab",
    description: "Major concrete erosion and chunk losses exposing reinforcing steel on flyover support. Handled by GCC.",
    category: IssueCategory.ROADS,
    urgency: UrgencyLevel.MEDIUM,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 13.0300, longitude: 80.2600, display_name: "Mylapore, Chennai", zone: "Chennai Central" },
    department: "GCC",
    createdAt: "2026-07-02T14:15:00Z",
    daysActive: 3,
    communityScore: 310,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-04",
    isFollowUpDrafted: false
  },

  // Kolkata
  {
    id: "ccu-w1",
    referenceId: "Ref: #CCU-W01",
    title: "Standing Sludge Silt Blocks",
    description: "Deep industrial sludge blocking neighborhood exit drainage. Investigated by KMC.",
    category: IssueCategory.WATER,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 22.5726, longitude: 88.3639, display_name: "Howrah Bridge Approach, Kolkata", zone: "Kolkata West" },
    department: "KMC",
    createdAt: "2026-07-04T11:00:00Z",
    daysActive: 1,
    communityScore: 260,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-05",
    isFollowUpDrafted: false
  },
  {
    id: "ccu-e1",
    referenceId: "Ref: #CCU-E01",
    title: "Feeder Arc Discharge Sparking",
    description: "High tension electrical grid junction showering intermittent arcs onto public streets. Managed by CESC.",
    category: IssueCategory.ELECTRICITY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.UNDER_REVIEW,
    location: { latitude: 22.5300, longitude: 88.3700, display_name: "Ballygunge, Kolkata", zone: "Kolkata South" },
    department: "CESC",
    createdAt: "2026-07-03T19:00:00Z",
    daysActive: 2,
    communityScore: 320,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-05",
    isFollowUpDrafted: false
  },
  {
    id: "ccu-r1",
    referenceId: "Ref: #CCU-R01",
    title: "Asphalt Cavitation on Metro Side",
    description: "Pavement collapse creating a massive hollow below the concrete. Managed by KMC.",
    category: IssueCategory.ROADS,
    urgency: UrgencyLevel.MEDIUM,
    status: ReportStatus.SUBMITTED,
    location: { latitude: 22.5500, longitude: 88.3400, display_name: "Park Street, Kolkata", zone: "Kolkata Central" },
    department: "KMC",
    createdAt: "2026-07-02T15:30:00Z",
    daysActive: 3,
    communityScore: 405,
    needsHumanReview: false,
    reporterName: "System Auditor",
    reporterId: "AUD-05",
    isFollowUpDrafted: false
  }
];

const SEEDED_REPORTS: CivicReport[] = SEEDED_RAW_REPORTS.map((rep) => ({
  ...rep,
  formalLetter: `To whom it may concern,\n${rep.department} Administration,\n${rep.location.display_name}.\n\nSubject: Urgent Notification Regarding ${rep.title}\n\nWe wish to officially bring to your immediate attention the pending issue described as follows:\n${rep.description}\n\nOur local community represents 1500+ active citizen signatures on this digital registry. We request your rapid response to mitigate safety and environmental risks.\n\nSincerely,\nLocal Citizen Coalition & Supporters`
}));

export default function Heatmap({ reports, onSelectReport, language = "en" }: HeatmapProps) {
  const t = TRANSLATIONS[language];
  const [selectedPin, setSelectedPin] = useState<CivicReport | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Merge the seeded reports with live user-submitted reports
  // Make sure not to duplicate reports that might have same IDs
  const allReports = [
    ...SEEDED_REPORTS,
    ...reports.filter(r => !SEEDED_REPORTS.some(sr => sr.id === r.id || sr.title === r.title))
  ];

  // Helper to color markers
  const getMarkerColors = (cat: IssueCategory) => {
    switch (cat) {
      case IssueCategory.WATER:
        return {
          glow: "bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]",
          ring: "border-blue-400"
        };
      case IssueCategory.ELECTRICITY:
        return {
          glow: "bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]",
          ring: "border-purple-400"
        };
      case IssueCategory.ROADS:
        return {
          glow: "bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]",
          ring: "border-yellow-400"
        };
      case IssueCategory.SAFETY:
        return {
          glow: "bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]",
          ring: "border-red-400"
        };
      default:
        return {
          glow: "bg-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.6)]",
          ring: "border-teal-400"
        };
    }
  };

  // Generate Leaflet divIcon with custom glowing effect
  const createCustomMarkerIcon = (category: IssueCategory, isSelected: boolean) => {
    const { glow, ring } = getMarkerColors(category);
    const sizeClass = isSelected ? "w-8 h-8" : "w-6 h-6";
    const dotSize = isSelected ? "w-4 h-4" : "w-3 h-3";

    return L.divIcon({
      className: "custom-glowing-marker",
      html: `
        <div class="relative flex items-center justify-center ${sizeClass}">
          <div class="absolute inset-0 rounded-full border-2 ${ring} opacity-75"></div>
          <div class="absolute ${dotSize} rounded-full ${glow}"></div>
        </div>
      `,
      iconSize: isSelected ? [32, 32] : [24, 24],
      iconAnchor: isSelected ? [16, 16] : [12, 12]
    });
  };

  // Manual trigger to locate user
  const locateUser = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 12);
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation query failed", error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      center: [22.9, 78.6], // Centered Zoomed-out view of India
      zoom: 5,
      zoomControl: false, // Customized position or styled standard controls
      attributionControl: true
    });

    // Add CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18,
      minZoom: 3
    }).addTo(map);

    // Zoom controls styled
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    // Trigger Geolocation instantly when a real user enters map if they have dynamic reports
    // Or if reports length changes (such as a new submission)
    const hasLiveReports = reports.some(r => !SEEDED_REPORTS.some(sr => sr.id === r.id || sr.title === r.title));
    if (hasLiveReports && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 12);
        },
        undefined,
        { timeout: 4000 }
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers when reports or selection changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear existing markers from map
    Object.keys(markersRef.current).forEach((key) => {
      markersRef.current[key].remove();
    });
    markersRef.current = {};

    // Populate fresh markers
    allReports.forEach((rep) => {
      const isSelected = selectedPin?.id === rep.id;
      const icon = createCustomMarkerIcon(rep.category, isSelected);
      
      const marker = L.marker([rep.location.latitude, rep.location.longitude], { icon })
        .addTo(map)
        .on("click", () => {
          setSelectedPin(rep);
          // Gently pan map to center on selected pin
          map.panTo([rep.location.latitude, rep.location.longitude]);
        });

      markersRef.current[rep.id] = marker;
    });
  }, [allReports, selectedPin]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none uppercase">
            {t.mapTitle}
          </h2>
          <p className="font-sans text-sm text-gray-400 mt-2">
            {language === "kn" 
              ? "ಭಾರತದ ಪ್ರಮುಖ ನಗರಗಳಲ್ಲಿನ ನಾಗರಿಕ ದೂರುಗಳ ಲೈವ್ ವಿಶ್ಲೇಷಣೆ." 
              : language === "hi" 
              ? "भारत के प्रमुख शहरों में नागरिक मुद्दों का लाइव इंटरैक्टिव मानचित्र।" 
              : "Live interactive mapping of citizen grievances across major urban nodes of India."}
          </p>
        </div>

        {/* Geolocation Button */}
        <button
          onClick={locateUser}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all duration-300 disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          <Crosshair className="w-4 h-4" weight="duotone" />
          <span>{isLocating ? "Acquiring Fix..." : "My Location"}</span>
        </button>
      </div>

      {/* Map Board */}
      <div className="glass-card rounded-[32px] overflow-hidden border border-white/10 relative bg-[#050508] p-1.5 h-[500px]">
        {/* Ambient Top Left Information Display */}
        <div className="absolute top-5 left-5 z-[400] bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 font-mono text-[9px] text-gray-400 space-y-0.5 pointer-events-none select-none">
          <div className="font-bold text-purple-400">COMMAND CONTROL HUB</div>
          <div>CENTRALIZED GEOGRAPHY OVERVIEW</div>
          <div>ACTIVE NODES: {allReports.length}</div>
        </div>

        {/* Leaflet Map Target Node */}
        <div ref={mapContainerRef} className="w-full h-full rounded-[26px] overflow-hidden z-0" />

        {/* Popover Card Overlay for Selected Marker */}
        {selectedPin && (
          <div className="absolute inset-x-5 bottom-5 z-[400] glass-card rounded-2xl p-4 bg-black/90 backdrop-blur-2xl border border-white/15 animate-fade-in flex flex-col justify-between gap-4">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest block font-bold">
                  {selectedPin.location.display_name.split(",")[0]} • {selectedPin.referenceId}
                </span>
                <h4 className="font-headline-md font-mono text-sm font-bold text-white mt-1 truncate">
                  {selectedPin.title}
                </h4>
                <p className="font-sans text-xs text-gray-300 line-clamp-2 mt-1">
                  {selectedPin.description}
                </p>
                <div className="mt-2 text-[11px] font-mono text-gray-400">
                  <span className="text-gray-500">AUTHORITY: </span>
                  <span className="text-amber-400 font-bold">{selectedPin.department}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <Trash className="w-4 h-4" weight="duotone" />
              </button>
            </div>

            {/* Stat rows & Inspect letter button */}
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-sans font-bold">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                {selectedPin.communityScore} {language === "kn" ? "ಬೆಂಬಲಿಗರು" : language === "hi" ? "समर्थक जुड़े" : "Advocates Engaged"}
              </div>
              <button
                onClick={() => onSelectReport(selectedPin)}
                className="flex items-center gap-1 px-4 py-1.5 bg-white text-black font-sans font-bold text-[11px] rounded-full hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" weight="bold" />
                <span>{t.viewDetails}</span>
              </button>
            </div>
          </div>
        )}
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
