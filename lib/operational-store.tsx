"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Incident = {
  id: string;
  title: string;
  district: string;
  description: string;
  severity: "High" | "Medium";
  reported: string;
  status: "ACTIVE";
  recommendedResponse: string;
};

type NewIncident = Incident;

const OPERATIONAL_STATE_STORAGE_KEY = "suraksha-saarthi-operational-state-v1";

export type AlertSeverity = "CRITICAL" | "HIGH" | "MODERATE";
export type AlertStatus = "NEW" | "ACKNOWLEDGED" | "MONITORING" | "ESCALATED" | "RESOLVED" | "CLOSED";
export type AlertSource = "Flood Monitoring" | "Disease Surveillance" | "Incident Report" | "District Risk";
export type Alert = {
  id: string;
  incidentId?: string;
  title: string;
  district: string;
  severity: AlertSeverity;
  priority: AlertSeverity;
  source: AlertSource;
  status: AlertStatus;
  createdAt: string;
  recommendedResponse: string;
  assignedTeam: string;
  description: string;
};

export type ResourceRequest = {
  id: string;
  alertId?: string;
  incidentId?: string;
  district: string;
  incident: string;
  priority: AlertSeverity;
  requestedResources: string;
  authority: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN TRANSIT" | "COMPLETED";
};

export type Dispatch = {
  id: string;
  requestId?: string;
  district: string;
  authority: string;
  resources: string;
  eta: string;
  status: "PREPARING" | "IN TRANSIT" | "ON SITE" | "COMPLETED";
  progress: number;
  lastUpdated: string;
};

const initialIncidents: Incident[] = [
  { id: "flood-lakhimpur", title: "Flooding reported — Lakhimpur, Assam", district: "Lakhimpur, Assam", description: "Water levels rising near riverbank; low-lying areas advised to evacuate.", severity: "High", reported: "5 minutes ago", status: "ACTIVE", recommendedResponse: "Deploy rescue teams and drinking water supplies. Coordinate immediate district-level emergency response." },
  { id: "illness-tinsukia", title: "Febrile illness cluster — Tinsukia District", district: "Tinsukia, Assam", description: "12 patients with fever and respiratory symptoms; samples pending.", severity: "Medium", reported: "1 hour ago", status: "ACTIVE", recommendedResponse: "Deploy medical officers and medicine kits. Coordinate rapid diagnostic testing and contact tracing." },
  { id: "bridge-dibrugarh", title: "Bridge damage — NH-37 near Dibrugarh", district: "Dibrugarh, Assam", description: "Structural damage reported; route closed for heavy vehicles.", severity: "High", reported: "2 hours ago", status: "ACTIVE", recommendedResponse: "Deploy rescue and infrastructure assessment teams. Coordinate with district administration regarding route safety." },
];

