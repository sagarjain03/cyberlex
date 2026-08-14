# CyberLex Global — Build Phases

**Version:** 1.0
**Last updated:** 2026-08-14

Nine sequential phases. Each has a **Goal**, **Deliverables**, a **Done when** checklist, and **Notes/risks**. Phases build on each other — do not start a phase until the previous one's checklist is fully green.

**Universal exit criteria** — every phase, without exception:
- `npx tsc --noEmit` → 0 errors
- `npm run lint` → 0 errors, 0 warnings
- `npm run build` → succeeds
- Verified at 320 / 375 / 768 / 1024 / 1440 px
- `docs/memory.md` updated with what shipped, what's next, and any decisions made

Story IDs (`M1-1`, `M5-3`, …) refer to `docs/prd.md` §3.

---

## Phase 0 — Scaffolding, Config & Design Tokens

**Goal:** Turn the `create-next-app` default into a project whose foundations encode the design system and the rules. No feature work — but by the end, the app *looks* like CyberLex.

### Deliverables
- Install: `lucide-react`, `clsx`, `tailwind-merge`
- `app/globals.css` rewritten: `@import "tailwindcss"`, full `@theme` token block from `docs/design.md` (colors, fonts, spacing, radii, shadows, easing), base layer resets, and motif utilities (`.glass`, `.grid-mesh`, `.grain`, `.scanline`, `.hud-corners`)
- `app/layout.tsx`: `next/font/google` — Plus Jakarta Sans (`--font-sans`) + JetBrains Mono (`--font-mono`); real metadata (title template, description, OG); `<html lang="en">`; dark base background; skip-link; `<main>` landmark
- `lib/utils/cn.ts` — clsx + tailwind-merge
- `lib/constants/site.ts` — site name, description, base URL
- `lib/constants/nav.ts` — the 5 nav items (single source of truth)
- `lib/constants/thresholds.ts` — staleness window, strictness bands, severity bands
- `.env.example` committed with all keys from `architecture.md` §6, empty values
- `docs/memory.md` initialized with real Phase 0 status
- `eslint.config.mjs`: add `no-restricted-imports` blocking `@/data/*` outside `lib/data/`, and a rule banning `any`
- Delete `create-next-app` boilerplate from `app/page.tsx`; replace with a token-showcase placeholder proving the design system renders

### Done when
- [ ] `npm run dev` starts clean with Turbopack, no console warnings
- [ ] Both fonts load and are visibly applied (sans for UI, mono for numerals)
- [ ] Every color/spacing/radius/shadow token in `design.md` exists in `@theme` and is usable as a utility
- [ ] The placeholder page shows: the base background, grid mesh, grain overlay, and a glass panel — and it reads as "CyberLex," not "default dark mode"
- [ ] `cn()` correctly resolves a conflicting-class override
- [ ] `.env.example` is committed; `.env.local` is not (confirm `git status`)
- [ ] ESLint rejects a test import of `@/data/x` from a component
- [ ] Universal exit criteria pass

### Notes / risks
- **Tailwind v4 is CSS-first.** Do not create `tailwind.config.ts`. Read `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` before touching styling config.
- Do not add a custom webpack config — Turbopack is the default builder in Next 16 and a webpack config fails the build.
- Leave the managed block in `AGENTS.md` alone.

---

## Phase 1 — Types & Data Layer

**Goal:** The entire domain modeled in TypeScript, and the curated dataset behind an async repository boundary. This is the phase that determines whether the rest of the build is easy or painful — do not rush it.

### Deliverables
**Types** (`types/`): `jurisdiction.ts`, `law.ts`, `draft.ts`, `ai-crime.ts`, `comparison.ts`, `summary.ts`, `api.ts`, `source.ts`, `index.ts` (barrel).
Key unions defined once and used everywhere: `LegalStatus`, `LegislativeStage`, `CoverageLevel`, `CrimeSeverity`, `AiPosture`, `DeveloperImpact`, `ConfidenceLevel`.

