import { CivicReport, GovernmentDepartment, IssueCategory, ReportStatus, UrgencyLevel, NotificationAlert } from "./types";

export const GOVERN_DEPARTMENTS: GovernmentDepartment[] = [
  {
    id: "bbmp",
    name: "Bruhat Bengaluru Mahanagara Palike",
    abbreviation: "BBMP",
    icon: "engineering",
    description: "Responsible for municipal infrastructure, roads, zoning, and public utilities across Bengaluru.",
    contactEmail: "commissioner@bbmp.gov.in",
    stats: { solved: 842, pending: 154, efficiency: "84%" },
    glowColor: "yellow"
  },
  {
    id: "bwssb",
    name: "Bengaluru Water Supply and Sewerage Board",
    abbreviation: "BWSSB",
    icon: "water_drop",
    description: "Sourcing, purification, and distribution of water and sewage disposal management.",
    contactEmail: "chairman@bwssb.gov.in",
    stats: { solved: 612, pending: 89, efficiency: "87%" },
    glowColor: "blue"
  },
  {
    id: "bescom",
    name: "Bangalore Electricity Supply Company",
    abbreviation: "BESCOM",
    icon: "electric_bolt",
    description: "Power distribution and electrical grid maintenance across urban and rural zones.",
    contactEmail: "md@bescom.co.in",
    stats: { solved: 1104, pending: 42, efficiency: "96%" },
    glowColor: "purple"
  },
  {
    id: "police",
    name: "Bengaluru City Police Department",
    abbreviation: "BCP",
    icon: "local_police",
    description: "Maintenance of public safety, law enforcement, traffic management, and emergency response.",
    contactEmail: "cp.blr@ksp.gov.in",
    stats: { solved: 1543, pending: 112, efficiency: "93%" },
    glowColor: "red"
  }
];

