import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/components/Button";
import { CreateLinkForm } from "./CreateLinkForm";
import { QrCodePreview } from "./QrCodePreview";
import { CopyButton } from "./CopyButton";
import { useCreateLink } from "../hooks/useLinks";
import { readError } from "@/shared/api/httpClient";

export function CreateLinkModal({ isOpen, onClose }) {
  const [created, setCreated] = useState(null);
  const [serverError, setServerError] = useState(null);
  const createLink = useCreateLink();

  function handleClose() {
    setCreated(null);
    setServerError(null);
    onClose();
  }

  function handleSubmit(payload) {
    setServerError(null);
    createLink.mutate(payload, {
      onSuccess: (url) => {
        setCreated(url);
        toast.success("Link created — ready to share.");
      },
      onError: (err) => setServerError(readError(err)),
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={created ? "Your link is live" : "Create new link"}>
      {created ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex w-full items-center justify-between gap-2 rounded-[6px] border border-ink-950/10 bg-paper-100 px-3 py-2.5">
            <span className="truncate font-mono text-[13px] text-ink-950">{created.shortUrl}</span>
            <CopyButton value={created.shortUrl} />
          </div>
          <QrCodePreview shortCode={created.shortCode} />
          <div className="flex w-full gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setCreated(null)}>
              Create another
            </Button>
            <Button className="flex-1" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <CreateLinkForm
          onSubmit={handleSubmit}
          submitting={createLink.isPending}
          serverError={serverError}
        />
      )}
    </Modal>
  );
}
