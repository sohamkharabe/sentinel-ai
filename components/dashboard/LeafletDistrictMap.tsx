"use client";

import { useEffect, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import type {
  Feature,
  FeatureCollection,
  Geometry,
} from "geojson";

import type {
  Layer,
  Path,
} from "leaflet";

type DistrictProperties = {
  district?: string;
  dt_code?: string;
  st_nm?: string;
  st_code?: string;
  year?: string;
};

type DistrictFeature = Feature<
  Geometry,
  DistrictProperties
>;

type DistrictCollection = FeatureCollection<
  Geometry,
  DistrictProperties
>;

/* =========================================================
   DISTRICT RISK DATA
   Temporary frontend data.
   Later this can come from backend / AI risk engine.
========================================================= */

type RiskLevel = "HIGH" | "MODERATE" | "SAFE";

type DistrictRisk = {
  level: RiskLevel;
  score: number;
  cases: number;
  flood: string;
  disease: string;
};

const districtRiskData: Record<string, DistrictRisk> = {
  lakhimpur: {
    level: "HIGH",
    score: 82,
    cases: 124,
    flood: "ACTIVE",
    disease: "ELEVATED",
  },

  tinsukia: {
    level: "HIGH",
    score: 78,
    cases: 96,
    flood: "WATCH",
    disease: "HIGH",
  },

  dibrugarh: {
    level: "HIGH",
    score: 75,
    cases: 88,
    flood: "WATCH",
    disease: "ELEVATED",
  },

  jorhat: {
    level: "MODERATE",
    score: 54,
    cases: 61,
    flood: "NORMAL",
    disease: "MODERATE",
  },

  sivasagar: {
    level: "MODERATE",
    score: 49,
    cases: 48,
    flood: "NORMAL",
    disease: "MODERATE",
  },

  sonitpur: {
    level: "MODERATE",
    score: 46,
    cases: 42,
    flood: "WATCH",
    disease: "MODERATE",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function getDistrictKey(district?: string) {
  return (
    district
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, " ") ?? ""
  );
}

function getDistrictRisk(
  district?: string
): DistrictRisk {
  const key = getDistrictKey(district);

  return (
    districtRiskData[key] ?? {
      level: "SAFE",
      score: 18,
      cases: 12,
      flood: "NORMAL",
      disease: "LOW",
    }
  );
}

/* =========================================================
   RISK COLORS
========================================================= */

function getRiskColors(level: RiskLevel) {
  if (level === "HIGH") {
    return {
      fill: "#dc2626",
      border: "#991b1b",
      text: "#b91c1c",
      background: "#fef2f2",
    };
  }

  if (level === "MODERATE") {
    return {
      fill: "#facc15",
      border: "#a16207",
      text: "#a16207",
      background: "#fffbeb",
    };
  }

  return {
    fill: "#22c55e",
    border: "#15803d",
    text: "#15803d",
    background: "#f0fdf4",
  };
}

/* =========================================================
   RISK MAP STYLING
========================================================= */

function getRiskStyle(
  feature?: DistrictFeature
) {
  const district =
    feature?.properties?.district ?? "";

  const risk = getDistrictRisk(district);
  const colors = getRiskColors(risk.level);

  return {
    fillColor: colors.fill,
    fillOpacity:
      risk.level === "SAFE" ? 0.35 : 0.65,
    color: colors.border,
    weight: 1.5,
  };
}

/* =========================================================
   ZOOM CONTROLS
========================================================= */

function ZoomControls() {
  const map = useMap();

  return (
    <div
      className="
        absolute
        right-3
        top-3
        z-1000
        flex
        flex-col
        overflow-hidden
        rounded-md
        border-2
        border-slate-400
        bg-white
        shadow-lg
      "
    >
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => {
          map.setZoom(
            Math.min(map.getZoom() + 1, 18)
          );
        }}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          border-b-2
          border-slate-300
          bg-white
          text-2xl
          font-extrabold
          text-slate-950
          hover:bg-slate-100
        "
      >
        +
      </button>

      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => {
          map.setZoom(
            Math.max(map.getZoom() - 1, 2)
          );
        }}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          bg-white
          text-2xl
          font-extrabold
          text-slate-950
          hover:bg-slate-100
        "
      >
        −
      </button>
    </div>
  );
}

/* =========================================================
   DISTRICT POPUP
========================================================= */

