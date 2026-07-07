import React, { useState } from "react";
import { Project } from "../types";
import { Search, ArrowRight, ShieldCheck, Users, TrendingUp } from "lucide-react";
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

  const fallbackImage = "https://images.unsplash.com/photo-1463171359979-300662226149?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="space-y-28 bg-white min-h-screen text-gray-900 font-sans pb-24">
      <section className="relative py-24 md:py-36 text-center max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide border border-emerald-100"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Verified micro-grant platform
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight font-sans animate-fade-in"
          >
            Fund local growth, <br className="hidden md:block"/>
            <span className="text-emerald-700">verified by daily proof of work.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Direct, transparent backing for localized merchants and community micro-grants. Experience trust through verifiable, daily visual evidence of real-world impact.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-6"
          >
            <button 
              onClick={() => {
                const el = document.getElementById("projects-feed");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-full font-bold transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer text-[15px]"
            >
              Discover Active Campaigns
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById("how-it-works-section");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-full font-bold transition-all active:scale-95 cursor-pointer text-[15px]"
            >
              How it Works
            </button>
          </motion.div>
        </div>
      </section>

      <section id="projects-feed" className="space-y-12 scroll-mt-20 px-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-gray-200">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active growth campaigns</h2>
            <p className="text-gray-500 text-sm font-sans">Empower independent businesses documenting certified accomplishments daily.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? "bg-emerald-700 text-white shadow-xs" 
                      : "text-gray-650 hover:text-emerald-700 hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 w-60 transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-2xl max-w-xl mx-auto">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="font-bold text-gray-700 text-lg">No active campaigns found</h4>
            <p className="text-sm text-gray-500 mt-1">Try resetting your filters or adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));
              const latestLog = project.logs[0];
              const backersCount = Math.floor(project.raisedAmount / 150) + 4;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: Math.min(idx * 0.04, 0.2) }}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <div className="h-56 overflow-hidden relative bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-in-out"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs border border-gray-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                      <span className="text-[11px] font-bold text-gray-750 tracking-tight">{project.category}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors tracking-tight leading-snug truncate">
                          {project.name}
                        </h4>
                        <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-xs flex-shrink-0">
                          <img 
                            src={project.logo} 
                            alt={`${project.name} logo`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = fallbackImage;
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1 overflow-hidden">
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-baseline text-xl font-extrabold text-gray-900 tracking-tight leading-none overflow-hidden whitespace-nowrap text-ellipsis w-full">
                        <span className="truncate select-all whitespace-nowrap overflow-hidden text-ellipsis">
                          ₦{project.raisedAmount.toLocaleString()}
                        </span>
                        <span className="text-gray-500 font-medium text-xs font-sans ml-1.5 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          raised of ₦{project.targetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-b border-gray-100 py-3 text-xs font-sans overflow-hidden w-full gap-2">
                      <span className="inline-flex items-center gap-1.5 text-gray-600 font-semibold truncate whitespace-nowrap overflow-hidden text-ellipsis">
                        <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{backersCount} backers</span>
                      </span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md truncate whitespace-nowrap overflow-hidden text-ellipsis">
                        {percent}% completed
                      </span>
                    </div>

                    {latestLog && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 border-l-4 border-emerald-700 text-xs text-gray-650 relative font-sans">
                        <p className="line-clamp-2 leading-relaxed italic">
                          "{latestLog.text}"
                        </p>
                        <div className="text-[10px] text-gray-400 mt-2 text-right font-semibold">
                          Latest Verified Proof &bull; {latestLog.dateLabel}
                        </div>
                      </div>
                    )}

                    <button 
                      className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-emerald-800 transition-all duration-300 ease-in-out shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Sponsor this Campaign</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <section id="how-it-works-section" className="scroll-mt-20 py-20 border-t border-gray-100 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">How it works</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">
              A transparent, high-trust network connecting community contributions directly with real-world, verified business achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-5 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold text-sm border border-emerald-100">
                1
              </div>
              <h4 className="font-bold text-gray-900 text-base">Setup campaign &amp; wallet</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Independent local merchants register their businesses and safely link their verified Nomba settlement account.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-5 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold text-sm border border-emerald-100">
                2
              </div>
              <h4 className="font-bold text-gray-900 text-base">Upload daily verification</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Business owners post raw daily logs and photograph attachments proving work progress at active project milestones.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-5 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold text-sm border border-emerald-100">
                3
              </div>
              <h4 className="font-bold text-gray-900 text-base">Contribute with trust</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Backers inspect daily proof of work and fund growth via secure, card-based or bank transfer micro-grants.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="impact-section" className="scroll-mt-20 py-20 border-t border-gray-100 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Our verified impact</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">
              Real progress, documented daily. Every micro-grant contributes directly to measurable community development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2 shadow-xs">
              <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">₦14,250,000+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Total Seeds Sown</div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-sans">Micro-grants securely processed for local small businesses.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2 shadow-xs">
              <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">4,200+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Logs Verified</div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-sans">Independently verified photograph and work-proof logs.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2 shadow-xs">
              <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">180+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">SMEs Supported</div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-sans">Active local farms, craftsmen, and kitchens supported.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2 shadow-xs">
              <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">98.4%</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Milestones Met</div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-sans">SME milestones successfully reached and documented.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 rounded-3xl p-8 md:p-14 overflow-hidden border border-emerald-100 max-w-4xl mx-auto mx-4 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Get weekly verification harvests
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed font-sans">
              Get a weekly summary of verified updates from local merchants you sponsor and discover new campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0 pt-2">
              <input 
                type="email" 
                placeholder="neighbor@email.com" 
                className="flex-grow rounded-xl border border-gray-300 bg-white text-gray-700 py-3.5 px-4 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none shadow-xs"
              />
              <button 
                onClick={() => alert("Thank you for subscribing! We will send weekly progress harvests straight to your inbox.")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
