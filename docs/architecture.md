# CyberLex Global — Architecture

**Version:** 1.0
**Last updated:** 2026-08-14
**Applies to:** Next.js 16.3.1 (App Router) · React 19.2.8 · TypeScript 5 · Tailwind CSS v4

> ⚠️ **This project runs Next.js 16.** Several conventions differ from older App Router material: Turbopack is the default bundler, request APIs (`params`, `searchParams`, `cookies()`, `headers()`) are **async-only**, `middleware.ts` is replaced by `proxy.ts`, and Tailwind v4 is configured in CSS (`@theme`), not `tailwind.config.ts`. Before writing code in any phase, read the relevant guide in `node_modules/next/dist/docs/`.

---

## 1. App Flow & Route Map

### 1.1 Route map

| Route | Type | Rendering | Purpose |
|-------|------|-----------|---------|
| `/` | Page | Server (static) | Global Law Directory & Dashboard — stat strip + jurisdiction grid + filters |
| `/jurisdictions/[code]` | Page | Server (static, `generateStaticParams`) | Single-jurisdiction deep dive: all laws, score breakdown, penalties, sources |
| `/compare` | Page | Server shell + client island | Side-by-side strictness comparator; selection in `?a=&b=&c=` |
| `/tracker` | Page | Server (static) | Unnotified & draft laws, grouped by legislative stage |
| `/ai-crimes` | Page | Server (static) | AI-crime taxonomy grid + coverage matrix |
| `/ai-crimes/[slug]` | Page | Server (static, `generateStaticParams`) | Single technique: technical profile + statutory mapping per jurisdiction |
| `/assistant` | Page | Server shell + client island | AI Legal Summarizer — query input, structured response |
| `/methodology` | Page | Server (static) | Scoring model, data sourcing policy, limitations, disclaimer |
| `/api/summarize` | Route Handler | Server (dynamic, uncached) | `POST` → validate → ground → Groq → validate → structured JSON |
| `/api/health` | Route Handler | Server (dynamic, uncached) | `GET` → liveness + whether the AI provider is configured (booleans only, never key material) |

**Not-found & error routes:** `app/not-found.tsx` (global 404), `app/error.tsx` (root segment error boundary), `app/global-error.tsx` (root layout failures), plus per-segment `error.tsx` where a segment can fail independently (`/assistant`, `/compare`).

### 1.2 Navigation structure

Five primary destinations. This count is deliberate: it is the maximum that fits a mobile bottom nav without crowding.

```
Dashboard   →  /            (LayoutGrid icon)
Compare     →  /compare     (Scale icon)
Tracker     →  /tracker     (FileClock icon)
AI Crimes   →  /ai-crimes   (Brain / ShieldAlert icon)
Assistant   →  /assistant   (Sparkles icon)
```

`/methodology`, `/jurisdictions/[code]`, and `/ai-crimes/[slug]` are **secondary** destinations — reached contextually from cards, score components, and matrix cells; present in the desktop footer, absent from the primary nav.

The nav items are defined **once** in `lib/constants/nav.ts` and consumed by both `TopNav` and `BottomNav`. There is no second source of truth for navigation.

### 1.3 Mobile vs desktop navigation

Breakpoint: **`lg` (1024px)**. Chosen over `md` because the comparator and coverage matrix need genuine width before the desktop chrome earns its space.

| | **< lg — Mobile / Tablet** | **≥ lg — Desktop** |
|---|---|---|
| Primary nav | Fixed **bottom** nav, 5 items, icon + micro-label | Sticky **top** nav, logo left, links centre, actions right |
| Implementation | `<BottomNav />` rendered, `lg:hidden` | `<TopNav />` rendered, `hidden lg:flex` |
| Header | Compact sticky title bar (page title + contextual action) | Full top nav bar |
| Body padding | `pb-20` + `env(safe-area-inset-bottom)` to clear the bottom nav | `pt-16` to clear the sticky top nav |
| Active state | Icon fills cyan + 2px indicator bar above the item | Link text brightens + cyan underline glow |
| Filters | Bottom sheet triggered by a filter button | Inline sidebar / toolbar rail |
| Comparator | Horizontally scrollable columns, sticky row-label gutter | Full grid, all columns visible |

Both nav components are Client Components (they need `usePathname()` for active state) and are rendered from the root layout. Everything else stays server-rendered.

### 1.4 Page flows

**Dashboard → detail**
`/` → filter/sort (URL query state, no client refetch — server re-renders) → click jurisdiction card → `/jurisdictions/[code]` → "Compare with…" CTA → `/compare?a=[code]`.

