import { useEffect, useState } from "react";
import { Badge } from "@/shared/components/Badge";

export function LinkStatusBadge({ status, expiresAt }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  const expired = expiresAt && new Date(expiresAt).getTime() <= now;

  if (expired) return <Badge tone="outline">Expired</Badge>;
  if (status === "DISABLED") return <Badge tone="neutral">Disabled</Badge>;
  if (status === "BLOCKED") return <Badge tone="flame">Blocked</Badge>;
  return <Badge tone="moss">Active</Badge>;
}
