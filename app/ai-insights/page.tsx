"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useOperationalStore, type Alert, type Dispatch, type Incident, type ResourceRequest } from "@/lib/operational-store";

type InsightType = "Disease Anomaly" | "Flood Risk" | "Resource Shortage" | "Incident Cluster" | "District Risk";
type InsightPriority = "Critical" | "High" | "Moderate";
type InsightStatus = "NEW" | "MONITORING" | "ACTIONED" | "RESOLVED";

interface Insight {
  id: string;
  title: string;
  district: string;
  type: InsightType;
  priority: InsightPriority;
  confidence: number;
  status: InsightStatus;
  summary: string;
  signals: string[];
  recommendation: string;
  createdAt: string;
}

const DISTRICT_OPTIONS = [
  "All Districts",
  "Lakhimpur",
  "Tinsukia",
  "Dibrugarh",
  "Jorhat",
  "Sivasagar",
  "Sonitpur",
] as const;

const INSIGHT_TYPE_OPTIONS = [
  "All Types",
  "Disease Anomaly",
  "Flood Risk",
  "Resource Shortage",
  "Incident Cluster",
  "District Risk",
] as const;

const PRIORITY_OPTIONS = ["All Priorities", "Critical", "High", "Moderate"] as const;

const CONFIDENCE_OPTIONS = [
  "All Confidence",
  "Very High (90+%)",
  "High (70-89%)",
  "Moderate (50-69%)",
  "Low (<50%)",
] as const;

const districtName = (district: string) => district.split(",")[0].trim();

const operationalInsights = (
  incidents: Incident[],
  alerts: Alert[],
  resourceRequests: ResourceRequest[],
  dispatches: Dispatch[],
): Insight[] => {
  const insights: Insight[] = [];
  const activeAlerts = alerts.filter((alert) => !["RESOLVED", "CLOSED"].includes(alert.status));
  const addInsight = (insight: Insight) => insights.push(insight);

  alerts.filter((alert) => alert.severity === "CRITICAL").forEach((alert, index) => {
    addInsight({
      id: `AI-CRITICAL-${alert.id}`,
      title: `Immediate response required: ${alert.title}`,
      district: districtName(alert.district),
      type: "District Risk",
      priority: "Critical",
      confidence: 96,
      status: alert.status === "NEW" ? "NEW" : "MONITORING",
      summary: `A critical operational alert is active in ${districtName(alert.district)} and requires immediate response coordination.`,
      signals: [alert.title, `Alert severity: ${alert.severity}`, `Operational status: ${alert.status}`],
      recommendation: `Recommend immediate response: ${alert.recommendedResponse}`,
      createdAt: alert.createdAt || `${index}`,
    });
  });

  const incidentsByDistrict = new Map<string, Incident[]>();
  incidents.forEach((incident) => {
    const district = districtName(incident.district);
    incidentsByDistrict.set(district, [...(incidentsByDistrict.get(district) ?? []), incident]);
  });
  incidentsByDistrict.forEach((districtIncidents, district) => {
    if (districtIncidents.length < 2) return;
    addInsight({
      id: `AI-CLUSTER-${district}`,
      title: `Incident cluster detected in ${district}`,
      district,
      type: "Incident Cluster",
      priority: "High",
      confidence: 84,
      status: "MONITORING",
      summary: `${districtIncidents.length} active incidents are recorded in the same district.`,
      signals: districtIncidents.map((incident) => incident.title),
      recommendation: "Recommend increased district monitoring and coordinated field review.",
      createdAt: districtIncidents[0].reported,
    });
  });

  const pendingByDistrict = new Map<string, ResourceRequest[]>();
  resourceRequests.filter((request) => request.status === "PENDING").forEach((request) => {
    const district = districtName(request.district);
    pendingByDistrict.set(district, [...(pendingByDistrict.get(district) ?? []), request]);
  });
  pendingByDistrict.forEach((requests, district) => {
    addInsight({
      id: `AI-RESOURCES-${district}`,
      title: `Resource shortage response demand in ${district}`,
      district,
      type: "Resource Shortage",
      priority: requests.some((request) => request.priority === "CRITICAL") ? "Critical" : "High",
      confidence: 89,
      status: "NEW",
      summary: `${requests.length} pending resource request${requests.length === 1 ? "" : "s"} indicate unresolved response demand.`,
      signals: requests.map((request) => `${request.id}: ${request.requestedResources}`),
      recommendation: "Recommend reviewing and approving pending resources for district response.",
      createdAt: requests[0].createdAt,
    });
  });

  const highRiskByDistrict = new Map<string, Alert[]>();
  activeAlerts.filter((alert) => ["CRITICAL", "HIGH"].includes(alert.severity)).forEach((alert) => {
    const district = districtName(alert.district);
    highRiskByDistrict.set(district, [...(highRiskByDistrict.get(district) ?? []), alert]);
  });
  highRiskByDistrict.forEach((districtAlerts, district) => {
    if (districtAlerts.length < 2) return;
    addInsight({
      id: `AI-RISK-${district}`,
      title: `District risk escalation in ${district}`,
      district,
      type: "District Risk",
      priority: "High",
      confidence: 92,
      status: "MONITORING",
      summary: `${districtAlerts.length} active high-risk alerts indicate escalating operational pressure.`,
      signals: districtAlerts.map((alert) => `${alert.severity}: ${alert.title}`),
      recommendation: "Recommend increased monitoring and district-level coordination across active alerts.",
      createdAt: districtAlerts[0].createdAt,
    });
  });

  dispatches.filter((dispatch) => dispatch.status !== "COMPLETED").forEach((dispatch) => {
    addInsight({
      id: `AI-DISPATCH-${dispatch.id}`,
      title: `Active dispatch deployment in ${districtName(dispatch.district)}`,
      district: districtName(dispatch.district),
      type: "District Risk",
      priority: "Moderate",
      confidence: 80,
      status: "MONITORING",
      summary: `${dispatch.resources} is currently ${dispatch.status.toLowerCase()} with ${dispatch.progress}% deployment progress.`,
      signals: [`Dispatch ${dispatch.id}`, `Status: ${dispatch.status}`, `ETA: ${dispatch.eta}`],
      recommendation: "Recommend monitoring deployment status and confirming field receipt.",
      createdAt: dispatch.lastUpdated,
    });
  });

  return insights;
};

