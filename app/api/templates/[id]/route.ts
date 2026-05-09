import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { renderTemplateHtml } from "@/lib/template-renderer";
import { getCurrentUserId } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const template = await prisma.emailTemplate.findFirst({
    where: { id, userId },
  });

  if (!template) {
    return NextResponse.json({ message: "Template not found" }, { status: 404 });
  }

  return NextResponse.json({ template });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.emailTemplate.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return NextResponse.json({ message: "Template not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    subject?: string;
    content?: string;
  };

  const content = typeof body.content === "string" ? body.content : existing.content;

  const updated = await prisma.emailTemplate.update({
    where: { id },
    data: {
      name: typeof body.name === "string" ? body.name : existing.name,
      subject: typeof body.subject === "string" ? body.subject : existing.subject,
      content,
      html: renderTemplateHtml(content),
    },
  });

  return NextResponse.json({ template: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.emailTemplate.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ message: "Template not found" }, { status: 404 });
  }

  await prisma.emailTemplate.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