**Comparator**
`/compare` → if fewer than 2 valid codes in the query, render the selector → user picks 2–3 → `router.replace()` writes `?a=&b=&c=` → server re-renders the comparison → "highlight divergence" toggle is pure client state (no URL write; it is a view preference, not shareable state).

**Assistant**
`/assistant` → user types or taps an example chip → client `POST /api/summarize` with an `AbortController` → loading skeleton → schema-validated response → three sections render → grounded records link back into the app.

---

## 2. Folder & File Structure

Complete target structure for v1. Every file listed has a one-line purpose. Files marked `[scaffold]` already exist from `create-next-app` and will be modified rather than created.

```
cyberlex-global/
├── app/
│   ├── layout.tsx                          [scaffold] Root layout: fonts, metadata, nav shell, skip-link, background motifs
│   ├── page.tsx                            [scaffold] Dashboard — stat strip, filter bar, jurisdiction grid
│   ├── globals.css                         [scaffold] Tailwind v4 entry: @import, @theme tokens, base layer, motif utilities
│   ├── favicon.ico                         [scaffold] Favicon
│   ├── icon.tsx                            Generated app icon (CyberLex mark)
│   ├── opengraph-image.tsx                 Generated OG image for social sharing
│   ├── sitemap.ts                          Generated sitemap from the route + data layer
│   ├── robots.ts                           Generated robots.txt
│   ├── not-found.tsx                       Global 404 page
│   ├── error.tsx                           Root segment error boundary (Client Component)
│   ├── global-error.tsx                    Root layout error boundary (Client Component)
│   ├── loading.tsx                         Dashboard loading skeleton
│   │
│   ├── jurisdictions/
│   │   └── [code]/
│   │       ├── page.tsx                    Jurisdiction detail; uses generateStaticParams + generateMetadata
│   │       ├── loading.tsx                 Detail loading skeleton
│   │       └── not-found.tsx               Unknown jurisdiction code
│   │
│   ├── compare/
│   │   ├── page.tsx                        Comparator server shell; reads await searchParams, resolves records
│   │   ├── loading.tsx                     Comparator skeleton
│   │   └── error.tsx                       Comparator error boundary
│   │
│   ├── tracker/
│   │   ├── page.tsx                        Unnotified & draft laws, grouped by legislative stage
│   │   └── loading.tsx                     Tracker skeleton
│   │
│   ├── ai-crimes/
│   │   ├── page.tsx                        Taxonomy grid + jurisdiction coverage matrix
│   │   ├── loading.tsx                     Taxonomy skeleton
│   │   └── [slug]/
│   │       ├── page.tsx                    Technique detail: technical profile + statutory mapping
│   │       └── not-found.tsx               Unknown technique slug
│   │
│   ├── assistant/
│   │   ├── page.tsx                        Server shell: intro, example chips, mounts the client console
│   │   └── error.tsx                       Assistant error boundary
│   │
│   ├── methodology/
│   │   └── page.tsx                        Scoring model, sourcing policy, limitations, legal disclaimer
│   │
│   └── api/
│       ├── summarize/
│       │   └── route.ts                    POST handler: rate limit → validate → ground → Groq → validate → respond
│       └── health/
│           └── route.ts                    GET liveness + provider-configured boolean (no key material)
│
├── components/
│   ├── layout/
│   │   ├── top-nav.tsx                     [client] Desktop sticky top nav, active-route state
│   │   ├── bottom-nav.tsx                  [client] Mobile fixed bottom nav, safe-area aware
│   │   ├── mobile-header.tsx               [client] Compact sticky mobile title bar
│   │   ├── site-footer.tsx                 Desktop footer: secondary links, disclaimer, data-vintage note
│   │   ├── page-header.tsx                 Shared page title / eyebrow / description block
│   │   └── background-fx.tsx               Grid mesh, radial vignette, grain overlay (decorative, aria-hidden)
│   │
│   ├── ui/                                 Primitives — no domain knowledge, no data imports
│   │   ├── glass-panel.tsx                 The core glass surface; variant + glow props
│   │   ├── badge.tsx                       Generic pill; tone + icon slot
│   │   ├── button.tsx                      Button/link primitive; primary | ghost | outline | danger
│   │   ├── segmented-control.tsx           [client] Segmented toggle (sort direction, view mode)
│   │   ├── select.tsx                      [client] Accessible custom select
│   │   ├── input.tsx                       Text input with icon slot and error state
│   │   ├── skeleton.tsx                    Shimmer loading placeholder
│   │   ├── empty-state.tsx                 Designed empty state: icon, headline, hint, optional action
│   │   ├── error-state.tsx                 Designed error state: cause, remedy, retry action
│   │   ├── tooltip.tsx                     [client] Accessible tooltip (hover + focus + touch)
│   │   ├── sheet.tsx                       [client] Mobile bottom sheet (filters)
│   │   ├── stat-tile.tsx                   Single metric tile for the dashboard stat strip
│   │   ├── scroll-shadow.tsx               [client] Edge fade affordance for horizontally scrollable regions
│   │   └── disclaimer.tsx                  Reusable "not legal advice" notice; inline | block variants
│   │
│   ├── shared/                             Domain-aware, reused across ≥2 modules
│   │   ├── status-badge.tsx                LegalStatus → badge (icon + label + tone). Never color-only.
│   │   ├── strictness-meter.tsx            Signature segmented score meter (sm | md | lg)
│   │   ├── strictness-dial.tsx             Radial score dial for detail pages
│   │   ├── score-breakdown.tsx             Per-dimension score bars with weights
│   │   ├── jurisdiction-flag.tsx           ISO code chip / flag glyph
│   │   ├── source-list.tsx                 Primary source citations with lastVerified dates
│   │   ├── last-verified.tsx               Verification date + staleness indicator
│   │   ├── severity-badge.tsx              Severity scale badge for AI crimes
│   │   └── ai-generated-marker.tsx         Visual marker distinguishing AI output from curated data
│   │
│   ├── dashboard/
│   │   ├── stat-strip.tsx                  Aggregate stats row above the grid
│   │   ├── jurisdiction-grid.tsx           Responsive grid container for jurisdiction cards
│   │   ├── jurisdiction-card.tsx           Single jurisdiction card: act, status, score, ISO watermark
│   │   ├── directory-filters.tsx           [client] Region / status / AI-posture / strictness filters → URL
│   │   └── sort-control.tsx                [client] Sort field + direction → URL
│   │
│   ├── compare/
│   │   ├── comparator-selector.tsx         [client] 2–3 jurisdiction picker; writes ?a=&b=&c=
│   │   ├── comparison-grid.tsx             [client] Column layout, sticky row-label gutter, divergence toggle
│   │   ├── comparison-row.tsx              One metric across N jurisdictions; handles the "no provision" state
│   │   ├── comparison-section.tsx          Row group (criminal / financial / reporting / AI)
│   │   ├── fine-normalizer.tsx             [client] Hypothetical-revenue control + normalized worst-case figure
│   │   ├── reporting-timeline.tsx          Visual breach-reporting window timeline
│   │   └── divergence-toggle.tsx           [client] Highlight-differences view toggle
│   │
│   ├── tracker/
│   │   ├── stage-pipeline.tsx              Legislative stage pipeline visual
│   │   ├── stage-column.tsx                One stage bucket with its entries
│   │   ├── draft-law-card.tsx              Single tracked bill / unnotified act
│   │   ├── commencement-status.tsx         Renders the passed → in-force gap, incl. phased schedules
│   │   ├── phase-schedule.tsx              Obligation → applicable-from timeline for staged laws
│   │   └── tracker-filters.tsx             [client] Jurisdiction / stage / impact filters → URL
│   │
│   ├── ai-crimes/
│   │   ├── crime-grid.tsx                  Taxonomy card grid
│   │   ├── crime-card.tsx                  Single technique card: severity, prevalence, one-liner
│   │   ├── coverage-matrix.tsx             [client] Technique × jurisdiction matrix, sticky headers
│   │   ├── coverage-cell.tsx               Direct / analogical / no-coverage / unresearched cell
│   │   ├── statute-mapping.tsx             Per-jurisdiction statute mapping list on the detail page
│   │   └── technical-profile.tsx           Defensive technical description block
│   │
│   └── assistant/
│       ├── assistant-console.tsx           [client] Orchestrates query state, fetch lifecycle, result render
│       ├── query-input.tsx                 [client] Textarea + submit + character counter + validation
│       ├── example-chips.tsx               [client] One-tap example queries
│       ├── summary-result.tsx              Overview / Sanctions / Compliance Takeaways renderer
│       ├── summary-section.tsx             One titled section of the structured response
│       ├── grounded-sources.tsx            Tracked records the answer drew on, linked into the app
│       ├── confidence-indicator.tsx        Model confidence + out-of-scope presentation
│       └── assistant-error.tsx             Maps ApiErrorCode → specific, actionable UI copy
│
├── lib/
│   ├── data/                               ⭐ The swap boundary. Components import ONLY from here.
│   │   ├── index.ts                        Public barrel — the only import surface for components
│   │   ├── jurisdictions.ts                getJurisdictions, getJurisdictionByCode, getJurisdictionsByCodes
│   │   ├── laws.ts                         getLaws, getLawsByJurisdiction, getLawById
│   │   ├── comparisons.ts                  getComparisonMatrix(codes) → normalized comparable rows
│   │   ├── drafts.ts                       getDraftLaws, getDraftsByStage, getUnnotifiedLaws
│   │   ├── ai-crimes.ts                    getAiCrimes, getAiCrimeBySlug, getCoverageMatrix
│   │   └── stats.ts                        getDirectoryStats — aggregates for the dashboard stat strip
│   │
│   ├── ai/
│   │   ├── client.ts                       Groq SDK singleton; server-only; reads validated env
│   │   ├── prompt.ts                       System prompt + grounding-context builder
│   │   ├── schema.ts                       Zod schema for the structured LLM response
│   │   ├── summarize.ts                    Orchestration: build → call → retry → parse → validate
│   │   ├── errors.ts                       Upstream failure → typed ApiErrorCode mapping
│   │   └── config.ts                       Model ID, temperature, token caps, timeout, retry policy
│   │
│   ├── scoring/
│   │   ├── strictness.ts                   Score computation from weighted dimensions
│   │   ├── weights.ts                      Published dimension weights (mirrored on /methodology)
│   │   └── normalize.ts                    Fine normalization (flat vs % turnover), sentence normalization
│   │
│   ├── utils/
│   │   ├── cn.ts                           clsx + tailwind-merge class combiner
│   │   ├── format.ts                       Currency, duration, date, and percentage formatters
│   │   ├── slug.ts                          Slug helpers for technique and jurisdiction routes
│   │   └── url-state.ts                    Typed searchParams read/write helpers
│   │
│   ├── constants/
│   │   ├── nav.ts                          Single source of truth for nav items (top + bottom)
│   │   ├── site.ts                         Site name, description, base URL, social metadata
│   │   └── thresholds.ts                   Staleness window, strictness bands, severity bands
│   │
│   ├── env.ts                              server-only; validates process.env at first use, fails loudly
│   └── rate-limit.ts                       In-memory fixed-window per-IP limiter (documented as per-instance)
│
├── data/                                   ⛔ Raw curated records. NEVER imported by components.
│   ├── jurisdictions.ts                    10 jurisdiction records + regulators + AI posture
│   ├── laws.ts                             Primary and secondary statutes per jurisdiction
│   ├── metrics.ts                          Comparator metric values (sentences, fines, reporting windows)
│   ├── drafts.ts                           Unnotified acts and bills under review
│   ├── ai-crimes.ts                        Technique taxonomy + statutory mappings + coverage
│   ├── sources.ts                          Primary source registry (URL, publisher, retrieved date)
│   └── README.md                           Sourcing rules, citation requirements, update procedure
│
├── types/
│   ├── index.ts                            Barrel export
│   ├── jurisdiction.ts                     Jurisdiction, Regulator, AiPosture, StrictnessBreakdown
│   ├── law.ts                              Law, LegalStatus, PenaltyStructure, ReportingWindow, PhaseSchedule
│   ├── draft.ts                            DraftLaw, LegislativeStage, CommencementBlocker, DeveloperImpact
│   ├── ai-crime.ts                         AiCrime, CrimeSeverity, StatuteMapping, CoverageLevel
│   ├── comparison.ts                       ComparisonMetric, ComparisonRow, ComparisonSection
│   ├── summary.ts                          LegalSummary, SummarySection, Confidence
│   ├── api.ts                              SummarizeRequest, SummarizeResponse, ApiError, ApiErrorCode
│   └── source.ts                           Source, SourceType, VerificationStatus
│
├── hooks/
│   ├── use-compare-selection.ts            Read/write ?a=&b=&c= with validation and a 2–3 clamp
│   ├── use-url-filters.ts                  Generic typed filter state ↔ searchParams sync
│   ├── use-summarize.ts                    Assistant fetch lifecycle: abort, timeout, typed errors
│   ├── use-media-query.ts                  SSR-safe media query (layout decisions default to CSS)
│   └── use-scroll-state.ts                 Scrolled/at-edge state for nav blur and scroll shadows
│
├── docs/
│   ├── prd.md                              Product requirements
│   ├── architecture.md                     This file
│   ├── rules.md                            Engineering rules and conventions
│   ├── phases.md                           Sequenced build plan
│   ├── design.md                           Design system
│   └── memory.md                           Running session log — updated after every work session
│
├── public/
│   ├── flags/                              Optional SVG flag glyphs (ISO-code fallback if absent)
│   └── og/                                 Static OG fallback assets
│
├── .env.example                            Committed template: GROQ_API_KEY=, GROQ_MODEL=, ...
├── .env.local                              ⛔ Never committed — real keys (.gitignore covers .env*)
├── AGENTS.md                               [scaffold] Next.js agent rules (managed block — do not delete)
├── CLAUDE.md                               [scaffold] Points at AGENTS.md
├── next.config.ts                          [scaffold] Next config
├── postcss.config.mjs                      [scaffold] @tailwindcss/postcss
├── eslint.config.mjs                       [scaffold] ESLint flat config + project rules
├── tsconfig.json                           [scaffold] strict: true, @/* path alias
└── package.json                            [scaffold] Deps and scripts
```

