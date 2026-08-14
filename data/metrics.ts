import { known, NOT_RESEARCHED, NO_PROVISION } from "@/types";
import type { JurisdictionMetrics } from "@/types";

/**
 * Comparator values.
 *
 * ⚠️ Authored from secondary knowledge and marked `needs-review` throughout.
 * Where a figure could not be stated with confidence it is `NOT_RESEARCHED`
 * rather than estimated — a visible gap is honest, a plausible invented number
 * is not. docs/rules.md §3.3.
 *
 * `NO_PROVISION` means the jurisdiction genuinely has no such provision.
 * `NOT_RESEARCHED` means we have not established it. These are different
 * claims and the UI renders them differently.
 */
const V = {
  lastVerified: "2026-08-15",
  verification: "needs-review",
} as const;

export const metrics: JurisdictionMetrics[] = [
  {
    ...V,
    code: "EU",
    // Directive 2013/40/EU sets *minimum* maximum penalties; Member States
    // legislate the actual ceilings, so these are floors, not caps.
    unauthorizedAccessMaxYears: known(2),
    dataTheftMaxYears: known(3),
    ransomwareMaxYears: known(5),
    officerLiability: known(true),
    corporateFine: known({
      kind: "turnover-percent",
      percent: 2,
      alsoFlat: { currency: "EUR", amount: 10_000_000 },
      whicheverIs: "higher",
    }),
    reporting: known({
      initialHours: 24,
      fullReportHours: 72,
      notifiesRegulator: true,
      notifiesDataSubjects: true,
      sectoralVariation: true,
      note: "NIS2 early warning at 24h, incident notification at 72h, final report at one month. GDPR runs a parallel 72h duty.",
    }),
    ai: {
      bindingStatute: known(true),
      riskModel: known("Four-tier risk classification, plus a separate GPAI track"),
      conformityAssessment: known(true),
      deepfakeProvision: known(true),
      inForceFrom: known("2025-02-02"),
    },
    sources: [
      { sourceId: "eu-nis2", pinpoint: "Art. 23, Art. 34" },
      { sourceId: "eu-dir-2013-40", pinpoint: "Arts. 3–9" },
      { sourceId: "eu-ai-act" },
    ],
  },

  {
    ...V,
    code: "US",
    unauthorizedAccessMaxYears: known(10),
    dataTheftMaxYears: known(10),
    ransomwareMaxYears: known(20),
    officerLiability: known(true),
    corporateFine: known({
      kind: "sectoral",
      note: "No general federal cap. Exposure is sectoral (HIPAA, GLBA, FTC Act) and state-level.",
    }),
    reporting: known({
      initialHours: 72,
      fullReportHours: null,
      notifiesRegulator: true,
      notifiesDataSubjects: false,
      sectoralVariation: true,
      note: "CIRCIA's 72h duty is not yet enforceable pending the final rule. SEC-registered issuers file Form 8-K within four business days of a materiality determination.",
    }),
    ai: {
      bindingStatute: known(false),
      riskModel: NO_PROVISION,
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [
      { sourceId: "us-cfaa", pinpoint: "§ 1030(c)" },
      { sourceId: "us-circia" },
      { sourceId: "us-sec-cyber" },
    ],
  },

  {
    ...V,
    code: "UK",
    unauthorizedAccessMaxYears: known(2),
    dataTheftMaxYears: known(2),
    ransomwareMaxYears: known(10),
    officerLiability: known(true),
    corporateFine: known({
      kind: "turnover-percent",
      percent: 4,
      alsoFlat: { currency: "GBP", amount: 17_500_000 },
      whicheverIs: "higher",
    }),
    reporting: known({
      initialHours: 72,
      fullReportHours: null,
      notifiesRegulator: true,
      notifiesDataSubjects: true,
      sectoralVariation: true,
      note: "UK GDPR 72h to the ICO. NIS Regulations impose separate duties on operators of essential services.",
    }),
    ai: {
      bindingStatute: known(false),
      riskModel: known("Regulator-led, principles-based; no horizontal statute"),
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [
      { sourceId: "uk-cma-1990", pinpoint: "ss. 1, 3" },
      { sourceId: "uk-dpa-2018" },
      { sourceId: "uk-nis-2018" },
    ],
  },

  {
    ...V,
    code: "IN",
    unauthorizedAccessMaxYears: known(3),
    dataTheftMaxYears: known(3),
    ransomwareMaxYears: NOT_RESEARCHED,
    officerLiability: known(true),
    corporateFine: known({
      kind: "per-contravention",
      currency: "INR",
      amount: 2_500_000_000,
      note: "Up to ₹250 crore per instance of non-compliance under the DPDP Act — not yet enforceable.",
    }),
    reporting: known({
      initialHours: 6,
      fullReportHours: null,
      notifiesRegulator: true,
      notifiesDataSubjects: false,
      sectoralVariation: false,
      note: "CERT-In Directions require reporting within 6 hours of noticing a specified incident — the tightest binding window tracked.",
    }),
    ai: {
      bindingStatute: known(false),
      riskModel: known("Advisory-led; no binding AI statute in force"),
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [
      { sourceId: "in-it-act-2000", pinpoint: "ss. 66, 66C" },
      { sourceId: "in-cert-directions" },
      { sourceId: "in-dpdp-2023" },
    ],
  },

  {
    ...V,
    code: "SG",
    unauthorizedAccessMaxYears: known(2),
    dataTheftMaxYears: known(3),
    ransomwareMaxYears: NOT_RESEARCHED,
    officerLiability: known(true),
    corporateFine: known({
      kind: "turnover-percent",
      percent: 10,
      alsoFlat: { currency: "SGD", amount: 1_000_000 },
      whicheverIs: "higher",
    }),
    reporting: known({
      initialHours: 2,
      fullReportHours: 14 * 24,
      notifiesRegulator: true,
      notifiesDataSubjects: true,
      sectoralVariation: true,
      note: "Critical Information Infrastructure owners notify CSA within hours of becoming aware; PDPA notifiable breaches carry a separate duty.",
    }),
    ai: {
      bindingStatute: known(false),
      riskModel: known("Voluntary governance frameworks and testing toolkits"),
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [
      { sourceId: "sg-cma" },
      { sourceId: "sg-cybersecurity-act" },
      { sourceId: "sg-pdpa" },
    ],
  },

  {
    ...V,
    code: "CN",
    unauthorizedAccessMaxYears: known(3),
    dataTheftMaxYears: known(7),
    ransomwareMaxYears: known(7),
    officerLiability: known(true),
    corporateFine: known({
      kind: "turnover-percent",
      percent: 5,
      alsoFlat: { currency: "CNY", amount: 50_000_000 },
      whicheverIs: "higher",
    }),
    reporting: known({
      initialHours: 24,
      fullReportHours: null,
      notifiesRegulator: true,
      notifiesDataSubjects: true,
      sectoralVariation: true,
      note: "Immediate remedial action and prompt notification to users and the competent authority; sectoral rules impose tighter timelines.",
    }),
    ai: {
      bindingStatute: known(true),
      riskModel: known(
        "Service-type specific: recommendation algorithms, deep synthesis and generative AI each regulated separately, with filing requirements",
      ),
      conformityAssessment: known(true),
      deepfakeProvision: known(true),
      inForceFrom: known("2023-01-10"),
    },
    sources: [
      { sourceId: "cn-csl" },
      { sourceId: "cn-pipl" },
      { sourceId: "cn-dsl" },
    ],
  },

  {
    ...V,
    code: "JP",
    unauthorizedAccessMaxYears: known(3),
    dataTheftMaxYears: NOT_RESEARCHED,
    ransomwareMaxYears: NOT_RESEARCHED,
    officerLiability: NOT_RESEARCHED,
    corporateFine: known({
      kind: "flat",
      currency: "JPY",
      amount: 100_000_000,
    }),
    reporting: NOT_RESEARCHED,
    ai: {
      bindingStatute: known(false),
      riskModel: known("Soft-law guidance and sector-specific frameworks"),
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [
      { sourceId: "jp-unauthorized-access" },
      { sourceId: "jp-appi" },
    ],
  },

  {
    ...V,
    code: "AU",
    unauthorizedAccessMaxYears: known(2),
    dataTheftMaxYears: known(10),
    ransomwareMaxYears: known(10),
    officerLiability: known(true),
    corporateFine: known({
      kind: "turnover-percent",
      percent: 30,
      alsoFlat: { currency: "AUD", amount: 50_000_000 },
      whicheverIs: "higher",
    }),
    reporting: known({
      initialHours: 12,
      fullReportHours: 72,
      notifiesRegulator: true,
      notifiesDataSubjects: true,
      sectoralVariation: true,
      note: "SOCI Act tiering: 12h for critical incidents having a significant impact, 72h for relevant incidents. Notifiable Data Breaches run separately.",
    }),
    ai: {
      bindingStatute: known(false),
      riskModel: known("Proposed mandatory guardrails for high-risk settings; not yet in force"),
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [{ sourceId: "au-soci" }, { sourceId: "au-privacy-act" }],
  },

  {
    ...V,
    code: "BR",
    unauthorizedAccessMaxYears: known(4),
    dataTheftMaxYears: NOT_RESEARCHED,
    ransomwareMaxYears: NOT_RESEARCHED,
    officerLiability: NOT_RESEARCHED,
    corporateFine: known({
      kind: "turnover-percent",
      percent: 2,
      alsoFlat: { currency: "BRL", amount: 50_000_000 },
      whicheverIs: "lower",
    }),
    reporting: NOT_RESEARCHED,
    ai: {
      bindingStatute: known(false),
      riskModel: known("Risk-tiered bill under legislative consideration"),
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [{ sourceId: "br-lgpd" }, { sourceId: "br-marco-civil" }],
  },

  {
    ...V,
    code: "AE",
    unauthorizedAccessMaxYears: NOT_RESEARCHED,
    dataTheftMaxYears: NOT_RESEARCHED,
    ransomwareMaxYears: NOT_RESEARCHED,
    officerLiability: NOT_RESEARCHED,
    corporateFine: NOT_RESEARCHED,
    reporting: NOT_RESEARCHED,
    ai: {
      bindingStatute: known(false),
      riskModel: known("National AI strategy and guidance; no binding statute"),
      conformityAssessment: known(false),
      deepfakeProvision: NOT_RESEARCHED,
      inForceFrom: NO_PROVISION,
    },
    sources: [{ sourceId: "ae-cybercrime" }, { sourceId: "ae-pdpl" }],
  },
];
