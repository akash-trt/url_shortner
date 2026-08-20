import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LinkOff, Clock, ShieldAlert, SearchX } from "lucide-react";

const STATUS_META = {
  404: {
    icon: SearchX,
    title: "Link not found",
    body: "This short link doesn't exist — or never did.",
  },
  410: {
    icon: Clock,
    title: "This link is no longer active",
    body: "It's expired or been disabled by its owner.",
  },
  403: {
    icon: ShieldAlert,
    title: "This link has been blocked",
    body: "It was flagged and is no longer accessible.",
  },
  default: {
    icon: LinkOff,
    title: "Something went wrong",
    body: "We couldn't resolve this link. Please try again in a moment.",
  },
};

export default function RedirectHandler() {
  const { shortCode } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${import.meta.env.VITE_API_URL}/urls/resolve/${shortCode}`)
      .then(async (res) => {
        if (cancelled) return;

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError({ status: res.status, message: body.message });
          return;
        }

        const data = await res.json();
        window.location.href = data.longUrl;
      })
      .catch(() => {
        if (!cancelled) setError({ status: 0 });
      });

    return () => {
      cancelled = true;
    };
  }, [shortCode]);

  if (!error) return null;

  const meta = STATUS_META[error.status] ?? STATUS_META.default;
  const Icon = meta.icon;

  return (
    <div className="grid min-h-screen place-items-center bg-paper-50 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-950 text-paper-50">
          <Icon size={28} />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-950">
          {meta.title}
        </h1>
        <p className="max-w-sm text-[14.5px] text-ink-500">
          {error.message || meta.body}
        </p>
        <Link
          to="/"
          className="mt-2 rounded-[8px] bg-ink-950 px-5 py-2.5 text-[14px] font-medium text-paper-50 hover:bg-ink-950/90"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}