const initialAlerts: Alert[] = [
  { id: "ALT-1001", incidentId: "flood-lakhimpur", title: "Lakhimpur floodwater rise", district: "Lakhimpur", severity: "CRITICAL", priority: "CRITICAL", source: "Flood Monitoring", status: "NEW", createdAt: "2026-08-12 06:15", recommendedResponse: "Mobilize rescue teams, flood barriers, and immediate evacuation support for low-lying hamlets.", assignedTeam: "District Emergency Control Room", description: "Water levels continue to rise near riverbank settlements, threatening access roads and household safety." },
  { id: "ALT-1002", incidentId: "illness-tinsukia", title: "Tinsukia illness cluster", district: "Tinsukia", severity: "HIGH", priority: "HIGH", source: "Disease Surveillance", status: "NEW", createdAt: "2026-08-12 05:40", recommendedResponse: "Deploy medical officers and rapid disease screening kits to affected clusters.", assignedTeam: "District Health Officer", description: "Several households are reporting fever and respiratory symptoms with elevated cluster activity in the district." },
  { id: "ALT-1003", incidentId: "bridge-dibrugarh", title: "Dibrugarh bridge damage", district: "Dibrugarh", severity: "CRITICAL", priority: "CRITICAL", source: "Incident Report", status: "NEW", createdAt: "2026-08-12 04:50", recommendedResponse: "Restrict heavy vehicle movement and deploy rescue units to assess structural integrity.", assignedTeam: "District Magistrate Emergency Cell", description: "Critical structural damage has been reported on a key bridge segment near NH-37 affecting connectivity." },
  { id: "ALT-1004", title: "Jorhat water level rise", district: "Jorhat", severity: "HIGH", priority: "HIGH", source: "Flood Monitoring", status: "ACKNOWLEDGED", createdAt: "2026-08-11 23:10", recommendedResponse: "Increase monitoring along the embankment and prepare evacuation support for vulnerable villages.", assignedTeam: "District Emergency Control Room", description: "Water inflow near drainage channels has increased, creating local inundation risk for surrounding communities." },
  { id: "ALT-1005", title: "Sivasagar fever cluster", district: "Sivasagar", severity: "MODERATE", priority: "MODERATE", source: "Disease Surveillance", status: "ACKNOWLEDGED", createdAt: "2026-08-11 21:55", recommendedResponse: "Continue surveillance and community outreach with focused vector-control measures.", assignedTeam: "District Health Officer", description: "Community health teams are reviewing rising fever reports across low-lying households in the district." },
  { id: "ALT-1006", title: "Sonitpur district risk escalation", district: "Sonitpur", severity: "HIGH", priority: "HIGH", source: "District Risk", status: "ACKNOWLEDGED", createdAt: "2026-08-11 20:35", recommendedResponse: "Escalate district coordination for shelter prepositioning and vulnerable family outreach.", assignedTeam: "State Emergency Operations Centre", description: "Risk indicators for flooding and access disruption have increased across the district’s high-exposure zones." },
  { id: "ALT-1007", title: "Lakhimpur road block incident", district: "Lakhimpur", severity: "MODERATE", priority: "MODERATE", source: "Incident Report", status: "ACKNOWLEDGED", createdAt: "2026-08-11 19:20", recommendedResponse: "Coordinate route clearance and improve emergency access for vulnerable communities.", assignedTeam: "District Magistrate Emergency Cell", description: "Traffic disruption is affecting emergency access to villages cut off by a local obstruction." },
  { id: "ALT-1008", title: "Tinsukia riverbank inundation", district: "Tinsukia", severity: "CRITICAL", priority: "CRITICAL", source: "Flood Monitoring", status: "ACKNOWLEDGED", createdAt: "2026-08-11 18:45", recommendedResponse: "Deploy rescue and medical outreach immediately to the riverbank settlements at risk.", assignedTeam: "District Emergency Control Room", description: "River levels are encroaching on homes and community facilities near the flood-prone margin." },
  { id: "ALT-1009", title: "Dibrugarh power outage risk", district: "Dibrugarh", severity: "MODERATE", priority: "MODERATE", source: "District Risk", status: "MONITORING", createdAt: "2026-08-11 17:50", recommendedResponse: "Monitor feeder instability and coordinate alternative power support for public health facilities.", assignedTeam: "District Emergency Control Room", description: "Utility alerts indicate intermittent supply disruption in several affected pockets and risk zones." },
  { id: "ALT-1010", title: "Jorhat disease cluster", district: "Jorhat", severity: "HIGH", priority: "HIGH", source: "Disease Surveillance", status: "MONITORING", createdAt: "2026-08-11 17:10", recommendedResponse: "Continue targeted screening and strengthen community-level disease reporting.", assignedTeam: "District Health Officer", description: "Household-level disease reporting remains elevated and requires focused follow-up in the affected zone." },
  { id: "ALT-1011", title: "Sivasagar water contamination alert", district: "Sivasagar", severity: "CRITICAL", priority: "CRITICAL", source: "Incident Report", status: "MONITORING", createdAt: "2026-08-11 16:30", recommendedResponse: "Distribute water kits and coordinate rapid testing and sanitation measures at source points.", assignedTeam: "District Health Officer", description: "Reports indicate elevated contamination risk around a shared water source serving nearby settlements." },
  { id: "ALT-1012", title: "Sonitpur landslide warning", district: "Sonitpur", severity: "HIGH", priority: "HIGH", source: "District Risk", status: "MONITORING", createdAt: "2026-08-11 15:45", recommendedResponse: "Monitor slope activity and prepare evacuation support for exposed households and road corridors.", assignedTeam: "State Emergency Operations Centre", description: "Heavy rainfall has increased landslide risk near vulnerable slopes and narrow access routes." },
  { id: "ALT-1013", title: "Lakhimpur crop damage alert", district: "Lakhimpur", severity: "MODERATE", priority: "MODERATE", source: "District Risk", status: "ESCALATED", createdAt: "2026-08-11 14:20", recommendedResponse: "Coordinate agricultural support and community outreach for crop-loss assessments.", assignedTeam: "District Magistrate Emergency Cell", description: "Localized crop losses are expected to affect household food security in vulnerable communities." },
  { id: "ALT-1014", title: "Tinsukia industrial fire", district: "Tinsukia", severity: "CRITICAL", priority: "CRITICAL", source: "Incident Report", status: "ESCALATED", createdAt: "2026-08-11 13:25", recommendedResponse: "Deploy evacuation and fire response teams while maintaining air-quality monitoring across nearby settlements.", assignedTeam: "District Emergency Control Room", description: "A storage facility fire is raising smoke and health concerns in nearby villages and work areas." },
  { id: "ALT-1015", title: "Dibrugarh road accident", district: "Dibrugarh", severity: "HIGH", priority: "HIGH", source: "Incident Report", status: "ESCALATED", createdAt: "2026-08-11 12:35", recommendedResponse: "Clear the route and coordinate emergency patient transfer and medical support at the site.", assignedTeam: "District Magistrate Emergency Cell", description: "Multiple injuries have been reported after a road accident affecting movement along a key transport route." },
  { id: "ALT-1016", title: "Jorhat air quality alert", district: "Jorhat", severity: "MODERATE", priority: "MODERATE", source: "District Risk", status: "ESCALATED", createdAt: "2026-08-11 11:05", recommendedResponse: "Increase monitoring and communicate precautionary advice to schools and vulnerable residents.", assignedTeam: "District Health Officer", description: "Air quality readings remain elevated in an urban fringe area requiring monitoring and protective guidance." },
  { id: "ALT-1017", title: "Sivasagar facility capacity alert", district: "Sivasagar", severity: "HIGH", priority: "HIGH", source: "Incident Report", status: "ACKNOWLEDGED", createdAt: "2026-08-11 09:20", recommendedResponse: "Support local hospital capacity management and prepare additional outreach teams.", assignedTeam: "District Health Officer", description: "Reporting indicates rising patient loads at a referral facility requiring coordination of additional care support." },
  { id: "ALT-1018", title: "Lakhimpur flood response completed", district: "Lakhimpur", severity: "HIGH", priority: "HIGH", source: "Flood Monitoring", status: "RESOLVED", createdAt: "2026-08-10 18:30", recommendedResponse: "Continue water-level monitoring and complete community re-entry support for affected settlements.", assignedTeam: "District Emergency Control Room", description: "Emergency flood response operations were completed after water levels receded from critical zones." },
  { id: "ALT-1019", title: "Tinsukia clinic supply restored", district: "Tinsukia", severity: "MODERATE", priority: "MODERATE", source: "Disease Surveillance", status: "RESOLVED", createdAt: "2026-08-10 17:20", recommendedResponse: "Maintain routine supply monitoring and continue data review for local health workforces.", assignedTeam: "District Health Officer", description: "Medicine and diagnostic inventories were restored to safe operating levels across local clinics." },
  { id: "ALT-1020", title: "Dibrugarh bridge reopening review", district: "Dibrugarh", severity: "HIGH", priority: "HIGH", source: "Incident Report", status: "RESOLVED", createdAt: "2026-08-10 16:10", recommendedResponse: "Maintain route inspections and continue temporary traffic management at the bridge corridor.", assignedTeam: "District Magistrate Emergency Cell", description: "Temporary transport restrictions were lifted after a safety review confirmed route viability." },
  { id: "ALT-1021", title: "Jorhat heat stress report concluded", district: "Jorhat", severity: "MODERATE", priority: "MODERATE", source: "District Risk", status: "RESOLVED", createdAt: "2026-08-10 15:05", recommendedResponse: "Continue routine monitoring while scheduling community health follow-up for vulnerable workers.", assignedTeam: "District Health Officer", description: "Heat exposure warnings were reduced after conditions stabilized and field monitoring returned to baseline." },
  { id: "ALT-1022", title: "Sivasagar vector control complete", district: "Sivasagar", severity: "HIGH", priority: "HIGH", source: "Disease Surveillance", status: "RESOLVED", createdAt: "2026-08-10 13:50", recommendedResponse: "Continue surface inspection and routine surveillance across the impacted clusters.", assignedTeam: "District Health Officer", description: "Community vector-control drives have been completed, and local infection reports are trending down." },
  { id: "ALT-1023", title: "Sonitpur water quality issue resolved", district: "Sonitpur", severity: "MODERATE", priority: "MODERATE", source: "Incident Report", status: "RESOLVED", createdAt: "2026-08-10 12:35", recommendedResponse: "Continue basin-level testing and strong hygiene messaging for surrounding households.", assignedTeam: "District Health Officer", description: "Source testing confirmed improved conditions and safe supply levels after corrective measures were applied." },
  { id: "ALT-1024", title: "Lakhimpur evacuation completed", district: "Lakhimpur", severity: "CRITICAL", priority: "CRITICAL", source: "Flood Monitoring", status: "RESOLVED", createdAt: "2026-08-10 10:45", recommendedResponse: "Maintain safe re-entry logistics and continue post-event household check-ins.", assignedTeam: "District Emergency Control Room", description: "Emergency evacuation operations were carried out successfully and affected residents are being supported in recovery." },
  { id: "ALT-1025", title: "Tinsukia illness cluster closed", district: "Tinsukia", severity: "HIGH", priority: "HIGH", source: "Disease Surveillance", status: "RESOLVED", createdAt: "2026-08-09 22:15", recommendedResponse: "Continue routine health education and monitor cluster activity through the next review cycle.", assignedTeam: "District Health Officer", description: "The cluster reported a sustained decline in symptoms and treatment activity following targeted care interventions." },
  { id: "ALT-1026", title: "Dibrugarh road clearance update", district: "Dibrugarh", severity: "MODERATE", priority: "MODERATE", source: "Incident Report", status: "RESOLVED", createdAt: "2026-08-09 21:00", recommendedResponse: "Maintain corridor monitoring and support the return to standard route advisories.", assignedTeam: "District Magistrate Emergency Cell", description: "Traffic disruption resolved after route clearing and emergency access coordination were completed." },
  { id: "ALT-1027", title: "Jorhat safe water distribution complete", district: "Jorhat", severity: "MODERATE", priority: "MODERATE", source: "Flood Monitoring", status: "RESOLVED", createdAt: "2026-08-09 19:40", recommendedResponse: "Continue service checks and maintain the emergency water distribution plan for remote settlements.", assignedTeam: "District Emergency Control Room", description: "Water distribution support was completed as supply levels and access conditions normalized." },
  { id: "ALT-1028", title: "Sivasagar relief stock deployment finished", district: "Sivasagar", severity: "HIGH", priority: "HIGH", source: "Incident Report", status: "RESOLVED", createdAt: "2026-08-09 18:15", recommendedResponse: "Review stock utilization and maintain community support follow-up for affected household groups.", assignedTeam: "District Emergency Control Room", description: "Emergency relief stock deployment concluded successfully following rapid supply coordination and field distribution." },
  { id: "ALT-1029", title: "Sonitpur hospital overflow cleared", district: "Sonitpur", severity: "MODERATE", priority: "MODERATE", source: "Incident Report", status: "RESOLVED", createdAt: "2026-08-09 17:05", recommendedResponse: "Continue routine operational review and maintain close monitoring of referral load across partner facilities.", assignedTeam: "District Health Officer", description: "Hospital overflow conditions eased after transfer and discharge planning were implemented across care units." },
];

