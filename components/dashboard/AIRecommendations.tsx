export default function AIRecommendations() {
  return (
    <div className="rounded border border-slate-100 p-4 bg-white">
      <h3 className="text-sm font-medium text-slate-900">AI Recommendations</h3>
      <div id="ai" className="mt-3 space-y-3 text-sm text-slate-600">
        <div className="rounded p-3 border border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Deploy 2 mobile medical units to Dibrugarh</div>
              <div className="text-xs text-slate-500 mt-1">Predicted 72% probability of febrile outbreak in next 48 hours. Priority: High.</div>
            </div>
            <div className="text-xs text-slate-700 font-semibold">Confidence: 72%</div>
          </div>
        </div>

        <div className="rounded p-3 border border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Preposition sandbags and pumps in Lakhimpur</div>
              <div className="text-xs text-slate-500 mt-1">Hydrological model indicates 68% chance of flooding in 24–36 hours. Coordinate with district administration.</div>
            </div>
            <div className="text-xs text-slate-700 font-semibold">Confidence: 68%</div>
          </div>
        </div>

        <div className="rounded p-3 border border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Prioritise sample testing in Tinsukia</div>
              <div className="text-xs text-slate-500 mt-1">Anomaly detection flags rising febrile cases; recommend rapid diagnostic testing and contact tracing.</div>
            </div>
            <div className="text-xs text-slate-700 font-semibold">Confidence: 75%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
