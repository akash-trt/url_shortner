import { Mail } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/components/Button";

export function ComingSoonPage({ icon, title, description }) {
  return (
    <div className="mx-auto max-w-lg py-10">
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={
          <Button
            as="a"
            href={`mailto:hello@gourl.co?subject=${encodeURIComponent(title + " — interested")}`}
            variant="secondary"
            size="sm"
          >
            <Mail size={14} />
            Let us know you're interested
          </Button>
        }
      />
    </div>
  );
}
