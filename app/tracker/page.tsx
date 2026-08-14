import type { Metadata } from "next";
import { FileClock } from "lucide-react";

import { PhaseStub } from "@/components/layout/phase-stub";

export const metadata: Metadata = {
  title: "Tracker",
  description:
    "Laws passed but not yet in force, and bills still under review — the gap between enactment and enforceability.",
};

export default function Page() {
  return (
    <PhaseStub
      eyebrow="Module 03"
      title="Draft & unnotified tracker"
      lede="A law can be passed and still bind no one. This tracks the gap between enactment and enforceability — and what is blocking commencement."
      phase="Phase 5 · data layer ready, UI pending"
      icon={FileClock}
      willInclude={[
        "Pipeline view: consultation → introduced → in committee → passed → awaiting notification → partially in force",
        "For unnotified acts: date passed, what is blocking commencement, and any announced date",
        "For bills: stage, sponsor, last action, and plain-language 'what would change'",
        "Phased commencement rendered as an obligation → applicable-from timeline, not a binary badge",
        "Developer-impact flag with the engineering implication in one line",
        "Jurisdiction and impact filters held in the URL",
      ]}
    />
  );
}
