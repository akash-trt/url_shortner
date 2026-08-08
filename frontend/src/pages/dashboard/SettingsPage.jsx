import { useNavigate } from "react-router-dom";
import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <Card className="p-5">
        <p className="mb-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
          Profile
        </p>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[8px] border border-ink-950 bg-ink-950 font-mono text-[16px] font-bold text-paper-50">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[14.5px] font-semibold text-ink-950">
              <UserIcon size={14} className="text-ink-300" />
              {user?.name}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13.5px] text-ink-500">
              <Mail size={13} className="text-ink-300" />
              {user?.email}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12.5px] text-ink-300">
          Editing your name or email isn't available yet — this is read straight from your account.
        </p>
      </Card>

      <Card className="p-5">
        <p className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
          Session
        </p>
        <div className="flex items-center justify-between">
          <p className="text-[13.5px] text-ink-700">Sign out of GoURL on this device.</p>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut size={14} />
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
