import { useState } from "react";
import { Link, Wand2 } from "lucide-react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { validateLongUrl, validateAlias } from "@/shared/utils/validators";

const DEFAULT_EXPIRY_DAYS = 90;

function toLocalDateTimeValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getDefaultExpiryValue() {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + DEFAULT_EXPIRY_DAYS);
  return toLocalDateTimeValue(expiryDate);
}

function toIsoFromLocalDateTime(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function CreateLinkForm({ onSubmit, submitting, serverError, submitLabel = "Shorten link" }) {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState(getDefaultExpiryValue);
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {
      longUrl: validateLongUrl(longUrl),
      customAlias: validateAlias(customAlias),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    onSubmit({
      longUrl: longUrl.trim(),
      ...(customAlias.trim() ? { customAlias: customAlias.trim() } : {}),
      ...(expiresAt ? { expiresAt: toIsoFromLocalDateTime(expiresAt) } : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Destination URL"
        icon={<Link size={15} />}
        placeholder="https://example.com/your-long-url"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        error={errors.longUrl}
        autoFocus
      />
      <Input
        label="Custom alias (optional)"
        placeholder="e.g. launch-2026"
        value={customAlias}
        onChange={(e) => setCustomAlias(e.target.value)}
        error={errors.customAlias}
        hint={!errors.customAlias ? "Leave blank and we'll generate one." : undefined}
      />
      <Input
        label="Expires at"
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        hint="Defaults to 90 days from creation."
      />
      {serverError && (
        <p className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" loading={submitting} className="mt-1">
        <Wand2 size={16} />
        {submitLabel}
      </Button>
    </form>
  );
}
