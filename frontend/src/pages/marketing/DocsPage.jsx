const endpoints = [
  { method: "POST", path: "/api/v1/auth/register", body: "{ name, email, password }" },
  { method: "POST", path: "/api/v1/auth/login", body: "{ email, password }" },
  { method: "GET", path: "/api/v1/auth/me", body: "—" },
  { method: "POST", path: "/api/v1/urls", body: "{ longUrl, customAlias?, expiresAt? }" },
  { method: "GET", path: "/api/v1/urls", body: "?page=&limit=" },
  { method: "GET", path: "/api/v1/urls/:shortCode", body: "—" },
  { method: "PATCH", path: "/api/v1/urls/:shortCode", body: "{ longUrl?, expiresAt?, status? }" },
  { method: "DELETE", path: "/api/v1/urls/:shortCode", body: "—" },
  { method: "GET", path: "/api/v1/urls/:shortCode/qr", body: "→ image/png" },
  { method: "GET", path: "/api/v1/urls/:shortCode/analytics", body: "—" },
  { method: "GET", path: "/:shortCode", body: "→ 302 redirect" },
];

const methodColor = {
  GET: "text-moss-600",
  POST: "text-flame-600",
  PATCH: "text-amber-600",
  DELETE: "text-red-600",
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
        Docs
      </p>
      <h1 className="mt-2 font-display text-[36px] font-extrabold uppercase tracking-tight">
        Introduction
      </h1>
      <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-500">
        GoURL's API handles link creation, redirects, and analytics. All authenticated
        routes expect a <code className="rounded bg-paper-200 px-1 py-0.5 font-mono text-[12.5px]">Bearer</code>{" "}
        access token; the refresh token travels in an httpOnly cookie.
      </p>

      <div className="mt-8 rounded-[8px] border border-ink-950/10 bg-white p-5">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
          Base URL
        </p>
        <p className="mt-2 font-mono text-[15px] text-ink-950">
          {import.meta.env.VITE_API_URL || "/api/v1"}
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-[8px] border border-ink-950/10 bg-white">
        <table className="w-full min-w-[560px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-ink-950/10">
              <th className="px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-500">
                Method
              </th>
              <th className="px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-500">
                Endpoint
              </th>
              <th className="px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-500">
                Payload
              </th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((e) => (
              <tr key={e.method + e.path} className="border-b border-ink-950/8 last:border-0">
                <td className={`px-4 py-2.5 font-mono text-[12px] font-bold ${methodColor[e.method]}`}>
                  {e.method}
                </td>
                <td className="px-4 py-2.5 font-mono text-[12.5px] text-ink-950">{e.path}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] text-ink-500">{e.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
