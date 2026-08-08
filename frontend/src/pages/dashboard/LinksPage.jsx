import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";
import { useLinks } from "@/features/links/hooks/useLinks";
import { LinksTable } from "@/features/links/components/LinksTable";
import { Button } from "@/shared/components/Button";

export default function LinksPage() {
  const { openCreateModal } = useOutletContext();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const limit = 10;

  const { data, isLoading, isError } = useLinks({ page, limit });

  const filtered = useMemo(() => {
    const links = data?.data ?? [];
    if (!query.trim()) return links;
    const q = query.trim().toLowerCase();
    return links.filter(
      (l) => l.shortCode.toLowerCase().includes(q) || l.longUrl.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            placeholder="Search links…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-[6px] border border-ink-950/15 bg-white pl-9 pr-3 text-[13.5px] placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-ink-950/10"
          />
        </div>
        <Button onClick={openCreateModal}>New link</Button>
      </div>

      {isLoading ? (
        <div className="grid h-40 place-items-center rounded-[8px] border border-ink-950/10 bg-white">
          <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-300">Loading…</p>
        </div>
      ) : isError ? (
        <p className="rounded-[8px] border border-red-200 bg-red-50 p-5 text-[13.5px] text-red-700">
          Couldn't load your links. Try refreshing the page.
        </p>
      ) : (
        <LinksTable
          links={filtered}
          page={page}
          limit={limit}
          total={data?.total ?? 0}
          onPageChange={setPage}
          onCreateClick={openCreateModal}
        />
      )}
    </div>
  );
}
