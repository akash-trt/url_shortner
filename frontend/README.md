# GoURL — Frontend

A production-shaped React + Vite frontend for the URL Shortener backend, built
feature-first rather than page-first.

## Stack

- **React 19 + Vite** — no CRA, no unnecessary abstraction
- **Tailwind CSS v4** (`@tailwindcss/vite`) — design tokens live in `src/index.css` (`@theme` block), not scattered across components
- **React Router v7** — nested layouts, route-level `handle` for page titles
- **TanStack Query** — server state (links, analytics), cache invalidation on mutations
- **Axios** — single instance with an in-memory access token + silent refresh-on-401 flow
- **Recharts** — the one clicks-over-time chart
- **react-hot-toast**, **lucide-react**, **clsx** — small, load-bearing utilities only

## Getting started

```bash
cp .env.example .env   # point VITE_BACKEND_URL at your backend
npm install
npm run dev
```

The dev server proxies `/api/*` to `VITE_BACKEND_URL` (default
`http://localhost:8000`), so the browser only ever talks to `/api/v1/...`
regardless of environment.

## Architecture

```
src/
  app/                 route table + auth guards (RequireAuth / RequireGuest)
  features/
    auth/              context, hooks, forms, API calls — nothing outside
                        this folder touches tokens directly
    links/              CRUD, QR, the reusable "shorten a link" form
    analytics/          per-link + account-wide stat aggregation, charts
  pages/               one file per route, composed from feature components
  shared/
    api/httpClient.js  the only place axios is configured
    components/        Button, Input, Card, Modal, etc. — no feature logic
    layouts/           MarketingLayout, DashboardLayout, AuthLayout
    hooks/ utils/
```

The rule of thumb: if a piece of UI or logic only makes sense in the context
of links, auth, or analytics, it lives in that feature folder. Anything
reusable across features lives in `shared/`.

## Design decisions worth knowing about

**The brand direction is brutalist, not the softer rounded look from the
first mockup round.** Sharp corners, hard offset shadows, Archivo for
display type, a mono ticker band — this was a deliberate reskin toward the
second reference you sent, applied consistently across marketing *and*
product screens rather than just the landing page.

**Scope was trimmed to match what the backend actually does.** The original
screens included Domains, Teams, and full Billing management — none of
which exist as backend routes. Rather than build UI that calls nothing, I
cut them. Pricing kept its "Pro / Business" tiers as an honest waitlist/
contact-sales CTA instead of a fake checkout, and Settings shows the
profile as read-only, because there's no update-user endpoint yet.

**Account-wide analytics are a client-side rollup, not a real endpoint.**
The backend only exposes analytics per link. `useOverviewStats` fetches
every link's summary + recent clicks in parallel and folds them together —
fine for a personal account with tens of links, and clearly commented as
the first thing to swap out if you add a real `/analytics/overview` route.

**The Analytics page's world map uses real geography and real click data —
no fabricated numbers.** Country shapes come from `world-atlas` (Natural
Earth via topojson), rendered with `d3-geo` directly rather than a
React map wrapper (avoids pulling in a beta package for something this
size). Each country's shading is the actual click count from your backend's
`country` field (populated by ip-api.com geolocation on click). Clicking a
country drills into that country's shape with city dots — plotted from a
small curated coordinate table for well-known cities, since the backend
only stores a city *name*, not coordinates. Cities we don't have coordinates
for still show up correctly in the ranked "Top cities" list next to the map,
they just don't get a dot.

**Domains and Teams are honest placeholders, not fake CRUD screens.**
Neither has any backend support (no custom-domain model, no multi-user
accounts), so both pages say so plainly and offer a "let us know you're
interested" mailto instead of pretending to manage settings that don't
exist anywhere.

**The landing page's hero "shorten a link" form can't fake a submission.**
Creating a link is an authenticated endpoint. A signed-out visitor who
submits the hero form is taken straight to sign-up with their URL
preserved and auto-created right after — never shown a link that doesn't
actually exist.

**The "Trusted by" logo strip from the mockup was dropped.** Real company
wordmarks would imply partnerships that don't exist; rather than fabricate
that or use fake logos in their place, that section was replaced with an
honest, technical feature strip (Redis cache, BullMQ queue, QR codes) —
things the app actually does.

## Known trade-offs

- No test suite yet — this was scoped as a UI build, not a full SDLC pass.
- The main JS bundle is ~960 kB pre-gzip (~300 kB gzipped) — Recharts and the
  world-atlas country geometry (110m resolution, ~108 kB) are the two big
  contributors. Fine for a project this size; if it grows, `React.lazy()`
  around the Analytics page is the first lever.
- Per-row click counts and the overview rollup both do one request per
  link. Acceptable for tens of links; would need a dedicated aggregate
  endpoint before it makes sense at hundreds.
