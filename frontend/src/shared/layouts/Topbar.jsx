import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Menu } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDisclosure } from "@/shared/hooks/useDisclosure";

export function Topbar({ title, actions, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, toggle, close } = useDisclosure(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) close();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen, close]);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-ink-950/10 bg-paper-50/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onMenuClick}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] text-ink-700 hover:bg-paper-100 hover:text-ink-950 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>
        <h1 className="truncate font-display text-[17px] font-extrabold sm:text-[19px]">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {actions}
        <div className="relative" ref={ref}>
          <button
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-[6px] border border-ink-950 bg-ink-950 font-mono text-[12px] font-bold text-paper-50"
            title={user?.name}
          >
            {initials || <User size={14} />}
          </button>

          {isOpen && (
            <div
              className={clsx(
                "absolute right-0 z-20 mt-2 w-56 rounded-[8px] border border-ink-950/10 bg-white py-1",
                "shadow-[var(--shadow-hard-sm)] animate-[fade-up_0.15s_ease-out]"
              )}
            >
              <div className="border-b border-ink-950/8 px-3 py-2.5">
                <p className="truncate text-[13px] font-semibold text-ink-950">{user?.name}</p>
                <p className="truncate text-[12px] text-ink-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  close();
                  navigate("/app/settings");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink-700 hover:bg-paper-100 hover:text-ink-950"
              >
                <User size={14} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
