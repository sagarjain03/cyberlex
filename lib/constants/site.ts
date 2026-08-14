export const SITE = {
  name: "CyberLex Global",
  shortName: "CyberLex",
  tagline: "Global Cyber Law Intelligence",
  description:
    "Track global cyber laws, compare jurisdictional strictness, monitor draft and unnotified legislation, and map AI-enabled cyber crime to the statutes that apply.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Rendered wherever a legal conclusion is displayed. docs/prd.md §7 R-1. */
  disclaimer:
    "CyberLex Global is a research and orientation tool, not legal advice. Always verify against the linked primary sources before relying on any figure.",
} as const;