### 2.1 The three-layer data boundary

This is the most important structural rule in the project:

```
data/*.ts          ← raw curated records, plain objects, typed
    ↓ (imported ONLY by)
lib/data/*.ts      ← async repository functions; the swap boundary
    ↓ (imported ONLY by)
app/**/page.tsx    ← Server Components resolve data and pass it down as props
    ↓
components/**      ← pure presentation; receive data as props, never fetch
```

Repository functions are `async` **even though v1 data is synchronous**, so that swapping `data/` for a database, CMS, or HTTP API in v2 changes only `lib/data/` — zero component churn. An ESLint `no-restricted-imports` rule enforces that nothing outside `lib/data/` imports from `@/data/*`.

---

## 3. Tech Stack

### 3.1 Core (already installed)

| Technology | Version | Justification |
|-----------|---------|---------------|
| **Next.js** | 16.3.1 | App Router gives us Server Components for free — the entire law dataset is rendered server-side and never ships to the client, which matters because the dataset is the bulk of the payload. Route Handlers keep the Groq key server-side without a separate backend. Turbopack is the default bundler in 16, so builds are fast with no config. File-based routing maps cleanly onto our 5 modules. |
| **React** | 19.2.8 | Bundled with Next 16. Server Components, `useActionState`/`useTransition`, and the `use` hook are available if needed. No separate install decision. |
| **TypeScript** | ^5 (strict) | The domain is dense and interlinked — `LegalStatus`, `CoverageLevel`, `LegislativeStage` are exactly the kind of closed sets that discriminated unions catch bugs in. `strict: true` is already on. No `any` (see `docs/rules.md`). |
| **Tailwind CSS** | v4 | v4's CSS-first `@theme` config lets the entire design system live as CSS custom properties in `globals.css` — tokens are simultaneously Tailwind utilities *and* real CSS variables usable in arbitrary values and inline gradients. No `tailwind.config.ts` file, no JS config round-trip. Utility-first also keeps the glassmorphism system composable instead of a pile of one-off classes. |

