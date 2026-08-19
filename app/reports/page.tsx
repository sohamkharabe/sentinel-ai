"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useOperationalStore, type Alert, type Dispatch, type Incident, type ResourceRequest } from "@/lib/operational-store";

type District =
  | "Lakhimpur"
  | "Tinsukia"
  | "Dibrugarh"
  | "Jorhat"
  | "Sivasagar"
  | "Sonitpur";

type ReportType = "District Risk" | "Incident" | "Disease Surveillance" | "Resource" | "Alert" | "Dispatch";
type ReportStatus = "Ready" | "Pending" | "Archived";

type Report = {
  id: string | number;
  title: string;
  district: District;
  type: ReportType;
  status: ReportStatus;
  date: string;
  summary: string;
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

const REPORT_TYPE_OPTIONS = [
  "All Reports",
  "District Risk",
  "Incident",
  "Disease Surveillance",
  "Resource",
  "Alert",
  "Dispatch",
] as const;

const STATUS_OPTIONS = ["All Status", "Ready", "Pending", "Archived"] as const;

const districtName = (district: string) => district.split(",")[0].trim();

const activeOperationalStatus = (status: string) => !["RESOLVED", "CLOSED", "COMPLETED", "REJECTED"].includes(status);

const deriveReports = (
  incidents: Incident[],
  alerts: Alert[],
  resourceRequests: ResourceRequest[],
  dispatches: Dispatch[],
): Report[] => {
  const reports: Report[] = [];
  const alertByIncident = new Map(alerts.filter((alert) => alert.incidentId).map((alert) => [alert.incidentId, alert]));

  incidents.forEach((incident) => {
    const alert = alertByIncident.get(incident.id);
    reports.push({
      id: `INCIDENT-${incident.id}`,
      title: `${incident.title} Report`,
      district: districtName(incident.district) as District,
      type: "Incident",
      status: alert && !activeOperationalStatus(alert.status) ? "Archived" : "Pending",
      date: alert?.createdAt ?? new Date().toISOString().slice(0, 10),
      summary: `${incident.description} Recommended response: ${incident.recommendedResponse}`,
    });
  });

  alerts.forEach((alert) => {
    const type: ReportType = alert.source === "Disease Surveillance" ? "Disease Surveillance" : "Alert";
    reports.push({
      id: `ALERT-${alert.id}`,
      title: `${alert.title} Report`,
      district: districtName(alert.district) as District,
      type,
      status: activeOperationalStatus(alert.status) ? "Ready" : "Archived",
      date: alert.createdAt,
      summary: `${alert.description} Recommended response: ${alert.recommendedResponse}`,
    });
  });

  const riskAlertsByDistrict = new Map<string, Alert[]>();
  alerts.filter((alert) => activeOperationalStatus(alert.status) && ["CRITICAL", "HIGH"].includes(alert.severity)).forEach((alert) => {
    const district = districtName(alert.district);
    riskAlertsByDistrict.set(district, [...(riskAlertsByDistrict.get(district) ?? []), alert]);
  });
  riskAlertsByDistrict.forEach((districtAlerts, district) => {
    reports.push({
      id: `RISK-${district}`,
      title: `${district} District Risk Assessment`,
      district: district as District,
      type: "District Risk",
      status: "Ready",
      date: districtAlerts[0].createdAt,
      summary: `${districtAlerts.length} active high-risk alert${districtAlerts.length === 1 ? "" : "s"} indicate elevated operational pressure. Review: ${districtAlerts.map((alert) => alert.title).join("; ")}.`,
    });
  });

  resourceRequests.forEach((request) => {
    reports.push({
      id: `RESOURCE-${request.id}`,
      title: `${request.incident} Resource Report`,
      district: districtName(request.district) as District,
      type: "Resource",
      status: request.status === "PENDING" ? "Pending" : request.status === "REJECTED" || request.status === "COMPLETED" ? "Archived" : "Ready",
      date: request.createdAt,
      summary: `${request.requestedResources} requested by ${request.authority}. Current request status: ${request.status}.`,
    });
  });

  dispatches.forEach((dispatch) => {
    reports.push({
      id: `DISPATCH-${dispatch.id}`,
      title: `${dispatch.district} Dispatch Report`,
      district: districtName(dispatch.district) as District,
      type: "Dispatch",
      status: dispatch.status === "COMPLETED" ? "Archived" : "Ready",
      date: dispatch.lastUpdated,
      summary: `${dispatch.resources} deployment is ${dispatch.status.toLowerCase()} at ${dispatch.progress}% progress. ETA: ${dispatch.eta}.`,
    });
  });

  return reports;
};

const getStatusClasses = (status: ReportStatus) => {
  switch (status) {
    case "Ready":
      return "border border-emerald-700 bg-emerald-50 text-emerald-700";
    case "Pending":
      return "border border-amber-600 bg-amber-50 text-amber-700";
    case "Archived":
      return "border border-slate-500 bg-slate-100 text-slate-700";
    default:
      return "border border-slate-300 bg-slate-100 text-slate-700";
  }
};

export default function ReportsPage() {
  const { incidents, alerts, resourceRequests, dispatches } = useOperationalStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [districtFilter, setDistrictFilter] = useState<(typeof DISTRICT_OPTIONS)[number]>("All Districts");
  const [reportTypeFilter, setReportTypeFilter] = useState<(typeof REPORT_TYPE_OPTIONS)[number]>("All Reports");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All Status");
  const [generatedReports, setGeneratedReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [notice, setNotice] = useState("");

  const reports = useMemo(
    () => [...generatedReports, ...deriveReports(incidents, alerts, resourceRequests, dispatches)],
    [alerts, dispatches, generatedReports, incidents, resourceRequests],
  );

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const districtMatch =
        districtFilter === "All Districts" || report.district === districtFilter;
      const typeMatch =
        reportTypeFilter === "All Reports" || report.type === reportTypeFilter;
      const statusMatch = statusFilter === "All Status" || report.status === statusFilter;

      return districtMatch && typeMatch && statusMatch;
    });
  }, [districtFilter, reportTypeFilter, reports, statusFilter]);

  const clearFilters = () => {
    setDistrictFilter("All Districts");
    setReportTypeFilter("All Reports");
    setStatusFilter("All Status");
    setNotice("");
  };

  const handleGenerateReport = () => {
    const draftDistrict =
      districtFilter === "All Districts" ? "Lakhimpur" : districtFilter;
    const draftType =
      reportTypeFilter === "All Reports" ? "District Risk" : reportTypeFilter;

    const draftReport: Report = {
      id: Date.now(),
      title: `${draftDistrict} ${draftType} Draft`,
      district: draftDistrict as District,
      type: draftType as ReportType,
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
      summary: `Draft report generated from the active filters for ${draftDistrict} and ${draftType}. This entry is queued for review and approval before publication.`,
    };

    setGeneratedReports((currentReports) => [draftReport, ...currentReports]);
    setNotice(`Generated: ${draftReport.title} is now pending review.`);
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
              ☰
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
              Search
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 text-sm font-extrabold text-slate-950">
              SS
            </div>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 lg:text-4xl">
              REPORTS
            </h2>
            <p className="mt-2 text-base font-medium text-slate-600 lg:text-lg">
              Operational reports and district intelligence
            </p>
          </div>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Total Reports</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">128</p>
            </div>

            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">District Reports</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">24</p>
            </div>

            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Incident Reports</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">67</p>
            </div>

            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Pending Reports</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">5</p>
            </div>
          </section>

          <section className="mb-6 rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">REPORT FILTERS</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="self-start rounded-md border-2 border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                CLEAR FILTERS
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                District
                <select
                  value={districtFilter}
                  onChange={(event) => setDistrictFilter(event.target.value as (typeof DISTRICT_OPTIONS)[number])}
                  className="rounded-md border-2 border-slate-300 bg-white px-3 py-3 text-base font-medium text-slate-900 outline-none focus:border-blue-700"
                >
                  {DISTRICT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Report Type
                <select
                  value={reportTypeFilter}
                  onChange={(event) => setReportTypeFilter(event.target.value as (typeof REPORT_TYPE_OPTIONS)[number])}
                  className="rounded-md border-2 border-slate-300 bg-white px-3 py-3 text-base font-medium text-slate-900 outline-none focus:border-blue-700"
                >
                  {REPORT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number])}
                  className="rounded-md border-2 border-slate-300 bg-white px-3 py-3 text-base font-medium text-slate-900 outline-none focus:border-blue-700"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="w-full rounded-md border-2 border-slate-300 bg-slate-950 px-4 py-3 text-base font-extrabold text-white transition hover:bg-slate-800"
                >
                  GENERATE REPORT
                </button>
              </div>
            </div>

            {notice && (
              <div className="mt-4 rounded-md border-2 border-emerald-700 bg-emerald-50 px-4 py-3 text-base font-bold text-emerald-800">
                {notice}
              </div>
            )}
          </section>

          <section className="rounded-md border-2 border-slate-300 bg-white shadow-sm">
            <div className="border-b-2 border-slate-300 px-5 py-4">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">RECENT REPORTS</h3>
            </div>

            {filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-2xl font-extrabold text-slate-950">NO REPORTS FOUND</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-md border-2 border-slate-300 bg-white px-5 py-3 text-base font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="bg-slate-100 text-sm font-extrabold uppercase tracking-wide text-slate-700">
                    <tr>
                      <th className="border-b-2 border-slate-300 px-5 py-4">REPORT</th>
                      <th className="border-b-2 border-slate-300 px-5 py-4">DISTRICT</th>
                      <th className="border-b-2 border-slate-300 px-5 py-4">TYPE</th>
                      <th className="border-b-2 border-slate-300 px-5 py-4">DATE</th>
                      <th className="border-b-2 border-slate-300 px-5 py-4">STATUS</th>
                      <th className="border-b-2 border-slate-300 px-5 py-4">ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="align-top text-base text-slate-800">
                        <td className="border-b-2 border-slate-200 px-5 py-4">
                          <div className="font-extrabold text-slate-950">{report.title}</div>
                        </td>
                        <td className="border-b-2 border-slate-200 px-5 py-4 font-medium text-slate-700">
                          {report.district}
                        </td>
                        <td className="border-b-2 border-slate-200 px-5 py-4 font-medium text-slate-700">
                          {report.type}
                        </td>
                        <td className="border-b-2 border-slate-200 px-5 py-4 font-medium text-slate-700">
                          {new Date(report.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="border-b-2 border-slate-200 px-5 py-4">
                          <span className={`inline-flex rounded-md px-3 py-1.5 text-sm font-extrabold ${getStatusClasses(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="border-b-2 border-slate-200 px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="rounded-md border-2 border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                          >
                            VIEW
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-md border-2 border-slate-300 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Report Details</p>
                <h4 className="mt-2 text-2xl font-extrabold text-slate-950">{selectedReport.title}</h4>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                CLOSE
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">District</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedReport.district}</p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Report Type</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedReport.type}</p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Date</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">
                  {new Date(selectedReport.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Status</p>
                <div className="mt-2">
                  <span className={`inline-flex rounded-md px-3 py-1.5 text-sm font-extrabold ${getStatusClasses(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-md border-2 border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Summary</p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">{selectedReport.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
