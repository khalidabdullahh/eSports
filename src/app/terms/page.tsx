import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, AlertCircle, Scale, FileText, Lock, Sparkles } from "lucide-react";

export const metadata = {
  title: "Terms of Service — ARENEX",
  description:
    "Official Terms of Service, user agreements, skill gaming compliance, entry fee policies, and legal framework governing the AreNex platform.",
};

export default function TermsPage() {
  const sections = [
    {
      num: "01",
      title: "Platform Acceptance & Scope",
      content:
        "By accessing, registering on, or entering competitions hosted on AreNex (accessible via arenex.gg, esports-jade.vercel.app, and associated subdomains), you agree to be bound by these Terms of Service, the Official Competitive Rulebook, and our Privacy Policy. If you do not agree to these terms, you must discontinue platform use immediately.",
    },
    {
      num: "02",
      title: "Legality of Skill-Based Esports Competitions",
      content:
        "All tournaments, cups, and scrims hosted on AreNex are strictly skill-based competitive sports contests. Outcomes are determined entirely by player mechanical skill, game sense, reaction time, and in-game strategic coordination. AreNex does not offer or facilitate games of chance, gambling, betting, or lotteries under any jurisdiction.",
    },
    {
      num: "03",
      title: "Account Eligibility & Free Fire UID Binding",
      content:
        "Users must be at least 13 years of age (or legal age in their jurisdiction) to create an account. You agree to provide true and accurate identification, including your valid Free Fire Player UID and In-Game Name (IGN). Impersonation, account sharing, selling registered slots, or playing under another individual's credentials will result in instant account termination and tournament disqualification.",
    },
    {
      num: "04",
      title: "Entry Fees, Payments & Slot Reservation",
      content:
        "Tournament entry fees are collected via authorized mobile financial services (bKash, Nagad, Rocket). Upon submitting payment, you must provide the carrier Transaction ID (TrxID) for double-entry ledger reconciliation. Once a slot is confirmed and the registration deadline closes, entry fees are non-refundable, except in the event of an unresolvable server cancellation declared by tournament administrators.",
    },
    {
      num: "05",
      title: "Deterministic Prize Disbursement",
      content:
        "Tournament prize pools and performance bonuses are calculated and disbursed strictly according to published deterministic mathematical formulas. All prize distributions are credited to verified user payout profiles (bKash/Nagad) following the conclusion of the mandatory 15-minute post-match dispute window.",
    },
    {
      num: "06",
      title: "Fair Play, Anti-Cheat & Disqualification Penalties",
      content:
        "AreNex maintains a zero-tolerance policy against hacking, third-party APK injection, radar scripts, wallhacks, auto-aim, macro automation, and match fixing/teaming. Any player found violating fair play protocols will forfeit all accumulated prize balances, incur a permanent hardware UID ban, and may be reported to competitive community registries.",
    },
    {
      num: "07",
      title: "Intellectual Property & Game Publisher Disclaimer",
      content:
        "AreNex is an independent competitive esports tournament organization and software platform. AreNex is not affiliated with, endorsed by, or sponsored by Garena, Free Fire, or any third-party game developer. Free Fire and related trademarks belong to their respective copyright holders.",
    },
    {
      num: "08",
      title: "Limitation of Liability & Jurisdiction",
      content:
        "AreNex shall not be held liable for match losses, player disconnects, device battery failures, ISP outages, or third-party game server outages. These terms are governed in accordance with the laws of Bangladesh. Any dispute arising out of or in connection with the platform shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-crimson transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-gray-200 font-bold">Terms of Service</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <Scale className="w-3.5 h-3.5" />
          <span>LEGAL FRAMEWORK & USER AGREEMENT</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Terms of Service
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-3xl leading-relaxed font-medium">
          Please review these terms carefully before entering competitions, registering game credentials, or initiating financial transactions on the AreNex platform.
        </p>

        <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-gray-400">
          Last Updated: September 04, 2026 • Version 2.1
        </div>
      </div>

      {/* Legal Highlight Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-surface-200/70 border border-surface-border flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-brand-emerald shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
          <strong className="text-slate-900 dark:text-white uppercase font-display block">
            Pure Skill-Based Competition Guarantee
          </strong>
          <p>
            AreNex operates under deterministic rules of mechanical skill and strategy. We never host games of chance, random luck draws, or casino gambling. All prize payouts are derived mathematically from verified player performance.
          </p>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-6">
        {sections.map((s, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border space-y-3 shadow-lg hover:border-surface-borderLight transition-all"
          >
            <div className="flex items-center gap-3 pb-2 border-b border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson bg-brand-crimson/10 border border-brand-crimson/20 px-2.5 py-0.5 rounded-lg">
                Section {s.num}
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white uppercase">
                {s.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 font-sans leading-relaxed pt-1 font-medium">
              {s.content}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom CTA Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-surface-100 border border-surface-border text-center space-y-4 shadow-xl">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase">
          Questions About Our Terms?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-md mx-auto font-medium">
          If you have questions regarding legal compliance, tournament regulations, or account verification, reach out to our legal and support team.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/support"
            className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-crimson/25"
          >
            Contact Support Desk
          </Link>
          <Link
            href="/rules"
            className="px-6 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 transition-colors"
          >
            View Competitive Rulebook
          </Link>
        </div>
      </div>
    </div>
  );
}

