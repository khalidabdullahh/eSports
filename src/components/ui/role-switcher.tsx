"use client";

import React, { useTransition } from "react";
import { switchActiveUserAction } from "@/app/actions/tournament-actions";
import { Profile } from "@/types";
import { UserCheck } from "lucide-react";

interface RoleSwitcherProps {
  currentUserId: string;
  profiles: Profile[];
}

export function RoleSwitcher({ currentUserId, profiles }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = e.target.value;
    startTransition(async () => {
      await switchActiveUserAction(nextId);
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-1.5 bg-surface-elevated/90 px-2.5 py-1 rounded-md border border-surface-border text-xs">
      <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <span className="text-gray-400 hidden sm:inline">Role:</span>
      <select
        value={currentUserId}
        onChange={handleSelect}
        disabled={isPending}
        className="bg-transparent text-gray-200 focus:outline-none cursor-pointer font-medium"
      >
        {profiles.map((p) => (
          <option key={p.id} value={p.id} className="bg-surface-elevated text-gray-200">
            {p.display_name} ({p.role})
          </option>
        ))}
      </select>
    </div>
  );
}
