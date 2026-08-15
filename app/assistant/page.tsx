import type { Metadata } from "next";

import { PageShell, Section } from "@/components/layout/page-shell";
import { AssistantConsole } from "@/components/assistant/assistant-console";
import { isAiConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Assistant",
  description:
    "Ask a plain-English question about global cyber law and get a structured, source-grounded answer.",
};

export default function Page() {
  // Read on the server: whether the provider is configured is a boolean the
  // client may know, but the key itself never crosses the boundary.
  const aiConfigured = isAiConfigured();

  return (
    <PageShell
      eyebrow="Module 05"
      title={
        <>
          Ask it
          <span className="font-serif italic text-ink-500"> plainly. </span>
        </>
      }
      lede="One question, one structured answer — overview, sanctions, compliance takeaways — grounded in the records this product tracks. It will tell you when it doesn't know."
    >
      <Section label="Console">
        <AssistantConsole aiConfigured={aiConfigured} />
      </Section>
    </PageShell>
  );
}
