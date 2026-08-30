"use client";

import React, { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerPlayerAction,
  submitPaymentAction,
} from "@/app/actions/tournament-actions";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  Smartphone,
} from "lucide-react";

export default function TournamentRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [step, setStep] = useState<"slot" | "payment" | "confirmed">("slot");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [registeredSlot, setRegisteredSlot] = useState<number | null>(null);
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  const entryFeeCents = 5000; // ৳50.00
  const bKashNumber = "01712-345678 (Merchant / Personal)";

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
      setRegisteredSlot(res.registration?.slot_number || 49);
      setRegisteredId(res.registration?.id || null);
      setStep("payment");
    });
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError("Please enter the 10-digit transaction ID from your SMS/app");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await submitPaymentAction(
        tournamentId,
        registeredId || `reg-${tournamentId}`,
        entryFeeCents,
        paymentMethod,
        transactionId.trim(),
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
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Tournament Details
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-surface-border pb-5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-cyan-400" />
            <Badge variant="cyan">Official Registration</Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Tournament Entry Checkout
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Lock your slot and verify entry fee to receive authorized room access upon check-in
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Slot Allocation */}
        {step === "slot" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Tournament:</span>
                <span className="font-bold text-white">Night Battle — Solo Cup</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Format:</span>
                <span className="text-gray-200">Free Fire Solo Battle Royale</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Fee:</span>
                <span className="font-bold text-amber-400 text-sm">
                  {formatCurrency(entryFeeCents, "BDT")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-300 block">
                Player In-Game Identity
              </label>
              <input
                type="text"
                disabled
                value="ALPHA〆KILLER (UID: 1098234871)"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-surface-border text-gray-200 text-sm font-mono cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-500">
                Your Free Fire UID will be checked by referees in the custom match lobby.
              </p>
            </div>

            <Button
              onClick={handleLockSlot}
              isLoading={isPending}
              className="w-full py-3 text-sm font-bold uppercase tracking-wider"
            >
              Lock Slot & Proceed to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Payment Details */}
        {step === "payment" && (
          <form onSubmit={handleSubmitPayment} className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Slot #{registeredSlot || 49} Temporarily Reserved for 15 minutes</span>
              </div>
              <p className="text-gray-400">
                Complete your payment below to confirm your spot in the official roster.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-300 block">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["bkash", "nagad", "rocket"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase transition-all ${
                      paymentMethod === method
                        ? "bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20"
                        : "bg-surface-200 text-gray-300 border-surface-border hover:bg-surface-elevated"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Send Money Instructions */}
            <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-gray-400">Send Money To:</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  Exact Amount: {formatCurrency(entryFeeCents, "BDT")}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated border border-surface-border">
                <span className="font-mono text-sm text-white font-bold">{bKashNumber}</span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="p-1.5 rounded hover:bg-surface-border text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 font-mono">
                1. Open your {paymentMethod.toUpperCase()} app. <br />
                2. Select &quot;Send Money&quot; or &quot;Payment&quot; to the number above. <br />
                3. Copy the Transaction ID from the confirmation SMS or receipt.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-gray-300 block mb-1.5">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9KA827L190"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-gray-300 block mb-1.5">
                  Sender Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              className="w-full py-3 text-sm font-bold uppercase tracking-wider"
            >
              Submit Payment for Verification
            </Button>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirmed" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-black text-white uppercase">
              Payment Submitted Successfully!
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Your transaction <span className="font-mono text-cyan-300 font-bold">{transactionId}</span> has been queued for verification. The finance desk will verify your payment against the append-only ledger shortly.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                Go to Player Dashboard
              </Link>
              <Link
                href={`/tournaments/${tournamentId}/room`}
                className="px-5 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-200 text-xs font-semibold uppercase tracking-wider border border-surface-border transition-all"
              >
                Check Room Key Countdown
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
