import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { PhaseStub } from "@/components/layout/phase-stub";

export const metadata: Metadata = {
  title: "Assistant",
  description:
    "Ask a plain-English question about global cyber law and get a structured, source-grounded answer.",
};

export default function Page() {
  return (
    <PhaseStub
      eyebrow="Module 05"
      title="Legal assistant"
      lede="Ask in plain English, get a structured answer — overview, sanctions, compliance takeaways — grounded in the records this product actually tracks."
      phase="Phase 7 · requires the Groq integration"
      icon={Sparkles}
      willInclude={[
        "Single-turn question → three fixed sections: Overview, Sanctions, Compliance Takeaways",
        "Grounded in tracked jurisdiction and law records, with the records it used linked back into the app",
        "Response validated against a schema before render — a partially-valid answer is a failure, not a degraded success",
        "Self-reported confidence and an explicit out-of-scope state, rather than a confident-looking guess",
        "Every failure mode designed: rate limit, timeout, malformed output, provider unavailable",
        "AI output visually distinct from curated data, with a non-dismissible disclaimer attached",
      ]}
    />
  );
}
