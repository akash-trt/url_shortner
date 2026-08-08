import clsx from "clsx";

export function Card({ className, hard = false, as: Component = "div", ...props }) {
  return (
    <Component
      className={clsx(
        "rounded-[8px] border border-ink-950/10 bg-white",
        hard ? "shadow-[var(--shadow-hard-sm)]" : "shadow-[var(--shadow-card)]",
        className
      )}
      {...props}
    />
  );
}
