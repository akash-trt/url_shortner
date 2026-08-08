import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/shared/components/Logo";
import { Button } from "@/shared/components/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

const links = [
  { to: "/#product", label: "Product" },
  { to: "/#how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/docs", label: "Docs" },
];

export function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { status } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-950 bg-paper-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className="font-mono text-[11.5px] font-medium uppercase tracking-[0.06em] text-ink-700 transition-colors hover:text-ink-950"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "authenticated" ? (
            <Button as={Link} to="/app" size="sm">
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to="/signup" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-[6px] md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-ink-950/10 px-5 py-4 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-[6px] px-2 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.06em] text-ink-700"
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-2 flex gap-2">
            <Button as={Link} to="/login" variant="secondary" size="sm" className="flex-1">
              Log in
            </Button>
            <Button as={Link} to="/signup" size="sm" className="flex-1">
              Get started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
