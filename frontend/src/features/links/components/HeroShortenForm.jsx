import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CreateLinkForm } from "@/features/links/components/CreateLinkForm";
import { CopyButton } from "@/features/links/components/CopyButton";
import { QrCodePreview } from "@/features/links/components/QrCodePreview";
import { Button } from "@/shared/components/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCreateLink } from "@/features/links/hooks/useLinks";
import { readError } from "@/shared/api/httpClient";

/**
 * Only signed-in users can actually create a link — the API requires auth
 * (by design, so links are always owned by someone). For a signed-out
 * visitor, submitting the hero form takes them straight to sign-up with
 * their URL preserved, instead of pretending to shorten it.
 */
export function HeroShortenForm() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const createLink = useCreateLink();
  const [created, setCreated] = useState(null);
  const [serverError, setServerError] = useState(null);

  function handleSubmit(payload) {
    if (status !== "authenticated") {
      const params = new URLSearchParams({ url: payload.longUrl });
      navigate(`/signup?${params.toString()}`);
      return;
    }

    setServerError(null);
    createLink.mutate(payload, {
      onSuccess: (url) => {
        setCreated(url);
        toast.success("Link created.");
      },
      onError: (err) => setServerError(readError(err)),
    });
  }

  if (created) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex w-full items-center justify-between gap-2 rounded-[6px] border border-ink-950/10 bg-paper-100 px-3 py-2.5">
          <span className="truncate font-mono text-[13px]">{created.shortUrl}</span>
          <CopyButton value={created.shortUrl} />
        </div>
        <QrCodePreview shortCode={created.shortCode} />
        <div className="flex w-full gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setCreated(null)}>
            Shorten another
          </Button>
          <Button as="a" href="/app/links" className="flex-1">
            View in dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <CreateLinkForm
      onSubmit={handleSubmit}
      submitting={createLink.isPending}
      serverError={serverError}
      submitLabel={status === "authenticated" ? "Shorten link" : "Shorten link — it's free"}
    />
  );
}
