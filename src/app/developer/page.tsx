import React from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  Cpu,
  Database,
  Layers,
  ExternalLink,
  Github,
  Mail,
  ShieldCheck,
  Trophy,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Developer Profile — Khalid Abdullah | ARENEX Platform Architect",
  description:
    "Meet Khalid Abdullah, the lead full-stack software engineer and platform architect behind the ARENEX esports tournament ecosystem.",
};

export default function DeveloperPage() {
  const techStack = [
    { name: "Next.js 15 (App Router)", category: "Frontend & Server Engine", level: "Production Standard" },
    { name: "TypeScript (Strict Mode)", category: "Type Safety & Reliability", level: "Zero Any / 100% Strict" },
    { name: "Tailwind CSS v3", category: "Design Tokens & Dual-Theme", level: "Custom Esports System" },
    { name: "PostgreSQL 15 & Supabase", category: "Database & Security", level: "RLS & Immutable Audit" },
    { name: "Realtime WebSocket Telemetry", category: "Live Broadcast", level: "Sub-second Feed" },
    { name: "Double-Entry Financial Ledger", category: "Fintech & Payouts", level: "Deterministic Math" },
  ];

  const architecturalPillars = [
    {
      title: "Strict State Machine Engine",
      icon: Layers,
      description:
        "Engineered formal linear tournament lifecycle transitions from Draft to Registration, Check-in, Live, and Finalized, rejecting invalid state jumps.",
    },
    {
      title: "Deterministic Scoring Engine",
      icon: Trophy,
      description:
        "Mathematically reproducible placement and kill point calculations with automatic podium prize (৳1,000) and top-fragger bonus (৳500) distributions.",
    },
    {
      title: "Cryptographic Room Key Gate",
      icon: Lock,
      description:
        "Custom room credentials stay encrypted on the server, unlocking strictly for checked-in competitors once the scheduled reveal time arrives.",
    },
    {
      title: "Live Referee Telemetry Console",
      icon: Zap,
      description:
        "High-speed, touch-optimized mobile/tablet console allowing referees to log frags, record eliminations, and publish live stats to all spectators instantly.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
        <Link href="/" className="hover:text-brand-crimsonLight transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-200">Developer Profile</span>
      </div>

      {/* Hero Profile Card */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background Accent Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80"
                alt="Khalid Abdullah"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-brand-crimson/60 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-brand-crimson text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow">
                Lead
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimsonLight">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FOUNDER & PLATFORM ARCHITECT</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                Khalid Abdullah
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-sans max-w-xl">
                Full-Stack Software Engineer, Systems Architect, and Esports Technologist. Creator of the AreNex tournament platform ecosystem.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="https://github.com/khalidabdullahh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-gray-200 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profile</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>

            <a
              href="https://github.com/khalidabdullahh/eSports"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
            >
              <Code2 className="w-4 h-4" />
              <span>Project Repository</span>
            </a>
          </div>
        </div>

        {/* Quick Credentials Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-surface-border/80">
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Primary Focus</span>
            <span className="text-sm font-bold text-white font-display uppercase mt-0.5 block">
              Distributed Systems
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Platform Role</span>
            <span className="text-sm font-bold text-brand-crimson font-display uppercase mt-0.5 block">
              Lead Architect & Owner
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Code Standard</span>
            <span className="text-sm font-bold text-brand-emerald font-display uppercase mt-0.5 block">
              TypeScript Strict
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Location</span>
            <span className="text-sm font-bold text-brand-gold font-display uppercase mt-0.5 block">
              Bangladesh • Global
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Architectural Innovations */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
              Platform Engineering & Architecture
            </h2>
            <p className="text-xs text-gray-400">
              Core systems designed and engineered by Khalid Abdullah for the AreNex ecosystem.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {architecturalPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3 shadow-lg hover:border-brand-crimson/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-200 text-brand-crimson border border-surface-border">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Technical Stack Breakdown */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface-elevated text-brand-gold border border-surface-border">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
              Production Tech Stack & Tools
            </h2>
            <p className="text-xs text-gray-400">
              Battle-tested tools utilized across all 32 App Router routes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-100 border border-surface-border space-y-1.5"
            >
              <span className="text-[10px] font-mono uppercase text-brand-crimson tracking-wider block">
                {tech.category}
              </span>
              <h4 className="font-display text-base font-bold text-white uppercase">
                {tech.name}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                <span>{tech.level}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Mission & Personal Philosophy */}
      <section className="rounded-3xl bg-surface-100 border border-surface-border p-8 sm:p-10 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-semibold">
            DEVELOPER MANIFESTO
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Engineering for the Next Generation of Esports
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
          <p>
            &quot;Competitive esports should not be held back by delayed spreadsheets, manual scoring disputes, or opaque prize distributions. I architected AreNex to give emerging competitive communities the exact same level of mathematical integrity, real-time telemetry, and instant financial confidence found in tier-1 global esports leagues.&quot;
          </p>
          <p>
            &quot;From the cryptographic gate that safeguards room credentials to the deterministic engine calculating placement points and top-fragger bonuses in real time, every line of code was crafted with precision, scalability, and fairness in mind.&quot;
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Link
            href="/tournaments"
            className="px-6 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
          >
            <span>Explore Tournaments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/brand"
            className="px-6 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-gray-200 hover:text-white transition-colors"
          >
            View Living Brand System
          </Link>
        </div>
      </section>
    </div>
  );
}
