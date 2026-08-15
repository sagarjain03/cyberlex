import { MODEL } from "@/lib/ai/config";
import { isAiConfigured } from "@/lib/env";

/**
 * Liveness plus whether the AI provider is configured.
 *
 * Booleans and the model id only — never key material, never a key prefix,
 * never a length. docs/rules.md §4.1 rule 3.
 */
export function GET() {
  return Response.json({
    ok: true,
    aiConfigured: isAiConfigured(),
    model: MODEL,
  });
}
