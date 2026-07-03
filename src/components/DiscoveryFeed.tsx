import React, { useState } from "react";
import { Project } from "../types";
import { Search, Filter, Mail, Star, Quote, Leaf, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface DiscoveryFeedProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function DiscoveryFeed({ projects, onSelectProject }: DiscoveryFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Agriculture", "Craftsmanship", "Food & Drink"];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#FFFDF9] to-[#F5EFE6] border border-[#F2EEE6] p-8 md:p-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#fdc0031a,_transparent_50%),_radial-gradient(circle_at_bottom_left,_#4caf5010,_transparent_40%)]"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffdf9e] text-[#5b4300] font-sans text-xs font-semibold uppercase tracking-wider shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Join 2,400 active donors
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight"
          >
            Support Local Growth. <br className="hidden md:block"/>
            <span className="text-[#15803d]">One Day at a Time.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Discover and fund local businesses planting seeds for a better community. Transparency through real-time, AI-summarized proof of daily work.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => {
                const el = document.getElementById("projects-feed");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Start Exploring
            </button>
            <button 
              onClick={() => alert("Statistics feature coming soon! 2,400 active donors have planted $42,500 in seeds so far.")}
              className="bg-white border border-[#becab9] text-gray-700 hover:bg-[#fcf9f8] px-8 py-4 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer"
            >
              View Statistics
            </button>
          </motion.div>
        </div>
      </section>

      {/* Discovery Feed Section */}
      <section id="projects-feed" className="space-y-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#F2EEE6]">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Active Growth Projects</h3>
            <p className="text-sm text-gray-500 font-sans">Vetted small businesses looking for their next seed grant.</p>
          </div>
          
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category selection pill */}
            <div className="flex items-center bg-[#FDFBF7] border border-[#F2EEE6] p-1 rounded-lg">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? "bg-[#15803d] text-white shadow-xs" 
                      : "text-gray-600 hover:text-[#15803d]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick search input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 pr-4 py-2 border border-[#becab9] rounded-lg text-xs bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#15803d] focus:border-[#15803d] w-48 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Bento Grid Feed */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#FDFBF7] border border-dashed border-[#becab9] rounded-2xl">
            <Leaf className="w-12 h-12 text-[#15803d] opacity-40 mx-auto mb-4" />
            <h4 className="font-bold text-gray-700 text-lg">No matching projects found</h4>
            <p className="text-sm text-gray-500 mt-1">Try resetting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              // Calculate milestone variables
              const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));
              const latestLog = project.logs[0];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-[#FDFBF7] border border-[#F2EEE6] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  {/* Photo with Badge */}
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-[#F2EEE6]">
                      <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
                      <span className="text-xs font-bold text-gray-700 tracking-tight">{project.category}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#15803d] transition-colors tracking-tight">
                          {project.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-sans leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl border border-[#F2EEE6] overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-xs flex-shrink-0">
                        <img 
                          src={project.logo} 
                          alt={`${project.name} logo`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-gray-600">{percent}% to next seed grant</span>
                        <span className="text-[#15803d] font-bold">
                          ${project.raisedAmount.toLocaleString()} / ${project.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-[#e4e2e1] h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#fdc003] h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Latest AI Summary Card Quote */}
                    {latestLog && (
                      <div className="bg-white p-4 rounded-xl border border-[#F2EEE6] border-l-4 border-[#fdc003] italic text-xs text-gray-600 relative pt-6 pl-5 shadow-xs">
                        <Quote className="w-5 h-5 text-[#fdc003] opacity-40 absolute top-2 left-2 stroke-[2.5]" />
                        <p className="line-clamp-3 leading-relaxed">
                          "{latestLog.text}"
                        </p>
                        <div className="text-[10px] text-gray-400 mt-2 text-right not-italic font-medium">
                          Latest Proof &bull; {latestLog.dateLabel}
                        </div>
                      </div>
                    )}

                    {/* Button */}
                    <button 
                      className="w-full bg-[#15803d] text-white py-3 rounded-xl font-bold text-sm tracking-wide active:scale-98 transition-transform hover:bg-[#166534] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Back this Growth
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Newsletter Section / CTA Split */}
      <section className="bg-[#e4e2de] rounded-3xl p-8 md:p-12 overflow-hidden shadow-sm border border-[#c8c6c3]">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
              Don't miss a single harvest.
            </h3>
            <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed">
              Get a weekly summary of verified proof-of-work updates from small businesses you follow and discover new grants before they close.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0">
              <input 
                type="email" 
                placeholder="neighbor@email.com" 
                className="flex-grow rounded-xl border-none bg-white text-gray-700 py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#15803d] outline-none shadow-xs font-sans"
              />
              <button 
                onClick={() => alert("Thank you for subscribing! We will send weekly progress harvests straight to your inbox.")}
                className="bg-gray-900 hover:bg-black text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center relative">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <div className="absolute inset-0 bg-[#fdc003] rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-6 bg-[#15803d] rounded-full animate-pulse delay-75 opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#becab9]">
                  <Leaf className="w-10 h-10 text-[#15803d]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
