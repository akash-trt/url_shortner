import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MousePointerClick,
  Users,
  Clock,
  QrCode,
  Trash2,
  Power,
} from "lucide-react";
import { useLink, useUpdateLink, useDeleteLink } from "@/features/links/hooks/useLinks";
import { useLinkAnalytics } from "@/features/analytics/hooks/useLinkAnalytics";
import { bucketClicksByDay, topN, referrerLabel } from "@/features/analytics/utils/aggregate";
import { StatCard } from "@/features/analytics/components/StatCard";
import { ClicksLineChart } from "@/features/analytics/components/ClicksLineChart";
import { TopList } from "@/features/analytics/components/TopList";
import { RecentClicksTable } from "@/features/analytics/components/RecentClicksTable";
import { LinkStatusBadge } from "@/features/links/components/LinkStatusBadge";
import { CopyButton } from "@/features/links/components/CopyButton";
import { QrCodePreview } from "@/features/links/components/QrCodePreview";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageLoader } from "@/shared/components/PageLoader";
import { validateLongUrl } from "@/shared/utils/validators";
import { formatDate, formatExactCount, timeAgo } from "@/shared/utils/format";
import { readError } from "@/shared/api/httpClient";

export default function LinkDetailPage() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const { data: link, isLoading, isError } = useLink(shortCode);
  const { summary, clicks, isLoading: analyticsLoading } = useLinkAnalytics(shortCode);
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();

  const [editing, setEditing] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [urlError, setUrlError] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) return <PageLoader />;

  if (isError || !link) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p className="font-display text-lg font-bold">Couldn't find that link</p>
        <p className="mt-1 text-[13.5px] text-ink-500">
          It may have been deleted, or you don't have access to it.
        </p>
        <Button as={Link} to="/app/links" variant="secondary" size="sm" className="mt-5">
          Back to links
        </Button>
      </div>
    );
  }

  const series = bucketClicksByDay(clicks, 7);
  const topReferrers = topN(clicks, "referrer", 5, "Direct").map((r) => ({
    ...r,
    label: r.label === "Direct" ? "Direct" : referrerLabel(r.label),
  }));
  const topCountries = topN(clicks, "country", 5, "Unknown");

  function startEditing() {
    setLongUrl(link.longUrl);
    setUrlError(null);
    setEditing(true);
  }

  function saveDestination() {
    const error = validateLongUrl(longUrl);
    setUrlError(error);
    if (error) return;

    updateLink.mutate(
      { shortCode, payload: { longUrl: longUrl.trim() } },
      {
        onSuccess: () => {
          toast.success("Destination updated.");
          setEditing(false);
        },
        onError: (err) => setUrlError(readError(err)),
      }
    );
  }

  function toggleStatus() {
    const nextStatus = link.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    updateLink.mutate(
      { shortCode, payload: { status: nextStatus } },
      {
        onSuccess: () =>
          toast.success(nextStatus === "ACTIVE" ? "Link re-enabled." : "Link disabled."),
        onError: (err) => toast.error(readError(err)),
      }
    );
  }

  function confirmDelete() {
    deleteLink.mutate(shortCode, {
      onSuccess: () => {
        toast.success("Link deleted.");
        navigate("/app/links");
      },
      onError: (err) => toast.error(readError(err)),
    });
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Link
        to="/app/links"
        className="inline-flex w-fit items-center gap-1.5 text-[13px] text-ink-500 hover:text-ink-950"
      >
        <ArrowLeft size={14} />
        Back to links
      </Link>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-extrabold">{link.shortCode}</h2>
              <LinkStatusBadge status={link.status} expiresAt={link.expiresAt} />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="block min-w-0 truncate font-mono text-[13.5px] text-ink-700 hover:underline"
              >
                {link.shortUrl}
              </a>
              <CopyButton value={link.shortUrl} />
            </div>
            <p className="mt-1 text-[12.5px] text-ink-300">
              Created {formatDate(link.createdAt)}
              {link.expiresAt && ` · Expires ${formatDate(link.expiresAt)}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setQrOpen(true)}>
              <QrCode size={14} />
              QR code
            </Button>
            <Button variant="secondary" size="sm" onClick={toggleStatus}>
              <Power size={14} />
              {link.status === "ACTIVE" ? "Disable" : "Enable"}
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-5 border-t border-ink-950/8 pt-5">
          {editing ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <Input
                label="Destination URL"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                error={urlError}
                containerClassName="flex-1"
              />
              <div className="flex gap-2 pt-1 sm:pt-6">
                <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" loading={updateLink.isPending} onClick={saveDestination}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
                  Destination
                </p>
                <a
                  href={link.longUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block min-w-0 truncate text-[13.5px] text-ink-700 hover:text-ink-950 hover:underline"
                >
                  {link.longUrl}
                </a>
              </div>
              <Button size="sm" variant="ghost" onClick={startEditing}>
                Edit
              </Button>
            </div>
          )}
        </div>
      </Card>

      {analyticsLoading ? (
        <div className="grid h-40 place-items-center rounded-[8px] border border-ink-950/10 bg-white">
          <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-300">
            Loading analytics…
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total clicks"
              value={formatExactCount(summary?.totalClicks)}
              icon={<MousePointerClick size={15} />}
            />
            <StatCard
              label="Unique visitors"
              value={formatExactCount(summary?.uniqueVisitors)}
              icon={<Users size={15} />}
            />
            <StatCard
              label="Last click"
              value={summary?.lastClickedAt ? timeAgo(summary.lastClickedAt) : "—"}
              icon={<Clock size={15} />}
            />
          </div>

          <Card className="p-5">
            <p className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
              Clicks over time
            </p>
            <ClicksLineChart data={series} />
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <TopList title="Top referrers" items={topReferrers} />
            <TopList title="Top countries" items={topCountries} />
          </div>

          <div>
            <p className="mb-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
              Recent clicks
            </p>
            <RecentClicksTable clicks={clicks.slice(0, 20)} />
          </div>
        </>
      )}

      <Modal isOpen={qrOpen} onClose={() => setQrOpen(false)} title={`QR — ${link.shortCode}`}>
        <div className="flex justify-center">
          <QrCodePreview shortCode={link.shortCode} shortUrl={link.shortUrl} />
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
    </div>
  );
}
