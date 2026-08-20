import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Share2, Check, Copy } from "lucide-react";
import { linksApi } from "../api/linksApi";
import { Button } from "@/shared/components/Button";
import { useClipboard } from "@/shared/hooks/useClipboard";

const TAGLINES = [
  "One scan, zero typing.",
  "Point your camera. Go.",
  "Faster than typing it out.",
  "Scan to skip the copy-paste.",
];

const COLORS = {
  inkNight: "#14130f",
  paper: "#fbfaf7",
  paperCard: "#ffffff",
  inkText: "#47443d",
  inkMuted: "#6f6b62",
  flame: "#ff5a2e",
  flameDeep: "#e8481f",
};

async function buildBanner(qrObjectUrl, shortUrl) {
  const qrImg = new Image();
  qrImg.src = qrObjectUrl;
  await new Promise((resolve, reject) => {
    qrImg.onload = resolve;
    qrImg.onerror = reject;
  });

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const scale = 2;
  const W = 560;
  const H = 740;
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, W, H);

  // Top accent bar — flame gradient
  const barGradient = ctx.createLinearGradient(0, 0, W, 0);
  barGradient.addColorStop(0, COLORS.flame);
  barGradient.addColorStop(1, COLORS.flameDeep);
  ctx.fillStyle = barGradient;
  ctx.fillRect(0, 0, W, 6);

  // Wordmark
  ctx.fillStyle = COLORS.inkNight;
  ctx.font = "700 32px Archivo, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GOURL", W / 2, 86);

  // Small accent pill under wordmark instead of a dot — reads cleaner
  const pillW = 28;
  ctx.fillStyle = COLORS.flame;
  roundRect(ctx, W / 2 - pillW / 2, 98, pillW, 4, 2);
  ctx.fill();

  // Tagline
  const tagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = "500 15px Inter, sans-serif";
  ctx.fillText(tagline, W / 2, 128);

  // QR card with signature hard-shadow
  const cardSize = 340;
  const cardX = (W - cardSize) / 2;
  const cardY = 168;
  const offset = 8;
  const radius = 20;

  ctx.fillStyle = COLORS.inkNight;
  roundRect(ctx, cardX + offset, cardY + offset, cardSize, cardSize, radius);
  ctx.fill();

  ctx.fillStyle = COLORS.paperCard;
  roundRect(ctx, cardX, cardY, cardSize, cardSize, radius);
  ctx.fill();
  ctx.strokeStyle = COLORS.inkNight;
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardSize, cardSize, radius);
  ctx.stroke();

  const qrPad = 30;
  ctx.drawImage(
    qrImg,
    cardX + qrPad,
    cardY + qrPad,
    cardSize - qrPad * 2,
    cardSize - qrPad * 2
  );

  // Short URL
  ctx.fillStyle = COLORS.inkText;
  ctx.font = "600 19px 'JetBrains Mono', monospace";
  ctx.fillText(shortUrl, W / 2, cardY + cardSize + offset + 58);

  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = "400 13px Inter, sans-serif";
  ctx.fillText("Shorter links. Bigger impact.", W / 2, cardY + cardSize + offset + 84);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function QrCodePreview({ shortCode, shortUrl }) {
  const [rawSrc, setRawSrc] = useState(null);
  const [bannerSrc, setBannerSrc] = useState(null);
  const [bannerBlob, setBannerBlob] = useState(null);
  const [failed, setFailed] = useState(false);
  const { copied, copy } = useClipboard();
  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  const bannerObjectUrlRef = useRef(null);

  useEffect(() => {
    let objectUrl;
    let cancelled = false;

    linksApi
      .qrCodeUrl(shortCode)
      .then(async (url) => {
        if (cancelled) return;
        objectUrl = url;
        setRawSrc(url);
        setFailed(false);

        const blob = await buildBanner(url, shortUrl);
        if (cancelled) return;

        if (bannerObjectUrlRef.current) {
          URL.revokeObjectURL(bannerObjectUrlRef.current);
        }
        const bannerUrl = URL.createObjectURL(blob);
        bannerObjectUrlRef.current = bannerUrl;
        setBannerBlob(blob);
        setBannerSrc(bannerUrl);
      })
      .catch(() => {
        if (cancelled) return;
        setRawSrc(null);
        setFailed(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (bannerObjectUrlRef.current) URL.revokeObjectURL(bannerObjectUrlRef.current);
    };
  }, [shortCode, shortUrl]);

  const handleShare = async () => {
    if (!canShare) return;

    // Only ever pass ONE representation of the link — some share targets
    // (WhatsApp included) append `url` on its own line even when it's
    // already embedded in `text`, which duplicates it in the message.
    const shareData = bannerBlob
      ? {
          title: "GoURL",
          text: `Check this out — ${shortUrl}`,
          files: [new File([bannerBlob], `${shortCode}.png`, { type: "image/png" })],
        }
      : { title: "GoURL", text: `Check this out — ${shortUrl}` };

    try {
      if (shareData.files && !navigator.canShare?.({ files: shareData.files })) {
        delete shareData.files;
      }
      await navigator.share(shareData);
    } catch {
      // user cancelled the share sheet — no-op
    }
  };

  if (failed) {
    return <p className="text-[13px] text-ink-500">Couldn't load the QR code.</p>;
  }

  if (!rawSrc) {
    return (
      <div className="grid h-56 w-56 place-items-center rounded-[10px] border border-dashed border-ink-950/15">
        <Loader2 size={18} className="animate-spin text-ink-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="overflow-hidden rounded-[14px] border border-ink-950/10 shadow-[var(--shadow-card)]">
        <img
          src={bannerSrc ?? rawSrc}
          alt={`Shareable QR banner for ${shortCode}`}
          className="w-64"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          as="a"
          href={bannerSrc ?? rawSrc}
          download={`${shortCode}-gourl.png`}
          variant="secondary"
          size="sm"
        >
          <Download size={14} />
          Download
        </Button>

        <Button variant="secondary" size="sm" onClick={() => copy(shortUrl)}>
          {copied ? (
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

        {canShare && (
          <Button variant="secondary" size="sm" onClick={handleShare}>
            <Share2 size={14} />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}