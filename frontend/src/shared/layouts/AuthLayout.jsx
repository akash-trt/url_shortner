import { Link } from "react-router-dom";
import { Link2 } from "lucide-react";
import { Logo } from "@/shared/components/Logo";

export function AuthLayout({ children, panelTitle, panelBody }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mx-auto w-full max-w-sm py-12">{children}</div>
        <p className="font-mono text-[11px] text-ink-300">
          © {new Date().getFullYear()} GoURL
        </p>
      </div>

      <div className="noise-card relative hidden overflow-hidden border-l border-ink-950 bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fbfaf7 1px, transparent 1px), linear-gradient(90deg, #fbfaf7 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative grid h-14 w-14 place-items-center rounded-[8px] border border-paper-50/25 bg-paper-50/5 text-paper-50">
          <Link2 size={26} strokeWidth={2.25} />
        </div>
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-50/50">
            GoURL Protocol
          </p>
          <h2 className="mt-3 font-display text-[32px] font-extrabold leading-[1.08] text-paper-50">
            {panelTitle}
          </h2>
          <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-paper-50/60">
            {panelBody}
          </p>
        </div>
      </div>
    </div>
  );
}
