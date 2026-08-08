import { Check, Copy } from "lucide-react";
import clsx from "clsx";
import { useClipboard } from "@/shared/hooks/useClipboard";

export function CopyButton({ value, className, label }) {
  const { copied, copy } = useClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-[5px] px-1.5 py-1 text-ink-500 transition-colors hover:bg-paper-200 hover:text-ink-950",
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-moss-600" /> : <Copy size={14} />}
      {label && <span className="text-[12.5px]">{copied ? "Copied" : label}</span>}
    </button>
  );
}
