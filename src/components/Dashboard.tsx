import React, { useState, useRef } from "react";
import { Project } from "../types";
import { Sparkles, FileText, Trash2, CheckCircle2, RefreshCw, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  projects: Project[];
  onAddLog: (projectId: string, rawText: string, images: string[]) => Promise<void>;
  ownerBusinessId?: string | null;
}

export default function Dashboard({ projects, onAddLog, ownerBusinessId }: DashboardProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    ownerBusinessId || "green-valley-urban-farm"
  );

  React.useEffect(() => {
    if (ownerBusinessId) {
      setSelectedProjectId(ownerBusinessId);
    }
  }, [ownerBusinessId]);

  const [rawText, setRawText] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCiE_lkvhbeV1Y953nhPXYVFUTopjdFfPOZqK-yMw4s4HypMgfJHaUu7KTsjMCq_1ZSq-79kEwuUUJzbXhbrYklNumyRK--flkEMYBNrsnCPyj0mjUnwIkvdEeQDB6pqskKVpDeMF6fovqkfjGKjIL_5hP_zExT-wm82YGeVuCTUCxCEUO4iOfG8yZaScQYLfbQzDH1AidUShESR4NuCKvMcM2NT1u0_ZLKurSyUvwD2_jkPrcawhAdkQ"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are supported as visual proof.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      alert("Please describe what you accomplished today.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddLog(selectedProject.id, rawText, images);
      setSuccessMsg("Success! Gemini has beautifully formatted your update and posted it live!");
      setRawText("");
      setImages([
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCiE_lkvhbeV1Y953nhPXYVFUTopjdFfPOZqK-yMw4s4HypMgfJHaUu7KTsjMCq_1ZSq-79kEwuUUJzbXhbrYklNumyRK--flkEMYBNrsnCPyj0mjUnwIkvdEeQDB6pqskKVpDeMF6fovqkfjGKjIL_5hP_zExT-wm82YGeVuCTUCxCEUO4iOfG8yZaScQYLfbQzDH1AidUShESR4NuCKvMcM2NT1u0_ZLKurSyUvwD2_jkPrcawhAdkQ"
      ]);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      alert("Failed to submit progress update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
            Good Morning, Business Owner!
          </h1>
          <p className="text-sm text-gray-500 font-sans">
            Ready to grow your community impact today?
          </p>
        </div>

        <div className="relative">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Business Account</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 shadow-xs cursor-pointer"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </section>

      <article className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6 shadow-xs">
        <div className="relative flex-shrink-0 w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-gray-100"
              cx="40"
              cy="40"
              fill="transparent"
              r="32"
              stroke="currentColor"
              strokeWidth="6"
            />
            <circle
              className="text-emerald-700 transition-all duration-1000"
              cx="40"
              cy="40"
              fill="transparent"
              r="32"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray="201"
              strokeDashoffset="60"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-emerald-800 text-sm">
            70%
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
            Active Milestone
          </span>
          <h2 className="text-base font-bold text-gray-900 tracking-tight leading-snug">
            Next Grant: $500 for New Equipment
          </h2>
          <p className="text-xs text-gray-500 font-sans">
            Only 3 more daily logs to go!
          </p>
        </div>
      </article>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight px-1">
          What did you accomplish today?
        </h3>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={isSubmitting}
            placeholder="Describe your progress... (e.g., 'Installed 4 new eco-friendly beds on the south end of our rooftop and watered them using our solar tank.')"
            className="w-full h-32 p-4 bg-white border border-gray-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl font-sans text-sm text-gray-800 placeholder-gray-400 resize-none outline-none transition-all"
          />

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Visual Proof of Work</label>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-emerald-700 bg-emerald-50/50" 
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs text-gray-650 font-bold text-center">
                Drag &amp; drop images, or <span className="text-emerald-700 underline">click to browse</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG up to 10MB</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {images.map((img, idx) => (
                <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden relative border border-gray-200 shadow-xs group">
                  <img 
                    src={img} 
                    alt="preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1463171359979-300662226149?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-sans font-bold border border-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 fill-current text-white" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting || !rawText.trim()}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-sm py-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Gemini AI Rewriting &amp; Saving...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                Post Proof &amp; Grow
              </>
            )}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Recent Logs
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
            All Verified
          </span>
        </div>

        <div className="space-y-3">
          {selectedProject.logs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4 items-start shadow-xs">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0">
                {log.images && log.images[0] ? (
                  <img 
                    src={log.images[0]} 
                    alt="thumbnail" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1463171359979-300662226149?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{log.text.slice(0, 40)}...</h4>
                  <span className="text-[10px] text-gray-400 font-sans font-medium">{log.dateLabel}</span>
                </div>
                <p className="text-xs text-gray-500 font-sans line-clamp-2 leading-relaxed">
                  {log.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
