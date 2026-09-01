import Link from "next/link";
import { notFound } from "next/navigation";
import { TournamentService } from "@/lib/services/tournament-service";
import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RoomGateClient } from "./room-gate-client";
import {
  Lock,
  Unlock,
  Shield,
  Clock,
  ArrowLeft,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

export default async function TournamentRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = await TournamentService.getTournamentById(id);

  if (!tournament) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const isProduction = process.env.NODE_ENV === "production";
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let userRegistration: { id: string; status: string; slot_number: number } | null = null;
  let isStaff = false;
  let displayName = "Player";
  let userRole = "USER";

  if (authUser && isSupabaseConfigured) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, role")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profile) {
      displayName = profile.display_name || authUser.email?.split("@")[0] || "Competitor";
      userRole = profile.role || "USER";
    }

    if (
      userRole === "SUPER_ADMIN" ||
      userRole === "OWNER" ||
      userRole === "TOURNAMENT_ADMIN" ||
      userRole === "REFEREE"
    ) {
      isStaff = true;
    }

    const { data: dbReg } = await supabase
      .from("tournament_registrations")
      .select("id, status, slot_number")
      .eq("tournament_id", tournament.id)
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (dbReg) {
      userRegistration = dbReg;
    }
  } else if (!isProduction) {
    const currentUser = dataStore.getCurrentUser();
    const activeUserId = authUser?.id || currentUser.id;
    displayName = currentUser.display_name;
    userRole = currentUser.role;
    isStaff =
      currentUser.role === "SUPER_ADMIN" ||
      currentUser.role === "OWNER" ||
      currentUser.role === "TOURNAMENT_ADMIN" ||
      currentUser.role === "REFEREE";

    const registrations = dataStore.getRegistrations(tournament.id);
    const mockReg = registrations.find((r) => r.user_id === activeUserId);
    if (mockReg) {
      userRegistration = {
        id: mockReg.id,
        status: mockReg.status,
        slot_number: mockReg.slot_number,
      };
    }
  }

  const isEligible = isStaff || (userRegistration && (userRegistration.status === "CHECKED_IN" || userRegistration.status === "APPROVED"));
  const isCheckedIn = userRegistration?.status === "CHECKED_IN";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        href={`/tournaments/${tournament.id}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Tournament
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-surface-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                SECURE CREDENTIAL VAULT
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
              {tournament.title} Room Access
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Custom Match credentials are cryptographically protected and released strictly to authorized checked-in players
            </p>
          </div>

          <Badge variant={isCheckedIn ? "emerald" : "gold"}>
            {isStaff ? "STAFF BYPASS ACTIVE" : isCheckedIn ? "CHECKED IN" : "CHECK-IN REQUIRED"}
          </Badge>
        </div>

        {/* User Status Card */}
        <div className="p-4 rounded-xl bg-surface-200 border border-surface-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-gray-400 block uppercase">Active Identity</span>
            <span className="font-bold text-white text-sm">
              {displayName} ({userRole})
            </span>
          </div>
          <div>
            <span className="text-gray-400 block uppercase">Registration Status</span>
            <span className="font-bold text-cyan-300 text-sm">
              {userRegistration?.status || (isStaff ? "OFFICIAL STAFF" : "NOT REGISTERED")}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block uppercase">Scheduled Decryption</span>
            <span className="font-bold text-amber-400 text-sm">
              {formatDateTime(tournament.room_release_time)}
            </span>
          </div>
        </div>

        {/* Option B: Pending Payment Confirmation Banner */}
        {userRegistration?.status === "PAYMENT_SUBMITTED" && !isStaff && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-sm uppercase">
              <Clock className="w-4 h-4" />
              <span>Payment Confirmation in Progress (Option B)</span>
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Your bKash transaction ID is currently in the Super Admin confirmation queue. Per ARENEX Option B protocol, room ID and lobby password will decrypt automatically once the Super Admin confirms your payment.
            </p>
          </div>
        )}

        {/* Unpaid / Unregistered Notice */}
        {(!userRegistration || userRegistration.status === "PENDING_PAYMENT") && !isStaff && (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-red-400 font-display font-bold text-sm uppercase">
              <Lock className="w-4 h-4" />
              <span>Payment Verification Required to Access Room</span>
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              You must register for this tournament and submit your bKash entry payment to receive authorized room access credentials.
            </p>
            <Link
              href={`/tournaments/${tournament.id}/register`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-crimson/20"
            >
              <span>Go to Tournament Registration & Payment</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        )}

        {/* Interactive Check-In & Room Credential Client */}
        {isEligible && (
          <RoomGateClient
            tournamentId={tournament.id}
            registrationId={userRegistration?.id}
            registrationStatus={userRegistration?.status}
            isStaff={isStaff}
            roomReleaseTime={tournament.room_release_time}
          />
        )}

        {/* Security Warning */}
        <div className="p-4 rounded-xl bg-surface-200/60 border border-surface-border/80 flex items-start gap-3 text-xs text-gray-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-300">Room Security Protocol:</p>
            <p className="mt-0.5 leading-relaxed">
              Sharing custom room credentials with non-registered players or spectators will result in immediate disqualification and a permanent Free Fire UID tournament ban. All access requests are logged with IP, user ID, and timestamp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
