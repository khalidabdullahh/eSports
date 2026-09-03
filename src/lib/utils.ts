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

export interface StreamEmbedOptions {
  autoplay?: boolean;
  muted?: boolean;
  hostname?: string;
}

/**
 * Validates and transforms public stream URLs (Facebook Live/Video, YouTube, Twitch)
 * into standard compliant iframe embed URLs.
 */
export function getStreamEmbedUrl(
  url?: string | null,
  options: StreamEmbedOptions = {}
): string | null {
  if (!url || typeof url !== "string") return null;
  let cleanUrl = url.trim();
  if (!cleanUrl) return null;

  // Add https:// protocol if missing
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  const { autoplay = true, muted = true, hostname } = options;

  // 1. FACEBOOK (Live, Public Videos, Watch, Reels, fb.watch, plugin URLs)
  if (
    cleanUrl.includes("facebook.com") ||
    cleanUrl.includes("fb.watch") ||
    cleanUrl.includes("fb.gg")
  ) {
    // If it's already a Facebook video plugin URL, sanitize and preserve query
    if (cleanUrl.includes("facebook.com/plugins/video.php")) {
      try {
        const parsed = new URL(cleanUrl);
        const href = parsed.searchParams.get("href");
        if (href) {
          return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(href)}&show_text=false&autoplay=${autoplay ? "true" : "false"}&allowfullscreen=true`;
        }
      } catch {
        return cleanUrl;
      }
    }

    // Normalize mobile and subdomains to standard www.facebook.com
    let normalizedFbUrl = cleanUrl
      .replace(/^https?:\/\/(m|mobile|web|touch|mbasic)\.facebook\.com/i, "https://www.facebook.com")
      .replace(/^https?:\/\/fb\.me\//i, "https://www.facebook.com/");

    // Strip volatile tracking parameters that interfere with Facebook's oEmbed engine
    try {
      const parsed = new URL(normalizedFbUrl);
      const searchParams = new URLSearchParams(parsed.search);
      // Remove common mobile tracking params
      searchParams.delete("mibextid");
      searchParams.delete("rdid");
      searchParams.delete("ref");
      searchParams.delete("fbclid");
      searchParams.delete("__tn__");
      searchParams.delete("eid");

      const remainingSearch = searchParams.toString();
      normalizedFbUrl = `${parsed.origin}${parsed.pathname}${remainingSearch ? `?${remainingSearch}` : ""}`;
    } catch {
      // Keep normalized URL if parsing fails
    }

    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      normalizedFbUrl
    )}&show_text=false&autoplay=${autoplay ? "true" : "false"}&allowfullscreen=true`;
  }

  // 2. YOUTUBE (watch, live, shorts, youtu.be, embed)
  if (
    cleanUrl.includes("youtube.com") ||
    cleanUrl.includes("youtu.be") ||
    cleanUrl.includes("youtube-nocookie.com")
  ) {
    // Regex matches 11-char YouTube Video ID across all formats:
    // youtube.com/watch?v=ID, youtu.be/ID, youtube.com/live/ID, youtube.com/shorts/ID, youtube.com/embed/ID
    const ytRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|live\/|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = cleanUrl.match(ytRegex);

    if (match && match[1]) {
      const videoId = match[1];
      const autoPlayVal = autoplay ? 1 : 0;
      const muteVal = muted ? 1 : 0;
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlayVal}&mute=${muteVal}&playsinline=1&rel=0&enablejsapi=1`;
    }
  }

  // 3. TWITCH (Channels & VOD Videos)
  if (cleanUrl.includes("twitch.tv")) {
    const parentDomains = ["localhost", "127.0.0.1", "arenex.gg", "esports-jade.vercel.app", "vercel.app"];
    if (hostname && !parentDomains.includes(hostname)) {
      parentDomains.push(hostname);
    }
    const parentQuery = parentDomains.map((d) => `parent=${encodeURIComponent(d)}`).join("&");

    // Check for Twitch Video / VOD: twitch.tv/videos/123456789
    const videoMatch = cleanUrl.match(/twitch\.tv\/videos\/(\d+)/i);
    if (videoMatch && videoMatch[1]) {
      return `https://player.twitch.tv/?video=${videoMatch[1]}&${parentQuery}&autoplay=${autoplay}&muted=${muted}`;
    }

    // Check for Twitch Channel: twitch.tv/channel_name
    const channelMatch = cleanUrl.match(/twitch\.tv\/([a-zA-Z0-9_]{3,25})/i);
    if (channelMatch && channelMatch[1] && channelMatch[1].toLowerCase() !== "videos") {
      return `https://player.twitch.tv/?channel=${channelMatch[1]}&${parentQuery}&autoplay=${autoplay}&muted=${muted}`;
    }
  }

  // 4. Fallback for custom HTTPS stream embeds
  if (cleanUrl.startsWith("https://") && (cleanUrl.includes("/embed") || cleanUrl.includes("/player"))) {
    return cleanUrl;
  }

  return null;
}

/**
 * Validates whether a given livestream URL is supported and can be converted into an embed.
 */
export function validateLivestreamUrl(url?: string | null): {
  isValid: boolean;
  platform?: "facebook" | "youtube" | "twitch" | "custom";
  embedUrl?: string;
  error?: string;
} {
  if (!url || !url.trim()) {
    return { isValid: false, error: "Please enter a livestream URL." };
  }

  const embedUrl = getStreamEmbedUrl(url, { autoplay: false });
  if (!embedUrl) {
    return {
      isValid: false,
      error:
        "Unsupported or invalid stream URL. Please provide a valid Facebook Live/Video, YouTube (watch/live), or Twitch channel link.",
    };
  }

  let platform: "facebook" | "youtube" | "twitch" | "custom" = "custom";
  if (embedUrl.includes("facebook.com")) platform = "facebook";
  else if (embedUrl.includes("youtube.com")) platform = "youtube";
  else if (embedUrl.includes("twitch.tv")) platform = "twitch";

  return { isValid: true, platform, embedUrl };
}


