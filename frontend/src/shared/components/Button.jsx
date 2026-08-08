import { forwardRef } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-ink-950 text-paper-50 hover:bg-ink-900 active:bg-ink-950 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]",
  flame: "bg-flame-500 text-white hover:bg-flame-600",
  secondary:
    "bg-transparent text-ink-950 border border-ink-950/15 hover:border-ink-950/30 hover:bg-paper-100",
  ghost: "bg-transparent text-ink-700 hover:bg-paper-200/70 hover:text-ink-950",
  danger: "bg-transparent text-red-700 border border-red-200 hover:bg-red-50",
};

const sizes = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
};

export const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex select-none items-center justify-center rounded-[6px] font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950/20 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </Component>
  );
});
