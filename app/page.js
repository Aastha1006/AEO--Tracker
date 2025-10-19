"use client";

import Link from "next/link";

export default function Home() {
  const containerStyle = {
    padding: "25px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
  };

  const headerStyle = {
    color: "#0070f3",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
    transition: "0.2s all",
  };

  const projectButton = {
    ...buttonStyle,
    backgroundColor: "#0070f3",
    color: "white",
  };

  const keywordButton = {
    ...buttonStyle,
    backgroundColor: "#28a745",
    color: "white",
  };

  const checksButton = {
    ...buttonStyle,
    backgroundColor: "#ff9900",
    color: "white",
  };

  const buttonHover = (e) => {
    e.target.style.opacity = 0.8;
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Welcome to AEO Tracker</h1>
      <p style={{ color: "#333", marginBottom: "20px" }}>
        Manage your Projects, Keywords, and AI Visibility Checks
      </p>

      <div>
        <Link href="/projects">
          <button
            style={projectButton}
            onMouseEnter={buttonHover}
            onMouseLeave={(e) => (e.target.style.opacity = 1)}
          >
            Go to Projects
          </button>
        </Link>

        <Link href="/keywords">
          <button
            style={keywordButton}
            onMouseEnter={buttonHover}
            onMouseLeave={(e) => (e.target.style.opacity = 1)}
          >
            Go to Keywords
          </button>
        </Link>

        <Link href="/checks">
          <button
            style={checksButton}
            onMouseEnter={buttonHover}
            onMouseLeave={(e) => (e.target.style.opacity = 1)}
          >
            Go to Checks
          </button>
        </Link>
      </div>
    </div>
  );
}
