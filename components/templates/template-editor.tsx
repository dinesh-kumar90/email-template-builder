"use client";

import { useMemo, useState } from "react";

type Template = {
  id: string;
  name: string;
  subject: string;
  content: string;
  html: string;
};

export function TemplateEditor({ initialTemplate }: { initialTemplate: Template }) {
  const [name, setName] = useState(initialTemplate.name);
  const [subject, setSubject] = useState(initialTemplate.subject);
  const [content, setContent] = useState(initialTemplate.content);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const parsedPreview = useMemo(() => {
    try {
      const parsed = JSON.parse(content) as {
        blocks?: Array<{ type?: string; text?: string; url?: string }>;
      };

      const blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];

      return blocks
        .map((block) => {
          if (block.type === "heading") {
            return `<h1 style=\"font-family:Arial,sans-serif;font-size:28px;line-height:1.3;margin:0 0 16px;\">${block.text ?? ""}</h1>`;
          }
          if (block.type === "paragraph") {
            return `<p style=\"font-family:Arial,sans-serif;font-size:16px;line-height:1.6;margin:0 0 16px;color:#1f2937;\">${block.text ?? ""}</p>`;
          }
          if (block.type === "button") {
            return `<p style=\"margin:0 0 20px;\"><a href=\"${block.url ?? "#"}\" style=\"display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;\">${block.text ?? "Click"}</a></p>`;
          }
          if (block.type === "divider") {
            return '<hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;" />';
          }
          return "";
        })
        .join("\n");
    } catch {
      return "<p style='font-family:Arial,sans-serif;color:#b91c1c;'>Invalid JSON</p>";
    }
  }, [content]);

  const onSave = async () => {
    setSaving(true);
    setStatus(null);

    const res = await fetch(`/api/templates/${initialTemplate.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subject, content }),
    });

    setSaving(false);

    if (!res.ok) {
      setStatus("Failed to save template");
      return;
    }

    setStatus("Saved");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Template Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Email Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Template JSON</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            className="rounded border px-3 py-2 font-mono text-sm"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {status ? <p className="text-sm text-gray-700">{status}</p> : null}
        </div>
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-4 text-sm font-medium text-gray-600">Live Preview</h2>
        <div
          className="rounded border bg-white p-5"
          dangerouslySetInnerHTML={{ __html: parsedPreview }}
        />
      </section>
    </div>
  );
}
