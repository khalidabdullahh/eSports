import React from "react";
import Link from "next/link";
import { Users, Shield, Trophy, ArrowLeft, Sparkles, Swords, Crown } from "lucide-react";
import { TeamsClient } from "./teams-client";

export const metadata = {
  title: "Clans & Competitive Rosters — ARENEX",
  description:
    "Manage your competitive clan roster, register starters and substitutes, lock rosters for 4v4 squad tournaments, and climb the clan leaderboards on AreNex.",
};

export default function TeamsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-crimson transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-gray-200 font-bold">Competitive Clans</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>4V4 SQUAD WARFARE & CLAN INFRASTRUCTURE</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Competitive Clans & Rosters
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-3xl leading-relaxed font-medium">
          Create, verify, and manage your 4-player competitive clan roster. Lock starter lineups, assign tactical substitutes, and qualify for official 4v4 squad tournaments and regional clan leagues.
        </p>
      </div>

      {/* Interactive Clan Directory Client */}
      <TeamsClient />
    </div>
  );
}

