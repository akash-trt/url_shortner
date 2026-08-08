import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageLoader } from "@/shared/components/PageLoader";

export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "booting") return <PageLoader />;

  if (status === "guest") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
