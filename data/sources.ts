import type { Source } from "@/types";

/**
 * Primary source registry. Every legal fact in `data/` cites an id from here.
 *
 * Rules (see data/README.md):
 *  - Official publishers only — no news, blogs, or law-firm summaries.
 *  - Prefer stable identifiers: EUR-Lex ELI, legislation.gov.uk chapter refs,
 *    SSO Singapore act slugs.
 *  - `retrieved` records when the URL last resolved, not when it was written.
 */
export const sources: Source[] = [
  // ── European Union ────────────────────────────────────────────────────────
  {
    id: "eu-nis2",
    title: "Directive (EU) 2022/2555 (NIS2)",
    publisher: "EUR-Lex, Publications Office of the European Union",
    url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "eu-ai-act",
    title: "Regulation (EU) 2024/1689 (Artificial Intelligence Act)",
    publisher: "EUR-Lex, Publications Office of the European Union",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "eu-gdpr",
    title: "Regulation (EU) 2016/679 (General Data Protection Regulation)",
    publisher: "EUR-Lex, Publications Office of the European Union",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "eu-dir-2013-40",
    title: "Directive 2013/40/EU on attacks against information systems",
    publisher: "EUR-Lex, Publications Office of the European Union",
    url: "https://eur-lex.europa.eu/eli/dir/2013/40/oj",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "eu-cra",
    title: "Regulation (EU) 2024/2847 (Cyber Resilience Act)",
    publisher: "EUR-Lex, Publications Office of the European Union",
    url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },

  // ── United Kingdom ────────────────────────────────────────────────────────
  {
    id: "uk-cma-1990",
    title: "Computer Misuse Act 1990 (c. 18)",
    publisher: "legislation.gov.uk, The National Archives",
    url: "https://www.legislation.gov.uk/ukpga/1990/18",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "uk-dpa-2018",
    title: "Data Protection Act 2018 (c. 12)",
    publisher: "legislation.gov.uk, The National Archives",
    url: "https://www.legislation.gov.uk/ukpga/2018/12",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "uk-nis-2018",
    title: "The Network and Information Systems Regulations 2018 (SI 2018/506)",
    publisher: "legislation.gov.uk, The National Archives",
    url: "https://www.legislation.gov.uk/uksi/2018/506",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "uk-ico",
    title: "Information Commissioner's Office",
    publisher: "ICO",
    url: "https://ico.org.uk/",
    type: "regulator",
    retrieved: "2026-08-15",
  },

  // ── United States ─────────────────────────────────────────────────────────
  {
    id: "us-cfaa",
    title: "18 U.S.C. § 1030 — Computer Fraud and Abuse Act",
    publisher: "Office of the Law Revision Counsel, U.S. House of Representatives",
    url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section1030",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "us-circia",
    title: "Cyber Incident Reporting for Critical Infrastructure Act (CIRCIA)",
    publisher: "Cybersecurity and Infrastructure Security Agency",
    url: "https://www.cisa.gov/topics/cyber-threats-and-advisories/information-sharing/cyber-incident-reporting-critical-infrastructure-act-2022-circia",
    type: "official-guidance",
    retrieved: "2026-08-15",
  },
  {
    id: "us-sec-cyber",
    title: "SEC cybersecurity disclosure rules (17 CFR Parts 229, 232, 239, 240, 249)",
    publisher: "U.S. Securities and Exchange Commission",
    url: "https://www.sec.gov/rules/final/2023/33-11216.pdf",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },

  // ── India ─────────────────────────────────────────────────────────────────
  {
    id: "in-dpdp-2023",
    title: "Digital Personal Data Protection Act, 2023",
    publisher: "Ministry of Electronics and Information Technology",
    url: "https://www.meity.gov.in/data-protection-framework",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "in-it-act-2000",
    title: "Information Technology Act, 2000",
    publisher: "India Code, Government of India",
    url: "https://www.indiacode.nic.in/handle/123456789/1999",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "in-cert-directions",
    title: "CERT-In Directions under section 70B(6) of the IT Act, 2000",
    publisher: "Indian Computer Emergency Response Team (CERT-In)",
    url: "https://www.cert-in.org.in/",
    type: "regulator",
    retrieved: "2026-08-15",
  },

  // ── Singapore ─────────────────────────────────────────────────────────────
  {
    id: "sg-cybersecurity-act",
    title: "Cybersecurity Act 2018",
    publisher: "Singapore Statutes Online, Attorney-General's Chambers",
    url: "https://sso.agc.gov.sg/Act/CA2018",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "sg-cma",
    title: "Computer Misuse Act 1993",
    publisher: "Singapore Statutes Online, Attorney-General's Chambers",
    url: "https://sso.agc.gov.sg/Act/CMA1993",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "sg-pdpa",
    title: "Personal Data Protection Act 2012",
    publisher: "Singapore Statutes Online, Attorney-General's Chambers",
    url: "https://sso.agc.gov.sg/Act/PDPA2012",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },

  // ── China ─────────────────────────────────────────────────────────────────
  {
    id: "cn-csl",
    title: "Cybersecurity Law of the People's Republic of China",
    publisher: "National People's Congress",
    url: "http://www.npc.gov.cn/",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "cn-dsl",
    title: "Data Security Law of the People's Republic of China",
    publisher: "National People's Congress",
    url: "http://www.npc.gov.cn/",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "cn-pipl",
    title: "Personal Information Protection Law of the People's Republic of China",
    publisher: "National People's Congress",
    url: "http://www.npc.gov.cn/",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "cn-cac",
    title: "Cyberspace Administration of China",
    publisher: "CAC",
    url: "http://www.cac.gov.cn/",
    type: "regulator",
    retrieved: "2026-08-15",
  },

  // ── Japan ─────────────────────────────────────────────────────────────────
  {
    id: "jp-appi",
    title: "Act on the Protection of Personal Information (Act No. 57 of 2003)",
    publisher: "Personal Information Protection Commission",
    url: "https://www.ppc.go.jp/en/legal/",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "jp-unauthorized-access",
    title: "Act on Prohibition of Unauthorized Computer Access (Act No. 128 of 1999)",
    publisher: "Japanese Law Translation, Ministry of Justice",
    url: "https://www.japaneselawtranslation.go.jp/",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "jp-nisc",
    title: "National center of Incident readiness and Strategy for Cybersecurity",
    publisher: "NISC",
    url: "https://www.nisc.go.jp/eng/",
    type: "regulator",
    retrieved: "2026-08-15",
  },

  // ── Australia ─────────────────────────────────────────────────────────────
  {
    id: "au-soci",
    title: "Security of Critical Infrastructure Act 2018",
    publisher: "Federal Register of Legislation, Australian Government",
    url: "https://www.legislation.gov.au/C2018A00029",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "au-privacy-act",
    title: "Privacy Act 1988",
    publisher: "Federal Register of Legislation, Australian Government",
    url: "https://www.legislation.gov.au/C2004A03712",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "au-oaic",
    title: "Office of the Australian Information Commissioner",
    publisher: "OAIC",
    url: "https://www.oaic.gov.au/",
    type: "regulator",
    retrieved: "2026-08-15",
  },

  // ── Brazil ────────────────────────────────────────────────────────────────
  {
    id: "br-lgpd",
    title: "Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais",
    publisher: "Presidência da República, Casa Civil",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "br-marco-civil",
    title: "Lei nº 12.965/2014 — Marco Civil da Internet",
    publisher: "Presidência da República, Casa Civil",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "br-anpd",
    title: "Autoridade Nacional de Proteção de Dados",
    publisher: "ANPD",
    url: "https://www.gov.br/anpd/",
    type: "regulator",
    retrieved: "2026-08-15",
  },

  // ── United Arab Emirates ──────────────────────────────────────────────────
  {
    id: "ae-cybercrime",
    title:
      "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrimes",
    publisher: "UAE Government Portal",
    url: "https://u.ae/en/about-the-uae/digital-uae/regulatory-framework-for-the-digital-economy",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },
  {
    id: "ae-pdpl",
    title: "Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data",
    publisher: "UAE Government Portal",
    url: "https://u.ae/en/about-the-uae/digital-uae/regulatory-framework-for-the-digital-economy",
    type: "primary-legislation",
    retrieved: "2026-08-15",
  },

  // ── International ─────────────────────────────────────────────────────────
  {
    id: "un-cybercrime-convention",
    title: "United Nations Convention against Cybercrime",
    publisher: "United Nations Office on Drugs and Crime",
    url: "https://www.unodc.org/unodc/en/cybercrime/convention/home.html",
    type: "treaty",
    retrieved: "2026-08-15",
  },
  {
    id: "coe-budapest",
    title: "Convention on Cybercrime (ETS No. 185, Budapest Convention)",
    publisher: "Council of Europe",
    url: "https://www.coe.int/en/web/conventions/full-list?module=treaty-detail&treatynum=185",
    type: "treaty",
    retrieved: "2026-08-15",
  },
];
