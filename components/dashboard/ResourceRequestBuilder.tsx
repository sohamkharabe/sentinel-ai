"use client";

import { useState } from "react";
import type { Incident } from "./IncidentFeed";
import { useOperationalStore } from "@/lib/operational-store";

type Priority = "Critical" | "High" | "Moderate";

type Resource = {
  id: string;
  name: string;
  unit: string;
};

const resources: Resource[] = [
  {
    id: "medical-units",
    name: "Mobile Medical Units",
    unit: "units",
  },
  {
    id: "medical-officers",
    name: "Medical Officers",
    unit: "persons",
  },
  {
    id: "medicine-kits",
    name: "Medicine Kits",
    unit: "kits",
  },
  {
    id: "ambulances",
    name: "Ambulances",
    unit: "vehicles",
  },
  {
    id: "rescue-teams",
    name: "Rescue Teams",
    unit: "teams",
  },
  {
    id: "water-kits",
    name: "Drinking Water Kits",
    unit: "kits",
  },
  {
    id: "food-supplies",
    name: "Emergency Food Supplies",
    unit: "kits",
  },
];

type ResourceRequestBuilderProps = {
  incident?: Incident | null;
  alertId?: string;
};

export default function ResourceRequestBuilder({
  incident,
  alertId,
}: ResourceRequestBuilderProps) {
  const { createResourceRequest } = useOperationalStore();
  // Priority state holds the user-selected priority when the user overrides
  // automatic behaviour. When no manual override is active, the effective
  // priority is derived from the `incident` prop.
  const [priority, setPriority] = useState<Priority>("Moderate");
  const [manualOverride, setManualOverride] = useState(false);

  const [authority, setAuthority] = useState(
    "District Emergency Control Room"
  );

  const [selected, setSelected] = useState<
    Record<string, number>
  >({
    "medical-units": 1,
    "medical-officers": 1,
  });

  // Derive effective priority when not manually overridden.
  const effectivePriority: Priority = manualOverride
    ? priority
    : incident
    ? incident.severity === "High"
      ? "High"
      : "Moderate"
    : priority;

  const toggleResource = (id: string) => {
    setSelected((current) => {
      const next = { ...current };

      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
      }

      return next;
    });
  };

  const updateQuantity = (
    id: string,
    value: number
  ) => {
    setSelected((current) => ({
      ...current,
      [id]: Math.max(1, value),
    }));
  };

  const handleGenerateDispatch = () => {
    const requestedResources = resources
      .filter((resource) => selected[resource.id])
      .map((resource) => `${resource.name} ×${selected[resource.id]}`)
      .join("; ");

    const { request, created } = createResourceRequest({
      alertId,
      incidentId: incident?.id,
      incident:
        incident?.title ??
        "Manual emergency request",

      district:
        incident?.district ??
        "Lakhimpur, Assam",

      priority: effectivePriority.toUpperCase() as "CRITICAL" | "HIGH" | "MODERATE",

      authority,

      requestedResources,
    });

    alert(
      `Dispatch prepared for ${
        request.district
      }\n\nAuthority: ${authority}\nPriority: ${request.priority}${created ? "" : "\n\nAn existing request is already linked to this alert."}`
    );
  };

  const priorityConfig = {
    Critical: {
      message:
        "Immediate deployment required.",
    },

    High: {
      message:
        "Rapid response recommended.",
    },

    Moderate: {
      message:
        "Response can be coordinated.",
    },
  };

  const currentPriority = priorityConfig[effectivePriority];

  return (
    <section
      id="resource-dispatch"
      className="w-full overflow-hidden rounded-lg border-2 border-slate-400 bg-white shadow-sm"
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="border-b-2 border-slate-300 bg-slate-50 px-6 py-5">

        <div className="flex items-start justify-between gap-4">

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              EMERGENCY RESOURCE DISPATCH
            </h2>

            <p className="mt-2 text-base font-medium text-slate-700">
              Immediate resources required for district
              emergency response.
            </p>
          </div>

          <span className="shrink-0 rounded-md bg-red-600 px-4 py-2 text-sm font-extrabold tracking-wide text-white">
            EMERGENCY
          </span>

        </div>
      </div>


      {/* ================================================= */}
      {/* BODY */}
      {/* ================================================= */}

      <div className="space-y-7 px-6 py-6">

        {/* ================================================= */}
        {/* INCIDENT SOURCE */}
        {/* ================================================= */}

        {incident && (
          <div className="rounded-md border-2 border-blue-300 bg-blue-50 px-5 py-4">

            <div className="text-xs font-extrabold uppercase tracking-wide text-blue-800">
              INCIDENT SOURCE
            </div>

            <div className="mt-2 text-base font-bold text-slate-950">
              {incident.title}
            </div>

            <div className="mt-1 text-sm font-medium text-slate-700">
              Request generated from the live incident feed.
            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* TARGET DISTRICT */}
        {/* ================================================= */}

        <div>

          <h3 className="text-lg font-bold tracking-wide text-slate-950">
            TARGET DISTRICT
          </h3>

          <div className="mt-3 rounded-md border-2 border-slate-400 bg-slate-50 px-5 py-4">

            <div className="text-lg font-bold text-slate-950">
              {incident?.district ??
                "Lakhimpur, Assam"}
            </div>

            <div className="mt-1 text-sm font-medium text-slate-700">
              {incident
                ? `${incident.status} emergency response`
                : "Active emergency response"}
            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* RESPONSE AUTHORITY */}
        {/* ================================================= */}

        <div>

          <h3 className="text-lg font-bold tracking-wide text-slate-950">
            RESPONSE AUTHORITY
          </h3>

          <p className="mt-1 text-sm font-normal text-slate-700">
            Select the authority responsible for receiving
            this dispatch.
          </p>

          <select
            value={authority}
            onChange={(event) =>
              setAuthority(event.target.value)
            }
            className="mt-3 w-full rounded-md border-2 border-slate-400 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-slate-700"
          >
            <option>
              District Emergency Control Room
            </option>

            <option>
              District Magistrate Emergency Cell
            </option>

            <option>
              District Health Officer
            </option>

            <option>
              State Emergency Operations Centre
            </option>
          </select>

        </div>


        {/* ================================================= */}
        {/* RESPONSE PRIORITY */}
        {/* ================================================= */}

        <div>

          <h3 className="flex items-center gap-2 text-lg font-bold tracking-wide text-slate-950">
            <span className="text-base">
              ⚠
            </span>

            RESPONSE PRIORITY
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

            {/* CRITICAL */}

            <button
              type="button"
              onClick={() => {
                setManualOverride(true);
                setPriority("Critical");
              }}
              className={`rounded-md border-2 px-4 py-3 text-sm font-bold transition ${
                effectivePriority === "Critical"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <span className="mr-2">
                ●
              </span>

              CRITICAL
            </button>


            {/* HIGH */}

            <button
              type="button"
              onClick={() => {
                setManualOverride(true);
                setPriority("High");
              }}
              className={`rounded-md border-2 px-4 py-3 text-sm font-bold transition ${
                effectivePriority === "High"
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              <span className="mr-2">
                ●
              </span>

              HIGH
            </button>


            {/* MODERATE */}

            <button
              type="button"
              onClick={() => {
                setManualOverride(true);
                setPriority("Moderate");
              }}
              className={`rounded-md border-2 px-4 py-3 text-sm font-bold transition ${
                effectivePriority === "Moderate"
                  ? "border-yellow-500 bg-yellow-500 text-slate-950"
                  : "border-yellow-400 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
              }`}
            >
              <span className="mr-2">
                ●
              </span>

              MODERATE
            </button>

          </div>


          {/* PRIORITY MESSAGE */}

          <div
            className={`mt-3 rounded-md border-2 px-4 py-3 text-sm ${
              effectivePriority === "Critical"
                ? "border-red-300 bg-red-50 text-red-800"
                : effectivePriority === "High"
                ? "border-orange-300 bg-orange-50 text-orange-800"
                : "border-yellow-300 bg-yellow-50 text-yellow-900"
            }`}
          >
            <span className="font-bold">{effectivePriority.toUpperCase()}:</span>{" "}

            <span className="font-normal">
              {currentPriority.message}
            </span>
          </div>

        </div>


        {/* ================================================= */}
        {/* REQUIRED RESOURCES */}
        {/* ================================================= */}

        <div>

          <h3 className="text-lg font-bold tracking-wide text-slate-950">
            REQUIRED RESOURCES
          </h3>

          <p className="mt-1 text-sm font-normal text-slate-700">
            Select the resources required for district
            response.
          </p>


          <div className="mt-4 space-y-2">

            {resources.map((resource) => {

              const isSelected =
                Boolean(selected[resource.id]);

              return (
                <div
                  key={resource.id}
                  className={`flex items-center justify-between gap-4 rounded-md border-2 px-4 py-3 transition ${
                    isSelected
                      ? "border-slate-500 bg-slate-50"
                      : "border-slate-300 bg-white hover:border-slate-400"
                  }`}
                >

                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        toggleResource(
                          resource.id
                        )
                      }
                      className="h-4 w-4 accent-slate-900"
                    />

                    <span className="text-sm font-semibold text-slate-900">
                      {resource.name}
                    </span>

                  </label>


                  {isSelected && (
                    <div className="flex items-center gap-2">

                      <input
                        type="number"
                        min="1"
                        value={
                          selected[
                            resource.id
                          ]
                        }
                        onChange={(event) =>
                          updateQuantity(
                            resource.id,
                            Number(
                              event.target.value
                            )
                          )
                        }
                        className="w-16 rounded border-2 border-slate-300 bg-white px-2 py-1 text-center text-sm font-semibold text-slate-900 outline-none focus:border-slate-600"
                      />

                      <span className="text-xs font-normal text-slate-600">
                        {resource.unit}
                      </span>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>


        {/* ================================================= */}
        {/* DISPATCH ACTION */}
        {/* ================================================= */}

        <div className="border-t-2 border-slate-300 pt-5">

          <button
            type="button"
            onClick={handleGenerateDispatch}
            disabled={
              Object.keys(selected).length === 0
            }
            className="w-full rounded-md bg-slate-950 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            GENERATE DISPATCH
          </button>

          <p className="mt-2 text-center text-xs font-normal text-slate-600">
            The selected resources will be used to
            prepare a dispatch draft for the selected
            authority.
          </p>

        </div>

      </div>
    </section>
  );
}
