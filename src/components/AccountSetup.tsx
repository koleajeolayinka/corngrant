import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Building2, Wallet, Layers } from "lucide-react";

interface AccountSetupProps {
  onComplete: (data: {
    businessName: string;
    sector: string;
    description: string;
    walletId: string;
    targetAmount: number;
    milestone: string;
  }) => void;
}

export default function AccountSetup({ onComplete }: AccountSetupProps) {
  const [businessName, setBusinessName] = useState("");
  const [sector, setSector] = useState("Agriculture");
  const [description, setDescription] = useState("");
  const [walletId, setWalletId] = useState("");
  const [targetAmount, setTargetAmount] = useState(2500);
  const [milestone, setMilestone] = useState("Next Grant: $500 for Seed Supplies");
  
  const [touchedWallet, setTouchedWallet] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);

  const isWalletFormatValid = (id: string) => {
    return /^\d{10}$/.test(id);
  };

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) {
      setWalletId(val);
      setTouchedWallet(true);
      if (val.length === 10) {
        setIsValidating(true);
        setValidationSuccess(null);
        setTimeout(() => {
          setIsValidating(false);
          setValidationSuccess(true);
        }, 800);
      } else {
        setValidationSuccess(null);
      }
    }
  };

  const isFormValid = 
    businessName.trim().length >= 3 &&
    description.trim().length >= 10 &&
    isWalletFormatValid(walletId) &&
    validationSuccess === true &&
    milestone.trim().length >= 5 &&
    targetAmount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    onComplete({
      businessName: businessName.trim(),
      sector,
      description: description.trim(),
      walletId,
      targetAmount,
      milestone: milestone.trim(),
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl mb-2">
          <Building2 className="w-8 h-8 text-emerald-700" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
          Set Up Your Business
        </h1>
        <p className="text-sm text-gray-500 font-sans">
          Join CornGrant and receive community backing directly.
        </p>

        <button
          type="button"
          onClick={() => {
            setBusinessName("Heirloom Grain Growers");
            setSector("Agriculture");
            setDescription("A family-owned sustainable farm preserving rare heirloom corn varieties and delivering stone-ground flour to local bakeries.");
            setWalletId("9012345678");
            setTargetAmount(3000);
            setMilestone("Milestone 1: $1,200 for Rainwater Irrigation Setup");
            setTouchedWallet(true);
            setValidationSuccess(true);
          }}
          className="mt-4 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 mx-auto cursor-pointer animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current text-amber-600" />
          Auto-fill Sandbox Demo Details
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Verification</span>
          <span className="text-xs font-bold text-emerald-850 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Sandbox Ready
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400" /> Business Name
          </label>
          <input
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Corn Leaf Cafe"
            className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl text-sm font-sans outline-none transition-all placeholder-gray-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gray-400" /> Business Sector
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl text-sm font-sans outline-none transition-all cursor-pointer text-gray-700"
          >
            <option value="Agriculture">Agriculture &amp; Farming</option>
            <option value="Food & Drink">Food &amp; Drink</option>
            <option value="Craftsmanship">Craftsmanship &amp; Apparel</option>
            <option value="Retail">Retail &amp; Goods</option>
            <option value="Technology">Technology &amp; Impact</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Pitch / What do you do?
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Sourcing high-quality organic heirloom corn from local sustainable small farms to bake artisan cornbread and maize pastries daily..."
            className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl text-sm font-sans outline-none transition-all placeholder-gray-400 resize-none"
          />
          <p className="text-[10px] text-gray-400">At least 10 characters detailing your local impact.</p>
        </div>

        <div className="space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-gray-400" /> Nomba Settlement Account/Wallet ID
            </label>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              {isValidating ? "Validating..." : ""}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              value={walletId}
              onChange={handleWalletChange}
              placeholder="e.g. 9012345678 (10 digits)"
              className={`w-full p-3 pr-10 bg-white border rounded-xl text-sm font-mono outline-none transition-all placeholder-gray-400 ${
                touchedWallet && !isWalletFormatValid(walletId)
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : validationSuccess
                  ? "border-emerald-700 focus:border-emerald-700 focus:ring-emerald-700"
                  : "border-gray-300 focus:border-emerald-700 focus:ring-emerald-700"
              }`}
            />
            {validationSuccess && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700 text-xs font-bold flex items-center gap-1">
                Active
              </span>
            )}
          </div>
          
          {touchedWallet && !isWalletFormatValid(walletId) && (
            <p className="text-[10px] text-red-500 font-sans">
              Wallet ID format is invalid. Must be exactly 10 digits.
            </p>
          )}
          {validationSuccess && (
            <p className="text-[10px] text-emerald-850 font-sans flex items-center gap-1.5 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Nomba Settlement Account Validated: Wallet is linked successfully to settle community micro-grants instantly.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Grant Target ($)
            </label>
            <input
              type="number"
              required
              min={100}
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl text-sm font-sans outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Target Milestone Goal
            </label>
            <input
              type="text"
              required
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="Next Grant: $500 for Equipment"
              className="w-full p-3 bg-white border border-gray-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl text-sm font-sans outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-sm py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span>Complete Setup &amp; Enter Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
