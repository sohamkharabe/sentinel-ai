"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useOperationalStore } from "@/lib/operational-store";

type AlertSeverity = "CRITICAL" | "HIGH" | "MODERATE";
type AlertStatus =
  | "NEW"
  | "ACKNOWLEDGED"
  | "MONITORING"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";
type AlertSource =
  | "Flood Monitoring"
  | "Disease Surveillance"
  | "Incident Report"
  | "District Risk";

type Alert = {
  id: string;
  incidentId?: string;
  title: string;
  district: string;
  severity: AlertSeverity;
  priority: "CRITICAL" | "HIGH" | "MODERATE";
  source: AlertSource;
  status: AlertStatus;
  createdAt: string;
  recommendedResponse: string;
  assignedTeam: string;
  description: string;
};

const DISTRICT_OPTIONS = [
  "All Districts",
  "Lakhimpur",
  "Tinsukia",
  "Dibrugarh",
  "Jorhat",
  "Sivasagar",
  "Sonitpur",
] as const;

const SEVERITY_OPTIONS = [
  "All Severity",
  "CRITICAL",
  "HIGH",
  "MODERATE",
] as const;

const STATUS_OPTIONS = [
  "All Status",
  "NEW",
  "ACKNOWLEDGED",
  "MONITORING",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
] as const;

const SOURCE_OPTIONS = [
  "All Sources",
  "Flood Monitoring",
  "Disease Surveillance",
  "Incident Report",
  "District Risk",
] as const;

const TEAM_OPTIONS = [
  "District Emergency Control Room",
  "District Magistrate Emergency Cell",
  "District Health Officer",
  "State Emergency Operations Centre",
] as const;

