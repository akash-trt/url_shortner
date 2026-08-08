const items = [
  "SUB-100MS REDIRECTS",
  "REDIS + BULLMQ PIPELINE",
  "QR CODES INCLUDED",
  "90-DAY AUTO-EXPIRY",
  "REAL-TIME CLICK ANALYTICS",
];

export function MarqueeBand() {
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-ink-950 bg-ink-950 py-3">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8">
        {track.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-8 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-paper-50/70"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-flame-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
