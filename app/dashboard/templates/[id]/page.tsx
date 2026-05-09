import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { TemplateEditor } from "@/components/templates/template-editor";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TemplateDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const template = await prisma.emailTemplate.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!template) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Template</h1>
        <Link href="/dashboard/templates" className="underline">
          Back to templates
        </Link>
      </div>
      <TemplateEditor initialTemplate={template} />
    </main>
  );
}
