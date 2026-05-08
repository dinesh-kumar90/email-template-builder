import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Authenticated as: {session.user?.email}</p>
      <p>Role: {session.user?.role}</p>
      <form action="/api/auth/signout" method="POST" className="mt-2">
        <button type="submit" className="rounded border px-3 py-2">
          Sign Out
        </button>
      </form>
    </main>
  );
}
