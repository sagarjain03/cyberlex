# CyberLex Global — Product Requirements Document

**Version:** 1.0 (v1 scope)
**Status:** Approved for build
**Last updated:** 2026-08-14
**Owner:** Sagar Jain

---

## 1. Problem Statement

Cyber law is now a fast-moving, fragmented, multi-jurisdictional surface — and the people who have to comply with it have no single place to see it.

A team shipping one product to five markets is simultaneously exposed to the EU AI Act's staged obligations, NIS2 incident reporting, India's DPDP Act rules, Singapore's Cybersecurity Act amendments, China's data export regime, and a UN Convention against Cybercrime that changes how cross-border evidence requests will work. Each of these lives in a different place, in a different format, in a different language of law.

Three specific failures make this painful:

1. **Discovery is fragmented.** Primary sources are scattered across EUR-Lex, national gazettes, ministry PDFs, and parliamentary trackers. There is no normalized view of "what is the primary cyber statute in country X, and is it actually in force?"

2. **"Passed" ≠ "in force."** A law can be passed by a legislature and still be legally inert for months or years until it is notified/gazetted/commenced. Teams routinely either over-comply with something not yet enforceable, or get blindsided when a dormant act is suddenly commenced. Almost no public tool tracks this gap explicitly.

3. **Comparison is manual and unquantified.** "Is Singapore stricter than India on breach reporting?" is currently answered by a lawyer reading two statutes for an hour. There is no normalized, side-by-side, apples-to-apples view of prison exposure, corporate fine ceilings, reporting windows, and AI governance posture.

On top of this, a fourth gap is opening fast: **AI-enabled cyber crime is outrunning the statutes written to address it.** Polymorphic malware, deepfake-driven identity fraud, model poisoning, prompt injection, and automated social engineering swarms are frequently prosecuted under statutes drafted before these techniques existed. Practitioners need to see which existing provisions actually bite, and where the coverage gaps are.

**CyberLex Global** is a centralized intelligence hub that normalizes global cyber law into a comparable, queryable, status-aware dataset — with an AI legal summarizer for plain-language interpretation.

### What this product is *not*

It is a **research and orientation tool**, not a source of legal advice. Every screen that renders a legal conclusion must carry a disclaimer and a link to the primary source. This is a hard product requirement, not a footnote (see §7 R-1).

---

## 2. Target Users

### Persona A — "Priya", Senior Backend Developer / Tech Lead
**Context:** Shipping a fintech API to EU, India, and Singapore. Not a lawyer, has never read a statute end to end.
**Trigger:** A ticket says "we need to be NIS2-ready" and she has no idea what that implies for her incident pipeline.
**Needs:**
- The 60-second version: what the law is, who it binds, what the breach reporting clock is.
- Concrete engineering implications (log retention, notification windows, data residency).
- To know whether something is actually enforceable *today* or is a 2027 problem.

**Success looks like:** She lands on the dashboard, filters to her three markets, and within two minutes has the reporting windows and fine exposure written into her design doc — with source links she can hand to legal.

**Anti-goal:** Walls of legalese. Priya bounces on anything that reads like a PDF of a gazette.

---

### Persona B — "Marcus", Compliance Officer / DPO
**Context:** Owns regulatory posture for a 400-person SaaS company operating in 9 countries.
**Trigger:** Quarterly board deck; also, an internal question of "which market is our biggest regulatory risk?"
**Needs:**
- Defensible, cited comparisons — he will be asked "where did this number come from?"
- Early warning on draft and unnotified legislation, because his lead time for policy change is 6–12 months.
- Normalized fine structures — flat caps vs % of global turnover are not comparable without help.
- Export-able / linkable views for stakeholders.

**Success looks like:** He uses the Comparator to build a "regulatory exposure by market" slide, and the Tracker to justify next year's compliance budget.

**Anti-goal:** Uncited numbers, or data with no "last verified" date. If he can't trace a figure to a primary source, he cannot use it.

---

