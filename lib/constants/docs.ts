import {
  BrainCircuit,
  FileClock,
  LayoutGrid,
  Scale,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import {
  COVERAGE_LABEL,
  LEGAL_STATUS_LABEL,
  LEGAL_STATUS_TOKEN,
  COVERAGE_TOKEN,
  type CoverageLevel,
  type LegalStatus,
} from "@/types";

/**
 * Copy for `/docs` — the product's own manual.
 *
 * Content lives here rather than inline in the page for the same reason data
 * does (docs/rules.md §3.3): the page renders it, it does not own it. Labels
 * for statuses and coverage levels are *derived* from the type maps below, so
 * a renamed status can never drift out of sync with its explanation here.
 */

/* ── Reading rail ─────────────────────────────────────────────────────────── */

export interface DocSection {
  id: string;
  label: string;
}

/** Order matches the DOM order of the sections on the page. */
export const DOC_SECTIONS: readonly DocSection[] = [
  { id: "premise", label: "Premise" },
  { id: "map", label: "The map" },
  { id: "modules", label: "Modules" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "model", label: "Strictness" },
  { id: "assistant", label: "Assistant" },
  { id: "tasks", label: "Tasks" },
  { id: "limits", label: "Limits" },
] as const;

/* ── Module tour ──────────────────────────────────────────────────────────── */

export interface DocModule {
  /** Two-digit index, rendered as the tour's travelling numeral. */
  index: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** The one question this surface exists to answer. */
  question: string;
  summary: string;
  /** How to actually drive it, in order. */
  steps: readonly string[];
  /** The misreading this surface most invites. */
  caution: string;
}

export const DOC_MODULES: readonly DocModule[] = [
  {
    index: "01",
    label: "Dashboard",
    href: "/",
    icon: LayoutGrid,
    question: "Who is tracked, and what state is each headline law in?",
    summary:
      "The console: a world map on the right, a filterable index rail on the left, aggregate readout along the bottom. Lit landmass means the jurisdiction is tracked; a marker's colour is the status of its primary cyber instrument.",
    steps: [
      "Read the map first — colour is status, not strictness. Grey landmass is simply not tracked in v1.",
      "Narrow with the rail filters. Map and index are two views of one query, so both halves narrow together and can never disagree.",
      "Scan the readout strip along the bottom for the aggregate picture: how many regimes are in force, how many passed but unnotified, the tightest reporting window on record.",
      "Open any row for that jurisdiction's dossier — its instruments, penalties, reporting duties and sources.",
    ],
    caution:
      "Filter state lives in the URL, so the address bar is the share link. Send the filtered view, not a screenshot of it.",
  },
  {
    index: "02",
    label: "Compare",
    href: "/compare",
    icon: Scale,
    question: "How do two or three regimes actually differ?",
    summary:
      "A side-by-side matrix across criminal exposure, corporate penalties, reporting duties, AI obligations and extraterritorial reach — with the divergences called out rather than left for you to spot.",
    steps: [
      "Select two or three comparators. Three is the ceiling: a fourth column stops being readable before it stops fitting.",
      "Set the hypothetical annual revenue. Turnover-based penalty regimes only become comparable with flat caps once a revenue figure is assumed, and that assumption is yours to set.",
      "Read the reporting timeline as a single axis — the tightest binding initial-notification window is the one that governs your incident runbook.",
      "Follow any figure to its source before you rely on it. Every cell carries a citation and the date it was last checked.",
    ],
    caution:
      "A normalised fine is a modelled figure, not a statutory one. Flat caps and turnover percentages are not truly commensurable, and the assumption is disclosed wherever a normalised number appears.",
  },
  {
    index: "03",
    label: "Tracker",
    href: "/tracker",
    icon: FileClock,
    question: "What is coming, and what has passed but does not bind yet?",
    summary:
      "The legislative pipeline from consultation to enforceability — and, for everything that has already passed, the specific reason it is still legally inert.",
    steps: [
      "Follow the stage pipeline: consultation, introduced, in committee, passed, awaiting notification, partially in force.",
      "For anything past 'passed', read the blocker. Subordinate rules not yet made, commencement not yet gazetted, a phased schedule, a regulator not yet constituted — each implies a very different wait.",
      "Check the developer-impact rating to triage: none, low, or material engineering impact.",
      "Expand phased instruments to see which obligations are already live and which are still dated ahead.",
    ],
    caution:
      "Expected commencement dates are announcements, not guarantees. A date that has slipped once will usually slip again, and the record says when it was last checked for that reason.",
  },
  {
    index: "04",
    label: "AI Crimes",
    href: "/ai-crimes",
    icon: BrainCircuit,
    question: "Does an existing statute actually reach this technique?",
    summary:
      "AI-enabled offence techniques mapped to the provisions prosecutors would have to rely on — with the gaps left visible instead of papered over.",
    steps: [
      "Start at the coverage matrix: techniques down the side, jurisdictions across the top, one coverage verdict per cell.",
      "Open a technique for its mechanism and the indicators defenders typically observe. The framing is defensive throughout — this is not an operational guide.",
      "Read the statute mapping. Each entry names the instrument and section relied on, and argues why it does or does not reach the technique.",
      "Treat red cells as findings. A technique with no clear coverage in a major jurisdiction is the most useful thing on the page.",
    ],
    caution:
      "'Analogical' means a provision drafted before the technique existed is being stretched to cover it. That is an argument a court may reject — it is not a settled answer.",
  },
  {
    index: "05",
    label: "Assistant",
    href: "/assistant",
    icon: Sparkles,
    question: "Can I just ask in plain English?",
    summary:
      "One question, one structured answer — overview, sanctions, compliance takeaways — grounded in the records this product tracks, and explicit about what it does not know.",
    steps: [
      "Ask one specific question. Between 8 and 500 characters, enforced in the browser and again on the server.",
      "Read the answer as three parts: what the regime is, what it can do to you, and what you would have to change.",
      "Take every claim back to the module it came from. The assistant orients; the record cites.",
      "If it says it does not know, that is the answer. It is built to decline rather than fill the gap.",
    ],
    caution:
      "Generated prose is the least reliable surface here and the only one not written by a human. It is rate-limited, it can be wrong, and it is never citable.",
  },
] as const;

/* ── Vocabulary ───────────────────────────────────────────────────────────── */

export interface DocTerm {
  term: string;
  /** Design token family — drives the dot colour. docs/design.md §1.3. */
  token: string;
  meaning: string;
}

/**
 * The five states an instrument can be in. Labels come from the type map so
 * this table cannot describe a status by a name the UI no longer uses.
 */
export const DOC_LEGAL_STATUS_TERMS: readonly DocTerm[] = (
  [
    [
      "in-force",
      "Enacted, commenced and enforceable today. Obligations bind now.",
    ],
    [
      "partially-in-force",
      "Some obligations are live and others are dated ahead on a phased schedule. Which half you fall in depends on the obligation, not the instrument.",
    ],
    [
      "unnotified",
      "Passed by the legislature and legally inert. No commencement notification has issued, so nothing in it binds anyone yet. This is the state most tooling reports as 'law'.",
    ],
    [
      "draft",
      "A bill still moving through the pipeline. Its text can change and it may never commence at all.",
    ],
    [
      "repealed",
      "No longer operative. Retained because conduct is judged under the law in force when it occurred.",
    ],
  ] as const satisfies readonly (readonly [LegalStatus, string])[]
).map(([status, meaning]) => ({
  term: LEGAL_STATUS_LABEL[status],
  token: LEGAL_STATUS_TOKEN[status],
  meaning,
}));

/** How far an existing statute reaches an AI-enabled technique. */
export const DOC_COVERAGE_TERMS: readonly DocTerm[] = (
  [
    [
      "direct",
      "A provision addresses the conduct on its own terms. No interpretive stretch required.",
    ],
    [
      "analogical",
      "A general provision written before the technique existed is being read onto it. Arguable, and the rationale explains how far the stretch goes.",
    ],
    [
      "no-coverage",
      "Researched, and no provision was found that plausibly reaches it. An asserted gap, not an unfinished cell.",
    ],
    [
      "not-researched",
      "We have not established the position. Absence of a claim, not a claim of absence.",
    ],
  ] as const satisfies readonly (readonly [CoverageLevel, string])[]
).map(([coverage, meaning]) => ({
  term: COVERAGE_LABEL[coverage],
  token: COVERAGE_TOKEN[coverage],
  meaning,
}));

/**
 * The distinction the product refuses to blur. Conflating these two into one
 * blank cell would be the most misleading thing it could do — docs/rules.md §2.6.
 */
export const DOC_ABSENCE_TERMS: readonly DocTerm[] = [
  {
    term: "No specific provision",
    token: "null",
    meaning:
      "A claim about the jurisdiction: we looked, and it genuinely has no such rule.",
  },
  {
    term: "Not yet researched",
    token: "null",
    meaning:
      "A claim about us: the question is open. Never read this as a finding of nothing.",
  },
] as const;

/* ── Common tasks ─────────────────────────────────────────────────────────── */

export interface DocTask {
  task: string;
  route: string;
  href: string;
  path: string;
}

export const DOC_TASKS: readonly DocTask[] = [
  {
    task: "I am outside the country. Does its law reach me anyway?",
    route: "Dashboard",
    href: "/",
    path: "Open the jurisdiction dossier → extraterritorial reach.",
  },
  {
    task: "How fast must we report a breach if we operate in both?",
    route: "Compare",
    href: "/compare",
    path: "Select both → read the reporting timeline → take the tighter window.",
  },
  {
    task: "This passed months ago. Why is nothing enforced yet?",
    route: "Tracker",
    href: "/tracker",
    path: "Find the instrument → read its commencement blocker.",
  },
  {
    task: "Is deepfake-enabled fraud actually a crime here?",
    route: "AI Crimes",
    href: "/ai-crimes",
    path: "Coverage matrix → the technique's row → that jurisdiction's cell.",
  },
  {
    task: "Which of these regimes is stricter, and on what basis?",
    route: "Methodology",
    href: "/methodology",
    path: "Compare the scores, then read the weights that produced them.",
  },
  {
    task: "I need an orientation before I know what to ask.",
    route: "Assistant",
    href: "/assistant",
    path: "Ask in plain English, then verify every claim against the record.",
  },
] as const;

/* ── Journey flow ─────────────────────────────────────────────────────────── */

export interface DocFlowRow {
  id: string;
  /** Where you enter. */
  start: string;
  href: string;
  /** What you use to narrow the question. */
  narrow: string;
  narrowNote: string;
  /** What you end up reading. */
  land: string;
  landNote: string;
}

/**
 * The five paths through the product, and the fact that all of them terminate
 * in the same place. Rendered as a flow diagram, not prose, because "which
 * module do I even open" is a shape question.
 */
export const DOC_FLOW: readonly DocFlowRow[] = [
  {
    id: "dashboard",
    start: "Dashboard",
    href: "/",
    narrow: "Filter the index",
    narrowNote: "Region, status, AI posture, strictness band.",
    land: "Jurisdiction dossier",
    landNote: "Instruments, penalties, reporting duties, sources.",
  },
  {
    id: "compare",
    start: "Compare",
    href: "/compare",
    narrow: "Pick 2–3 regimes",
    narrowNote: "Set the revenue that normalises turnover-based fines.",
    land: "Divergence matrix",
    landNote: "Where they differ, and by how much, per dimension.",
  },
  {
    id: "tracker",
    start: "Tracker",
    href: "/tracker",
    narrow: "Stage and blocker",
    narrowNote: "What has moved, and what is holding commencement.",
    land: "Draft entry",
    landNote: "What changes, engineering impact, phase schedule.",
  },
  {
    id: "ai-crimes",
    start: "AI Crimes",
    href: "/ai-crimes",
    narrow: "Coverage matrix",
    narrowNote: "Technique against jurisdiction, one verdict per cell.",
    land: "Statute mapping",
    landNote: "The provision relied on, and why it does or does not reach.",
  },
  {
    id: "assistant",
    start: "Assistant",
    href: "/assistant",
    narrow: "One plain question",
    narrowNote: "Orientation when you do not yet know what to filter for.",
    land: "Structured answer",
    landNote: "Overview, sanctions, takeaways — then verify it.",
  },
] as const;

/* ── Commencement diagram ─────────────────────────────────────────────────── */

/** The product's founding distinction, as three states and the gap between. */
export const DOC_COMMENCEMENT_STEPS = [
  {
    label: "Passed",
    token: "pending",
    note: "The legislature has voted. Headlines are written. Nothing binds.",
  },
  {
    label: "Notified",
    token: "partial",
    note: "A commencement instrument issues, often years later, sometimes in parts.",
  },
  {
    label: "In force",
    token: "live",
    note: "Obligations attach. Only now is there anything to comply with.",
  },
] as const;