**Data** (`data/`): `sources.ts` (source registry first — everything else references it), `jurisdictions.ts` (10 records), `laws.ts`, `metrics.ts` (comparator values), `drafts.ts` (≥12 entries), `ai-crimes.ts` (6 techniques + mappings), `README.md` (sourcing rules + update procedure).

**Repository** (`lib/data/`): `jurisdictions.ts`, `laws.ts`, `comparisons.ts`, `drafts.ts`, `ai-crimes.ts`, `stats.ts`, `index.ts`.

**Scoring** (`lib/scoring/`): `weights.ts` (published dimension weights), `strictness.ts` (score computation), `normalize.ts` (fine + sentence normalization).

**Utils** (`lib/utils/`): `format.ts` (Intl-based currency/date/duration), `slug.ts`, `url-state.ts`.

### Done when
- [ ] Every type compiles; no `any` anywhere in `types/` or `data/`
- [ ] All 10 jurisdictions have: primary act, status, regulator, breach reporting window, penalty structure, AI posture, strictness dimensions, ≥1 source, `lastVerified`
- [ ] **Every legal record carries ≥1 primary source URL and a `lastVerified` date** — verified by a script or manual audit, no exceptions
- [ ] ≥12 tracker entries spanning ≥4 legislative stages, including at least one genuinely unnotified act and one phased/partial-commencement law
- [ ] All 6 AI-crime techniques have per-jurisdiction coverage entries; `no-coverage` and `not-researched` are used distinctly and correctly
- [ ] `getStrictnessScore()` returns 0–100 for all 10 jurisdictions, and the per-dimension breakdown sums to the total
- [ ] Fine normalization produces sane figures for both flat-cap and %-turnover structures at a USD 100M hypothetical
- [ ] Every repository function is `async` and returns view-ready shapes
- [ ] A temporary server-side smoke page renders every repository function's output without error
- [ ] Universal exit criteria pass

### Notes / risks
- ⚠️ **Highest-risk phase for product integrity.** Anything not verifiable against a primary source is marked `not-researched` — never guessed. A plausible-looking fabricated penalty figure is worse than a visible gap.
- Resolve PRD open questions #3 (staleness threshold) and #4 (10 vs 8 jurisdictions) here.
- Model *before* populating. A shape change after 10 records is cheap; after 60 it is not.
- Design `PhaseSchedule` and the partial-in-force representation now — retrofitting staged commencement later is expensive.

---

## Phase 2 — Layout Shell & Navigation

**Goal:** The persistent chrome: navigation that switches at `lg`, background motifs, and the shared UI primitives every module will consume.

### Deliverables
- `components/layout/`: `top-nav.tsx` (client), `bottom-nav.tsx` (client), `mobile-header.tsx` (client), `site-footer.tsx`, `page-header.tsx`, `background-fx.tsx`
- `components/ui/` primitives: `glass-panel`, `badge`, `button`, `input`, `select`, `segmented-control`, `skeleton`, `empty-state`, `error-state`, `tooltip`, `sheet`, `stat-tile`, `scroll-shadow`, `disclaimer`
- `components/shared/`: `status-badge`, `strictness-meter`, `strictness-dial`, `score-breakdown`, `jurisdiction-flag`, `source-list`, `last-verified`, `severity-badge`, `ai-generated-marker`
- Root layout wires: `BackgroundFx` → `MobileHeader`/`TopNav` → `<main>` → `SiteFooter` → `BottomNav`
- Route stubs so navigation works end to end: `/compare`, `/tracker`, `/ai-crimes`, `/assistant`, `/methodology`
- `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`
- `hooks/use-scroll-state.ts`, `hooks/use-media-query.ts`

