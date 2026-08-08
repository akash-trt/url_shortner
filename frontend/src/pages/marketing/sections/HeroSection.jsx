import { Link } from "react-router-dom";
import { HeroShortenForm } from "@/features/links/components/HeroShortenForm";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pt-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-ink-950 px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-paper-50">
            Built for speed
          </span>
          <h1 className="mt-5 font-display text-[44px] font-extrabold uppercase leading-[0.98] tracking-tight sm:text-[58px]">
            Shorter links.
            <br />
            Bigger impact.
          </h1>
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-500">
            Create short links, track every click, and see exactly where your
            traffic comes from — down to the referrer and the second it landed.
          </p>
          <div className="mt-6 flex items-center gap-2 font-mono text-[12px] text-ink-500">
            <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
            Auto-expiry · 90 days by default
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-[6px] bg-ink-950 px-6 text-[15px] font-medium text-paper-50 shadow-[var(--shadow-hard-sm)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Get started for free
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-[6px] border border-ink-950/15 px-6 text-[15px] font-medium text-ink-950 hover:border-ink-950/30 hover:bg-paper-100"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[10px] bg-ink-950" />
          <div className="relative rounded-[10px] border border-ink-950 bg-white p-6">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
              Shorten a link
            </p>
            <div className="mt-4">
              <HeroShortenForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
