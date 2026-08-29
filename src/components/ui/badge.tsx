import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "live" | "crimson" | "cyan" | "gold" | "emerald" | "surface" | "outline";
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
    live: "bg-brand-crimson/20 text-brand-crimsonLight border border-brand-crimson/40",
    crimson: "bg-brand-crimson/15 text-brand-crimsonLight border border-brand-crimson/30",
    cyan: "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30",
    gold: "bg-brand-gold/15 text-brand-gold border border-brand-gold/30",
    emerald: "bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30",
    surface: "bg-surface-elevated text-gray-300 border border-surface-border",
    outline: "bg-transparent text-gray-400 border border-surface-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider font-display",
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
