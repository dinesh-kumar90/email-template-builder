type TemplateBlock = {
  type: "heading" | "paragraph" | "button" | "divider";
  text?: string;
  url?: string;
};

type TemplateContent = {
  blocks: TemplateBlock[];
};

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderTemplateHtml(contentJson: string) {
  try {
    const parsed = JSON.parse(contentJson) as TemplateContent;
    const blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];

    return blocks
      .map((block) => {
        if (block.type === "heading") {
          return `<h1 style=\"font-family:Arial,sans-serif;font-size:28px;line-height:1.3;margin:0 0 16px;\">${escapeHtml(block.text ?? "")}</h1>`;
        }

        if (block.type === "paragraph") {
          return `<p style=\"font-family:Arial,sans-serif;font-size:16px;line-height:1.6;margin:0 0 16px;color:#1f2937;\">${escapeHtml(block.text ?? "")}</p>`;
        }

        if (block.type === "button") {
          return `<p style=\"margin:0 0 20px;\"><a href=\"${escapeHtml(block.url ?? "#")}\" style=\"display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;\">${escapeHtml(block.text ?? "Click")}</a></p>`;
        }

        if (block.type === "divider") {
          return '<hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;" />';
        }

        return "";
      })
      .join("\n");
  } catch {
    return "<p style=\"font-family:Arial,sans-serif;color:#b91c1c;\">Invalid template JSON.</p>";
  }
}