const initialResourceRequests: ResourceRequest[] = [
  { id: "REQ-201", incidentId: "flood-lakhimpur", district: "Lakhimpur", incident: "Flooding reported", priority: "CRITICAL", requestedResources: "Mobile Medical Units ×2; Rescue Teams ×1", authority: "District Health Officer", createdAt: "2026-08-11 08:15", status: "PENDING" },
  { id: "REQ-202", incidentId: "illness-tinsukia", district: "Tinsukia", incident: "Febrile illness cluster", priority: "HIGH", requestedResources: "Medicine Kits ×8; Medical Officers ×3", authority: "District Emergency Control Room", createdAt: "2026-08-11 07:40", status: "PENDING" },
  { id: "REQ-203", incidentId: "bridge-dibrugarh", district: "Dibrugarh", incident: "Bridge damage", priority: "HIGH", requestedResources: "Rescue Teams ×2; Ambulances ×1", authority: "District Magistrate Emergency Cell", createdAt: "2026-08-10 18:25", status: "APPROVED" },
  { id: "REQ-204", district: "Jorhat", incident: "Heat stress monitoring", priority: "MODERATE", requestedResources: "Drinking Water Kits ×10", authority: "District Health Officer", createdAt: "2026-08-10 16:50", status: "PENDING" },
  { id: "REQ-205", district: "Sivasagar", incident: "Disease surveillance escalation", priority: "HIGH", requestedResources: "Medicine Kits ×5; Medical Officers ×2", authority: "State Emergency Operations Centre", createdAt: "2026-08-09 12:35", status: "REJECTED" },
  { id: "REQ-206", district: "Sonitpur", incident: "Water contamination alert", priority: "CRITICAL", requestedResources: "Drinking Water Kits ×12; Rescue Teams ×1", authority: "District Emergency Control Room", createdAt: "2026-08-09 09:10", status: "IN TRANSIT" },
  { id: "REQ-207", district: "Lakhimpur", incident: "Shelter support requirement", priority: "MODERATE", requestedResources: "Emergency Food Supplies ×20", authority: "District Magistrate Emergency Cell", createdAt: "2026-08-08 15:05", status: "COMPLETED" },
];

