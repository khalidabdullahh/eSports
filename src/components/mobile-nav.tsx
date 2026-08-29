"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Radio, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/live", label: "Live", icon: Radio, isLive: true },
    { href: "/rankings", label: "Rankings", icon: BarChart3 },
    { href: "/dashboard", label: "Profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-200/95 backdrop-blur-lg border-t border-surface-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1.5 transition-all text-xs font-medium relative",
                isActive ? "text-cyan-400" : "text-gray-400 hover:text-gray-200"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 mb-1 transition-transform",
                    isActive && "scale-110",
                    item.isLive && "text-red-500 animate-pulse"
                  )}
                />
                {item.isLive && (
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
