import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

/** Moderation status. PENDING = not yet run or API unavailable (e.g. region blocked). */
export type ModerationStatus = "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED";

export interface ModerationResult {
  status: Exclude<ModerationStatus, "PENDING">;
  reason?: string;
  categories?: string[];
}

const MODEL_ID = "gpt-4o-mini";
const PROVIDER = "openai";

/** Result of moderateBookingText; may be PENDING when provider is unavailable (e.g. 403 region). */
export type ModerationOutput = {
  status: ModerationStatus;
  reason?: string;
  categories?: string[];
  model: string;
  provider: string;
};

/**
 * Moderate booking description using Vercel AI SDK (OpenAI).
 * Only the description text is sent; no user email/name. See README for guardrails.
 * On API errors (e.g. "Country not supported" 403), returns PENDING so the booking still saves.
 */
export async function moderateBookingText(text: string): Promise<ModerationOutput> {
  try {
    const result = await generateText({
      model: openai(MODEL_ID),
      system: `You are a content moderation system for a professional booking app.
Classify the text into one of:
- APPROVED: normal professional booking request
- FLAGGED: suspicious, aggressive, sexual, unclear intent
- REJECTED: explicit sexual content, threats, hate, illegal content

Respond ONLY with valid JSON:
{ "status": "APPROVED" | "FLAGGED" | "REJECTED", "reason": "short explanation", "categories": ["optional", "category", "labels"] }`,
      prompt: text,
    });

    let parsed: ModerationResult;
    try {
      parsed = JSON.parse(result.text) as ModerationResult;
    } catch {
      return {
        status: "FLAGGED",
        reason: "Invalid moderation response",
        model: MODEL_ID,
        provider: PROVIDER,
      };
    }

    const status = ["APPROVED", "FLAGGED", "REJECTED"].includes(parsed.status)
      ? parsed.status
      : "FLAGGED";

    return {
      status,
      reason: parsed.reason,
      categories: Array.isArray(parsed.categories) ? parsed.categories : undefined,
      model: MODEL_ID,
      provider: PROVIDER,
    };
  } catch (err) {
    // OpenAI 403 "Country, region, or territory not supported" or network/provider errors:
    // do not block booking — save with PENDING so specialist can review manually
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: "PENDING",
      reason: `Moderation unavailable: ${message}`,
      model: MODEL_ID,
      provider: PROVIDER,
    };
  }
}
