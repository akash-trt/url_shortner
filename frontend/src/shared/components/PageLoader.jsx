import { Link2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper-50">
      <div className="flex flex-col items-center gap-3">
        <div className="grid h-9 w-9 animate-pulse place-items-center rounded-[6px] border border-ink-950 bg-ink-950 text-paper-50">
          <Link2 size={18} strokeWidth={2.75} />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">
          Loading…
        </p>
      </div>
    </div>
  );
}
