import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const faqs = [
  {
    q: "Do links expire?",
    a: "Yes — by default every link expires 90 days after creation. You can extend or remove the expiry from the link's detail page at any time.",
  },
  {
    q: "Can I use my own alias instead of a random code?",
    a: "Yes. When you create a link, add a custom alias (letters, numbers, - and _) and we'll use that instead of generating one.",
  },
  {
    q: "What happens if I disable a link?",
    a: "Disabled links stop redirecting immediately — visitors get a 410 instead of your destination — but the link and its click history stay in your dashboard, and you can re-enable it any time.",
  },
  {
    q: "Is click data sampled or approximate?",
    a: "No. Every click is written to the database via an async queue, so nothing is dropped or estimated — you're seeing the real count.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
        Protocol FAQ
      </p>
      <h2 className="mt-2 mb-8 font-display text-[28px] font-extrabold uppercase tracking-tight">
        Questions, answered.
      </h2>
      <div className="divide-y divide-ink-950/10 border-t border-ink-950/10">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-[15.5px] font-bold">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={clsx("shrink-0 transition-transform", isOpen && "rotate-180")}
                />
              </button>
              {isOpen && (
                <p className="max-w-xl pb-5 text-[13.5px] leading-relaxed text-ink-500">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
