import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect } from "react";

function MapEvents({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();

      onBoundsChange({
        minLng: b.getWest(),
        minLat: b.getSouth(),
        maxLng: b.getEast(),
        maxLat: b.getNorth(),
      });
    },
  });

  return null;
}

export default function TicketMap({ tickets, onBoundsChange }) {
  const defaultCenter = [43.7, -79.4]; // Toronto

  return (
    <div className="h-[250px] w-full rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* MAP EVENTS */}
        <MapEvents onBoundsChange={onBoundsChange} />

        {/* MARKERS */}
        {tickets.map((t, i) => (
          <Marker
            key={i}
            position={[t.latitude, t.longitude]}
          />
        ))}
      </MapContainer>
    </div>
  );
}