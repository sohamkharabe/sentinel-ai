"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

type District =
  | "Lakhimpur"
  | "Tinsukia"
  | "Dibrugarh"
  | "Jorhat"
  | "Sivasagar"
  | "Sonitpur";

type ReportType = "District Risk" | "Incident" | "Disease Surveillance" | "Resource";
type ReportStatus = "Ready" | "Pending" | "Archived";

type Report = {
  id: number;
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
] as const;

const STATUS_OPTIONS = ["All Status", "Ready", "Pending", "Archived"] as const;

const INITIAL_REPORTS: Report[] = [
  {
    id: 1,
    title: "Monsoon Risk Assessment",
    district: "Lakhimpur",
    type: "District Risk",
    status: "Ready",
    date: "2026-08-10",
    summary:
      "Flood-prone pockets identified along key drainage channels with elevated risk across low-lying communities and transport corridors.",
  },
  {
    id: 2,
    title: "Industrial Fire Incident",
    district: "Tinsukia",
    type: "Incident",
    status: "Pending",
    date: "2026-08-09",
    summary:
      "Response teams have been dispatched to a reported storage facility fire; containment and air quality monitoring remain active.",
  },
  {
    id: 3,
    title: "Malaria Surveillance Snapshot",
    district: "Dibrugarh",
    type: "Disease Surveillance",
    status: "Ready",
    date: "2026-08-08",
    summary:
      "Case clusters were reviewed in border and riverine settlements, with proactive vector-control measures scheduled for the next cycle.",
  },
  {
    id: 4,
    title: "Medical Supply Distribution",
    district: "Jorhat",
    type: "Resource",
    status: "Ready",
    date: "2026-08-07",
    summary:
      "Allocation plan approved for rural health centers and mobile units to replenish trauma kits and essential medicines.",
  },
  {
    id: 5,
    title: "Landslide Impact Review",
    district: "Sivasagar",
    type: "District Risk",
    status: "Archived",
    date: "2026-08-06",
    summary:
      "Earlier landslide vulnerability review has been archived after completion of mitigation and community risk communication measures.",
  },
  {
    id: 6,
    title: "Road Accident Response Summary",
    district: "Sonitpur",
    type: "Incident",
    status: "Ready",
    date: "2026-08-05",
    summary:
      "Comprehensive review of emergency coordination and patient transfer timing across district access routes and referral points.",
  },
  {
    id: 7,
    title: "Dengue Alert Review",
    district: "Tinsukia",
    type: "Disease Surveillance",
    status: "Pending",
    date: "2026-08-04",
    summary:
      "Health workers are validating household reporting and preparing targeted inspections in the affected neighborhood clusters.",
  },
  {
    id: 8,
    title: "Relief Stock Allocation",
    district: "Lakhimpur",
    type: "Resource",
    status: "Ready",
    date: "2026-08-03",
    summary:
      "Temporary shelters and emergency stockpiles were aligned with district needs and delivery timing across priority settlements.",
  },
  {
    id: 9,
    title: "Heat Stress Monitoring",
    district: "Dibrugarh",
    type: "District Risk",
    status: "Pending",
    date: "2026-08-02",
    summary:
      "Daily exposure risk remains elevated across outdoor work clusters and vulnerable populations, requiring targeted monitoring.",
  },
];

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [districtFilter, setDistrictFilter] = useState<(typeof DISTRICT_OPTIONS)[number]>("All Districts");
  const [reportTypeFilter, setReportTypeFilter] = useState<(typeof REPORT_TYPE_OPTIONS)[number]>("All Reports");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All Status");
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [notice, setNotice] = useState("");

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

    setReports((currentReports) => [draftReport, ...currentReports]);
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
