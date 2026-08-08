import { forwardRef, useId } from "react";
import clsx from "clsx";

export const Input = forwardRef(function Input(
  { label, error, hint, icon, suffix, className, containerClassName, ...props },
  ref
) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-500"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3 text-ink-300">{icon}</span>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "h-11 w-full rounded-[6px] border bg-paper-50 px-3.5 text-[14.5px] text-ink-950 placeholder:text-ink-300",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-ink-950/10",
            error
              ? "border-red-300 focus:border-red-400"
              : "border-ink-950/15 focus:border-ink-950/40",
            icon && "pl-9",
            suffix && "pr-16",
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 font-mono text-xs text-ink-500">{suffix}</span>
        )}
      </div>
      {error ? (
        <p className="text-[12.5px] text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-[12.5px] text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
});
