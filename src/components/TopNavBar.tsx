import React from "react";
import { Sprout, Search, User, Sliders } from "lucide-react";

interface TopNavBarProps {
  currentView: "donor" | "owner" | "detail";
  setView: (view: "donor" | "owner" | "detail") => void;
  selectedProjectName?: string;
}

export default function TopNavBar({ currentView, setView, selectedProjectName }: TopNavBarProps) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-[#F2EEE6] shadow-sm transition-shadow">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        {/* Brand Logo */}
        <button 
          onClick={() => setView("donor")} 
          className="flex items-center gap-2 text-[#15803d] cursor-pointer hover:opacity-90 transition-opacity"
          id="nav-logo"
        >
          <Sprout className="w-8 h-8 stroke-[2.5]" />
          <span className="font-sans text-xl md:text-2xl font-bold tracking-tight">CornGrant</span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView("donor")}
            className={`font-sans text-[15px] font-medium pb-1 transition-all ${
              currentView === "donor" || currentView === "detail"
                ? "text-[#15803d] border-b-2 border-[#15803d]"
                : "text-gray-500 hover:text-[#15803d]"
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
            className="font-sans text-[15px] font-medium text-gray-500 hover:text-[#15803d] transition-all"
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
            className="font-sans text-[15px] font-medium text-gray-500 hover:text-[#15803d] transition-all"
            id="nav-impact"
          >
            Our Impact
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Quick toggle for presenting both sides of the app */}
          <div className="flex items-center bg-[#FDFBF7] border border-[#F2EEE6] p-1 rounded-full text-xs">
            <button
              onClick={() => setView("donor")}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                currentView === "donor" || currentView === "detail"
                  ? "bg-[#15803d] text-white shadow-sm"
                  : "text-gray-600 hover:text-[#15803d]"
              }`}
            >
              Donor Feed
            </button>
            <button
              onClick={() => setView("owner")}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                currentView === "owner"
                  ? "bg-[#15803d] text-white shadow-sm"
                  : "text-gray-600 hover:text-[#15803d]"
              }`}
            >
              Owner Portal
            </button>
          </div>

          <button 
            onClick={() => setView("owner")}
            className="hidden md:flex items-center gap-2 text-[14px] bg-[#15803d] text-white px-5 py-2 rounded-full font-semibold hover:shadow-md transition-all active:scale-95"
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
