import type { TiptapDoc } from "@/lib/rich-text";

/**
 * Safely renders Tiptap JSON as React nodes. No raw HTML to avoid XSS.
 * Supports: paragraph, text, bold, italic, link, bulletList, orderedList, listItem.
 */
export function RichTextContent({
  doc,
  className,
}: {
  doc: TiptapDoc | null | undefined;
  className?: string;
}) {
  if (!doc) return null;
  const content = doc.content ?? [];
  return (
    <div className={className}>
      {content.map((node, i) => (
        <NodeRenderer key={i} node={node as TiptapDoc} />
      ))}
    </div>
  );
}

function NodeRenderer({ node }: { node: TiptapDoc }) {
  const type = node.type ?? "paragraph";
  const children = Array.isArray(node.content)
    ? node.content.map((n, i) => <NodeRenderer key={i} node={n as TiptapDoc} />)
    : node.text ?? "";

  switch (type) {
    case "paragraph":
      return <p className="mb-2 last:mb-0">{children}</p>;
    case "bulletList":
      return <ul className="list-disc pl-6 mb-2">{children}</ul>;
    case "orderedList":
      return <ol className="list-decimal pl-6 mb-2">{children}</ol>;
    case "listItem":
      return <li className="mb-1">{children}</li>;
    case "text": {
      let out: React.ReactNode = node.text ?? "";
      const marks = (node as { marks?: { type: string; attrs?: { href?: string } }[] }).marks ?? [];
      for (const m of marks) {
        if (m.type === "bold") out = <strong>{out}</strong>;
        else if (m.type === "italic") out = <em>{out}</em>;
        else if (m.type === "link" && m.attrs?.href)
          out = (
            <a href={m.attrs.href} target="_blank" rel="noopener noreferrer" className="underline">
              {out}
            </a>
          );
      }
      return <>{out}</>;
    }
    default:
      return <span>{children}</span>;
  }
}
