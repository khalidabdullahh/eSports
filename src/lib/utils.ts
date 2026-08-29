import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer minor units (poisha / cents) into formatted currency
 * e.g. 5000 cents with 'BDT' => "৳50" or "৳50.00"
 */
export function formatCurrency(
  amountCents: number,
  currency = "BDT",
  hideDecimalsIfWhole = true
): string {
  const amount = amountCents / 100;
  const symbol = currency === "BDT" ? "৳" : "$";

  if (hideDecimalsIfWhole && Number.isInteger(amount)) {
    return `${symbol}${amount.toLocaleString()}`;
  }

  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return `${Math.max(1, diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return isoString;
  }
}
