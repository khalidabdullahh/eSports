"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  checkInPlayerAction,
  getRoomCredentialAction,
} from "@/app/actions/tournament-actions";
import { RoomCredential } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  Clock,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface RoomGateClientProps {
  tournamentId: string;
  registrationId?: string;
  registrationStatus?: string;
  isStaff: boolean;
  roomReleaseTime: string;
}

export function RoomGateClient({
  tournamentId,
  registrationId,
  registrationStatus,
  isStaff,
  roomReleaseTime,
}: RoomGateClientProps) {
  const [credential, setCredential] = useState<RoomCredential | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(
    registrationStatus === "CHECKED_IN" || isStaff
  );
  const [copiedRoom, setCopiedRoom] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Real-time countdown timer state
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const fetchCredentials = () => {
    startTransition(async () => {
      const res = await getRoomCredentialAction(tournamentId);
      if (res.success && res.credential) {
        setCredential(res.credential);
        setError(null);
      } else if (res.error && !res.isLocked) {
        setError(res.error);
      }
    });
  };

  const handleCheckIn = () => {
    if (!registrationId) {
      setError("No valid registration found to check in");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await checkInPlayerAction(registrationId);
      if (!res.success) {
        setError(res.error || "Check-in failed");
        return;
      }
      setIsCheckedIn(true);
      fetchCredentials();
    });
  };

  // High precision countdown interval
  useEffect(() => {
    const targetMs = new Date(roomReleaseTime).getTime();

    const updateTimer = () => {
      const nowMs = Date.now();
      const diff = targetMs - nowMs;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        // Automatically fetch credentials if past target and not yet loaded
        if (!credential && (isCheckedIn || isStaff)) {
          fetchCredentials();
        }
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds, isPast: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [roomReleaseTime, credential, isCheckedIn, isStaff]);

  useEffect(() => {
    if (isCheckedIn || isStaff) {
      fetchCredentials();
    }
  }, [isCheckedIn, isStaff]);

  const copyText = (text: string, type: "room" | "pass") => {
    navigator.clipboard.writeText(text);
    if (type === "room") {
      setCopiedRoom(true);
      setTimeout(() => setCopiedRoom(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Check-in Required */}
      {!isCheckedIn && !isStaff && (
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-5 h-5" />
            <h3 className="font-display text-lg font-bold uppercase">
              Check-In Verification Required
            </h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            All players must check in before dropping into the lobby to confirm readiness and lock the roster. Failure to check in will release your slot to reserves.
          </p>

          <Button
            onClick={handleCheckIn}
            isLoading={isPending}
            variant="gold"
            className="w-full py-3.5 font-bold uppercase tracking-wider text-xs"
          >
            Confirm Check-In Now
          </Button>
        </div>
      )}

      {/* Step 2: Room Decryption State */}
      {(isCheckedIn || isStaff) && credential ? (
        <div className="p-6 rounded-2xl bg-cyan-950/25 border-2 border-cyan-500/40 space-y-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-cyan-300">
              <Unlock className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display text-lg font-black uppercase tracking-wider">
                Room Decrypted & Authorized
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Official Match Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Room ID */}
            <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">
                Custom Match Room ID
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider">
                  {credential.room_id}
                </span>
                <button
                  onClick={() => copyText(credential.room_id, "room")}
                  className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-border text-xs font-mono font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  {copiedRoom ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Room Password */}
            <div className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">
                Lobby Password
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-cyan-300 tracking-wider">
                  {credential.room_password}
                </span>
                <button
                  onClick={() => copyText(credential.room_password, "pass")}
                  className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-border text-xs font-mono font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  {copiedPass ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Pass</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-cyan-500/20">
            <p className="text-[11px] text-gray-400 font-mono">
              Launch Free Fire → Custom Match → Search Room ID → Enter Password
            </p>
            <Link
              href="/live"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all shrink-0"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Watch Live Telemetry
            </Link>
          </div>
        </div>
      ) : (isCheckedIn || isStaff) && !credential ? (
        /* Real-time Countdown Gate View */
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-200/90 border border-surface-border text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-center mx-auto text-cyan-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
              Cryptographic Time Gate Active
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Room Locked until Scheduled Decryption
            </h3>
            <p className="text-xs text-gray-400 font-sans max-w-md mx-auto leading-relaxed">
              Room credentials will automatically decrypt for your verified account the instant the timer reaches zero.
            </p>
          </div>

          {/* Tactical Digital Countdown Clock */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 font-mono">
            {countdown.days > 0 && (
              <div className="p-3 sm:p-4 rounded-2xl bg-surface-100 border border-surface-border min-w-[70px] sm:min-w-[85px]">
                <span className="font-display text-2xl sm:text-4xl font-black text-white block">
                  {pad(countdown.days)}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-500">Days</span>
              </div>
            )}
            <div className="p-3 sm:p-4 rounded-2xl bg-surface-100 border border-surface-border min-w-[70px] sm:min-w-[85px]">
              <span className="font-display text-2xl sm:text-4xl font-black text-white block">
                {pad(countdown.hours)}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500">Hours</span>
            </div>
            <span className="font-display text-2xl font-black text-cyan-400">:</span>
            <div className="p-3 sm:p-4 rounded-2xl bg-surface-100 border border-surface-border min-w-[70px] sm:min-w-[85px]">
              <span className="font-display text-2xl sm:text-4xl font-black text-cyan-400 block">
                {pad(countdown.minutes)}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500">Mins</span>
            </div>
            <span className="font-display text-2xl font-black text-cyan-400">:</span>
            <div className="p-3 sm:p-4 rounded-2xl bg-surface-100 border border-surface-border min-w-[70px] sm:min-w-[85px]">
              <span className="font-display text-2xl sm:text-4xl font-black text-brand-crimson block animate-pulse">
                {pad(countdown.seconds)}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500">Secs</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={fetchCredentials}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-gray-300 hover:text-white transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isPending ? "animate-spin" : ""}`} />
              <span>{isPending ? "Checking Vault..." : "Check Lock Status"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
