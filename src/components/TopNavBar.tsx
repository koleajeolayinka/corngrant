import React from "react";
import { Sprout, User } from "lucide-react";

interface TopNavBarProps {
  currentView: "donor" | "owner" | "detail";
  setView: (view: "donor" | "owner" | "detail") => void;
  selectedProjectName?: string;
}

export default function TopNavBar({ currentView, setView, selectedProjectName }: TopNavBarProps) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm transition-shadow">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        <button 
          onClick={() => setView("donor")} 
          className="flex items-center gap-2 text-emerald-750 cursor-pointer hover:opacity-90 transition-opacity"
          id="nav-logo"
        >
          <Sprout className="w-8 h-8 stroke-[2.5]" />
          <span className="font-sans text-xl md:text-2xl font-black tracking-tight">CornGrant</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView("donor")}
            className={`font-sans text-[15px] font-bold pb-1 transition-all ${
              currentView === "donor" || currentView === "detail"
                ? "text-emerald-700 border-b-2 border-emerald-750"
                : "text-gray-500 hover:text-emerald-700"
            }`}
            id="nav-discover"
          >
            Discover
          </button>
          <button 
            onClick={() => {
              setView("donor");
              setTimeout(() => {
                const el = document.getElementById("how-it-works-section");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="font-sans text-[15px] font-bold text-gray-500 hover:text-emerald-750 transition-all"
            id="nav-how-it-works"
          >
            How it Works
          </button>
          <button 
            onClick={() => {
              setView("donor");
              setTimeout(() => {
                const el = document.getElementById("impact-section");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="font-sans text-[15px] font-bold text-gray-500 hover:text-emerald-750 transition-all"
            id="nav-impact"
          >
            Our Impact
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-full text-xs">
            <button
              onClick={() => setView("donor")}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                currentView === "donor" || currentView === "detail"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-gray-500 hover:text-emerald-700"
              }`}
            >
              Donor Feed
            </button>
            <button
              onClick={() => setView("owner")}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                currentView === "owner"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-gray-500 hover:text-emerald-700"
              }`}
            >
              Owner Portal
            </button>
          </div>

          <button 
            onClick={() => setView("owner")}
            className="hidden md:flex items-center gap-2 text-[14px] bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold hover:bg-emerald-800 transition-colors shadow-xs hover:shadow-md cursor-pointer"
            id="nav-signin"
          >
            <User className="w-4 h-4" />
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
