import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <p>
            NexusOps operates competitive skill-based esports tournaments. Participation is open only to players who meet minimum age requirements in their jurisdiction and comply with our fair play standards.
          </p>
          <p>
            All prize distributions and performance rewards are deterministic and calculated based on published rules. NexusOps does not offer games of chance. Winnings are disbursed via authorized mobile financial services (bKash/Nagad).
          </p>
          <p>
            NexusOps is an independent competitive platform and is not officially affiliated with or endorsed by Garena or Free Fire.
          </p>
        </div>
      </div>
    </div>
  );
}
