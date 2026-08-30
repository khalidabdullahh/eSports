"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Shield,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { createTournamentAction } from "@/app/actions/admin-tournament-actions";
import { TournamentFormat } from "@/types";

export default function AdminNewTournamentPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [gameName, setGameName] = useState("Free Fire Battle Royale");
  const [format, setFormat] = useState<TournamentFormat>("SOLO");
  const [mode, setMode] = useState("Bermuda Battle Royale (Solo)");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [entryFeeBdt, setEntryFeeBdt] = useState("50");
  const [mainPrizeBdt, setMainPrizeBdt] = useState("1500");
  const [perfPrizeBdt, setPerfPrizeBdt] = useState("500");
  const [maxParticipants, setMaxParticipants] = useState("48");

  // Dates
  const now = new Date();
  const defaultRegOpen = new Date(now.getTime() + 10 * 60 * 1000).toISOString().slice(0, 16);
  const defaultRegClose = new Date(now.getTime() + 6 * 3600 * 1000).toISOString().slice(0, 16);
  const defaultStart = new Date(now.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 16);

  const [registrationOpenAt, setRegistrationOpenAt] = useState(defaultRegOpen);
  const [registrationCloseAt, setRegistrationCloseAt] = useState(defaultRegClose);
  const [scheduledStartAt, setScheduledStartAt] = useState(defaultStart);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a tournament title.");
      return;
    }

    const feeCents = Math.round(parseFloat(entryFeeBdt || "0") * 100);
    const mainPrizeCents = Math.round(parseFloat(mainPrizeBdt || "0") * 100);
    const perfPrizeCents = Math.round(parseFloat(perfPrizeBdt || "0") * 100);
    const maxParts = parseInt(maxParticipants, 10);

    if (maxParts <= 0 || isNaN(maxParts)) {
      setError("Maximum participants must be a positive integer.");
      return;
    }

    startTransition(async () => {
      const res = await createTournamentAction({
        title: title.trim(),
        gameName,
        format,
        mode: mode.trim(),
        description: description.trim() || `Official competitive ${gameName} tournament operated by AreNex.`,
        bannerUrl: bannerUrl.trim() || undefined,
        entryFeeCents: feeCents,
        mainPrizePoolCents: mainPrizeCents,
        performanceRewardPoolCents: perfPrizeCents,
        currency: "BDT",
        maxParticipants: maxParts,
        registrationOpenAt: new Date(registrationOpenAt).toISOString(),
        registrationCloseAt: new Date(registrationCloseAt).toISOString(),
        scheduledStartAt: new Date(scheduledStartAt).toISOString(),
      });

      if (!res.success) {
        setError(res.error || "Failed to create tournament");
        return;
      }

      router.push("/admin/tournaments");
      router.refresh();
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Back Link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Operations Portal</span>
      </Link>

      {/* Header */}
      <div className="border-b border-surface-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-brand-crimson font-bold mb-1">
          <Shield className="w-4 h-4" />
          <span>ADMINISTRATIVE TOURNAMENT GENERATOR</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Create New Tournament
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-sans">
          Configure competitive parameters, guaranteed prize allocation, and schedule for official circuit release.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-5 shadow-xl">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand-crimson" />
            <span>1. Core Identification & Format</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Tournament Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Free Fire Night Battle — Solo Championship"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                  Esports Game
                </label>
                <select
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-sans font-medium"
                >
                  <option value="Free Fire Battle Royale">Free Fire Battle Royale</option>
                  <option value="PUBG Mobile">PUBG Mobile</option>
                  <option value="Mobile Legends: Bang Bang">Mobile Legends</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                  Tournament Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as TournamentFormat)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-medium"
                >
                  <option value="SOLO">Solo (Battle Royale)</option>
                  <option value="DUO">Duo (2v2)</option>
                  <option value="SQUAD">Squad (4v4)</option>
                  <option value="LONE_WOLF">Lone Wolf (1v1)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                  Mode / Map Details
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bermuda Classic Solo"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Description & Special Guidelines
              </label>
              <textarea
                rows={3}
                placeholder="Competitive guidelines, room release instructions, emulator policies, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-medium"
              />
            </div>
          </div>
        </div>

        {/* 2. Financial Economics & Capacity */}
        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-5 shadow-xl">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-emerald" />
            <span>2. Financial Economics & Capacity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Entry Fee (৳ BDT) *
              </label>
              <input
                type="number"
                min="0"
                step="5"
                required
                placeholder="50"
                value={entryFeeBdt}
                onChange={(e) => setEntryFeeBdt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono mt-0.5 block">
                0 for free qualifier cups
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Main Prize Pool (৳) *
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                placeholder="1500"
                value={mainPrizeBdt}
                onChange={(e) => setMainPrizeBdt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-brand-gold focus:outline-none focus:border-brand-crimson font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Performance Pool (৳) *
              </label>
              <input
                type="number"
                min="0"
                step="50"
                required
                placeholder="500"
                value={perfPrizeBdt}
                onChange={(e) => setPerfPrizeBdt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-brand-crimson focus:outline-none focus:border-brand-crimson font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono mt-0.5 block">
                Top fragger bonuses
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Max Players (Capacity) *
              </label>
              <input
                type="number"
                min="2"
                max="100"
                required
                placeholder="48"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Schedule & Official Timeline */}
        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-5 shadow-xl">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span>3. Official Timeline & Operational Windows</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Registration Opens *
              </label>
              <input
                type="datetime-local"
                required
                value={registrationOpenAt}
                onChange={(e) => setRegistrationOpenAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Registration Closes *
              </label>
              <input
                type="datetime-local"
                required
                value={registrationCloseAt}
                onChange={(e) => setRegistrationCloseAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Scheduled Match Start *
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledStartAt}
                onChange={(e) => setScheduledStartAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin"
            className="px-5 py-3 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-700 dark:text-gray-300 font-display font-semibold text-xs uppercase tracking-wider transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-brand-crimson/25 active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isPending ? "Generating Tournament..." : "Create Tournament (Draft)"}</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
