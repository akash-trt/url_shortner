import { MousePointerClick } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { formatDateTime, timeAgo } from "@/shared/utils/format";
import { parseDevice, referrerLabel } from "../utils/aggregate";

export function RecentClicksTable({ clicks }) {
  if (clicks.length === 0) {
    return (
      <EmptyState
        icon={<MousePointerClick size={18} />}
        title="No clicks yet"
        description="Once people start clicking this link, every visit shows up here in real time."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-[8px] border border-ink-950/10 bg-white">
      <table className="w-full min-w-[560px] text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-ink-950/10">
            {["When", "Location", "Referrer", "Device"].map((col) => (
              <th
                key={col}
                className="px-4 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clicks.map((click) => {
            const { device, browser } = parseDevice(click.userAgent);
            return (
              <tr key={click._id} className="border-b border-ink-950/8 last:border-0">
                <td className="px-4 py-2.5 text-ink-700" title={formatDateTime(click.clickedAt)}>
                  {timeAgo(click.clickedAt)}
                </td>
                <td className="px-4 py-2.5 text-ink-500">
                  {[click.city, click.country].filter(Boolean).join(", ") || "Unknown"}
                </td>
                <td className="px-4 py-2.5 text-ink-500">{referrerLabel(click.referrer)}</td>
                <td className="px-4 py-2.5 text-ink-500">
                  {device} · {browser}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
