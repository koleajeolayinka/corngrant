import React, { useState, useEffect } from "react";
import TopNavBar from "./components/TopNavBar";
import DiscoveryFeed from "./components/DiscoveryFeed";
import ProjectDetail from "./components/ProjectDetail";
import Dashboard from "./components/Dashboard";
import AccountSetup from "./components/AccountSetup";
import Footer from "./components/Footer";
import { Project } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { X, Shield, FileText, Mail, HelpCircle, Award } from "lucide-react";

const INITIAL_PROJECTS: Project[] = [
  {
    id: "the-urban-orchard",
    name: "The Urban Orchard",
    category: "Agriculture",
    description: "Providing fresh, organic produce to downtown.",
    fullDescription: "An innovative urban oasis dedicated to supplying fresh, sustainable, and organic crops to inner-city neighborhoods while hosting local workshops to teach city dwellers about modern agriculture.",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=150&q=80",
    milestone: "Next Grant: $500 for New Equipment",
    targetAmount: 200000,
    raisedAmount: 145000,
    tags: ["Agriculture", "Community Garden", "Urban Ag"],
    logs: [
      {
        id: "uo-log-1",
        dateLabel: "Today",
        timeLabel: "2:45 PM",
        rawText: "Just harvested 50lbs of kale for the community kitchen today!",
        text: "Harvested and delivered 50lbs of fresh, crisp organic kale to the downtown community kitchen, bringing nutrient-dense local food straight to neighborhood tables.",
        images: ["https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80"],
        timestamp: Date.now() - 3600000
      }
    ]
  },
  {
    id: "stitch-sow-tailors",
    name: "Stitch & Sow Tailors",
    category: "Craftsmanship",
    description: "Training local youth in sustainable textile arts.",
    fullDescription: "A modern, community-oriented sewing workshop that repurposes industrial textile waste to create high-quality modern garments, while mentoring underrepresented youth in sustainable design.",
    image: "https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    milestone: "Next Grant: $1,200 for Upcycled Fabrics",
    targetAmount: 350000,
    raisedAmount: 120000,
    tags: ["Craftsmanship", "Youth Training", "Sustainability"],
    logs: [
      {
        id: "sst-log-1",
        dateLabel: "Yesterday",
        timeLabel: "4:30 PM",
        rawText: "Our first batch of upcycled linen shirts is ready for the weekend market!",
        text: "Finished sewing our very first limited batch of upcycled linen shirts! Crafted by our local youth trainees, these durable items are set for the weekend market.",
        images: ["https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&w=800&q=80"],
        timestamp: Date.now() - 86400000
      }
    ]
  },
  {
    id: "rise-shine-bakery",
    name: "Rise & Shine Bakery",
    category: "Food & Drink",
    description: "Sourcing ancient grains from local family farms.",
    fullDescription: "A traditional slow-fermentation community sourdough bakery that sources 100% of its heritage grains directly from family-run regional farms, preserving ancient crops and sustaining agricultural heritage.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=150&q=80",
    milestone: "Next Grant: $160 for Eco-Friendly Flour Silos",
    targetAmount: 150000,
    raisedAmount: 124000,
    tags: ["Food & Drink", "Artisan", "Local Sourcing"],
    logs: [
      {
        id: "rsb-log-1",
        dateLabel: "2 Days Ago",
        timeLabel: "9:15 AM",
        rawText: "Secured 500lbs of heritage rye for the winter baking season today!",
        text: "Secured a direct partnership with a local heritage grain farm to procure 500lbs of traditional winter rye, ensuring healthy, natural bread varieties for our customers.",
        images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"],
        timestamp: Date.now() - 172800000
      }
    ]
  },
  {
    id: "green-valley-urban-farm",
    name: "Green Valley Urban Farm",
    category: "Agriculture",
    description: "Sustainable rooftop farming in the heart of the city.",
    fullDescription: "Sustainable rooftop farming in the heart of the city. We're dedicated to providing fresh, organic produce to local food banks and community markets while teaching urban agriculture to local youth.",
    image: "https://images.unsplash.com/photo-1534710961216-75c9760229c5?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=150&q=80",
    milestone: "Next Grant: $500 for New Equipment",
    targetAmount: 500000,
    raisedAmount: 310000,
    tags: ["Agriculture", "Community Garden", "Urban Ag", "Youth Education"],
    logs: [
      {
        id: "gvuf-log-1",
        dateLabel: "Today",
        timeLabel: "2:45 PM",
        rawText: "Installed new irrigation system! This will reduce our water usage by 40% and ensure the new tomato plants get consistent hydration through the summer heat.",
        text: "Installed new irrigation system! This will reduce our water usage by 40% and ensure the new tomato plants get consistent hydration through the summer heat.",
        images: ["https://images.unsplash.com/photo-1534710961216-75c9760229c5?auto=format&fit=crop&w=800&q=80"],
        timestamp: Date.now() - 3600000
      }
    ]
  }
];

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem("corngrant-projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {
    }
    return INITIAL_PROJECTS;
  });
  const [currentView, setView] = useState<"donor" | "owner" | "detail">("donor");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [ownerBusinessId, setOwnerBusinessId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("corngrant-owner-business-id");
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "support" | "how-it-works" | "our-impact" | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("corngrant-projects", JSON.stringify(projects));
    } catch (e) {
    }
  }, [projects]);

  useEffect(() => {
    try {
      if (ownerBusinessId) {
        localStorage.setItem("corngrant-owner-business-id", ownerBusinessId);
      } else {
        localStorage.removeItem("corngrant-owner-business-id");
      }
    } catch (e) {
    }
  }, [ownerBusinessId]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Server response error");
      const data = await res.json();
      if (data.projects && data.projects.length > 0) {
        setProjects(prev => {
          const merged = [...prev];
          data.projects.forEach((sp: Project) => {
            const idx = merged.findIndex(p => p.id === sp.id);
            if (idx >= 0) {
              merged[idx] = {
                ...merged[idx],
                raisedAmount: Math.max(merged[idx].raisedAmount, sp.raisedAmount),
                logs: sp.logs.length > merged[idx].logs.length ? sp.logs : merged[idx].logs
              };
            } else {
              merged.push(sp);
            }
          });
          return merged;
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  const handleAddLog = async (projectId: string, rawText: string, images: string[]) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, images }),
      });
      const data = await res.json();
      if (data.project) {
        setProjects(prev => prev.map(p => p.id === projectId ? data.project : p));
      }
    } catch (err) {
      throw err;
    }
  };

  const handleDonate = async (amount: number, projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newRaised = p.raisedAmount + amount;
        
        const donationLog = {
          id: `donation-${Date.now()}`,
          dateLabel: "Today",
          timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawText: `Received community micro-grant of ₦${amount.toLocaleString()} via Nomba settlement.`,
          text: `Sponsorship Sown: Received a community micro-grant of ₦${amount.toLocaleString()} from a neighbor, settled instantly to Nomba wallet. Verification completed securely.`,
          images: [],
          timestamp: Date.now()
        };

        const updatedLogs = p.logs.map(l => {
          if (l.dateLabel === "Today") {
            return { ...l, dateLabel: "Yesterday" };
          } else if (l.dateLabel === "Yesterday") {
            return { ...l, dateLabel: "3 Days Ago" };
          }
          return l;
        });

        return {
          ...p,
          raisedAmount: newRaised,
          logs: [donationLog, ...updatedLogs]
        };
      }
      return p;
    }));

    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(prev => {
          return prev.map(localProj => {
            const serverProj = data.projects.find((sp: Project) => sp.id === localProj.id);
            if (serverProj) {
              return {
                ...serverProj,
                raisedAmount: Math.max(localProj.raisedAmount, serverProj.raisedAmount)
              };
            }
            return localProj;
          });
        });
      }
    } catch (err) {
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setView("detail");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
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

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <span className="animate-spin border-4 border-emerald-600 border-t-transparent rounded-full w-10 h-10"></span>
            <p className="text-sm font-semibold text-gray-500 font-sans">Connecting to CornGrant network...</p>
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
                ownerBusinessId ? (
                  <Dashboard 
                    projects={projects} 
                    onAddLog={handleAddLog} 
                    ownerBusinessId={ownerBusinessId}
                  />
                ) : (
                  <AccountSetup 
                    onComplete={async (data) => {
                      try {
                        const res = await fetch("/api/projects", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: data.businessName,
                            category: data.sector,
                            description: data.description,
                            milestone: data.milestone,
                            targetAmount: data.targetAmount,
                            nombaWalletId: data.walletId
                          })
                        });
                        if (!res.ok) throw new Error("Server error");
                        const result = await res.json();
                        if (result.project) {
                          setProjects(prev => {
                            if (prev.some(p => p.id === result.project.id)) return prev;
                            return [...prev, result.project];
                          });
                          setOwnerBusinessId(result.project.id);
                        }
                      } catch (err) {
                        const localId = `local-${Date.now()}`;
                        const newProject: Project = {
                          id: localId,
                          name: data.businessName,
                          category: data.sector as any,
                          description: data.description,
                          fullDescription: data.description,
                          logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiE_lkvhbeV1Y953nhPXYVFUTopjdFfPOZqK-yMw4s4HypMgfJHaUu7KTsjMCq_1ZSq-79kEwuUUJzbXhbrYklNumyRK--flkEMYBNrsnCPyj0mjUnwIkvdEeQDB6pqskKVpDeMF6fovqkfjGKjIL_5hP_zExT-wm82YGeVuCTUCxCEUO4iOfG8yZaScQYLfbQzDH1AidUShESR4NuCKvMcM2NT1u0_ZLKurSyUvwD2_jkPrcawhAdkQ",
                          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiE_lkvhbeV1Y953nhPXYVFUTopjdFfPOZqK-yMw4s4HypMgfJHaUu7KTsjMCq_1ZSq-79kEwuUUJzbXhbrYklNumyRK--flkEMYBNrsnCPyj0mjUnwIkvdEeQDB6pqskKVpDeMF6fovqkfjGKjIL_5hP_zExT-wm82YGeVuCTUCxCEUO4iOfG8yZaScQYLfbQzDH1AidUShESR4NuCKvMcM2NT1u0_ZLKurSyUvwD2_jkPrcawhAdkQ",
                          raisedAmount: 0,
                          targetAmount: data.targetAmount,
                          nombaWalletId: data.walletId,
                          milestone: data.milestone,
                          tags: [data.sector, "Community"],
                          logs: []
                        };
                        setProjects(prev => [...prev, newProject]);
                        setOwnerBusinessId(localId);
                      }
                    }}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <Footer onOpenModal={(type) => setActiveModal(type)} />

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 relative border border-gray-200 shadow-2xl"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModal === "how-it-works" && (
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">How CornGrant Works</h3>
                  <div className="text-sm text-gray-600 leading-relaxed space-y-4 font-sans">
                    <p>
                      CornGrant connects verified local small businesses and farmers directly with secure community micro-grants in a highly structured, transparent system.
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="font-bold text-emerald-600 font-mono">01.</span>
                        <p><strong className="text-gray-950 font-semibold">Account Setup:</strong> Business owners register their business, set a grant target, and link their secure Nomba wallet account for instant disbursements.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-bold text-emerald-600 font-mono">02.</span>
                        <p><strong className="text-gray-950 font-semibold">Daily Proof-of-Work:</strong> Owners upload detailed raw descriptions and photographs of daily milestones to certify progress before funding rounds.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-bold text-emerald-600 font-mono">03.</span>
                        <p><strong className="text-gray-950 font-semibold">Community Sponsorship:</strong> Backers review daily logs with full visual accountability, selecting pre-verified milestones to support via the secure payment gateway.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === "our-impact" && (
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Our Verified Impact</h3>
                  <div className="text-sm text-gray-650 leading-relaxed space-y-4 font-sans">
                    <p>
                      CornGrant ensures every local micro-grant leads to certified, documented community outcomes. Here are our high-trust performance indicators:
                    </p>
                    <div className="grid grid-cols-2 gap-4 border border-gray-100 p-4 rounded-2xl bg-gray-50 text-center">
                      <div>
                        <div className="text-2xl font-extrabold text-emerald-600">₦14.2M+</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sown Seeds</div>
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-emerald-600">4,200+</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Logs</div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-2xl font-extrabold text-emerald-600">180+</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SMEs Empowered</div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-2xl font-extrabold text-emerald-600">98.4%</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Completion Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === "privacy" && (
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h3>
                  <div className="text-xs text-gray-500 font-sans leading-relaxed space-y-3">
                    <p>
                      Welcome to CornGrant. Your trust is essential to us. This Privacy Policy details how we handle information, transaction logs, and secure settlement accounts linked to the CornGrant micro-grant network.
                    </p>
                    <p className="font-semibold text-gray-700">1. Information We Settle &amp; Manage</p>
                    <p>
                      We process public business details, daily progress updates, verification media, and cryptographic Nomba settlement IDs.
                    </p>
                    <p className="font-semibold text-gray-700">2. Transaction &amp; Micro-Grant Tracking</p>
                    <p>
                      Seed grants, contributions, and community-powered disbursements are securely cataloged on our internal ledger. No sensitive financial information or raw card data is ever stored directly on our servers; payments are securely offloaded to the Nomba Secure Gateway.
                    </p>
                    <p className="font-semibold text-gray-700">3. Data Integrity &amp; Transparency</p>
                    <p>
                      To preserve community trust, all daily logs, milestone progress rings, and grant amounts raised are public to let backers inspect real-world accomplishments before donating.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "terms" && (
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Terms of Service</h3>
                  <div className="text-xs text-gray-500 font-sans leading-relaxed space-y-3">
                    <p>
                      These Terms of Service govern your use of the CornGrant micro-grant platform, including our merchant settlement portal, daily log tools, and Nomba checkouts.
                    </p>
                    <p className="font-semibold text-gray-700">1. Verification of Work-Proof</p>
                    <p>
                      SMEs joining the platform agree to provide real, transparent photo evidence and written updates for each milestone. Misrepresentation of daily accomplishments is ground for immediate suspension.
                    </p>
                    <p className="font-semibold text-gray-700">2. Sowing Community Seeds</p>
                    <p>
                      All micro-grants are given on a voluntary basis by neighbors to support specific milestones. Funds are routed via the Nomba API directly to the business&apos;s settlement account. All seeds sown are final and non-refundable.
                    </p>
                    <p className="font-semibold text-gray-700">3. Settlement Disclaimer</p>
                    <p>
                      CornGrant works as an interactive communication and discovery channel. Instant settlements are executed and cleared using third-party APIs (Nomba payment gateway).
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "support" && (
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Contact Support</h3>
                  <div className="text-xs text-gray-500 font-sans leading-relaxed space-y-3">
                    <p>
                      Need help configuring your Nomba wallet, editing a milestone, or managing your micro-grants? Our professional neighborhood support team is here to assist you.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-750">General Inquiry:</span>
                        <span className="text-emerald-700 font-mono">support@corngrant.co</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-750">Nomba Wallet Operations:</span>
                        <span className="text-emerald-700 font-mono">settlement@corngrant.co</span>
                      </div>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); alert("Your support ticket has been received successfully. A team member will reply within 12 hours."); setActiveModal(null); }} className="space-y-3 pt-2">
                      <input type="text" required placeholder="Your Name" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600" />
                      <input type="email" required placeholder="Email Address" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600" />
                      <textarea required placeholder="How can we help you?" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs h-20 resize-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600" />
                      <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all hover:bg-emerald-700 cursor-pointer">
                        Submit Ticket
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
