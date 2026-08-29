"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [freeFireUid, setFreeFireUid] = useState("");
  const [inGameName, setInGameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
          <Trophy className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl font-black text-white uppercase tracking-tight">
          Create Player Profile
        </h1>
        <p className="text-xs text-gray-400">
          Register with your official Free Fire UID to participate in competitive cash cups
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-4">
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-gray-300 block mb-1">
              Full Name / Display Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahat Islam"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm focus:border-cyan-400 focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-300 block mb-1">
              Free Fire In-Game Name (IGN) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ALPHA〆KILLER"
              value={inGameName}
              onChange={(e) => setInGameName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm focus:border-cyan-400 focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-300 block mb-1">
              Free Fire UID (8-10 Digits) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1098234871"
              value={freeFireUid}
              onChange={(e) => setFreeFireUid(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-300 block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="player@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-300 block mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 text-sm font-bold uppercase tracking-wider font-mono"
          >
            Create Verified Profile
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline font-bold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