### Done when
- [ ] Bottom nav below `lg`, top nav at `lg`+, switching cleanly with no flash or layout shift
- [ ] Active route state correct on every one of the 5 destinations, both navs
- [ ] Bottom nav clears the iOS home indicator (`env(safe-area-inset-bottom)`); no content hides behind it
- [ ] All 5 primary routes reachable by tap and by keyboard
- [ ] Skip-link is the first focusable element and is visible on focus
- [ ] `StrictnessMeter` renders correctly at scores 0, 35, 55, 78, 100 in all three sizes
- [ ] `StatusBadge` renders all 5 `LegalStatus` values, each with an icon **and** a text label
- [ ] Glass panels composite correctly over the grid mesh; text on glass measures ≥4.5:1 against the composited background
- [ ] `prefers-reduced-motion: reduce` disables sweeps, pulses, and shimmer
- [ ] Universal exit criteria pass

### Notes / risks
- Nav components are the *only* layout-level client components. Keep them leaf-shaped.
- Build primitives against `design.md`, not by improvising — every later phase inherits these decisions.
- Verify `backdrop-filter` compositing on a real device; the glass system is the aesthetic and it must not turn to mud on mobile GPUs.

---

## Phase 3 — Dashboard & Jurisdiction Detail (M1)

**Goal:** The first complete module. Landing on `/` should answer "what is the global cyber law landscape?" in under a minute.

### Deliverables
- `app/page.tsx` — stat strip + filter bar + jurisdiction grid (Server Component, reads `await searchParams`)
- `components/dashboard/`: `stat-strip`, `jurisdiction-grid`, `jurisdiction-card`, `directory-filters` (client), `sort-control` (client)
- `app/jurisdictions/[code]/page.tsx` with `generateStaticParams` + `generateMetadata`, plus `loading.tsx` and `not-found.tsx`
- `app/loading.tsx` — dashboard skeleton
- `hooks/use-url-filters.ts`
- `app/methodology/page.tsx` — real content: scoring dimensions, weights, sourcing policy, limitations, disclaimer
- `app/sitemap.ts`, `app/robots.ts`

### Done when
- [ ] **M1-1** — Grid renders all jurisdictions; 1-up mobile, 2-up `md`, 3-up `xl`
- [ ] **M1-2** — Region/status/AI-posture/strictness filters and both sorts work; state is in the URL; a pasted filtered URL reproduces the exact view
- [ ] **M1-3** — Every jurisdiction detail page renders: all laws, score breakdown, reporting window, penalties, regulator, AI stance, sources
- [ ] **M1-4** — `lastVerified` visible everywhere; stale records show the staleness affordance
- [ ] **M1-5** — Stat strip figures are computed from the repository and are correct
- [ ] **M1-6** — `/methodology` documents every dimension and weight; score components link to it
- [ ] Filtering to zero results renders the designed empty state
- [ ] All detail pages are statically generated (confirm in build output)
- [ ] No client-side data fetching anywhere in this module
- [ ] Universal exit criteria pass

### Notes / risks
- Filter changes use `router.replace(url, { scroll: false })` — pushing a history entry per keystroke ruins the back button.
- The jurisdiction card is the product's signature object. Get the ISO watermark, meter, and status badge composition right here; it sets the tone for everything after.

---

## Phase 4 — Strictness Comparator (M2)

**Goal:** The module that saves the most user time — and the hardest layout problem in the app.

### Deliverables
- `app/compare/page.tsx` (Server Component, `await searchParams`), `loading.tsx`, `error.tsx`
- `components/compare/`: `comparator-selector` (client), `comparison-grid` (client), `comparison-section`, `comparison-row`, `fine-normalizer` (client), `reporting-timeline`, `divergence-toggle` (client)
- `hooks/use-compare-selection.ts` — validates codes, clamps to 2–3, syncs to `?a=&b=&c=`
- `lib/data/comparisons.ts` fully implemented
- "Compare with…" CTA on jurisdiction detail pages deep-linking into `/compare`

