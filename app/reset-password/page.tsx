import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 p-6">
        <h1 className="text-2xl font-semibold">Invalid Link</h1>
        <p className="text-sm text-gray-600">Reset token is missing.</p>
        <Link href="/forgot-password" className="underline">
          Request a new reset link
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Reset Password</h1>
      <ResetPasswordForm token={token} />
    </main>
  );
}
