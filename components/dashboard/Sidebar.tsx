export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">SS</div>
        <div>
          <div className="text-sm font-semibold">Suraksha Saarthi</div>
          <div className="text-xs text-slate-500">Government Dashboard</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 text-sm">
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#">Dashboard</a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#map">Disease Map</a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#reports">Health Reports</a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#asha">ASHA Workers</a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#resources">Resources</a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#alerts">Alerts</a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#ai">AI Insights</a>
        <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#settings">Settings</a>
      </nav>

      <div className="mt-6 text-xs text-slate-500">v1.0 • Suraksha Saarthi</div>
    </aside>
  );
}
