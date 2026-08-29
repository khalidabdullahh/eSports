import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <p>
            We respect your privacy and adhere strictly to the principle of data minimization. We only collect information required for competitive verification and payout processing: username, in-game name, Free Fire UID, and transaction reference numbers.
          </p>
          <p>
            We never publicly expose personal phone numbers or payment credentials. All match room credential accesses and admin interactions are logged into an audit trail for anti-fraud purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