### 3.2 To be added

| Package | Purpose | Justification | Added in |
|---------|---------|--------------|----------|
| **lucide-react** | Icon system | Tree-shakeable per-icon imports, consistent 24×24 / 1.5px stroke grid that suits the technical aesthetic, first-class React + TS support. Named in the brief. | Phase 0 ✅ |
| **shadcn** + **radix-ui** | Headless UI primitives | Dialog, select, tooltip, sheet, tabs, and scroll-area are the components where hand-rolling accessibility (focus trap, roving tabindex, ARIA wiring, dismiss semantics) is genuinely hard to get right. Radix ships that correctness; shadcn vendors the source into `components/ui/` so we own and re-skin it. Bound to CyberLex tokens in `globals.css`, so primitives inherit the design system rather than the default neutral theme. | Phase 0 ✅ |
| **class-variance-authority** | Variant API | shadcn dependency; types component variants (`size`, `tone`) without conditional-class soup. | Phase 0 ✅ |
| **tw-animate-css** | Animation utilities | shadcn dependency; Tailwind v4 replacement for `tailwindcss-animate`. | Phase 0 ✅ |
| **motion** | Component animation | Declarative enter/exit, stagger, and layout animation tied to React state — the strictness meter's segment fill, card stagger, and result transitions. Its `useReducedMotion` also gives us one consistent reduced-motion source across the app. | Phase 0 ✅ |
| **gsap** + **@gsap/react** | Scroll choreography | Timeline sequencing and scroll-linked effects that CSS transitions and `motion` cannot express cleanly — the dashboard entrance and comparator reveals. `useGSAP` handles React cleanup correctly. | Phase 0 ✅ |
| **groq-sdk** | Groq API client | Official SDK; handles auth, request shaping, typed responses, and surfaces HTTP status codes we need for error mapping (429 vs 5xx vs 400). Beats hand-rolled `fetch` mainly for the typed error surface. Server-only import. | Phase 7 |
| **zod** | Runtime validation | Three jobs: (1) validate `POST /api/summarize` request bodies, (2) validate the LLM's JSON output before it touches the UI — the single highest-value use, since LLM output is untrusted, (3) validate env vars at boot so a missing key fails loudly at startup rather than mysteriously at request time. Infers TS types, so schemas double as type definitions. | Phase 7 (env schema may land in Phase 0) |
| **clsx** | Conditional classes | 300 bytes. Conditional className composition without template-literal soup. | Phase 0 |
| **tailwind-merge** | Class conflict resolution | Lets `ui/` primitives accept a `className` override that actually wins over internal defaults, instead of losing to specificity ties. Paired with clsx in `lib/utils/cn.ts`. | Phase 0 |

