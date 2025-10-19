"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Checks() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [checks, setChecks] = useState([]);
  const [engines, setEngines] = useState([]);

  // Fetch projects
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.log(error);
    else setProjects(data);
  };

  // Fetch keywords
  const fetchKeywords = async (projectId) => {
    const { data, error } = await supabase
      .from("keywords")
      .select("*")
      .eq("project_id", projectId);
    if (error) console.log(error);
    else setKeywords(data);
  };

  // Fetch engines
  const fetchEngines = async () => {
    const { data, error } = await supabase.from("engines").select("*");
    if (error) console.log(error);
    else setEngines(data);
  };

  // Fetch checks
  const fetchChecks = async () => {
    if (!selectedKeyword) return;
    const { data, error } = await supabase
      .from("checks")
      .select("*")
      .eq("keyword_id", selectedKeyword)
      .order("created_at", { ascending: false });
    if (error) console.log(error);
    else setChecks(data);
  };

  // Run check
  const runCheck = async () => {
    if (!selectedKeyword) return alert("Select a keyword first");

    const user = supabase.auth.getUser ? await supabase.auth.getUser() : null;
    const userId = user?.data?.user?.id;

    if (!userId) return alert("User not logged in");

    const results = engines.map((engine) => ({
      user_uuid: userId,
      project_id: selectedProject,
      keyword_id: selectedKeyword,
      engine_id: engine.id,
      position: Math.floor(Math.random() * 10) + 1,
      presence: Math.random() > 0.3,
      observed_urls: ["https://example.com"],
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("checks").insert(results);
    if (error) alert(error.message);
    else fetchChecks();
  };

  useEffect(() => {
    fetchProjects();
    fetchEngines();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchKeywords(selectedProject);
  }, [selectedProject]);

  // ===== STYLES =====
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

  const selectStyle = {
    padding: "8px 12px",
    marginRight: "12px",
    minWidth: "180px",
    borderRadius: "6px",
    border: "1px solid #0070f3",
    backgroundColor: "#e6f0ff",
    color: "#003366",
    fontWeight: "500",
  };

  const buttonStyle = {
    padding: "8px 16px",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    transition: "0.2s all",
  };

  const buttonHover = (e) => {
    e.target.style.backgroundColor = "#005bb5";
  };

  const tableContainer = {
    overflowX: "auto",
    marginTop: "25px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  };

  const thStyle = {
    borderBottom: "2px solid #d0d0d0",
    padding: "12px",
    backgroundColor: "#0070f3",
    color: "#ffffff",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #e0e0e0",
    color: "#1a1a1a",
    fontWeight: "500",
  };

  const trStyle = {
    transition: "background-color 0.3s",
    cursor: "default",
  };

  const trHover = (e) => {
    e.currentTarget.style.backgroundColor = "#f1f5fb";
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>AI Visibility Checks</h1>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.domain} — {p.brand}
            </option>
          ))}
        </select>

        <select
          value={selectedKeyword}
          onChange={(e) => setSelectedKeyword(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select Keyword</option>
          {keywords.map((k) => (
            <option key={k.id} value={k.id}>
              {k.keyword}
            </option>
          ))}
        </select>

        <button
          onClick={runCheck}
          onMouseEnter={buttonHover}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0070f3")}
          style={buttonStyle}
        >
          Run&nbsp;Check
        </button>
      </div>

      <h2 style={{ marginBottom: "15px", color: "#333333" }}>Check Results</h2>

      {checks.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#666666" }}>
          No results yet. Click &quot;Run Check&quot; to generate results.
        </p>
      ) : (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Project</th>
                <th style={thStyle}>Keyword</th>
                <th style={thStyle}>Engine</th>
                <th style={thStyle}>Position</th>
                <th style={thStyle}>Present</th>
                <th style={thStyle}>URLs</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => {
                const project = projects.find((p) => p.id === c.project_id);
                const keyword = keywords.find((k) => k.id === c.keyword_id);
                const engine = engines.find((e) => e.id === c.engine_id);

                return (
                  <tr
                    key={c.id}
                    style={trStyle}
                    onMouseEnter={trHover}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffffff")
                    }
                  >
                    <td style={tdStyle}>
                      {project
                        ? `${project.domain} — ${project.brand}`
                        : "Unknown"}
                    </td>
                    <td style={tdStyle}>
                      {keyword ? keyword.keyword : "Unknown"}
                    </td>
                    <td style={tdStyle}>{engine ? engine.name : "Unknown"}</td>
                    <td style={tdStyle}>{c.position}</td>
                    <td style={tdStyle}>{c.presence ? "Yes" : "No"}</td>
                    <td style={tdStyle}>{c.observed_urls.join(", ")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
