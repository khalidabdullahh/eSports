import Link from "next/link";
import { HelpCircle, ArrowLeft, Mail, MessageSquare, ShieldCheck } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6">
        <div className="border-b border-surface-border pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>PLAYER ASSISTANCE & DISPUTES</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            NexusOps Support Desk
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Official support channels for transaction queries, room connection delays, and referee appeals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display text-base font-bold text-white uppercase">
              Financial Desk & Inquiries
            </h3>
            <p className="text-xs text-gray-400">
              For payment verification issues or carrier SMS delays:
            </p>
            <span className="font-mono text-xs text-cyan-300 font-bold block">
              finance@nexusops.gg
            </span>
          </div>

          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-base font-bold text-white uppercase">
              Official Discord & WhatsApp
            </h3>
            <p className="text-xs text-gray-400">
              Join 12,000+ warriors for immediate custom room emergency pings:
            </p>
            <span className="font-mono text-xs text-amber-300 font-bold block">
              discord.gg/nexusops-arena
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
