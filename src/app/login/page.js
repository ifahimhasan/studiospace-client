import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { Spinner } from "@/components/ui";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<Spinner className="py-20" label="Loading…" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
