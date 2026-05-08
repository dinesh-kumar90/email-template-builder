import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  const { callbackUrl } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Sign In</h1>
      <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} />
      <div className="flex items-center justify-between text-sm">
        <Link href="/register" className="underline">
          Create account
        </Link>
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </div>
    </main>
  );
}
