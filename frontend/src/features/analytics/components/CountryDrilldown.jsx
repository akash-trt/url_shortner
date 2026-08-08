import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldTopology from "world-atlas/countries-110m.json";
import indiaBoundary from "../data/indiaBoundary.json";
import { findCityCoords } from "../data/cityCoordinates";
import { aggregateByCity } from "../utils/geo";
import { TopList } from "./TopList";

const WIDTH = 420;
const HEIGHT = 300;

let cachedFeatures = null;
function getCountryFeatures() {
  if (cachedFeatures) return cachedFeatures;
  const all = feature(worldTopology, worldTopology.objects.countries).features;
  // See WorldMap.jsx — the bundled dataset clips northern J&K/Ladakh, so we
  // substitute a corrected boundary that reflects India's official map.
  cachedFeatures = all
    .filter((f) => f.properties.name !== "India")
    .concat(indiaBoundary);
  return cachedFeatures;
}

export function CountryDrilldown({ country, mapName, clicks, onBack }) {
  const [hovered, setHovered] = useState(null);
  const cityRows = useMemo(() => aggregateByCity(clicks, country), [clicks, country]);
  const maxCount = Math.max(1, ...cityRows.map((c) => c.count));

  const countryFeature = useMemo(
    () => getCountryFeatures().find((f) => f.properties.name === mapName),
    [mapName]
  );

  const { path, projection } = useMemo(() => {
    if (!countryFeature) return {};
    const proj = geoMercator().fitSize([WIDTH, HEIGHT], countryFeature);
    return { projection: proj, path: geoPath(proj) };
  }, [countryFeature]);

  const cityPoints = useMemo(() => {
    if (!projection) return [];
    return cityRows
      .map((row) => {
        const coords = findCityCoords(row.label, country);
        if (!coords) return null;
        const [x, y] = projection(coords) || [];
        if (x === undefined) return null;
        return { ...row, x, y };
      })
      .filter(Boolean);
  }, [cityRows, country, projection]);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-700 hover:text-ink-950"
      >
        <ArrowLeft size={14} />
        Back to countries
      </button>

      <p className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
        Clicks in {country}
      </p>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative rounded-[8px] border border-ink-950/10 bg-paper-100 p-2">
          {countryFeature ? (
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">
              <path d={path(countryFeature)} fill="#e9e5dc" stroke="#c9c3b6" strokeWidth={0.75} />
              {cityPoints.map((p) => {
                const r = 3 + (p.count / maxCount) * 11;
                return (
                  <circle
                    key={p.label}
                    cx={p.x}
                    cy={p.y}
                    r={r}
                    fill="#ff5a2e"
                    fillOpacity={0.55}
                    stroke="#e8481f"
                    strokeWidth={1}
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
            </svg>
          ) : (
            <div className="grid h-full min-h-[220px] place-items-center text-[12.5px] text-ink-300">
              No map shape available for this country
            </div>
          )}

          {hovered && (
            <div className="pointer-events-none absolute left-3 top-3 rounded-[6px] border border-ink-950/10 bg-white px-2.5 py-1.5 shadow-[var(--shadow-hard-sm)]">
              <p className="text-[12.5px] font-semibold text-ink-950">{hovered.label}</p>
              <p className="font-mono text-[11px] text-ink-500">{hovered.count} clicks</p>
            </div>
          )}
        </div>

        <TopList title={`Top cities in ${country}`} items={cityRows} />
      </div>
    </div>
  );
}
