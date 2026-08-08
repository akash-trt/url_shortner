import { Link2Off } from "lucide-react";
import { LinkRow } from "./LinkRow";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/components/Button";

const columns = ["Alias", "Destination", "Clicks", "Created", "Status", ""];

export function LinksTable({ links, page, limit, total, onPageChange, onCreateClick }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (links.length === 0) {
    return (
      <EmptyState
        icon={<Link2Off size={20} />}
        title="No links yet"
        description="Shorten your first link and it'll show up here, along with clicks and status."
        action={
          <Button size="sm" onClick={onCreateClick}>
            Create your first link
          </Button>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-[8px] border border-ink-950/10 bg-white">
      <table className="w-full min-w-[720px] text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-ink-950/10">
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-4 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500 first:pl-4"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:px-4">
          {links.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-ink-950/10 px-4 py-3">
          <p className="font-mono text-[11px] text-ink-500">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
