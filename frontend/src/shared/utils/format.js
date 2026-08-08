const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(n) {
  if (n === null || n === undefined) return "—";
  return numberFormatter.format(n);
}

export function formatExactCount(n) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(value, opts = {}) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeAgo(value) {
  if (!value) return "—";
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  const steps = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.345, "w"],
    [12, "mo"],
    [Infinity, "y"],
  ];
  let value_ = seconds;
  for (const [amount, unit] of steps) {
    if (value_ < amount) return `${Math.max(1, Math.floor(value_))}${unit} ago`;
    value_ /= amount;
  }
  return formatDate(value);
}

/** Strips the protocol so long URLs read cleanly in tables. */
export function prettyUrl(url, maxLen = 42) {
  if (!url) return "";
  const stripped = url.replace(/^https?:\/\//, "");
  return stripped.length > maxLen ? `${stripped.slice(0, maxLen)}…` : stripped;
}

