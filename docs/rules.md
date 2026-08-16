# CyberLex Global — Engineering Rules

**Version:** 1.0
**Last updated:** 2026-08-14
**Status:** Binding. These rules override habit, convention, and training-data defaults.

> This project runs **Next.js 16.3.1** with **Tailwind v4**. Before writing code in an unfamiliar area, read the relevant guide in `node_modules/next/dist/docs/`. Conventions from Next 13–15 material are frequently wrong here.

---

## 1. Approved Libraries

### 1.1 The allowlist

These, and only these, may appear in `package.json` dependencies for v1:

| Package | Status | Allowed use |
|---------|--------|-------------|
| `next` | Installed (16.3.1) | Framework |
| `react`, `react-dom` | Installed (19.2.8) | Bundled with Next |
| `typescript`, `@types/*` | Installed | Dev only |
| `tailwindcss`, `@tailwindcss/postcss` | Installed (v4) | Styling |
| `eslint`, `eslint-config-next` | Installed | Dev only |
| `lucide-react` | Installed (Phase 0) | Icons — **the only** icon source |
| `clsx` | Installed (Phase 0) | Conditional classes |
| `tailwind-merge` | Installed (Phase 0) | Class conflict resolution |
| `shadcn` + `radix-ui` | Installed (Phase 0) | Accessible headless primitives (dialog, select, tooltip, sheet, tabs, scroll-area). Re-skinned with CyberLex tokens — see §1.4. |
| `class-variance-authority` | Installed (Phase 0) | Variant API for primitives (shadcn dependency) |
| `tw-animate-css` | Installed (Phase 0) | Tailwind v4 animation utilities (shadcn dependency) |
| `motion` | Installed (Phase 0) | Component-level micro-interactions: meter fills, stagger, layout transitions |
| `gsap` + `@gsap/react` | Installed (Phase 0) | Timeline-based scroll choreography and signature sequences that CSS cannot express |
| `zod` | To add (Phase 7) | Runtime validation: env, request bodies, LLM output |
| `groq-sdk` | To add (Phase 7) | Groq API client — **server-side imports only** |
| `server-only` | To add (Phase 7) | Build-time guard on server modules |

### 1.4 Animation & component-library policy

The v1.0 draft of this document banned component and animation libraries. **That decision was reversed by the project owner on 2026-08-14**: the UI is required to feel premium, not merely correct. The libraries above are approved. The constraints that survive:

1. **shadcn primitives are vendored and re-skinned, never used as-is.** `app/globals.css` binds shadcn's semantic variables (`--primary`, `--card`, `--border`, …) to CyberLex tokens, so every primitive inherits the design system. A component that still looks like default shadcn has not been finished. `components/ui/**` is ESLint-ignored as vendored code.
2. **One tween engine per job.** `motion` for component state and gesture animation; `gsap` for scroll-driven timelines. `anime.js` was declined — a second general-purpose tween engine is redundant weight.
3. **Animation never gates content.** Anything scroll-triggered must be visible and readable with JS disabled or before the trigger fires. No content that only exists after an animation.
4. **`prefers-reduced-motion` still wins.** GSAP timelines are killed and `motion` components fall back to their `initial={false}` state. Non-negotiable (§5.4).
5. **Animation stays out of the critical path.** No animation library is imported into a Server Component or a route's initial render path where a CSS transition would do.
6. **Aceternity-style effects are hand-built** from the motifs in `docs/design.md` rather than pasted in — they are copy-paste snippets, not a dependency, and ours must use our tokens.
7. **Never override native scrolling.** `lenis` was installed in Phase 0 and **removed on 2026-08-16** after it broke mouse-wheel scrolling. Scroll is an OS-level behaviour the user owns and expects to work identically everywhere; a decorative library that can take it away is not a trade worth making. This rule generalises: do not hijack browser-native input behaviour for aesthetics.

**Total added: 11.** Nothing else without amending this table.

### 1.2 The rule

> **No package is installed without first adding a row to the tech stack table in `docs/architecture.md` §3.2, with a justification, and noting the decision in `docs/memory.md`.**

Before reaching for a dependency, answer in order:
1. Does the **platform** already do this? (`Intl`, `fetch`, `URLSearchParams`, `AbortController`, `crypto.randomUUID`, CSS `backdrop-filter`, CSS Grid, `<dialog>`)
2. Does **Next.js** already do this? (`next/font`, `next/image`, `next/link`, metadata API, Route Handlers)
3. Can it be **~40 lines** of our own code? If yes, write the 40 lines.

