import { useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import clsx from "clsx";
import { useDisclosure } from "@/shared/hooks/useDisclosure";

export function RowMenu({ children, align = "right" }) {
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-label="More actions"
        className="grid h-8 w-8 place-items-center rounded-[5px] text-ink-500 hover:bg-paper-200 hover:text-ink-950"
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div
          className={clsx(
            "absolute z-20 mt-1 min-w-[168px] rounded-[8px] border border-ink-950/10 bg-white py-1",
            "shadow-[var(--shadow-hard-sm)] animate-[fade-up_0.15s_ease-out]",
            align === "right" ? "right-0" : "left-0"
          )}
          onClick={close}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function RowMenuItem({ icon, danger, className, ...props }) {
  return (
    <button
      type="button"
      className={clsx(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors",
        danger ? "text-red-600 hover:bg-red-50" : "text-ink-700 hover:bg-paper-100 hover:text-ink-950",
        className
      )}
      {...props}
    >
      {icon}
      {props.children}
    </button>
  );
}
