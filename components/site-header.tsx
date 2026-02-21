"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import clsx from "clsx";

const navItems = [
  { href: "/", label: "الرئيسية" },
  { href: "/rules", label: "القواعد" },
  { href: "/apply", label: "التقديم" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-orange-500/30 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-black tracking-[0.18em] text-white sm:text-xl">
          TITAN CORE
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70",
                  isActive
                    ? "bg-orange-500/25 text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.35)]"
                    : "text-slate-200 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
