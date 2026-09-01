"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerPlayerAction,
  submitPaymentAction,
} from "@/app/actions/tournament-actions";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  Trophy,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  Smartphone,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function TournamentRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [step, setStep] = useState<"slot" | "payment" | "confirmed">("slot");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [registeredSlot, setRegisteredSlot] = useState<number | null>(null);
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  // Dynamic tournament & profile state
  const [tournament, setTournament] = useState<{
    id: string;
    title: string;
    mode: string;
    format: string;
    entry_fee_cents: number;
    currency: string;
  } | null>(null);

  const [playerIdentity, setPlayerIdentity] = useState<{
    displayName: string;
    inGameName: string;
    gameUid: string;
  }>({
    displayName: "Warrior",
    inGameName: "ALPHA〆KILLER",
    gameUid: "1098234871",
  });

  const bKashNumber = "01712-345678 (Official ARENEX Merchant)";

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // 1. Fetch Tournament
      const { data: tour } = await supabase
        .from("tournaments")
        .select("id, title, mode, format, entry_fee_cents, currency")
        .eq("id", tournamentId)
        .maybeSingle();

      if (tour) {
        setTournament(tour);
      } else {
        // Fallback default
        setTournament({
          id: tournamentId,
          title: "Dhaka Night Battle — Solo Cup",
          mode: "Battle Royale — Bermuda",
          format: "SOLO",
          entry_fee_cents: 5000,
          currency: "BDT",
        });
      }

      // 2. Fetch User & Game Account
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const [profRes, gameRes] = await Promise.all([
          supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
          supabase.from("game_accounts").select("in_game_name, game_uid").eq("user_id", user.id).limit(1).maybeSingle(),
        ]);

        setPlayerIdentity({
          displayName: profRes.data?.display_name || user.email?.split("@")[0] || "Warrior",
          inGameName: gameRes.data?.in_game_name || "ALPHA〆KILLER",
          gameUid: gameRes.data?.game_uid || "1098234871",
        });
      }
    }

    loadData();
  }, [tournamentId]);

  const entryFeeCents = tournament?.entry_fee_cents ?? 5000;
  const currency = tournament?.currency || "BDT";
  const isFreeCup = entryFeeCents === 0;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("01712345678");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLockSlot = () => {
    setError(null);
    startTransition(async () => {
      const res = await registerPlayerAction(tournamentId);
      if (!res.success) {
        setError(res.error || "Failed to register slot");
        return;
      }
      setRegisteredSlot(res.registration?.slot_number || 1);
      setRegisteredId(res.registration?.id || null);

      if (isFreeCup || res.registration?.status === "APPROVED") {
        setStep("confirmed");
      } else {
        setStep("payment");
      }
    });
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError("Please enter the 10-digit transaction ID from your bKash SMS or app.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await submitPaymentAction(
        tournamentId,
        registeredId || `reg-${tournamentId}`,
        entryFeeCents,
        paymentMethod,
        transactionId.trim().toUpperCase(),
        senderPhone.trim()
      );

      if (!res.success) {
        setError(res.error || "Failed to submit payment");
        return;
      }

      setStep("confirmed");
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        href={`/tournaments/${tournamentId}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Tournament Details</span>
      </Link>

      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="border-b border-surface-border pb-5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-brand-crimson" />
            <Badge variant="cyan">Official Tournament Checkout</Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {tournament?.title || "Tournament Entry Checkout"}
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-sans">
            Lock your reserved slot and verify entry fee to receive authorized custom room access.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* STEP 1: SLOT ALLOCATION */}
        {step === "slot" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-surface-200 border border-surface-border space-y-3 font-mono text-xs shadow-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Tournament Title:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {tournament?.title || "Night Battle Solo Cup"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Battle Format:</span>
                <span className="text-slate-700 dark:text-gray-200">
                  {tournament?.mode || "Battle Royale — Bermuda (Solo)"}
                </span>
              </div>
              <div className="flex justify-between border-t border-surface-border/60 pt-2">
                <span className="text-slate-500 dark:text-gray-400 font-bold">Required Entry Ticket:</span>
                <span className="font-black text-brand-crimson text-sm">
                  {isFreeCup ? "FREE (৳0.00)" : formatCurrency(entryFeeCents, currency)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-700 dark:text-gray-300 font-bold block">
                Your Verified In-Game Identity
              </label>
              <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-brand-crimson text-sm block">
                    {playerIdentity.inGameName}
                  </span>
                  <span className="text-slate-500 dark:text-gray-400">
                    Free Fire UID: <strong className="text-slate-800 dark:text-gray-200">{playerIdentity.gameUid}</strong>
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="text-[11px] text-cyan-500 hover:underline font-bold"
                >
                  Edit Profile →
                </Link>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                Referees match this verified in-game UID to validate match kills and prize payouts.
              </p>
            </div>

            <Button
              onClick={handleLockSlot}
              isLoading={isPending}
              className="w-full py-3.5 text-xs font-display font-black uppercase tracking-widest bg-brand-crimson hover:bg-brand-crimsonDark text-white shadow-xl shadow-brand-crimson/25"
            >
              {isFreeCup ? "Claim Free Entry Spot" : "Lock Slot & Proceed to bKash Payment"}
            </Button>
          </div>
        )}

        {/* STEP 2: bKASH MERCHANT PAYMENT UI */}
        {step === "payment" && (
          <form onSubmit={handleSubmitPayment} className="space-y-6 animate-fadeIn">
            {/* bKash Header Banner */}
            <div className="p-5 rounded-2xl bg-[#e2136e]/10 border border-[#e2136e]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e2136e] flex items-center justify-center font-display font-black text-white text-sm">
                    ৳
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase">
                      bKash Merchant Payment
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 font-mono">
                      Manual Merchant Confirmation Portal
                    </p>
                  </div>
                </div>
                <Badge variant="crimson">Slot #{registeredSlot || 1} Reserved</Badge>
              </div>

              {/* Account Number Card */}
              <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-gray-400 font-bold block">
                    ARENEX bKash Recipient Number
                  </span>
                  <span className="font-mono text-base font-black text-[#e2136e] tracking-wider">
                    01712-345678
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Exact Amount Notice */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-600 dark:text-gray-400">Exact Entry Amount:</span>
                <span className="font-black text-slate-900 dark:text-white text-base">
                  {formatCurrency(entryFeeCents, currency)}
                </span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-2 text-xs font-sans text-slate-700 dark:text-gray-300">
              <h4 className="font-display font-bold uppercase text-[11px] text-slate-900 dark:text-white tracking-wider">
                How to Complete Payment:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs font-mono text-slate-600 dark:text-gray-400">
                <li>Open your bKash App on your mobile device.</li>
                <li>Select <strong>Send Money</strong> or <strong>Payment</strong> to <span className="font-bold text-[#e2136e]">01712345678</span>.</li>
                <li>Enter the exact tournament entry amount (<span className="font-bold text-slate-900 dark:text-white">{formatCurrency(entryFeeCents, currency)}</span>).</li>
                <li>Copy the 10-digit <strong>Transaction ID (TrxID)</strong> from your bKash confirmation SMS or statement.</li>
                <li>Paste the TrxID below and click Submit.</li>
              </ol>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                  bKash Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BL92A8ZK91"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-bold uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                  Sender Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              className="w-full py-3.5 text-xs font-display font-black uppercase tracking-widest bg-brand-crimson hover:bg-brand-crimsonDark text-white shadow-xl shadow-brand-crimson/25"
            >
              Submit Payment for Super Admin Confirmation
            </Button>
          </form>
        )}

        {/* STEP 3: SUBMITTED CONFIRMATION & ROOM OPTION B */}
        {step === "confirmed" && (
          <div className="space-y-6 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                {isFreeCup ? "Slot Confirmed" : "Payment Verification in Progress"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {isFreeCup ? "You Are In!" : "Payment Submitted to Super Admin"}
              </h2>
              <p className="text-xs text-slate-600 dark:text-gray-300 font-sans max-w-md mx-auto leading-relaxed">
                {isFreeCup
                  ? "Your free entry spot is locked. Head to the tournament room when check-in opens."
                  : `Your transaction ID (${transactionId || "SUBMITTED"}) has been queued for Super Admin review. Per ARENEX Option B security policy, custom match room credentials unlock automatically once verified.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-200 border border-surface-border max-w-md mx-auto text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Tournament:</span>
                <span className="font-bold text-slate-900 dark:text-white">{tournament?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Confirmed Slot:</span>
                <span className="font-bold text-amber-400">#{registeredSlot || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Room Status:</span>
                <span className="font-bold text-emerald-400">
                  {isFreeCup ? "Eligible for Check-In" : "Pending Admin Approval (Option B)"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/tournaments/${tournamentId}/room`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-crimson/25 transition-all"
              >
                Go to Match Room
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-200 font-display font-bold text-xs uppercase tracking-wider transition-all"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
