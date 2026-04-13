import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// 🛰️ ícone ISS
const icon = new L.DivIcon({
  html: `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:40px;
      height:40px;
      filter: drop-shadow(0 0 8px #32184e);
      animation: pulse 2s infinite;
    ">
      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg" 
           style="width:32px; height:32px;" />
    </div>
  `,
  className: "",
});
// 🚀 mapa seguir ISS
function FlyToISS({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom(), { duration: 2 });
  }, [position]);

  return null;
}

// 📏 cálculo realista de distância (Haversine)
function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapISS() {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [speed, setSpeed] = useState(0);

  const lastPosition = useRef<[number, number] | null>(null);

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch("https://api.open-notify.org/iss-now.json");

        if (!res.ok) throw new Error("API ISS falhou");

        const data = await res.json();

        const lat = parseFloat(data.iss_position.latitude);
        const lon = parseFloat(data.iss_position.longitude);

        // 🚀 velocidade REAL
        if (lastPosition.current) {
          const dist = getDistance(
            lastPosition.current[0],
            lastPosition.current[1],
            lat,
            lon
          );

          const speedKmH = (dist / 5) * 3600; // intervalo = 5s
          setSpeed(Math.round(speedKmH));
        }

        setPosition([lat, lon]);
        lastPosition.current = [lat, lon];

        // limitar trilha
        setPath((prev) => {
          const newPath: [number, number][] = [...prev, [lat, lon]];
          return newPath.slice(-100);
        });
      } catch (err) {
        console.error("Erro ISS:", err);
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <MapContainer
        center={position}
        zoom={2}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />

        <FlyToISS position={position} />

        <Polyline positions={path} color="#00ffcc" weight={2} />

        <Marker position={position} icon={icon}>
          <Popup>🛰️ ISS em tempo real</Popup>
        </Marker>
      </MapContainer>

      {/* 📊 INFO */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "15px",
        }}
      >
        <div style={card}>
          🚀 {speed} km/h
        </div>
        <div style={card}>
          📍 {position[0].toFixed(2)}
        </div>
        <div style={card}>
          📍 {position[1].toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// 💎 estilo dos cards
const card: React.CSSProperties = {
  padding: "10px 15px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "10px",
  color: "#2c1942",
  border: "1px solid rgba(0,255,204,0.2)",
};