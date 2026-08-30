import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-side Supabase client with SSR cookie awareness
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "demo-anon-key";

  return createBrowserClient(supabaseUrl, supabaseKey);
}
