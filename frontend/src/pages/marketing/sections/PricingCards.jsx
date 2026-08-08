import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Button } from "@/shared/components/Button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Unlimited short links",
      "Real click analytics",
      "QR code for every link",
      "90-day auto-expiry",
    ],
    cta: { label: "Get started", to: "/signup" },
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    highlighted: true,
    features: [
      "Everything in Free",
      "Custom expiry windows",
      "Priority support",
      "Coming soon",
    ],
    cta: { label: "Join the waitlist", to: "mailto:hello@gourl.co?subject=Pro%20waitlist" },
  },
  {
    name: "Business",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Dedicated infrastructure",
      "SLA & onboarding support",
    ],
    cta: { label: "Contact sales", to: "mailto:hello@gourl.co?subject=Business%20plan" },
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-px overflow-hidden rounded-[10px] border border-ink-950 bg-ink-950 md:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={clsx("relative flex flex-col bg-white p-6", tier.highlighted && "bg-paper-50")}
        >
          {tier.highlighted && (
            <span className="absolute right-4 top-4 rounded-[4px] bg-flame-500 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.06em] text-white">
              Popular
            </span>
          )}
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            {tier.name}
          </p>
          <p className="mt-3 font-display text-[32px] font-extrabold leading-none">{tier.price}</p>
          {tier.period && <p className="mt-1 text-[12.5px] text-ink-500">{tier.period}</p>}
          <ul className="mt-5 flex flex-1 flex-col gap-2.5">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13px] text-ink-700">
                <Check size={14} className="mt-0.5 shrink-0 text-moss-600" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            as={tier.cta.to.startsWith("mailto") ? "a" : Link}
            {...(tier.cta.to.startsWith("mailto") ? { href: tier.cta.to } : { to: tier.cta.to })}
            variant={tier.highlighted ? "primary" : "secondary"}
            size="sm"
            className="mt-6 w-full"
          >
            {tier.cta.label}
          </Button>
        </div>
      ))}
    </div>
  );
}