Only if all three are "no" does a dependency get considered.

### 1.3 Explicitly banned

`axios` · `lodash` / `underscore` · `moment` / `dayjs` / `date-fns` · `animejs` / `react-spring` (one tween engine per job — see §1.4) · `redux` / `zustand` / `jotai` / `recoil` / `mobx` · `@tanstack/react-query` / `swr` · `recharts` / `chart.js` / `d3` / `victory` · `@mui/*` / `@chakra-ui/*` / `antd` / `react-bootstrap` · `styled-components` / `emotion` / `@stitches/*` · `react-icons` / `@heroicons/*` (Lucide only) · `next-themes` · `uuid` (use `crypto.randomUUID()`) · `dotenv` (Next loads `.env` natively) · any ORM or DB driver.

Rationale for each is in `docs/architecture.md` §3.3.

---

## 2. Coding Conventions

### 2.1 Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Files & folders | `kebab-case` | `jurisdiction-card.tsx`, `use-compare-selection.ts`, `ai-crimes/` |
| React components | `PascalCase` | `JurisdictionCard`, `StrictnessMeter` |
| Component prop interfaces | `PascalCase` + `Props`, colocated, not exported unless reused | `interface JurisdictionCardProps` |
| Functions & variables | `camelCase` | `getJurisdictionByCode`, `normalizedFine` |
| Repository functions | `get*` / `list*` verb prefix, always `async` | `getDraftsByStage`, `listSources` |
| Boolean values | `is` / `has` / `should` / `can` prefix | `isInForce`, `hasAiProvision`, `shouldHighlight` |
| Types & interfaces | `PascalCase`, no `I` prefix | `Jurisdiction`, not `IJurisdiction` |
| Union member values | `kebab-case` string literals | `'awaiting-notification'`, `'partially-in-force'` |
| Constants | `SCREAMING_SNAKE_CASE` | `STALENESS_THRESHOLD_DAYS`, `MAX_COMPARE_ITEMS` |
| Hooks | `use` prefix, one hook per file | `use-summarize.ts` → `useSummarize` |
| Event handlers | `handle*` internally, `on*` as a prop | `handleSubmit`, prop `onSelect` |
| Route segments | `kebab-case` | `/ai-crimes/[slug]` |

**Domain vocabulary is fixed.** Use these exact terms everywhere — code, types, UI copy, docs. Do not introduce synonyms.

`jurisdiction` (never "country" — the EU is not a country) · `law` / `statute` (a `law` record; `act` only inside display names) · `in-force` (never "active" or "live") · `unnotified` (passed, not commenced) · `draft` (not yet passed) · `strictness score` (never "rating" or "rank") · `technique` (an AI-crime entry) · `coverage` (statute→technique applicability) · `source` (a primary-source citation).

### 2.2 File structure per component

One component per file. The file is named after the component. Order inside the file is fixed:

```tsx
// 1. 'use client' — ONLY if genuinely needed, and always the first line
// 2. External imports (react, next, lucide-react)
// 3. Internal imports (@/lib, @/types, @/components) — grouped, alphabetized within group
// 4. Types / interfaces for this file
// 5. File-local constants
// 6. The component (default export for pages/layouts, NAMED export for everything else)
// 7. Small private sub-components used only by this file, below the main component
```