const getTypeClasses = (type: InsightType) => {
  switch (type) {
    case "Disease Anomaly":
      return "table-type-label text-red-700";
    case "Flood Risk":
      return "table-type-label text-blue-700";
    case "Resource Shortage":
      return "table-type-label text-orange-700";
    case "Incident Cluster":
      return "table-type-label text-violet-700";
    default:
      return "table-type-label text-slate-700";
  }
};

const getPriorityClasses = (priority: InsightPriority) => {
  switch (priority) {
    case "Critical":
      return "table-severity-critical text-red-700";
    case "High":
      return "table-severity-high text-orange-700";
    case "Moderate":
      return "table-severity-moderate text-yellow-800";
    default:
      return "table-severity-moderate text-slate-700";
  }
};

const getStatusClasses = (status: InsightStatus) => {
  switch (status) {
    case "NEW":
    case "MONITORING":
    case "ACTIONED":
    case "RESOLVED":
    default:
      return "table-status-badge text-slate-700";
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-emerald-700";
  if (confidence >= 70) return "text-blue-700";
  if (confidence >= 50) return "text-yellow-700";
  return "text-slate-700";
};

export default function AIInsightsPage() {
  const { incidents, alerts, resourceRequests, dispatches } = useOperationalStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [insightStatuses, setInsightStatuses] = useState<Record<string, InsightStatus>>({});
  const [districtFilter, setDistrictFilter] = useState<(typeof DISTRICT_OPTIONS)[number]>("All Districts");
  const [typeFilter, setTypeFilter] = useState<(typeof INSIGHT_TYPE_OPTIONS)[number]>("All Types");
  const [priorityFilter, setPriorityFilter] = useState<(typeof PRIORITY_OPTIONS)[number]>("All Priorities");
  const [confidenceFilter, setConfidenceFilter] = useState<(typeof CONFIDENCE_OPTIONS)[number]>("All Confidence");
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const derivedInsights = useMemo(
    () => operationalInsights(incidents, alerts, resourceRequests, dispatches),
    [incidents, alerts, resourceRequests, dispatches],
  );
  const insights = useMemo(
    () => derivedInsights.map((insight) => ({ ...insight, status: insightStatuses[insight.id] ?? insight.status })),
    [derivedInsights, insightStatuses],
  );

  useEffect(() => {
    modalContentRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [selectedInsight]);

  const filteredInsights = useMemo(() => {
    return insights.filter((insight) => {
      const districtMatch = districtFilter === "All Districts" || insight.district === districtFilter;
      const typeMatch = typeFilter === "All Types" || insight.type === typeFilter;
      const priorityMatch = priorityFilter === "All Priorities" || insight.priority === priorityFilter;

      let confidenceMatch = true;
      if (confidenceFilter !== "All Confidence") {
        if (confidenceFilter === "Very High (90+%)" && insight.confidence < 90) confidenceMatch = false;
        if (confidenceFilter === "High (70-89%)" && (insight.confidence < 70 || insight.confidence >= 90)) confidenceMatch = false;
        if (confidenceFilter === "Moderate (50-69%)" && (insight.confidence < 50 || insight.confidence >= 70)) confidenceMatch = false;
        if (confidenceFilter === "Low (<50%)" && insight.confidence >= 50) confidenceMatch = false;
      }

      return districtMatch && typeMatch && priorityMatch && confidenceMatch;
    });
  }, [insights, districtFilter, typeFilter, priorityFilter, confidenceFilter]);

  const highConfidenceCount = useMemo(() => insights.filter((i) => i.confidence >= 80).length, [insights]);
  const uniqueDistricts = useMemo(() => new Set(insights.map((i) => i.district)).size, [insights]);
  const activeRecommendations = useMemo(() => insights.filter((i) => i.status === "NEW" || i.status === "MONITORING").length, [insights]);

  const clearFilters = () => {
    setDistrictFilter("All Districts");
    setTypeFilter("All Types");
    setPriorityFilter("All Priorities");
    setConfidenceFilter("All Confidence");
  };

  const handleStatusUpdate = (nextStatus: InsightStatus) => {
    if (!selectedInsight) return;

    setInsightStatuses((currentStatuses) => ({ ...currentStatuses, [selectedInsight.id]: nextStatus }));

    setSelectedInsight((current) => (current ? { ...current, status: nextStatus } : null));
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
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 lg:text-3xl">AI INSIGHTS</h2>
            <p className="mt-1 text-base font-medium text-slate-600">AI-assisted district intelligence, anomaly detection, and operational recommendations</p>
            <div className="mt-2 inline-block rounded-md border-2 border-violet-300 bg-violet-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-violet-700">
              AI-Assisted / Demo Intelligence
            </div>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">ACTIVE INSIGHTS</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{filteredInsights.length}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">HIGH CONFIDENCE</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{highConfidenceCount}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">DISTRICTS FLAGGED</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{uniqueDistricts}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">RECOMMENDATIONS</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{activeRecommendations}</p>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">INSIGHT FILTERS</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">District</label>
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
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Type</label>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as (typeof INSIGHT_TYPE_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {INSIGHT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value as (typeof PRIORITY_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Confidence</label>
                <select
                  value={confidenceFilter}
                  onChange={(event) => setConfidenceFilter(event.target.value as (typeof CONFIDENCE_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {CONFIDENCE_OPTIONS.map((option) => (
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
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">AI INSIGHTS QUEUE</h3>
            </div>

            {filteredInsights.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left">
                  <thead>
                    <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
                      <th className="px-3 py-2">INSIGHT</th>
                      <th className="px-3 py-2">DISTRICT</th>
                      <th className="px-3 py-2">TYPE</th>
                      <th className="px-3 py-2">PRIORITY</th>
                      <th className="px-3 py-2">CONFIDENCE</th>
                      <th className="px-3 py-2">STATUS</th>
                      <th className="px-3 py-2">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInsights.map((insight) => (
                      <tr key={insight.id} className="rounded-md border-2 border-slate-200 bg-slate-50">
                        <td className="px-3 py-3 text-sm font-bold text-slate-900">{insight.title}</td>
                        <td className="px-3 py-3 text-sm font-medium text-slate-700">{insight.district}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getTypeClasses(insight.type)}`}>
                            {insight.type}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getPriorityClasses(insight.priority)}`}>
                            {insight.priority}
                          </span>
                        </td>
                        <td className={`px-3 py-3 text-sm font-bold ${getConfidenceColor(insight.confidence)}`}>{insight.confidence}%</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(insight.status)}`}>
                            {insight.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedInsight(insight)}
                            className="text-xs font-bold text-emerald-700 transition hover:text-emerald-900"
                          >
                            View <span aria-hidden="true">→</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md border-2 border-slate-300 bg-slate-50 px-4 py-4">
                <div className="text-lg font-extrabold text-slate-900">NO INSIGHTS FOUND</div>
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
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">AI OPERATIONAL RECOMMENDATIONS</h3>
            </div>

            <div className="space-y-4">
              {insights
                .filter((i) => i.status === "NEW" || i.status === "MONITORING")
                .map((insight) => (
                  <div key={insight.id} className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-base font-extrabold text-slate-900">{insight.recommendation.split(".")[0]}.</h4>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm">
                          <div>
                            <span className="font-bold text-slate-700">District:</span>{" "}
                            <span className="text-slate-600">{insight.district}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Reason:</span>{" "}
                            <span className="text-slate-600">{insight.type}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Confidence:</span>{" "}
                            <span className={`font-bold ${getConfidenceColor(insight.confidence)}`}>{insight.confidence}%</span>
                          </div>
                          <div>
                            <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getPriorityClasses(insight.priority)}`}>
                              {insight.priority}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-violet-300 bg-violet-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-violet-600 bg-white text-sm font-extrabold text-violet-700">
                ⓘ
              </div>
              <div>
                <h4 className="text-base font-extrabold uppercase tracking-wide text-violet-900">AI Assisted Decision Support</h4>
                <p className="mt-2 text-sm font-medium leading-6 text-violet-800">
                  Insights shown here are simulated operational intelligence for demonstration. Production deployment would connect these workflows to validated epidemiological,
                  hydrological, incident, and resource data models.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {selectedInsight && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border-2 border-slate-300 bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b-2 border-slate-300 px-5 py-4">
              <h4 className="text-xl font-extrabold text-slate-950">{selectedInsight.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
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
                    <div className="mt-1 text-base font-bold text-slate-900">{selectedInsight.district}</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Insight Type</div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getTypeClasses(selectedInsight.type)}`}>
                        {selectedInsight.type}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Priority</div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getPriorityClasses(selectedInsight.priority)}`}>
                        {selectedInsight.priority}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Confidence Score</div>
                    <div className={`mt-1 text-base font-bold ${getConfidenceColor(selectedInsight.confidence)}`}>{selectedInsight.confidence}%</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Status</div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(selectedInsight.status)}`}>
                        {selectedInsight.status}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Created</div>
                    <div className="mt-1 text-base font-bold text-slate-900">{selectedInsight.createdAt}</div>
                  </div>
                </div>

                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Summary</div>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{selectedInsight.summary}</p>
                </div>

                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Detected Signals</div>
                  <ul className="mt-2 space-y-1">
                    {selectedInsight.signals.map((signal, index) => (
                      <li key={index} className="text-sm font-medium text-slate-700">
                        • {signal}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">AI-Assisted Assessment</div>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                    Multi-source analysis integrating available data streams suggests elevated likelihood for the indicated operational concern. Assessment confidence reflects data quality and
                    temporal relevance. Recommend operational cross-validation with field teams and subject matter experts.
                  </p>
                </div>

                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Recommended Operational Response</div>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{selectedInsight.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t-2 border-slate-300 bg-white px-5 py-4">
              <div className="flex flex-wrap gap-3">
                {selectedInsight.status !== "MONITORING" && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate("MONITORING")}
                    className="rounded-md border-2 border-slate-300 bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white"
                  >
                    MARK MONITORING
                  </button>
                )}
                {selectedInsight.status !== "ACTIONED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate("ACTIONED")}
                    className="rounded-md border-2 border-slate-300 bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white"
                  >
                    MARK ACTIONED
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
