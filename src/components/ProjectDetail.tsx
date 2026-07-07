import React, { useState } from "react";
import { Project } from "../types";
import { ArrowLeft, Clock, History, Landmark, Check, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onDonate: (amount: number, projectId: string) => Promise<void>;
}

export default function ProjectDetail({ project, onBack, onDonate }: ProjectDetailProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAmount, setSuccessAmount] = useState(5000);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const sponsorWidgetRef = React.useRef<HTMLDivElement>(null);
  const customInputRef = React.useRef<HTMLInputElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1463171359979-300662226149?auto=format&fit=crop&w=800&q=80";

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [project.id]);

  const handleScrollToSponsor = () => {
    sponsorWidgetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      if (selectedAmount === "custom") {
        customInputRef.current?.focus();
      }
    }, 800);
  };

  const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));
  const backersCount = Math.floor(project.raisedAmount / 150) + 4;

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'nomba-checkout-success') {
        const amt = Number(event.data.amount) || 5000;
        setCheckoutUrl(null);
        setSuccessAmount(amt);
        setShowSuccess(true);
        onDonate(amt, project.id);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onDonate, project.id]);

  const handleCheckout = async () => {
    let finalAmount = 0;
    if (selectedAmount === "custom") {
      const parsed = parseFloat(customAmount);
      if (isNaN(parsed) || parsed <= 0) {
        alert("Please enter a valid amount to contribute.");
        return;
      }
      finalAmount = parsed;
    } else {
      finalAmount = selectedAmount;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, projectId: project.id })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
      } else {
        throw new Error("Missing checkoutUrl");
      }
    } catch (err) {
      alert("Payment gateway failed to initialize. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 relative bg-white pb-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to active campaigns
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-3xl overflow-hidden h-[340px] border border-gray-200 group shadow-md bg-gray-100 w-full">
            <img
              src={project.image}
              alt={project.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <div className="space-y-1 text-white min-w-0 max-w-full">
                  <span className="inline-flex items-center gap-1 bg-emerald-600/95 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    Verified Active Campaign
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight drop-shadow-md truncate max-w-full">
                    {project.name}
                  </h2>
                </div>
                <button
                  onClick={handleScrollToSponsor}
                  className="bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs px-5 py-3 rounded-xl transition-all duration-300 shadow-lg cursor-pointer transform hover:scale-[1.03] active:scale-[0.98] flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Plant a Seed</span>
                  <span className="text-sm">🌱</span>
                </button>
              </div>
            </div>
          </div>

          <section className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white border border-gray-200 p-2 shadow-sm">
              <img
                src={project.logo}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>
            <div className="flex-grow space-y-3 min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-none truncate w-full">
                {project.name}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                {project.fullDescription || project.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full font-sans text-xs font-semibold tracking-wide truncate max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis ${
                      i === 0 
                        ? "bg-emerald-50 text-emerald-850 border border-emerald-100" 
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-700" />
              Project Verification Journal
            </h2>

            <div className="relative pl-8 md:pl-10 space-y-8 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:border-l-2 before:border-dashed before:border-gray-200">
              {project.logs.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-500 font-sans">No daily logs posted yet for this project.</p>
                </div>
              ) : (
                project.logs.map((log, idx) => (
                  <div key={log.id} className="relative">
                    <div 
                      className={`absolute -left-[29px] md:-left-[31px] top-1.5 w-6 h-6 rounded-full border-4 border-white z-10 transition-colors ${
                        idx === 0 ? "bg-emerald-700" : "bg-gray-300"
                      }`}
                    />

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center text-xs gap-4">
                          <span className="font-bold text-emerald-800 tracking-wide bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                            Verified Log: {log.dateLabel}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1 font-sans font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                            <Clock className="w-3.5 h-3.5" />
                            {log.timeLabel}
                          </span>
                        </div>

                        <p className="text-base text-gray-800 font-medium leading-relaxed">
                          {log.text}
                        </p>

                        {log.rawText !== log.text && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 font-sans">
                            <span className="font-semibold block mb-0.5 text-gray-700">Owner original submission:</span>
                            "{log.rawText}"
                          </div>
                        )}

                        {log.images && log.images.length > 0 && (
                          <div className={`grid gap-3 pt-2 ${
                            log.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                          }`}>
                            {log.images.map((imgUrl, imgIdx) => (
                              <div 
                                key={imgIdx} 
                                className={`rounded-xl overflow-hidden bg-gray-50 border border-gray-200 ${
                                  log.images.length === 1 ? "h-64" : "h-40"
                                }`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Proof of work attachment ${imgIdx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallbackImage;
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <aside ref={sponsorWidgetRef} className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 w-full min-w-0">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-md overflow-hidden w-full">
            <div className="h-2 bg-emerald-700"></div>

            <div className="p-6 space-y-6 w-full">
              <h3 className="text-xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                <Landmark className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                Sponsor this Campaign
              </h3>

              <div className="space-y-3 p-4 bg-gray-50 border border-gray-150 rounded-2xl w-full overflow-hidden">
                <div className="overflow-hidden whitespace-nowrap w-full">
                  <div className="flex items-baseline text-2xl font-extrabold text-gray-950 tracking-tight leading-none overflow-hidden whitespace-nowrap text-ellipsis w-full">
                    <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis">₦{project.raisedAmount.toLocaleString()}</span>
                    <span className="text-gray-500 text-xs font-semibold font-sans ml-1.5 truncate whitespace-nowrap overflow-hidden text-ellipsis">raised</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-sans font-medium mt-1.5 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    of ₦{project.targetAmount.toLocaleString()} target goal
                  </div>
                </div>

                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-650 font-sans font-bold flex items-center justify-center gap-1.5 pt-0.5 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                  <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis">{percent}% funded by {backersCount} neighbors</span>
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Select Sponsor Amount</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1000, 5000, 10000, 25000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`py-3 rounded-xl font-bold text-sm border transition-all duration-200 cursor-pointer ${
                        selectedAmount === amount
                          ? "border-emerald-700 bg-emerald-50 text-emerald-800 border-2 shadow-xs scale-[1.02]"
                          : "border-gray-200 text-gray-750 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      ₦{amount.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedAmount("custom")}
                    className={`py-3 rounded-xl font-bold text-sm border transition-all duration-200 cursor-pointer ${
                      selectedAmount === "custom"
                        ? "border-emerald-700 bg-emerald-50 text-emerald-800 border-2 shadow-xs scale-[1.02]"
                        : "border-gray-200 text-gray-750 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    Custom Amount
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {selectedAmount === "custom" && (
                    <motion.div 
                      key="custom-amount-panel"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="relative overflow-hidden"
                    >
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                      <input
                        ref={customInputRef}
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        className="w-full pl-8 pr-4 py-3 border border-emerald-700 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white outline-none font-sans text-sm text-gray-800 font-bold"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base py-3.5 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                    Initializing Secure Gateway...
                  </>
                ) : (
                  <>
                    Sponsor Now
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-gray-150 flex justify-center items-center gap-1.5 text-xs text-gray-500 font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Secured by Nomba Gateway</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-gray-805 text-sm mb-1.5">Why Back This Campaign?</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Every single contribution is processed via a secure institutional pathway. Your transparency-backed sponsorship directly funds certified infrastructure, seeds, and community progress goals.
            </p>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {checkoutUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#11111d] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-gray-800 flex flex-col h-[650px]"
            >
              <div className="p-4 bg-[#181829] border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomba Secure Gateway</span>
                <button
                  onClick={() => setCheckoutUrl(null)}
                  className="text-gray-400 hover:text-white transition-colors text-xs font-bold bg-gray-800/50 hover:bg-gray-800 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Cancel Payment
                </button>
              </div>

              <div className="flex-grow bg-[#11111d] relative">
                <iframe
                  src={checkoutUrl}
                  title="Nomba Checkout Sandbox"
                  className="w-full h-full border-0 rounded-b-3xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-gray-200"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sponsorship Processed!</h3>
                <p className="text-gray-600 font-sans text-sm leading-relaxed">
                  Thank you! You contributed <strong className="text-gray-900 font-bold">₦{successAmount.toLocaleString()}</strong> directly to <strong>{project.name}</strong>.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl text-left space-y-2 text-xs font-sans text-gray-500">
                <div className="flex justify-between"><span className="font-semibold">Transaction Status</span><span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 fill-current text-white text-emerald-600" /> APPROVED</span></div>
                <div className="flex justify-between"><span>Payment Gateway</span><span>Nomba Secure Pay</span></div>
                <div className="flex justify-between"><span>Reference ID</span><span>NOMBA-TXN-{Date.now().toString().slice(-8)}</span></div>
                <div className="flex justify-between"><span>Date / Time</span><span>{new Date().toLocaleString()}</span></div>
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Continue Browsing Journal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