### Done when
- [ ] **M2-1** — 2–3 selection enforced; URL is shareable; invalid/unknown codes fall back to the selector without an error screen
- [ ] **M2-2** — Criminal exposure rows normalized to years; "no specific provision" is visually explicit, never a blank cell
- [ ] **M2-3** — Both raw fine structure and normalized worst-case shown; hypothetical revenue is adjustable and recomputes live; the formula is disclosed inline
- [ ] **M2-4** — Reporting windows render as a timeline; the tightest window is obvious at a glance
- [ ] **M2-5** — AI governance rows complete for all 10 jurisdictions
- [ ] **M2-6** — Divergence toggle dims equivalent rows and emphasizes divergent ones
- [ ] **M2-7** — At 375px: horizontal scroll with a sticky row-label gutter, edge-fade affordance, no squashing, no hidden columns
- [ ] Semantic `<table>` with `<th scope>` — screen-reader navigable
- [ ] Universal exit criteria pass

### Notes / risks
- ⚠️ The mobile layout is the crux of this phase. Prototype the sticky-gutter scroll before building all rows.
- Comparison logic lives in `lib/data/comparisons.ts`, never in components — it will be reused by the assistant's grounding step in Phase 7.
- Fine normalization must never look more precise than it is. Show the assumption every time.

---

## Phase 5 — Unnotified & Draft Laws Tracker (M3)

**Goal:** The product's differentiator — make the "passed but not in force" gap visible.

### Deliverables
- `app/tracker/page.tsx` + `loading.tsx`
- `components/tracker/`: `stage-pipeline`, `stage-column`, `draft-law-card`, `commencement-status`, `phase-schedule`, `tracker-filters` (client)
- `lib/data/drafts.ts` fully implemented

### Done when
- [ ] **M3-1** — Unnotified acts show date passed, commencement status, the blocker, and expected date where known
- [ ] **M3-2** — Bills show stage, sponsoring body, last action, and "what would change if this passes"
- [ ] **M3-3** — Pipeline groups entries by stage with obvious progression direction
- [ ] **M3-4** — Jurisdiction and impact filters persist in the URL; empty results render a designed empty state
- [ ] **M3-5** — Developer-impact flag on every entry with a one-line engineering implication
- [ ] **M3-6** — Partial/phased commencement renders as an obligation → applicable-from timeline, not a binary badge
- [ ] Pipeline is legible at 375px (vertical stacking or horizontal scroll — chosen deliberately, not by accident)
- [ ] Universal exit criteria pass

### Notes / risks
- This module's value is entirely in data quality. If Phase 1's tracker data is thin, fix the data — do not paper over it with UI.
- `CommencementStatus` is the most nuanced display logic in the app. Comment the *why* (see `rules.md` §2.7).

---

## Phase 6 — AI-Related Cyber Crimes (M4)

**Goal:** Map emerging AI-enabled techniques to statutes — and name the gaps honestly.

### Deliverables
- `app/ai-crimes/page.tsx` + `loading.tsx`
- `app/ai-crimes/[slug]/page.tsx` with `generateStaticParams` + `generateMetadata`, plus `not-found.tsx`
- `components/ai-crimes/`: `crime-grid`, `crime-card`, `coverage-matrix` (client), `coverage-cell`, `statute-mapping`, `technical-profile`
- `lib/data/ai-crimes.ts` fully implemented

### Done when
- [ ] **M4-1** — All 6 techniques render with severity, prevalence, and a plain-language description
- [ ] **M4-2** — Detail pages map each technique to statutes per jurisdiction, marked *direct* vs *analogical*, with penalty ranges
- [ ] **M4-3** — "No clear statutory coverage" and "not yet researched" are **visually and semantically distinct** — this is a correctness requirement, not a styling preference
- [ ] **M4-4** — Technical profiles are defensive-framing only; no operational offensive detail
- [ ] **M4-5** — Coverage matrix renders technique × jurisdiction with sticky row + column headers; horizontally scrollable at 375px
- [ ] Matrix cells carry a glyph as well as a color; the matrix is keyboard-navigable and screen-reader legible
- [ ] The violet AI accent is used consistently and only for AI-related surfaces
- [ ] Universal exit criteria pass