**Total added dependencies: 5.** Every one is justified above; nothing else ships without amending this table (see `docs/rules.md` §1).

### 3.3 Deliberately NOT used

| Not using | Why |
|-----------|-----|
| **Redux / Zustand / Jotai** | There is no cross-tree mutable client state. Filters and comparator selection belong in the **URL** (shareable, bookmarkable, server-readable, back-button-correct). Everything else is local `useState`. A store would be pure ceremony. |
| **TanStack Query / SWR** | v1 has exactly one client-initiated request: the assistant. A single `fetch` with `AbortController` inside one hook is less code than the library's setup. Reconsider in v2 if a real API arrives. |
| **Axios** | `fetch` is native, works in Route Handlers, and the SDK handles the Groq call anyway. |
| **anime.js** | Declined. `motion` covers component animation and `gsap` covers timelines; a third general-purpose tween engine is redundant weight. |
| **MUI, Chakra, antd** | Opinionated themed kits that would fight the design system. shadcn is different in kind — it vendors unstyled source we re-skin, rather than shipping a theme. |
| **Chart libraries (Recharts, Chart.js, D3)** | The only "charts" are the strictness meter, the radial dial, and the reporting timeline — all bespoke, all cheaper as inline SVG + CSS than as a charting runtime. |
| **date-fns / dayjs / moment** | Dates are display-only and few. `Intl.DateTimeFormat` in `lib/utils/format.ts` covers it. |
| **A database / ORM** | v1 data is static and curated. The repository boundary in `lib/data/` is the abstraction that makes adding one later cheap. |
| **next-themes** | Dark-only by design. No theme switching. |

