import "server-only";

import Groq from "groq-sdk";

import { env } from "@/lib/env";

/**
 * Groq SDK singleton.
 *
 * The only module that touches the API key, and it is `server-only` — an
 * accidental client import fails the build rather than shipping the key.
 * docs/rules.md §4.1 rule 4.
 */
let client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!env.GROQ_API_KEY) {
    // Callers must check `isAiConfigured()` first; reaching here is a bug.
    throw new Error("AI provider not configured");
  }
  client ??= new Groq({
    apiKey: env.GROQ_API_KEY,
    // Retries are orchestrated in `summarize.ts` against the shared timeout
    // budget — letting the SDK retry independently would blow through it.
    maxRetries: 0,
  });
  return client;
}
