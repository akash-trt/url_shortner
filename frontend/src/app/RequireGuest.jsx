import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageLoader } from "@/shared/components/PageLoader";

export function RequireGuest() {
  const { status } = useAuth();

  if (status === "booting") return <PageLoader />;
  if (status === "authenticated") return <Navigate to="/app" replace />;

  return <Outlet />;
}
