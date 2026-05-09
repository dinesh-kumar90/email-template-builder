import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderTemplateHtml } from "@/lib/template-renderer";

const starterContent = JSON.stringify({
  blocks: [
    { type: "heading", text: "Welcome" },
    { type: "paragraph", text: "Start editing your template." },
  ],
});

export default async function NewTemplatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const template = await prisma.emailTemplate.create({
    data: {
      userId: session.user.id,
      name: "Untitled Template",
      subject: "New Template",
      content: starterContent,
      html: renderTemplateHtml(starterContent),
    },
    select: { id: true },
  });

  redirect(`/dashboard/templates/${template.id}`);
}
