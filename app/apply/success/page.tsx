import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "تم الإرسال",
};

export default function ApplicationSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pb-10 pt-24 sm:pt-28">
      <section className="animate-fade-up w-full max-w-2xl rounded-2xl border border-white/15 bg-black/50 p-6 text-center shadow-[0_0_55px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full border border-orange-400/60 bg-orange-500/15 animate-glow-pulse">
          <CheckCircle2 className="size-12 text-orange-300 animate-check-pop" />
        </div>

        <p className="whitespace-pre-line text-lg font-bold leading-9 text-white sm:text-xl">
          {"تم التقديم بنجاح ✅\nسيتم التواصل معك خلال يومين من تاريخ التقديم.\nترقّب الواتساب الخاص بك وحسابك على التليجرام لتحديد موعد الاختبار إذا تم قبولك."}
        </p>

        <p className="mt-4 text-sm text-slate-300">
          Application submitted successfully. We will contact you within 2 days.
        </p>

        <Link
          href="/"
          className="button-glow mt-8 inline-flex rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
        >
          الرجوع للرئيسية
        </Link>
      </section>
    </main>
  );
}
