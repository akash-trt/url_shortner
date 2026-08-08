import { useState } from "react";
import { Link, Wand2 } from "lucide-react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { validateLongUrl, validateAlias } from "@/shared/utils/validators";

export function CreateLinkForm({ onSubmit, submitting, serverError, submitLabel = "Shorten link" }) {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
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
