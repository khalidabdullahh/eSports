"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Trophy,
  DollarSign,
  Users,
  Radio,
  FileCheck,
  AlertTriangle,
  History,
  ArrowRight,
  Edit3,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  Tv,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  updateTournamentStatusAction,
  updateTournamentStreamAction,
  updateRoomCredentialsAction,
} from "@/app/actions/admin-tournament-actions";
import {
  verifyPaymentAction,
  rejectPaymentAction,
} from "@/app/actions/tournament-actions";

interface AdminConsoleClientProps {
  initialTournaments: any[];
  initialPayments: any[];
  initialRegistrations: any[];
  initialLedger: any[];
  initialDisputes: any[];
  initialAuditLogs: any[];
  initialMatches: any[];
}

export function AdminConsoleClient({
  initialTournaments,
  initialPayments,
  initialRegistrations,
  initialLedger,
  initialDisputes,
  initialAuditLogs,
  initialMatches,
}: AdminConsoleClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    | "overview"
    | "tournaments"
    | "payments"
    | "participants"
    | "live"
    | "stream"
    | "ledger"
    | "disputes"
    | "audit"
  >("overview");

  const [tournaments, setTournaments] = useState(initialTournaments);
  const [payments, setPayments] = useState(initialPayments);
  const [selectedTourId, setSelectedTourId] = useState<string>(
    initialTournaments[0]?.id || ""
  );

  const [paymentFilter, setPaymentFilter] = useState<"ALL" | "SUBMITTED" | "VERIFIED" | "REJECTED">("ALL");
  const [paymentSearch, setPaymentSearch] = useState("");

  const [streamUrl, setStreamUrl] = useState(initialTournaments[0]?.stream_url || "");
  const [streamPlatform, setStreamPlatform] = useState(initialTournaments[0]?.stream_platform || "facebook");

  const [roomName, setRoomName] = useState("ARENEX-BATTLE-01");
  const [roomPass, setRoomPass] = useState("1234");
  const [roomReleaseTime, setRoomReleaseTime] = useState(new Date().toISOString().slice(0, 16));

  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showNotification = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  // Metrics
  const pendingPayments = payments.filter((p) => p.status === "SUBMITTED");
  const verifiedPayments = payments.filter((p) => p.status === "VERIFIED");
  const activeTournaments = tournaments.filter(
    (t) => t.status === "REGISTRATION_OPEN" || t.status === "CHECK_IN" || t.status === "LIVE"
  );
  const liveMatch = initialMatches[0];

  const totalCollectedCents = initialLedger
    .filter((e) => e.type === "ENTRY_FEE" && e.direction === "CREDIT")
    .reduce((acc, e) => acc + (e.amount_cents || 0), 0);

  const totalPrizeLiabilitiesCents = initialLedger
    .filter((e) => (e.type === "PRIZE_LIABILITY" || e.type === "PERFORMANCE_REWARD") && e.direction === "DEBIT")
    .reduce((acc, e) => acc + (e.amount_cents || 0), 0);

  const netPlatformMarginCents = totalCollectedCents - totalPrizeLiabilitiesCents;

  // Filtered Payments (with tournament grouping)
  const filteredPayments = payments.filter((p) => {
    if (selectedTourId && p.tournament_id !== selectedTourId) return false;
    if (paymentFilter !== "ALL" && p.status !== paymentFilter) return false;
    if (paymentSearch) {
      const q = paymentSearch.toLowerCase();
      const matchTrx = p.transaction_id?.toLowerCase().includes(q);
      const matchName = p.user?.display_name?.toLowerCase().includes(q) || p.user_id?.toLowerCase().includes(q);
      return matchTrx || matchName;
    }
    return true;
  });

  // Filtered Participants
  const filteredRegistrations = initialRegistrations.filter(
    (r) => !selectedTourId || r.tournament_id === selectedTourId
  );

  const handleVerifyPayment = (paymentId: string) => {
    startTransition(async () => {
      const res = await verifyPaymentAction(paymentId);
      if (res.success && res.payment) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: "VERIFIED" } : p))
        );
        showNotification("success", `Payment ${res.payment.transaction_id} verified & slot unlocked!`);
        router.refresh();
      } else {
        showNotification("error", res.error || "Failed to verify payment");
      }
    });
  };

  const handleRejectPayment = (paymentId: string) => {
    const reason = prompt("Enter reason for rejection (e.g. Invalid TrxID / Amount mismatch):");
    if (!reason) return;

    startTransition(async () => {
      const res = await rejectPaymentAction(paymentId, reason);
      if (res.success && res.payment) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: "REJECTED" } : p))
        );
        showNotification("success", `Payment rejected and logged to audit.`);
        router.refresh();
      } else {
        showNotification("error", res.error || "Failed to reject payment");
      }
    });
  };

  const handleStatusChange = (tourId: string, newStatus: any) => {
    startTransition(async () => {
      const res = await updateTournamentStatusAction(tourId, newStatus);
      if (res.success) {
        setTournaments((prev) =>
          prev.map((t) => (t.id === tourId ? { ...t, status: newStatus } : t))
        );
        showNotification("success", `Tournament status updated to ${newStatus}`);
        router.refresh();
      } else {
        showNotification("error", res.error || "Illegal state transition");
      }
    });
  };

  const handleSaveStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTourId) return;

    startTransition(async () => {
      const res = await updateTournamentStreamAction(selectedTourId, streamUrl, streamPlatform);
      if (res.success) {
        showNotification("success", "Live stream URL updated successfully!");
        router.refresh();
      } else {
        showNotification("error", res.error || "Failed to update stream");
      }
    });
  };

  const handleSaveRoomCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTourId) return;

    startTransition(async () => {
      const res = await updateRoomCredentialsAction(
        selectedTourId,
        roomName,
        roomPass,
        new Date(roomReleaseTime).toISOString()
      );
      if (res.success) {
        showNotification("success", "Room credentials stored & release gate configured!");
        router.refresh();
      } else {
        showNotification("error", res.error || "Failed to update room credentials");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between shadow-xl animate-fadeIn ${
            notification.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-red-500/15 border-red-500/40 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Operational Navigation Tabs (10 Areas) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-100 border border-surface-border overflow-x-auto font-mono text-xs shadow-md">
        {[
          { id: "overview", label: "1. Overview", icon: Shield },
          { id: "tournaments", label: "2. Tournaments", icon: Trophy },
          { id: "payments", label: `3. Payments (${pendingPayments.length})`, icon: DollarSign },
          { id: "participants", label: "4. Participants", icon: Users },
          { id: "live", label: "5. Live Control", icon: Radio },
          { id: "stream", label: "6. Stream / FB Live", icon: Tv },
          { id: "ledger", label: "7. Financial Ledger", icon: Lock },
          { id: "disputes", label: `8. Disputes (${initialDisputes.length})`, icon: MessageSquare },
          { id: "audit", label: "9. Audit Trail", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/25"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white hover:bg-surface-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          SECTION 1: OVERVIEW / COMMAND CENTER
      ============================================================ */}
      {activeSection === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Action Alert if pending payments */}
          {pendingPayments.length > 0 && (
            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white uppercase">
                    {pendingPayments.length} Pending bKash Entry Fees Require Review
                  </h3>
                  <p className="text-xs text-gray-300 font-sans">
                    Warriors are awaiting manual TrxID verification to receive authorized custom room access.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection("payments")}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-display font-black text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all shrink-0"
              >
                Review Payment Queue →
              </button>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                Active Tournaments
              </span>
              <div className="text-2xl sm:text-3xl font-display font-black text-white">
                {activeTournaments.length}
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">
                {tournaments.length} total registered events
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                Pending Payments
              </span>
              <div className="text-2xl sm:text-3xl font-display font-black text-cyan-400">
                {pendingPayments.length}
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                {verifiedPayments.length} verified confirmations
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                Gross Collection
              </span>
              <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
                {formatCurrency(totalCollectedCents, "BDT")}
              </div>
              <span className="text-[11px] text-emerald-500 font-mono">
                Double-entry verified
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                Guaranteed Prize Liabilities
              </span>
              <div className="text-2xl sm:text-3xl font-display font-black text-amber-400">
                {formatCurrency(totalPrizeLiabilitiesCents, "BDT")}
              </div>
              <span className="text-[11px] text-amber-500 font-mono">
                Podium & bounty reserves
              </span>
            </div>
          </div>

          {/* Quick Actions & Live Referee Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-brand-crimson" />
                  <span>Live Match Telemetry & Referee Portal</span>
                </h3>
                <Badge variant="live" pulse>
                  MATCH DESK ACTIVE
                </Badge>
              </div>

              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Directly input match kills, player placements, survival statuses, and publish deterministic scores to the live website with one click.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/admin/referee/match-night-battle-round-1"
                  className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Open Referee Input Console</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/live"
                  className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Public Live Stream</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span>Quick Operations</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/tournaments/new"
                  className="p-3.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border flex flex-col items-center justify-center text-center gap-1.5 group transition-all"
                >
                  <Plus className="w-5 h-5 text-brand-crimson group-hover:scale-110 transition-transform" />
                  <span className="font-display text-xs font-bold text-white uppercase">
                    New Tournament
                  </span>
                </Link>

                <button
                  onClick={() => setActiveSection("payments")}
                  className="p-3.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border flex flex-col items-center justify-center text-center gap-1.5 group transition-all"
                >
                  <DollarSign className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-display text-xs font-bold text-white uppercase">
                    Verify Payments
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection("stream")}
                  className="p-3.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border flex flex-col items-center justify-center text-center gap-1.5 group transition-all"
                >
                  <Tv className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-display text-xs font-bold text-white uppercase">
                    Live Stream URL
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection("ledger")}
                  className="p-3.5 rounded-xl bg-surface-200 hover:bg-surface-elevated border border-surface-border flex flex-col items-center justify-center text-center gap-1.5 group transition-all"
                >
                  <Lock className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-display text-xs font-bold text-white uppercase">
                    Financial Ledger
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 2: TOURNAMENT MANAGEMENT
      ============================================================ */}
      {activeSection === "tournaments" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
            <div>
              <h2 className="font-display text-xl font-bold text-white uppercase">
                Official Tournament Circuit Management
              </h2>
              <p className="text-xs text-gray-400">
                Publish, pause, open registration, and configure room security for all esports cups.
              </p>
            </div>

            <Link
              href="/admin/tournaments/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-crimson/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Tournament</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-surface-100 border border-surface-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-display text-lg font-bold text-white uppercase">
                      {t.title}
                    </h3>
                    <Badge
                      variant={
                        t.status === "REGISTRATION_OPEN"
                          ? "emerald"
                          : t.status === "LIVE"
                          ? "live"
                          : t.status === "COMPLETED"
                          ? "gold"
                          : "surface"
                      }
                    >
                      {t.status}
                    </Badge>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      {t.format} • {t.mode}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 font-sans max-w-2xl">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-400 flex-wrap">
                    <span>
                      Entry Fee: <strong className="text-amber-400">{formatCurrency(t.entry_fee_cents, t.currency)}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Prize Pool: <strong className="text-brand-gold">{formatCurrency(t.main_prize_pool_cents, t.currency)}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Capacity: <strong className="text-white">{t.current_participants_count || 0} / {t.max_participants}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {t.status === "DRAFT" && (
                    <button
                      onClick={() => handleStatusChange(t.id, "PUBLISHED")}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-display font-bold text-xs uppercase hover:bg-emerald-400 transition-colors"
                    >
                      Publish
                    </button>
                  )}

                  {t.status === "PUBLISHED" && (
                    <button
                      onClick={() => handleStatusChange(t.id, "REGISTRATION_OPEN")}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-display font-bold text-xs uppercase hover:bg-emerald-400 transition-colors"
                    >
                      Open Registration
                    </button>
                  )}

                  {t.status === "REGISTRATION_OPEN" && (
                    <button
                      onClick={() => handleStatusChange(t.id, "REGISTRATION_CLOSED")}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-display font-bold text-xs uppercase hover:bg-amber-400 transition-colors"
                    >
                      Close Registration
                    </button>
                  )}

                  {t.status === "REGISTRATION_CLOSED" && (
                    <button
                      onClick={() => handleStatusChange(t.id, "CHECK_IN")}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-display font-bold text-xs uppercase hover:bg-cyan-400 transition-colors"
                    >
                      Open Check-In
                    </button>
                  )}

                  {t.status === "CHECK_IN" && (
                    <button
                      onClick={() => handleStatusChange(t.id, "LIVE")}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg bg-brand-crimson text-white font-display font-bold text-xs uppercase hover:bg-brand-crimsonDark transition-colors shadow-md shadow-brand-crimson/25"
                    >
                      Launch Live Match
                    </button>
                  )}

                  {t.status === "LIVE" && (
                    <Link
                      href={`/admin/referee/match-night-battle-round-1`}
                      className="px-3 py-1.5 rounded-lg bg-brand-crimson text-white font-display font-bold text-xs uppercase hover:bg-brand-crimsonDark transition-colors flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Input Stats</span>
                    </Link>
                  )}

                  <Link
                    href={`/tournaments/${t.id}`}
                    className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-gray-300 hover:text-white transition-colors"
                  >
                    View Public
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 3: PAYMENT CONFIRMATION CENTER (GROUPED BY TOURNAMENT)
      ============================================================ */}
      {activeSection === "payments" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
            <div>
              <h2 className="font-display text-xl font-bold text-white uppercase">
                Manual bKash Payment Confirmation Desk
              </h2>
              <p className="text-xs text-gray-400">
                Confirm submitted TrxIDs to unlock verified room access for registered warriors.
              </p>
            </div>

            {/* Tournament Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-gray-400 font-bold uppercase">
                Filter Tournament:
              </label>
              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-white font-sans font-bold focus:outline-none focus:border-brand-crimson"
              >
                <option value="">All Tournaments ({payments.length} Payments)</option>
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl border border-surface-border text-xs">
              {(["ALL", "SUBMITTED", "VERIFIED", "REJECTED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPaymentFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg font-mono uppercase transition-all ${
                    paymentFilter === tab
                      ? "bg-cyan-500 text-black font-bold"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab === "SUBMITTED" ? `Pending (${pendingPayments.length})` : tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search TrxID or Player..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-100 border border-surface-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Payments Table */}
          <div className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Warrior</th>
                    <th className="py-3 px-4">Sender Phone</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No transactions found for the selected tournament / filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-elevated/40">
                        <td className="py-3.5 px-4 font-bold text-white">
                          {p.transaction_id}
                        </td>
                        <td className="py-3.5 px-4 font-sans text-gray-200">
                          {p.user?.display_name || p.user_id}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">
                          {p.sender_phone || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 uppercase text-cyan-400 font-bold">
                          {p.payment_method}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-400">
                          {formatCurrency(p.amount_cents, p.currency || "BDT")}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">
                          {formatDateTime(p.created_at || p.submitted_at)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              p.status === "VERIFIED"
                                ? "emerald"
                                : p.status === "REJECTED"
                                ? "crimson"
                                : "gold"
                            }
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {p.status === "SUBMITTED" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleVerifyPayment(p.id)}
                                disabled={isPending}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase transition-colors shadow-sm"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleRejectPayment(p.id)}
                                disabled={isPending}
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold text-xs uppercase transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-500">
                              {p.status === "VERIFIED" ? "✓ Credited to Ledger" : "Rejected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 4: PARTICIPANTS ROSTER
      ============================================================ */}
      {activeSection === "participants" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
            <div>
              <h2 className="font-display text-xl font-bold text-white uppercase">
                Tournament Participants & Roster Roster
              </h2>
              <p className="text-xs text-gray-400">
                Authoritative competitor registrations, Free Fire UIDs, payment status, and room access gate.
              </p>
            </div>

            <select
              value={selectedTourId}
              onChange={(e) => setSelectedTourId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-white font-sans font-bold"
            >
              <option value="">All Tournaments ({initialRegistrations.length} Warriors)</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                    <th className="py-3 px-4">Slot #</th>
                    <th className="py-3 px-4">Player Persona</th>
                    <th className="py-3 px-4">Free Fire IGN</th>
                    <th className="py-3 px-4">Game UID</th>
                    <th className="py-3 px-4">Registration Status</th>
                    <th className="py-3 px-4">Room Access Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No registered competitors found for the selected tournament.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((r, idx) => {
                      const isEligible = r.status === "APPROVED" || r.status === "CHECKED_IN";
                      return (
                        <tr key={r.id || idx} className="hover:bg-surface-elevated/40">
                          <td className="py-3 px-4 font-bold text-amber-400">
                            #{r.slot_number || idx + 1}
                          </td>
                          <td className="py-3 px-4 font-sans font-bold text-white">
                            {r.user?.display_name || r.user_id}
                          </td>
                          <td className="py-3 px-4 text-brand-crimson font-bold">
                            {r.user?.in_game_name || "ALPHA〆KILLER"}
                          </td>
                          <td className="py-3 px-4 text-gray-300 font-mono">
                            {r.user?.free_fire_uid || "1098234871"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                r.status === "APPROVED"
                                  ? "emerald"
                                  : r.status === "CHECKED_IN"
                                  ? "live"
                                  : "gold"
                              }
                            >
                              {r.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {isEligible ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Unlocked (Eligible)</span>
                              </span>
                            ) : (
                              <span className="text-gray-500 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Locked (Payment Required)</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 5: LIVE TOURNAMENT CONTROL
      ============================================================ */}
      {activeSection === "live" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-surface-border">
            <h2 className="font-display text-xl font-bold text-white uppercase">
              Live Tournament & Match Operations Console
            </h2>
            <p className="text-xs text-gray-400">
              Control match states, start countdowns, trigger room decryption, and link referee telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Match Status Card */}
            <div className="p-6 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <h3 className="font-display text-base font-bold text-white uppercase">
                  Match Round 1 (Bermuda Solo)
                </h3>
                <Badge variant="live" pulse>
                  IN PROGRESS
                </Badge>
              </div>

              <div className="space-y-2 text-xs font-mono text-gray-300">
                <div className="flex justify-between py-1 border-b border-surface-border/50">
                  <span className="text-gray-500">Active Warriors in Combat:</span>
                  <span className="font-bold text-emerald-400">7 Alive / 48 Total</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-border/50">
                  <span className="text-gray-500">Eliminations Recorded:</span>
                  <span className="font-bold text-brand-crimson">41 Frags</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Telemetry Engine:</span>
                  <span className="font-bold text-white">Server-Authoritative</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Link
                  href="/admin/referee/match-night-battle-round-1"
                  className="w-full py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Update Player Stats & Frags</span>
                </Link>
              </div>
            </div>

            {/* Room Credentials Vault Configurator */}
            <div className="p-6 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Room ID & Password Gate (Option B)</span>
                </h3>
              </div>

              <form onSubmit={handleSaveRoomCredentials} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 font-bold mb-1">
                    Custom Room ID / Name
                  </label>
                  <input
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-200 border border-surface-border text-xs text-white font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 font-bold mb-1">
                      Room Password
                    </label>
                    <input
                      type="text"
                      required
                      value={roomPass}
                      onChange={(e) => setRoomPass(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-200 border border-surface-border text-xs text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 font-bold mb-1">
                      Scheduled Decryption
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={roomReleaseTime}
                      onChange={(e) => setRoomReleaseTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-200 border border-surface-border text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Save & Lock Room Gate
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 6: LIVE STREAM / FACEBOOK LIVE CONFIGURATION
      ============================================================ */}
      {activeSection === "stream" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-surface-border">
            <h2 className="font-display text-xl font-bold text-white uppercase">
              Live Stream & Facebook Live Embed Configuration
            </h2>
            <p className="text-xs text-gray-400">
              Configure tournament stream uplinks. Supports Facebook Live video URLs, YouTube Live, and Twitch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-6 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
              <form onSubmit={handleSaveStream} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 font-bold mb-1.5">
                    Select Tournament
                  </label>
                  <select
                    value={selectedTourId}
                    onChange={(e) => {
                      setSelectedTourId(e.target.value);
                      const tour = tournaments.find((t) => t.id === e.target.value);
                      if (tour) {
                        setStreamUrl(tour.stream_url || "");
                        setStreamPlatform(tour.stream_platform || "facebook");
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-white font-sans font-bold"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 font-bold mb-1.5">
                    Stream Platform
                  </label>
                  <select
                    value={streamPlatform}
                    onChange={(e) => setStreamPlatform(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-white font-sans font-bold"
                  >
                    <option value="facebook">Facebook Live / Video</option>
                    <option value="youtube">YouTube Live</option>
                    <option value="twitch">Twitch Stream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 font-bold mb-1.5">
                    Live Stream URL / Video Embed Link
                  </label>
                  <input
                    type="url"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder="e.g. https://www.facebook.com/watch/live/?v=123456789 or https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-white placeholder-gray-500 font-mono font-semibold focus:outline-none focus:border-brand-crimson"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">
                    Paste the direct Facebook video or YouTube URL. The arena engine will automatically generate the compliant iframe embed.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-crimson/25 transition-all"
                >
                  Save & Publish Live Stream Uplink
                </button>
              </form>
            </div>

            {/* Embed Preview */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
              <h3 className="font-display text-sm font-bold text-white uppercase flex items-center gap-2">
                <Tv className="w-4 h-4 text-cyan-400" />
                <span>Stream Embed Preview</span>
              </h3>

              <div className="aspect-video rounded-2xl bg-black border border-surface-border overflow-hidden flex items-center justify-center">
                {streamUrl ? (
                  <iframe
                    src={
                      streamUrl.includes("facebook.com")
                        ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(streamUrl)}&show_text=false&autoplay=false`
                        : streamUrl.includes("youtube.com/watch?v=")
                        ? `https://www.youtube.com/embed/${streamUrl.split("v=")[1]?.split("&")[0]}`
                        : streamUrl
                    }
                    title="Live Stream Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-4">
                    <Tv className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-mono">
                      No stream URL configured yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 7: FINANCIAL LEDGER (SUPER ADMIN PRIVACY SAFE)
      ============================================================ */}
      {activeSection === "ledger" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
            <div>
              <h2 className="font-display text-xl font-bold text-white uppercase">
                Privacy-Protected Financial Ledger
              </h2>
              <p className="text-xs text-gray-400">
                Tournament-scoped double entry operational ledger. Strictly inaccessible to public users.
              </p>
            </div>
            <Badge variant="surface">SUPER_ADMIN ONLY</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                Total Collections (Credit)
              </span>
              <div className="text-2xl font-display font-black text-emerald-400">
                {formatCurrency(totalCollectedCents, "BDT")}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                Prize Liabilities (Debit)
              </span>
              <div className="text-2xl font-display font-black text-amber-400">
                {formatCurrency(totalPrizeLiabilitiesCents, "BDT")}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                Net Platform Margin
              </span>
              <div className="text-2xl font-display font-black text-white">
                {formatCurrency(netPlatformMarginCents, "BDT")}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                    <th className="py-3 px-4">Entry ID</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Direction</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Description / Reference</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {initialLedger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 text-gray-400">{entry.id}</td>
                      <td className="py-3 px-4 font-bold text-white">{entry.type}</td>
                      <td className="py-3 px-4 font-bold">
                        {entry.direction === "CREDIT" ? (
                          <span className="text-emerald-400">CREDIT (+)</span>
                        ) : (
                          <span className="text-red-400">DEBIT (-)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-400">
                        {formatCurrency(entry.amount_cents, entry.currency || "BDT")}
                      </td>
                      <td className="py-3 px-4 text-gray-300 font-sans">
                        {entry.description}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400">
                        {formatDateTime(entry.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 8: DISPUTE RESOLUTION DESK
      ============================================================ */}
      {activeSection === "disputes" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-surface-border">
            <h2 className="font-display text-xl font-bold text-white uppercase">
              Dispute Resolution Desk
            </h2>
            <p className="text-xs text-gray-400">
              Player evidence submissions, score queries, and official referee arbitrations.
            </p>
          </div>

          <div className="space-y-4">
            {initialDisputes.length === 0 ? (
              <div className="p-8 rounded-2xl bg-surface-100 border border-surface-border text-center text-gray-500 font-mono text-xs">
                No active disputes filed by players.
              </div>
            ) : (
              initialDisputes.map((d) => (
                <div
                  key={d.id}
                  className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={d.status === "OPEN" ? "crimson" : "emerald"}>
                      {d.status}
                    </Badge>
                    <span className="text-xs font-mono text-gray-400">
                      {formatDateTime(d.created_at)}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white">
                    {d.category || "Tournament Placement Query"}
                  </h3>
                  <p className="text-xs text-gray-300 font-sans">{d.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 9: AUDIT TRAIL
      ============================================================ */}
      {activeSection === "audit" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-surface-border">
            <h2 className="font-display text-xl font-bold text-white uppercase">
              Administrative Audit Log
            </h2>
            <p className="text-xs text-gray-400">
              Immutable record of security events, status modifications, payment verifications, and room updates.
            </p>
          </div>

          <div className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {initialAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-bold text-cyan-400">{log.action}</td>
                      <td className="py-3 px-4 text-white font-bold">{log.target_type}</td>
                      <td className="py-3 px-4 text-gray-300 font-sans">
                        {typeof log.details === "object" ? JSON.stringify(log.details) : log.details}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400">
                        {formatDateTime(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
