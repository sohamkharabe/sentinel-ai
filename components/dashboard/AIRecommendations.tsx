"use client";

import { Sparkles } from "lucide-react";

const recommendations = [
  {
    title: "Deploy 2 mobile medical units to Dibrugarh",
    description:
      "Predicted 72% probability of febrile outbreak in next 48 hours. Priority: High.",
    confidence: "72%",
  },
  {
    title: "Preposition sandbags and pumps in Lakhimpur",
    description:
      "Hydrological model indicates 68% chance of flooding in 24–36 hours. Coordinate with district administration.",
    confidence: "68%",
  },
  {
    title: "Prioritise sample testing in Tinsukia",
    description:
      "Anomaly detection flags rising febrile cases; recommend rapid diagnostic testing and contact tracing.",
    confidence: "75%",
  },
];

export default function AIRecommendations() {
  return (
    <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(30,55,45,0.05)]">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-950">
          AI Recommendations
        </h2>

        <p className="mt-1 text-sm font-normal text-slate-600">
          AI-assisted operational recommendations
        </p>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="space-y-1 pt-3">
        {recommendations.map((recommendation, index) => (
          <article
            key={index}
            className="border-b border-slate-100 py-4 last:border-0"
          >
            <div className="flex items-start justify-between gap-5">
              {/* RECOMMENDATION CONTENT */}
              <div className="flex min-w-0 gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Sparkles className="h-4 w-4" /></div><div className="min-w-0">
                {/* LOW BOLD */}
                <h3 className="text-base font-semibold leading-snug text-slate-950">
                  {recommendation.title}
                </h3>

                {/* NORMAL */}
                <p className="mt-2 text-sm font-normal leading-relaxed text-slate-700">
                  {recommendation.description}
                </p>
              </div></div>

              {/* CONFIDENCE */}
              <div className="shrink-0 text-right">
                <div className="text-xs font-semibold text-slate-700">
                  Confidence:
                </div>

                <div className="mt-1 text-base font-bold text-slate-950">
                  {recommendation.confidence}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}