### 3.4 Next.js 16 conventions this project commits to

| Convention | Decision |
|-----------|----------|
| **Bundler** | Turbopack (the default in 16). No custom webpack config — adding one would break `next build`. |
| **Async request APIs** | `params` and `searchParams` are Promises and are always `await`ed. Synchronous access was removed in 16. |
| **Type helpers** | Use the generated global helpers — `PageProps<'/jurisdictions/[code]'>`, `LayoutProps<'/'>`, `RouteContext<'/api/summarize'>` — rather than hand-written prop types. Generated by `next dev` / `next build` / `next typegen`. |
| **Cache Components** | **Off in v1.** Our data is compile-time static; pages prerender without it. Revisit only when a real backend lands. Documented so nobody enables `cacheComponents: true` casually. |
| **Route Handler caching** | Route Handlers are uncached by default in 16. `/api/summarize` must stay dynamic — it is a `POST` and per-request by nature. Do **not** add `export const dynamic = 'force-static'`. |
| **Proxy vs middleware** | `middleware.ts` is superseded by `proxy.ts` in 16. v1 needs neither; if edge logic ever appears, it goes in `proxy.ts`. |
| **Tailwind config** | CSS-first. Design tokens live in `@theme` inside `app/globals.css`. No `tailwind.config.ts`. |
| **Fonts** | `next/font/google` in the root layout, exposed as CSS variables (`--font-sans`, `--font-mono`) and wired into `@theme`. Self-hosted at build time — zero external font requests, no layout shift. |

---

## 4. Data Flow

### 4.1 Flow A — Static law data → components (the 4 curated modules)

**Build time / request time (server only):**

1. **Source of record.** `data/*.ts` exports plain typed arrays — `jurisdictions`, `laws`, `metrics`, `drafts`, `aiCrimes`, `sources`. Each record is a literal object conforming to a type in `types/`, carrying `sources: SourceRef[]` and `lastVerified: string` (ISO date). No component ever imports these files.

2. **Repository layer.** `lib/data/*.ts` exposes async functions — `getJurisdictions(filters?)`, `getJurisdictionByCode(code)`, `getComparisonMatrix(codes)`, `getCoverageMatrix()`, `getDirectoryStats()`. These import the raw arrays, apply filtering/sorting/joining/derivation, and return **view-ready** shapes. Cross-entity joins happen *here* (a jurisdiction is joined to its laws and metrics once, not in three components). Score computation calls `lib/scoring/strictness.ts`. Returning `Promise<T>` today is what makes a DB swap a one-file change tomorrow.