const initialDispatches: Dispatch[] = [
  { id: "DSP-301", requestId: "REQ-201", district: "Lakhimpur", authority: "District Health Officer", resources: "Mobile Medical Units ×2; Rescue Teams ×1", eta: "02:30 hrs", status: "PREPARING", progress: 20, lastUpdated: "2026-08-11 08:05" },
  { id: "DSP-302", requestId: "REQ-203", district: "Dibrugarh", authority: "District Magistrate Emergency Cell", resources: "Rescue Teams ×2; Ambulances ×1", eta: "01:10 hrs", status: "IN TRANSIT", progress: 58, lastUpdated: "2026-08-11 07:35" },
  { id: "DSP-303", requestId: "REQ-206", district: "Sonitpur", authority: "District Emergency Control Room", resources: "Drinking Water Kits ×12; Rescue Teams ×1", eta: "00:45 hrs", status: "ON SITE", progress: 85, lastUpdated: "2026-08-10 22:50" },
  { id: "DSP-304", requestId: "REQ-204", district: "Jorhat", authority: "District Health Officer", resources: "Drinking Water Kits ×10", eta: "Completed", status: "COMPLETED", progress: 100, lastUpdated: "2026-08-10 18:10" },
];

type NewResourceRequest = Omit<ResourceRequest, "id" | "createdAt" | "status">;
type OperationalStore = {
  incidents: Incident[];
  alerts: Alert[];
  resourceRequests: ResourceRequest[];
  dispatches: Dispatch[];
  createIncident: (incident: NewIncident) => { incident: Incident; created: boolean };
  ensureAlertForIncident: (incidentId: string) => Alert | undefined;
  updateAlert: (id: string, update: Partial<Pick<Alert, "status" | "assignedTeam">>) => void;
  createResourceRequest: (request: NewResourceRequest) => { request: ResourceRequest; created: boolean };
  updateResourceRequestStatus: (id: string, status: ResourceRequest["status"]) => void;
  createDispatchForRequest: (request: ResourceRequest) => Dispatch | undefined;
};

