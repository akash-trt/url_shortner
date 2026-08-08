import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/shared/components/Card";

export function StatCard({ label, value, icon, trend, className }) {
  return (
    <Card className={clsx("p-4", className)}>
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
          {label}
        </p>
        {icon && <span className="text-ink-300">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-[26px] font-extrabold tabular-nums leading-none">
        {value}
      </p>
      {trend && (
        <p className="mt-2 inline-flex items-center gap-0.5 text-[12px] font-medium text-moss-600">
          <ArrowUpRight size={13} />
          {trend}
        </p>
      )}
    </Card>
  );
}
