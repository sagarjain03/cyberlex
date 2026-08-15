# CyberLex Global — Working Memory

> **Purpose:** Running state of the build. Updated at the end of **every** work session — this is the first file to read when picking the project back up.
>
> **How to update:**
> 1. Move finished items from *In Progress* → *Completed* (with the date).
> 2. Set *In Progress* to the exact file(s) currently open, and what specifically is unfinished about them.
> 3. Refresh *Next Up* so the next session starts without re-deriving context.
> 4. Append to *Decisions Log* — decisions only, with the reason. Not a changelog.
> 5. Log anything discovered that contradicts the docs under *Open Questions* or *Known Issues*.
>
> Keep entries terse and factual. Newest first within each section.

---

## Current Status

**Phase:** 0–7 complete → Phase 8 next (polish, a11y, performance, deploy)

**⚠️ Blocked on environment, not code:** Groq returns `403 "Access denied. Please check your network settings."` from this machine — for `chat.completions` *and* `models.list`. That is a **network-origin block** (VPN / datacenter exit IP), not a bad key or model access. The integration is verified as far as the network allows; **one live end-to-end success still needs to be observed with the VPN off.**
**Last session:** 2026-08-15
**Build health:** `tsc --noEmit` ✅ · `eslint` ✅ · `next build` ✅ (static) · 0 console errors · no overflow at 375px · map absent from client bundle ✅ · data-boundary ESLint rule verified firing ✅
**Blockers:** none

**⚠️ Standing gate:** all 65 data records are `verification: "needs-review"`. Authored from secondary knowledge, not checked against primary sources by a human. **Not citable, and the product must not be presented as authoritative until this reads 0.** The count is surfaced in the dashboard masthead on purpose. See `data/README.md`.

---

## Completed

| Date | Item | Notes |
|------|------|-------|
| 2026-08-16 | **Phase 7 — AI Summarizer + Groq** | `lib/env.ts`, `lib/rate-limit.ts`, `lib/ai/{config,client,errors,schema,prompt,summarize}.ts`, `app/api/summarize/route.ts`, `app/api/health/route.ts`, `hooks/use-summarize.ts`, `AssistantConsole` + `SummaryResult`. Installed `groq-sdk`, `zod`, `server-only`. **Security gate passed** (see below). |
| 2026-08-15 | **Phase 6 — AI Crimes** | `app/ai-crimes/page.tsx` + `[slug]/` (page + not-found, 6 SSG paths); `CoverageMatrixTable` (Server Component, zero client JS), `CrimeList`, `StatuteMapping`, `TechnicalProfile`. 60 cells: 30 direct · 20 analogical · 5 no-coverage · 5 not-researched. |
| 2026-08-15 | **Phase 5 — Tracker** | `app/tracker/page.tsx`; `StagePipeline`, `DraftEntry`, `CommencementStatus`, `PhaseSchedule` (extracted + shared), `TrackerFilters`; `parseDraftFilters`. 12 instruments across 5 populated stages; 6 passed-but-inert. 7 filter permutations verified; no overflow at 375px. |
| 2026-08-15 | **Phase 4 — Comparator** | `app/compare/` (page + error); `ComparatorSelector`, `ComparisonGrid`, `ReportingTimeline`, `RevenueControl`; `hooks/use-compare-selection.ts`; `parseCompareCodes` + `parseRevenue`. 7 URL edge cases verified (dedupe, invalid codes, under-selection, bad revenue). Mobile sticky gutter working; page body does not overflow at 375px. |
| 2026-08-15 | **Phase 3 — Dashboard module & jurisdiction detail** | `app/jurisdictions/[code]/` (page + loading + not-found, `generateStaticParams` × 10, `generateMetadata`); `DirectoryFilters` (client, URL state); `lib/url-state.ts`; `app/loading.tsx`; `Skeleton`; `sitemap.ts` + `robots.ts`. Map mirrors the filtered index. All 8 filter/sort permutations verified server-side. |
| 2026-08-15 | **Phase 2 — layout shell & navigation** | `TopNav` + `MobileHeader` + `BottomNav` + `Wordmark` + `PageShell` + `PhaseStub`; shared `StatusBadge`, `LastVerified`, `SourceList`, `ScoreBreakdown`, `CoverageCell`, `SeverityBadge`; `EmptyState`/`ErrorState`/`ActionLink`/`Disclaimer`; `error.tsx`, `global-error.tsx`, `not-found.tsx`; 4 route stubs + **`/methodology` built for real**. All 6 routes verified 200 with correct active state and titles. |
| 2026-08-15 | **Phase 1 — types & data layer** | `types/` (9 files), `data/` (6 files + README), `lib/data/` (7 files), `lib/scoring/` (3 files), `lib/format.ts`. 10 jurisdictions · 27 laws · 13 tracker entries · 6 AI-crime techniques · 60 coverage cells. Dashboard now renders entirely from the repository. |
| 2026-08-15 | **Design system v2 "Obsidian"** — full visual rebuild | True black + bone + Instrument Serif; console layout; server-rendered vector world map (`lib/map/world.ts`, `components/map/world-map.tsx`); `ScoreRule` replaces `StrictnessMeter`; deleted `background-fx`, `strictness-meter`, `hud-corners`. Added `d3-geo`, `topojson-client`, `world-atlas`. |
| 2026-08-14 | **Phase 0 — scaffolding, config & design tokens** | See breakdown below (palette/type superseded by v2) |
| 2026-08-14 | Planning docs — `prd.md`, `architecture.md`, `rules.md`, `phases.md`, `design.md`, `memory.md` | Documentation only |

