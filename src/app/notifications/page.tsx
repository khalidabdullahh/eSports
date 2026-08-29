import { dataStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { Bell, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  const currentUser = dataStore.getCurrentUser();
  const notifications = dataStore.getNotifications(currentUser.id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h1 className="font-display text-2xl font-black text-white uppercase">
              Notifications & Alerts
            </h1>
          </div>
          <span className="text-xs font-mono text-gray-500">
            {notifications.length} Unread
          </span>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{n.title}</span>
                <span className="text-[10px] font-mono text-gray-500">
                  {formatDateTime(n.created_at)}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
              {n.link_url && (
                <div className="pt-1">
                  <Link
                    href={n.link_url}
                    className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
