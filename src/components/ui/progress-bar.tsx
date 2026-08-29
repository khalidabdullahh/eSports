import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  max: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  current,
  max,
  className,
  barClassName,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / (max || 1)) * 100));

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>Slots</span>
          <span className="font-semibold text-gray-200">
            {current} / {max}
          </span>
        </div>
      )}
      <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden border border-surface-border">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            percentage >= 90
              ? "bg-red-500"
              : percentage >= 70
              ? "bg-amber-500"
              : "bg-cyan-500",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
