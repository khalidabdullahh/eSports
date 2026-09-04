import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, Database, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy & Data Protection Policy — ARENEX",
  description:
    "Learn how AreNex protects your gamer profile, Free Fire UID, transaction receipts, and payout information with strict PostgreSQL Row-Level Security and encryption.",
};

export default function PrivacyPage() {
  const dataMatrix = [
    {
      type: "Free Fire UID & IGN",
      purpose: "Custom room participant verification & tournament eligibility",
      storage: "Encrypted in Supabase PostgreSQL",
      visibility: "Publicly visible on tournament roster",
    },
    {
      type: "Phone & MFS Number (bKash/Nagad)",
      purpose: "Entry fee verification & prize money disbursements",
      storage: "Strict Row-Level Security (RLS) protected",
      visibility: "Private — only visible to user & Super Admin finance desk",
    },
    {
      type: "Transaction Reference (TrxID)",
      purpose: "Double-entry accounting & carrier receipt cross-checking",
      storage: "Append-only immutable financial ledger",
      visibility: "Private to user & finance desk audit logs",
    },
    {
      type: "Match Telemetry & Combat Stats",
      purpose: "Live stream overlays, leaderboard rankings, and power ratings",
      storage: "Permanent competitive archive",
      visibility: "Public on live streams and player profiles",
    },
  ];

  const sections = [
    {
      num: "01",
      title: "Data Minimization Principle",
      content:
        "AreNex operates strictly under the principle of data minimization. We only collect information essential to operate competitive tournaments, verify game accounts, and disburse cash prizes. We do not require national IDs, sensitive government documents, or credit card numbers.",
    },
    {
      num: "02",
      title: "PostgreSQL Row-Level Security (RLS)",
      content:
        "All user data stored in our Supabase PostgreSQL database is partitioned with strict Row-Level Security policies. Users can only access and modify their own records. Sensitive financial profiles (payout accounts, Carrier SMS receipts, audit journals) are accessible solely by authenticated staff with verified SUPER_ADMIN roles.",
    },
    {
      num: "03",
      title: "Cryptographic Match Room Vaulting",
      content:
        "Custom Room IDs and Passwords remain encrypted on our backend servers and are never sent to client browsers until the scheduled decryption window arrives (15 minutes before drop time). Decryption tokens are validated against verified check-in records to prevent credential leakage.",
    },
    {
      num: "04",
      title: "Zero Data Brokerage & Third-Party Selling",
      content:
        "We never sell, rent, monetize, or trade player phone numbers, gameplay telemetry, or transaction records to third-party advertisers or data brokers. Information is used exclusively for platform operations, anti-cheat detection, and customer support.",
    },
    {
      num: "05",
      title: "Cookies & Session Storage",
      content:
        "We use secure, HTTP-only authentication cookies to maintain your login session across pages. We do not use third-party cross-site tracking cookies or intrusive advertising pixels.",
    },
    {
      num: "06",
      title: "Player Data Rights & Account Deletion",
      content:
        "You retain complete rights to view, update, or export your profile information directly from your Dashboard. If you wish to permanently delete your account and associated gaming accounts, submit a request via our Support Desk.",
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
        <span className="text-slate-900 dark:text-gray-200 font-bold">Privacy Policy</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>SECURITY & DATA PROTECTION STANDARDS</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-3xl leading-relaxed font-medium">
          How AreNex collects, vaults, and protects your gaming identity, financial payout credentials, and tournament telemetry under strict PostgreSQL security protocols.
        </p>

        <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-gray-400">
          Effective: September 04, 2026 • Version 2.1
        </div>
      </div>

      {/* Data Collection Scope Table */}
      <section className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-brand-crimson">
          <Database className="w-5 h-5" />
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase">
            Data Inventory & Visibility Matrix
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-200/50 font-mono text-slate-700 dark:text-gray-300 font-bold">
                <th className="p-3">Data Field</th>
                <th className="p-3">Operational Purpose</th>
                <th className="p-3">Storage & Security</th>
                <th className="p-3">Public Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {dataMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-200/30 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 dark:text-white font-mono">
                    {row.type}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-gray-300">{row.purpose}</td>
                  <td className="p-3 text-slate-600 dark:text-gray-300 font-mono text-[11px]">
                    {row.storage}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-gray-300 font-medium">
                    {row.visibility}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Sections */}
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
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white uppercase">
                {s.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 font-sans leading-relaxed pt-1 font-medium">
              {s.content}
            </p>
          </div>
        ))}
      </div>

      {/* Security Commitment Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-200/70 border border-surface-border flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-brand-emerald shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
          <strong className="text-slate-900 dark:text-white uppercase font-display block">
            Our Commitment to Privacy
          </strong>
          <p>
            Your trust is our cornerstone. We protect player identities and financial records with enterprise-grade cryptography, double-entry audit logging, and zero data selling.
          </p>
        </div>
      </div>
    </div>
  );
}

