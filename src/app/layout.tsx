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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('arenex_theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-gray-100 antialiased selection:bg-brand-crimson selection:text-white font-sans">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
