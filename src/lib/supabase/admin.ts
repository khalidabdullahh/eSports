import { createClient } from "@supabase/supabase-js";

/**
 * Creates a privileged service-role Supabase client for administrative background tasks,
 * automated scoring disbursements, and security audit operations.
 *
 * CRITICAL SECURITY NOTICE:
 * This client bypasses Row-Level Security (RLS).
 * MUST ONLY be called inside trusted server-side code (Server Actions / Route Handlers).
 * NEVER expose to browser or client components.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION: createAdminClient() must never be executed on the client.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase administrative credentials: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in environment variables."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
