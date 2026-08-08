import { Card } from "@/shared/components/Card";
import { formatExactCount } from "@/shared/utils/format";

export function TopList({ title, items }) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <Card className="p-4">
      <p className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
        {title}
      </p>
      {items.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-ink-300">Nothing to show yet</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-[12.5px] text-ink-700" title={item.label}>
                {item.label}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-200">
                <span
                  className="block h-full rounded-full bg-ink-950"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-mono text-[12px] tabular-nums text-ink-500">
                {formatExactCount(item.count)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
