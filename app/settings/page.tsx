"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

const DISTRICT_OPTIONS = [
  "All Districts",
  "Lakhimpur",
  "Tinsukia",
  "Dibrugarh",
  "Jorhat",
  "Sivasagar",
  "Sonitpur",
] as const;

const SEVERITY_OPTIONS = ["All Severities", "Critical", "High", "Moderate"] as const;

const REFRESH_INTERVAL_OPTIONS = ["30 seconds", "1 minute", "5 minutes", "15 minutes"] as const;

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // User Profile
  const [fullName, setFullName] = useState("Soham Kharabe");
  const [role, setRole] = useState("Emergency Operations User");
  const [department, setDepartment] = useState("District Emergency Operations");
  const [accessLevel, setAccessLevel] = useState("Operational Coordinator");

  // Notification Preferences
  const [notifCriticalAlerts, setNotifCriticalAlerts] = useState(true);
  const [notifIncidentUpdates, setNotifIncidentUpdates] = useState(true);
  const [notifResourceDispatch, setNotifResourceDispatch] = useState(true);
  const [notifAIInsights, setNotifAIInsights] = useState(true);

  // Operational Preferences
  const [defaultDistrict, setDefaultDistrict] = useState<(typeof DISTRICT_OPTIONS)[number]>("All Districts");
  const [defaultSeverity, setDefaultSeverity] = useState<(typeof SEVERITY_OPTIONS)[number]>("All Severities");
  const [refreshInterval, setRefreshInterval] = useState<(typeof REFRESH_INTERVAL_OPTIONS)[number]>("5 minutes");

  // Confirmation messages
  const [confirmation, setConfirmation] = useState("");
  const [signOutMessage, setSignOutMessage] = useState("");

  const handleSaveSettings = () => {
    setConfirmation("Settings saved successfully.");
    setTimeout(() => setConfirmation(""), 3000);
  };

  const handleResetDefaults = () => {
    setDefaultDistrict("All Districts");
    setDefaultSeverity("All Severities");
    setRefreshInterval("5 minutes");
    setNotifCriticalAlerts(true);
    setNotifIncidentUpdates(true);
    setNotifResourceDispatch(true);
    setNotifAIInsights(true);
    setConfirmation("Settings reset to defaults.");
    setTimeout(() => setConfirmation(""), 3000);
  };

  const handleSignOut = () => {
    setSignOutMessage("Demo sign-out action triggered.");
    setTimeout(() => setSignOutMessage(""), 3000);
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
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 lg:text-3xl">SETTINGS</h2>
            <p className="mt-1 text-base font-medium text-slate-600">Configure operational preferences, notifications, and system access.</p>
          </div>

          {confirmation && (
            <div className="mb-6 rounded-md border-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {confirmation}
            </div>
          )}

          {signOutMessage && (
            <div className="mb-6 rounded-md border-2 border-blue-600 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
              {signOutMessage}
            </div>
          )}

          <section className="rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">USER PROFILE</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Access Level</label>
                <input
                  type="text"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                />
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">NOTIFICATION PREFERENCES</h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-base font-bold text-slate-900">Critical Alerts</div>
                  <p className="mt-1 text-sm font-medium text-slate-600">Receive notifications for critical-level incidents and escalations</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifCriticalAlerts(!notifCriticalAlerts)}
                  className={`flex h-10 w-16 items-center rounded-full border-2 px-1 transition ${
                    notifCriticalAlerts
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-300 bg-slate-100"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full transition ${
                      notifCriticalAlerts ? "translate-x-6 bg-emerald-600" : "bg-slate-400"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-base font-bold text-slate-900">Incident Updates</div>
                  <p className="mt-1 text-sm font-medium text-slate-600">Receive updates on new incidents and case status changes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifIncidentUpdates(!notifIncidentUpdates)}
                  className={`flex h-10 w-16 items-center rounded-full border-2 px-1 transition ${
                    notifIncidentUpdates
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-300 bg-slate-100"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full transition ${
                      notifIncidentUpdates ? "translate-x-6 bg-emerald-600" : "bg-slate-400"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-base font-bold text-slate-900">Resource Dispatch Updates</div>
                  <p className="mt-1 text-sm font-medium text-slate-600">Receive notifications when resources are dispatched or reassigned</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifResourceDispatch(!notifResourceDispatch)}
                  className={`flex h-10 w-16 items-center rounded-full border-2 px-1 transition ${
                    notifResourceDispatch
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-300 bg-slate-100"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full transition ${
                      notifResourceDispatch ? "translate-x-6 bg-emerald-600" : "bg-slate-400"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-base font-bold text-slate-900">AI Insight Notifications</div>
                  <p className="mt-1 text-sm font-medium text-slate-600">Receive AI-assisted intelligence alerts and operational recommendations</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifAIInsights(!notifAIInsights)}
                  className={`flex h-10 w-16 items-center rounded-full border-2 px-1 transition ${
                    notifAIInsights
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-300 bg-slate-100"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full transition ${
                      notifAIInsights ? "translate-x-6 bg-emerald-600" : "bg-slate-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">OPERATIONAL PREFERENCES</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Default District</label>
                <select
                  value={defaultDistrict}
                  onChange={(e) => setDefaultDistrict(e.target.value as (typeof DISTRICT_OPTIONS)[number])}
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
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Default Alert Severity</label>
                <select
                  value={defaultSeverity}
                  onChange={(e) => setDefaultSeverity(e.target.value as (typeof SEVERITY_OPTIONS)[number])}
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
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-700">Dashboard Refresh Interval</label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value as (typeof REFRESH_INTERVAL_OPTIONS)[number])}
                  className="w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                >
                  {REFRESH_INTERVAL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">SYSTEM INFORMATION</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Platform</div>
                <div className="mt-2 text-base font-bold text-slate-900">Suraksha Saarthi</div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Version</div>
                <div className="mt-2 text-base font-bold text-slate-900">0.7.0</div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Environment</div>
                <div className="mt-2 text-base font-bold text-slate-900">Demo / Local</div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">System Status</div>
                <div className="mt-2 text-base font-bold text-emerald-700">Operational</div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Last Data Synchronization</div>
                <div className="mt-2 text-base font-bold text-slate-900">Just now</div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Data Source</div>
                <div className="mt-2 text-base font-bold text-slate-900">Simulated Dataset</div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-lg border-2 border-slate-300 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">SECURITY & ACCESS</h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Current Session</div>
                <div className="mt-2 text-base font-bold text-slate-900">Operational Coordinator</div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Access Level</div>
                <div className="mt-2 text-base font-bold text-slate-900">Operational</div>
              </div>

              <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Session Status</div>
                    <div className="mt-2 text-base font-bold text-emerald-700">Active</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-md border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-900 transition hover:bg-slate-100"
                  >
                    SIGN OUT
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="rounded-md border-2 border-slate-300 bg-slate-900 px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-slate-800"
            >
              SAVE SETTINGS
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="rounded-md border-2 border-slate-300 bg-white px-6 py-2.5 text-sm font-extrabold text-slate-900 transition hover:bg-slate-100"
            >
              RESET TO DEFAULTS
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