const initialAlerts: Alert[] = [
  {
    id: "ALT-1001",
    title: "Lakhimpur floodwater rise",
    district: "Lakhimpur",
    severity: "CRITICAL",
    priority: "CRITICAL",
    source: "Flood Monitoring",
    status: "NEW",
    createdAt: "2026-08-12 06:15",
    recommendedResponse: "Mobilize rescue teams, flood barriers, and immediate evacuation support for low-lying hamlets.",
    assignedTeam: "District Emergency Control Room",
    description: "Water levels continue to rise near riverbank settlements, threatening access roads and household safety.",
  },
  {
    id: "ALT-1002",
    title: "Tinsukia illness cluster",
    district: "Tinsukia",
    severity: "HIGH",
    priority: "HIGH",
    source: "Disease Surveillance",
    status: "NEW",
    createdAt: "2026-08-12 05:40",
    recommendedResponse: "Deploy medical officers and rapid disease screening kits to affected clusters.",
    assignedTeam: "District Health Officer",
    description: "Several households are reporting fever and respiratory symptoms with elevated cluster activity in the district.",
  },
  {
    id: "ALT-1003",
    title: "Dibrugarh bridge damage",
    district: "Dibrugarh",
    severity: "CRITICAL",
    priority: "CRITICAL",
    source: "Incident Report",
    status: "NEW",
    createdAt: "2026-08-12 04:50",
    recommendedResponse: "Restrict heavy vehicle movement and deploy rescue units to assess structural integrity.",
    assignedTeam: "District Magistrate Emergency Cell",
    description: "Critical structural damage has been reported on a key bridge segment near NH-37 affecting connectivity.",
  },
  {
    id: "ALT-1004",
    title: "Jorhat water level rise",
    district: "Jorhat",
    severity: "HIGH",
    priority: "HIGH",
    source: "Flood Monitoring",
    status: "ACKNOWLEDGED",
    createdAt: "2026-08-11 23:10",
    recommendedResponse: "Increase monitoring along the embankment and prepare evacuation support for vulnerable villages.",
    assignedTeam: "District Emergency Control Room",
    description: "Water inflow near drainage channels has increased, creating local inundation risk for surrounding communities.",
  },
  {
    id: "ALT-1005",
    title: "Sivasagar fever cluster",
    district: "Sivasagar",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "Disease Surveillance",
    status: "ACKNOWLEDGED",
    createdAt: "2026-08-11 21:55",
    recommendedResponse: "Continue surveillance and community outreach with focused vector-control measures.",
    assignedTeam: "District Health Officer",
    description: "Community health teams are reviewing rising fever reports across low-lying households in the district.",
  },
  {
    id: "ALT-1006",
    title: "Sonitpur district risk escalation",
    district: "Sonitpur",
    severity: "HIGH",
    priority: "HIGH",
    source: "District Risk",
    status: "ACKNOWLEDGED",
    createdAt: "2026-08-11 20:35",
    recommendedResponse: "Escalate district coordination for shelter prepositioning and vulnerable family outreach.",
    assignedTeam: "State Emergency Operations Centre",
    description: "Risk indicators for flooding and access disruption have increased across the district’s high-exposure zones.",
  },
  {
    id: "ALT-1007",
    title: "Lakhimpur road block incident",
    district: "Lakhimpur",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "Incident Report",
    status: "ACKNOWLEDGED",
    createdAt: "2026-08-11 19:20",
    recommendedResponse: "Coordinate route clearance and improve emergency access for vulnerable communities.",
    assignedTeam: "District Magistrate Emergency Cell",
    description: "Traffic disruption is affecting emergency access to villages cut off by a local obstruction.",
  },
  {
    id: "ALT-1008",
    title: "Tinsukia riverbank inundation",
    district: "Tinsukia",
    severity: "CRITICAL",
    priority: "CRITICAL",
    source: "Flood Monitoring",
    status: "ACKNOWLEDGED",
    createdAt: "2026-08-11 18:45",
    recommendedResponse: "Deploy rescue and medical outreach immediately to the riverbank settlements at risk.",
    assignedTeam: "District Emergency Control Room",
    description: "River levels are encroaching on homes and community facilities near the flood-prone margin.",
  },
  {
    id: "ALT-1009",
    title: "Dibrugarh power outage risk",
    district: "Dibrugarh",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "District Risk",
    status: "MONITORING",
    createdAt: "2026-08-11 17:50",
    recommendedResponse: "Monitor feeder instability and coordinate alternative power support for public health facilities.",
    assignedTeam: "District Emergency Control Room",
    description: "Utility alerts indicate intermittent supply disruption in several affected pockets and risk zones.",
  },
  {
    id: "ALT-1010",
    title: "Jorhat disease cluster",
    district: "Jorhat",
    severity: "HIGH",
    priority: "HIGH",
    source: "Disease Surveillance",
    status: "MONITORING",
    createdAt: "2026-08-11 17:10",
    recommendedResponse: "Continue targeted screening and strengthen community-level disease reporting.",
    assignedTeam: "District Health Officer",
    description: "Household-level disease reporting remains elevated and requires focused follow-up in the affected zone.",
  },
  {
    id: "ALT-1011",
    title: "Sivasagar water contamination alert",
    district: "Sivasagar",
    severity: "CRITICAL",
    priority: "CRITICAL",
    source: "Incident Report",
    status: "MONITORING",
    createdAt: "2026-08-11 16:30",
    recommendedResponse: "Distribute water kits and coordinate rapid testing and sanitation measures at source points.",
    assignedTeam: "District Health Officer",
    description: "Reports indicate elevated contamination risk around a shared water source serving nearby settlements.",
  },
  {
    id: "ALT-1012",
    title: "Sonitpur landslide warning",
    district: "Sonitpur",
    severity: "HIGH",
    priority: "HIGH",
    source: "District Risk",
    status: "MONITORING",
    createdAt: "2026-08-11 15:45",
    recommendedResponse: "Monitor slope activity and prepare evacuation support for exposed households and road corridors.",
    assignedTeam: "State Emergency Operations Centre",
    description: "Heavy rainfall has increased landslide risk near vulnerable slopes and narrow access routes.",
  },
  {
    id: "ALT-1013",
    title: "Lakhimpur crop damage alert",
    district: "Lakhimpur",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "District Risk",
    status: "ESCALATED",
    createdAt: "2026-08-11 14:20",
    recommendedResponse: "Coordinate agricultural support and community outreach for crop-loss assessments.",
    assignedTeam: "District Magistrate Emergency Cell",
    description: "Localized crop losses are expected to affect household food security in vulnerable communities.",
  },
  {
    id: "ALT-1014",
    title: "Tinsukia industrial fire",
    district: "Tinsukia",
    severity: "CRITICAL",
    priority: "CRITICAL",
    source: "Incident Report",
    status: "ESCALATED",
    createdAt: "2026-08-11 13:25",
    recommendedResponse: "Deploy evacuation and fire response teams while maintaining air-quality monitoring across nearby settlements.",
    assignedTeam: "District Emergency Control Room",
    description: "A storage facility fire is raising smoke and health concerns in nearby villages and work areas.",
  },
  {
    id: "ALT-1015",
    title: "Dibrugarh road accident",
    district: "Dibrugarh",
    severity: "HIGH",
    priority: "HIGH",
    source: "Incident Report",
    status: "ESCALATED",
    createdAt: "2026-08-11 12:35",
    recommendedResponse: "Clear the route and coordinate emergency patient transfer and medical support at the site.",
    assignedTeam: "District Magistrate Emergency Cell",
    description: "Multiple injuries have been reported after a road accident affecting movement along a key transport route.",
  },
  {
    id: "ALT-1016",
    title: "Jorhat air quality alert",
    district: "Jorhat",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "District Risk",
    status: "ESCALATED",
    createdAt: "2026-08-11 11:05",
    recommendedResponse: "Increase monitoring and communicate precautionary advice to schools and vulnerable residents.",
    assignedTeam: "District Health Officer",
    description: "Air quality readings remain elevated in an urban fringe area requiring monitoring and protective guidance.",
  },
  {
    id: "ALT-1017",
    title: "Sivasagar facility capacity alert",
    district: "Sivasagar",
    severity: "HIGH",
    priority: "HIGH",
    source: "Incident Report",
    status: "ACKNOWLEDGED",
    createdAt: "2026-08-11 09:20",
    recommendedResponse: "Support local hospital capacity management and prepare additional outreach teams.",
    assignedTeam: "District Health Officer",
    description: "Reporting indicates rising patient loads at a referral facility requiring coordination of additional care support.",
  },
  {
    id: "ALT-1018",
    title: "Lakhimpur flood response completed",
    district: "Lakhimpur",
    severity: "HIGH",
    priority: "HIGH",
    source: "Flood Monitoring",
    status: "RESOLVED",
    createdAt: "2026-08-10 18:30",
    recommendedResponse: "Continue water-level monitoring and complete community re-entry support for affected settlements.",
    assignedTeam: "District Emergency Control Room",
    description: "Emergency flood response operations were completed after water levels receded from critical zones.",
  },
  {
    id: "ALT-1019",
    title: "Tinsukia clinic supply restored",
    district: "Tinsukia",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "Disease Surveillance",
    status: "RESOLVED",
    createdAt: "2026-08-10 17:20",
    recommendedResponse: "Maintain routine supply monitoring and continue data review for local health workforces.",
    assignedTeam: "District Health Officer",
    description: "Medicine and diagnostic inventories were restored to safe operating levels across local clinics.",
  },
  {
    id: "ALT-1020",
    title: "Dibrugarh bridge reopening review",
    district: "Dibrugarh",
    severity: "HIGH",
    priority: "HIGH",
    source: "Incident Report",
    status: "RESOLVED",
    createdAt: "2026-08-10 16:10",
    recommendedResponse: "Maintain route inspections and continue temporary traffic management at the bridge corridor.",
    assignedTeam: "District Magistrate Emergency Cell",
    description: "Temporary transport restrictions were lifted after a safety review confirmed route viability.",
  },
  {
    id: "ALT-1021",
    title: "Jorhat heat stress report concluded",
    district: "Jorhat",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "District Risk",
    status: "RESOLVED",
    createdAt: "2026-08-10 15:05",
    recommendedResponse: "Continue routine monitoring while scheduling community health follow-up for vulnerable workers.",
    assignedTeam: "District Health Officer",
    description: "Heat exposure warnings were reduced after conditions stabilized and field monitoring returned to baseline.",
  },
  {
    id: "ALT-1022",
    title: "Sivasagar vector control complete",
    district: "Sivasagar",
    severity: "HIGH",
    priority: "HIGH",
    source: "Disease Surveillance",
    status: "RESOLVED",
    createdAt: "2026-08-10 13:50",
    recommendedResponse: "Continue surface inspection and routine surveillance across the impacted clusters.",
    assignedTeam: "District Health Officer",
    description: "Community vector-control drives have been completed, and local infection reports are trending down.",
  },
  {
    id: "ALT-1023",
    title: "Sonitpur water quality issue resolved",
    district: "Sonitpur",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "Incident Report",
    status: "RESOLVED",
    createdAt: "2026-08-10 12:35",
    recommendedResponse: "Continue basin-level testing and strong hygiene messaging for surrounding households.",
    assignedTeam: "District Health Officer",
    description: "Source testing confirmed improved conditions and safe supply levels after corrective measures were applied.",
  },
  {
    id: "ALT-1024",
    title: "Lakhimpur evacuation completed",
    district: "Lakhimpur",
    severity: "CRITICAL",
    priority: "CRITICAL",
    source: "Flood Monitoring",
    status: "RESOLVED",
    createdAt: "2026-08-10 10:45",
    recommendedResponse: "Maintain safe re-entry logistics and continue post-event household check-ins.",
    assignedTeam: "District Emergency Control Room",
    description: "Emergency evacuation operations were carried out successfully and affected residents are being supported in recovery.",
  },
  {
    id: "ALT-1025",
    title: "Tinsukia illness cluster closed",
    district: "Tinsukia",
    severity: "HIGH",
    priority: "HIGH",
    source: "Disease Surveillance",
    status: "RESOLVED",
    createdAt: "2026-08-09 22:15",
    recommendedResponse: "Continue routine health education and monitor cluster activity through the next review cycle.",
    assignedTeam: "District Health Officer",
    description: "The cluster reported a sustained decline in symptoms and treatment activity following targeted care interventions.",
  },
  {
    id: "ALT-1026",
    title: "Dibrugarh road clearance update",
    district: "Dibrugarh",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "Incident Report",
    status: "RESOLVED",
    createdAt: "2026-08-09 21:00",
    recommendedResponse: "Maintain corridor monitoring and support the return to standard route advisories.",
    assignedTeam: "District Magistrate Emergency Cell",
    description: "Traffic disruption resolved after route clearing and emergency access coordination were completed.",
  },
  {
    id: "ALT-1027",
    title: "Jorhat safe water distribution complete",
    district: "Jorhat",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "Flood Monitoring",
    status: "RESOLVED",
    createdAt: "2026-08-09 19:40",
    recommendedResponse: "Continue service checks and maintain the emergency water distribution plan for remote settlements.",
    assignedTeam: "District Emergency Control Room",
    description: "Water distribution support was completed as supply levels and access conditions normalized.",
  },
  {
    id: "ALT-1028",
    title: "Sivasagar relief stock deployment finished",
    district: "Sivasagar",
    severity: "HIGH",
    priority: "HIGH",
    source: "Incident Report",
    status: "RESOLVED",
    createdAt: "2026-08-09 18:15",
    recommendedResponse: "Review stock utilization and maintain community support follow-up for affected household groups.",
    assignedTeam: "District Emergency Control Room",
    description: "Emergency relief stock deployment concluded successfully following rapid supply coordination and field distribution.",
  },
  {
    id: "ALT-1029",
    title: "Sonitpur hospital overflow cleared",
    district: "Sonitpur",
    severity: "MODERATE",
    priority: "MODERATE",
    source: "Incident Report",
    status: "RESOLVED",
    createdAt: "2026-08-09 17:05",
    recommendedResponse: "Continue routine operational review and maintain close monitoring of referral load across partner facilities.",
    assignedTeam: "District Health Officer",
    description: "Hospital overflow conditions eased after transfer and discharge planning were implemented across care units.",
  },
];

