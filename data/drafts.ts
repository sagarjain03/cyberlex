import type { DraftLaw } from "@/types";

/**
 * The tracker: instruments between passage and enforceability, and bills still
 * in the pipeline. The product's differentiator. docs/prd.md §3 Module 3.
 *
 * ⚠️ All records `needs-review`. Legislative state is the fastest-moving data
 * in the product and the most likely to be stale — check before relying.
 */
const V = {
  lastVerified: "2026-08-15",
  verification: "needs-review",
} as const;

export const drafts: DraftLaw[] = [
  // ── Awaiting notification ─────────────────────────────────────────────────
  {
    ...V,
    id: "in-dpdp-commencement",
    jurisdictionCode: "IN",
    title: "Digital Personal Data Protection Act, 2023 — commencement",
    shortTitle: "DPDP Act commencement",
    stage: "awaiting-notification",
    datePassed: "2023-08-11",
    blocker: "rules-pending",
    expectedCommencement: null,
    expectedCommencementNote:
      "Phased commencement signalled alongside the subordinate rules; no single binding date has been notified for all obligations.",
    sponsor: "Ministry of Electronics and Information Technology",
    lastAction: "2025-11-14",
    lastActionNote:
      "Subordinate rules progressed following public consultation; obligations remain contingent on notified commencement.",
    whatChanges:
      "Consent-notice requirements, data-principal rights, breach notification to the Data Protection Board, and significant-data-fiduciary duties including DPIAs and audits become enforceable.",
    developerImpact: "material",
    impactNote:
      "Consent capture, purpose logging, deletion pipelines and breach-notification tooling all need to exist before commencement, not after.",
    sources: [{ sourceId: "in-dpdp-2023" }],
  },
  {
    ...V,
    id: "us-circia-rule",
    jurisdictionCode: "US",
    title:
      "CIRCIA reporting requirements — pending implementing regulations",
    shortTitle: "CIRCIA final rule",
    stage: "awaiting-notification",
    datePassed: "2022-03-15",
    blocker: "rules-pending",
    expectedCommencement: null,
    expectedCommencementNote:
      "Reporting duties attach only once CISA's final rule takes effect; the statute itself imposes no immediate obligation on covered entities.",
    sponsor: "Cybersecurity and Infrastructure Security Agency",
    lastAction: "2026-05-01",
    lastActionNote:
      "Rulemaking ongoing following the notice of proposed rulemaking and comment period.",
    whatChanges:
      "Covered critical-infrastructure entities must report substantial cyber incidents within 72 hours and ransom payments within 24 hours, with data-preservation duties attached.",
    developerImpact: "material",
    impactNote:
      "A 72-hour clock requires detection-to-report tooling and a preserved evidence trail; retrofitting this after the rule lands is expensive.",
    sources: [{ sourceId: "us-circia" }],
  },
  {
    ...V,
    id: "ae-pdpl-regulations",
    jurisdictionCode: "AE",
    title:
      "Federal Decree-Law No. 45 of 2021 — pending executive regulations",
    shortTitle: "UAE PDPL executive regulations",
    stage: "awaiting-notification",
    datePassed: "2021-09-20",
    blocker: "rules-pending",
    expectedCommencement: null,
    sponsor: "UAE Cabinet",
    lastAction: "2026-02-10",
    lastActionNote:
      "Executive regulations still outstanding; the compliance grace period has not begun to run in full.",
    whatChanges:
      "Data-subject rights, cross-border transfer conditions, breach notification and DPO appointment duties become operative.",
    developerImpact: "low",
    impactNote:
      "Scope and transfer conditions remain unsettled, so building to a specific standard now risks rework.",
    sources: [{ sourceId: "ae-pdpl" }],
  },

  // ── Partially in force ────────────────────────────────────────────────────
  {
    ...V,
    id: "eu-ai-act-phases",
    jurisdictionCode: "EU",
    title: "Regulation (EU) 2024/1689 — staged application",
    shortTitle: "EU AI Act phases",
    stage: "partially-in-force",
    datePassed: "2024-06-13",
    blocker: "phased-schedule",
    expectedCommencement: "2027-08-02",
    expectedCommencementNote: "Final tranche for Annex I regulated products.",
    sponsor: "European Parliament and Council",
    lastAction: "2025-08-02",
    lastActionNote: "General-purpose AI model obligations became applicable.",
    whatChanges:
      "High-risk system obligations — risk management, data governance, logging, human oversight, conformity assessment — attach on the Annex III date.",
    developerImpact: "material",
    impactNote:
      "If a product touches an Annex III use case, conformity assessment and technical documentation are engineering work with a long lead time.",
    phases: [
      { obligation: "Prohibited practices", applicableFrom: "2025-02-02", inForce: true },
      { obligation: "GPAI model obligations", applicableFrom: "2025-08-02", inForce: true },
      { obligation: "High-risk systems (Annex III)", applicableFrom: "2026-08-02", inForce: false },
      { obligation: "High-risk in regulated products (Annex I)", applicableFrom: "2027-08-02", inForce: false },
    ],
    sources: [{ sourceId: "eu-ai-act" }],
  },
  {
    ...V,
    id: "eu-cra-phases",
    jurisdictionCode: "EU",
    title: "Regulation (EU) 2024/2847 — staged application",
    shortTitle: "Cyber Resilience Act phases",
    stage: "partially-in-force",
    datePassed: "2024-10-23",
    blocker: "phased-schedule",
    expectedCommencement: "2027-12-11",
    sponsor: "European Parliament and Council",
    lastAction: "2024-12-10",
    lastActionNote: "Regulation entered into force; obligations deferred.",
    whatChanges:
      "Manufacturers of products with digital elements must meet essential cybersecurity requirements, handle vulnerabilities across the support period, and report actively exploited vulnerabilities.",
    developerImpact: "material",
    impactNote:
      "SBOM production, coordinated vulnerability disclosure and a defined support period become product requirements, not good practice.",
    phases: [
      { obligation: "Vulnerability and incident reporting", applicableFrom: "2026-09-11", inForce: false },
      { obligation: "Full product requirements", applicableFrom: "2027-12-11", inForce: false },
    ],
    sources: [{ sourceId: "eu-cra" }],
  },
  {
    ...V,
    id: "eu-nis2-transposition",
    jurisdictionCode: "EU",
    title: "NIS2 — Member State transposition and enforcement build-out",
    shortTitle: "NIS2 transposition gap",
    stage: "partially-in-force",
    datePassed: "2022-12-14",
    blocker: "phased-schedule",
    expectedCommencement: null,
    expectedCommencementNote:
      "The transposition deadline has passed, but national implementation and supervisory capacity remain uneven across Member States.",
    sponsor: "European Commission",
    lastAction: "2026-03-01",
    lastActionNote:
      "Infringement and implementation monitoring continuing against late-transposing Member States.",
    whatChanges:
      "Which entities are in scope, and what enforcement actually looks like, is determined nationally — so effective exposure depends on the Member State of establishment.",
    developerImpact: "low",
    impactNote:
      "The technical baseline is stable; the variable is which national regulator applies it and how hard.",
    sources: [{ sourceId: "eu-nis2" }],
  },

  // ── Passed, awaiting effect ───────────────────────────────────────────────
  {
    ...V,
    id: "un-cybercrime-signature",
    jurisdictionCode: "EU",
    title: "United Nations Convention against Cybercrime",
    shortTitle: "UN Cybercrime Convention",
    stage: "passed",
    datePassed: "2024-12-24",
    blocker: "gazette-pending",
    expectedCommencement: null,
    expectedCommencementNote:
      "Enters into force only after the required number of ratifications; signature alone creates no domestic obligation.",
    sponsor: "United Nations General Assembly",
    lastAction: "2025-10-25",
    lastActionNote:
      "Opened for signature; ratification processes running at national level.",
    whatChanges:
      "Harmonised offence definitions and, more consequentially for engineering teams, expedited cross-border preservation and disclosure of electronic evidence.",
    developerImpact: "low",
    impactNote:
      "Longer-term: expect more, and faster, cross-border data preservation requests. No immediate build work.",
    sources: [{ sourceId: "un-cybercrime-convention" }],
  },

  // ── In committee / introduced / consultation ──────────────────────────────
  {
    ...V,
    id: "br-ai-bill",
    jurisdictionCode: "BR",
    title: "Projeto de Lei sobre inteligência artificial",
    shortTitle: "Brazil AI Bill",
    stage: "in-committee",
    datePassed: null,
    blocker: "none",
    expectedCommencement: null,
    sponsor: "Congresso Nacional",
    lastAction: "2026-04-20",
    lastActionNote: "Committee consideration continuing.",
    whatChanges:
      "Would introduce a risk-tiered AI regime with rights for affected persons and obligations scaled to risk classification.",
    developerImpact: "low",
    impactNote:
      "Watch the risk-tier definitions — if they track the EU AI Act, EU compliance work will largely transfer.",
    sources: [{ sourceId: "br-lgpd" }],
  },
  {
    ...V,
    id: "au-ai-guardrails",
    jurisdictionCode: "AU",
    title: "Mandatory guardrails for AI in high-risk settings",
    shortTitle: "AU AI guardrails",
    stage: "consultation",
    datePassed: null,
    blocker: "none",
    expectedCommencement: null,
    sponsor: "Department of Industry, Science and Resources",
    lastAction: "2025-10-01",
    lastActionNote: "Proposals paper and consultation responses under review.",
    whatChanges:
      "Would impose testing, transparency and accountability obligations on AI deployed in defined high-risk settings.",
    developerImpact: "low",
    impactNote:
      "Nothing to build yet, but scope definitions are worth tracking if you deploy AI in employment, credit or essential services.",
    sources: [{ sourceId: "au-soci" }],
  },
  {
    ...V,
    id: "uk-cma-reform",
    jurisdictionCode: "UK",
    title: "Computer Misuse Act 1990 reform",
    shortTitle: "CMA reform",
    stage: "consultation",
    datePassed: null,
    blocker: "none",
    expectedCommencement: null,
    sponsor: "Home Office",
    lastAction: "2025-07-15",
    lastActionNote:
      "Review of the Act continuing, including proposals for a statutory defence for legitimate security research.",
    whatChanges:
      "A statutory defence would change the legal position of good-faith vulnerability research and threat intelligence work in the UK.",
    developerImpact: "material",
    impactNote:
      "Directly affects whether UK-based security research and pen-testing carry criminal risk without contractual authorisation.",
    sources: [{ sourceId: "uk-cma-1990" }],
  },
  {
    ...V,
    id: "sg-cybersecurity-amendment",
    jurisdictionCode: "SG",
    title: "Cybersecurity (Amendment) Act — expanded scope",
    shortTitle: "SG Cybersecurity Act amendment",
    stage: "passed",
    datePassed: "2024-05-07",
    blocker: "phased-schedule",
    expectedCommencement: null,
    expectedCommencementNote:
      "Provisions commence on dates appointed by the Minister.",
    sponsor: "Cyber Security Agency of Singapore",
    lastAction: "2025-06-01",
    lastActionNote: "Commencement and subsidiary legislation progressing.",
    whatChanges:
      "Extends regulatory reach beyond physically-held CII to systems and entities of concern, including certain cloud-hosted arrangements.",
    developerImpact: "material",
    impactNote:
      "Cloud-hosted systems supporting essential services may fall in scope, bringing audit and reporting duties with them.",
    sources: [{ sourceId: "sg-cybersecurity-act" }],
  },
  {
    ...V,
    id: "jp-active-cyber-defence",
    jurisdictionCode: "JP",
    title: "Active cyber defence legislation",
    shortTitle: "JP active cyber defence",
    stage: "passed",
    datePassed: "2025-05-16",
    blocker: "phased-schedule",
    expectedCommencement: null,
    expectedCommencementNote:
      "Phased implementation with supporting institutional arrangements to follow.",
    sponsor: "Cabinet Secretariat / NISC",
    lastAction: "2025-05-16",
    lastActionNote: "Enacted; implementation staged.",
    whatChanges:
      "Establishes a framework for government threat monitoring and pre-emptive action against hostile infrastructure, with reporting duties for designated operators.",
    developerImpact: "low",
    impactNote:
      "Primarily a state-capability measure; designated critical operators should watch for reporting obligations.",
    sources: [{ sourceId: "jp-nisc" }],
  },
];
