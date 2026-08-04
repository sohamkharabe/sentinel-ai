export default function IncidentFeed() {
  return (
    <div className="rounded border border-slate-100 p-4 bg-white">
      <h3 className="text-sm font-medium text-slate-900">Live Incident Feed</h3>
      <div id="alerts" className="mt-3 space-y-3 text-sm text-slate-600">
        <div className="rounded p-3 border border-slate-100 bg-slate-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium">Flooding reported — Lakhimpur, Assam</div>
              <div className="text-xs text-slate-500 mt-1">Water levels rising near riverbank; low-lying areas advised to evacuate. Reported 5 minutes ago.</div>
            </div>
            <div className="text-xs text-red-600 font-semibold">High</div>
          </div>
        </div>

        <div className="rounded p-3 border border-slate-100 bg-slate-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium">Febrile illness cluster — Tinsukia District</div>
              <div className="text-xs text-slate-500 mt-1">12 patients with fever and respiratory symptoms; samples pending. Reported 1 hour ago.</div>
            </div>
            <div className="text-xs text-yellow-600 font-semibold">Medium</div>
          </div>
        </div>

        <div className="rounded p-3 border border-slate-100 bg-slate-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium">Bridge damage — NH-37 near Dibrugarh</div>
              <div className="text-xs text-slate-500 mt-1">Structural damage reported; route closed for heavy vehicles. Reported 2 hours ago.</div>
            </div>
            <div className="text-xs text-red-600 font-semibold">High</div>
          </div>
        </div>
      </div>
    </div>
  );
}
