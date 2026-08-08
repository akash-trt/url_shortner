/** A very small, dependency-free user-agent sniff — good enough for a device badge. */
export function parseDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();
  if (!ua) return { device: "Unknown", browser: "Unknown" };

  let device = "Desktop";
  if (/mobile|android|iphone/.test(ua)) device = "Mobile";
  else if (/ipad|tablet/.test(ua)) device = "Tablet";
  else if (/bot|crawler|spider/.test(ua)) device = "Bot";

  let browser = "Other";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome/")) browser = "Chrome";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("safari/")) browser = "Safari";

  return { device, browser };
}

/** Groups clicks by calendar day for the last `days` days (fills gaps with 0). */
export function bucketClicksByDay(clicks, days = 7) {
  const buckets = new Map();
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { date: key, clicks: 0 });
  }

  for (const click of clicks) {
    const key = new Date(click.clickedAt).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.get(key).clicks += 1;
  }

  return Array.from(buckets.values()).map((b) => ({
    ...b,
    label: new Date(b.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
}

/** Groups clicks by ISO week for the last `weeks` weeks (fills gaps with 0). */
export function bucketClicksByWeek(clicks, weeks = 8) {
  const buckets = [];
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(startOfThisWeek);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    buckets.push({ start, end, clicks: 0 });
  }

  for (const click of clicks) {
    const t = new Date(click.clickedAt).getTime();
    const bucket = buckets.find((b) => t >= b.start.getTime() && t < b.end.getTime());
    if (bucket) bucket.clicks += 1;
  }

  return buckets.map((b) => ({
    date: b.start.toISOString().slice(0, 10),
    clicks: b.clicks,
    label: b.start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
}

/** Top-N counts for a given field, with everything past N rolled into "Others". */
export function topN(clicks, field, n = 5, fallbackLabel = "Direct / unknown") {
  const counts = new Map();

  for (const click of clicks) {
    const raw = click[field];
    const label = raw && raw !== "null" ? raw : fallbackLabel;
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, n);
  const rest = sorted.slice(n).reduce((sum, [, count]) => sum + count, 0);

  if (rest > 0) top.push(["Others", rest]);

  return top.map(([label, count]) => ({ label, count }));
}

/** Extracts a readable site name from a referrer URL for display. */
export function referrerLabel(referrer) {
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return referrer;
  }
}