### Persona C — "Dr. Anya", Security Researcher / Threat Intelligence Analyst
**Context:** Publishes on AI-enabled attack techniques; advises a national CERT.
**Trigger:** Writing up a deepfake-enabled BEC campaign and needs to map technique → prosecutable offence, per jurisdiction.
**Needs:**
- The AI Crimes module: technique taxonomy mapped to statutes that plausibly apply.
- Explicit visibility of **coverage gaps** — where no statute cleanly applies.
- Strictness scoring methodology she can critique (she will).

**Success looks like:** She cites a CyberLex AI-crime mapping page in a threat report, and the methodology page holds up to scrutiny.

**Anti-goal:** Hand-wavy "AI law" content with no statutory anchoring.

---

### Secondary audiences (not designed *for*, but should not be alienated)
- Law students and policy researchers.
- Journalists covering cyber regulation.
- Founders doing market-entry due diligence.

---

## 3. Core Modules & User Stories

Story IDs are stable and referenced from `docs/phases.md`.

---

### Module 1 — Global Law Directory & Dashboard
**Route:** `/`, `/jurisdictions/[code]`
**Goal:** One screen that answers "what is the cyber law landscape, globally, right now."

| ID | User story | Acceptance criteria |
|----|-----------|---------------------|
| **M1-1** | As Priya, I want a grid of jurisdictions with their primary cyber statute, so I can orient in seconds. | Grid renders 8–10 jurisdiction cards. Each shows: flag/ISO code, country name, primary act name + year, legal status badge, strictness score (0–100). Renders on mobile as a single column, 2-up at `md`, 3-up at `xl`. |
| **M1-2** | As Marcus, I want to filter and sort the directory, so I can isolate my markets. | Filters: region, legal status, AI-governance posture, strictness band. Sort: strictness (asc/desc), country name, most recently updated. Filter state is reflected in the URL query string and is shareable. |
| **M1-3** | As Priya, I want a jurisdiction detail page, so I can go one level deeper without leaving the app. | `/jurisdictions/[code]` shows: all tracked laws for that jurisdiction, strictness score breakdown by dimension, breach reporting window, penalty structure, regulator/enforcement body, AI governance stance, source citations with `lastVerified` dates. |
| **M1-4** | As Marcus, I want to see *when* the data was last verified, so I can trust it. | Every jurisdiction card and detail page renders a `lastVerified` date. Records older than a configured staleness threshold render a visible "verify before relying" affordance. |
| **M1-5** | As any user, I want summary stats at the top of the dashboard, so I get the macro picture. | Header stat strip: total jurisdictions tracked, count in force, count unnotified, count in draft, count with binding AI-specific rules, average strictness. |
| **M1-6** | As Dr. Anya, I want to understand how the strictness score is computed. | A `/methodology` page documents every scoring dimension, its weight, and its data source. The score component itself links to it. |

**Jurisdictions in v1 (10):** United States (federal), European Union, United Kingdom, India, Singapore, China, Japan, Australia, Brazil, United Arab Emirates.
*Rationale: covers the major regulatory archetypes — sectoral/patchwork (US), comprehensive-harmonized (EU), post-Brexit divergence (UK), emerging-major-market (India, Brazil), high-enforcement compact (Singapore, UAE), state-security-oriented (China), and a mature-but-distinct APAC pair (Japan, Australia).*

---

### Module 2 — Side-by-Side Strictness Comparator
**Route:** `/compare?a=EU&b=IN&c=SG`
**Goal:** Turn "which of these is stricter?" from a one-hour research task into a 10-second read.

