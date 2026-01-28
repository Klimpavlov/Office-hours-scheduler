/**
 * Rich-text utilities for Tiptap JSON.
 * Storage format: Tiptap Document JSON. Allowed: doc, paragraph, text, bold, italic, link, bulletList, orderedList, listItem.
 * See README for full docs.
 */

export type TiptapDoc = {
  type?: string;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};

type TiptapNode = TiptapDoc & Record<string, unknown>;

const MAX_CHARS = 10_000;

/** Recursively extract plain text from Tiptap JSON for moderation and display. */
export function getTextFromTiptapJson(doc: TiptapDoc | null | undefined): string {
  if (!doc) return "";
  if (typeof doc.text === "string") return doc.text;
  const parts: string[] = [];
  if (Array.isArray(doc.content)) {
    for (const node of doc.content) {
      parts.push(getTextFromTiptapJson(node as TiptapDoc));
    }
  }
  return parts.join(" ");
}

/** Allowed top-level and inline node types (Tiptap). */
const ALLOWED_TYPES = new Set([
  "doc",
  "paragraph",
  "text",
  "bold",
  "italic",
  "link",
  "bulletList",
  "orderedList",
  "listItem",
  "hardBreak",
]);

function countChars(node: TiptapNode, acc: { n: number }): void {
  if (acc.n > MAX_CHARS) return;
  if (typeof (node as TiptapDoc).text === "string") {
    acc.n += (node as TiptapDoc).text!.length;
    return;
  }
  const content = (node as TiptapDoc).content;
  if (Array.isArray(content)) {
    for (const c of content) {
      countChars(c as TiptapNode, acc);
    }
  }
}

function validateNodeTypes(node: TiptapNode): boolean {
  const t = (node as TiptapDoc).type;
  if (t && !ALLOWED_TYPES.has(t)) return false;
  const content = (node as TiptapDoc).content;
  if (Array.isArray(content)) {
    return content.every((c) => validateNodeTypes(c as TiptapNode));
  }
  const marks = (node as TiptapDoc).marks;
  if (Array.isArray(marks)) {
    for (const m of marks) {
      if (m?.type && !ALLOWED_TYPES.has(m.type)) return false;
    }
  }
  return true;
}

export function validateTiptapDoc(doc: unknown): doc is TiptapDoc {
  if (!doc || typeof doc !== "object") return false;
  const d = doc as TiptapDoc;
  if (d.type !== "doc" && d.type !== undefined) return false;
  const acc = { n: 0 };
  countChars(doc as TiptapNode, acc);
  if (acc.n > MAX_CHARS) return false;
  return validateNodeTypes(doc as TiptapNode);
}

export const MAX_DESCRIPTION_CHARS = MAX_CHARS;
