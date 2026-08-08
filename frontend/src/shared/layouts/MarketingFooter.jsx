import { Link } from "react-router-dom";
import { Logo } from "@/shared/components/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Shorten a link", to: "/signup" },
      { label: "Pricing", to: "/pricing" },
      { label: "Docs", to: "/docs" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Create account", to: "/signup" },
      { label: "Dashboard", to: "/app" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-950 bg-paper-50">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">
              Shorten links, track every click, and see exactly where your traffic
              actually comes from.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-500">
                  {col.title}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[13.5px] text-ink-700 hover:text-ink-950">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-3 border-t border-ink-950/10 pt-6 text-[12.5px] text-ink-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} GoURL. Built as a system-design learning project.</p>
          <p className="font-mono uppercase tracking-[0.06em]">Auto-expiry · 90 days by default</p>
        </div>
      </div>
    </footer>
  );
}
