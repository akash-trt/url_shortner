import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Link as LinkIcon, QrCode, Pencil, Trash2, Power, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { analyticsApi } from "@/features/analytics/api/analyticsApi";
import { LinkStatusBadge } from "./LinkStatusBadge";
import { CopyButton } from "./CopyButton";
import { RowMenu, RowMenuItem } from "@/shared/components/RowMenu";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { Modal } from "@/shared/components/Modal";
import { QrCodePreview } from "./QrCodePreview";
import { useDeleteLink, useUpdateLink } from "../hooks/useLinks";
import { formatDate, prettyUrl, formatExactCount } from "@/shared/utils/format";
import { readError } from "@/shared/api/httpClient";

export function LinkRow({ link }) {
  const navigate = useNavigate();
  const [qrOpen, setQrOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteLink = useDeleteLink();
  const updateLink = useUpdateLink();

  const clickCount = useQuery({
    queryKey: ["analytics", link.shortCode, "count"],
    queryFn: () => analyticsApi.totalClicks(link.shortCode),
    staleTime: 30_000,
  });

  function toggleStatus() {
    const nextStatus = link.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    updateLink.mutate(
      { shortCode: link.shortCode, payload: { status: nextStatus } },
      {
        onSuccess: () =>
          toast.success(nextStatus === "ACTIVE" ? "Link re-enabled." : "Link disabled."),
        onError: (err) => toast.error(readError(err)),
      }
    );
  }

  function confirmDelete() {
    deleteLink.mutate(link.shortCode, {
      onSuccess: () => {
        toast.success("Link deleted.");
        setConfirmOpen(false);
      },
      onError: (err) => toast.error(readError(err)),
    });
  }

  return (
    <>
      <tr className="border-b border-ink-950/8 last:border-0 hover:bg-paper-100/60">
        <td className="py-3 pr-4">
          <RouterLink
            to={`/app/links/${link.shortCode}`}
            className="group flex items-center gap-1.5 font-medium text-ink-950 hover:underline underline-offset-2"
          >
            <LinkIcon size={13} className="text-ink-300" />
            {link.shortCode}
          </RouterLink>
        </td>
        <td className="py-3 pr-4 text-ink-500">
          <a
            href={link.longUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-[280px] items-center gap-1 truncate hover:text-ink-950 hover:underline underline-offset-2"
            title={link.longUrl}
          >
            {prettyUrl(link.longUrl)}
            <ExternalLink size={11} className="shrink-0 opacity-50" />
          </a>
        </td>
        <td className="py-3 pr-4 tabular-nums text-ink-700">
          {clickCount.isLoading ? "…" : formatExactCount(clickCount.data?.totalClicks)}
        </td>
        <td className="py-3 pr-4 text-ink-500">{formatDate(link.createdAt)}</td>
        <td className="py-3 pr-4">
          <LinkStatusBadge status={link.status} expiresAt={link.expiresAt} />
        </td>
        <td className="py-3 pl-2 text-right">
          <div className="flex items-center justify-end gap-1">
            <CopyButton value={link.shortUrl} />
            <RowMenu>
              <RowMenuItem icon={<QrCode size={14} />} onClick={() => setQrOpen(true)}>
                View QR code
              </RowMenuItem>
              <RowMenuItem icon={<Power size={14} />} onClick={toggleStatus}>
                {link.status === "ACTIVE" ? "Disable link" : "Enable link"}
              </RowMenuItem>
              <RowMenuItem
                icon={<Pencil size={14} />}
                onClick={() => navigate(`/app/links/${link.shortCode}`)}
              >
                Edit destination
              </RowMenuItem>
              <RowMenuItem icon={<Trash2 size={14} />} danger onClick={() => setConfirmOpen(true)}>
                Delete link
              </RowMenuItem>
            </RowMenu>
          </div>
        </td>
      </tr>

      <Modal isOpen={qrOpen} onClose={() => setQrOpen(false)} title={`QR — ${link.shortCode}`}>
        <div className="flex justify-center">
          <QrCodePreview shortCode={link.shortCode} />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete this link?"
        description={`${link.shortUrl} will stop redirecting immediately. This can't be undone.`}
        confirmLabel="Delete link"
        loading={deleteLink.isPending}
      />
    </>
  );
}
