import { useQueries, useQuery } from "@tanstack/react-query";
import { linksApi } from "@/features/links/api/linksApi";
import { analyticsApi } from "../api/analyticsApi";
import { bucketClicksByDay, topN } from "../utils/aggregate";

/**
 * There's no dedicated "account summary" endpoint on the backend yet — each
 * link only exposes its own analytics. For a typical account (tens of
 * links, not thousands) it's perfectly fine to fetch every link's summary
 * and recent clicks in parallel and fold them together client-side. If this
 * account ever grows past a couple hundred links, this is the first place
 * to swap in a real `/analytics/overview` endpoint.
 */
export function useOverviewStats() {
  const linksQuery = useQuery({
    queryKey: ["links", "overview-source"],
    queryFn: () => linksApi.list({ page: 1, limit: 100 }),
  });

  const links = linksQuery.data?.data ?? [];

  const summaryQueries = useQueries({
    queries: links.map((link) => ({
      queryKey: ["analytics", link.shortCode, "summary"],
      queryFn: () => analyticsApi.summary(link.shortCode),
      enabled: links.length > 0,
    })),
  });

  const clicksQueries = useQueries({
    queries: links.map((link) => ({
      queryKey: ["analytics", link.shortCode, "recent"],
      queryFn: () => analyticsApi.recentClicks(link.shortCode, 100),
      enabled: links.length > 0,
    })),
  });

  const isLoading =
    linksQuery.isLoading ||
    summaryQueries.some((q) => q.isLoading) ||
    clicksQueries.some((q) => q.isLoading);

  const totalClicks = summaryQueries.reduce(
    (sum, q) => sum + (q.data?.totalClicks ?? 0),
    0
  );
  const uniqueVisitors = summaryQueries.reduce(
    (sum, q) => sum + (q.data?.uniqueVisitors ?? 0),
    0
  );

  const allClicks = clicksQueries.flatMap((q) => q.data ?? []);
  const series = bucketClicksByDay(allClicks, 7);
  const topReferrers = topN(allClicks, "referrer", 5, "Direct");
  const topCountries = topN(allClicks, "country", 5, "Unknown");

  const topLinks = links
    .map((link, i) => ({ ...link, totalClicks: summaryQueries[i]?.data?.totalClicks ?? 0 }))
    .sort((a, b) => b.totalClicks - a.totalClicks)
    .slice(0, 5);

  const activeLinks = links.filter(
    (l) => l.status === "ACTIVE" && (!l.expiresAt || new Date(l.expiresAt) > new Date())
  ).length;

  return {
    isLoading,
    links,
    allClicks,
    totalLinks: linksQuery.data?.total ?? 0,
    activeLinks,
    totalClicks,
    uniqueVisitors,
    series,
    topReferrers,
    topCountries,
    topLinks,
  };
}
