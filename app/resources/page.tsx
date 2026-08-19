"use client";

import { useMemo, useState } from "react";
import { Menu, Search } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useOperationalStore } from "@/lib/operational-store";

type InventoryStatus = "LOW STOCK" | "NORMAL" | "OUT OF STOCK";

type ResourceInventory = {
  id: string;
  resource: string;
  district: string;
  available: number;
  reserved: number;
  dispatched: number;
  minimumStock: number;
  note?: string;
};

type ResourceRequest = {
  id: string;
  district: string;
  incident: string;
  priority: "CRITICAL" | "HIGH" | "MODERATE";
  requestedResources: string;
  authority: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN TRANSIT" | "COMPLETED";
};

type Dispatch = {
  id: string;
  district: string;
  authority: string;
  resources: string;
  eta: string;
  status: "PREPARING" | "IN TRANSIT" | "ON SITE" | "COMPLETED";
  progress: number;
  lastUpdated: string;
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

const RESOURCE_OPTIONS = [
  "All Resource Types",
  "Mobile Medical Units",
  "Medical Officers",
  "Medicine Kits",
  "Ambulances",
  "Rescue Teams",
  "Drinking Water Kits",
  "Emergency Food Supplies",
] as const;

const STATUS_OPTIONS = [
  "All Status",
  "LOW STOCK",
  "NORMAL",
  "OUT OF STOCK",
] as const;

const initialInventory: ResourceInventory[] = [
  {
    id: "inv-001",
    resource: "Mobile Medical Units",
    district: "Lakhimpur",
    available: 2,
    reserved: 1,
    dispatched: 1,
    minimumStock: 3,
    note: "Stock level is below recommended threshold. Consider replenishment.",
  },
  {
    id: "inv-002",
    resource: "Medical Officers",
    district: "Lakhimpur",
    available: 8,
    reserved: 2,
    dispatched: 3,
    minimumStock: 6,
    note: "Field coverage remains stable for the current flood response cycle.",
  },
  {
    id: "inv-003",
    resource: "Medicine Kits",
    district: "Tinsukia",
    available: 15,
    reserved: 5,
    dispatched: 7,
    minimumStock: 10,
    note: "Current stock supports routine surveillance and disease response requirements.",
  },
  {
    id: "inv-004",
    resource: "Ambulances",
    district: "Tinsukia",
    available: 0,
    reserved: 2,
    dispatched: 4,
    minimumStock: 2,
    note: "Ambulance availability is critically low and needs urgent replenishment.",
  },
  {
    id: "inv-005",
    resource: "Rescue Teams",
    district: "Dibrugarh",
    available: 5,
    reserved: 2,
    dispatched: 3,
    minimumStock: 4,
    note: "Team deployment is active for bridge and flood monitoring operations.",
  },
  {
    id: "inv-006",
    resource: "Drinking Water Kits",
    district: "Dibrugarh",
    available: 11,
    reserved: 4,
    dispatched: 6,
    minimumStock: 8,
    note: "Water support remains healthy but should be monitored for the next monsoon surge.",
  },
  {
    id: "inv-007",
    resource: "Emergency Food Supplies",
    district: "Jorhat",
    available: 21,
    reserved: 8,
    dispatched: 5,
    minimumStock: 12,
    note: "Supply levels remain above threshold for current household support needs.",
  },
  {
    id: "inv-008",
    resource: "Medicine Kits",
    district: "Jorhat",
    available: 7,
    reserved: 3,
    dispatched: 2,
    minimumStock: 8,
    note: "Stock level is below recommended threshold. Consider replenishment.",
  },
  {
    id: "inv-009",
    resource: "Rescue Teams",
    district: "Sivasagar",
    available: 3,
    reserved: 1,
    dispatched: 1,
    minimumStock: 3,
    note: "Current stock is at minimum threshold, with limited contingency coverage.",
  },
  {
    id: "inv-010",
    resource: "Drinking Water Kits",
    district: "Sivasagar",
    available: 4,
    reserved: 2,
    dispatched: 2,
    minimumStock: 6,
    note: "Water support is below the recommended district reserve level.",
  },
  {
    id: "inv-011",
    resource: "Ambulances",
    district: "Sonitpur",
    available: 4,
    reserved: 1,
    dispatched: 2,
    minimumStock: 3,
    note: "Operational fleet remains adequate for current emergency route demand.",
  },
  {
    id: "inv-012",
    resource: "Medical Officers",
    district: "Sonitpur",
    available: 9,
    reserved: 2,
    dispatched: 4,
    minimumStock: 7,
    note: "Medical staffing remains stable across priority village clusters.",
  },
];

const initialRequests: ResourceRequest[] = [
  {
    id: "REQ-201",
    district: "Lakhimpur",
    incident: "Flooding reported",
    priority: "CRITICAL",
    requestedResources: "Mobile Medical Units ×2; Rescue Teams ×1",
    authority: "District Health Officer",
    createdAt: "2026-08-11 08:15",
    status: "PENDING",
  },
  {
    id: "REQ-202",
    district: "Tinsukia",
    incident: "Febrile illness cluster",
    priority: "HIGH",
    requestedResources: "Medicine Kits ×8; Medical Officers ×3",
    authority: "District Emergency Control Room",
    createdAt: "2026-08-11 07:40",
    status: "PENDING",
  },
  {
    id: "REQ-203",
    district: "Dibrugarh",
    incident: "Bridge damage",
    priority: "HIGH",
    requestedResources: "Rescue Teams ×2; Ambulances ×1",
    authority: "District Magistrate Emergency Cell",
    createdAt: "2026-08-10 18:25",
    status: "APPROVED",
  },
  {
    id: "REQ-204",
    district: "Jorhat",
    incident: "Heat stress monitoring",
    priority: "MODERATE",
    requestedResources: "Drinking Water Kits ×10",
    authority: "District Health Officer",
    createdAt: "2026-08-10 16:50",
    status: "PENDING",
  },
  {
    id: "REQ-205",
    district: "Sivasagar",
    incident: "Disease surveillance escalation",
    priority: "HIGH",
    requestedResources: "Medicine Kits ×5; Medical Officers ×2",
    authority: "State Emergency Operations Centre",
    createdAt: "2026-08-09 12:35",
    status: "REJECTED",
  },
  {
    id: "REQ-206",
    district: "Sonitpur",
    incident: "Water contamination alert",
    priority: "CRITICAL",
    requestedResources: "Drinking Water Kits ×12; Rescue Teams ×1",
    authority: "District Emergency Control Room",
    createdAt: "2026-08-09 09:10",
    status: "IN TRANSIT",
  },
  {
    id: "REQ-207",
    district: "Lakhimpur",
    incident: "Shelter support requirement",
    priority: "MODERATE",
    requestedResources: "Emergency Food Supplies ×20",
    authority: "District Magistrate Emergency Cell",
    createdAt: "2026-08-08 15:05",
    status: "COMPLETED",
  },
];

const initialDispatches: Dispatch[] = [
  {
    id: "DSP-301",
    district: "Lakhimpur",
    authority: "District Health Officer",
    resources: "Mobile Medical Units ×2; Rescue Teams ×1",
    eta: "02:30 hrs",
    status: "PREPARING",
    progress: 20,
    lastUpdated: "2026-08-11 08:05",
  },
  {
    id: "DSP-302",
    district: "Dibrugarh",
    authority: "District Magistrate Emergency Cell",
    resources: "Rescue Teams ×2; Ambulances ×1",
    eta: "01:10 hrs",
    status: "IN TRANSIT",
    progress: 58,
    lastUpdated: "2026-08-11 07:35",
  },
  {
    id: "DSP-303",
    district: "Sonitpur",
    authority: "District Emergency Control Room",
    resources: "Drinking Water Kits ×12; Rescue Teams ×1",
    eta: "00:45 hrs",
    status: "ON SITE",
    progress: 85,
    lastUpdated: "2026-08-10 22:50",
  },
  {
    id: "DSP-304",
    district: "Jorhat",
    authority: "District Health Officer",
    resources: "Drinking Water Kits ×10",
    eta: "Completed",
    status: "COMPLETED",
    progress: 100,
    lastUpdated: "2026-08-10 18:10",
  },
];

void initialRequests;
void initialDispatches;

const getInventoryStatus = (available: number, minimumStock: number): InventoryStatus => {
  if (available === 0) {
    return "OUT OF STOCK";
  }

  if (available <= minimumStock) {
    return "LOW STOCK";
  }

  return "NORMAL";
};

const getStatusClasses = (status: InventoryStatus) => {
  switch (status) {
    case "LOW STOCK":
      return "table-status-badge text-red-700";
    case "OUT OF STOCK":
      return "table-status-badge text-red-900";
    case "NORMAL":
      return "table-status-badge text-emerald-700";
    default:
      return "table-status-badge text-slate-700";
  }
};

const getDispatchStatusClasses = (status: Dispatch["status"]) => {
  switch (status) {
    case "PREPARING":
      return "table-status-badge text-amber-700";
    case "IN TRANSIT":
      return "table-status-badge text-blue-700";
    case "ON SITE":
      return "table-status-badge text-emerald-700";
    case "COMPLETED":
      return "table-status-badge text-slate-700";
    default:
      return "table-status-badge text-slate-700";
  }
};

const getPriorityClasses = (priority: ResourceRequest["priority"]) => {
  switch (priority) {
    case "CRITICAL":
      return "table-severity-critical text-red-700";
    case "HIGH":
      return "table-severity-high text-orange-700";
    case "MODERATE":
      return "table-severity-moderate text-yellow-700";
    default:
      return "table-severity-moderate text-slate-700";
  }
};

export default function ResourcesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState<(typeof RESOURCE_OPTIONS)[number]>("All Resource Types");
  const [districtFilter, setDistrictFilter] = useState<(typeof DISTRICT_OPTIONS)[number]> ("All Districts");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All Status");
  const [inventory] = useState<ResourceInventory[]>(initialInventory);
  const { resourceRequests: requests, dispatches, updateResourceRequestStatus, createDispatchForRequest } = useOperationalStore();
  const [selectedInventory, setSelectedInventory] = useState<ResourceInventory | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
  const [notice, setNotice] = useState("");

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const typeMatch =
        inventoryFilter === "All Resource Types" || item.resource === inventoryFilter;
      const districtMatch =
        districtFilter === "All Districts" || item.district === districtFilter;
      const itemStatus = getInventoryStatus(item.available, item.minimumStock);
      const statusMatch = statusFilter === "All Status" || itemStatus === statusFilter;

      return typeMatch && districtMatch && statusMatch;
    });
  }, [districtFilter, inventory, inventoryFilter, statusFilter]);

  const lowStockItems = useMemo(() => {
    return inventory.filter(({ available, minimumStock }) => available <= minimumStock);
  }, [inventory]);

  const totalStock = useMemo(
    () => inventory.reduce((sum, item) => sum + item.available, 0),
    [inventory]
  );

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "PENDING").length,
    [requests]
  );

  const activeDispatches = useMemo(
    () => dispatches.filter((dispatch) => dispatch.status !== "COMPLETED").length,
    [dispatches]
  );

  const clearFilters = () => {
    setInventoryFilter("All Resource Types");
    setDistrictFilter("All Districts");
    setStatusFilter("All Status");
  };

  const handleApproveRequest = () => {
    if (!selectedRequest) {
      return;
    }

    updateResourceRequestStatus(selectedRequest.id, "APPROVED");
    createDispatchForRequest(selectedRequest);
    setNotice(
      `Request ${selectedRequest.id} approved and a dispatch has been prepared for ${selectedRequest.district}.`
    );
    setSelectedRequest(null);
  };

  const handleRejectRequest = () => {
    if (!selectedRequest) {
      return;
    }

    updateResourceRequestStatus(selectedRequest.id, "REJECTED");

    setNotice(`Request ${selectedRequest.id} rejected and closed for follow-up.`);
    setSelectedRequest(null);
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
              className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-slate-300 bg-white text-xl font-extrabold text-slate-950"
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
              className="rounded-md border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950"
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
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">RESOURCES</h2>
            <p className="mt-1 text-base font-medium text-slate-600">
              Emergency inventory and deployment management
            </p>
          </div>

          {notice && (
            <div className="mb-6 rounded-md border-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {notice}
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">AVAILABLE STOCK</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{totalStock}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">PENDING REQUESTS</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{pendingRequests}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">ACTIVE DISPATCHES</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{activeDispatches}</p>
            </div>

            <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">
              <p className="text-base font-bold text-slate-700">LOW STOCK ALERTS</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{lowStockItems.length}</p>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">RESOURCE INVENTORY</h3>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-700">
                  Resource Type
                </label>
                <select
                  value={inventoryFilter}
                  onChange={(event) => setInventoryFilter(event.target.value as (typeof RESOURCE_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {RESOURCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

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

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
                    <th className="px-3 py-2">RESOURCE</th>
                    <th className="px-3 py-2">DISTRICT</th>
                    <th className="px-3 py-2">AVAILABLE</th>
                    <th className="px-3 py-2">RESERVED</th>
                    <th className="px-3 py-2">DISPATCHED</th>
                    <th className="px-3 py-2">STATUS</th>
                    <th className="px-3 py-2">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const status = getInventoryStatus(item.available, item.minimumStock);

                    return (
                      <tr key={item.id} className="rounded-md border-2 border-slate-200 bg-slate-50">
                        <td className="px-3 py-3 text-sm font-bold text-slate-900">{item.resource}</td>
                        <td className="px-3 py-3 text-sm font-medium text-slate-700">{item.district}</td>
                        <td className="px-3 py-3 text-sm font-bold text-slate-900">{item.available}</td>
                        <td className="px-3 py-3 text-sm font-medium text-slate-700">{item.reserved}</td>
                        <td className="px-3 py-3 text-sm font-medium text-slate-700">{item.dispatched}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedInventory(item)}
                            className="rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-900 transition hover:bg-slate-100"
                          >
                            VIEW
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">PENDING RESOURCE REQUESTS</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
                    <th className="px-3 py-2">REQUEST</th>
                    <th className="px-3 py-2">DISTRICT</th>
                    <th className="px-3 py-2">PRIORITY</th>
                    <th className="px-3 py-2">RESOURCES</th>
                    <th className="px-3 py-2">AUTHORITY</th>
                    <th className="px-3 py-2">STATUS</th>
                    <th className="px-3 py-2">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="rounded-md border-2 border-slate-200 bg-slate-50">
                      <td className="px-3 py-3 text-sm font-bold text-slate-900">{request.id}</td>
                      <td className="px-3 py-3 text-sm font-medium text-slate-700">{request.district}</td>
                      <td className="px-3 py-3 text-sm font-extrabold text-slate-900">
                        <span className={getPriorityClasses(request.priority)}>{request.priority}</span>
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-slate-700">{request.requestedResources}</td>
                      <td className="px-3 py-3 text-sm font-medium text-slate-700">{request.authority}</td>
                      <td className="px-3 py-3 text-sm font-bold text-slate-900">
                        <span className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs uppercase tracking-wide text-slate-800">
                          {request.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(request)}
                          className="rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-900 transition hover:bg-slate-100"
                        >
                          {request.status === "PENDING" ? "REVIEW" : "VIEW"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">ACTIVE DISPATCHES</h3>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {dispatches.map((dispatch) => (
                <div key={dispatch.id} className="rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">{dispatch.id}</div>
                      <div className="mt-1 text-xl font-extrabold text-slate-950">{dispatch.district}</div>
                    </div>
                    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getDispatchStatusClasses(dispatch.status)}`}>
                      {dispatch.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <div><span className="font-bold text-slate-900">Authority:</span> {dispatch.authority}</div>
                    <div><span className="font-bold text-slate-900">Resources:</span> {dispatch.resources}</div>
                    <div><span className="font-bold text-slate-900">ETA:</span> {dispatch.eta}</div>
                    <div><span className="font-bold text-slate-900">Last Updated:</span> {dispatch.lastUpdated}</div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs font-extrabold uppercase tracking-wide text-slate-700">
                      <span>Progress</span>
                      <span>{dispatch.progress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-200">
                      <div
                        className="h-2.5 rounded-full bg-slate-900"
                        style={{ width: `${dispatch.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">RESOURCE ALERTS</h3>
            </div>

            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.map((item) => {
                  const status = getInventoryStatus(item.available, item.minimumStock);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-md border-2 p-4 ${
                        status === "LOW STOCK"
                          ? "border-red-300 bg-red-50"
                          : "border-red-800 bg-red-100"
                      }`}
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-lg font-extrabold text-slate-950">{item.resource}</div>
                          <div className="text-sm font-medium text-slate-700">{item.district}</div>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          Current stock: <span className="text-red-700">{item.available}</span> / Minimum required: {item.minimumStock}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-md border-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                NO ACTIVE STOCK ALERTS
              </div>
            )}
          </section>
        </main>
      </div>

      {selectedInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-xl rounded-lg border-2 border-slate-300 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-slate-300 px-5 py-4">
              <h4 className="text-xl font-extrabold text-slate-950">Inventory Detail</h4>
              <button
                type="button"
                onClick={() => setSelectedInventory(null)}
                className="rounded-md border-2 border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-900"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Resource</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedInventory.resource}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">District</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedInventory.district}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Available</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedInventory.available}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Reserved</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedInventory.reserved}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Dispatched</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedInventory.dispatched}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Minimum Stock</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedInventory.minimumStock}</div>
                </div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Status</div>
                <div className="mt-2">
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(getInventoryStatus(selectedInventory.available, selectedInventory.minimumStock))}`}>
                    {getInventoryStatus(selectedInventory.available, selectedInventory.minimumStock)}
                  </span>
                </div>
              </div>

              <div className="rounded-md border-2 border-amber-200 bg-amber-50 p-3">
                <div className="text-xs font-extrabold uppercase tracking-wide text-amber-800">Operational Note</div>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                  {selectedInventory.note ??
                    "Stock level is below recommended threshold. Consider replenishment."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-lg border-2 border-slate-300 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-slate-300 px-5 py-4">
              <h4 className="text-xl font-extrabold text-slate-950">Request Detail</h4>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-md border-2 border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-900"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Request</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedRequest.id}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">District</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedRequest.district}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Incident</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedRequest.incident}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Priority</div>
                  <div className="mt-1 text-base font-extrabold text-slate-900">
                    <span className={getPriorityClasses(selectedRequest.priority)}>{selectedRequest.priority}</span>
                  </div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Requested Resources</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedRequest.requestedResources}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Authority</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedRequest.authority}</div>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Created</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{selectedRequest.createdAt}</div>
                </div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Status</div>
                <div className="mt-2 text-sm font-bold text-slate-900">{selectedRequest.status}</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {selectedRequest.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      onClick={handleApproveRequest}
                      className="flex-1 rounded-md border-2 border-emerald-700 bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white"
                    >
                      APPROVE
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectRequest}
                      className="flex-1 rounded-md border-2 border-red-700 bg-red-600 px-4 py-3 text-sm font-extrabold text-white"
                    >
                      REJECT
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 rounded-md border-2 border-slate-300 bg-white px-4 py-3 text-sm font-extrabold text-slate-900"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
