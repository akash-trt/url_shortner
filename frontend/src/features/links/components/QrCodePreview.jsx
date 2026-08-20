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
  const H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, W, H);

  // Wordmark
  ctx.fillStyle = COLORS.inkNight;
  ctx.font = "700 30px Archivo, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GOURL", W / 2, 76);

  // Flame accent dot next to wordmark
  ctx.beginPath();
  ctx.fillStyle = COLORS.flame;
  ctx.arc(W / 2 + 78, 66, 5, 0, Math.PI * 2);
  ctx.fill();

  // Tagline
  const tagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = "500 16px Inter, sans-serif";
  ctx.fillText(tagline, W / 2, 108);

  // QR card with signature hard-shadow
  const cardSize = 340;
  const cardX = (W - cardSize) / 2;
  const cardY = 150;
  const offset = 8;

  ctx.fillStyle = COLORS.inkNight;
  roundRect(ctx, cardX + offset, cardY + offset, cardSize, cardSize, 16);
  ctx.fill();

  ctx.fillStyle = COLORS.paperCard;
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 16);
  ctx.fill();
  ctx.strokeStyle = COLORS.inkNight;
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardSize, cardSize, 16);
  ctx.stroke();

  const qrPad = 28;
  ctx.drawImage(
    qrImg,
    cardX + qrPad,
    cardY + qrPad,
    cardSize - qrPad * 2,
    cardSize - qrPad * 2
  );

  // Short URL
  ctx.fillStyle = COLORS.inkText;
  ctx.font = "600 18px 'JetBrains Mono', monospace";
  ctx.fillText(shortUrl, W / 2, cardY + cardSize + offset + 56);

  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = "400 13px Inter, sans-serif";
  ctx.fillText("Shorter links. Bigger impact.", W / 2, cardY + cardSize + offset + 82);

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
    if (canShare && bannerBlob) {
      const file = new File([bannerBlob], `${shortCode}.png`, { type: "image/png" });
      const shareData = {
        title: "GoURL",
        text: `Check this out — ${shortUrl}`,
        url: shortUrl,
      };

      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ ...shareData, files: [file] });
        } else {
          await navigator.share(shareData);
        }
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