"use client";

import React, { useState } from "react";
import { ArenexLogo } from "@/components/brand/arenex-logo";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Trophy,
  ShieldCheck,
  Radio,
  Flame,
  Download,
  Share2,
  Sparkles,
  Layers,
  Palette,
  Type,
  MessageSquare,
} from "lucide-react";

export default function BrandGuidelinesPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const brandColors = [
    {
      name: "Electric Crimson (Primary)",
      hex: "#FF1E44",
      rgb: "255, 30, 68",
      role: "High-impact competitive battle accent (5% visual volume)",
      bgClass: "bg-[#FF1E44]",
      textColor: "text-white",
    },
    {
      name: "Apex Ruby",
      hex: "#E11D48",
      rgb: "225, 29, 72",
      role: "Secondary competitive accent, active states, hover glows",
      bgClass: "bg-[#E11D48]",
      textColor: "text-white",
    },
    {
      name: "Championship Gold",
      hex: "#F59E0B",
      rgb: "245, 158, 11",
      role: "Podium 1st prize pools, championship badges, trophy indicators",
      bgClass: "bg-[#F59E0B]",
      textColor: "text-black",
    },
    {
      name: "Victory Emerald",
      hex: "#10B981",
      rgb: "16, 185, 129",
      role: "Match verification, alive indicators, check-in completion",
      bgClass: "bg-[#10B981]",
      textColor: "text-black",
    },
    {
      name: "Deep Arena Surface",
      hex: "#0D111A",
      rgb: "13, 17, 26",
      role: "Secondary elevated cards and panels (15% visual volume)",
      bgClass: "bg-[#0D111A]",
      textColor: "text-white",
      border: true,
    },
    {
      name: "Pitch Black Foundation",
      hex: "#07090E",
      rgb: "7, 9, 14",
      role: "Base background canvas across all pages (80% visual volume)",
      bgClass: "bg-[#07090E]",
      textColor: "text-white",
      border: true,
    },
  ];

  const microcopyExamples = [
    { context: "Tournament Discovery", copy: "Enter the Arena", purpose: "Replaces generic 'View Tournament'" },
    { context: "Live Match Broadcast", copy: "The Battle Is Live", purpose: "Replaces generic 'Match Running'" },
    { context: "Slot Reservation", copy: "Claim Your Spot", purpose: "Replaces generic 'Register'" },
    { context: "Mandatory Check-In", copy: "Confirm Your Place", purpose: "Replaces generic 'Verify Attendance'" },
    { context: "Protected Room Key", copy: "The Arena Opens Soon", purpose: "Replaces generic 'Key Locked'" },
    { context: "Match Imminent", copy: "Your Battle Begins Soon", purpose: "Replaces generic 'Starts in 10m'" },
    { context: "Power Rankings", copy: "Earn Your Position", purpose: "Replaces generic 'Leaderboard'" },
    { context: "Final Results", copy: "The Numbers Are In", purpose: "Replaces generic 'Match Over'" },
    { context: "Winner Podium", copy: "A Champion Rises", purpose: "Replaces generic 'Winner Announced'" },
    { context: "Empty State", copy: "The Next Battle Is Coming", purpose: "Replaces generic 'No events found'" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="border-b border-surface-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/15 border border-brand-crimson/30 text-xs font-mono text-brand-crimsonLight">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL BRAND SYSTEM & GUIDELINES</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            ARENEX Brand Identity
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl font-sans">
            Comprehensive design tokens, logo system, color architecture, typography scales, and voice principles defining the AreNex competitive ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-surface-100 border border-surface-border text-xs font-mono">
            <span className="text-gray-400 block">Version</span>
            <span className="text-white font-bold">2.0 • Production</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-100 border border-surface-border text-xs font-mono">
            <span className="text-gray-400 block">Tagline</span>
            <span className="text-brand-crimsonLight font-bold">Where Players Compete. Legends Rise.</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: LOGO SYSTEM */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase">1. Logo System</h2>
            <p className="text-xs text-gray-400">Official vector marks designed with geometric arena cuts and rising diagonal momentum.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Horizontal Lockup */}
          <div className="p-8 rounded-2xl bg-surface-100 border border-surface-border flex flex-col items-center justify-between min-h-[220px]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-6">
              Horizontal Lockup (Primary)
            </span>
            <div className="my-auto">
              <ArenexLogo variant="full" size="lg" showTagline />
            </div>
            <span className="text-[10px] text-gray-500 font-mono mt-6">
              Header, Navbar, Hero, Primary UI
            </span>
          </div>

          {/* Card 2: Stacked Lockup */}
          <div className="p-8 rounded-2xl bg-surface-100 border border-surface-border flex flex-col items-center justify-between min-h-[220px]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-6">
              Stacked Lockup
            </span>
            <div className="my-auto">
              <ArenexLogo variant="stacked" size="lg" showTagline />
            </div>
            <span className="text-[10px] text-gray-500 font-mono mt-6">
              Splash screens, posters, tournament banners
            </span>
          </div>

          {/* Card 3: Symbol / Monogram & Monochrome */}
          <div className="p-8 rounded-2xl bg-surface-100 border border-surface-border flex flex-col items-center justify-between min-h-[220px]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-6">
              Monogram & Monochrome
            </span>
            <div className="my-auto flex items-center gap-8">
              <div className="text-center">
                <ArenexLogo variant="symbol" size="lg" />
                <span className="text-[9px] text-gray-400 font-mono block mt-2">App Icon</span>
              </div>
              <div className="text-center">
                <ArenexLogo variant="monochrome" size="lg" />
                <span className="text-[9px] text-gray-400 font-mono block mt-2">Monochrome</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-mono mt-6">
              Favicons, mobile app icons, stream watermarks
            </span>
          </div>
        </div>

        {/* Logo Rules Bar */}
        <div className="p-5 rounded-xl bg-surface-200/90 border border-surface-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <strong className="text-white block font-mono uppercase mb-1">Clear Space</strong>
            <p className="text-gray-400">Maintain a minimum padding equal to 50% of the arena shield height on all sides.</p>
          </div>
          <div>
            <strong className="text-white block font-mono uppercase mb-1">Minimum Size</strong>
            <p className="text-gray-400">Digital screen minimum height: 24px for symbol mark, 32px for full horizontal lockup.</p>
          </div>
          <div>
            <strong className="text-brand-crimson block font-mono uppercase mb-1">Prohibited Distortions</strong>
            <p className="text-gray-400">Never rotate, skew, stretch, or alter the crimson/white dual gradient harmony.</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: COLOR ARCHITECTURE (80% / 15% / 5% RULE) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase">2. Color Architecture</h2>
            <p className="text-xs text-gray-400">The 80% / 15% / 5% formula creates a restrained, mature, high-impact dark esports experience.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandColors.map((c) => (
            <div
              key={c.hex}
              className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-3 relative group"
            >
              <div className={`h-16 w-full rounded-lg ${c.bgClass} ${c.border ? "border border-surface-border" : ""} flex items-end p-2.5 shadow-inner`}>
                <span className={`text-xs font-mono font-bold ${c.textColor}`}>{c.hex}</span>
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white uppercase">{c.name}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{c.role}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-border/60 text-[11px] font-mono text-gray-400">
                  <span>RGB: {c.rgb}</span>
                  <button
                    onClick={() => copyToClipboard(c.hex)}
                    className="inline-flex items-center gap-1 text-xs text-brand-crimsonLight hover:text-white transition-colors"
                  >
                    {copiedColor === c.hex ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: TYPOGRAPHY SYSTEM */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface-50 text-gray-300 border border-surface-borderLight">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase">3. Typography Hierarchy</h2>
            <p className="text-xs text-gray-400">Engineered for digital product speed, tournament statistics legibility, and bold competitive headlines.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-brand-crimson tracking-wider block">Display & Headings</span>
              <h3 className="font-display text-2xl font-black text-white mt-1">Rajdhani Condensed</h3>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold uppercase text-gray-200 leading-tight">
              THE ARENA IS OPEN. PROVE YOUR SKILL.
            </p>
            <p className="text-xs text-gray-400 font-sans">
              Used for tournament titles, hero headlines, badges, and callouts. Bold, geometric, and unmistakably competitive.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-brand-emerald tracking-wider block">Body & UI Text</span>
              <h3 className="font-sans text-2xl font-bold text-white mt-1">Inter System</h3>
            </div>
            <p className="font-sans text-sm text-gray-200 leading-relaxed">
              Every legend begins as a player. Clean, universally legible UI typography for rules, forms, tooltips, and receipts.
            </p>
            <p className="text-xs text-gray-400 font-sans">
              Zero visual fatigue, high contrast against dark surfaces, and native mobile rendering speed.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-brand-gold tracking-wider block">Telemetry & Stats</span>
              <h3 className="font-mono text-2xl font-bold text-white mt-1">JetBrains Mono</h3>
            </div>
            <p className="font-mono text-base text-brand-gold leading-relaxed">
              KILLS: 11 • PLACEMENT: #01 • SCORE: 23 PTS
            </p>
            <p className="text-xs text-gray-400 font-sans">
              Tabular monospace numbers for live killfeeds, referee telemetry, financial ledgers, and player UIDs.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: BRAND VOICE & MICROCOPY DICTIONARY */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase">4. Voice & Microcopy Dictionary</h2>
            <p className="text-xs text-gray-400">Short, confident, precise, and ambitious. Eliminates cheap gaming noise.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
            <strong className="text-emerald-400 font-display text-sm uppercase block tracking-wider">
              DO: Authentic Competitive Dignity
            </strong>
            <p className="text-xs text-gray-300 italic">"The arena is open. 50 players entered. One champion remains. Your performance speaks."</p>
          </div>
          <div className="p-5 rounded-xl bg-red-950/20 border border-red-800/30 space-y-2">
            <strong className="text-red-400 font-display text-sm uppercase block tracking-wider">
              DON'T: Cheap Gaming Noise
            </strong>
            <p className="text-xs text-gray-300 italic">"Hey gamers!!! Join our super awesome epic tournament now and win big bucks!!!"</p>
          </div>
        </div>

        {/* Microcopy Table */}
        <div className="rounded-xl bg-surface-100 border border-surface-border overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                <th className="py-3 px-4">Touchpoint Context</th>
                <th className="py-3 px-4">Official AreNex Microcopy</th>
                <th className="py-3 px-4">Strategic Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {microcopyExamples.map((m, idx) => (
                <tr key={idx} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-300">{m.context}</td>
                  <td className="py-3 px-4 font-bold text-brand-crimsonLight">"{m.copy}"</td>
                  <td className="py-3 px-4 text-gray-400 font-sans">{m.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: SOCIAL MEDIA TEMPLATES */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase">5. Social Media & Announcement Format</h2>
            <p className="text-xs text-gray-400">Standardized copy hierarchy for Instagram, Discord, and match day broadcasts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-3">
            <span className="text-[10px] font-mono text-brand-crimson uppercase block tracking-wider">Template 01: Cup Announcement</span>
            <div className="p-4 rounded-lg bg-surface-200 font-mono text-xs text-gray-300 space-y-2 border border-surface-border">
              <p className="font-bold text-white font-display uppercase text-sm">50 PLAYERS. ONE ARENA. ONE CHAMPION.</p>
              <p>Night Battle — Solo Cup is now open for registration.</p>
              <p className="text-brand-gold">৳1,500 Guaranteed Pool • Bermuda Solo</p>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-surface-border">ARENEX • Where Players Compete. Legends Rise.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-3">
            <span className="text-[10px] font-mono text-brand-emerald uppercase block tracking-wider">Template 02: Match Day / Live</span>
            <div className="p-4 rounded-lg bg-surface-200 font-mono text-xs text-gray-300 space-y-2 border border-surface-border">
              <p className="font-bold text-white font-display uppercase text-sm">THE ARENA IS LIVE.</p>
              <p>Round 1 dropping now. Stream uplink is live on official telemetry.</p>
              <p className="text-emerald-400">Watch the live killfeed in real-time.</p>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-surface-border">ARENEX LIVE • Follow Every Elimination.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-3">
            <span className="text-[10px] font-mono text-brand-gold uppercase block tracking-wider">Template 03: Champion Rise</span>
            <div className="p-4 rounded-lg bg-surface-200 font-mono text-xs text-gray-300 space-y-2 border border-surface-border">
              <p className="font-bold text-white font-display uppercase text-sm">A CHAMPION RISES.</p>
              <p>ALPHA〆KILLER claims 1st Place with 7 kills (19 pts).</p>
              <p className="text-brand-gold">৳500 Podium Disbursed via bKash</p>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-surface-border">ARENEX • Where Players Compete. Legends Rise.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