export const INITIAL_REPORTS: CivicReport[] = [
  {
    id: "rep-001",
    referenceId: "Ref: #4402",
    title: "Power Grid Surge",
    description: "Sector 7 primary relay stabilized. Citizens reported immediate restoration following voltage spike that damaged household appliances.",
    category: IssueCategory.ELECTRICITY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.RESOLVED,
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      display_name: "Sector 7, HSR Layout, Bengaluru",
      zone: "Zone 07-B"
    },
    department: "bescom",
    formalLetter: `To the Assistant Executive Engineer,\nBangalore Electricity Supply Company (BESCOM),\nSector 7 Substation, Bengaluru.\n\nSubject: Urgent Notification and Remedy Request for Electrical Grid Over-Surges in Sector 7.\n\nDear Sir/Madam,\n\nThis formal letter is compiled to notify you regarding repeated and highly dangerous voltage spikes originating from the primary grid transformer of Sector 7. Over the course of the past 48 hours, several residential buildings experienced power grid surges exceeding standard thresholds, resulting in the destruction of household appliances and posing a critical fire hazard.\n\nUnder safety protocols outlined in the Indian Electricity Act (Section 68), standard maintenance of low-tension and high-tension distribution relays is mandated to ensure public safety.\n\nWe kindly request immediate diagnostics on the Sector 7 primary relay, recalibration of the phase balances, and a formal safety compliance statement.\n\nSincerely,\nMarcus Chen & HSR Sector 7 Community Group`,
    createdAt: "2026-06-24T10:00:00-07:00",
    daysActive: 1,
    communityScore: 1204,
    needsHumanReview: false,
    reporterName: "Marcus Chen",
    reporterId: "8824-X",
    isFollowUpDrafted: false
  },
  {
    id: "rep-002",
    referenceId: "Ref: #3911",
    title: "Automated Transit Delay",
    description: "Line B experiencing logic processing delays. Major crowds backing up at central terminal, platform sensors malfunctioning.",
    category: IssueCategory.ROADS,
    urgency: UrgencyLevel.MEDIUM,
    status: ReportStatus.UNDER_REVIEW,
    location: {
      latitude: 12.9616,
      longitude: 77.6101,
      display_name: "Indiranagar Metro Terminal, Bengaluru",
      zone: "Zone 03-A"
    },
    department: "bbmp",
    formalLetter: `To the Chief Infrastructure Officer,\nBruhat Bengaluru Mahanagara Palike (BBMP) Transit Division,\nBengaluru.\n\nSubject: Urgent Request for Systemic Diagnostics on Line B Metro Terminals.\n\nDear Sir,\n\nWe bring to your urgent attention the continuous logic delays and hardware malfunction on metro Line B, specifically affecting Indiranagar Terminal. Automated fare gates and platform edge sensors are experiencing massive lag, causing dangerous bottleneck crowds during peak hours.\n\nPrompt action is necessary to deploy backup technicians to recalibrate station gateway logs.\n\nSincerely,\nIndiranagar Commuter Welfare Council`,
    createdAt: "2026-06-22T14:30:00-07:00",
    daysActive: 12,
    communityScore: 840,
    needsHumanReview: false,
    reporterName: "Marcus Chen",
    reporterId: "8824-X",
    isFollowUpDrafted: true,
    followUpLetter: `Subject: SECOND NOTICE: Automated Transit Delay - Unresolved for 12 Days (Ref: #3911)\n\nTo the Chief Infrastructure Officer,\nBBMP Transit Division,\n\nDear Sir,\n\nThis is an automated legal escalation regarding the unresolved issue at Indiranagar Metro Terminal reported on June 22, 2026. This ticket has remained in 'Under Review' status for over 12 days with no diagnostic output or safety confirmation.\n\nUnder City Transit Ordinance 14-C, commuters are entitled to safe and unhindered station passage. We request an immediate update, failing which this matter will be escalated to the Public Grievance Ombudsman.\n\nSincerely,\nCommunity Legal Automation Engine on behalf of commuters`
  },
  {
    id: "rep-003",
    referenceId: "Ref: #2884",
    title: "Smart Lighting Leak",
    description: "Excessive lumen output in Residential Zone 3. Outdoor fixtures not powering down during daylight hours, wasting electricity.",
    category: IssueCategory.ELECTRICITY,
    urgency: UrgencyLevel.ROUTINE,
    status: ReportStatus.RESOLVED,
    location: {
      latitude: 12.9812,
      longitude: 77.5844,
      display_name: "Sadashivanagar, Residential Zone 3, Bengaluru",
      zone: "Zone 03-C"
    },
    department: "bescom",
    formalLetter: `To BESCOM Municipal Lighting Branch,\nBengaluru.\n\nSubject: Smart Streetlight Malfunction in Sadashivanagar.\n\nDear Sirs,\n\nWe would like to report that several smart LED streetlight posts along 8th Main Road, Sadashivanagar remain fully illuminated during broad daylight, representing an ongoing waste of municipal funds and electrical energy.\n\nRecalibration of the photocell sensors is requested to reinstate correct day/night toggles.\n\nBest Regards,\nResidents of Sadashivanagar`,
    createdAt: "2026-06-18T08:15:00-07:00",
    daysActive: 3,
    communityScore: 156,
    needsHumanReview: false,
    reporterName: "Marcus Chen",
    reporterId: "8824-X",
    isFollowUpDrafted: false
  },
  {
    id: "rep-004",
    referenceId: "Ref: CV-2024-089",
    title: "Formal Notice: Pavement Repair Request",
    description: "Persistent hazardous road conditions located at the intersection of Maple and 4th Street. Significant road depression causing vehicular alignment problems.",
    category: IssueCategory.ROADS,
    urgency: UrgencyLevel.CRITICAL,
    status: ReportStatus.ACKNOWLEDGED,
    location: {
      latitude: 12.9734,
      longitude: 77.6412,
      display_name: "Maple & 4th Street, HAL Road, Bengaluru",
      zone: "Zone 04-A"
    },
    department: "bbmp",
    formalLetter: `To the Department of Public Works,\nBruhat Bengaluru Mahanagara Palike (BBMP),\n\nSubject: Formal Notice: Pavement Repair Request at Maple & 4th Street\n\nDear Sirs,\n\nThis document serves as a formal notification regarding the persistent hazardous pavement conditions located at the intersection of Maple and 4th Street. Despite multiple informal reports via the standard municipal portal, no remedial action has been observed.\n\nUnder City Ordinance 44-B, the maintenance of pedestrian pathways and asphalt surfaces is mandated for public safety. The present crater is approximately 1.5 meters wide, posing an imminent danger of serious accident.\n\nPlease accept this as a formal request for emergency repairs.\n\nSincerely,\nHAL Road Residents Collective`,
    createdAt: "2026-06-20T09:00:00-07:00",
    daysActive: 15,
    communityScore: 1420,
    needsHumanReview: false,
    reporterName: "Marcus Chen",
    reporterId: "8824-X",
    isFollowUpDrafted: true,
    followUpLetter: `Subject: EMERGENCY REMINDER: Unremedied Pavement Pothole (Ref: CV-2024-089)\n\nTo the Department of Public Works, BBMP,\n\nThis is a formal automated escalation of the critical road failure reported at Maple & 4th Street. This report has remained unresolved for 15 days under 'Acknowledged' status with zero active dispatch.\n\nWe demand immediate tarmac leveling. Failure to schedule active repair in 48 hours will trigger a formal petition filing to the City Commissioner.\n\nSincerely,\nCommunity Advocacy Bot (CivicAI)`
  },
  {
    id: "rep-005",
    referenceId: "Ref: #5112",
    title: "Water Main Rupture: Sector 9",
    description: "Significant flooding reported near the transport hub. Water pressure drops affecting 400 households, drinking water contaminated with debris.",
    category: IssueCategory.WATER,
    urgency: UrgencyLevel.CRITICAL,
    status: ReportStatus.ACKNOWLEDGED,
    location: {
      latitude: 12.9304,
      longitude: 77.6189,
      display_name: "Sector 9 Transport Junction, Bengaluru",
      zone: "Zone 09-D"
    },
    department: "bwssb",
    formalLetter: `To the Executive Engineer,\nBengaluru Water Supply and Sewerage Board (BWSSB),\nSouth Zone, Bengaluru.\n\nSubject: Emergency Water Main Burst in Sector 9 - Immediate Intervention Mandate.\n\nDear Sir,\n\nThis is a formal communication of a water supply crisis. The primary 18-inch drinking water main pipeline running below Sector 9 Transport Junction ruptured today. Hundreds of gallons of clean municipal water are being lost per minute, flooding streets and reducing utility pressure to zero in over 400 adjacent households.\n\nUnder the BWSSB Act, provision of safe, pressurized drinking water is a core statutory duty.\n\nWe urge your field teams to isolate the burst pipe section immediately and initiate emergency welding repairs.\n\nSincerely,\nSector 9 Residents Association`,
    createdAt: "2026-07-04T18:00:00-07:00",
    daysActive: 1,
    communityScore: 1350,
    needsHumanReview: false,
    reporterName: "Meera Nair",
    reporterId: "4491-A",
    isFollowUpDrafted: false
  },
  {
    id: "rep-006",
    referenceId: "Ref: #1004",
    title: "Illegal Trash Dumping: Flyover Bridge 11",
    description: "Commercial building trucks dumping hazardous industrial waste under Flyover Bridge 11 at midnight, causing severe health hazards.",
    category: IssueCategory.SAFETY,
    urgency: UrgencyLevel.URGENT,
    status: ReportStatus.RESOLVED,
    location: {
      latitude: 12.9554,
      longitude: 77.5712,
      display_name: "Bridge 11, Outer Ring Road, Bengaluru",
      zone: "Zone 11-A"
    },
    department: "police",
    formalLetter: `To the Police Inspector,\nCity Sanitation Police Force / Traffic Police Division,\nBengaluru.\n\nSubject: Formal Complaint regarding Midnight Industrial Waste Dumping at Flyover Bridge 11.\n\nDear Sir/Madam,\n\nI am compiling this official report to draw attention to recurring garbage disposal violations under flyover bridge 11. Over the last two weeks, heavy commercial dumper trucks have been offloading plastic and organic chemical wastes on public land under the cover of darkness.\n\nThis action directly violates the Environmental Protection Act and Karnataka Municipal Solid Waste Rules. We request continuous surveillance cameras installed at the node and immediate cleanup of the site.\n\nSincerely,\nBridge 11 Neighborhood Committee`,
    createdAt: "2026-06-30T23:50:00-07:00",
    daysActive: 5,
    communityScore: 1052,
    needsHumanReview: false,
    reporterName: "Rajesh Kumar",
    reporterId: "5109-Z",
    isFollowUpDrafted: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: "notif-001",
    title: "Critical Overlap Resolved",
    message: "HSR Layout Sector 7 power grid surge ticket #4402 has been marked as RESOLVED by BESCOM control. Thank you for reporting!",
    time: "2 hours ago",
    type: "success",
    glowColor: "green",
    read: false
  },
  {
    id: "notif-002",
    title: "Water Crisis Acknowledged",
    message: "BWSSB engineers have dispatched a critical response unit to Sector 9 Transport Junction to patch water main #5112.",
    time: "5 hours ago",
    type: "info",
    glowColor: "blue",
    read: false
  },
  {
    id: "notif-003",
    title: "Auto-Escalation Drafted",
    message: "No action detected on Maple & 4th Street repair ticket #089 for 15 days. CivicAI has automatically drafted a legal escalation follow-up notice.",
    time: "1 day ago",
    type: "warning",
    glowColor: "purple",
    read: true
  },
  {
    id: "notif-004",
    title: "Critical Community Mass",
    message: "Your reported Transit Delay #3911 reached 800 community signatures! Pressure score increased to 82%. This will be shared with the District Council.",
    time: "2 days ago",
    type: "alert",
    glowColor: "red",
    read: true
  }
];
