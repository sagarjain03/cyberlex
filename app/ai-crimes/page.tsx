import type { Metadata } from "next";
import { BrainCircuit } from "lucide-react";

import { PhaseStub } from "@/components/layout/phase-stub";

export const metadata: Metadata = {
  title: "AI Crimes",
  description:
    "AI-enabled attack techniques mapped to the statutes that apply — and the jurisdictions where none clearly does.",
};

export default function Page() {
  return (
    <PhaseStub
      eyebrow="Module 04"
      title="AI-enabled cyber crime"
      lede="Six technique classes mapped against every tracked jurisdiction — including where a general provision is being stretched to reach a technique it never anticipated, and where nothing bites at all."
      phase="Phase 6 · data layer ready, UI pending"
      icon={BrainCircuit}
      willInclude={[
        "Six techniques: polymorphic malware, deepfakes, model poisoning, prompt injection, social engineering swarms, autonomous exploitation",
        "Per-jurisdiction statutory mapping marked direct or analogical, with the rationale written so it can be argued with",
        "Coverage matrix: 6 techniques × 10 jurisdictions, sticky headers, horizontally scrollable",
        "'No clear coverage' and 'not researched' rendered as visually distinct states — never conflated",
        "Defensive technical profiles: how a technique works and how defenders recognise it",
      ]}
    />
  );
}
