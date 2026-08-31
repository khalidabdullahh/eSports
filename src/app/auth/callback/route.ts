import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedRedirect = searchParams.get("redirect");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let targetPath = requestedRedirect || "/dashboard";

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("profile_completion_status")
            .eq("id", user.id)
            .single();

          if (!profile || !profile.profile_completion_status) {
            targetPath = "/onboarding";
          } else if (targetPath === "/onboarding") {
            targetPath = "/dashboard";
          }
        }
      } catch (err) {
        console.warn("Notice: OAuth callback profile check:", err);
      }

      // Safe base URL resolution for Vercel Previews and custom domains
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

      let baseUrl = origin;
      if (process.env.NODE_ENV === "development") {
        baseUrl = origin;
      } else if (forwardedHost) {
        const primaryHost = forwardedHost.split(",")[0].trim();
        baseUrl = `${forwardedProto}://${primaryHost}`;
      }

      return NextResponse.redirect(`${baseUrl}${targetPath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
