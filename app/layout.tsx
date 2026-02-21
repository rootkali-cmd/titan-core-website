import type { Metadata } from "next";
import { Cairo, Orbitron } from "next/font/google";

import { SiteBackground } from "@/components/site-background";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Titan Core",
    template: "%s | Titan Core",
  },
  description: "Titan Core PUBG MOBILE Competitive Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${orbitron.variable}`}>
      <body className="min-h-screen bg-[#09090b] font-sans text-slate-100 antialiased">
        <SiteBackground />
        <SiteHeader />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
