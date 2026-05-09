import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const templates = await prisma.emailTemplate.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Templates</h1>
        <Link href="/dashboard/templates/new" className="rounded bg-black px-4 py-2 text-white">
          New Template
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {templates.length === 0 ? (
          <p className="text-sm text-gray-600">No templates yet. Create your first one.</p>
        ) : (
          templates.map((template) => (
            <article key={template.id} className="rounded border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-medium">{template.name}</h2>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>
                <Link
                  href={`/dashboard/templates/${template.id}`}
                  className="rounded border px-3 py-2 text-sm"
                >
                  Edit
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
