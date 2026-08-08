import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldTopology from "world-atlas/countries-110m.json";
import indiaBoundary from "../data/indiaBoundary.json";

const WIDTH = 720;
const HEIGHT = 380;

let cachedFeatures = null;
function getCountryFeatures() {
  if (cachedFeatures) return cachedFeatures;
  const all = feature(worldTopology, worldTopology.objects.countries).features;
  // The bundled world-atlas dataset ships a simplified India outline that
  // clips the north of Jammu & Kashmir / Ladakh. Swap it for a corrected
  // boundary that reflects India's official map.
  cachedFeatures = all
    .filter((f) => f.properties.name !== "India")
    .concat(indiaBoundary);
  return cachedFeatures;
}

export function WorldMap({ data, selectedCountry, onSelectCountry }) {
  const [hovered, setHovered] = useState(null);
  const features = getCountryFeatures();

  const { path } = useMemo(() => {
    const proj = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], { type: "Sphere" });
    return { projection: proj, path: geoPath(proj) };
  }, []);

  const byMapName = useMemo(() => {
    const map = new Map();
    for (const entry of data) map.set(entry.mapName, entry);
    return map;
  }, [data]);

  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Clicks by country"
      >
        <path d={path({ type: "Sphere" })} fill="#f4f2ed" />
        {features.map((f) => {
          const name = f.properties.name;
          const entry = byMapName.get(name);
          const count = entry?.count ?? 0;
          const isSelected = selectedCountry === entry?.name;
          const hasData = count > 0;
          const intensity = hasData ? 0.16 + (count / maxCount) * 0.8 : 0;

          return (
            <path
              key={name}
              d={path(f)}
              fill={hasData ? "#14130f" : "#e2ddd2"}
              fillOpacity={hasData ? intensity : 0.5}
              stroke="#fbfaf7"
              strokeWidth={0.6}
              className={hasData ? "cursor-pointer transition-opacity" : undefined}
              style={isSelected ? { stroke: "#ff5a2e", strokeWidth: 1.6 } : undefined}
              onMouseEnter={() => setHovered({ name: entry?.name ?? name, count })}
              onMouseLeave={() => setHovered(null)}
              onClick={() => hasData && onSelectCountry(entry.name)}
            />
          );
        })}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-[6px] border border-ink-950/10 bg-white px-2.5 py-1.5 shadow-[var(--shadow-hard-sm)]">
          <p className="text-[12.5px] font-semibold text-ink-950">{hovered.name}</p>
          <p className="font-mono text-[11px] text-ink-500">
            {hovered.count.toLocaleString()} click{hovered.count === 1 ? "" : "s"}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-end gap-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-300">
        Less
        <span className="flex h-2.5 gap-0.5">
          {[0.16, 0.4, 0.65, 0.96].map((op) => (
            <span key={op} className="h-2.5 w-4" style={{ backgroundColor: `rgba(20,19,15,${op})` }} />
          ))}
        </span>
        More
      </div>
    </div>
  );
}
