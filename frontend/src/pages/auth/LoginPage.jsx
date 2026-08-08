import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/app";

  return (
    <AuthLayout
      panelTitle="Every click, accounted for."
      panelBody="Sign in to manage your links, watch traffic roll in, and see exactly which channels are actually working."
    >
      <h1 className="font-display text-[26px] font-extrabold">Welcome back</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Log in to your account</p>
      <div className="mt-7">
        <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      </div>
      <p className="mt-6 text-center text-[13.5px] text-ink-500">
        Don't have an account?{" "}
        <Link to="/signup" className="font-medium text-ink-950 underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