| ID | User story | Acceptance criteria |
|----|-----------|---------------------|
| **M2-1** | As Marcus, I want to select 2–3 jurisdictions and compare them side by side. | Selector supports min 2, max 3. Selection persists in the URL (`?a=&b=&c=`) and is shareable/bookmarkable. Invalid or unknown codes degrade gracefully to the selector. |
| **M2-2** | As Marcus, I want to compare **criminal exposure**. | Row group: maximum custodial sentence for unauthorized access, for data theft, for ransomware/extortion, and whether corporate officer liability exists. Values normalized to years; "no specific provision" is an explicit, visually distinct state — never a blank cell. |
| **M2-3** | As Marcus, I want to compare **corporate financial exposure** across incompatible fine structures. | Each jurisdiction shows both the raw structure (e.g. "flat cap" vs "% of global annual turnover") **and** a normalized worst-case figure computed against a user-adjustable hypothetical revenue. Default hypothetical revenue: USD 100M, adjustable via a control. The normalization formula is disclosed inline. |
| **M2-4** | As Priya, I want to compare **breach reporting windows**. | Row group: initial notification deadline (hours), full report deadline, regulator vs data-subject notification split, sectoral variations flagged. Rendered as a visual timeline so the tightest window is obvious at a glance. |
| **M2-5** | As Dr. Anya, I want to compare **AI governance stance**. | Row group: binding AI-specific statute (yes/no/partial), risk-tier classification model, mandatory conformity assessment, deepfake/synthetic-media provisions, in-force date. |
| **M2-6** | As Priya, I want to see *where the differences actually are*. | A "highlight divergence" toggle dims rows where the compared jurisdictions are materially equivalent and emphasizes rows where they diverge. |
| **M2-7** | As Marcus, I want the comparator to be usable on my phone. | Below `lg`, the comparison renders as horizontally-scrollable columns with a sticky row-label gutter — never a squashed table, never a hidden column. |

---

### Module 3 — Unnotified & Draft Laws Tracker
**Route:** `/tracker`
**Goal:** The differentiator. Show the gap between "passed" and "enforceable."

| ID | User story | Acceptance criteria |
|----|-----------|---------------------|
| **M3-1** | As Marcus, I want to see laws that are passed but not yet in force. | Each entry shows: act name, jurisdiction, date passed, current commencement status, what is blocking commencement (rules pending / gazette notification pending / phased schedule), expected or announced commencement date if any. |
| **M3-2** | As Marcus, I want to see bills still under review. | Each entry shows: bill name, jurisdiction, legislative stage, sponsoring body, last action date, and a plain-language "what would change if this passes." |
| **M3-3** | As Marcus, I want a legislative-stage pipeline view. | Entries are grouped by stage: `Consultation → Introduced → In Committee → Passed → Awaiting Notification → Partially In Force`. The visual makes progression direction obvious. |
| **M3-4** | As Marcus, I want to filter the tracker by jurisdiction and by expected-impact severity. | Filters persist in the URL. Empty filter results render a designed empty state, not a blank panel. |
| **M3-5** | As Priya, I want to know when something becomes *my* problem. | Entries carry a "developer impact" flag (none / low / material) with a one-line explanation of the engineering implication. |
| **M3-6** | As any user, I need to know staged/phased laws are not binary. | Records support a *partial* in-force state with a per-obligation phase schedule (obligation → applicable from date). |

---

### Module 4 — AI-Related Cyber Crimes Module
**Route:** `/ai-crimes`, `/ai-crimes/[slug]`
**Goal:** Map emerging AI-enabled attack techniques to the statutes that (may) cover them — and name the gaps.

| ID | User story | Acceptance criteria |
|----|-----------|---------------------|
| **M4-1** | As Dr. Anya, I want a taxonomy of AI-enabled cyber crime categories. | v1 categories: (a) polymorphic / self-modifying malware, (b) deepfakes & synthetic identity fraud, (c) model poisoning & training-data attacks, (d) prompt injection & agent hijacking, (e) automated social engineering swarms, (f) autonomous vulnerability discovery & exploitation. Each has severity, prevalence, and a plain-language description. |
| **M4-2** | As Dr. Anya, I want each technique mapped to applicable statutes per jurisdiction. | Detail page lists, per jurisdiction: applicable statute + section, whether the mapping is *direct* (statute names the technique) or *analogical* (a general provision is being stretched), and the associated penalty range. |
| **M4-3** | As Dr. Anya, I want coverage gaps made explicit. | Where no statute plausibly applies, the UI renders an explicit "No clear statutory coverage" state, visually distinct from "not yet researched." These two states must never be conflated. |
| **M4-4** | As Priya, I want defensive/technical context, not just legal context. | Each technique page carries a short "technical profile": how the attack works at a high level, and typical indicators. Defensive framing only — no operational offensive detail. |
| **M4-5** | As Marcus, I want to see which techniques carry the highest regulatory risk for my markets. | A coverage matrix: techniques (rows) × jurisdictions (columns), each cell showing direct / analogical / no-coverage / unresearched. Horizontally scrollable on mobile with sticky row labels. |