3. **Server Component resolution.** The page (`app/page.tsx`, `app/compare/page.tsx`, …) is an async Server Component. It `await`s `searchParams`, calls the repository, and gets fully-resolved data. This code runs on the server only.

4. **Props down.** The page passes resolved data into presentational components as props. `JurisdictionGrid` receives `jurisdictions: JurisdictionSummary[]`; it does not know where they came from. Presentational components are Server Components by default and ship **zero JavaScript**.

5. **Client islands.** Only genuinely interactive leaves are `'use client'` — filter controls, the comparator selector, the divergence toggle, the fine normalizer, the nav components. They receive already-resolved data as props and manipulate **URL state**, not data.

6. **Interaction loop.** Changing a filter calls `router.replace('?region=eu&status=enacted', { scroll: false })`. Next re-renders the server component tree with the new `searchParams`; the repository re-filters; fresh props flow down. **No client-side data fetching, no loading spinner, no duplicated filter logic on the client.** The URL is the state container.

```
data/*.ts ──► lib/data/*.ts ──► app/**/page.tsx ──► components/** (props)
 (records)     (async repo,      (Server Comp.,      (presentation,
               joins, scoring)    awaits params)      zero JS)
                    ▲                                      │
                    │                                      │ user changes filter
                    └────── router.replace(?query) ◄───────┘  (client island)
```

**Swap point:** replace the bodies of `lib/data/*.ts` with `fetch`/DB calls. Signatures unchanged. Components untouched.

### 4.2 Flow B — Search query → API route → Groq → structured response → UI

**1. Client (`components/assistant/assistant-console.tsx`, `hooks/use-summarize.ts`)**
User submits a query. Client-side guardrails run first: trim, length check (8–500 chars), reject empty. An `AbortController` is created with a client-side timeout slightly longer than the server's. `POST /api/summarize` with `{ query, jurisdictionCodes?: string[] }`. UI enters `loading`.

**2. Route Handler — pre-flight (`app/api/summarize/route.ts`)**
Runs in order, cheapest rejection first:
- **Rate limit.** `lib/rate-limit.ts` fixed-window per-IP check → `429` + `Retry-After` if exceeded.
- **Body size cap.** Oversized payloads rejected before parsing.
- **Schema validation.** `SummarizeRequestSchema.safeParse()` → `400` with a typed `ApiErrorCode` on failure.
- **Provider configured.** `lib/env.ts` confirms `GROQ_API_KEY` exists → `503 AI_UNAVAILABLE` if not. The key value itself never appears in a response, a log, or an error.

**3. Grounding (`lib/ai/prompt.ts`)**
The handler calls the **same repository layer** (`lib/data/`) to pull the jurisdiction, law, and metric records relevant to the query (by explicit `jurisdictionCodes`, else by keyword match against tracked entities). These are serialized into a compact grounding block and injected into the prompt. The system prompt instructs the model to: answer only from supplied context plus well-established public legal knowledge, emit the three fixed sections, cite tracked record IDs it used, self-report `confidence`, and set `outOfScope: true` rather than speculate.

**4. Upstream call (`lib/ai/client.ts` + `lib/ai/summarize.ts`)**
Server-only Groq SDK singleton. `chat.completions.create` with: model from `GROQ_MODEL` (env-configurable, documented default), `response_format: { type: 'json_object' }`, low temperature for determinism, a bounded `max_tokens`, and an `AbortSignal` enforcing a hard server timeout. One retry with backoff on `429`/`5xx`, honoring `Retry-After`; never retried on `4xx` client errors. All rules in `docs/rules.md` §4.

**5. Parse & validate (`lib/ai/schema.ts`)**
Raw completion text → `JSON.parse` inside try/catch (malformed JSON is a *normal* failure mode, not an exception path) → `LegalSummarySchema.safeParse()`. A response that parses but doesn't match the schema is treated as a failure, **never** partially rendered. On the first validation failure, one repair attempt with a corrective instruction; on second failure, return `502 MALFORMED_RESPONSE`.

**6. Response**
Success → `200` with `{ ok: true, data: LegalSummary }`. Failure → non-2xx with `{ ok: false, code: ApiErrorCode, message: string }` where `message` is **user-facing copy**, never an upstream error body, stack trace, or key fragment. Upstream detail is logged server-side only.

