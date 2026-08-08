import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";

export function Modal({ isOpen, onClose, title, children, className }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px] animate-[fade-up_0.2s_ease-out]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          "relative w-full max-w-md rounded-[10px] border border-ink-950/10 bg-white p-6",
          "shadow-[var(--shadow-hard)] animate-[fade-up_0.25s_cubic-bezier(0.16,1,0.3,1)]",
          className
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          {title && <h3 className="font-display text-lg font-bold">{title}</h3>}
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-[5px] text-ink-500 hover:bg-paper-200 hover:text-ink-950"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
