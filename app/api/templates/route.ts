import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { renderTemplateHtml } from "@/lib/template-renderer";
import { getCurrentUserId } from "@/lib/session";

const starterContent = JSON.stringify({
  blocks: [
    { type: "heading", text: "Welcome" },
    { type: "paragraph", text: "Start editing your template." },
  ],
});

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const templates = await prisma.emailTemplate.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      subject: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { name?: string };
  const name = String(body.name ?? "Untitled Template").trim() || "Untitled Template";

  const html = renderTemplateHtml(starterContent);

  const template = await prisma.emailTemplate.create({
    data: {
      userId,
      name,
      subject: "New Template",
      content: starterContent,
      html,
    },
    select: { id: true },
  });

  return NextResponse.json({ template }, { status: 201 });
}
