import { PricingCards } from "./sections/PricingCards";
import { FAQ } from "./sections/FAQ";

export default function PricingPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-16 text-center">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
          Pricing
        </p>
        <h1 className="mx-auto mt-2 max-w-2xl font-display text-[40px] font-extrabold uppercase leading-[1.02] tracking-tight">
          Fixed pricing. No surprises.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] text-ink-500">
          Start free. Upgrade only if you outgrow it — Pro and Business are launching soon.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <PricingCards />
      </section>
      <FAQ />
    </div>
  );
}
