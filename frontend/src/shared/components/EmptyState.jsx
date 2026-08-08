import clsx from "clsx";

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-ink-950/15 px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-paper-200 text-ink-500">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-display text-[15px] font-bold">{title}</p>
        {description && <p className="max-w-xs text-[13.5px] text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
