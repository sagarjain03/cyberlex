import { BrainCircuit } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { CrimeList } from "@/components/ai-crimes/crime-list";
import { EmptyState } from "@/components/ui/states";
import { getAiCrimes } from "@/lib/data";

export default async function NotFound() {
  const crimes = await getAiCrimes();

  return (
    <PageShell
      eyebrow="404"
      title="Not a tracked technique."
      lede="v1 covers six classes of AI-enabled attack."
    >
      <EmptyState
        icon={BrainCircuit}
        headline="No such technique"
        body="These are the six currently mapped."
      />
      <CrimeList crimes={crimes} />
    </PageShell>
  );
}
