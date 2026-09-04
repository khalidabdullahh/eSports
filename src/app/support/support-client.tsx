"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function DiscordIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function SupportClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [category, setCategory] = useState("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "PAYMENT",
    message: "",
  });

  const faqs = [
    {
      cat: "payment",
      q: "My bKash/Nagad TrxID was submitted, how long does approval take?",
      a: "Carrier payments are typically verified within 5 to 15 minutes by our automated double-entry ledger desk. During high-volume tournament rush hours, manual verification takes a maximum of 30 minutes. You can check your registration status anytime on your Player Dashboard.",
    },
    {
      cat: "room",
      q: "Where do I see the Room ID and Password before the match?",
      a: "Room credentials are decrypted strictly on the tournament's Match Room page (e.g. /tournaments/[id]/room) exactly 15 minutes before the scheduled start time. Ensure you have clicked 'Confirm Check-In' during the 30-minute check-in window to unlock the room gate.",
    },
    {
      cat: "gameplay",
      q: "What happens if a player disconnects during combat?",
      a: "Per Section 6 of our Rulebook, individual client-side disconnections due to device lag or personal ISP issues do not pause the match. If a global Garena server outage occurs affecting >30% of players before the first circle, referees declare a void and schedule an immediate rematch.",
    },
    {
      cat: "payout",
      q: "When and how will I receive my prize money?",
      a: "Once the 15-minute post-match dispute window closes, the tournament reaches Finalized status. The deterministic reward engine executes, and prize funds are sent directly to your registered bKash or Nagad wallet number. You will receive a carrier SMS receipt upon transfer.",
    },
    {
      cat: "account",
      q: "Can I change my registered Free Fire UID or In-Game Name?",
      a: "Yes. Navigate to your Dashboard and click 'Edit Profile & Gaming Accounts' or visit /onboarding. You can update your IGN, UID, and preferred payout wallet at any time. Ensure changes are saved prior to tournament registration.",
    },
    {
      cat: "dispute",
      q: "How do I dispute an incorrect kill or placement score?",
      a: "Go to the Dispute Resolution Desk (/disputes) within 15 minutes of match conclusion. Select your match, specify your claimed kills/placement, and upload unedited screenshot or video proof. Referees will review spectator telemetry and Carrier logs before tournament finalization.",
    },
  ];

  const filteredFaqs =
    category === "all" ? faqs : faqs.filter((f) => f.cat === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-12">
      {/* 1. Interactive Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* WhatsApp Official Channel */}
        <a
          href="https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-2xl bg-surface-100 border border-surface-border hover:border-[#25D366]/40 transition-all space-y-3 shadow-lg group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
            <WhatsAppIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase">
                WhatsApp Channel
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-sans">
              Instant match alerts, slot announcements, and official notices.
            </p>
          </div>
          <span className="inline-block text-xs font-mono font-bold text-[#25D366] group-hover:underline">
            Join Official Channel →
          </span>
        </a>

        {/* Discord Server */}
        <a
          href="https://discord.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-2xl bg-surface-100 border border-surface-border hover:border-[#5865F2]/40 transition-all space-y-3 shadow-lg group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center group-hover:scale-110 transition-transform">
            <DiscordIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase">
                Discord Community
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-sans">
              Live referee voice channels, scrim scrims, and player discussions.
            </p>
          </div>
          <span className="inline-block text-xs font-mono font-bold text-[#5865F2] group-hover:underline">
            Connect on Discord →
          </span>
        </a>

        {/* Email Helpdesk */}
        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-brand-crimson/10 text-brand-crimson flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase">
              Financial & Support Desk
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-sans">
              For transaction reconciliations and direct assistance:
            </p>
          </div>
          <a
            href="mailto:seamafridi1237890@gmail.com"
            className="font-mono text-xs text-brand-crimson font-bold block hover:underline break-all"
          >
            seamafridi1237890@gmail.com
          </a>
        </div>
      </div>

      {/* 2. Interactive Support Ticket / Inquiry Form */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="border-b border-surface-border pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-crimson font-bold">
            DIRECT INQUIRY TICKET
          </span>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
            Submit a Support Request
          </h2>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-sans">
            Need assistance with payment, room access, or account settings? Send our support team a direct ticket.
          </p>
        </div>

        {formSubmitted ? (
          <div className="p-6 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-brand-emerald mx-auto" />
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase">
              Inquiry Dispatched Successfully!
            </h3>
            <p className="text-xs text-slate-700 dark:text-gray-300 max-w-md mx-auto font-sans font-medium">
              Thank you, {formData.name || "Warrior"}. Our support operations team has received your ticket and will respond via email/SMS shortly.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="mt-2 px-4 py-2 rounded-lg bg-surface-200 hover:bg-surface-50 text-xs font-mono text-slate-800 dark:text-gray-200 border border-surface-border"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-slate-700 dark:text-gray-300 uppercase text-[11px]">
                  Your Name / Player IGN
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ALPHA_HUNTER"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold text-slate-700 dark:text-gray-300 uppercase text-[11px]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="player@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-slate-700 dark:text-gray-300 uppercase text-[11px]">
                  Contact Phone / bKash Number
                </label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold text-slate-700 dark:text-gray-300 uppercase text-[11px]">
                  Topic / Category
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-mono"
                >
                  <option value="PAYMENT">Payment Verification & TrxID</option>
                  <option value="ROOM">Room ID / Password Access</option>
                  <option value="SCORING">Score & Frag Discrepancy</option>
                  <option value="ACCOUNT">UID / Profile Settings</option>
                  <option value="OTHER">General Inquiry</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-700 dark:text-gray-300 uppercase text-[11px]">
                Detailed Description / Problem
              </label>
              <textarea
                rows={4}
                required
                placeholder="Please describe your issue, tournament title, and any relevant transaction ID..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        )}
      </div>

      {/* 3. Categorized FAQ Accordion Hub */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold">
              INSTANT ANSWERS
            </span>
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All Questions" },
              { id: "payment", label: "Payments" },
              { id: "room", label: "Room Keys" },
              { id: "gameplay", label: "Gameplay" },
              { id: "payout", label: "Payouts" },
              { id: "dispute", label: "Disputes" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                  category === tab.id
                    ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/20"
                    : "bg-surface-200 text-slate-700 dark:text-gray-300 hover:bg-surface-elevated"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-surface-200/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-brand-gold shrink-0" />
                    <span className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed border-t border-surface-border/60 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