---

### Module 5 — AI Legal Summarizer
**Route:** `/assistant`
**API:** `POST /api/summarize`
**Goal:** Ask a question in plain English, get a structured, grounded answer.

| ID | User story | Acceptance criteria |
|----|-----------|---------------------|
| **M5-1** | As Priya, I want to ask a natural-language question about a law and get a usable answer. | Search input accepts free text (min 8 chars, max 500). Submit calls `POST /api/summarize`. The Groq API key is used **server-side only** and never reaches the client bundle. |
| **M5-2** | As Priya, I want the answer in a predictable structure, not a wall of prose. | Response renders three fixed sections: **Overview** (what the law is and who it binds), **Sanctions** (penalties, fines, custodial exposure), **Compliance Takeaways** (3–6 actionable bullets). Response is validated against a schema before render. |
| **M5-3** | As Marcus, I want the answer anchored to the jurisdictions/laws we actually track. | Relevant jurisdiction and law records from the local data layer are injected as grounding context into the prompt. The response surfaces which tracked records it drew on, each linking to the corresponding in-app page. |
| **M5-4** | As any user, I want to know when the AI is unsure or out of scope. | The response schema includes a `confidence` field and an `outOfScope` flag. Low confidence and out-of-scope answers render a distinct, visually honest state — not a confident-looking answer. |
| **M5-5** | As any user, I want the thing to fail gracefully. | Every failure mode (rate limit, timeout, malformed output, empty output, upstream 5xx, missing key) has a specific, non-technical, actionable UI state. No raw stack traces, no upstream error bodies, no silent failures. See `docs/rules.md` §4. |
| **M5-6** | As Priya, I want to start from examples rather than a blank box. | The assistant page offers 4–6 example queries as one-tap chips, chosen to demo the range of the tool. |
| **M5-7** | As any user, I must be told this is not legal advice. | A persistent, non-dismissible disclaimer is attached to every AI-generated response — visually part of the response, not a page-footer afterthought. |
| **M5-8** | As an operator, I need the endpoint protected from abuse. | Per-IP rate limiting on `/api/summarize`, request body size cap, input length validation, and a hard server-side timeout. |

---

## 4. Cross-Cutting Requirements

| ID | Requirement |
|----|------------|
| **X-1** | **Mobile-first.** Every module is designed at 375px first, then scaled up. Bottom nav below `lg`, top nav at `lg`+. |
| **X-2** | **Swappable data layer.** All data access goes through async repository functions in `lib/data/`. Components never import from `data/` directly. Migrating to a real backend must not require touching a single component. |
| **X-3** | **Cited data.** Every law, penalty, and date carries at least one primary source URL and a `lastVerified` date. Uncited figures do not ship. |
| **X-4** | **Type safety.** No `any`. All domain shapes live in `types/`. |
| **X-5** | **Accessibility.** WCAG 2.2 AA baseline: keyboard navigable, visible focus, semantic landmarks, 4.5:1 body contrast, no color-only information encoding, `prefers-reduced-motion` respected. |
| **X-6** | **Performance.** Static-first. Data-driven pages are server-rendered; client JS is limited to genuinely interactive surfaces (filters, comparator selection, assistant). |
| **X-7** | **Honest empty/loading/error states.** Every async or filterable surface has all four states designed: loading, empty, error, populated. |

---

## 5. Success Criteria

### Product
- A first-time visitor can name the strictest of any three jurisdictions on breach reporting **within 60 seconds** of landing, without instructions.
- The Comparator answers a question that would otherwise take a practitioner **≥30 minutes** of primary-source reading.
- The Tracker surfaces at least one "passed but not in force" item per major jurisdiction that has one — content no comparable free tool exposes clearly.
- The AI Summarizer returns a schema-valid, three-section answer for **≥95%** of well-formed in-scope queries.

