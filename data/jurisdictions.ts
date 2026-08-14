import type { Jurisdiction } from "@/types";
import { EU_MEMBER_IDS } from "@/lib/map/iso";

/**
 * ⚠️ All records are `verification: "needs-review"`. Strictness dimensions are
 * analyst judgements on a published rubric (see /methodology and
 * `lib/scoring/weights.ts`), not measurements — they are the most contestable
 * content in the product and must be reviewed before launch.
 */
const V = {
  lastVerified: "2026-08-15",
  verification: "needs-review",
} as const;

export const jurisdictions: Jurisdiction[] = [
  {
    ...V,
    code: "EU",
    name: "European Union",
    shortName: "EU",
    region: "europe",
    isoNumeric: EU_MEMBER_IDS,
    anchor: [4.35, 50.85],
    isBloc: true,
    primaryLawId: "eu-nis2",
    regulators: [
      {
        name: "European Union Agency for Cybersecurity",
        abbreviation: "ENISA",
        url: "https://www.enisa.europa.eu/",
      },
      {
        name: "European Data Protection Board",
        abbreviation: "EDPB",
        url: "https://www.edpb.europa.eu/",
      },
    ],
    aiPosture: "binding-comprehensive",
    strictness: {
      criminalExposure: 58,
      corporateFinancial: 92,
      reportingBurden: 88,
      enforcementIntensity: 74,
      aiGovernance: 96,
      extraterritorialReach: 90,
    },
    profile:
      "The most comprehensive regime tracked. Obligations arrive as a stack — NIS2, GDPR, the AI Act and the Cyber Resilience Act overlap — and enforcement is delegated to Member States, so effective strictness varies by where an entity is established.",
    sources: [{ sourceId: "eu-nis2" }, { sourceId: "eu-ai-act" }],
  },
  {
    ...V,
    code: "US",
    name: "United States",
    shortName: "USA",
    region: "north-america",
    isoNumeric: ["840"],
    anchor: [-98.5, 39.8],
    isBloc: false,
    primaryLawId: "us-cfaa",
    regulators: [
      {
        name: "Cybersecurity and Infrastructure Security Agency",
        abbreviation: "CISA",
        url: "https://www.cisa.gov/",
      },
      {
        name: "Federal Trade Commission",
        abbreviation: "FTC",
        url: "https://www.ftc.gov/",
      },
    ],
    aiPosture: "guidance-only",
    strictness: {
      criminalExposure: 82,
      corporateFinancial: 46,
      reportingBurden: 52,
      enforcementIntensity: 78,
      aiGovernance: 24,
      extraterritorialReach: 72,
    },
    profile:
      "Sectoral and fragmented at federal level, with severe criminal exposure under the CFAA but no general breach-notification statute. CIRCIA's reporting duties remain contingent on implementing rules, so the headline obligation is not yet enforceable.",
    sources: [{ sourceId: "us-cfaa" }, { sourceId: "us-circia" }],
  },
  {
    ...V,
    code: "UK",
    name: "United Kingdom",
    shortName: "UK",
    region: "europe",
    isoNumeric: ["826"],
    anchor: [-1.5, 52.5],
    isBloc: false,
    primaryLawId: "uk-cma-1990",
    regulators: [
      {
        name: "National Cyber Security Centre",
        abbreviation: "NCSC",
        url: "https://www.ncsc.gov.uk/",
      },
      {
        name: "Information Commissioner's Office",
        abbreviation: "ICO",
        url: "https://ico.org.uk/",
      },
    ],
    aiPosture: "guidance-only",
    strictness: {
      criminalExposure: 72,
      corporateFinancial: 78,
      reportingBurden: 66,
      enforcementIntensity: 70,
      aiGovernance: 30,
      extraterritorialReach: 68,
    },
    profile:
      "Post-Brexit divergence in progress: the UK retained NIS-era rules rather than adopting NIS2, and has taken a regulator-led, principles-based approach to AI instead of a horizontal statute.",
    sources: [{ sourceId: "uk-cma-1990" }, { sourceId: "uk-nis-2018" }],
  },
  {
    ...V,
    code: "IN",
    name: "India",
    shortName: "India",
    region: "south-asia",
    isoNumeric: ["356"],
    anchor: [78.9, 22.5],
    isBloc: false,
    primaryLawId: "in-dpdp-2023",
    regulators: [
      {
        name: "Indian Computer Emergency Response Team",
        abbreviation: "CERT-In",
        url: "https://www.cert-in.org.in/",
      },
      {
        name: "Ministry of Electronics and Information Technology",
        abbreviation: "MeitY",
        url: "https://www.meity.gov.in/",
      },
    ],
    aiPosture: "draft-framework",
    strictness: {
      criminalExposure: 60,
      corporateFinancial: 64,
      reportingBurden: 94,
      enforcementIntensity: 52,
      aiGovernance: 34,
      extraterritorialReach: 62,
    },
    profile:
      "The clearest example of the gap this product tracks: the DPDP Act has been law since 2023 yet most of its obligations await subordinate rules, while the CERT-In Directions impose one of the world's tightest reporting windows and are already enforceable.",
    sources: [{ sourceId: "in-dpdp-2023" }, { sourceId: "in-cert-directions" }],
  },
  {
    ...V,
    code: "SG",
    name: "Singapore",
    shortName: "Singapore",
    region: "asia-pacific",
    isoNumeric: ["702"],
    anchor: [103.8, 1.35],
    isBloc: false,
    primaryLawId: "sg-cybersecurity-act",
    regulators: [
      {
        name: "Cyber Security Agency of Singapore",
        abbreviation: "CSA",
        url: "https://www.csa.gov.sg/",
      },
      {
        name: "Personal Data Protection Commission",
        abbreviation: "PDPC",
        url: "https://www.pdpc.gov.sg/",
      },
    ],
    aiPosture: "guidance-only",
    strictness: {
      criminalExposure: 76,
      corporateFinancial: 58,
      reportingBurden: 86,
      enforcementIntensity: 90,
      aiGovernance: 40,
      extraterritorialReach: 54,
    },
    profile:
      "Moderate headline penalties paired with unusually high enforcement intensity and a tightly-scoped CII licensing regime. Governance of AI is voluntary but well-developed, led by frameworks rather than statute.",
    sources: [{ sourceId: "sg-cybersecurity-act" }, { sourceId: "sg-cma" }],
  },
  {
    ...V,
    code: "CN",
    name: "China",
    shortName: "China",
    region: "asia-pacific",
    isoNumeric: ["156"],
    anchor: [104.2, 35.9],
    isBloc: false,
    primaryLawId: "cn-csl",
    regulators: [
      {
        name: "Cyberspace Administration of China",
        abbreviation: "CAC",
        url: "http://www.cac.gov.cn/",
      },
    ],
    aiPosture: "binding-sectoral",
    strictness: {
      criminalExposure: 84,
      corporateFinancial: 86,
      reportingBurden: 88,
      enforcementIntensity: 94,
      aiGovernance: 78,
      extraterritorialReach: 80,
    },
    profile:
      "A state-security-oriented stack — CSL, DSL and PIPL — with data localisation, security review of cross-border transfers, and binding rules for recommendation algorithms, deep synthesis and generative AI services introduced faster than in any other tracked jurisdiction.",
    sources: [{ sourceId: "cn-csl" }, { sourceId: "cn-pipl" }],
  },
  {
    ...V,
    code: "JP",
    name: "Japan",
    shortName: "Japan",
    region: "asia-pacific",
    isoNumeric: ["392"],
    anchor: [138.3, 36.2],
    isBloc: false,
    primaryLawId: "jp-appi",
    regulators: [
      {
        name: "Personal Information Protection Commission",
        abbreviation: "PPC",
        url: "https://www.ppc.go.jp/en/",
      },
      {
        name: "National center of Incident readiness and Strategy for Cybersecurity",
        abbreviation: "NISC",
        url: "https://www.nisc.go.jp/eng/",
      },
    ],
    aiPosture: "guidance-only",
    strictness: {
      criminalExposure: 48,
      corporateFinancial: 38,
      reportingBurden: 58,
      enforcementIntensity: 50,
      aiGovernance: 32,
      extraterritorialReach: 46,
    },
    profile:
      "Comparatively low headline penalties and a cooperative, guidance-first regulator. AI policy has favoured soft law and sector guidance over prohibition, making Japan the most permissive major APAC market tracked.",
    sources: [{ sourceId: "jp-appi" }, { sourceId: "jp-unauthorized-access" }],
  },
  {
    ...V,
    code: "AU",
    name: "Australia",
    shortName: "Australia",
    region: "asia-pacific",
    isoNumeric: ["036"],
    anchor: [133.8, -25.3],
    isBloc: false,
    primaryLawId: "au-soci",
    regulators: [
      {
        name: "Australian Signals Directorate / Australian Cyber Security Centre",
        abbreviation: "ACSC",
        url: "https://www.cyber.gov.au/",
      },
      {
        name: "Office of the Australian Information Commissioner",
        abbreviation: "OAIC",
        url: "https://www.oaic.gov.au/",
      },
    ],
    aiPosture: "draft-framework",
    strictness: {
      criminalExposure: 62,
      corporateFinancial: 80,
      reportingBurden: 82,
      enforcementIntensity: 66,
      aiGovernance: 36,
      extraterritorialReach: 58,
    },
    profile:
      "Aggressive critical-infrastructure regime with government assistance powers, tiered 12/72-hour incident reporting, and privacy penalties raised substantially after a series of large domestic breaches.",
    sources: [{ sourceId: "au-soci" }, { sourceId: "au-privacy-act" }],
  },
  {
    ...V,
    code: "BR",
    name: "Brazil",
    shortName: "Brazil",
    region: "latin-america",
    isoNumeric: ["076"],
    anchor: [-51.9, -14.2],
    isBloc: false,
    primaryLawId: "br-lgpd",
    regulators: [
      {
        name: "Autoridade Nacional de Proteção de Dados",
        abbreviation: "ANPD",
        url: "https://www.gov.br/anpd/",
      },
    ],
    aiPosture: "draft-framework",
    strictness: {
      criminalExposure: 44,
      corporateFinancial: 56,
      reportingBurden: 54,
      enforcementIntensity: 48,
      aiGovernance: 42,
      extraterritorialReach: 60,
    },
    profile:
      "GDPR-influenced but with sanctions capped by reference to Brazilian revenue rather than global turnover, and a comparatively young authority still building enforcement capacity. AI regulation has been under active legislative consideration rather than in force.",
    sources: [{ sourceId: "br-lgpd" }, { sourceId: "br-marco-civil" }],
  },
  {
    ...V,
    code: "AE",
    name: "United Arab Emirates",
    shortName: "UAE",
    region: "middle-east",
    isoNumeric: ["784"],
    anchor: [54.0, 24.0],
    isBloc: false,
    primaryLawId: "ae-cybercrime",
    regulators: [
      {
        name: "UAE Cybersecurity Council",
        url: "https://csc.gov.ae/",
      },
      {
        name: "Telecommunications and Digital Government Regulatory Authority",
        abbreviation: "TDRA",
        url: "https://tdra.gov.ae/",
      },
    ],
    aiPosture: "guidance-only",
    strictness: {
      criminalExposure: 88,
      corporateFinancial: 62,
      reportingBurden: 56,
      enforcementIntensity: 72,
      aiGovernance: 38,
      extraterritorialReach: 50,
    },
    profile:
      "Severe custodial exposure and broad content offences under the 2021 cybercrime decree-law, alongside a federal data protection law whose operative effect still depends on executive regulations. Free-zone regimes (DIFC, ADGM) run in parallel and are out of scope for v1.",
    sources: [{ sourceId: "ae-cybercrime" }, { sourceId: "ae-pdpl" }],
  },
];
