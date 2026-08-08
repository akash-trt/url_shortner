import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MousePointerClick, Users, Globe2, MapPin } from "lucide-react";
import { StatCard } from "@/features/analytics/components/StatCard";
import { ClicksLineChart } from "@/features/analytics/components/ClicksLineChart";
import { TopList } from "@/features/analytics/components/TopList";
import { WorldMap } from "@/features/analytics/components/WorldMap";
import { CountryDrilldown } from "@/features/analytics/components/CountryDrilldown";
import { Card } from "@/shared/components/Card";
import { LinkStatusBadge } from "@/features/links/components/LinkStatusBadge";
import { useOverviewStats } from "@/features/analytics/hooks/useOverviewStats";
import { bucketClicksByDay, bucketClicksByWeek, topN, referrerLabel } from "@/features/analytics/utils/aggregate";
import { aggregateByCountry, countDistinct } from "@/features/analytics/utils/geo";
import { formatExactCount, formatDate, prettyUrl } from "@/shared/utils/format";
import clsx from "clsx";

export default function AnalyticsPage() {
  const stats = useOverviewStats();
  const [range, setRange] = useState("daily");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const series = useMemo(
    () => (range === "daily" ? bucketClicksByDay(stats.allClicks, 7) : bucketClicksByWeek(stats.allClicks, 8)),
    [stats.allClicks, range]
  );

  const topReferrers = useMemo(
    () =>
      topN(stats.allClicks, "referrer", 5, "Direct").map((r) => ({
        ...r,
        label: r.label === "Direct" ? "Direct" : referrerLabel(r.label),
      })),
    [stats.allClicks]
  );

  const countryData = useMemo(() => aggregateByCountry(stats.allClicks), [stats.allClicks]);
  const countriesReached = useMemo(() => countDistinct(stats.allClicks, "country"), [stats.allClicks]);
  const citiesReached = useMemo(() => countDistinct(stats.allClicks, "city"), [stats.allClicks]);

  const recentLinks = useMemo(
    () =>
      [...stats.links]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [stats.links]
  );

  const selectedEntry = countryData.find((c) => c.name === selectedCountry);

  if (stats.isLoading) {
    return (
      <div className="grid h-64 place-items-center rounded-[8px] border border-ink-950/10 bg-white">
        <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-300">
          Crunching the numbers…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
        <StatCard
          label="Countries reached"
          value={formatExactCount(countriesReached)}
          icon={<Globe2 size={15} />}
        />
        <StatCard
          label="Cities reached"
          value={formatExactCount(citiesReached)}
          icon={<MapPin size={15} />}
        />
      </div>

      <Card className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
            Clicks over time
          </p>
          <div className="flex overflow-hidden rounded-[6px] border border-ink-950/15">
            {["daily", "weekly"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={clsx(
                  "px-3 py-1.5 text-[12px] font-medium capitalize transition-colors",
                  range === r ? "bg-ink-950 text-paper-50" : "text-ink-700 hover:bg-paper-100"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <ClicksLineChart data={series} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopList title="Top referrers" items={topReferrers} />

        <Card className="p-0">
          <div className="border-b border-ink-950/10 px-4 py-3">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
              Recent links
            </p>
          </div>
          {recentLinks.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-ink-300">No links yet</p>
          ) : (
            <ul>
              {recentLinks.map((link) => (
                <li
                  key={link.id}
                  className="flex items-center justify-between gap-3 border-b border-ink-950/8 px-4 py-2.5 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/app/links/${link.shortCode}`}
                        className="truncate text-[13px] font-medium text-ink-950 hover:underline"
                      >
                        {link.shortCode}
                      </Link>
                      <LinkStatusBadge status={link.status} expiresAt={link.expiresAt} />
                    </div>
                    <p className="truncate text-[12px] text-ink-500">{prettyUrl(link.longUrl, 34)}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11.5px] text-ink-300">
                    {formatDate(link.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <p className="mb-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
          Clicks by country
        </p>

        {selectedEntry ? (
          <CountryDrilldown
            country={selectedEntry.name}
            mapName={selectedEntry.mapName}
            clicks={stats.allClicks}
            onBack={() => setSelectedCountry(null)}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <WorldMap
              data={countryData}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
            />
            <TopList
              title="Top countries"
              items={countryData.slice(0, 8).map((c) => ({ label: c.name, count: c.count }))}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
