import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Forgot Password</h1>
      <p className="text-sm text-gray-600">
        Enter your email. If it exists, a reset link will be generated.
      </p>
      <ForgotPasswordForm />
      <p className="text-sm">
        Back to{" "}
        <Link href="/login" className="underline">
          login
        </Link>
      </p>
    </main>
  );
}