type PersistedOperationalState = Pick<OperationalStore, "incidents" | "alerts" | "resourceRequests" | "dispatches">;

const isPersistedOperationalState = (value: unknown): value is PersistedOperationalState => {
  if (!value || typeof value !== "object") return false;

  const state = value as Partial<PersistedOperationalState>;
  return [state.incidents, state.alerts, state.resourceRequests, state.dispatches].every(
    (records) => Array.isArray(records) && records.every((record) => record && typeof record === "object" && typeof record.id === "string"),
  );
};

const OperationalStoreContext = createContext<OperationalStore | null>(null);

const incidentPriority = (severity: Incident["severity"]): AlertSeverity => severity === "High" ? "HIGH" : "MODERATE";

export function OperationalStoreProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [resourceRequests, setResourceRequests] = useState(initialResourceRequests);
  const [dispatches, setDispatches] = useState(initialDispatches);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(OPERATIONAL_STATE_STORAGE_KEY);
      if (storedValue) {
        const parsedValue: unknown = JSON.parse(storedValue);
        if (isPersistedOperationalState(parsedValue)) {
          startTransition(() => {
            setIncidents(parsedValue.incidents);
            setAlerts(parsedValue.alerts);
            setResourceRequests(parsedValue.resourceRequests);
            setDispatches(parsedValue.dispatches);
            setIsHydrated(true);
          });
          return;
        }
      }
    } catch {
      // Invalid or unavailable browser storage falls back to seeded fixtures.
    }

    startTransition(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const state: PersistedOperationalState = { incidents, alerts, resourceRequests, dispatches };
    try {
      window.localStorage.setItem(OPERATIONAL_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota and privacy-mode failures do not interrupt operations.
    }
  }, [alerts, dispatches, incidents, isHydrated, resourceRequests]);

  const ensureAlertForIncidentRecord = (incident: Incident, currentAlerts: Alert[]) => {
    const existing = currentAlerts.find((alert) => alert.incidentId === incident.id);
    if (existing) return existing;
    return { id: `ALT-${Date.now()}`, incidentId: incident.id, title: incident.title, district: incident.district.split(",")[0], severity: incidentPriority(incident.severity), priority: incidentPriority(incident.severity), source: "Incident Report" as const, status: "NEW" as const, createdAt: new Date().toISOString().slice(0, 16).replace("T", " "), recommendedResponse: incident.recommendedResponse, assignedTeam: "District Emergency Control Room", description: incident.description };
  };

  const ensureAlertForIncident = (incidentId: string) => {
    const incident = incidents.find((item) => item.id === incidentId);
    if (!incident) return undefined;
    const alert = ensureAlertForIncidentRecord(incident, alerts);
    if (alerts.some((item) => item.id === alert.id)) return alert;
    setAlerts((current) => [...current, alert]);
    return alert;
  };

  const createIncident: OperationalStore["createIncident"] = (incident) => {
    const existing = incidents.find((item) => item.id === incident.id);
    if (existing) return { incident: existing, created: false };

    const alert = ensureAlertForIncidentRecord(incident, alerts);
    setIncidents((current) => [...current, incident]);
    setAlerts((current) => current.some((item) => item.incidentId === incident.id) ? current : [...current, alert]);
    return { incident, created: true };
  };

  const updateAlert: OperationalStore["updateAlert"] = (id, update) => {
    setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, ...update } : alert));
  };

  const createResourceRequest: OperationalStore["createResourceRequest"] = (request) => {
    const duplicate = request.alertId ? resourceRequests.find((item) => item.alertId === request.alertId) : undefined;
    if (duplicate) return { request: duplicate, created: false };
    const created: ResourceRequest = { ...request, id: `REQ-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 16).replace("T", " "), status: "PENDING" };
    setResourceRequests((current) => [created, ...current]);
    return { request: created, created: true };
  };

  const updateResourceRequestStatus: OperationalStore["updateResourceRequestStatus"] = (id, status) => {
    setResourceRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
  };

  const createDispatchForRequest = (request: ResourceRequest) => {
    const existing = dispatches.find((dispatch) => dispatch.requestId === request.id);
    if (existing) return undefined;
    const dispatch: Dispatch = { id: `DSP-${Date.now()}`, requestId: request.id, district: request.district, authority: request.authority, resources: request.requestedResources, eta: "TBD", status: "PREPARING", progress: 12, lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " ") };
    setDispatches((current) => [dispatch, ...current]);
    return dispatch;
  };

  return <OperationalStoreContext.Provider value={{ incidents, alerts, resourceRequests, dispatches, createIncident, ensureAlertForIncident, updateAlert, createResourceRequest, updateResourceRequestStatus, createDispatchForRequest }}>{children}</OperationalStoreContext.Provider>;
}

export function useOperationalStore() {
  const store = useContext(OperationalStoreContext);
  if (!store) throw new Error("useOperationalStore must be used within OperationalStoreProvider");
  return store;
}
