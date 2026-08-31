import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "ARENEX — Where Players Compete. Legends Rise.",
  description:
    "AreNex (Arena + Next) is a next-generation competitive esports tournament platform. Discover tournaments, compete under official referee telemetry, build your verified record, and rise through performance.",
  keywords: [
    "AreNex",
    "Esports Tournament Platform",
    "Free Fire Tournament",
    "Competitive Gaming",
    "Battle Royale Cups",
    "Esports Bangladesh",
    "Live Match Telemetry",
    "bKash Esports Payouts",
  ],
  openGraph: {
    title: "ARENEX — Where Players Compete. Legends Rise.",
    description:
      "A next-generation competitive arena where players compete, prove their skill, build their reputation, and rise toward greatness.",
    type: "website",
    siteName: "ARENEX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('arenex_theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved ? (saved === 'dark') : prefersDark;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-slate-900 dark:text-gray-100 antialiased font-sans">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
