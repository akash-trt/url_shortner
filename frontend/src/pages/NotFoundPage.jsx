import { Link } from "react-router-dom";
import { Link2Off } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Logo } from "@/shared/components/Logo";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper-50 px-6">
      <div className="flex flex-col items-center text-center">
        <Link to="/" className="mb-10">
          <Logo />
        </Link>
        <div className="grid h-16 w-16 place-items-center rounded-[10px] border border-ink-950 bg-ink-950 text-paper-50 shadow-[var(--shadow-hard)]">
          <Link2Off size={26} />
        </div>
        <h1 className="mt-6 font-display text-[54px] font-extrabold leading-none">404</h1>
        <p className="mt-2 font-display text-lg font-bold">This link took a wrong turn</p>
        <p className="mt-2 max-w-xs text-[13.5px] text-ink-500">
          Whatever you were looking for isn't at this address anymore — or never was.
        </p>
        <Button as={Link} to="/" className="mt-7">
          Take me home
        </Button>
      </div>
    </div>
  );
}
