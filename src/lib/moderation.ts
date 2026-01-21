import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export type ModerationStatus = "APPROVED" | "FLAGGED" | "REJECTED";

export interface ModerationResult {
  status: ModerationStatus;
  reason?: string;
}

export async function moderateBookingText(
  text: string,
): Promise<ModerationResult> {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: `
You are a content moderation system for a professional booking app.

Classify the text into one of:
- APPROVED: normal professional booking request
- FLAGGED: suspicious, aggressive, sexual, unclear intent
- REJECTED: explicit sexual content, threats, hate, illegal content

Respond ONLY with valid JSON:
{
  "status": "APPROVED" | "FLAGGED" | "REJECTED",
  "reason": "short explanation"
}
`,
    prompt: text,
  });

  let parsed: ModerationResult;

  try {
    parsed = JSON.parse(result.text);
  } catch {
    return {
      status: "FLAGGED",
      reason: "Invalid moderation response",
    };
  }

  return parsed;
}
