"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import type { Branch } from "@/types";

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function FlyTo({ lat, lng, zoom = 16 }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 0.8 });
  }, [lat, lng, zoom, map]);
  return null;
}

interface GeofenceMapProps {
  branch: Branch;
  radius: number;
  height?: number;
  showRadiusEditor?: boolean;
  className?: string;
  livePin?: { lat: number; lng: number; label?: string; inside?: boolean };
}

export function GeofenceMap({
  branch,
  radius,
  height = 360,
  livePin,
  className
}: GeofenceMapProps) {
  const [showMap, setShowMap] = React.useState(false);
  const [remountToken, setRemountToken] = React.useState(0);
  const liveSig = livePin ? `${livePin.lat}-${livePin.lng}-${livePin.inside ? 1 : 0}` : "none";

  React.useEffect(() => {
    setShowMap(true);
    return () => {
      setShowMap(false);
      setRemountToken((t) => t + 1);
    };
  }, [branch.id, radius, height, liveSig]);

  const mapKey = `${branch.id}-${radius}-${height}-${liveSig}-${remountToken}`;

  return (
    <div className={"relative overflow-hidden rounded-2xl border " + (className ?? "")} style={{ height }}>
      {!showMap ? (
        <div className="flex h-full w-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">
          Loading map…
        </div>
      ) : (
        <MapContainer
          key={mapKey}
          center={[branch.lat, branch.lng]}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo lat={branch.lat} lng={branch.lng} zoom={16} />
        <Circle
          center={[branch.lat, branch.lng]}
          radius={radius}
          pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.12, weight: 2 }}
        />
        <Circle
          center={[branch.lat, branch.lng]}
          radius={radius * 0.65}
          pathOptions={{ color: "#06b6d4", fillColor: "#06b6d4", fillOpacity: 0.06, weight: 1, dashArray: "4 6" }}
        />
        <Marker position={[branch.lat, branch.lng]}>
          <Popup>
            <div className="text-xs">
              <strong>{branch.name}</strong>
              <div className="text-muted-foreground">Radius: {radius}m</div>
            </div>
          </Popup>
        </Marker>
        {livePin && (
          <Marker
            position={[livePin.lat, livePin.lng]}
            icon={L.divIcon({
              className: "",
              iconSize: [28, 28],
              iconAnchor: [14, 14],
              html: `<div style="position:relative">
                <div style="position:absolute; inset:-8px; border-radius:9999px; background:${livePin.inside ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}; animation: pulse 1.5s ease-in-out infinite"></div>
                <div style="position:relative; width:18px; height:18px; border-radius:9999px; background:${livePin.inside ? "#10b981" : "#ef4444"}; border:3px solid white; box-shadow:0 0 0 1px rgba(0,0,0,0.1)"></div>
              </div>`
            })}
          >
            <Popup>
              <div className="text-xs">
                <strong>{livePin.label ?? "Live location"}</strong>
                <div className={livePin.inside ? "text-success" : "text-destructive"}>
                  {livePin.inside ? "Inside geofence ✓" : "Outside geofence"}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        </MapContainer>
      )}
    </div>
  );
}
