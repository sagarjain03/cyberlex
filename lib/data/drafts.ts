import { drafts } from "@/data/drafts";
import { jurisdictions } from "@/data/jurisdictions";
import type {
  DeveloperImpact,
  DraftLaw,
  JurisdictionCode,
  LegislativeStage,
} from "@/types";
import { LEGISLATIVE_STAGES } from "@/types";

export interface DraftFilters {
  jurisdictionCode?: JurisdictionCode;
  stage?: LegislativeStage;
  impact?: DeveloperImpact;
}

export interface DraftWithJurisdiction extends DraftLaw {
  jurisdictionName: string;
  jurisdictionShortName: string;
}

function decorate(d: DraftLaw): DraftWithJurisdiction {
  const j = jurisdictions.find((x) => x.code === d.jurisdictionCode);
  return {
    ...d,
    jurisdictionName: j?.name ?? d.jurisdictionCode,
    jurisdictionShortName: j?.shortName ?? d.jurisdictionCode,
  };
}

export async function getDraftLaws(
  filters: DraftFilters = {},
): Promise<DraftWithJurisdiction[]> {
  let result = drafts.map(decorate);

  if (filters.jurisdictionCode)
    result = result.filter(
      (d) => d.jurisdictionCode === filters.jurisdictionCode,
    );
  if (filters.stage) result = result.filter((d) => d.stage === filters.stage);
  if (filters.impact)
    result = result.filter((d) => d.developerImpact === filters.impact);

  // Most recent legislative action first.
  return result.sort((a, b) => b.lastAction.localeCompare(a.lastAction));
}

export interface StageBucket {
  stage: LegislativeStage;
  entries: DraftWithJurisdiction[];
}

/**
 * Grouped into the pipeline, in stage order, including empty buckets — the
 * pipeline visual needs every stage present so progression reads correctly
 * even where a stage happens to be empty. docs/prd.md M3-3.
 */
export async function getDraftsByStage(
  filters: DraftFilters = {},
): Promise<StageBucket[]> {
  const all = await getDraftLaws(filters);
  return LEGISLATIVE_STAGES.map((stage) => ({
    stage,
    entries: all.filter((d) => d.stage === stage),
  }));
}

/** Passed but not yet enforceable — the tracker's headline set. */
export async function getAwaitingCommencement(): Promise<
  DraftWithJurisdiction[]
> {
  return (await getDraftLaws()).filter(
    (d) => d.stage === "awaiting-notification" || d.stage === "passed",
  );
}

export async function getDraftById(
  id: string,
): Promise<DraftWithJurisdiction | null> {
  const d = drafts.find((x) => x.id === id);
  return d ? decorate(d) : null;
}
