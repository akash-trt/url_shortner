import { Link } from "react-router-dom";
import { HeroSection } from "./sections/HeroSection";
import { MarqueeBand } from "./sections/MarqueeBand";
import { FeatureGrid } from "./sections/FeatureGrid";
import { HowItWorks } from "./sections/HowItWorks";
import { PricingCards } from "./sections/PricingCards";
import { FAQ } from "./sections/FAQ";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <MarqueeBand />
      <FeatureGrid />
      <HowItWorks />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
              Fixed pricing
            </p>
            <h2 className="mt-2 font-display text-[32px] font-extrabold uppercase tracking-tight">
              Simple plans. No surprises.
            </h2>
          </div>
          <Link to="/pricing" className="text-[13.5px] font-medium text-ink-700 hover:underline">
            Full pricing details →
          </Link>
        </div>
        <PricingCards />
      </section>

      <FAQ />

      <section className="border-t border-ink-950 bg-ink-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-16 text-center">
          <h2 className="font-display text-[30px] font-extrabold uppercase leading-tight text-paper-50 sm:text-[36px]">
            Shorten your first link
            <br />
            in the next 30 seconds.
          </h2>
          <Link
            to="/signup"
            className="inline-flex h-12 items-center justify-center rounded-[6px] bg-paper-50 px-7 text-[15px] font-medium text-ink-950 shadow-[6px_6px_0_0_rgba(251,250,247,0.25)]"
          >
            Get started for free
          </Link>
        </div>
      </section>
    </div>
  );
}
