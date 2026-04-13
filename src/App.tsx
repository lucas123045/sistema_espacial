import React, { useEffect, useState } from "react";
import MapISS from "./MapISS";
import StarsBackground from "./StarsBackground";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 🎯 PARALLAX
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setOffset({
        x: (e.clientX - window.innerWidth / 2) * 0.01,
        y: (e.clientY - window.innerHeight / 2) * 0.01,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🌌 API NASA
  useEffect(() => {
    fetch(
      "https://api.nasa.gov/planetary/apod?api_key=3BpUJHRQmRfikbe7dvjMKofFf8wW0EPzZQEB0kWn"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro na API");
        return res.json();
      })
      .then((data) => setData(data))
      .catch(() => {
        setData({
          title: "Erro ao carregar 😢",
          explanation: "A API falhou. Tente novamente.",
          url: "",
        });
      });
  }, []);

  // 🚀 LOADING
  if (!data) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#4d82a0",
          fontSize: "24px",
        }}
      >
         Carregando universo...
      </div>
    );
  }

  return (
    <>
      {/* 🌌 FUNDO 3D */}
      <StarsBackground />

      {/* CONTEÚDO */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          color: "black",
          padding: "30px",
          fontFamily: "Arial",
          animation: "fadeIn 1.2s ease",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {/* HEADER */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #401949, #1e4253)",
WebkitBackgroundClip: "text",
color: "transparent",
            animation: "glowText 3s ease-in-out infinite alternate",
          }}
        >
          🚀 Space Dashboard
        </h1>

        <h2 style={{ opacity: 0.9 }}>{data.title}</h2>

        {/* CARD */}
        <div
          style={{
            backdropFilter: "blur(15px)",
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "0 0 60px rgba(0,255,204,0.2)",
            maxWidth: "700px",
            marginTop: "20px",
            transition: "0.4s",
            border: "1px solid rgba(0,255,204,0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {data.media_type === "image" ? (
            <img
              src={data.url}
              alt="space"
              style={{
                width: "100%",
                borderRadius: "15px",
              }}
            />
          ) : (
            <iframe
              src={data.url}
              title="space video"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "15px",
              }}
            />
          )}
        </div>

        {/* TEXTO */}
        <p
          style={{
            marginTop: "20px",
            lineHeight: "1.7",
            maxWidth: "800px",
            opacity: 0.9,
          }}
        >
          {data.explanation}
        </p>

        {/* MAPA */}
        <MapISS />
      </div>
    </>
  );
}