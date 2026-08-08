import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Link2, BarChart3, Globe, Users, Settings, Plus, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/shared/components/Logo";
import { Button } from "@/shared/components/Button";

const items = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/links", label: "Links", icon: Link2 },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/domains", label: "Domains", icon: Globe },
  { to: "/app/teams", label: "Teams", icon: Users },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onCreateClick, isOpen = false, onClose, className }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] shrink-0 flex-col border-r border-ink-950/10 bg-white transition-transform duration-200 ease-out",
          "lg:static lg:z-auto lg:w-60 lg:max-w-none lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-950/10 px-5">
          <Link to="/" onClick={onClose}>
            <Logo />
          </Link>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-[6px] text-ink-500 hover:bg-paper-100 hover:text-ink-950 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              onCreateClick?.();
              onClose?.();
            }}
          >
            <Plus size={15} />
            New link
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-[13.5px] font-medium transition-colors",
                  isActive
                    ? "bg-ink-950 text-paper-50"
                    : "text-ink-700 hover:bg-paper-100 hover:text-ink-950"
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-950/10 p-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-300">
            GoURL · v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
