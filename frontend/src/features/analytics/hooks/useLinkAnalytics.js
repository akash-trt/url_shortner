import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export function useLinkAnalytics(shortCode) {
  const summary = useQuery({
    queryKey: ["analytics", shortCode, "summary"],
    queryFn: () => analyticsApi.summary(shortCode),
    enabled: Boolean(shortCode),
  });

  const recentClicks = useQuery({
    queryKey: ["analytics", shortCode, "recent"],
    queryFn: () => analyticsApi.recentClicks(shortCode, 100),
    enabled: Boolean(shortCode),
  });

  return {
    summary: summary.data,
    clicks: recentClicks.data ?? [],
    isLoading: summary.isLoading || recentClicks.isLoading,
    isError: summary.isError || recentClicks.isError,
  };
}
