import { Badge } from "@/shared/components/Badge";

export function LinkStatusBadge({ status, expiresAt }) {
  const expired = expiresAt && new Date(expiresAt) <= new Date();

  if (expired) return <Badge tone="outline">Expired</Badge>;
  if (status === "DISABLED") return <Badge tone="neutral">Disabled</Badge>;
  if (status === "BLOCKED") return <Badge tone="flame">Blocked</Badge>;
  return <Badge tone="moss">Active</Badge>;
}
