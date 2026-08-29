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

  const fetchCredentials = () => {
    startTransition(async () => {
      const res = await getRoomCredentialAction(tournamentId);
      if (res.success && res.credential) {
        setCredential(res.credential);
      }
    });
  };

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

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Check-in Required */}
      {!isCheckedIn && !isStaff && (
        <div className="p-6 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-5 h-5" />
            <h3 className="font-display text-lg font-bold uppercase">
              Check-In Verification Required
            </h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            All players must check in before dropping into the lobby to confirm readiness and lock the roster. Failure to check in will release your slot to reserves.
          </p>

          <Button
            onClick={handleCheckIn}
            isLoading={isPending}
            variant="gold"
            className="w-full py-3 font-bold uppercase tracking-wider text-xs"
          >
            Confirm Check-In Now
          </Button>
        </div>
      )}

      {/* Step 2: Room Decryption State */}
      {(isCheckedIn || isStaff) && credential ? (
        <div className="p-6 rounded-xl bg-cyan-950/20 border-2 border-cyan-500/40 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300">
              <Unlock className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display text-lg font-black uppercase tracking-wider">
                Room Decrypted & Authorized
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Room ID */}
            <div className="p-4 rounded-xl bg-surface-200 border border-surface-border">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">
                Custom Match Room ID
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-white">
                  {credential.room_id}
                </span>
                <button
                  onClick={() => copyText(credential.room_id, "room")}
                  className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-border text-gray-300 hover:text-white transition-colors"
                >
                  {copiedRoom ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Room Password */}
            <div className="p-4 rounded-xl bg-surface-200 border border-surface-border">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">
                Lobby Password
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-cyan-300">
                  {credential.room_password}
                </span>
                <button
                  onClick={() => copyText(credential.room_password, "pass")}
                  className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-border text-gray-300 hover:text-white transition-colors"
                >
                  {copiedPass ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-400 font-mono">
              Launch Free Fire → Custom Match → Search Room ID → Enter Password
            </p>
            <Link
              href="/live"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all shrink-0"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Watch Live Telemetry
            </Link>
          </div>
        </div>
      ) : (isCheckedIn || isStaff) && !credential ? (
        <div className="p-6 rounded-xl bg-surface-200/80 border border-surface-border text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-gray-400">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Room Locked until Scheduled Decryption
            </h3>
            <p className="text-xs text-gray-400">
              Release time: {roomReleaseTime}. Credentials will appear automatically once unlocked.
            </p>
          </div>

          <Button
            onClick={fetchCredentials}
            isLoading={isPending}
            variant="outline"
            className="text-xs uppercase font-mono"
          >
            Check Lock Status
          </Button>
        </div>
      ) : null}
    </div>
  );
}