**Phase 0 breakdown**
- shadcn/ui initialized (`radix-nova` style, radix base) + 12 primitives vendored into `components/ui/`
- Installed: `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `shadcn`, `radix-ui`, `motion`, `gsap`, `@gsap/react`, `lenis`
- `app/globals.css` — full CyberLex `@theme` token set (base/ink/7 signal families/elevation/motion/keyframes), shadcn semantic vars rebound to CyberLex palette, 14 typography utilities, 4 glass tiers + `@supports` fallback, motif utilities (`glass-edge`, `scanline`, `grid-mesh`, `grain`, `sourced`, `shimmer`, `lift`, `measure`), reduced-motion block
- `app/layout.tsx` — Plus Jakarta Sans + JetBrains Mono via `next/font`, full metadata + viewport, skip-link, `SmoothScroll` + `TooltipProvider` + `BackgroundFx`
- `lib/constants/{site,nav,thresholds}.ts`; `lib/utils.ts` (shadcn's `cn`)
- `components/layout/background-fx.tsx`, `components/providers/smooth-scroll.tsx`, `components/ui/hud-corners.tsx`, `components/shared/strictness-meter.tsx`
- `.env.example` committed; ESLint rules added (`no-explicit-any`, `@/data/*` import boundary, `components/ui/**` ignored as vendored)
- `app/page.tsx` — Phase 0 token showcase (replaced by the real Dashboard in Phase 3)

---

## In Progress — file currently being worked on

*(nothing in progress)*

<!--
Format:
**File:** `path/to/file.tsx`
**Phase:** N
**Doing:** one line on what is being built
**Remaining:** what is not yet done in this file
**Watch out for:** anything the next session would otherwise trip over
-->

---

## Next Up

**Phase 8 — Polish, accessibility, performance, deploy** (`docs/phases.md` §Phase 8).

**Carry-over from Phase 7, do first:**
- One live end-to-end assistant success with the VPN off — the only unverified link in the chain
- Failure modes 2, 4, 13 (upstream 429 / 5xx / transport) against a stub server

**Phase 8 proper:**
- Full a11y audit (`docs/rules.md` §5): keyboard traversal, screen-reader pass on `/`, `/compare`, `/assistant`, contrast on real composited backgrounds, reduced-motion
- Responsiveness sweep at 320/375/768/1024/1440 — **measure `documentElement.scrollWidth` on every route**, do not eyeball it
- `app/icon.tsx`, `app/opengraph-image.tsx`
- Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95
- Re-run the client-bundle key grep as the launch gate (passed once already, 2026-08-16)
- Rewrite `README.md`; deploy with production env vars
- ⚠️ **The 65-record verification gate is still open and still blocks launch** — see Current Status

<details><summary>Phase 7 verification log (what was actually exercised)</summary>

| # | Failure mode | Result |
|---|---|---|
| 1 | Rate limited (ours) | ✅ 429 + `Retry-After` counting down correctly at the cap |
| 3 | Timeout | ✅ 504 `TIMEOUT` via `AI_REQUEST_TIMEOUT_MS=1` |
| 5/6 | Upstream 4xx / auth | ✅ 403 classified → `AI_UNAVAILABLE`, detail server-side only |
| 7 | Malformed JSON | ✅ fixture → "it was not valid JSON" |
| 8 | Schema mismatch | ✅ fixture → shape error; also caught 3× duplicate `Overview`, which `.length(3)` alone would pass |
| 9 | Empty response | ✅ fixture → "every section was empty" → `EMPTY_RESPONSE` |
| 12 | Provider not configured | ✅ `aiConfigured:false`, 503 before any network call, designed UI state, modules 1–4 all 200 |
| — | Invalid query (short/long/non-JSON) | ✅ 400 `INVALID_QUERY` |
| — | Payload too large | ✅ 413 |
| — | Wrong method | ✅ 405 + `Allow: POST` |
| — | Fenced JSON (` ```json `) | ✅ stripped, payload still schema-validated |
| 2, 4, 13 | Upstream 429 / 5xx / transport | ⏳ implemented, not yet triggered live |
| 10, 11 | Out-of-scope / low confidence | ⏳ needs a live call |
| 14 | Client abort | ⏳ needs a browser session |

**Security gate (2026-08-16):** `GROQ_API_KEY` literal — 0 hits in client chunks. `gsk_` pattern — 0. Live key value — 0 in `.next/static`. `groq-sdk` — 0 in client chunks.
</details>

⚠️ **Read `docs/rules.md` §4 in full before writing a line of it.**

- Install `groq-sdk`, `zod`, `server-only`
- `lib/env.ts` (zod-validated, `server-only`, the *only* `process.env` read), `lib/rate-limit.ts`, `lib/ai/{config,client,prompt,schema,summarize,errors}.ts`
- `app/api/summarize/route.ts` — rate limit → size cap → zod(request) → env check → ground from `lib/data` → Groq → `JSON.parse` → zod(response) → respond
- `app/assistant/page.tsx` replaces the stub; `assistant-console` (client) + `use-summarize` hook
- **Build the failure states before the happy path** — all 14 in §4.3 must be individually triggered and verified (bad key, unset key, wrong model id, tiny timeout, forced malformed output, rate limit, oversized body, short/long query, abort)
- Retry exactly once on 429/5xx/network/first-malformed; **never** on timeout, non-429 4xx, or a second malformed response
- ⚠️ Confirm the `GROQ_MODEL` default against Groq's live model list (open question #2) — a stale id means every request fails
- With `GROQ_API_KEY` unset, Modules 1–4 must stay fully functional and `/assistant` must render its designed unavailable state
- `.env.local` exists in the workspace; do not read it — it holds secrets

**Note:** `components/ui/` still holds ~12 vendored shadcn primitives at default styling (button, dialog, select, sheet, tabs…). Nothing uses them yet — everything built so far is hand-made. Re-skin before first use or they will look like default shadcn (`docs/rules.md` §1.4).

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-08-14 | URL search params are the state layer; no client state library | Filters and comparator selection must be shareable, bookmarkable, and server-readable. A store would duplicate logic the server already does. |
| 2026-08-14 | 6 added dependencies total: `lucide-react`, `clsx`, `tailwind-merge`, `zod`, `groq-sdk`, `server-only` | Everything else is achievable with the platform, Next.js, or ~40 lines of our own code (`docs/rules.md` §1.2). |
| 2026-08-14 | Three-layer data boundary: `data/` → `lib/data/` → pages → components | Repository functions are `async` from day one so a real backend swap in v2 touches only `lib/data/`. |
| 2026-08-14 | Nav breakpoint is `lg` (1024px), not `md` | The comparator and coverage matrix need real width before desktop chrome earns its space. |
| 2026-08-14 | Cache Components (`cacheComponents: true`) stays **off** in v1 | Data is compile-time static; pages prerender without it. Revisit only when a real backend lands. |
| 2026-08-14 | Dark-only; no light theme | Per `docs/prd.md` §6. The design system depends on lit accents against a near-black ground. |
| 2026-08-14 | Status hues and strictness-ramp hues are kept in separate component vocabularies | Cyan means both "in force" and "moderate strictness"; keeping badges and meters visually disjoint removes the ambiguity (`docs/design.md` §1.4). |
| 2026-08-14 | AI response is a single validated object, not a token stream, in v1 | Schema validation before render is the hallucination guard; streaming would mean rendering unvalidated partial output. Streaming is a v2 candidate. |
| 2026-08-16 | **`GROQ_MODEL` default is `openai/gpt-oss-120b`** (open question #2, resolved) | `llama-3.3-70b-versatile` — the default this project had documented since Phase 0 — was deprecated on 17 June 2026 for free/developer tiers. Shipping it would have made every request fail. Verified against Groq's live catalogue rather than assumed. |
| 2026-08-16 | `response_format: json_object`, **never** `json_schema` | `json_schema` enforcement is reported to be silently ignored on gpt-oss models, returning free-form prose. The zod-validate + one-repair design already assumed the provider might not keep its promise; this confirmed it. |
| 2026-08-16 | The model's `groundedOn.jurisdictions` is filtered against real codes, not cast | Caught by the compiler. The model can name any string; casting would have rendered an in-app link built from a hallucination. |
| 2026-08-16 | Groq 401/403 → `AI_UNAVAILABLE`, with the upstream message kept **server-side only** | 403 is not always credentials — Groq returns it for blocked network origins with a valid key. Operators need to tell those apart; users must be told neither. |
| 2026-08-16 | **Stale Turbopack FS cache made every route handler 404** despite compiling | Cost real debugging time. `rm -rf .next` fixed it. Filesystem caching is on by default in Next 16 — suspect it first when routes exist, compile, and still 404. The same cache also leaves stale `.next/dev/types/validator.ts` that fails `tsc` with `TS1434`. |
| 2026-08-16 | **⚠️ A horizontal scroller must be `position: relative`** — added to both `coverage-matrix.tsx` and `comparison-grid.tsx` | `sr-only` is `position: absolute`. Without a positioned scroller its containing block resolves to the *outer* wrapper, so it escapes the horizontal clip entirely — the AI-crimes matrix dragged the page to 798px at 375px. The comparator had the same latent bug (its `<caption class="sr-only">` only escaped notice by sitting at the left edge). **Any future `overflow-x-auto` region needs `relative` and a measured overflow check** — this is invisible without measuring `documentElement.scrollWidth`. |
| 2026-08-15 | Column headers use `aria-label`, not an `sr-only` span | Same accessibility outcome without adding a positioned element inside a scrolling region. |
| 2026-08-15 | Zero tallies are never coloured (`Tally`, ai-crimes detail) | "Direct **0**" in green reads as reassurance when zero direct coverage is precisely the finding. |
| 2026-08-15 | `PhaseSchedule` extracted to `components/tracker/` and shared with the jurisdiction detail page | Two implementations of "what is in force" could disagree, which is the one thing this product cannot get wrong. |
| 2026-08-15 | `CommencementStatus` states elapsed dormancy in words, not a badge | "Law since 15 Mar 2022 — 4.4 years without binding effect" is the product's entire thesis in one line. A status pill would flatten it, and most tooling renders exactly this state as "in force". |
| 2026-08-15 | The pipeline counts ignore `?stage=`, only the register narrows | Selecting a stage should not blank out the other five counts — the sequence is the information. |
| 2026-08-15 | Pipeline gap-marker moved off the numeral onto the label | Beside a figure the amber square read as a decimal point ("3 ▪" → "3."). |
| 2026-08-15 | **Sticky table gutter needs three things, all non-obvious** (`comparison-grid.tsx`) | (1) `border-separate`, not `border-collapse` — collapsed borders make a sticky `<th>` paint unreliably; borders moved onto cells. (2) `min-w-44`, not `w-44` — under auto table layout a plain width is a suggestion and the browser collapsed the gutter to 112px, wrapping every label to six lines. (3) **no horizontal padding on the scroll container** — `sticky left-0` anchors to the *padding* edge, so `px-5` left a 20px strip where scrolled content stayed visible beside the pinned column. The inset lives on the cells instead. |
| 2026-08-15 | "Strictest" marker suppressed when every value ties | Marking all three cells "Strictest" (Data theft, 3 years each) says nothing, and picking one arbitrarily would be worse. Now requires >1 distinct known value. |
| 2026-08-15 | Hypothetical revenue is URL state (`?rev=`); divergence toggle is local state | The revenue assumption changes every figure in the financial section, so a shared link must carry it — and the server recomputes, keeping normalisation logic solely in `lib/scoring/normalize.ts`. The divergence toggle is a view preference nobody would share. |
| 2026-08-15 | Row hints hidden below `lg` | They were the largest contributor to row height and are unreadable in an 11rem gutter. |
| 2026-08-15 | **`/` is now dynamic (ƒ), not static** | Awaiting `searchParams` for server-side filtering makes the route render per request. Accepted deliberately: filters must be shareable and the server must do the filtering (`docs/rules.md` §2.4), and with an in-memory dataset TTFB is unaffected. The 10 detail pages remain SSG. |
| 2026-08-15 | The map mirrors the filtered index — markers *and* lit landmass both narrow | Two halves of the console showing different sets would be a correctness bug, not a stylistic choice. Zero results correctly renders an unlit map. |
| 2026-08-15 | Filters are text buttons in a collapsible rail panel, not dropdowns | The design system has no boxed select, and at this option count a visible set beats a hidden one. Each option toggles itself off when re-clicked. |
| 2026-08-15 | `formatHours` keeps hours up to a week (`24h`, `72h`), days only beyond | It was rendering EU's window as "1d". Instruments state deadlines in hours — "72 hours", never "3 days" — so the unit has to match the legal text. |
| 2026-08-15 | **`cn()` extended with our custom `text-*` utilities** (`lib/utils.ts`) | tailwind-merge classified `text-code`/`text-data`/`text-micro` as *colours*, so `cn("text-code", "text-ink-700")` silently dropped the size and elements rendered at body size. Caught visually on the dashboard disclaimer. Registering them under `font-size` restores independent size/colour groups. **Any new `@utility text-*` must be added to that list.** |
| 2026-08-15 | Verification status lives in the root layout, not per page | While records are unverified the product must say so on every route. Layout is a Server Component, so it fetches the count and passes it to the client nav. |
| 2026-08-15 | Route stubs describe what the module will contain and name their phase | A stub that describes the real thing keeps navigation testable and the build plan visible, instead of a dead "coming soon". |
| 2026-08-15 | Added `veil-strong` (96% opaque) for the bottom nav | Blur separates far less on true black than on colour — content scrolling under the 82% `veil` stayed legible through it. |
| 2026-08-15 | **All Phase 1 records marked `needs-review`, not `verified`** | They were authored from secondary knowledge, not by reading each instrument. Claiming verification we haven't done would be the exact failure the product exists to prevent. The count is surfaced in the UI. |
| 2026-08-15 | Used `NOT_RESEARCHED` liberally rather than estimating — Japan and Brazil reporting windows, UAE metrics, several coverage cells | A visible gap is honest; a plausible invented penalty figure is unrecoverable. 5 of 60 coverage cells are `not-researched` and 5 are genuine `no-coverage` — deliberately distinct states. |
| 2026-08-15 | `Known<T>` three-state wrapper instead of `T \| null` | `no-provision` and `not-researched` are different legal claims. A nullable type would collapse them, which is the misleading outcome the PRD calls out. Authoring stays terse via `known()` / `NO_PROVISION` / `NOT_RESEARCHED` helpers. |
| 2026-08-15 | Comparison logic lives in `lib/data/comparisons.ts`, not components | Phase 7's grounding step reuses it verbatim; duplicating it in the comparator UI would guarantee drift. |
| 2026-08-15 | Kept all 10 jurisdictions (PRD open question #4, resolved) | The archetype coverage argument held — Brazil and UAE contribute the latin-america and middle-east regimes, and UAE's `NOT_RESEARCHED`-heavy record is a useful honest example of a partially-researched entry. |
| 2026-08-15 | `lib/map/iso.ts` split out of `lib/map/world.ts` | `data/jurisdictions.ts` needs the EU member ids; importing `world.ts` would drag d3-geo and the topojson into the data layer. |
| 2026-08-15 | **Design system rebuilt as v2 "Obsidian".** v1 "Deep Stack" rejected in review as generic dark-mode SaaS | Owner: "worst UI I have ever seen — black not blue, premium fonts, unique layout, no boxes, no cheap background animation." v1's blue-slate + card grid + scanline/grid-mesh was exactly the template look. `docs/design.md` v2.0 supersedes v1.0 in full. |
| 2026-08-15 | True black `#000000` ground; warm-neutral ink; **bone (off-white) is the brand/interactive colour** | Blue-grey is the tell of a template theme. Making brand = bone frees every hue for legal-status semantics, so no colour ever means two things — which also retires v1's awkward "status hues vs score-ramp hues" separation rule. |
| 2026-08-15 | Fonts: **Instrument Serif** (display) + **Geist** (UI) + **Geist Mono** (all labels and data) | Editorial serif at display size against mono micro-caps *is* the identity; it needs no ornament. Replaces Plus Jakarta Sans + JetBrains Mono. |
| 2026-08-15 | Layout is a **full-viewport console** — rail + map + readout strip. No cards anywhere; radii 2–4px | Card grids were the specific complaint. Depth now comes from hairlines, negative space, and one top light. |
| 2026-08-15 | The **map is real vector geography**, resolved server-side | `world-atlas` topojson + `d3-geo` `geoNaturalEarth1`, projected at module scope. Only path strings reach the browser — verified zero `d3-geo`/`world-atlas` refs in client chunks, so the map costs 0 KB client JS. |
| 2026-08-15 | Cut every decorative motif: scanline sweep, grid mesh, HUD corners, card lift, shimmer, stagger, corner blooms | "Cheap animation in the background." Motion now needs an informational job — only the live dot, map marker rings, and the `row-mark` hover survive. |
| 2026-08-15 | Antarctica removed from the map; EU renders as its 27 member geometries | Antarctica carries no tracked jurisdiction and reads as a bright slab fighting the data. EU is a bloc, not a country. |
| 2026-08-14 | **Reversed the no-libraries rule.** shadcn/radix, motion, gsap and lenis are approved | Owner decision: the UI must feel premium, not merely correct. Constraints kept — shadcn is re-skinned to CyberLex tokens (never default), one tween engine per job, animation never gates content, reduced-motion still wins. `docs/rules.md` §1.4. |
| 2026-08-14 | Declined `anime.js`; aceternity effects hand-built from our own motifs | `motion` covers component animation, `gsap` covers timelines — a third tween engine is redundant weight. Aceternity is copy-paste snippets, not a dependency, and ours must use our tokens. |
| 2026-08-14 | shadcn's `lib/utils.ts` is the canonical `cn`; other helpers go at `lib/` root, not `lib/utils/` | `lib/utils.ts` and a `lib/utils/` directory would make `@/lib/utils` ambiguous. Deviates from `architecture.md` §2 as originally written. |
| 2026-08-14 | HUD corner brackets are a component, not a CSS utility | `glass-edge` uses `::before` and `scanline` uses `::after` — three pseudo-element motifs cannot share two slots. Caught visually in Phase 0. |
| 2026-08-14 | Staleness threshold = **120 days** (PRD open question #3, resolved) | Cyber law moves faster than 180 days tolerates; 90 would flag records that are still genuinely current. |

---

## Known Issues / Limitations

| Item | Impact | Status |
|------|--------|--------|
| **Groq blocked at network level from this machine** (`403 Access denied — check your network settings`, on both completions and `models.list`) | The assistant cannot complete a live call while a VPN/blocked exit IP is in use. Every other module is unaffected by design. | **Open** — retry with VPN off; the code path is verified up to the network boundary |
| **Failure modes 2, 4, 13 not yet triggered live** (upstream 429, upstream 5xx, transport failure) | Their classification and retry logic is implemented and reviewed but has not been exercised against a real upstream | Open — verify opportunistically, or with a stub server |
| Turbopack's on-disk cache (`.next/cache/turbopack/*.sst`) contains the API key in plaintext | Not client-served and `.next/` is gitignored, so not a leak today. It would travel with a copied `.next/` or a shared CI build cache. | Accepted; do not share build caches |
| Rate limiting is in-memory and therefore per-instance | On a multi-instance deploy the effective limit is `RATE_LIMIT_MAX × instances`. It is an abuse brake, not a security control. | Accepted for v1 (`docs/rules.md` §4.2) |
| `GROQ_MODEL` default is unverified against Groq's live catalogue | Wrong model ID = every AI request fails | Must be confirmed in Phase 7 (PRD open question #2) |

---

## Open Questions

| # | Question | Needed by | Status |
|---|----------|-----------|--------|
| 1 | Is `/methodology` a nav item or contextual-only? | Phase 2 | Open — currently planned as contextual + footer |
| 2 | ~~Confirm the production Groq model ID~~ | Phase 7 | ✅ Resolved — `openai/gpt-oss-120b`; the previous default was deprecated 17 Jun 2026 |
| 3 | ~~Staleness threshold for `lastVerified`~~ | Phase 1 | ✅ Resolved — 120 days (`lib/constants/thresholds.ts`) |
| 4 | ~~Ship 10 jurisdictions, or trim to 8?~~ | Phase 1 | ✅ Resolved — kept 10 |
| 5 | **Who performs primary-source verification of the 65 records, and when?** This is a launch gate and needs a human with legal training, not more engineering. | Before launch | **Open — highest-priority open item** |

---

## Notes

- **This is Next.js 16.** Async request APIs, Turbopack by default, `proxy.ts` instead of `middleware.ts`, no `tailwind.config.ts`. Read `node_modules/next/dist/docs/` before writing unfamiliar code — training-data conventions from Next 13–15 are frequently wrong here.
- The managed block in `AGENTS.md` is rewritten by `next dev`. Do not delete it; commit it with your work.
- Data integrity outranks feature velocity: an unsourced figure is marked `not-researched`, never guessed (`docs/rules.md` §3.3).
