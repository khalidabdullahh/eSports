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

/**
 * Transforms raw stream URLs (Facebook Live, YouTube, Twitch) into compliant iframe embed URLs
 */
export function getStreamEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const cleanUrl = url.trim();

  // Facebook Live / Videos
  if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}&show_text=false&autoplay=true`;
  }

  // YouTube (watch, short, live)
  if (cleanUrl.includes("youtube.com/watch")) {
    const match = cleanUrl.match(/[?&]v=([^&]+)/);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`;
    }
  }

  if (cleanUrl.includes("youtu.be/")) {
    const videoId = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
  }

  if (cleanUrl.includes("youtube.com/live/")) {
    const videoId = cleanUrl.split("youtube.com/live/")[1]?.split("?")[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
  }

  // Twitch
  if (cleanUrl.includes("twitch.tv/")) {
    const channel = cleanUrl.split("twitch.tv/")[1]?.split("/")[0]?.split("?")[0];
    if (channel) {
      return `https://player.twitch.tv/?channel=${channel}&parent=localhost&autoplay=true&muted=true`;
    }
  }

  return cleanUrl;
}