### Notes / risks
- ⚠️ Keep technical profiles educational and defensive. Describe *what the technique is and how to recognize it*, never *how to execute it*.
- The `analogical` mapping type is the interesting content — a general provision being stretched to cover a technique it never anticipated. Surface that nuance rather than flattening it into "covered."

---

## Phase 7 — AI Legal Summarizer + Groq Integration (M5)

**Goal:** The only external dependency in the product. Highest technical risk; strictest rules.

**⚠️ Read `docs/rules.md` §4 in full before writing a line of this phase.**

### Deliverables
- Install: `groq-sdk`, `zod`, `server-only`
- `lib/env.ts` — zod-validated env, `server-only`, single `process.env` entry point
- `lib/rate-limit.ts` — in-memory fixed-window per-IP limiter, with the per-instance limitation documented in a comment
- `lib/ai/`: `config.ts` (model, temperature, token cap, timeout, retry policy), `client.ts` (SDK singleton, `server-only`), `prompt.ts` (system prompt + grounding builder), `schema.ts` (zod response schema), `summarize.ts` (orchestration), `errors.ts` (upstream → `ApiErrorCode`)
- `app/api/summarize/route.ts` — `POST` handler implementing the full pre-flight → ground → call → validate → respond pipeline
- `app/api/health/route.ts` — `GET` liveness + provider-configured boolean
- `app/assistant/page.tsx` (server shell) + `error.tsx`
- `components/assistant/`: `assistant-console` (client), `query-input` (client), `example-chips` (client), `summary-result`, `summary-section`, `grounded-sources`, `confidence-indicator`, `assistant-error`
- `hooks/use-summarize.ts` — fetch lifecycle with abort, timeout, and typed errors

### Done when
- [ ] **M5-1** — A query returns a structured answer; `GROQ_API_KEY` is server-side only
- [ ] **M5-2** — Response renders as Overview / Sanctions / Compliance Takeaways, schema-validated before render
- [ ] **M5-3** — Grounding context is injected from `lib/data/`; cited records link back into the app
- [ ] **M5-4** — `confidence` and `outOfScope` render distinct, honest states
- [ ] **M5-5** — **All 14 failure modes in `rules.md` §4.3 are individually triggered and verified** (force each: bad key, unset key, wrong model ID, tiny timeout, forced malformed output, rate limit, oversized body, short/long query, aborted request). Each shows its designed UI state. No raw errors, no infinite spinners, no blank screens.
- [ ] **M5-6** — 4–6 example chips populate and submit the input
- [ ] **M5-7** — Non-dismissible disclaimer is structurally inseparable from every AI response
- [ ] **M5-8** — Rate limiting, body cap, and length validation all enforced and individually verified
- [ ] Retry policy verified: exactly one retry on 429/5xx/network/first-malformed; **zero** retries on timeout, non-429 4xx, or a second malformed response
- [ ] Total server time never exceeds `AI_REQUEST_TIMEOUT_MS`, retries included
- [ ] `GROQ_MODEL` default confirmed against Groq's live model list (PRD open question #2)
- [ ] With `GROQ_API_KEY` unset, Modules 1–4 are fully functional and `/assistant` shows the designed unavailable state
- [ ] AI output is visually distinguishable from curated data at a glance
- [ ] Universal exit criteria pass

### Notes / risks
- ⚠️ **Key leakage is the worst possible outcome.** `server-only` on `lib/env.ts` and `lib/ai/*` turns a mistake into a build failure. Do not skip it.
- ⚠️ Groq's model catalogue changes. Verify the ID before shipping; keep it env-configurable so a deprecation is a config change, not a deploy.
- Never render a partially-valid response. Schema mismatch is a failure, not a degraded success.
- Build the failure states *before* the happy path. They are the majority of the work and they are what users will actually hit.

