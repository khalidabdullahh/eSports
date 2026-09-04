import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft, ShieldCheck, Sparkles, Scale, AlertTriangle } from "lucide-react";
import { SupportClient } from "./support-client";

export const metadata = {
  title: "Support Desk & Help Center — ARENEX",
  description:
    "Get instant help with payment verification, room key access, tournament rules, or submit an official inquiry ticket to the AreNex operations team.",
};

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-crimson transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-gray-200 font-bold">Support Desk</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>PLAYER ASSISTANCE & HELP CENTER</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          AreNex Support Desk
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-3xl leading-relaxed font-medium">
          Official support channels, instant FAQs, and direct inquiry ticketing for payment reconciliations, room decryption assistance, and referee appeals.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5 text-brand-emerald font-bold">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            Support Agents Online
          </span>
          <span>•</span>
          <span>Average Response: &lt; 15 mins</span>
        </div>
      </div>

      {/* Urgent Match Time Callout */}
      <div className="p-4 sm:p-6 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
          <strong className="text-slate-900 dark:text-white uppercase font-display block">
            Urgent Match Room or Scoring Issue?
          </strong>
          <p>
            If a match is actively live and you require instant referee intervention, join the official Discord voice channel or submit your evidence directly to the{" "}
            <Link href="/disputes" className="text-brand-crimson font-bold underline">
              Dispute Resolution Desk
            </Link>{" "}
            within the 15-minute post-match window.
          </p>
        </div>
      </div>

      {/* Main Support Interactive Client */}
      <SupportClient />
    </div>
  );
}

