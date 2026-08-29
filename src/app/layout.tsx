import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "NexusOps — Premium Dark Esports Tournament Platform",
  description:
    "Join, compete, perform, and earn in high-stakes Free Fire and multi-game esports tournaments with real-time referee telemetry, automated financial ledger tracking, and instant verifiable payouts.",
  openGraph: {
    title: "NexusOps — Premium Dark Esports Tournament Platform",
    description:
      "Automated deterministic scoring, live referee telemetry, protected room credentials, and transparent prize pools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-gray-100 antialiased selection:bg-cyan-500 selection:text-black font-sans">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
