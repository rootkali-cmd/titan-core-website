"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { rulesSections } from "@/lib/rules-content";

const RULES_STORAGE_KEY = "titan-core-rules-agreed";

export function RulesPageContent() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(RULES_STORAGE_KEY) === "true";
    setAgreed(stored);
    setLoaded(true);
  }, []);

  const handleProceed = () => {
    if (!agreed) return;
    window.localStorage.setItem(RULES_STORAGE_KEY, "true");
    router.push("/apply");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
      <div className="animate-fade-in rounded-2xl border border-white/15 bg-black/45 p-5 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
        <h1 className="text-center text-2xl font-bold text-white sm:text-3xl">قواعد Titan Core</h1>
        <p className="mt-2 text-center text-sm leading-7 text-slate-300">
          اقرأ القواعد بعناية. لا يمكن إرسال طلب التقديم بدون الموافقة عليها.
        </p>

        <div className="mt-6 space-y-3">
          {rulesSections.map((section) => (
            <details
              key={section.id}
              className="group overflow-hidden rounded-xl border border-white/15 bg-black/35 open:border-orange-400/50"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-slate-100 transition hover:text-orange-200">
                {section.title}
              </summary>
              <div className="border-t border-white/10 px-5 py-4 text-sm leading-7 text-slate-300">
                <ul className="space-y-2">
                  {section.points.map((point) => (
                    <li key={point} className="relative pr-4">
                      <span className="absolute right-0 top-0 text-orange-300">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-xl border border-white/15 bg-black/30 p-4 text-sm text-slate-100">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            disabled={!loaded}
            className="mt-1 size-4 accent-orange-500"
          />
          <span>أوافق على القواعد</span>
        </label>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!agreed}
            className="button-glow inline-flex flex-1 justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            المتابعة إلى التقديم
          </button>
          <Link
            href="/"
            className="inline-flex flex-1 justify-center rounded-xl border border-white/20 bg-black/35 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-orange-400/70 hover:text-white"
          >
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
