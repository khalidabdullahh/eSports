"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alpha@nexusops.gg");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
          <Trophy className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl font-black text-white uppercase tracking-tight">
          Warrior Login
        </h1>
        <p className="text-xs text-gray-400">
          Enter your credentials to access your tournaments and match room keys
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-gray-300 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-300 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-surface-border text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 text-sm font-bold uppercase tracking-wider font-mono"
          >
            Authenticate Account
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline font-bold">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
