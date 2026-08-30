"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Gamepad2,
  Wallet,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  AlertCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { completeOnboardingAction } from "@/app/actions/onboarding-actions";
import { ArenexLogo } from "@/components/brand/arenex-logo";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Step 1: Profile State
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("BD");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Step 2: Game Account State
  const [gameSlug, setGameSlug] = useState("free-fire");
  const [inGameName, setInGameName] = useState("");
  const [gameUid, setGameUid] = useState("");
  const [platform, setPlatform] = useState("MOBILE");

  // Step 3: Payout Information State
  const [payoutMethod, setPayoutMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [payoutNumber, setPayoutNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const supabase = createClient();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar image must be under 5MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id || "guest";
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // Fallback to local object URL if storage bucket is initializing
        setAvatarUrl(URL.createObjectURL(file));
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        setAvatarUrl(publicUrlData.publicUrl);
      }
    } catch {
      setAvatarUrl(URL.createObjectURL(file));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinishOnboarding = () => {
    setError(null);
    startTransition(async () => {
      const res = await completeOnboardingAction({
        displayName: displayName || "Warrior",
        phoneNumber,
        country,
        avatarUrl,
        gameSlug,
        gameUid,
        inGameName,
        platform,
        payoutMethod,
        payoutNumber,
        accountHolderName: accountHolderName || displayName,
      });

      if (!res.success) {
        setError(res.error || "Failed to finalize profile.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-1">
            <ArenexLogo variant="stacked" size="md" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Warrior Onboarding
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-sans">
            Configure your competitor identity, verified gaming accounts, and bKash payout details.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
              step === 1
                ? "bg-brand-crimson/10 border-brand-crimson text-brand-crimson font-bold"
                : step > 1
                ? "bg-surface-200 border-emerald-500/40 text-brand-emerald font-bold"
                : "bg-surface-100 border-surface-border text-slate-500 dark:text-gray-400"
            }`}
          >
            <span>{step > 1 ? "✓ 1. Profile" : "1. Profile"}</span>
          </div>

          <div
            className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
              step === 2
                ? "bg-brand-crimson/10 border-brand-crimson text-brand-crimson font-bold"
                : step > 2
                ? "bg-surface-200 border-emerald-500/40 text-brand-emerald font-bold"
                : "bg-surface-100 border-surface-border text-slate-500 dark:text-gray-400"
            }`}
          >
            <span>{step > 2 ? "✓ 2. Game Account" : "2. Game Account"}</span>
          </div>

          <div
            className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
              step === 3
                ? "bg-brand-crimson/10 border-brand-crimson text-brand-crimson font-bold"
                : "bg-surface-100 border-surface-border text-slate-500 dark:text-gray-400"
            }`}
          >
            <span>3. Payout Desk</span>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-100 border border-surface-border space-y-6 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          {/* STEP 1: WARRIOR PROFILE */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                <div className="p-2 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/30">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                    Personal Identity & Avatar
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400">
                    Your public competitor persona across leaderboards and podiums.
                  </p>
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={
                      avatarUrl ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    }
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-crimson/40"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-[10px] text-white font-mono">
                      Uploading
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-semibold uppercase tracking-wider text-slate-800 dark:text-gray-200 cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-brand-crimson" />
                    <span>Upload Profile Image</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                    PNG, JPG, or WEBP up to 5MB.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                    Display Name / Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahat Islam"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-medium"
                    >
                      <option value="BD">Bangladesh (BD)</option>
                      <option value="IN">India (IN)</option>
                      <option value="NP">Nepal (NP)</option>
                      <option value="GLOBAL">Global / Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!displayName.trim()) {
                      setError("Please provide your display name.");
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                  className="w-full py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/25 active:scale-[0.98]"
                >
                  <span>Continue to Gaming Accounts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GAMING ACCOUNT */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                    Connect Competitive Game Account
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400">
                    Referees match your verified in-game UID to award kills and prize earnings.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                    Esports Title
                  </label>
                  <select
                    value={gameSlug}
                    onChange={(e) => setGameSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-sans font-semibold"
                  >
                    <option value="free-fire">Free Fire Battle Royale</option>
                    <option value="pubg-mobile">PUBG Mobile (Battlegrounds)</option>
                    <option value="mlbb">Mobile Legends: Bang Bang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                    In-Game Name (IGN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ALPHA〆KILLER"
                    value={inGameName}
                    onChange={(e) => setInGameName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                      Official Game UID (8-10 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1098234871"
                      value={gameUid}
                      onChange={(e) => setGameUid(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                      Platform / Device
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-medium"
                    >
                      <option value="MOBILE">Mobile Phone (Android / iOS)</option>
                      <option value="TABLET">Tablet / iPad</option>
                      <option value="EMULATOR">PC Emulator (Permitted Cups Only)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-700 dark:text-gray-300 font-display font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!inGameName.trim() || !gameUid.trim()) {
                      setError("Please provide your In-Game Name and official Game UID.");
                      return;
                    }
                    setError(null);
                    setStep(3);
                  }}
                  className="w-2/3 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/25 active:scale-[0.98]"
                >
                  <span>Continue to Payouts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYOUT METHOD (bKash) */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                    Tournament Payout Destination
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400">
                    Prize winnings will be disbursed directly to this account via bKash / Nagad.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                    Payout Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("bkash")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-display font-bold uppercase tracking-wider transition-all ${
                        payoutMethod === "bkash"
                          ? "bg-pink-500/10 border-pink-500 text-pink-500 shadow-sm"
                          : "bg-surface-200 border-surface-border text-slate-600 dark:text-gray-400"
                      }`}
                    >
                      bKash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("nagad")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-display font-bold uppercase tracking-wider transition-all ${
                        payoutMethod === "nagad"
                          ? "bg-orange-500/10 border-orange-500 text-orange-500 shadow-sm"
                          : "bg-surface-200 border-surface-border text-slate-600 dark:text-gray-400"
                      }`}
                    >
                      Nagad
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("rocket")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-display font-bold uppercase tracking-wider transition-all ${
                        payoutMethod === "rocket"
                          ? "bg-purple-500/10 border-purple-500 text-purple-500 shadow-sm"
                          : "bg-surface-200 border-surface-border text-slate-600 dark:text-gray-400"
                      }`}
                    >
                      Rocket
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                    {payoutMethod.toUpperCase()} Account Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX / 018XXXXXXXX"
                    value={payoutNumber}
                    onChange={(e) => setPayoutNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name registered with mobile wallet"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-medium"
                  />
                </div>
              </div>

              {/* Zero-Trust Notice */}
              <div className="p-3 rounded-xl bg-surface-200 border border-surface-border text-[11px] font-sans text-slate-600 dark:text-gray-400 flex items-start gap-2">
                <Shield className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span>
                  <strong>Security Guarantee:</strong> AreNex will never ask for your wallet PIN, OTP, or passwords. Your payout number is strictly encrypted and protected with RLS.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-700 dark:text-gray-300 font-display font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!payoutNumber.trim()) {
                      setError("Please provide your payout account number.");
                      return;
                    }
                    handleFinishOnboarding();
                  }}
                  disabled={isPending}
                  className="w-2/3 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/25 active:scale-[0.98] disabled:opacity-50"
                >
                  <span>{isPending ? "Finalizing Setup..." : "Complete & Enter Arena"}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
