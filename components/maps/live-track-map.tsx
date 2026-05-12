"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useMounted } from "@/hooks/use-mounted";

// fix marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const employeeIcon = (color: string) =>
  L.divIcon({
    className: "live-track-marker",
    html: `<div style="background:${color};border:3px solid white;border-radius:50%;width:18px;height:18px;box-shadow:0 0 0 4px ${color}33,0 4px 8px rgba(0,0,0,.3)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

const visitIcon = L.divIcon({
  className: "visit-marker",
  html: `<div style="background:hsl(var(--primary));border:2px solid white;border-radius:50%;width:14px;height:14px;box-shadow:0 0 0 3px hsl(var(--primary)/0.2)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

interface Employee {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  status: string;
}

interface Visit {
  id: string;
  name: string;
  lat: number;
  lng: number;
  time: string;
}

interface Props {
  employees?: Employee[];
  visits?: Visit[];
  route?: [number, number][];
  center?: [number, number];
  height?: number;
}

export default function LiveTrackMap({
  employees = [],
  visits = [],
  route = [],
  center = [19.076, 72.8777],
  height = 500
}: Props) {
  const mounted = useMounted();
  if (!mounted) return <div className="h-full w-full bg-muted/30" />;

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height, width: "100%", borderRadius: 16 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {employees.map((e) => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={employeeIcon(e.color)}>
          <Popup>
            <div className="text-sm font-semibold">{e.name}</div>
            <div className="text-xs text-gray-500">{e.status}</div>
          </Popup>
        </Marker>
      ))}
      {visits.map((v) => (
        <Marker key={v.id} position={[v.lat, v.lng]} icon={visitIcon}>
          <Popup>
            <div className="text-xs font-semibold">{v.name}</div>
            <div className="text-[10px] text-gray-500">{v.time}</div>
          </Popup>
        </Marker>
      ))}
      {route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{ color: "#2563EB", weight: 4, opacity: 0.7, dashArray: "8 4" }}
        />
      )}
    </MapContainer>
  );
}
