"use client";

import { useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function MapPanel() {
  const mapRef = useRef<any | null>(null);

  return (
    <div className="lg:col-span-2 lg:row-span-2 rounded border border-slate-100 p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-sm font-medium text-slate-900">Operational Risk Map</h2>
          <div className="text-xs text-slate-500 mt-1">Northeast India • District Risk Monitoring</div>
        </div>

        <div className="text-sm text-slate-600 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />
            <span className="text-xs">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-400 inline-block" />
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600 inline-block" />
            <span className="text-xs">High Risk</span>
          </div>
        </div>
      </div>

      <div className="h-64 md:h-80 rounded border border-slate-50 relative overflow-hidden">
        <MapContainer
          center={[25.5, 92.5]}
          zoom={6}
          scrollWheelZoom={false}
          className="h-full w-full rounded"
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
        </MapContainer>

        {/* Center overlay text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-500">
            <div className="text-lg font-medium">Interactive district map coming next</div>
            <div className="mt-3 text-xs">Last Updated: Just now</div>
          </div>
        </div>

        {/* Compass icon (visual) */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600">🧭</div>
        </div>

        {/* Zoom controls: use custom buttons that call map methods */}
        <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
          <button
            aria-label="Zoom in"
            className="h-9 w-9 rounded border border-slate-200 bg-white text-slate-700"
            onClick={() => mapRef.current && mapRef.current.setZoom(Math.min(mapRef.current.getZoom() + 1, 18))}
          >
            +
          </button>
          <button
            aria-label="Zoom out"
            className="h-9 w-9 rounded border border-slate-200 bg-white text-slate-700"
            onClick={() => mapRef.current && mapRef.current.setZoom(Math.max(mapRef.current.getZoom() - 1, 2))}
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
}