Rules:
- **Named exports** for all components except `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `route.ts` handlers, and metadata files, where Next requires a default export.
- **~200 lines max** per component file. Past that, extract a sub-component. `comparison-grid.tsx` and `coverage-matrix.tsx` are the expected exceptions; they still need a comment explaining the layout logic.
- **No barrel `index.ts` inside `components/`.** They defeat tree-shaking and obscure import paths. Barrels are permitted only in `types/` and `lib/data/`, where the barrel *is* the public interface.
- Import via the `@/` alias. No `../../..` reaching outside the current folder.
- Props are destructured in the signature, with defaults inline: `({ size = 'md', className }: Props)`.

### 2.3 Server vs Client Components

**Default: Server Component. `'use client'` requires a reason you can state in one sentence.**

`'use client'` is justified **only** by:
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Hooks: `useState`, `useEffect`, `useRef`, `useReducer`, `useTransition`
- Next client hooks: `usePathname`, `useRouter`, `useSearchParams`
- Browser APIs: `window`, `document`, `localStorage`, `matchMedia`, `IntersectionObserver`
- React error boundaries (`error.tsx`, `global-error.tsx` — required by React)

Not justified by: "it has a hover state" (CSS), "it animates" (CSS), "it renders a list" (server), "it takes props" (server), "it uses an icon" (Lucide icons are server-safe).

**Boundary rules:**
1. **Push `'use client'` to the leaves.** Make the interactive control a client component; keep its parent and siblings on the server. Never mark a page or layout `'use client'`.
2. **Client components receive data as props.** They never import from `lib/data/` or `data/`. Data resolution is the server's job.
3. **Never import a server-only module from a client component.** `lib/env.ts`, `lib/ai/*`, and anything touching `process.env` secrets carry the `server-only` package guard.
4. **Server Components may render Client Components.** The reverse works only via `children` — pass server-rendered content down as a prop rather than importing it inside a client component.
5. **Everything crossing the boundary must be serializable.** No functions, class instances, `Date` objects, `Map`/`Set`, or `Symbol` in props to client components. Dates cross as ISO strings and format on either side via `lib/utils/format.ts`.

**Async request APIs are Promises in Next 16** — synchronous access was removed. Always:

```tsx
// ✅ Correct — Next 16
export default async function Page(props: PageProps<'/compare'>) {
  const { a, b, c } = await props.searchParams
}

// ❌ Wrong — Next 15 and earlier; will not compile
export default function Page({ searchParams }: { searchParams: { a: string } }) {
  const a = searchParams.a
}
```

Use the generated global type helpers — `PageProps<Route>`, `LayoutProps<Route>`, `RouteContext<Route>` — instead of hand-written prop types. They are generated by `next dev` / `next build` / `next typegen`.

### 2.4 State management

Ordered by preference. Reach for the *first* one that works.

1. **URL search params** — for anything shareable, bookmarkable, or back-button-relevant: filters, sort, comparator selection, active tab. Write with `router.replace(url, { scroll: false })` for filter changes; `router.push` only when a back-button entry is genuinely wanted.
2. **Server-derived props** — data resolved in the page and passed down. This is not "state"; it is the default.
3. **Local `useState`** — ephemeral view preferences that nobody would share: sheet open/closed, divergence toggle, input draft text.
4. **Nothing else.** No context providers for data. No global stores. If you believe you need one, it belongs in the URL or in props.

### 2.5 Styling

- **Tailwind utilities only.** No CSS modules, no CSS-in-JS, no `<style>` tags.
- **Design tokens come from `@theme` in `globals.css`.** Use semantic token classes (`bg-surface-panel`, `text-ink-300`, `border-rule`), not raw palette values (`bg-[#0B111B]`). Arbitrary values are permitted **only** for one-off geometry (`w-[calc(100%-3rem)]`), never for color.
- **No arbitrary color values in components.** If a color is needed and no token exists, add the token to `@theme` and to `docs/design.md` first.
- **Repeated multi-class patterns become a component**, not a copy-paste. The glass surface is `<GlassPanel>`, never a hand-repeated `bg-white/5 backdrop-blur-xl border ...` string.
- **`cn()` for every conditional className.** `import { cn } from '@/lib/utils/cn'`.
- **Every `ui/` primitive accepts `className`** and merges it last through `cn()`, so callers can override.
- **Mobile-first breakpoints.** Base styles are mobile; `sm: md: lg: xl:` add up, never down. No `max-*` variants except in genuinely exceptional cases.

### 2.6 Data & types

- **Components never import from `data/`.** Only `lib/data/` may. Enforced by an ESLint `no-restricted-imports` rule.
- **Repository functions are `async`** even when the underlying data is synchronous. This preserves the swap boundary.
- **Every domain shape lives in `types/`.** Component-local prop interfaces stay in the component file; anything describing the *domain* lives in `types/`.
- **Closed sets are string-literal unions**, never bare `string`:
  ```ts
  export type LegalStatus =
    | 'in-force' | 'partially-in-force' | 'unnotified' | 'draft' | 'repealed';
  ```
- **Exhaustive switches.** Every `switch` over a union has a `default` with a `never` assertion, so adding a union member becomes a compile error rather than a silent UI gap:
  ```ts
  default: { const _exhaustive: never = status; return _exhaustive; }
  ```
- **Every law/penalty/date record carries `sources: SourceRef[]` and `lastVerified: string`.** A record without a primary source citation does not ship. Non-negotiable — it is the product's credibility.
- **"Unknown" is a value, not a blank.** `null`, `'not-researched'`, and `'no-provision'` are distinct states with distinct UI. Never render an empty cell for a legal fact.

### 2.7 Comments

Comment **why**, never **what**. Required in three places:
1. Any non-obvious legal-domain nuance (why "passed" ≠ "in force" for a specific record).
2. Any scoring or normalization formula (with a link to `/methodology`).
3. Any deliberate deviation from these rules (with the reason).

No commented-out code. No `TODO` without an owner and a phase reference: `// TODO(phase-7): ...`.

---

## 3. What to Avoid — Hard Prohibitions

These fail code review automatically.

### 3.1 Types
- ❌ **`any`.** Ever. Use `unknown` + a narrowing guard, or model the type properly. This includes `catch (e: any)` — use `catch (e: unknown)`.
- ❌ **`as` casts to silence the compiler.** `as const` and casts after a validated `zod` parse are fine; `as SomeType` on unvalidated data is not.
- ❌ **`@ts-ignore` / `@ts-expect-error`** without a comment naming the upstream issue and a removal condition.
- ❌ **Non-null assertions (`!`)** on anything not provably non-null in the same scope.
- ❌ **Implicit `any` from untyped params.** `strict: true` is on; keep it on.

### 3.2 Styling
- ❌ **`style={{ ... }}`** — except for genuinely dynamic single values that cannot be a class (e.g. a meter's `width` percentage, a matrix's computed grid template). Anything static goes in Tailwind.
- ❌ **Arbitrary color values** — `bg-[#22D3EE]`, `text-[rgb(...)]`. Tokens only.
- ❌ **`!important`** and specificity hacks.
- ❌ **Global CSS beyond `globals.css`.** No second stylesheet.
- ❌ **Fixed pixel widths on layout containers.** Fluid + `max-w-*` only.
- ❌ **Anything that causes horizontal overflow at 320px.** Wide content scrolls inside its own `overflow-x-auto` container; the page body never scrolls sideways.

### 3.3 Data
- ❌ **Hardcoded data inside components.** No inline arrays of jurisdictions, no literal penalty figures in JSX, no magic strings for statuses. Data comes from props; constants come from `lib/constants/`.
- ❌ **Duplicated derivation logic.** If two components compute the same thing, it belongs in `lib/`.
- ❌ **Client-side filtering of server data** when the server can filter it. URL param → server → filtered props.
- ❌ **Uncited legal facts.** Every figure traces to a `SourceRef`.
- ❌ **Invented data.** If a figure cannot be sourced, the record is `'not-researched'`. Plausible-looking fabrication is the single worst failure mode this product can have.

### 3.4 Secrets & configuration
- ❌ **Committing `.env`, `.env.local`, or any real key.** `.gitignore` covers `.env*`; do not add exceptions.
- ❌ **`NEXT_PUBLIC_` on anything secret.** That prefix inlines the value into the client bundle.
- ❌ **Reading `process.env` outside `lib/env.ts`.** One validated entry point.
- ❌ **Logging secrets** — including in error messages, error responses, and Sentry-style breadcrumbs. Never log a key, a key prefix, or a key length.
- ❌ **Keys in client components, ever** — even "temporarily while testing."

### 3.5 Next.js specifics
- ❌ **`'use client'` on a page or layout.**
- ❌ **Synchronous `params` / `searchParams` / `cookies()` / `headers()`.** Removed in Next 16.
- ❌ **`middleware.ts`.** Superseded by `proxy.ts` in Next 16.
- ❌ **Custom webpack config.** Turbopack is the default builder in 16; a webpack config fails the build.
- ❌ **`tailwind.config.ts`.** Tailwind v4 is CSS-first; config lives in `@theme`.
- ❌ **`<img>`** where `next/image` applies. **`<a>`** for internal navigation — use `next/link`.
- ❌ **`export const dynamic = 'force-static'` on `/api/summarize`.** It must stay per-request.
- ❌ **Deleting or editing the managed block in `AGENTS.md`.** `next dev` rewrites it; commit it with your work.

---

## 4. Groq AI Integration — Error Handling Rules

The AI integration is the highest-risk surface in the product: an external dependency, non-deterministic output, a secret to protect, and legally sensitive content. These rules are stricter than the rest of the codebase by design.

### 4.1 Key security — non-negotiable

1. `GROQ_API_KEY` is read **only** in `lib/env.ts`, validated with zod at first use.
2. `lib/env.ts` and `lib/ai/*` begin with `import 'server-only'` — an accidental client import becomes a **build-time** error, not a production leak.
3. The key never appears in: API responses, error messages, client-visible logs, URLs, or query strings.
4. The Groq SDK client is instantiated **only** in `lib/ai/client.ts`, imported only by server code.
5. If `GROQ_API_KEY` is absent, `/api/summarize` returns `503 AI_UNAVAILABLE` with a plain user-facing message. It never returns "missing GROQ_API_KEY" — that discloses infrastructure detail.
6. **Phase 8 verification:** grep the production build output for the key value and for the string `GROQ_API_KEY`. Zero hits in any client chunk is a launch gate.

### 4.2 Request handling

**Pre-flight, cheapest rejection first:**

| Check | Limit | Failure |
|-------|-------|---------|
| Rate limit (per IP, fixed window) | `RATE_LIMIT_MAX` (default 10) per `RATE_LIMIT_WINDOW_MS` (default 60s) | `429 RATE_LIMITED` + `Retry-After` header |
| Body size | 8 KB | `413 PAYLOAD_TOO_LARGE` |
| Query length | 8–500 chars after trim | `400 INVALID_QUERY` |
| Schema (`zod`) | `SummarizeRequestSchema` | `400 INVALID_QUERY` |
| Provider configured | `GROQ_API_KEY` present | `503 AI_UNAVAILABLE` |

Rate limiting is in-memory and therefore **per-instance**. This is an accepted v1 limitation and must be stated in `lib/rate-limit.ts` as a comment and in `docs/memory.md` as a known constraint. It is a rough-abuse brake, not a security control.

**Upstream call parameters (all in `lib/ai/config.ts`, no magic numbers at the call site):**

| Parameter | Value | Reason |
|-----------|-------|--------|
| `model` | `GROQ_MODEL` env, default `openai/gpt-oss-120b` | ✅ Verified 2026-08-15. `llama-3.3-70b-versatile` — this document's original default — was **deprecated on 17 June 2026** for free/developer tiers, along with `llama-3.1-8b-instant`, `qwen/qwen3-32b` and `meta-llama/llama-4-scout-17b-16e-instruct`. Keep it env-configurable so the next deprecation is a config change. Fallback: `qwen/qwen3.6-27b`. |
| `response_format` | `{ type: 'json_object' }` — **not** `json_schema` | Structured output is a requirement, not a hope — and `json_schema` enforcement is reported to be silently ignored on gpt-oss models, returning free-form prose. We ask for JSON, then validate it ourselves and repair once, so a provider regression degrades to a designed error rather than rendering garbage as legal information. |
| `temperature` | 0.2 | Legal summarization wants determinism, not creativity. |
| `max_tokens` | Bounded (≈1500) | Caps cost and latency; our schema does not need more. |
| `signal` | `AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS)` | Default 20s hard ceiling. |

### 4.3 Failure modes — every one has a designed UI state

No failure mode may surface as a raw error, a blank screen, or an infinite spinner.

| # | Failure | Detection | Server behaviour | `ApiErrorCode` | UI state |
|---|---------|-----------|------------------|----------------|----------|
| 1 | **Rate limited (ours)** | Limiter | `429` + `Retry-After` | `RATE_LIMITED` | "You've hit the query limit. Try again in {n}s." Submit disabled with a live countdown. |
| 2 | **Rate limited (Groq)** | SDK `429` | Retry **once** after `Retry-After` (capped, jittered); then fail | `UPSTREAM_RATE_LIMITED` | "The AI service is busy. Try again in a moment." Retry button. |
| 3 | **Timeout** | `AbortSignal` fires | Abort, no retry (it already spent the budget) | `TIMEOUT` | "That took too long. Try a shorter, more specific question." Retry + a hint to narrow scope. |
| 4 | **Upstream 5xx** | SDK 500–599 | Retry **once** with exponential backoff + jitter; then fail | `UPSTREAM_ERROR` | "The AI service is temporarily unavailable. The rest of CyberLex still works." Links to Dashboard/Comparator. |
| 5 | **Upstream 4xx (not 429)** | SDK 400–428, 430–499 | **Never retry** — our request is wrong. Log full detail server-side. | `UPSTREAM_ERROR` | Generic unavailable message. Never expose the upstream body. |
| 6 | **Auth failure (401/403)** | SDK | No retry. Log loudly — this is an operator problem. | `AI_UNAVAILABLE` | "AI assistance isn't available right now." No mention of keys or auth. |
| 7 | **Malformed JSON** | `JSON.parse` throws | **One** repair retry with a corrective instruction; then fail | `MALFORMED_RESPONSE` | "The AI returned an unreadable answer. Try rephrasing." Retry button. |
| 8 | **Schema mismatch** | `safeParse` fails | One repair retry; then fail. **Never render partial data.** | `MALFORMED_RESPONSE` | Same as #7. |
| 9 | **Empty response** | No choices, or all sections empty after trim | Treated as #7 (one repair retry) | `EMPTY_RESPONSE` | "The AI couldn't produce an answer for that. Try being more specific." |
| 10 | **Out of scope** | `outOfScope: true` in a **valid** response | `200` — this is a success, not an error | — | Honest state: "This is outside what CyberLex tracks," with links to the modules that *are* covered. |
| 11 | **Low confidence** | `confidence: 'low'` in a valid response | `200` | — | Answer renders with a prominent low-confidence marker and a stronger "verify against primary sources" prompt. Never presented as authoritative. |
| 12 | **Provider not configured** | `lib/env.ts` | `503`, fail fast before any network call | `AI_UNAVAILABLE` | Assistant page renders a designed "AI assistance unavailable" state. Modules 1–4 unaffected. |
| 13 | **Network failure** | `fetch` rejects | Retry once | `NETWORK_ERROR` | "Couldn't reach the AI service. Check your connection and retry." |
| 14 | **Client abort** | User navigates away / resubmits | N/A — client-side | — | Silent. Never an error toast for a user-initiated cancel. |

### 4.4 Retry policy

- **Retry exactly once**, only for: `429`, `5xx`, network failure, and the first malformed/schema/empty response.
- **Never retry:** timeouts, `4xx` other than 429, auth failures, or a second malformed response.
- Backoff: base delay + full jitter. Honor `Retry-After` when present, capped so a long header value can't stall the request past the hard timeout.
- **The retry budget lives inside the hard timeout.** Total server time for a request never exceeds `AI_REQUEST_TIMEOUT_MS`, retries included.

### 4.5 Response contract

Every response from `/api/summarize` is one of exactly two shapes:

```ts
{ ok: true;  data: LegalSummary }
{ ok: false; code: ApiErrorCode; message: string; retryAfterSeconds?: number }
```

- `message` is **user-facing copy written for a non-technical reader**. It is never an upstream error body, stack trace, model name, or infrastructure detail.
- Full upstream detail is logged server-side with a correlation ID; the ID may be shown to the user for support purposes.
- The client switches on `code`, never on `message` text.

### 4.6 Content-safety rules for AI output

1. **Every AI response renders with a non-dismissible "not legal advice" disclaimer.** Structurally part of `SummaryResult` — it cannot be rendered without it.
2. **AI-generated content is visually distinct from curated data.** `AiGeneratedMarker` + the violet AI accent, so no user can mistake a model answer for a sourced record (see `docs/design.md`).
3. **The system prompt instructs refusal over speculation.** The model sets `outOfScope: true` rather than inventing a statute.
4. **Grounding is mandatory.** Relevant tracked records are always injected; the model is told to prefer them over recollection and to cite the record IDs it used.
5. **Never auto-persist AI output into `data/`.** Curated data is human-verified against primary sources, full stop.

---

## 5. Accessibility Baseline

**Target: WCAG 2.2 AA.** Non-negotiable items are marked ⚠️.

### 5.1 Structure & semantics
- ⚠️ One `<h1>` per page. Heading levels never skip.
- ⚠️ Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`. `<main>` wraps page content in the root layout.
- ⚠️ A "Skip to content" link is the first focusable element, visible on focus.
- Lists are `<ul>`/`<ol>`. Tabular comparison data uses `<table>` with `<th scope>`, not a grid of `<div>`s.
- Buttons are `<button>`; links are `<a>`/`<Link>`. A clickable `<div>` is a defect.
- Decorative elements (grid mesh, grain, glow, scanlines) are `aria-hidden="true"` and never focusable.

### 5.2 Keyboard
- ⚠️ Every interactive element reachable and operable by keyboard alone.
- ⚠️ Visible focus on everything focusable. `:focus-visible` ring: 2px cyan, 2px offset. **Never `outline: none` without a replacement.**
- Focus order follows visual order. No positive `tabIndex`.
- Bottom sheets and dialogs trap focus while open, restore it on close, and close on `Escape`.
- Custom selects/segmented controls implement expected key behaviour (arrows, Home/End, Enter/Space, Escape).

### 5.3 Color & contrast
- ⚠️ Body text ≥ **4.5:1** against its actual (glass-composited) background. Test against the composite, not the token.
- ⚠️ Large text (≥18.66px bold / ≥24px) ≥ 3:1. UI component boundaries and focus indicators ≥ 3:1.
- ⚠️ **Never encode information by color alone.** Every status badge carries an icon + text label. Every coverage-matrix cell carries a glyph. Every severity level carries a word. This matters more here than usual: our entire information design is color-coded.
- Muted text (`ink-500`) is for genuinely non-essential content only, never for legal facts.

### 5.4 Motion
- ⚠️ Honor `prefers-reduced-motion: reduce` — disable scanline sweeps, pulses, shimmer, and transforms; keep opacity fades ≤ 150ms.
- No auto-playing looping animation in the reading area.
- Nothing flashes more than 3 times per second.

### 5.5 Forms & live regions
- ⚠️ Every input has a `<label>` (visible, or `sr-only` where the design demands).
- Errors are announced (`role="alert"`), tied to the input via `aria-describedby`, and explain the fix.
- Assistant loading state uses `aria-busy` + `aria-live="polite"`; the arriving result is announced.
- Required fields are marked in text, not by color or an asterisk alone.

### 5.6 Images & icons
- Meaningful icons get `aria-label` or adjacent text; decorative icons get `aria-hidden="true"`.
- `next/image` with real `alt` text. Flags: `alt` is the country name, or `aria-hidden` when the name is already adjacent.

---

## 6. Responsiveness Baseline

### 6.1 Breakpoints (Tailwind v4 defaults)

| Token | Width | Primary use |
|-------|-------|-------------|
| *(base)* | 320–639px | **Design target.** Single column, bottom nav. |
| `sm` | 640px | Large phones — 2-up stat tiles |
| `md` | 768px | Tablet — 2-up jurisdiction grid |
| `lg` | **1024px** | ⭐ **Nav switch:** bottom nav → top nav. Full comparator. |
| `xl` | 1280px | 3-up grid, wider container |
| `2xl` | 1536px | Max container width; no new layout |

### 6.2 Rules
- ⚠️ **Design at 375px first.** Every component is built mobile-up.
- ⚠️ **No horizontal page scroll at 320px.** Wide content (comparison grid, coverage matrix) scrolls inside its own `overflow-x-auto` container with a sticky label gutter and edge-fade affordance.
- ⚠️ **Touch targets ≥ 44×44px** below `lg`.
- ⚠️ **Bottom nav respects `env(safe-area-inset-bottom)`.** Page content gets matching bottom padding so nothing hides behind it.
- Fluid type and spacing via `clamp()` for display headings; the rest uses the discrete scale.
- Long legal titles wrap; they never truncate without a `title` attribute or tooltip carrying the full text.
- Tables never squash. Below `lg` they scroll, stack, or become cards — never shrink to illegibility.
- ⚠️ **Verify at 320, 375, 768, 1024, 1440.** Every phase's "done when" includes this check.
- Layout decisions are **CSS-driven** (`lg:hidden` / `hidden lg:flex`), not JS media queries — `useMediaQuery` exists for behavioural tweaks only, never for deciding what renders. This avoids hydration mismatch and layout shift.

---

## 7. Code Review Gates

A change does not merge until all are true:

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run lint` — zero errors, zero warnings
- [ ] `npm run build` — succeeds
- [ ] No `any`, no `@ts-ignore`, no unexplained `as` casts
- [ ] No new dependency without an `architecture.md` §3.2 row
- [ ] No `process.env` access outside `lib/env.ts`
- [ ] No component importing from `@/data/*`
- [ ] Every new legal data record has ≥1 source and a `lastVerified` date
- [ ] Keyboard-navigable with visible focus
- [ ] No information encoded by color alone
- [ ] Verified at 320 / 375 / 768 / 1024 / 1440
- [ ] Loading, empty, error, and populated states all exist for any async or filterable surface
- [ ] `docs/memory.md` updated
