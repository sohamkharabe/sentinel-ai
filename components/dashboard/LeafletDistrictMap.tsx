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

/* -------------------------------------------------
   Map controller
------------------------------------------------- */

function MapController() {
  const map = useMap();

  useEffect(() => {
    map.setView([25.5, 92.5], 6);
  }, [map]);

  return null;
}

/* -------------------------------------------------
   Risk styling
------------------------------------------------- */

function getRiskStyle(feature?: DistrictFeature) {
  const district =
    feature?.properties?.district?.toLowerCase() ?? "";

  // Temporary demo risk data.
  // Later this will come from our backend / AI engine.

  const highRisk = [
    "lakhimpur",
    "tinsukia",
    "dibrugarh",
  ];

  const moderateRisk = [
    "jorhat",
    "sivasagar",
    "sonitpur",
  ];

  if (
    highRisk.some((name) =>
      district.includes(name)
    )
  ) {
    return {
      fillColor: "#dc2626",
      fillOpacity: 0.55,
      color: "#991b1b",
      weight: 1,
    };
  }

  if (
    moderateRisk.some((name) =>
      district.includes(name)
    )
  ) {
    return {
      fillColor: "#facc15",
      fillOpacity: 0.55,
      color: "#ca8a04",
      weight: 1,
    };
  }

  return {
    fillColor: "#22c55e",
    fillOpacity: 0.35,
    color: "#15803d",
    weight: 1,
  };
}

/* -------------------------------------------------
   District map
------------------------------------------------- */

export default function LeafletDistrictMap() {
  const [data, setData] =
    useState<DistrictCollection | null>(null);

  /* Load district GeoJSON */

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
      .then((geojson: DistrictCollection) => {
        setData(geojson);
      })
      .catch((error: unknown) => {
        console.error(
          "District GeoJSON error:",
          error
        );
      });
  }, []);

  /* District interaction */

  const onEachDistrict = (
    feature: DistrictFeature,
    layer: Layer
  ) => {
    const district =
      feature.properties?.district ??
      "Unknown District";

    const state =
      feature.properties?.st_nm ??
      "Unknown State";

    /* Popup */

    layer.bindPopup(`
      <div style="min-width:180px">
        <strong>${district}</strong>
        <br />
        <span>${state}</span>
      </div>
    `);

    /* Hover interaction */

    layer.on({
      mouseover: () => {
        const path = layer as Path;

        path.setStyle({
          weight: 3,
          fillOpacity: 0.75,
        });

        path.bringToFront();
      },

      mouseout: () => {
        const path = layer as Path;

        path.setStyle(
          getRiskStyle(feature)
        );
      },
    });
  };

  return (
    <MapContainer
      center={[25.5, 92.5]}
      zoom={6}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapController />

      {data && (
        <GeoJSON
          data={data}
          style={(feature) =>
            getRiskStyle(
              feature as DistrictFeature
            )
          }
          onEachFeature={(feature, layer) =>
            onEachDistrict(
              feature as DistrictFeature,
              layer
            )
          }
        />
      )}
    </MapContainer>
  );
}