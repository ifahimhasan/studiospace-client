import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { Spinner } from "@/components/ui";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <AuthShell>
      <Suspense fallback={<Spinner className="py-20" label="Loading…" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
