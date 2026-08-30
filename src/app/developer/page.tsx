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
  GraduationCap,
  MapPin,
  Trophy,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  BookOpen,
  GitBranch,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Khalid Abdullah (@khalidabdullahh) — Platform Architect & Lead Software Engineer | ARENEX",
  description:
    "Official developer portfolio for Khalid Abdullah. Computer Science and Engineering student at National University Dhaka, Bangladesh. Lead software engineer and platform architect of the ARENEX esports tournament ecosystem.",
};

export default function DeveloperPage() {
  const githubProjects = [
    {
      name: "eSports (ARENEX)",
      repoUrl: "https://github.com/khalidabdullahh/eSports",
      language: "TypeScript",
      languageColor: "#3178C6",
      description:
        "Full-stack, server-authoritative tournament management platform featuring live referee telemetry, deterministic scoring engines, double-entry financial ledger, and CVE-patched Next.js 15 App Router architecture.",
      badge: "Flagship Production",
    },
    {
      name: "Trading-OS",
      repoUrl: "https://github.com/khalidabdullahh/Trading-OS",
      language: "JavaScript / Pine Script",
      languageColor: "#F1E05A",
      description:
        "Algorithmic financial trading environment with custom Pine Script strategies, indicator suites, and modern analytical dashboard for active market participants.",
      badge: "Financial Tech",
    },
    {
      name: "Oops",
      repoUrl: "https://github.com/khalidabdullahh/Oops",
      language: "Python",
      languageColor: "#3572A5",
      description:
        "A deceptive multiverse platformer game. A totally fair game with mind-bending mechanics and physics puzzles.",
      badge: "Game Development",
    },
    {
      name: "khalid-digital-lab",
      repoUrl: "https://github.com/khalidabdullahh/khalid-digital-lab",
      language: "JavaScript",
      languageColor: "#F1E05A",
      description:
        "Creative developer laboratory and algorithmic sandbox exploring modern interactive UI components, state paradigms, and performance optimizations.",
      badge: "R&D Lab",
    },
    {
      name: "CV-Builder",
      repoUrl: "https://github.com/khalidabdullahh",
      language: "TypeScript / AI",
      languageColor: "#3178C6",
      description:
        "AI-Powered intelligent resume generator featuring 10 customized modern output templates and real-time live preview rendering.",
      badge: "AI Application",
    },
  ];

  const techStack = [
    { name: "Next.js 15 (App Router)", category: "Full-Stack Core", level: "Production Standard" },
    { name: "TypeScript (Strict Mode)", category: "Type Safety", level: "100% Strict / Zero Any" },
    { name: "Tailwind CSS v3", category: "Design Tokens & Dual-Theme", level: "WCAG AAA Compliant" },
    { name: "PostgreSQL 15 & Supabase", category: "Database & Security", level: "Row-Level Security" },
    { name: "Realtime WebSocket Telemetry", category: "Live Broadcast Feed", level: "Sub-Second Event Sync" },
    { name: "Double-Entry Financial Ledger", category: "Fintech Payouts", level: "Deterministic Accounting" },
    { name: "Python", category: "Systems & Game Dev", level: "Game Logic & Algorithms" },
    { name: "Pine Script", category: "Quantitative Finance", level: "Custom Trading Algorithms" },
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
        "High-speed, touch-optimized console allowing match referees to log frags, record eliminations, and publish live stats to all spectators instantly.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-crimson transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-gray-200 font-bold">Developer Profile</span>
      </div>

      {/* Hero Profile Card */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background Accent Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <img
                src="https://avatars.githubusercontent.com/u/191352772?v=4"
                alt="Khalid Abdullah"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-brand-crimson/40 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-brand-crimson text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg">
                Lead
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FOUNDER & PLATFORM ARCHITECT</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Khalid Abdullah
              </h1>
              <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-xl font-medium leading-relaxed">
                &ldquo;Computer Science student with a curiosity for Technology, Mathematics, and Problem Solving — learning, building, and exploring where ideas meet code.&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-gray-400 pt-1">
                <span className="flex items-center gap-1.5 font-semibold">
                  <GraduationCap className="w-4 h-4 text-brand-crimson" />
                  CSE • National University Dhaka
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-4 h-4 text-brand-emerald" />
                  Dhaka, Bangladesh
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Github className="w-4 h-4 text-brand-gold" />
                  @khalidabdullahh
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="https://github.com/khalidabdullahh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profile</span>
              <ExternalLink className="w-3 h-3 text-slate-500 dark:text-gray-400" />
            </a>

            <a
              href="https://github.com/khalidabdullahh/eSports"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all active:scale-[0.98]"
            >
              <Code2 className="w-4 h-4" />
              <span>eSports Repository</span>
            </a>
          </div>
        </div>

        {/* Quick Credentials Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-surface-border">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-gray-400 font-bold block">Primary Focus</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-display uppercase mt-0.5 block">
              Distributed Systems
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-gray-400 font-bold block">Platform Role</span>
            <span className="text-sm font-bold text-brand-crimson font-display uppercase mt-0.5 block">
              Lead Architect & Owner
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-gray-400 font-bold block">Code Quality</span>
            <span className="text-sm font-bold text-brand-emerald font-display uppercase mt-0.5 block">
              TypeScript Strict (0 Err)
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-gray-400 font-bold block">Academic Base</span>
            <span className="text-sm font-bold text-brand-gold font-display uppercase mt-0.5 block">
              CSE • Dhaka, BD
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: GitHub Repositories Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface-elevated text-brand-gold border border-surface-border shadow-sm">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Featured GitHub Projects
              </h2>
              <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                Verified repositories from <code className="text-brand-crimson font-bold">github.com/khalidabdullahh</code>
              </p>
            </div>
          </div>

          <a
            href="https://github.com/khalidabdullahh?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold text-brand-crimson hover:underline flex items-center gap-1"
          >
            <span>View All Repos</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {githubProjects.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3.5 shadow-lg hover:border-brand-crimson/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-crimson" />
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-lg font-bold text-slate-900 dark:text-white hover:text-brand-crimson transition-colors flex items-center gap-1.5"
                    >
                      <span>{p.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-surface-200 border border-surface-border text-slate-700 dark:text-gray-300">
                    {p.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-gray-300 font-sans leading-relaxed font-medium">
                  {p.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-border/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.languageColor }}
                  />
                  <span className="text-slate-700 dark:text-gray-300 font-semibold">{p.language}</span>
                </div>

                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-brand-crimson hover:text-brand-crimsonDark flex items-center gap-1"
                >
                  <span>Inspect Code</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Platform Engineering on AreNex */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Platform Engineering Innovations
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
              Core systems engineered by Khalid Abdullah for the AreNex tournament ecosystem.
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
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Production Tech Stack */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface-elevated text-brand-gold border border-surface-border shadow-sm">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Production Tech Stack & Tools
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
              Battle-tested tools utilized across all 32 App Router routes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-100 border border-surface-border space-y-1.5 shadow-sm"
            >
              <span className="text-[10px] font-mono uppercase text-brand-crimson font-bold tracking-wider block">
                {tech.category}
              </span>
              <h4 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                {tech.name}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-gray-400 pt-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                <span>{tech.level}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Manifesto */}
      <section className="rounded-3xl bg-surface-100 border border-surface-border p-8 sm:p-10 space-y-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
            DEVELOPER MANIFESTO
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
            Engineering for the Next Generation of Esports
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
          <p>
            &ldquo;Competitive esports should not be held back by delayed spreadsheets, manual scoring disputes, or opaque prize distributions. I architected AreNex to give emerging competitive communities the exact same level of mathematical integrity, real-time telemetry, and instant financial confidence found in tier-1 global esports leagues.&rdquo;
          </p>
          <p>
            &ldquo;From the cryptographic gate that safeguards room credentials to the deterministic engine calculating placement points and top-fragger bonuses in real time, every line of code was crafted with precision, scalability, and fairness in mind.&rdquo;
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
            className="px-6 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 hover:text-slate-950 dark:hover:text-white transition-colors shadow-sm"
          >
            View Living Brand System
          </Link>
        </div>
      </section>
    </div>
  );
}
