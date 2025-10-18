"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Keywords() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);

  // Fetch projects
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.log(error);
    else setProjects(data);
  };

  // Fetch keywords for selected project
  const fetchKeywords = async (projectId) => {
    const { data, error } = await supabase
      .from("keywords")
      .select("*")
      .eq("project_id", projectId);
    if (error) console.log(error);
    else setKeywords(data);
  };

  const addKeyword = async () => {
    if (!selectedProject) return alert("Select a project first");
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase.from("keywords").insert([
      {
        project_id: selectedProject,
        keyword,
        user_id: user.data.user.id, // associate keyword with logged-in user
      },
    ]);
    if (error) alert(error.message);
    else {
      setKeyword("");
      fetchKeywords(selectedProject);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchKeywords(selectedProject);
  }, [selectedProject]);

  // ✨ Styling
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

  const selectStyle = {
    display: "block",
    width: "270px",
    padding: "8px 12px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "#111",
    backgroundColor: "#ffffff",
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
    marginTop: "5px",
  };

  const keywordListStyle = {
    listStyle: "none",
    padding: 0,
  };

  const keywordItemStyle = {
    padding: "10px",
    marginBottom: "6px",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    color: "#111",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Keywords</h1>

      <select
        value={selectedProject || ""}
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

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addKeyword} style={buttonStyle}>
          Add Keyword
        </button>
      </div>

      <h2 style={{ marginTop: 20, color: "#0070f3" }}>Keywords for Project</h2>
      <ul style={keywordListStyle}>
        {keywords.map((k) => (
          <li key={k.id} style={keywordItemStyle}>
            {k.keyword}
          </li>
        ))}
      </ul>
    </div>
  );
}