---

## Phase 8 — Polish, Accessibility, Performance & Deploy

**Goal:** Take it from "works" to "production-grade."

### Deliverables
- Full accessibility audit against `rules.md` §5 (keyboard, screen reader, contrast, reduced motion)
- Full responsiveness sweep at 320 / 375 / 768 / 1024 / 1440
- Micro-interaction pass: hover, focus, active, and transition states per `design.md` §6
- Loading skeletons matching real content geometry (no generic spinners)
- `app/icon.tsx`, `app/opengraph-image.tsx`, per-route `generateMetadata`
- Performance: bundle analysis, client-JS audit, image optimization, font-loading check
- **Security gate:** grep the production build output for `GROQ_API_KEY` and for the live key value — zero hits in any client chunk
- `README.md` rewritten: what it is, setup, env vars, architecture summary, links into `docs/`
- Deploy (Vercel or equivalent) with production env vars set
- Final `docs/memory.md` update: v1 shipped, known limitations, v2 candidates

### Done when
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95
- [ ] Full keyboard traversal of every route with visible focus throughout
- [ ] Screen-reader pass on `/`, `/compare`, `/assistant` — content is announced coherently
- [ ] Zero contrast failures on real composited backgrounds
- [ ] `prefers-reduced-motion` honored across every animation
- [ ] No horizontal overflow at 320px on any route
- [ ] No layout shift on load (CLS ≈ 0)
- [ ] All four states (loading / empty / error / populated) exist on every async or filterable surface
- [ ] **Zero client-bundle references to the API key** — verified, documented in `memory.md`
- [ ] Every route has correct title, description, and OG image
- [ ] Deployed build works with production env vars; `/api/health` returns healthy
- [ ] Disclaimer present on every AI response and on `/methodology`
- [ ] Every PRD §5 success criterion assessed and recorded (pass or explicitly deferred)
- [ ] Universal exit criteria pass

### Notes / risks
- The security grep is a **launch gate**, not a nice-to-have.
- If Lighthouse Performance falls short, look at client-component creep first — the usual cause is a `'use client'` that drifted up the tree.
- Re-verify data staleness before launch: `lastVerified` dates should be recent at ship time.

---

## Phase Dependency Map

```
Phase 0 (scaffold + tokens)
    │
Phase 1 (types + data + scoring)   ← everything downstream depends on this
    │
Phase 2 (layout shell + primitives)
    │
    ├──► Phase 3 (Dashboard + detail + methodology)
    │        │
    │        └──► Phase 4 (Comparator)  ← needs detail pages for the "Compare with" CTA
    ├──► Phase 5 (Tracker)              ← independent of 3 and 4
    ├──► Phase 6 (AI Crimes)            ← independent of 3, 4, 5
    │
    └──► Phase 7 (AI Summarizer)        ← needs lib/data/ (Phase 1); grounding is richer after 3–6
             │
Phase 8 (polish + a11y + perf + deploy)
```

Phases 3, 5, and 6 are mutually independent and may be reordered. Phase 4 should follow Phase 3. Phase 7 technically only needs Phase 1, but grounding quality improves once Modules 1–4 exist, so it is scheduled last among features.

---

## Definition of Done — v1

- [ ] All 5 modules functional per their PRD acceptance criteria
- [ ] 10 jurisdictions, ≥12 tracker entries, 6 AI-crime techniques — all sourced and dated
- [ ] All PRD §5 success criteria met or explicitly deferred with a reason
- [ ] No item from PRD §6 (out of scope) accidentally built
- [ ] All PRD §7 risk mitigations implemented — R-1 (legal disclaimer) and R-4 (hallucination controls) are launch blockers
- [ ] `docs/memory.md` reflects final state, known limitations, and v2 candidates
