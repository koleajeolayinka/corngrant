import React from "react";
import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-8 mt-20 bg-[#FDFBF7] border-t border-[#F2EEE6]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#15803d]">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
            <span className="font-sans text-lg font-bold tracking-tight">CornGrant</span>
          </div>
          <p className="font-sans text-xs text-gray-500">
            © {new Date().getFullYear()} CornGrant. Planting seeds for transparent community growth.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-[#15803d] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#15803d] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#15803d] transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
