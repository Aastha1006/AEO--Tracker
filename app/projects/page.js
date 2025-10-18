"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [domain, setDomain] = useState("");
  const [brand, setBrand] = useState("");

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.log(error);
    else setProjects(data);
  };

  const addProject = async () => {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase.from("projects").insert([
      {
        domain,
        brand,
        owner: user.data.user.id,
      },
    ]);
    if (error) alert(error.message);
    else {
      setDomain("");
      setBrand("");
      fetchProjects();
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Styles
  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  };

  const headerStyle = {
    color: "#0070f3",
    marginBottom: "20px",
  };

  const inputStyle = {
    display: "block",
    width: "250px",
    padding: "8px 12px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "#111",
    backgroundColor: "white",
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const projectListStyle = {
    listStyle: "none",
    padding: 0,
  };

  const projectItemStyle = {
    padding: "10px",
    marginBottom: "6px",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    color: "#111",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Projects</h1>
      <input
        type="text"
        placeholder="Domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        style={inputStyle}
      />
      <button onClick={addProject} style={buttonStyle}>
        Add Project
      </button>

      <h2 style={{ marginBottom: "10px", color: "#0070f3" }}>Your Projects</h2>
      <ul style={projectListStyle}>
        {projects.map((p) => (
          <li key={p.id} style={projectItemStyle}>
            {p.domain} — {p.brand}
          </li>
        ))}
      </ul>
    </div>
  );
}
