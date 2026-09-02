import React from "react";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { Bell, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login?redirect=/notifications");
  }

  const { data: dbNotifs } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: false });

  const notifications = dbNotifs || [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-500" />
            <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase">
              Notifications & Alerts
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-gray-400">
            {notifications.length} Total
          </span>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface-200 border border-surface-border space-y-2">
              <Bell className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">
                No notifications right now
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                You will receive alerts here when match room details and payments update.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400">
                    {formatDateTime(n.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">{n.message}</p>
                {n.link_url && (
                  <div className="pt-1">
                    <Link
                      href={n.link_url}
                      className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
