import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ArenexLogoProps {
  variant?: "full" | "symbol" | "stacked" | "monochrome";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  linkToHome?: boolean;
}

export function ArenexLogo({
  variant = "full",
  size = "md",
  showTagline = false,
  className,
  linkToHome = false,
}: ArenexLogoProps) {
  // Size metrics
  const sizeMap = {
    sm: { symbol: 24, text: "text-lg", tagline: "text-[8px]" },
    md: { symbol: 32, text: "text-xl", tagline: "text-[9px]" },
    lg: { symbol: 42, text: "text-2xl", tagline: "text-[10px]" },
    xl: { symbol: 56, text: "text-4xl", tagline: "text-xs" },
  };

  const currentSize = sizeMap[size];
  const isMonochrome = variant === "monochrome";

  const SymbolSvg = (
    <svg
      width={currentSize.symbol}
      height={currentSize.symbol}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="ARENEX Arena Symbol"
    >
      <defs>
        <linearGradient id="arenexRedGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isMonochrome ? "#FFFFFF" : "#FF3355"} />
          <stop offset="50%" stopColor={isMonochrome ? "#E2E8F0" : "#FF1E44"} />
          <stop offset="100%" stopColor={isMonochrome ? "#94A3B8" : "#C4082B"} />
        </linearGradient>
        <linearGradient id="arenexBladeGrad" x1="16" y1="6" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isMonochrome ? "#FFFFFF" : "#FFFFFF"} />
          <stop offset="40%" stopColor={isMonochrome ? "#E2E8F0" : "#FF6B85"} />
          <stop offset="100%" stopColor={isMonochrome ? "#CBD5E1" : "#FF1E44"} />
        </linearGradient>
        <filter id="arenexGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={isMonochrome ? "#FFFFFF" : "#FF1E44"} floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Arena Boundary - Angular Shield */}
      <path
        d="M24 3L42 12V31L24 45L6 31V12L24 3Z"
        stroke={isMonochrome ? "#475569" : "#283450"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="#0A0E17"
      />

      {/* Internal Arena Battle Ring */}
      <path
        d="M24 7L38 14.5V29.5L24 40.5L10 29.5V14.5L24 7Z"
        fill="#121826"
        stroke={isMonochrome ? "#64748B" : "#FF1E44"}
        strokeWidth="1"
        strokeOpacity={isMonochrome ? "0.6" : "0.3"}
      />

      {/* Ascending "A + N" Delta Core - Representing "Arena + Next" & "Legends Rise" */}
      {/* Left Pillar (A left arm) */}
      <path
        d="M13 32L21 15L24 15L17 32H13Z"
        fill="url(#arenexRedGrad)"
      />
      
      {/* Center Rising Blade (Diagonal N slash rising to the top right) */}
      <path
        d="M19 28L31 10H36L24 35H19V28Z"
        fill="url(#arenexBladeGrad)"
        filter="url(#arenexGlow)"
      />

      {/* Right Pillar (N right boundary with upward apex cut) */}
      <path
        d="M31 15L35 15V32H31V15Z"
        fill="url(#arenexRedGrad)"
      />

      {/* Apex Core Gem */}
      <polygon
        points="24,11 27,15 24,18 21,15"
        fill={isMonochrome ? "#FFFFFF" : "#FF4D6D"}
      />
    </svg>
  );

  if (variant === "symbol") {
    const content = <div className={cn("inline-flex items-center justify-center", className)}>{SymbolSvg}</div>;
    return linkToHome ? <Link href="/" className="group inline-flex">{content}</Link> : content;
  }

  const Wordmark = (
    <div className="flex flex-col leading-none select-none">
      <div className="flex items-center tracking-wider font-display font-extrabold text-white">
        <span className={cn(currentSize.text, "tracking-[0.14em] uppercase")}>
          ARE
          <span className={isMonochrome ? "text-white" : "text-brand-crimson"}>NEX</span>
        </span>
      </div>
      {(showTagline || variant === "stacked") && (
        <span
          className={cn(
            currentSize.tagline,
            "font-sans font-semibold tracking-[0.22em] text-gray-400 uppercase mt-0.5"
          )}
        >
          Where Players Compete. Legends Rise.
        </span>
      )}
    </div>
  );

  const containerContent = (
    <div
      className={cn(
        "group flex items-center transition-opacity hover:opacity-95",
        variant === "stacked" ? "flex-col text-center gap-2" : "gap-2.5",
        className
      )}
    >
      {SymbolSvg}
      {Wordmark}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex items-center group">
        {containerContent}
      </Link>
    );
  }

  return containerContent;
}
