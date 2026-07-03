import React, { useState, useEffect } from "react";
import TopNavBar from "./components/TopNavBar";
import DiscoveryFeed from "./components/DiscoveryFeed";
import ProjectDetail from "./components/ProjectDetail";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import { Project } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Sliders } from "lucide-react";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setView] = useState<"donor" | "owner" | "detail">("donor");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch verified projects from our Express in-memory database on mount
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  // Handler to post a new Daily Proof of Work log via Gemini
  const handleAddLog = async (projectId: string, rawText: string, images: string[]) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, images }),
      });
      const data = await res.json();
      if (data.project) {
        // Update local projects array with updated project returned from backend
        setProjects(prev => prev.map(p => p.id === projectId ? data.project : p));
      }
    } catch (err) {
      console.error("Failed to post proof of work", err);
      throw err;
    }
  };

  // Handler to contribute a seed micro-grant via simulated Nomba API
  const handleDonate = async (amount: number) => {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`/api/projects/${selectedProjectId}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.project) {
        setProjects(prev => prev.map(p => p.id === selectedProjectId ? data.project : p));
      }
    } catch (err) {
      console.error("Failed to process seed donation", err);
      throw err;
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setView("detail");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] text-gray-900 selection:bg-[#94f990] selection:text-[#002204]">
      {/* Top persistent Navigation Bar */}
      <TopNavBar 
        currentView={currentView} 
        setView={(view) => {
          setView(view);
          if (view !== "detail") {
            setSelectedProjectId(null);
          }
        }} 
        selectedProjectName={selectedProject?.name}
      />

      {/* Main app space with viewport constraint */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Leaf className="w-12 h-12 text-[#15803d] animate-bounce" />
            <p className="text-sm font-semibold text-gray-500 font-sans">Watering the seeds of CornGrant...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (selectedProjectId || "")}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === "donor" && (
                <DiscoveryFeed 
                  projects={projects} 
                  onSelectProject={handleSelectProject} 
                />
              )}

              {currentView === "detail" && selectedProject && (
                <ProjectDetail 
                  project={selectedProject} 
                  onBack={() => {
                    setView("donor");
                    setSelectedProjectId(null);
                  }}
                  onDonate={handleDonate}
                />
              )}

              {currentView === "owner" && (
                <Dashboard 
                  projects={projects} 
                  onAddLog={handleAddLog} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Persistent global footer */}
      <Footer />
    </div>
  );
}
