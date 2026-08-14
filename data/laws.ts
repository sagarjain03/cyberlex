import type { Law } from "@/types";

/**
 * Tracked instruments, one record per law.
 *
 * ⚠️ Every record here is `verification: "needs-review"`. These are authored
 * from secondary knowledge and must be checked against the cited primary source
 * by a human before launch — see data/README.md and docs/phases.md Phase 8.
 * Nothing in this file is citable as-is.
 */
const V = {
  lastVerified: "2026-08-15",
  verification: "needs-review",
} as const;

export const laws: Law[] = [
  // ── European Union ────────────────────────────────────────────────────────
  {
    ...V,
    id: "eu-nis2",
    jurisdictionCode: "EU",
    title:
      "Directive (EU) 2022/2555 on measures for a high common level of cybersecurity across the Union",
    shortTitle: "NIS2 Directive",
    citation: "Directive (EU) 2022/2555",
    year: 2022,
    status: "partially-in-force",
    datePassed: "2022-12-14",
    dateInForce: "2023-01-16",
    summary:
      "Raises baseline cybersecurity, incident reporting and supply-chain obligations for essential and important entities across 18 sectors, with management-body accountability.",
    isPrimary: true,
    phases: [
      {
        obligation: "Member State transposition deadline",
        applicableFrom: "2024-10-17",
        inForce: true,
      },
      {
        obligation: "Early-warning notification within 24 hours",
        applicableFrom: "2024-10-18",
        inForce: true,
      },
      {
        obligation: "National entity registers established",
        applicableFrom: "2025-04-17",
        inForce: true,
      },
      {
        obligation:
          "Full national supervisory and enforcement regimes operational in all Member States",
        applicableFrom: null,
        inForce: false,
      },
    ],
    sources: [{ sourceId: "eu-nis2" }],
  },
  {
    ...V,
    id: "eu-ai-act",
    jurisdictionCode: "EU",
    title:
      "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence",
    shortTitle: "EU AI Act",
    citation: "Regulation (EU) 2024/1689",
    year: 2024,
    status: "partially-in-force",
    datePassed: "2024-06-13",
    dateInForce: "2024-08-01",
    summary:
      "Risk-tiered regime for AI systems: prohibited practices, obligations for high-risk systems, transparency duties for synthetic media, and a separate track for general-purpose AI models.",
    isPrimary: false,
    phases: [
      {
        obligation: "Prohibitions on unacceptable-risk AI practices",
        applicableFrom: "2025-02-02",
        inForce: true,
      },
      {
        obligation: "General-purpose AI model obligations",
        applicableFrom: "2025-08-02",
        inForce: true,
      },
      {
        obligation: "High-risk system obligations (Annex III)",
        applicableFrom: "2026-08-02",
        inForce: false,
      },
      {
        obligation: "High-risk systems in regulated products (Annex I)",
        applicableFrom: "2027-08-02",
        inForce: false,
      },
    ],
    sources: [{ sourceId: "eu-ai-act" }],
  },
  {
    ...V,
    id: "eu-gdpr",
    jurisdictionCode: "EU",
    title: "Regulation (EU) 2016/679 (General Data Protection Regulation)",
    shortTitle: "GDPR",
    citation: "Regulation (EU) 2016/679",
    year: 2016,
    status: "in-force",
    datePassed: "2016-04-27",
    dateInForce: "2018-05-25",
    summary:
      "Personal data protection regime including a 72-hour personal data breach notification duty to the supervisory authority.",
    isPrimary: false,
    sources: [{ sourceId: "eu-gdpr", pinpoint: "Art. 33" }],
  },
  {
    ...V,
    id: "eu-cra",
    jurisdictionCode: "EU",
    title: "Regulation (EU) 2024/2847 on horizontal cybersecurity requirements for products with digital elements",
    shortTitle: "Cyber Resilience Act",
    citation: "Regulation (EU) 2024/2847",
    year: 2024,
    status: "partially-in-force",
    datePassed: "2024-10-23",
    dateInForce: "2024-12-10",
    summary:
      "Security-by-design and vulnerability-handling obligations for products with digital elements placed on the EU market, with actively-exploited-vulnerability reporting duties.",
    isPrimary: false,
    phases: [
      {
        obligation: "Vulnerability and incident reporting obligations",
        applicableFrom: "2026-09-11",
        inForce: false,
      },
      {
        obligation: "Full application of product requirements",
        applicableFrom: "2027-12-11",
        inForce: false,
      },
    ],
    sources: [{ sourceId: "eu-cra" }],
  },

  // ── United States ─────────────────────────────────────────────────────────
  {
    ...V,
    id: "us-cfaa",
    jurisdictionCode: "US",
    title: "Computer Fraud and Abuse Act, 18 U.S.C. § 1030",
    shortTitle: "CFAA",
    citation: "18 U.S.C. § 1030",
    year: 1986,
    status: "in-force",
    datePassed: "1986-10-16",
    dateInForce: "1986-10-16",
    summary:
      "Federal offence of accessing a protected computer without authorisation or exceeding authorised access, with penalties escalating by harm, intent and recidivism.",
    isPrimary: true,
    sources: [{ sourceId: "us-cfaa" }],
  },
  {
    ...V,
    id: "us-circia",
    jurisdictionCode: "US",
    title: "Cyber Incident Reporting for Critical Infrastructure Act of 2022",
    shortTitle: "CIRCIA",
    citation: "Pub. L. 117-103, Div. Y",
    year: 2022,
    status: "unnotified",
    datePassed: "2022-03-15",
    dateInForce: null,
    summary:
      "Requires covered critical-infrastructure entities to report substantial cyber incidents to CISA within 72 hours and ransom payments within 24 hours — reporting duties begin only once the implementing final rule takes effect.",
    isPrimary: false,
    sources: [{ sourceId: "us-circia" }],
  },
  {
    ...V,
    id: "us-sec-cyber",
    jurisdictionCode: "US",
    title:
      "Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure",
    shortTitle: "SEC cyber disclosure rules",
    citation: "Release Nos. 33-11216; 34-97989",
    year: 2023,
    status: "in-force",
    datePassed: "2023-07-26",
    dateInForce: "2023-12-18",
    summary:
      "Public companies must disclose material cybersecurity incidents on Form 8-K within four business days of determining materiality, plus annual risk-management disclosure.",
    isPrimary: false,
    sources: [{ sourceId: "us-sec-cyber" }],
  },

  // ── United Kingdom ────────────────────────────────────────────────────────
  {
    ...V,
    id: "uk-cma-1990",
    jurisdictionCode: "UK",
    title: "Computer Misuse Act 1990",
    shortTitle: "Computer Misuse Act",
    citation: "1990 c. 18",
    year: 1990,
    status: "in-force",
    datePassed: "1990-06-29",
    dateInForce: "1990-08-29",
    summary:
      "Core UK computer crime statute: unauthorised access, unauthorised access with intent to commit further offences, unauthorised acts impairing operation, and supply of hacking tools.",
    isPrimary: true,
    sources: [{ sourceId: "uk-cma-1990", pinpoint: "ss. 1–3A" }],
  },
  {
    ...V,
    id: "uk-nis-2018",
    jurisdictionCode: "UK",
    title: "The Network and Information Systems Regulations 2018",
    shortTitle: "UK NIS Regulations",
    citation: "SI 2018/506",
    year: 2018,
    status: "in-force",
    datePassed: "2018-04-19",
    dateInForce: "2018-05-10",
    summary:
      "Security and incident-notification duties for operators of essential services and relevant digital service providers; retained post-Brexit and diverging from the EU's NIS2.",
    isPrimary: false,
    sources: [{ sourceId: "uk-nis-2018" }],
  },
  {
    ...V,
    id: "uk-dpa-2018",
    jurisdictionCode: "UK",
    title: "Data Protection Act 2018",
    shortTitle: "Data Protection Act 2018",
    citation: "2018 c. 12",
    year: 2018,
    status: "in-force",
    datePassed: "2018-05-23",
    dateInForce: "2018-05-25",
    summary:
      "Implements and supplements the UK GDPR, including personal data breach notification to the ICO within 72 hours.",
    isPrimary: false,
    sources: [{ sourceId: "uk-dpa-2018" }],
  },

  // ── India ─────────────────────────────────────────────────────────────────
  {
    ...V,
    id: "in-dpdp-2023",
    jurisdictionCode: "IN",
    title: "Digital Personal Data Protection Act, 2023",
    shortTitle: "DPDP Act",
    citation: "Act No. 22 of 2023",
    year: 2023,
    status: "unnotified",
    datePassed: "2023-08-11",
    dateInForce: null,
    summary:
      "India's consolidated personal data protection statute. Received assent in August 2023 but its substantive obligations depend on subordinate rules and a phased commencement — most duties are not yet enforceable.",
    isPrimary: true,
    sources: [{ sourceId: "in-dpdp-2023" }],
  },
  {
    ...V,
    id: "in-it-act-2000",
    jurisdictionCode: "IN",
    title: "Information Technology Act, 2000",
    shortTitle: "IT Act",
    citation: "Act No. 21 of 2000",
    year: 2000,
    status: "in-force",
    datePassed: "2000-06-09",
    dateInForce: "2000-10-17",
    summary:
      "India's principal cyber statute: computer-related offences, identity theft, data-security compensation duties for body corporates, and CERT-In's statutory basis.",
    isPrimary: false,
    sources: [
      { sourceId: "in-it-act-2000", pinpoint: "ss. 43, 43A, 66, 66C, 70B" },
    ],
  },
  {
    ...V,
    id: "in-cert-directions",
    jurisdictionCode: "IN",
    title:
      "CERT-In Directions of 28 April 2022 under section 70B(6) of the IT Act, 2000",
    shortTitle: "CERT-In Directions",
    citation: "No. 20(3)/2022-CERT-In",
    year: 2022,
    status: "in-force",
    datePassed: "2022-04-28",
    dateInForce: "2022-06-28",
    summary:
      "Mandatory reporting of specified cyber incidents to CERT-In within 6 hours of noticing, plus log retention and clock-synchronisation obligations.",
    isPrimary: false,
    sources: [{ sourceId: "in-cert-directions" }],
  },

  // ── Singapore ─────────────────────────────────────────────────────────────
  {
    ...V,
    id: "sg-cybersecurity-act",
    jurisdictionCode: "SG",
    title: "Cybersecurity Act 2018",
    shortTitle: "Cybersecurity Act",
    citation: "Act 9 of 2018",
    year: 2018,
    status: "in-force",
    datePassed: "2018-02-05",
    dateInForce: "2018-08-31",
    summary:
      "Licensing and duties for owners of Critical Information Infrastructure, including mandatory incident reporting and audit obligations, administered by the Cyber Security Agency of Singapore.",
    isPrimary: true,
    sources: [{ sourceId: "sg-cybersecurity-act" }],
  },
  {
    ...V,
    id: "sg-cma",
    jurisdictionCode: "SG",
    title: "Computer Misuse Act 1993",
    shortTitle: "Computer Misuse Act",
    citation: "Act 19 of 1993",
    year: 1993,
    status: "in-force",
    datePassed: "1993-08-30",
    dateInForce: "1993-08-30",
    summary:
      "Unauthorised access, modification and interception offences, with enhanced penalties where protected computers or repeat offending are involved.",
    isPrimary: false,
    sources: [{ sourceId: "sg-cma" }],
  },
  {
    ...V,
    id: "sg-pdpa",
    jurisdictionCode: "SG",
    title: "Personal Data Protection Act 2012",
    shortTitle: "PDPA",
    citation: "Act 26 of 2012",
    year: 2012,
    status: "in-force",
    datePassed: "2012-10-15",
    dateInForce: "2014-07-02",
    summary:
      "Personal data protection regime including mandatory data breach notification for notifiable breaches.",
    isPrimary: false,
    sources: [{ sourceId: "sg-pdpa" }],
  },

  // ── China ─────────────────────────────────────────────────────────────────
  {
    ...V,
    id: "cn-csl",
    jurisdictionCode: "CN",
    title: "Cybersecurity Law of the People's Republic of China",
    shortTitle: "Cybersecurity Law",
    citation: "CSL (2016)",
    year: 2016,
    status: "in-force",
    datePassed: "2016-11-07",
    dateInForce: "2017-06-01",
    summary:
      "Network operator security duties, multi-level protection scheme, critical information infrastructure obligations and data localisation requirements.",
    isPrimary: true,
    sources: [{ sourceId: "cn-csl" }],
  },
  {
    ...V,
    id: "cn-dsl",
    jurisdictionCode: "CN",
    title: "Data Security Law of the People's Republic of China",
    shortTitle: "Data Security Law",
    citation: "DSL (2021)",
    year: 2021,
    status: "in-force",
    datePassed: "2021-06-10",
    dateInForce: "2021-09-01",
    summary:
      "Hierarchical data classification, national core data protections, and restrictions on providing data to foreign judicial or law-enforcement bodies without approval.",
    isPrimary: false,
    sources: [{ sourceId: "cn-dsl" }],
  },
  {
    ...V,
    id: "cn-pipl",
    jurisdictionCode: "CN",
    title: "Personal Information Protection Law of the People's Republic of China",
    shortTitle: "PIPL",
    citation: "PIPL (2021)",
    year: 2021,
    status: "in-force",
    datePassed: "2021-08-20",
    dateInForce: "2021-11-01",
    summary:
      "Comprehensive personal information regime with consent requirements, cross-border transfer mechanisms and turnover-based penalties.",
    isPrimary: false,
    sources: [{ sourceId: "cn-pipl" }],
  },

  // ── Japan ─────────────────────────────────────────────────────────────────
  {
    ...V,
    id: "jp-appi",
    jurisdictionCode: "JP",
    title: "Act on the Protection of Personal Information",
    shortTitle: "APPI",
    citation: "Act No. 57 of 2003",
    year: 2003,
    status: "in-force",
    datePassed: "2003-05-30",
    dateInForce: "2005-04-01",
    summary:
      "Japan's personal information regime, amended to add mandatory breach reporting to the Personal Information Protection Commission and affected individuals.",
    isPrimary: true,
    sources: [{ sourceId: "jp-appi" }],
  },
  {
    ...V,
    id: "jp-unauthorized-access",
    jurisdictionCode: "JP",
    title: "Act on Prohibition of Unauthorized Computer Access",
    shortTitle: "Unauthorized Access Act",
    citation: "Act No. 128 of 1999",
    year: 1999,
    status: "in-force",
    datePassed: "1999-08-13",
    dateInForce: "2000-02-13",
    summary:
      "Prohibits unauthorised access to computers via access-control functions, and the improper acquisition or provision of another person's identification codes.",
    isPrimary: false,
    sources: [{ sourceId: "jp-unauthorized-access" }],
  },

  // ── Australia ─────────────────────────────────────────────────────────────
  {
    ...V,
    id: "au-soci",
    jurisdictionCode: "AU",
    title: "Security of Critical Infrastructure Act 2018",
    shortTitle: "SOCI Act",
    citation: "No. 29, 2018",
    year: 2018,
    status: "in-force",
    datePassed: "2018-03-29",
    dateInForce: "2018-07-11",
    summary:
      "Critical infrastructure obligations including asset registration, risk-management programs, and mandatory cyber incident reporting on a tiered 12/72-hour basis.",
    isPrimary: true,
    sources: [{ sourceId: "au-soci" }],
  },
  {
    ...V,
    id: "au-privacy-act",
    jurisdictionCode: "AU",
    title: "Privacy Act 1988",
    shortTitle: "Privacy Act",
    citation: "No. 119, 1988",
    year: 1988,
    status: "in-force",
    datePassed: "1988-12-14",
    dateInForce: "1989-01-01",
    summary:
      "Australian Privacy Principles and the Notifiable Data Breaches scheme, with civil penalties for serious or repeated interferences with privacy.",
    isPrimary: false,
    sources: [{ sourceId: "au-privacy-act" }],
  },

  // ── Brazil ────────────────────────────────────────────────────────────────
  {
    ...V,
    id: "br-lgpd",
    jurisdictionCode: "BR",
    title: "Lei Geral de Proteção de Dados Pessoais",
    shortTitle: "LGPD",
    citation: "Lei nº 13.709/2018",
    year: 2018,
    status: "in-force",
    datePassed: "2018-08-14",
    dateInForce: "2020-09-18",
    summary:
      "Brazil's general personal data protection law, enforced by the ANPD, with administrative sanctions capped by reference to Brazilian revenue.",
    isPrimary: true,
    sources: [{ sourceId: "br-lgpd" }],
  },
  {
    ...V,
    id: "br-marco-civil",
    jurisdictionCode: "BR",
    title: "Marco Civil da Internet",
    shortTitle: "Marco Civil",
    citation: "Lei nº 12.965/2014",
    year: 2014,
    status: "in-force",
    datePassed: "2014-04-23",
    dateInForce: "2014-06-23",
    summary:
      "Framework of internet rights and duties in Brazil, including connection and application log retention obligations and intermediary liability rules.",
    isPrimary: false,
    sources: [{ sourceId: "br-marco-civil" }],
  },

  // ── United Arab Emirates ──────────────────────────────────────────────────
  {
    ...V,
    id: "ae-cybercrime",
    jurisdictionCode: "AE",
    title:
      "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrimes",
    shortTitle: "Cybercrime Law",
    citation: "Federal Decree-Law No. 34/2021",
    year: 2021,
    status: "in-force",
    datePassed: "2021-09-20",
    dateInForce: "2022-01-02",
    summary:
      "Broad cybercrime regime covering unauthorised access, data interference, online fraud, and content offences, with substantial custodial and financial penalties.",
    isPrimary: true,
    sources: [{ sourceId: "ae-cybercrime" }],
  },
  {
    ...V,
    id: "ae-pdpl",
    jurisdictionCode: "AE",
    title:
      "Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data",
    shortTitle: "PDPL",
    citation: "Federal Decree-Law No. 45/2021",
    year: 2021,
    status: "unnotified",
    datePassed: "2021-09-20",
    dateInForce: null,
    summary:
      "Federal personal data protection law whose operative effect depends on implementing executive regulations that have not been issued in full.",
    isPrimary: false,
    sources: [{ sourceId: "ae-pdpl" }],
  },
];
