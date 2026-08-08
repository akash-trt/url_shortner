import { MousePointerClick, Link2, Users, Zap, ArrowRight } from "lucide-react";
import { useOutletContext, Link } from "react-router-dom";
import { StatCard } from "@/features/analytics/components/StatCard";
import { ClicksLineChart } from "@/features/analytics/components/ClicksLineChart";
import { Card } from "@/shared/components/Card";
import { LinkStatusBadge } from "@/features/links/components/LinkStatusBadge";
import { CopyButton } from "@/features/links/components/CopyButton";
import { Button } from "@/shared/components/Button";
import { useOverviewStats } from "@/features/analytics/hooks/useOverviewStats";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatExactCount, prettyUrl } from "@/shared/utils/format";

export default function OverviewPage() {
  const { user } = useAuth();
  const { openCreateModal } = useOutletContext();
  const stats = useOverviewStats();
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[14px] text-ink-500">
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-300">
            Last 7 days
          </p>
        </div>
        <Button onClick={openCreateModal}>New link</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total links"
          value={formatExactCount(stats.totalLinks)}
          icon={<Link2 size={15} />}
        />
        <StatCard
          label="Active links"
          value={formatExactCount(stats.activeLinks)}
          icon={<Zap size={15} />}
        />
        <StatCard
          label="Total clicks"
          value={formatExactCount(stats.totalClicks)}
          icon={<MousePointerClick size={15} />}
        />
        <StatCard
          label="Unique visitors"
          value={formatExactCount(stats.uniqueVisitors)}
          icon={<Users size={15} />}
        />
      </div>

      <Card className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
            Clicks over time
          </p>
          <Link
            to="/app/analytics"
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-700 hover:underline"
          >
            Full analytics
            <ArrowRight size={13} />
          </Link>
        </div>
        <ClicksLineChart data={stats.series} />
      </Card>

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-ink-950/10 px-5 py-3.5">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
            Top links
          </p>
          <Link to="/app/links" className="text-[12.5px] font-medium text-ink-700 hover:underline">
            View all
          </Link>
        </div>
        {stats.topLinks.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13.5px] text-ink-300">
            Create a link to start seeing activity here.
          </p>
        ) : (
          <ul>
            {stats.topLinks.map((link) => (
              <li
                key={link.id}
                className="flex items-center justify-between gap-3 border-b border-ink-950/8 px-5 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/app/links/${link.shortCode}`}
                      className="truncate font-medium text-ink-950 hover:underline"
                    >
                      {link.shortCode}
                    </Link>
                    <LinkStatusBadge status={link.status} expiresAt={link.expiresAt} />
                  </div>
                  <p className="truncate text-[12.5px] text-ink-500">{prettyUrl(link.longUrl)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[13px] tabular-nums text-ink-700">
                    {formatExactCount(link.totalClicks)}
                  </span>
                  <CopyButton value={link.shortUrl} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
