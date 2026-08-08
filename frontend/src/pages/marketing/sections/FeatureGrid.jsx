import { Zap, BarChart3, ShieldCheck, QrCode } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Edge-fast redirects",
    body: "Short codes resolve straight out of a Redis cache, so the redirect fires before the destination site even wakes up.",
  },
  {
    icon: BarChart3,
    title: "Real click data",
    body: "Every click is queued through BullMQ and logged with referrer, country, and device — not sampled, not estimated.",
  },
  {
    icon: ShieldCheck,
    title: "Built to be disabled",
    body: "Pause, re-enable, or set an expiry on any link. Nothing redirects once you've turned it off.",
  },
  {
    icon: QrCode,
    title: "QR codes, built in",
    body: "Every link gets a scannable QR code automatically — download it straight from the link's page.",
  },
];

export function FeatureGrid() {
  return (
    <section id="product" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 max-w-xl">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
          Superior capability
        </p>
        <h2 className="mt-2 font-display text-[32px] font-extrabold uppercase leading-[1.02] tracking-tight">
          Stripped of bloat.
        </h2>
      </div>
      <div className="grid gap-px overflow-hidden rounded-[10px] border border-ink-950 bg-ink-950 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-white p-5">
            <Icon size={18} strokeWidth={2} />
            <p className="mt-4 font-display text-[14.5px] font-bold uppercase tracking-tight">
              {title}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
