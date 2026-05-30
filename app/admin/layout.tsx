"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(localStorage.getItem("adminTheme") === "light");
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    localStorage.setItem("adminTheme", next ? "light" : "dark");
  }

  return (
    <div
      style={{
        fontFamily: "var(--font-inter)",
        minHeight: "100vh",
        background: "#0d1117",
        filter: light ? "invert(1) hue-rotate(180deg)" : "none",
        transition: "filter 0.3s ease",
      }}
    >
      {/* Bouton toggle flottant */}
      <button
        onClick={toggle}
        title={light ? "Passer en mode sombre" : "Passer en mode clair"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(13,17,23,0.9)",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          transition: "transform 0.15s",
          // Re-inverser le bouton lui-même pour qu'il soit toujours lisible
          filter: light ? "invert(1) hue-rotate(180deg)" : "none",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {light ? "🌙" : "☀️"}
      </button>

      {/* Re-inverser les images pour qu'elles gardent leurs vraies couleurs */}
      <style>{`
        ${light ? `
          .admin-layout img,
          .admin-layout video,
          .admin-layout [style*="background-image"] {
            filter: invert(1) hue-rotate(180deg);
          }
        ` : ""}
      `}</style>

      <div className="admin-layout">
        {children}
      </div>
    </div>
  );
}
