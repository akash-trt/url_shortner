import { useEffect, useState } from "react";
import { Download, Loader2, Share2, Check, Copy } from "lucide-react";
import { linksApi } from "../api/linksApi";
import { Button } from "@/shared/components/Button";
import { useClipboard } from "@/shared/hooks/useClipboard";

export function QrCodePreview({ shortCode, shortUrl }) {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);
  const { copied, copy } = useClipboard();
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    let objectUrl;
    let cancelled = false;

    linksApi
      .qrCodeUrl(shortCode)
      .then((url) => {
        if (cancelled) return;
        objectUrl = url;
        setSrc(url);
        setFailed(false);
      })
      .catch(() => {
        if (cancelled) return;
        setSrc(null);
        setFailed(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [shortCode]);

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ title: shortCode, url: shortUrl });
      } catch {
        // user cancelled the share sheet — no-op
      }
    } else {
      copy(shortUrl);
    }
  };

  if (failed) {
    return <p className="text-[13px] text-ink-500">Couldn't load the QR code.</p>;
  }

  if (!src) {
    return (
      <div className="grid h-56 w-56 place-items-center rounded-[10px] border border-dashed border-ink-950/15">
        <Loader2 size={18} className="animate-spin text-ink-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-[14px] border border-ink-950/10 bg-white p-5 shadow-[var(--shadow-card)]">
        <img
          src={src}
          alt={`QR code for ${shortCode}`}
          className="h-52 w-52 rounded-[6px]"
        />
      </div>

      {shortUrl && (
        <p className="max-w-[220px] truncate font-mono text-[12.5px] text-ink-500">
          {shortUrl}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button as="a" href={src} download={`${shortCode}.png`} variant="secondary" size="sm">
          <Download size={14} />
          Download PNG
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShare}>
          {canShare ? (
            <>
              <Share2 size={14} />
              Share
            </>
          ) : copied ? (
            <>
              <Check size={14} className="text-moss-600" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}