void initialAlerts;

const getSeverityClasses = (severity: AlertSeverity) => {
  switch (severity) {
    case "CRITICAL":
      return "table-severity-critical text-red-700";
    case "HIGH":
      return "table-severity-high text-orange-700";
    case "MODERATE":
      return "table-severity-moderate text-yellow-800";
    default:
      return "table-severity-moderate text-slate-700";
  }
};

const getStatusClasses = (status: AlertStatus) => {
  switch (status) {
    case "NEW":
      return "table-status-badge text-sky-700";
    case "ACKNOWLEDGED":
      return "table-status-badge text-blue-700";
    case "MONITORING":
      return "table-status-badge text-violet-700";
    case "ESCALATED":
      return "table-status-badge text-orange-700";
    case "RESOLVED":
      return "table-status-badge text-emerald-700";
    case "CLOSED":
      return "table-status-badge text-slate-700";
    default:
      return "table-status-badge text-slate-700";
  }
};

const getTimelineByStatus = (status: AlertStatus) => {
  switch (status) {
    case "NEW":
      return ["Reported"];
    case "ACKNOWLEDGED":
      return ["Reported", "Acknowledged"];
    case "MONITORING":
      return ["Reported", "Acknowledged", "Monitoring"];
    case "ESCALATED":
      return ["Reported", "Acknowledged", "Monitoring", "Escalated"];
    case "RESOLVED":
      return ["Reported", "Acknowledged", "Monitoring", "Escalated", "Resolved"];
    case "CLOSED":
      return ["Reported", "Acknowledged", "Monitoring", "Escalated", "Resolved"];
    default:
      return ["Reported"];
  }
};

