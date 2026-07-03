import React, { useState } from "react";
import { Project } from "../types";
import { ArrowLeft, Clock, History, Landmark, Sparkles, Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onDonate: (amount: number) => Promise<void>;
}

export default function ProjectDetail({ project, onBack, onDonate }: ProjectDetailProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAmount, setSuccessAmount] = useState(25);

  const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));

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
    setSuccessAmount(finalAmount);

    // Simulate standard secure payment checkout via Nomba API gateway (1.5 seconds)
    setTimeout(async () => {
      try {
        await onDonate(finalAmount);
        setIsSubmitting(false);
        setShowSuccess(true);
      } catch (err) {
        alert("Simulated transaction failed. Please try again.");
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-10 relative">
      {/* Back navigation header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#15803d] transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Discover Feed
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Profile Header & Project Journal) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Business Profile Header */}
          <section className="bg-[#FDFBF7] p-6 md:p-8 rounded-2xl border border-[#F2EEE6] flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white border border-[#F2EEE6] p-1.5 shadow-xs">
              <img
                src={project.logo}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-grow space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                {project.name}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                {project.fullDescription || project.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full font-sans text-xs font-semibold tracking-wide ${
                      i === 0 
                        ? "bg-[#15803d]/10 text-[#15803d]" 
                        : i === 1 
                        ? "bg-[#fdc003]/10 text-[#785900]" 
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Dotted Timeline section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-[#15803d]" />
              Project Journal
            </h2>

            {/* Vertical timeline line container */}
            <div className="relative pl-8 md:pl-10 space-y-8 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#becab9]">
              {project.logs.length === 0 ? (
                <div className="text-center py-10 bg-[#FDFBF7] border border-dashed border-[#becab9] rounded-xl">
                  <p className="text-sm text-gray-500 font-sans">No daily logs posted yet for this project.</p>
                </div>
              ) : (
                project.logs.map((log, idx) => (
                  <div key={log.id} className="relative">
                    {/* Node circle */}
                    <div 
                      className={`absolute -left-[29px] md:-left-[31px] top-1.5 w-6 h-6 rounded-full border-4 border-white z-10 transition-colors ${
                        idx === 0 ? "bg-[#15803d]" : "bg-[#becab9]"
                      }`}
                    />

                    {/* Timeline Log Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-[#F2EEE6] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="p-6 space-y-4">
                        {/* Log Date & Time */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#15803d] tracking-wide bg-[#15803d]/5 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            {log.dateLabel}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1 font-sans font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {log.timeLabel}
                          </span>
                        </div>

                        {/* AI formatted display text */}
                        <p className="text-base text-gray-800 font-medium leading-relaxed">
                          {log.text}
                        </p>

                        {/* If the owner has customized it or there is rawText shown */}
                        {log.rawText !== log.text && (
                          <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-[#F2EEE6]">
                            <span className="font-semibold block mb-0.5">Raw owner log:</span>
                            "{log.rawText}"
                          </div>
                        )}

                        {/* Optional Attached Images Grid */}
                        {log.images && log.images.length > 0 && (
                          <div className={`grid gap-3 pt-2 ${
                            log.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                          }`}>
                            {log.images.map((imgUrl, imgIdx) => (
                              <div 
                                key={imgIdx} 
                                className={`rounded-xl overflow-hidden bg-gray-50 border border-[#F2EEE6] ${
                                  log.images.length === 1 ? "h-64" : "h-40"
                                }`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Proof of work attachment ${imgIdx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
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

        {/* Right Column (Plant a Seed Grant Widget) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white border-2 border-[#fdc003] rounded-3xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-[#fdc003] p-5 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#6c5000]" />
              <h3 className="text-lg font-extrabold text-[#6c5000] tracking-tight">
                Plant a Seed
              </h3>
            </div>

            {/* Widget Body */}
            <div className="p-6 space-y-6">
              {/* Progress Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-extrabold text-gray-900">${project.raisedAmount.toLocaleString()} raised</span>
                  <span className="text-gray-500 text-xs">of ${project.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-[#f0eded] h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#fdc003] h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 font-sans text-center font-medium mt-1">
                  {percent}% funded by 482 community members
                </p>
              </div>

              {/* Presets and Custom Inputs */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[5, 10, 25].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                        selectedAmount === amount
                          ? "border-[#15803d] bg-[#15803d]/5 text-[#15803d] border-2"
                          : "border-[#becab9] text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedAmount("custom")}
                    className={`py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                      selectedAmount === "custom"
                        ? "border-[#15803d] bg-[#15803d]/5 text-[#15803d] border-2"
                        : "border-[#becab9] text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Custom Amount Field */}
                {selectedAmount === "custom" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter custom amount"
                      className="w-full pl-8 pr-4 py-3 border border-[#15803d] rounded-xl focus:ring-1 focus:ring-[#15803d] focus:border-[#15803d] bg-white outline-none font-sans text-sm text-gray-800"
                    />
                  </motion.div>
                )}
              </div>

              {/* Action checkout button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-[#fdc003] hover:bg-[#fabd00] text-[#261a00] font-bold text-base py-4 rounded-xl shadow-xs hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin border-2 border-[#261a00] border-t-transparent rounded-full w-5 h-5"></span>
                    Initializing Secure Nomba Checkout...
                  </>
                ) : (
                  <>
                    Plant a Seed
                  </>
                )}
              </button>

              {/* Secure partner banner */}
              <div className="pt-4 border-t border-[#F2EEE6] flex justify-center items-center gap-1.5 text-xs text-gray-500 font-sans">
                <ShieldCheck className="w-4 h-4 text-[#15803d]" />
                <span>Secured by</span>
                <span className="font-extrabold text-gray-800 opacity-70">Nomba API</span>
              </div>
            </div>
          </div>

          {/* Secondary Info Card */}
          <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F2EEE6]">
            <h4 className="font-bold text-gray-800 text-sm mb-1.5">Why Fund This?</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Every single dollar goes directly toward certified infrastructure and operations. Your transparency-backed contribution directly fuels localized job training, resource conservation, and neighborhood health.
            </p>
          </div>
        </aside>
      </div>

      {/* Simulated Nomba Checkout Overlay Dialog Success */}
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
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-[#becab9]"
            >
              <div className="w-16 h-16 bg-[#15803d]/10 rounded-full flex items-center justify-center mx-auto text-[#15803d]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Seed Planted Successfully!</h3>
                <p className="text-gray-600 font-sans text-sm leading-relaxed">
                  Thank you! You contributed <strong className="text-gray-900 font-bold">${successAmount}</strong> directly to <strong>{project.name}</strong>.
                </p>
              </div>

              <div className="bg-[#FDFBF7] border border-[#F2EEE6] p-4 rounded-2xl text-left space-y-2 text-xs font-sans text-gray-500">
                <div className="flex justify-between"><span className="font-semibold">Transaction Status</span><span className="text-[#15803d] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 fill-current text-white" /> APPROVED</span></div>
                <div className="flex justify-between"><span>Payment Gateway</span><span>Nomba Secure Pay</span></div>
                <div className="flex justify-between"><span>Reference ID</span><span>NOMBA-TXN-{Date.now().toString().slice(-8)}</span></div>
                <div className="flex justify-between"><span>Date / Time</span><span>{new Date().toLocaleString()}</span></div>
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer"
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
