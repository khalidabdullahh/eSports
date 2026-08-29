import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "live" | "cyan" | "gold" | "emerald" | "surface" | "outline";
  pulse?: boolean;
}

export function Badge({
  children,
  className,
  variant = "surface",
  pulse = false,
  ...props
}: BadgeProps) {
  const variantStyles = {
    live: "bg-red-500/15 text-red-400 border border-red-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    gold: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    surface: "bg-surface-elevated text-gray-300 border border-surface-border",
    outline: "bg-transparent text-gray-400 border border-surface-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
}
