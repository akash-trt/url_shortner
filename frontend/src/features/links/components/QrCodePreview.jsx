import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { linksApi } from "../api/linksApi";
import { Button } from "@/shared/components/Button";

export function QrCodePreview({ shortCode }) {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);

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

  if (failed) {
    return <p className="text-[13px] text-ink-500">Couldn't load the QR code.</p>;
  }

  if (!src) {
    return (
      <div className="grid h-40 w-40 place-items-center rounded-[8px] border border-dashed border-ink-950/15">
        <Loader2 size={18} className="animate-spin text-ink-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={src}
        alt={`QR code for ${shortCode}`}
        className="h-40 w-40 rounded-[8px] border border-ink-950/10 bg-white p-2"
      />
      <Button as="a" href={src} download={`${shortCode}.png`} variant="secondary" size="sm">
        <Download size={14} />
        Download PNG
      </Button>
    </div>
  );
}