**7. Render (`components/assistant/summary-result.tsx`)**
The validated object renders as three sections — Overview / Sanctions / Compliance Takeaways. `confidence` drives `ConfidenceIndicator`; `outOfScope` swaps in an honest "outside what this tool covers" state. Cited record IDs resolve to in-app links via the repository. `AiGeneratedMarker` and a non-dismissible `Disclaimer` are structurally part of the result — they cannot be rendered without them. On failure, `AssistantError` maps `ApiErrorCode` → specific, actionable copy (see `docs/rules.md` §4.3).

```
[client] query ──POST──► /api/summarize
                              │
                              ├─ rate limit ──► 429 + Retry-After
                              ├─ size cap ────► 413
                              ├─ zod(request) ► 400 INVALID_QUERY
                              ├─ env check ───► 503 AI_UNAVAILABLE
                              │
                              ├─► lib/data/* ──► grounding context
                              │
                              ├─► Groq SDK (json_object, timeout, 1 retry)
                              │        └─ 429/5xx/timeout ─► typed error
                              │
                              ├─► JSON.parse ──► catch ─┐
                              ├─► zod(response) ────────┤─► 1 repair retry ─► 502 MALFORMED
                              │                          
                              └─► 200 { ok: true, data: LegalSummary }
                                        │
[client] ◄────────────────────────────  ┘
   └─► SummaryResult (3 sections) + ConfidenceIndicator
       + GroundedSources (→ in-app links) + AiGeneratedMarker + Disclaimer
```

**Security invariant:** `GROQ_API_KEY` is read only inside `lib/env.ts`, which is imported only by `lib/ai/client.ts`, which is imported only by `app/api/summarize/route.ts`. It has no `NEXT_PUBLIC_` prefix, so Next cannot inline it into client bundles. `lib/env.ts` and `lib/ai/client.ts` carry the `server-only` guard so an accidental client import fails at **build time**, not in production. Phase 8 includes a build-output grep as a belt-and-braces check.

---

## 5. Rendering & Performance Strategy

| Surface | Strategy | Rationale |
|---------|----------|-----------|
| `/`, `/tracker`, `/ai-crimes`, `/methodology` | Static prerender | Data is compile-time constant. Fastest possible TTFB. |
| `/jurisdictions/[code]`, `/ai-crimes/[slug]` | Static via `generateStaticParams` | Known, small, finite set. All variants prebuilt. |
| `/compare` | Server-rendered per `searchParams` | Selection is a query string; the server does the filtering and the comparison logic never ships to the client. |
| `/assistant` | Static shell + client island | The page frame prerenders; only the console is interactive. |
| `/api/summarize` | Dynamic, uncached | `POST`, per-request, upstream-dependent. Never cached. |

**Client JS budget:** interactive leaves only. Cards, grids, badges, meters, tables, and matrices stay Server Components. Target: no route ships more than ~40KB of first-party client JS.

---

## 6. Environment Variables

| Variable | Required | Scope | Purpose |
|----------|----------|-------|---------|
| `GROQ_API_KEY` | Yes (for M5) | Server only | Groq authentication. Never `NEXT_PUBLIC_`. Never logged. |
| `GROQ_MODEL` | No | Server only | Model ID override. Documented default in `lib/ai/config.ts`; **confirm against Groq's live model list in Phase 7.** |
| `AI_REQUEST_TIMEOUT_MS` | No | Server only | Hard upstream timeout. Default 20000. |
| `RATE_LIMIT_MAX` | No | Server only | Requests per window per IP. Default 10. |
| `RATE_LIMIT_WINDOW_MS` | No | Server only | Window length. Default 60000. |
| `NEXT_PUBLIC_SITE_URL` | No | Public | Canonical URL for metadata, OG images, sitemap. Contains no secrets. |

`.env.example` is committed with keys and empty values. `.env.local` holds real values and is covered by the existing `.env*` rule in `.gitignore`.

---

## 7. Error Boundaries & Failure Isolation

| Boundary | Catches | Behaviour |
|----------|---------|-----------|
| `app/global-error.tsx` | Root layout failures | Full-page fallback with its own `<html>`/`<body>`. Last resort. |
| `app/error.tsx` | Any unhandled page error | Branded error state + reset action. Nav remains usable. |
| `app/compare/error.tsx` | Bad codes, comparison-logic failures | Falls back to the selector — the module stays usable. |
| `app/assistant/error.tsx` | Console render failures | Assistant fails alone; the rest of the app is untouched. |
| `app/**/not-found.tsx` | Unknown jurisdiction code / technique slug | Designed 404 suggesting valid alternatives. |
| `useSummarize` typed errors | All API failure modes | Never throws to a boundary — resolves to a typed error state rendered inline by `AssistantError`. |

**Isolation principle:** an AI provider outage degrades exactly one route. Modules 1–4 have zero runtime dependency on any external service.
