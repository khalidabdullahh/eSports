"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  Trophy,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  UserCheck,
  Flame,
  Swords,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo: string;
  captain: string;
  members: string[];
  substitute: string;
  tournamentsPlayed: number;
  totalWins: number;
  winRate: string;
  tier: string;
  status: "ACTIVE" | "LOCKED";
}

export function TeamsClient() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team-nexus-alpha",
      name: "Nexus Alpha",
      tag: "NXA",
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      captain: "ALPHA〆KILLER",
      members: ["ALPHA〆KILLER", "NXA・VORTEX", "NXA・GHOST", "NXA・BLAZE"],
      substitute: "NXA・RESERVE",
      tournamentsPlayed: 14,
      totalWins: 5,
      winRate: "35.7%",
      tier: "TIER 1 ELITE",
      status: "ACTIVE",
    },
    {
      id: "team-shadow-syndicate",
      name: "Shadow Syndicate",
      tag: "SHD",
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
      captain: "SHADOW⚡99",
      members: ["SHADOW⚡99", "SHD・NIGHT", "SHD・RAVEN", "SHD・VIPER"],
      substitute: "SHD・SUB",
      tournamentsPlayed: 11,
      totalWins: 3,
      winRate: "27.2%",
      tier: "TIER 1",
      status: "ACTIVE",
    },
    {
      id: "team-viper-vanguard",
      name: "Viper Vanguard",
      tag: "VVG",
      logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
      captain: "VIPER✿QUEEN",
      members: ["VIPER✿QUEEN", "VVG・VENOM", "VVG・COBRA", "VVG・STRIKE"],
      substitute: "VVG・DRAKE",
      tournamentsPlayed: 9,
      totalWins: 2,
      winRate: "22.2%",
      tier: "TIER 2",
      status: "ACTIVE",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    tag: "",
    captain: "",
    member2: "",
    member3: "",
    member4: "",
    substitute: "",
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.tag || !newTeam.captain) return;

    const created: Team = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      tag: newTeam.tag.toUpperCase(),
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
      captain: newTeam.captain,
      members: [
        newTeam.captain,
        newTeam.member2 || "Starter 2",
        newTeam.member3 || "Starter 3",
        newTeam.member4 || "Starter 4",
      ],
      substitute: newTeam.substitute || "Sub 1",
      tournamentsPlayed: 0,
      totalWins: 0,
      winRate: "0.0%",
      tier: "ROOKIE CLAN",
      status: "ACTIVE",
    };

    setTeams([created, ...teams]);
    setIsModalOpen(false);
    setNewTeam({
      name: "",
      tag: "",
      captain: "",
      member2: "",
      member3: "",
      member4: "",
      substitute: "",
    });
  };

  return (
    <div className="space-y-8">
      {/* Roster Controls & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold">
            OFFICIAL CLAN DIRECTORY
          </span>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
            Registered Competitive Rosters ({teams.length})
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Clan Roster</span>
        </button>
      </div>

      {/* Roster Locking Rule Alert */}
      <div className="p-4 sm:p-6 rounded-2xl bg-surface-100 border border-surface-border flex items-start gap-3.5 shadow-sm">
        <Shield className="w-5 h-5 text-brand-crimson shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
          <strong className="text-slate-900 dark:text-white uppercase font-display block">
            Roster Snapshot Protocol:
          </strong>
          <p>
            When registration closes for a squad tournament, the team roster is permanently snapshotted into an immutable PostgreSQL ledger. Substitutions after registration close are disabled by default and require elevated referee approval.
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-surface-100 border border-surface-border hover:border-brand-crimson/40 transition-all space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.logo}
                    alt={t.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-surface-border"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                        {t.name}
                      </h3>
                      <span className="text-xs font-mono text-cyan-400 font-bold bg-surface-200 px-1.5 py-0.5 rounded border border-surface-border">
                        [{t.tag}]
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-gray-400 mt-0.5">
                      <Crown className="w-3 h-3 text-brand-gold" />
                      <span>{t.captain}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                  {t.tier}
                </span>
              </div>

              {/* Roster Members */}
              <div className="p-3 rounded-xl bg-surface-200/60 border border-surface-border space-y-1.5 text-xs font-sans">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-gray-400 font-bold block">
                  Active Starters (4)
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-800 dark:text-gray-200 font-semibold">
                  {t.members.map((m, idx) => (
                    <span key={idx} className="truncate">
                      • {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-200 text-center font-mono text-xs">
                <div>
                  <span className="text-slate-500 dark:text-gray-400 block text-[10px]">Played</span>
                  <span className="font-bold text-slate-900 dark:text-white">{t.tournamentsPlayed}</span>
                </div>
                <div className="border-x border-surface-border">
                  <span className="text-slate-500 dark:text-gray-400 block text-[10px]">Booyahs</span>
                  <span className="font-bold text-amber-400">{t.totalWins} 🏆</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-gray-400 block text-[10px]">Win Rate</span>
                  <span className="font-bold text-brand-emerald">{t.winRate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
              <Badge variant="emerald">Roster Verified</Badge>
              <Link
                href="/tournaments?format=SQUAD"
                className="text-brand-crimson font-mono font-bold hover:underline flex items-center gap-1 text-xs"
              >
                <span>Enter Squad Cup</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-100 border border-surface-border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-crimson" />
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase">
                  Register Clan Roster
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-surface-200 hover:bg-surface-50 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono font-bold uppercase text-slate-700 dark:text-gray-300 text-[10px]">
                    Clan / Team Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Predators"
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono font-bold uppercase text-slate-700 dark:text-gray-300 text-[10px]">
                    Clan Tag (3-4 Letters)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. APX"
                    value={newTeam.tag}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, tag: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white uppercase focus:outline-none focus:border-brand-crimson"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono font-bold uppercase text-slate-700 dark:text-gray-300 text-[10px]">
                  Team Captain IGN & UID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAPTAIN_LEADER (UID: 123456789)"
                  value={newTeam.captain}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, captain: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-mono font-bold uppercase text-slate-700 dark:text-gray-300 text-[10px]">
                    Starter 2
                  </label>
                  <input
                    type="text"
                    placeholder="Player 2 IGN"
                    value={newTeam.member2}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, member2: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono font-bold uppercase text-slate-700 dark:text-gray-300 text-[10px]">
                    Starter 3
                  </label>
                  <input
                    type="text"
                    placeholder="Player 3 IGN"
                    value={newTeam.member3}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, member3: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono font-bold uppercase text-slate-700 dark:text-gray-300 text-[10px]">
                    Starter 4
                  </label>
                  <input
                    type="text"
                    placeholder="Player 4 IGN"
                    value={newTeam.member4}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, member4: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono font-bold uppercase text-slate-700 dark:text-gray-300 text-[10px]">
                  Substitute Player (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Substitute IGN"
                  value={newTeam.substitute}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, substitute: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-50 text-slate-700 dark:text-gray-300 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-md shadow-brand-crimson/25"
                >
                  Confirm & Save Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