function createDistrictPopup(
  district: string,
  state: string
) {
  const risk = getDistrictRisk(district);
  const colors = getRiskColors(risk.level);

  return `
    <div
      style="
        min-width: 270px;
        max-width: 310px;
        font-family: Arial, sans-serif;
        color: #0f172a;
      "
    >

      <!-- HEADER -->

      <div
        style="
          border-bottom: 2px solid #cbd5e1;
          padding-bottom: 10px;
          margin-bottom: 12px;
        "
      >
        <div
          style="
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 3px;
          "
        >
          ${district}
        </div>

        <div
          style="
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          "
        >
          ${state}
        </div>
      </div>


      <!-- RISK STATUS -->

      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 2px solid ${colors.border};
          background: ${colors.background};
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 12px;
        "
      >

        <div>
          <div
            style="
              font-size: 11px;
              font-weight: 700;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            "
          >
            Operational Risk
          </div>

          <div
            style="
              margin-top: 3px;
              font-size: 16px;
              font-weight: 800;
              color: ${colors.text};
            "
          >
            ${risk.level}
          </div>
        </div>

        <div
          style="
            text-align: right;
          "
        >
          <div
            style="
              font-size: 11px;
              font-weight: 700;
              color: #475569;
            "
          >
            Risk Score
          </div>

          <div
            style="
              margin-top: 3px;
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
            "
          >
            ${risk.score}/100
          </div>
        </div>

      </div>


      <!-- OPERATIONAL DATA -->

      <div
        style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        "
      >

        <div
          style="
            border: 1.5px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 5px;
            padding: 9px;
          "
        >
          <div
            style="
              font-size: 10px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
            "
          >
            Active Cases
          </div>

          <div
            style="
              margin-top: 3px;
              font-size: 17px;
              font-weight: 800;
              color: #0f172a;
            "
          >
            ${risk.cases}
          </div>
        </div>


        <div
          style="
            border: 1.5px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 5px;
            padding: 9px;
          "
        >
          <div
            style="
              font-size: 10px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
            "
          >
            Flood Status
          </div>

          <div
            style="
              margin-top: 3px;
              font-size: 14px;
              font-weight: 800;
              color: #0f172a;
            "
          >
            ${risk.flood}
          </div>
        </div>


        <div
          style="
            grid-column: span 2;
            border: 1.5px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 5px;
            padding: 9px;
          "
        >
          <div
            style="
              font-size: 10px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
            "
          >
            Disease Risk
          </div>

          <div
            style="
              margin-top: 3px;
              font-size: 14px;
              font-weight: 800;
              color: #0f172a;
            "
          >
            ${risk.disease}
          </div>
        </div>

      </div>


      <!-- FOOTER -->

      <div
        style="
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        "
      >
        District intelligence • Updated just now
      </div>

    </div>
  `;
}

/* =========================================================
   DISTRICT INTERACTION
========================================================= */

const onEachDistrict = (
  feature: Feature<Geometry, unknown>,
  layer: Layer
) => {
  const districtFeature =
    feature as DistrictFeature;

  const district =
    districtFeature.properties?.district ??
    "Unknown District";

  const state =
    districtFeature.properties?.st_nm ??
    "Unknown State";

  /* -------------------------
     Popup
  ------------------------- */

  layer.bindPopup(
    createDistrictPopup(
      district,
      state
    ),
    {
      maxWidth: 340,
      closeButton: true,
      autoPan: true,
    }
  );

  /* -------------------------
     Hover
  ------------------------- */

  layer.on({
    mouseover: () => {
      const path = layer as Path;

      path.setStyle({
        weight: 3,
        fillOpacity: 0.8,
      });

      path.bringToFront();
    },

    mouseout: () => {
      const path = layer as Path;

      path.setStyle(
        getRiskStyle(districtFeature)
      );
    },
  });
};

/* =========================================================
   DISTRICT MAP
========================================================= */

export default function LeafletDistrictMap() {
  const [data, setData] =
    useState<DistrictCollection | null>(
      null
    );

  /* -------------------------
     Load GeoJSON
  ------------------------- */

  useEffect(() => {
    fetch("/geo/districts-ne.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to load district GeoJSON"
          );
        }

        return response.json();
      })
      .then(
        (geojson: DistrictCollection) => {
          setData(geojson);
        }
      )
      .catch((error) => {
        console.error(
          "District GeoJSON error:",
          error
        );
      });
  }, []);

  return (
    <MapContainer
      center={[25.5, 92.5]}
      zoom={6}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
    >
      {/* Base map */}

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Custom zoom controls */}

      <ZoomControls />

      {/* District layers */}

      {data && (
        <GeoJSON
          data={data}
          style={(feature) =>
            getRiskStyle(
              feature as DistrictFeature
            )
          }
          onEachFeature={onEachDistrict}
        />
      )}
    </MapContainer>
  );
}