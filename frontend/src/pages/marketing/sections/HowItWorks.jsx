const steps = [
  {
    n: "01",
    title: "Paste your link",
    body: "Drop in any destination URL. Add a custom alias if you want something memorable instead of a random code.",
  },
  {
    n: "02",
    title: "We generate the short code",
    body: "A Base62 counter (or your alias) becomes the short code, cached in Redis so the first click is never slow.",
  },
  {
    n: "03",
    title: "Every click gets logged",
    body: "Referrer, country, device, and timestamp are queued and written asynchronously — your redirect never waits on it.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-ink-950 bg-paper-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
            The protocol
          </p>
          <h2 className="mt-2 font-display text-[32px] font-extrabold uppercase leading-[1.02] tracking-tight">
            How a link
            <br />
            actually moves.
          </h2>
        </div>
        <ol className="flex flex-col gap-6">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="font-mono text-[13px] font-semibold text-ink-300">{step.n}</span>
              <div className="border-l border-ink-950/15 pl-4">
                <p className="font-display text-[15px] font-bold">{step.title}</p>
                <p className="mt-1 max-w-md text-[13.5px] leading-relaxed text-ink-500">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
