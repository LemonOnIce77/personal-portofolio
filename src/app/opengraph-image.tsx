import { ImageResponse } from "next/og";

export const alt = "Aditya Warman - Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow Background Effect */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(10, 10, 10, 0) 70%)",
          }}
        />

        {/* Top Header: Badge & Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(38, 38, 38, 0.8)",
              border: "1px solid rgba(82, 82, 82, 0.6)",
              fontSize: "20px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#38bdf8",
              }}
            />
            <span style={{ color: "#e0f2fe", fontWeight: 500 }}>
              Software Development & Tech
            </span>
          </div>
        </div>

        {/* Main Content: Title & Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#ffffff",
            }}
          >
            Muhammad Yaumil Aditya Warman
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              lineHeight: 1.4,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            Personal Developer Portfolio — Building scalable web applications, 
            interactive user interfaces, and modular backend architectures.
          </p>
        </div>

        {/* Footer: Tech Stack Indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(64, 64, 64, 0.5)",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "14px" }}>
            {["Next.js", "TypeScript", "Tailwind CSS", "Supabase"].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(38, 38, 38, 0.6)",
                  border: "1px solid rgba(64, 64, 64, 0.8)",
                  fontSize: "18px",
                  color: "#d4d4d4",
                  fontFamily: "monospace",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <span
            style={{
              fontSize: "22px",
              color: "#c084fc",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Live Portfolio
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}