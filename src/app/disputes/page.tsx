import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Shield, Clock, FileCheck2, Camera, CheckCircle2, ArrowRight } from "lucide-react";
import { DisputeFormClient } from "./dispute-form-client";

export const metadata = {
  title: "Dispute Resolution Desk — ARENEX",
  description:
    "Submit official match evidence, report scoring discrepancies, and request referee audits during the 15-minute post-match dispute window.",
};

export default function DisputesPublicPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-crimson transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-gray-200 font-bold">Disputes Desk</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-xs font-mono text-brand-gold font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>15-MINUTE POST-MATCH INTEGRITY WINDOW</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Dispute Resolution Desk
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-3xl leading-relaxed font-medium">
          Every match on AreNex is held to strict referee standards. If your eliminations, survival placement, or room attendance were recorded inaccurately, submit your unedited match proof below for immediate verification.
        </p>
      </div>

      {/* 3-Step Dispute Protocol Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-brand-gold">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase">1. Time Window</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
            15-Minute Limit
          </h3>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
            Claims must be filed within 15 minutes of match completion before the reward engine finalizes prize payouts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-brand-crimson">
            <Camera className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase">2. Unedited Evidence</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
            Proof Required
          </h3>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
            Attach raw, uncropped end-game scoreboards showing match UID, player kill feed, and final placement rank.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-brand-emerald">
            <Shield className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase">3. Referee Verdict</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
            Binding Audit
          </h3>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
            Referees review spectator telemetry logs, adjust points if verified, and disburse adjusted rewards deterministically.
          </p>
        </div>
      </div>

      {/* Main Dispute Submission Form */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-surface-border pb-4 space-y-1">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase">
            File Match Dispute
          </h2>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-sans">
            Please fill out all fields accurately to enable fast referee cross-checking.
          </p>
        </div>

        <DisputeFormClient />
      </div>
    </div>
  );
}

