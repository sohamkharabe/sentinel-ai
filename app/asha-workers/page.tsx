"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

type WorkerStatus = "ON FIELD" | "AVAILABLE" | "TRAINING" | "UNAVAILABLE";

type ASHAWorker = {
  id: string;
  name: string;
  district: string;
  village: string;
  block: string;
  phone: string;
  status: WorkerStatus;
  assignedHouseholds: number;
  lastActivity: string;
  operationalNotes: string;
};

type FieldReport = {
  id: string;
  workerId: string;
  workerName: string;
  district: string;
  village: string;
  type: "Disease Surveillance" | "Household Survey" | "Water Quality" | "Health Camp" | "Emergency Visit";
  date: string;
  status: "SUBMITTED" | "PENDING" | "REVIEWED";
  summary: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
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

const STATUS_OPTIONS = ["All Status", "ON FIELD", "AVAILABLE", "TRAINING", "UNAVAILABLE"] as const;

const initialWorkers: ASHAWorker[] = [
  {
    id: "asha-001",
    name: "Mina Das",
    district: "Lakhimpur",
    village: "Khelmati",
    block: "North Lakhimpur",
    phone: "+91 98100 11223",
    status: "ON FIELD",
    assignedHouseholds: 42,
    lastActivity: "2 hours ago",
    operationalNotes:
      "Community outreach in flood-prone hamlets continues with vaccination follow-up and pregnant mother checks. Family counseling remains active in the riverbank settlements.",
  },
  {
    id: "asha-002",
    name: "Nirmala Bora",
    district: "Tinsukia",
    village: "Bharalgaon",
    block: "Makum",
    phone: "+91 97000 33445",
    status: "AVAILABLE",
    assignedHouseholds: 37,
    lastActivity: "Today, 08:30",
    operationalNotes:
      "Household registration is complete for the month. Available for screening drives and health camp coordination in nearby villages.",
  },
  {
    id: "asha-003",
    name: "Ranjita Saikia",
    district: "Dibrugarh",
    village: "Bordoibam",
    block: "Dibrugarh East",
    phone: "+91 98765 43210",
    status: "TRAINING",
    assignedHouseholds: 29,
    lastActivity: "Yesterday",
    operationalNotes:
      "Currently in refresher training for digital reporting and patient referral documentation. Coverage continues through backup field support.",
  },
  {
    id: "asha-004",
    name: "Pabitra Kalita",
    district: "Jorhat",
    village: "Garmur",
    block: "Jorhat North",
    phone: "+91 95555 77881",
    status: "ON FIELD",
    assignedHouseholds: 55,
    lastActivity: "20 minutes ago",
    operationalNotes:
      "Triage and follow-up visits are underway for elderly and pregnant patients. Daily maternal and neonatal counseling is being delivered.",
  },
  {
    id: "asha-005",
    name: "Juri Gogoi",
    district: "Sivasagar",
    village: "Dikhowmukh",
    block: "Sivasagar West",
    phone: "+91 91234 87654",
    status: "UNAVAILABLE",
    assignedHouseholds: 18,
    lastActivity: "3 days ago",
    operationalNotes:
      "Temporary availability disruption due to family emergency and district travel constraints. Medical officer follow-up requested for coverage continuity.",
  },
  {
    id: "asha-006",
    name: "Moni Neog",
    district: "Sonitpur",
    village: "Bihaguri",
    block: "Tezpur",
    phone: "+91 99880 45671",
    status: "AVAILABLE",
    assignedHouseholds: 46,
    lastActivity: "Today, 11:15",
    operationalNotes:
      "Available for district screening, nutrition counseling, and home-based care follow-up in surrounding clusters.",
  },
  {
    id: "asha-007",
    name: "Borsha Bharali",
    district: "Lakhimpur",
    village: "Kumolia",
    block: "Dhakuakhana",
    phone: "+91 90909 76543",
    status: "ON FIELD",
    assignedHouseholds: 51,
    lastActivity: "45 minutes ago",
    operationalNotes:
      "Village mobilization is active for fever surveillance and seasonal respiratory screening among children and elderly families.",
  },
  {
    id: "asha-008",
    name: "Sujata Baruah",
    district: "Dibrugarh",
    village: "Moran",
    block: "Dibrugarh South",
    phone: "+91 97333 11223",
    status: "AVAILABLE",
    assignedHouseholds: 40,
    lastActivity: "Today, 09:45",
    operationalNotes:
      "Ready for outreach scheduling with nearby schools and anganwadi centers after completing routine household visits.",
  },
  {
    id: "asha-009",
    name: "Khirumoni Gogoi",
    district: "Jorhat",
    village: "Madhabpur",
    block: "Titabar",
    phone: "+91 96666 21345",
    status: "TRAINING",
    assignedHouseholds: 25,
    lastActivity: "2 days ago",
    operationalNotes:
      "Participating in digital referral and health campaign training. Scheduled to resume household case monitoring next week.",
  },
  {
    id: "asha-010",
    name: "Mamoni Dutta",
    district: "Tinsukia",
    village: "Sadia",
    block: "Sadiya",
    phone: "+91 98989 77777",
    status: "ON FIELD",
    assignedHouseholds: 49,
    lastActivity: "5 minutes ago",
    operationalNotes:
      "Rapid response visits are ongoing in border settlements with nutritional counseling and maternal tracking support.",
  },
];

const initialReports: FieldReport[] = [
  {
    id: "fr-101",
    workerId: "asha-001",
    workerName: "Mina Das",
    district: "Lakhimpur",
    village: "Khelmati",
    type: "Disease Surveillance",
    date: "2026-08-11",
    status: "SUBMITTED",
    summary: "Fever screening underway in riverbank households with vector-control follow-up initiated.",
    severity: "HIGH",
  },
  {
    id: "fr-102",
    workerId: "asha-004",
    workerName: "Pabitra Kalita",
    district: "Jorhat",
    village: "Garmur",
    type: "Health Camp",
    date: "2026-08-10",
    status: "REVIEWED",
    summary: "Community health camp completed with maternal consultation and blood pressure screening for older adults.",
    severity: "MEDIUM",
  },
  {
    id: "fr-103",
    workerId: "asha-010",
    workerName: "Mamoni Dutta",
    district: "Tinsukia",
    village: "Sadia",
    type: "Emergency Visit",
    date: "2026-08-09",
    status: "PENDING",
    summary: "Emergency household visit completed for a high-risk pregnancy referral with transport follow-up required.",
    severity: "HIGH",
  },
  {
    id: "fr-104",
    workerId: "asha-006",
    workerName: "Moni Neog",
    district: "Sonitpur",
    village: "Bihaguri",
    type: "Water Quality",
    date: "2026-08-08",
    status: "SUBMITTED",
    summary: "Water testing samples collected from shared borewells and filtration points in the cluster.",
    severity: "MEDIUM",
  },
  {
    id: "fr-105",
    workerId: "asha-002",
    workerName: "Nirmala Bora",
    district: "Tinsukia",
    village: "Bharalgaon",
    type: "Household Survey",
    date: "2026-08-07",
    status: "REVIEWED",
    summary: "Family survey completed across 18 households, focusing on respiratory symptoms and vaccine compliance.",
    severity: "LOW",
  },
  {
    id: "fr-106",
    workerId: "asha-007",
    workerName: "Borsha Bharali",
    district: "Lakhimpur",
    village: "Kumolia",
    type: "Disease Surveillance",
    date: "2026-08-06",
    status: "SUBMITTED",
    summary: "Seasonal surveillance conducted for diarrheal symptoms, with recommended hygiene follow-up communicated to households.",
    severity: "MEDIUM",
  },
];

const getStatusClasses = (status: WorkerStatus) => {
  switch (status) {
    case "ON FIELD":
      return "border border-emerald-700 bg-emerald-50 text-emerald-700";
    case "AVAILABLE":
      return "border border-blue-700 bg-blue-50 text-blue-700";
    case "TRAINING":
      return "border border-amber-600 bg-amber-50 text-amber-700";
    case "UNAVAILABLE":
      return "border border-red-700 bg-red-50 text-red-700";
    default:
      return "border border-slate-300 bg-slate-100 text-slate-700";
  }
};

const getReportStatusClasses = (status: FieldReport["status"]) => {
  switch (status) {
    case "SUBMITTED":
      return "border border-blue-700 bg-blue-50 text-blue-700";
    case "PENDING":
      return "border border-amber-600 bg-amber-50 text-amber-700";
    case "REVIEWED":
      return "border border-emerald-700 bg-emerald-50 text-emerald-700";
    default:
      return "border border-slate-300 bg-slate-100 text-slate-700";
  }
};

const getSeverityClasses = (severity: FieldReport["severity"]) => {
  switch (severity) {
    case "HIGH":
      return "border border-red-700 bg-red-50 text-red-700";
    case "MEDIUM":
      return "border border-amber-600 bg-amber-50 text-amber-700";
    case "LOW":
      return "border border-slate-500 bg-slate-100 text-slate-700";
    default:
      return "border border-slate-300 bg-slate-100 text-slate-700";
  }
};

export default function AshaWorkersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState<(typeof DISTRICT_OPTIONS)[number]>("All Districts");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All Status");
  const [workers, setWorkers] = useState<ASHAWorker[]>(initialWorkers);
  const [selectedWorker, setSelectedWorker] = useState<ASHAWorker | null>(null);
  const [quickActionMessage, setQuickActionMessage] = useState("");

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        worker.name.toLowerCase().includes(query) ||
        worker.village.toLowerCase().includes(query) ||
        worker.district.toLowerCase().includes(query);

      const matchesDistrict =
        districtFilter === "All Districts" || worker.district === districtFilter;
      const matchesStatus = statusFilter === "All Status" || worker.status === statusFilter;

      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [districtFilter, searchTerm, statusFilter, workers]);

  const clearFilters = () => {
    setSearchTerm("");
    setDistrictFilter("All Districts");
    setStatusFilter("All Status");
    setQuickActionMessage("");
  };

  const handleMarkUnavailable = (workerId: string) => {
    setWorkers((currentWorkers) =>
      currentWorkers.map((worker) =>
        worker.id === workerId ? { ...worker, status: "UNAVAILABLE" } : worker,
      ),
    );

    const worker = workers.find((item) => item.id === workerId);
    setQuickActionMessage(`${worker?.name ?? "Worker"} marked unavailable.`);
    setSelectedWorker((current) =>
      current && current.id === workerId ? { ...current, status: "UNAVAILABLE" } : current,
    );
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
              ASHA WORKERS
            </h2>
            <p className="mt-2 text-base font-medium text-slate-600 lg:text-lg">
              Workforce coverage, assignments, and field performance
            </p>
          </div>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Active ASHA Workers</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">231</p>
            </div>

            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Assigned Villages</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">184</p>
            </div>

            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Pending Visits</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">26</p>
            </div>

            <div className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Field Reports</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">142</p>
            </div>
          </section>

          <section className="mb-6 rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">WORKFORCE FILTERS</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="self-start rounded-md border-2 border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                CLEAR FILTERS
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
              <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Search Worker
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, village or district"
                  className="rounded-md border-2 border-slate-300 bg-white px-3 py-3 text-base font-medium text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-700"
                />
              </label>

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
            </div>
          </section>

          <section className="mb-6 rounded-md border-2 border-slate-300 bg-white shadow-sm">
            <div className="border-b-2 border-slate-300 px-5 py-4">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">ASHA WORKER ROSTER</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-slate-100 text-sm font-extrabold uppercase tracking-wide text-slate-700">
                  <tr>
                    <th className="border-b-2 border-slate-300 px-5 py-4">WORKER</th>
                    <th className="border-b-2 border-slate-300 px-5 py-4">DISTRICT</th>
                    <th className="border-b-2 border-slate-300 px-5 py-4">VILLAGE / BLOCK</th>
                    <th className="border-b-2 border-slate-300 px-5 py-4">STATUS</th>
                    <th className="border-b-2 border-slate-300 px-5 py-4">HOUSEHOLDS</th>
                    <th className="border-b-2 border-slate-300 px-5 py-4">LAST ACTIVE</th>
                    <th className="border-b-2 border-slate-300 px-5 py-4">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="align-top text-base text-slate-800">
                      <td className="border-b-2 border-slate-200 px-5 py-4">
                        <div className="font-extrabold text-slate-950">{worker.name}</div>
                      </td>
                      <td className="border-b-2 border-slate-200 px-5 py-4 font-medium text-slate-700">
                        {worker.district}
                      </td>
                      <td className="border-b-2 border-slate-200 px-5 py-4 font-medium text-slate-700">
                        <div>{worker.village}</div>
                        <div className="text-sm text-slate-600">{worker.block}</div>
                      </td>
                      <td className="border-b-2 border-slate-200 px-5 py-4">
                        <span className={`inline-flex rounded-md px-3 py-1.5 text-sm font-extrabold ${getStatusClasses(worker.status)}`}>
                          {worker.status}
                        </span>
                      </td>
                      <td className="border-b-2 border-slate-200 px-5 py-4 font-medium text-slate-700">
                        {worker.assignedHouseholds}
                      </td>
                      <td className="border-b-2 border-slate-200 px-5 py-4 font-medium text-slate-700">
                        {worker.lastActivity}
                      </td>
                      <td className="border-b-2 border-slate-200 px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedWorker(worker)}
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

            {filteredWorkers.length === 0 && (
              <div className="border-t-2 border-slate-300 p-8 text-center">
                <p className="text-2xl font-extrabold text-slate-950">NO WORKERS FOUND</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-md border-2 border-slate-300 bg-white px-5 py-3 text-base font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  CLEAR FILTERS
                </button>
              </div>
            )}
          </section>

          <section className="mb-6 rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">RECENT FIELD REPORTS</h3>
            </div>

            <div className="space-y-4">
              {initialReports.map((report) => (
                <div key={report.id} className="rounded-md border-2 border-slate-300 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-slate-950">{report.type}</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        Worker: {report.workerName} • {report.district}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex rounded-md px-3 py-1.5 text-sm font-extrabold ${getReportStatusClasses(report.status)}`}>
                        {report.status}
                      </span>
                      <span className={`inline-flex rounded-md px-3 py-1.5 text-sm font-extrabold ${getSeverityClasses(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-slate-700">
                    <span>{report.village}</span>
                    <span>{report.date}</span>
                  </div>

                  <p className="mt-3 text-base font-medium leading-7 text-slate-700">{report.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-md border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-3">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">FIELD OPERATIONS</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setQuickActionMessage("Follow-up assignment queued for review.")}
                className="rounded-md border-2 border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                ASSIGN FOLLOW-UP
              </button>

              <button
                type="button"
                onClick={() => setQuickActionMessage("Selected worker has been marked unavailable.")}
                className="rounded-md border-2 border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                MARK WORKER UNAVAILABLE
              </button>

              <button
                type="button"
                onClick={() => setQuickActionMessage("Field reports panel is open for review.")}
                className="rounded-md border-2 border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                VIEW FIELD REPORTS
              </button>
            </div>

            {quickActionMessage && (
              <div className="mt-4 rounded-md border-2 border-blue-700 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
                {quickActionMessage}
              </div>
            )}
          </aside>
        </main>
      </div>

      {selectedWorker && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-md border-2 border-slate-300 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Worker Details</p>
                <h4 className="mt-2 text-2xl font-extrabold text-slate-950">{selectedWorker.name}</h4>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                CLOSE
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">District</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedWorker.district}</p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Village</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedWorker.village}</p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Block</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedWorker.block}</p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Phone</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedWorker.phone}</p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Status</p>
                <div className="mt-2">
                  <span className={`inline-flex rounded-md px-3 py-1.5 text-sm font-extrabold ${getStatusClasses(selectedWorker.status)}`}>
                    {selectedWorker.status}
                  </span>
                </div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Assigned Households</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedWorker.assignedHouseholds}</p>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Last Activity</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{selectedWorker.lastActivity}</p>
              </div>
            </div>

            <div className="mt-5 rounded-md border-2 border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Operational Notes</p>
              <p className="mt-3 text-base font-medium leading-7 text-slate-700">{selectedWorker.operationalNotes}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="rounded-md border-2 border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                CLOSE
              </button>

              <button
                type="button"
                onClick={() => handleMarkUnavailable(selectedWorker.id)}
                className="rounded-md border-2 border-red-700 bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                MARK UNAVAILABLE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
