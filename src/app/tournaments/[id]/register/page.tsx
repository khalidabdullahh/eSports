"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerPlayerAction,
  submitPaymentAction,
} from "@/app/actions/tournament-actions";
import { formatCurrency } from "@/lib/utils";
import { ARENEX_BKASH_RECIPIENT_NUMBER } from "@/lib/constants";
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

  const bKashNumber = ARENEX_BKASH_RECIPIENT_NUMBER;

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

      // 2. Fetch User, Game Account, and Existing Registration
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const [profRes, gameRes, regRes] = await Promise.all([
          supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
          supabase.from("game_accounts").select("in_game_name, game_uid").eq("user_id", user.id).limit(1).maybeSingle(),
          supabase
            .from("tournament_registrations")
            .select("id, slot_number, status")
            .eq("tournament_id", tournamentId)
            .eq("user_id", user.id)
            .maybeSingle(),
        ]);

        setPlayerIdentity({
          displayName: profRes.data?.display_name || user.email?.split("@")[0] || "Warrior",
          inGameName: gameRes.data?.in_game_name || "ALPHA〆KILLER",
          gameUid: gameRes.data?.game_uid || "1098234871",
        });

        if (regRes.data) {
          setRegisteredSlot(regRes.data.slot_number);
          setRegisteredId(regRes.data.id);
          if (
            regRes.data.status === "PAYMENT_SUBMITTED" ||
            regRes.data.status === "APPROVED" ||
            regRes.data.status === "CHECKED_IN"
          ) {
            setStep("confirmed");
          } else {
            setStep("payment");
          }
        }
      }
    }

    loadData();
  }, [tournamentId]);

  const entryFeeCents = tournament?.entry_fee_cents ?? 5000;
  const currency = tournament?.currency || "BDT";
  const isFreeCup = entryFeeCents === 0;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(ARENEX_BKASH_RECIPIENT_NUMBER);
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
      setError("Please enter the 10-digit transaction ID (TrxID) from your bKash SMS or app.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await submitPaymentAction(
        tournamentId,
        registeredId || "",
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <Link
        href={`/tournaments/${tournamentId}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Tournament Details</span>
      </Link>

      <div className="rounded-3xl bg-surface-100 border border-surface-border p-5 sm:p-8 space-y-6 shadow-2xl">
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

        {/* STEP 2: AUTHENTIC bKASH PAYMENT UI */}
        {step === "payment" && (
          <form onSubmit={handleSubmitPayment} className="space-y-6 animate-fadeIn">
            {/* bKash Header Bar */}
            <div className="rounded-2xl overflow-hidden border border-[#e2136e]/40 shadow-xl bg-surface-200">
              {/* Official Pink Header */}
              <div className="bg-[#e2136e] px-5 py-3.5 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-display font-black text-[#e2136e] text-lg shadow-sm">
                    ৳
                  </div>
                  <div>
                    <span className="font-display font-black text-sm tracking-wider uppercase block">
                      bKash Payment
                    </span>
                    <span className="text-[10px] text-white/80 font-mono">
                      Secure Transaction Portal
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-mono font-bold tracking-wider">
                  Slot #{registeredSlot || 1}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Account Details & Amount */}
                <div className="p-4 rounded-xl bg-surface-100 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-gray-400 font-bold block">
                      বিকাশ একাউন্ট নাম্বার (bKash Number)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg sm:text-xl font-black text-[#e2136e] tracking-wider">
                        {ARENEX_BKASH_RECIPIENT_NUMBER}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Number"}</span>
                    </button>

                    <div className="text-right pl-3 border-l border-surface-border">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-gray-400 font-bold block">
                        অ্যামাউন্ট (Amount)
                      </span>
                      <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                        {formatCurrency(entryFeeCents, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-xl bg-surface-100 border border-surface-border/80 space-y-2 text-xs font-mono text-slate-600 dark:text-gray-300">
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    কিভাবে পেমেন্ট করবেন (Payment Instructions):
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-gray-400">
                    <li>বিকাশ অ্যাপে <strong>Send Money</strong> অথবা <strong>Payment</strong> সিলেক্ট করুন।</li>
                    <li>প্রাপক নাম্বারে দিন: <strong className="text-[#e2136e] font-bold">{ARENEX_BKASH_RECIPIENT_NUMBER}</strong></li>
                    <li>টুর্নামেন্ট ফি <strong className="text-slate-900 dark:text-white">{formatCurrency(entryFeeCents, currency)}</strong> সেন্ড করুন।</li>
                    <li>বিকাশ কনফার্মেশন থেকে ১০-সংখ্যার <strong>Transaction ID (TrxID)</strong> কপি করে নিচের বক্সে দিন।</li>
                  </ol>
                </div>

                {/* Input Fields */}
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                      Transaction ID (TrxID) দিন *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BL92A8ZK91"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl bg-surface-100 border-2 border-surface-border focus:border-[#e2136e] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none font-mono font-bold uppercase tracking-widest transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                      সেন্ডার বিকাশ নাম্বার (ঐচ্ছিক / Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 017XXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-surface-border focus:border-[#e2136e] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none font-mono font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 rounded-xl bg-[#e2136e] hover:bg-[#c90f61] text-white font-display font-black text-xs uppercase tracking-widest shadow-lg shadow-[#e2136e]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  <span>{isPending ? "যাচাই করা হচ্ছে..." : "পেমেন্ট নিশ্চিত করুন (Confirm Payment)"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
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