export default function AlertsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { alerts, createResourceRequest, updateAlert } = useOperationalStore();
  const [districtFilter, setDistrictFilter] = useState<(typeof DISTRICT_OPTIONS)[number]>("All Districts");
  const [severityFilter, setSeverityFilter] = useState<(typeof SEVERITY_OPTIONS)[number]>("All Severity");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All Status");
  const [sourceFilter, setSourceFilter] = useState<(typeof SOURCE_OPTIONS)[number]>("All Sources");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [teamDraft, setTeamDraft] = useState<string>(TEAM_OPTIONS[0]);
  const [confirmation, setConfirmation] = useState("");
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    modalContentRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [selectedAlert]);

  const activeAlerts = useMemo(
    () => alerts.filter((alert) => alert.status !== "RESOLVED" && alert.status !== "CLOSED"),
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    return activeAlerts.filter((alert) => {
      const districtMatch =
        districtFilter === "All Districts" || alert.district === districtFilter;
      const severityMatch =
        severityFilter === "All Severity" || alert.severity === severityFilter;
      const statusMatch = statusFilter === "All Status" || alert.status === statusFilter;
      const sourceMatch =
        sourceFilter === "All Sources" || alert.source === sourceFilter;

      return districtMatch && severityMatch && statusMatch && sourceMatch;
    });
  }, [activeAlerts, districtFilter, severityFilter, sourceFilter, statusFilter]);

  const alertHistory = useMemo(
    () => alerts.filter((alert) => alert.status === "RESOLVED" || alert.status === "CLOSED"),
    [alerts]
  );

  const criticalCount = useMemo(
    () => alerts.filter((alert) => alert.severity === "CRITICAL").length,
    [alerts]
  );

  const acknowledgedCount = useMemo(
    () => alerts.filter((alert) => alert.status === "ACKNOWLEDGED").length,
    [alerts]
  );

  const resolvedTodayCount = useMemo(
    () => alerts.filter((alert) => alert.status === "RESOLVED").length,
    [alerts]
  );

  const clearFilters = () => {
    setDistrictFilter("All Districts");
    setSeverityFilter("All Severity");
    setStatusFilter("All Status");
    setSourceFilter("All Sources");
  };

  const handleLifecycleTransition = (nextStatus: AlertStatus) => {
    if (!selectedAlert) {
      return;
    }

    updateAlert(selectedAlert.id, { status: nextStatus });

    setSelectedAlert((current) =>
      current ? { ...current, status: nextStatus } : null
    );

    setConfirmation(`${selectedAlert.title} moved to ${nextStatus}.`);
  };

  const handleAssignTeam = () => {
    if (!selectedAlert) {
      return;
    }

    updateAlert(selectedAlert.id, { assignedTeam: teamDraft });

    setSelectedAlert((current) =>
      current ? { ...current, assignedTeam: teamDraft } : null
    );

    setConfirmation(`Assigned ${teamDraft} to ${selectedAlert.title}.`);
  };

  const handlePrepareResourceResponse = () => {
    if (!selectedAlert) {
      return;
    }

    const { created } = createResourceRequest({
      alertId: selectedAlert.id,
      incidentId: selectedAlert.incidentId,
      district: selectedAlert.district,
      incident: selectedAlert.title,
      priority: selectedAlert.priority,
      requestedResources: "Emergency response resources — pending allocation",
      authority: selectedAlert.assignedTeam,
    });

    setConfirmation(
      created
        ? `Resource response prepared for ${selectedAlert.title}.`
        : `A resource response already exists for ${selectedAlert.title}.`
    );
  };

  const getLifecycleActions = (status: AlertStatus) => {
    switch (status) {
      case "NEW":
        return [{ label: "ACKNOWLEDGE", nextStatus: "ACKNOWLEDGED" as const }];
      case "ACKNOWLEDGED":
        return [
          { label: "START MONITORING", nextStatus: "MONITORING" as const },
          { label: "ESCALATE", nextStatus: "ESCALATED" as const },
        ];
      case "MONITORING":
        return [
          { label: "ESCALATE", nextStatus: "ESCALATED" as const },
          { label: "RESOLVE", nextStatus: "RESOLVED" as const },
        ];
      case "ESCALATED":
        return [{ label: "RESOLVE", nextStatus: "RESOLVED" as const }];
      case "RESOLVED":
        return [{ label: "CLOSE", nextStatus: "CLOSED" as const }];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {isSidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-900 cursor-default bg-slate-950/40"
          />
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </>
      )}

      <div className="min-h-screen">
        <header className="sticky top-0 z-800 flex h-20 items-center justify-between border-b-2 border-slate-300 bg-white px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
              className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-slate-300 bg-white text-xl font-extrabold text-slate-950 transition hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-950">SURAKSHA SAARTHI</h1>
              <p className="text-sm font-semibold text-slate-600">Emergency Response Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
            >
              <Search className="mr-2 inline h-4 w-4" /> Search
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 text-sm font-extrabold text-slate-950">
              SS
            </div>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 lg:text-3xl">ALERTS</h2>
            <p className="mt-1 text-base font-medium text-slate-600">
              Emergency alerts and escalation monitoring
            </p>
          </div>

          {confirmation && (
            <div className="mb-6 rounded-md border-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {confirmation}
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">CRITICAL ALERTS</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{criticalCount}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">ACTIVE ALERTS</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{activeAlerts.length}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">ACKNOWLEDGED</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{acknowledgedCount}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">RESOLVED TODAY</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{resolvedTodayCount}</p>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">ALERT FILTERS</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">
                  District
                </label>
                <select
                  value={districtFilter}
                  onChange={(event) => setDistrictFilter(event.target.value as (typeof DISTRICT_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {DISTRICT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">
                  Severity
                </label>
                <select
                  value={severityFilter}
                  onChange={(event) => setSeverityFilter(event.target.value as (typeof SEVERITY_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {SEVERITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">
                  Source
                </label>
                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value as (typeof SOURCE_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {SOURCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full rounded-md border-2 border-slate-300 bg-slate-100 px-3 py-2.5 text-sm font-extrabold text-slate-900 transition hover:bg-slate-200"
                >
                  CLEAR FILTERS
                </button>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">ACTIVE ALERTS</h3>
            </div>

            {filteredAlerts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left">
                  <thead>
                    <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
                      <th className="px-3 py-2">ALERT</th>
                      <th className="px-3 py-2">DISTRICT</th>
                      <th className="px-3 py-2">SEVERITY</th>
                      <th className="px-3 py-2">PRIORITY</th>
                      <th className="px-3 py-2">SOURCE</th>
                      <th className="px-3 py-2">STATUS</th>
                      <th className="px-3 py-2">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts.map((alert) => (
                      <tr key={alert.id} className="rounded-md border-2 border-slate-200 bg-slate-50">
                        <td className="px-3 py-3 text-sm font-bold text-slate-900">{alert.title}</td>
                        <td className="px-3 py-3 text-sm font-medium text-slate-700">{alert.district}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getSeverityClasses(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-slate-900">{alert.priority}</td>
                        <td className="px-3 py-3 text-sm font-medium text-slate-700">{alert.source}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(alert.status)}`}>
                            {alert.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAlert(alert);
                              setTeamDraft(alert.assignedTeam);
                            }}
                            className="rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-900 transition hover:bg-slate-100"
                          >
                            VIEW
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md border-2 border-slate-300 bg-slate-50 px-4 py-4">
                <div className="text-lg font-extrabold text-slate-900">NO ACTIVE ALERTS FOUND</div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm font-extrabold text-slate-900"
                >
                  CLEAR FILTERS
                </button>
              </div>
            )}
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">ALERT HISTORY</h3>
            </div>

            {alertHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left">
                  <thead>
                    <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
                      <th className="px-3 py-2">ALERT</th>
                      <th className="px-3 py-2">DISTRICT</th>
                      <th className="px-3 py-2">SEVERITY</th>
                      <th className="px-3 py-2">RESOLVED</th>
                      <th className="px-3 py-2">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertHistory.map((alert) => (
                      <tr key={alert.id} className="rounded-md border-2 border-slate-200 bg-slate-50">
                        <td className="px-3 py-3 text-sm font-bold text-slate-900">{alert.title}</td>
                        <td className="px-3 py-3 text-sm font-medium text-slate-700">{alert.district}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getSeverityClasses(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-slate-900">
                          {alert.status === "RESOLVED" ? "Today" : "Closed"}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(alert.status)}`}>
                            {alert.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md border-2 border-slate-300 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700">
                NO ALERT HISTORY AVAILABLE
              </div>
            )}
          </section>
        </main>
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border-2 border-slate-300 bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b-2 border-slate-300 px-5 py-4">
              <h4 className="text-xl font-extrabold text-slate-950">{selectedAlert.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="rounded-md border-2 border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-900"
              >
                CLOSE
              </button>
            </div>

            <div ref={modalContentRef} className="min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-5 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">District</div>
                    <div className="mt-1 text-base font-bold text-slate-900">{selectedAlert.district}</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Source</div>
                    <div className="mt-1 text-base font-bold text-slate-900">{selectedAlert.source}</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Severity</div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getSeverityClasses(selectedAlert.severity)}`}>
                        {selectedAlert.severity}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Priority</div>
                    <div className="mt-1 text-base font-bold text-slate-900">{selectedAlert.priority}</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Status</div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(selectedAlert.status)}`}>
                        {selectedAlert.status}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Created</div>
                    <div className="mt-1 text-base font-bold text-slate-900">{selectedAlert.createdAt}</div>
                  </div>
                </div>

                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Description</div>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{selectedAlert.description}</p>
                </div>

                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Recommended Response</div>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{selectedAlert.recommendedResponse}</p>
                </div>

                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Assigned Team</div>
                  <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
                    <select
                      value={teamDraft}
                      onChange={(event) => setTeamDraft(event.target.value)}
                      className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                    >
                      {TEAM_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAssignTeam}
                      className="rounded-md border-2 border-slate-300 bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white"
                    >
                      ASSIGN TEAM
                    </button>
                  </div>
                </div>

                {(selectedAlert.severity === "CRITICAL" || selectedAlert.severity === "HIGH") && (
                  <div className="rounded-md border-2 border-red-200 bg-red-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-red-700">RESOURCE RESPONSE</div>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      Resource dispatch may be required for this alert.
                    </p>
                    <button
                      type="button"
                      onClick={handlePrepareResourceResponse}
                      className="mt-3 rounded-md border-2 border-red-600 bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white"
                    >
                      PREPARE RESOURCE RESPONSE
                    </button>
                  </div>
                )}

                <div className="rounded-md border-2 border-amber-200 bg-amber-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-amber-800">OPERATIONAL TIMELINE</div>
                  <div className="mt-3 space-y-2">
                    {getTimelineByStatus(selectedAlert.status).map((step, index) => (
                      <div key={`${selectedAlert.id}-${step}`} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-400 bg-white text-xs font-extrabold text-slate-900">
                          {index + 1}
                        </div>
                        <div className="text-sm font-bold text-slate-900">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t-2 border-slate-300 bg-white px-5 py-4">
              <div className="flex flex-wrap gap-3">
                {getLifecycleActions(selectedAlert.status).map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleLifecycleTransition(action.nextStatus)}
                    className="rounded-md border-2 border-slate-300 bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
