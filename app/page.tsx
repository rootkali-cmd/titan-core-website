import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pb-12 pt-24 sm:px-6">
      <section className="mx-auto w-full max-w-4xl text-center animate-fade-up">
        <p className="text-sm uppercase tracking-[0.28em] text-orange-300/90">PUBG MOBILE</p>
        <h1 className="font-display mt-4 text-5xl font-black tracking-[0.2em] text-white sm:text-7xl">TITAN CORE</h1>
        <p className="mt-4 text-base text-slate-200 sm:text-lg">PUBG MOBILE Competitive Team</p>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
          فريق تنافسي احترافي يبحث عن لاعبين ملتزمين للتدريب، البطولات، وصناعة إنجازات ثابتة داخل ساحة المنافسة.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/apply"
            className="button-glow inline-flex min-w-52 justify-center rounded-full bg-orange-500 px-7 py-3 text-base font-bold text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            التقديم للانضمام
          </Link>
          <Link
            href="/rules"
            className="inline-flex min-w-52 justify-center rounded-full border border-white/25 bg-black/35 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-orange-400/70 hover:text-white"
          >
            قواعد الفريق/البطولة
          </Link>
        </div>
      </section>
    </main>
  );
}
