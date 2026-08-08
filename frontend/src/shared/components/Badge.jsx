import clsx from "clsx";

const tones = {
  neutral: "bg-paper-200 text-ink-700 border-ink-950/10",
  moss: "bg-moss-50 text-moss-600 border-moss-600/20",
  flame: "bg-flame-50 text-flame-600 border-flame-500/20",
  outline: "bg-transparent text-ink-700 border-ink-950/15",
};

export function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-[4px] border px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em]",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
