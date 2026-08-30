import Link from "next/link";
import { Users, Shield, Trophy, Plus, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeamsPage() {
  const teams = [
    {
      id: "team-nexus-alpha",
      name: "Nexus Alpha",
      tag: "NXA",
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      captain: "ALPHA〆KILLER",
      membersCount: 4,
      substitutesCount: 1,
      tournamentsPlayed: 14,
      totalWins: 5,
      status: "ACTIVE",
    },
    {
      id: "team-shadow-syndicate",
      name: "Shadow Syndicate",
      tag: "SHD",
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
      captain: "SHADOW⚡99",
      membersCount: 4,
      substitutesCount: 0,
      tournamentsPlayed: 11,
      totalWins: 3,
      status: "ACTIVE",
    },
    {
      id: "team-viper-vanguard",
      name: "Viper Vanguard",
      tag: "VVG",
      logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
      captain: "VIPER✿QUEEN",
      membersCount: 4,
      substitutesCount: 1,
      tournamentsPlayed: 9,
      totalWins: 2,
      status: "ACTIVE",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              ORGANIZATIONS & CLANS
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Competitive Teams & Rosters
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your competitive clan roster, assign captains and substitutes, and register for 4v4 squad tournaments
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-brand-crimson/25 transition-all font-display">
          <Plus className="w-3.5 h-3.5" />
          Create Team Roster
        </button>
      </div>

      {/* Roster Locking Rule Alert */}
      <div className="p-4 rounded-xl bg-surface-100 border border-surface-border flex items-start gap-3 text-xs text-gray-300">
        <Shield className="w-4 h-4 text-brand-crimson shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase font-mono tracking-wider">
            Roster Snapshot Protocol:
          </span>
          <p className="mt-0.5 text-gray-400 leading-relaxed">
            When registration closes for a squad tournament, the team roster is permanently snapshotted into an immutable table. Roster substitutions after registration close are disabled by default and require elevated admin approval with an immutable audit log entry.
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-surface-100 border border-surface-border hover:border-surface-borderLight transition-all space-y-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <img
                src={t.logo}
                alt={t.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-surface-border"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-white">{t.name}</h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold bg-surface-elevated px-1.5 py-0.5 rounded">
                    [{t.tag}]
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Captain: <strong className="text-gray-200">{t.captain}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-surface-200 text-center font-mono text-xs">
              <div>
                <span className="text-gray-500 block text-[10px]">Starters</span>
                <span className="font-bold text-white">{t.membersCount}</span>
              </div>
              <div className="border-x border-surface-border">
                <span className="text-gray-500 block text-[10px]">Subs</span>
                <span className="font-bold text-white">{t.substitutesCount}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Trophies</span>
                <span className="font-bold text-amber-400">{t.totalWins} 🏆</span>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs">
              <Badge variant="emerald">Roster Locked</Badge>
              <Link
                href={`/tournaments?format=SQUAD`}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                Enter Squad Cup <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
