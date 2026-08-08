import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { useCreateLink } from "@/features/links/hooks/useLinks";

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingUrl = searchParams.get("url");
  const createLink = useCreateLink();

  async function handleSuccess() {
    if (pendingUrl) {
      createLink.mutate(
        { longUrl: pendingUrl },
        {
          onSuccess: () => toast.success("Account created — your link is ready in the dashboard."),
        }
      );
    }
    navigate("/app", { replace: true });
  }

  return (
    <AuthLayout
      panelTitle="Start shortening in seconds."
      panelBody="Free to start. Create branded short links, generate QR codes, and track clicks the moment they happen."
    >
      <h1 className="font-display text-[26px] font-extrabold">Create your account</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">
        {pendingUrl ? "One step left before your link goes live." : "Start shortening links in seconds"}
      </p>
      <div className="mt-7">
        <SignupForm onSuccess={handleSuccess} />
      </div>
      <p className="mt-6 text-center text-[13.5px] text-ink-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-ink-950 underline underline-offset-2">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