### Technical
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 (mobile, production build).
- `next build` passes with zero TypeScript errors and zero ESLint errors.
- Zero client-side bundle references to `GROQ_API_KEY` (verified by build-output grep in Phase 8).
- `/api/summarize` p95 latency < 6s; hard timeout at 20s with a designed fallback.
- No layout shift or horizontal overflow at 320px, 375px, 768px, 1024px, 1440px.

### Content
- 100% of law records carry ≥1 primary source URL and a `lastVerified` date.
- 10 jurisdictions, 6 AI-crime categories, and ≥12 tracker entries at v1 launch.

---

## 6. Explicitly Out of Scope for v1

Listed so scope creep has to argue its way in.

**Data & content**
- ❌ Live scraping or automated ingestion of gazettes/legislative feeds. All data is curated and static in v1.
- ❌ Full statute text hosting. We link to primary sources; we do not mirror them.
- ❌ Sub-national / state-level law (US states, Indian states, EU member-state transpositions beyond noting that they exist).
- ❌ Non-English source parsing. Sources may be non-English; our summaries are English-only.
- ❌ Sector-specific deep dives (healthcare, defence, critical infrastructure) beyond flagging that variations exist.

**Features**
- ❌ User accounts, authentication, saved comparisons, watchlists.
- ❌ Email/push alerts on legislative change.
- ❌ PDF / CSV export (linkable URLs serve the sharing need in v1).
- ❌ Multi-turn chat with history in the assistant — v1 is single-turn question → structured answer.
- ❌ Streaming token-by-token AI responses (v1 returns a complete validated object; streaming is a v2 candidate).
- ❌ Public API for third parties.
- ❌ i18n / localization.
- ❌ Light theme. The product is dark-only by design (see `docs/design.md`).
- ❌ Comment threads, community contributions, crowd-sourced corrections.

**Infrastructure**
- ❌ Database. The `data/` directory *is* the database in v1, behind a repository interface.
- ❌ Analytics/telemetry beyond deployment-platform defaults.
- ❌ Caching layer / Redis. In-memory per-instance rate limiting only, with the limitation documented.
- ❌ CI/CD pipeline beyond the deployment platform's default git integration.

---

## 7. Risks & Mitigations

| ID | Risk | Mitigation |
|----|------|-----------|
| **R-1** | **Users treat output as legal advice.** Highest-severity product risk. | Non-dismissible disclaimer on every AI response and every penalty figure. Primary-source links everywhere. `/methodology` states limitations explicitly. This is a launch blocker, not a nice-to-have. |
| **R-2** | **Data goes stale.** Cyber law moves monthly. | `lastVerified` on every record; visible staleness indicator past threshold; `/methodology` documents the review cadence. |
| **R-3** | **Strictness score is challenged as arbitrary.** It *is* a judgment call. | Publish the full weighting model, show the per-dimension breakdown rather than only a single number, and label the score a "comparative indicator," never a measurement. |
| **R-4** | **LLM hallucinates statutes or penalties.** | Ground the prompt in local tracked records; require a `confidence` field and an `outOfScope` flag; validate against a schema; instruct the model to refuse rather than guess; visually distinguish AI-generated content from curated data throughout the UI. |
| **R-5** | **Groq API unavailable, rate-limited, or the model ID is deprecated.** | Model ID is env-configurable with a documented fallback; every failure mode has a designed UI state; the other 4 modules remain fully functional without the API. |
| **R-6** | **Normalized fine comparison misleads.** % of turnover vs flat cap is genuinely not comparable. | Always show the raw structure alongside the normalized figure, disclose the assumption inline, and make the hypothetical revenue user-adjustable. |

---

## 8. Open Questions

| # | Question | Owner | Needed by |
|---|----------|-------|-----------|
| 1 | Should `/methodology` be a nav item or reachable only contextually from score components? | Product | Phase 2 |
| 2 | Groq model selection — confirm the exact production model ID against Groq's live model list before Phase 7. | Eng | Phase 7 |
| 3 | Staleness threshold for `lastVerified` — 90 or 180 days? | Product | Phase 1 |
| 4 | Do we ship Brazil and UAE in v1 (10 jurisdictions) or trim to 8 for data-quality depth? | Product | Phase 1 |
