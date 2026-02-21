"use client";

import { usePathname } from "next/navigation";

export function SiteBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const imageUrl = isHome ? "/titan-core-home-bg.jpg?v=1" : "/titan-core-pages-bg.jpg?v=1";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#09090b]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.22),transparent_48%),radial-gradient(circle_at_bottom,rgba(148,163,184,0.16),transparent_45%)]" />
    </div>
  );
}
