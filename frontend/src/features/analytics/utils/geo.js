import { COUNTRY_NAME_ALIASES } from "../data/countryNameAliases";

/** Maps a raw geo-lookup country name onto the name used by the map's topojson. */
export function toMapCountryName(rawName) {
  if (!rawName) return null;
  return COUNTRY_NAME_ALIASES[rawName] || rawName;
}

/** Groups clicks by country, keeping both the raw name (for display) and map name (for matching). */
export function aggregateByCountry(clicks) {
  const counts = new Map();

  for (const click of clicks) {
    const raw = click.country || "Unknown";
    const key = toMapCountryName(raw);
    const entry = counts.get(key) || { name: raw, mapName: key, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

/** Groups clicks by city for a single country (case-sensitive display name kept from the first occurrence). */
export function aggregateByCity(clicks, country) {
  const counts = new Map();

  for (const click of clicks) {
    if (country && click.country !== country) continue;
    const city = click.city || "Unknown";
    counts.set(city, (counts.get(city) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function countDistinct(clicks, field) {
  return new Set(clicks.map((c) => c[field]).filter(Boolean)).size;
}
