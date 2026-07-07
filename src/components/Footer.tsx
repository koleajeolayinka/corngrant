import React from "react";
import { Sprout } from "lucide-react";

interface FooterProps {
  onOpenModal: (type: "privacy" | "terms" | "support" | "how-it-works" | "our-impact") => void;
}

export default function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="w-full py-12 px-6 md:px-8 mt-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
            <span className="font-sans text-lg font-bold tracking-tight">CornGrant</span>
          </div>
          <p className="font-sans text-xs text-gray-500">
            © {new Date().getFullYear()} CornGrant. Sowing seeds of verified community development.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <button 
            onClick={() => onOpenModal("how-it-works")}
            className="hover:text-emerald-600 transition-colors cursor-pointer text-sm font-sans font-medium"
          >
            How it Works
          </button>
          <button 
            onClick={() => onOpenModal("our-impact")}
            className="hover:text-emerald-600 transition-colors cursor-pointer text-sm font-sans font-medium"
          >
            Our Impact
          </button>
          <button 
            onClick={() => onOpenModal("privacy")}
            className="hover:text-emerald-600 transition-colors cursor-pointer text-sm font-sans font-medium"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onOpenModal("terms")}
            className="hover:text-emerald-600 transition-colors cursor-pointer text-sm font-sans font-medium"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => onOpenModal("support")}
            className="hover:text-emerald-600 transition-colors cursor-pointer text-sm font-sans font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </footer>
  );
}
