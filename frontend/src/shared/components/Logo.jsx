import { Link2 } from "lucide-react";
import clsx from "clsx";

export function Logo({ className, dark = false }) {
  return (
    <span className={clsx("inline-flex items-center gap-2 select-none", className)}>
      <span
        className={clsx(
          "grid h-6 w-6 place-items-center rounded-[4px] border",
          dark
            ? "border-paper-50 bg-paper-50 text-ink-950"
            : "border-ink-950 bg-ink-950 text-paper-50"
        )}
      >
        <Link2 size={13} strokeWidth={2.75} />
      </span>
      <span className="font-display text-[16px] font-extrabold uppercase tracking-tight">
        GoURL
      </span>
    </span>
  );
}
