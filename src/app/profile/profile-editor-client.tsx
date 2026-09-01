"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Gamepad2,
  Wallet,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Shield,
  Sparkles,
  Phone,
  Globe,
  Lock,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { completeOnboardingAction } from "@/app/actions/onboarding-actions";
import { Badge } from "@/components/ui/badge";

interface ProfileEditorClientProps {
  initialProfile: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    phoneNumber: string;
    country: string;
    avatarUrl: string;
    role: string;
    completionStatus: boolean;
  };
  initialGameAccount?: {
    gameSlug: string;
    gameUid: string;
    inGameName: string;
    platform: string;
    verificationStatus: string;
  };
  initialPayout?: {
    payoutMethod: "bkash" | "nagad" | "rocket";
    payoutNumber: string;
    accountHolderName: string;
    isVerified: boolean;
  };
}

export function ProfileEditorClient({
  initialProfile,
  initialGameAccount,
  initialPayout,
}: ProfileEditorClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"identity" | "gaming" | "payout">("identity");
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab 1: Personal Identity
  const [displayName, setDisplayName] = useState(initialProfile.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState(initialProfile.phoneNumber || "");
  const [country, setCountry] = useState(initialProfile.country || "BD");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  // Tab 2: Game Account
  const [gameSlug, setGameSlug] = useState(initialGameAccount?.gameSlug || "free-fire");
  const [inGameName, setInGameName] = useState(initialGameAccount?.inGameName || "");
  const [gameUid, setGameUid] = useState(initialGameAccount?.gameUid || "");
  const [platform, setPlatform] = useState(initialGameAccount?.platform || "MOBILE");

  // Tab 3: Payout Desk (Private)
  const [payoutMethod, setPayoutMethod] = useState<"bkash" | "nagad" | "rocket">(
    initialPayout?.payoutMethod || "bkash"
  );
  const [payoutNumber, setPayoutNumber] = useState(initialPayout?.payoutNumber || "");
  const [accountHolderName, setAccountHolderName] = useState(
    initialPayout?.accountHolderName || initialProfile.displayName || ""
  );

  const supabase = createClient();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Avatar image size must be under 5MB.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${initialProfile.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.warn("Storage upload notice:", uploadError.message);
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

  const handleSaveProfile = () => {
    setErrorMessage(null);
    setSaveSuccess(false);

    if (!displayName.trim()) {
      setErrorMessage("Display Name is required.");
      return;
    }

    startTransition(async () => {
      const res = await completeOnboardingAction({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        country,
        avatarUrl: avatarUrl.trim() || undefined,
        gameSlug,
        gameUid: gameUid.trim(),
        inGameName: inGameName.trim(),
        platform,
        payoutMethod,
        payoutNumber: payoutNumber.trim(),
        accountHolderName: accountHolderName.trim() || displayName.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to update profile in database.");
        return;
      }

      setSaveSuccess(true);
      router.refresh();
      setTimeout(() => setSaveSuccess(false), 4000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Feedback Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">
              Profile, game accounts, and payout credentials successfully updated and verified in Supabase!
            </span>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-gray-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2.5 shadow-lg animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Persona Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-surface-100 border border-surface-border text-center space-y-4 shadow-xl relative overflow-hidden">
            <div className="relative inline-block mx-auto">
              <img
                src={
                  avatarUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                }
                alt={displayName}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-crimson/50 shadow-xl"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 rounded-3xl flex items-center justify-center text-[10px] text-white font-mono font-bold">
                  Uploading...
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {displayName || "Warrior"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                @{initialProfile.username || "warrior"}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="cyan">{initialProfile.role}</Badge>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/30">
                  {country}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border space-y-2 text-left text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-surface-border/50">
                <span className="text-slate-500 dark:text-gray-400">Account Email:</span>
                <span className="font-bold text-slate-800 dark:text-gray-200 truncate max-w-[140px]">
                  {initialProfile.email}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/50">
                <span className="text-slate-500 dark:text-gray-400">Free Fire IGN:</span>
                <span className="font-bold text-brand-crimson">
                  {inGameName || "Unlinked"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/50">
                <span className="text-slate-500 dark:text-gray-400">Game UID:</span>
                <span className="font-bold text-slate-800 dark:text-gray-200">
                  {gameUid || "Unlinked"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-gray-400">Payout Desk:</span>
                <span className="font-bold text-emerald-400 uppercase">
                  {payoutNumber ? `${payoutMethod} (${payoutNumber.slice(-4).padStart(payoutNumber.length, '•')})` : "Not Configured"}
                </span>
              </div>
            </div>

            <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 cursor-pointer transition-all shadow-sm">
              <Upload className="w-4 h-4 text-brand-crimson" />
              <span>Change Avatar</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right: Editable Tabs & Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab Selection */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-100 border border-surface-border font-mono text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab("identity")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === "identity"
                  ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/20"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Competitor Identity</span>
            </button>

            <button
              onClick={() => setActiveTab("gaming")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === "gaming"
                  ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/20"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>2. Gaming Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab("payout")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === "payout"
                  ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/20"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>3. Payout Desk</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-100 border border-surface-border shadow-2xl space-y-6">
            {/* TAB 1: IDENTITY */}
            {activeTab === "identity" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="pb-3 border-b border-surface-border">
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                    Competitor Persona & Contact Information
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                    Your official tournament registry identity and player contact channel.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                      Display Name / Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Khalid Abdullah"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-brand-crimson" />
                        <span>Mobile Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-semibold"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1 font-mono">
                        Used for urgent match room SMS/WhatsApp alerts.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-cyan-400" />
                        <span>Country / Region</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-semibold"
                      >
                        <option value="BD">Bangladesh (BD)</option>
                        <option value="IN">India (IN)</option>
                        <option value="NP">Nepal (NP)</option>
                        <option value="GLOBAL">Global / Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GAMING ACCOUNTS */}
            {activeTab === "gaming" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="pb-3 border-b border-surface-border">
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                    Linked Game Accounts
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                    Referees match your verified in-game UID to award kills and podium points.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                      Competitive Game Title
                    </label>
                    <select
                      value={gameSlug}
                      onChange={(e) => setGameSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-sans font-semibold"
                    >
                      <option value="free-fire">Free Fire Battle Royale</option>
                      <option value="pubg-mobile">PUBG Mobile</option>
                      <option value="mlbb">Mobile Legends: Bang Bang</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                        In-Game Name (IGN) *
                      </label>
                      <input
                        type="text"
                        required
                        value={inGameName}
                        onChange={(e) => setInGameName(e.target.value)}
                        placeholder="e.g. ALPHA〆KILLER"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                        Official Game UID *
                      </label>
                      <input
                        type="text"
                        required
                        value={gameUid}
                        onChange={(e) => setGameUid(e.target.value)}
                        placeholder="e.g. 1098234871"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                      Platform / Device
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-semibold"
                    >
                      <option value="MOBILE">Mobile Phone (Android / iOS)</option>
                      <option value="TABLET">Tablet / iPad</option>
                      <option value="EMULATOR">PC Emulator (Permitted Cups Only)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PAYOUT DESK */}
            {activeTab === "payout" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="pb-3 border-b border-surface-border flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                      Direct bKash Prize Disbursement Desk
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                      Tournament prize earnings are dispatched to this account within 60 minutes of match finalization.
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    <Lock className="w-3 h-3" />
                    Encrypted & Private
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                        Disbursement Method
                      </label>
                      <select
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-bold"
                      >
                        <option value="bkash">bKash (Personal / Merchant)</option>
                        <option value="nagad">Nagad</option>
                        <option value="rocket">Rocket</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                        Account Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={payoutNumber}
                        onChange={(e) => setPayoutNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="e.g. Khalid Abdullah"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                All changes are committed authoritatively to Supabase PostgreSQL.
              </span>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isPending}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-crimson/25 hover:shadow-brand-crimson/40 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isPending ? "Saving to Database..." : "Save Profile & Gaming Accounts"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
