# CyberLex Global

A centralised intelligence hub for global cyber law: track statutes across ten jurisdictions, compare how strict they actually are, watch the gap between "passed" and "in force", map AI-enabled crime to the provisions that reach it, and ask questions in plain English.

**Built with** Next.js 16.3 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Groq

---

## ⚠️ Read this before using the data

**Every one of the 65 records in this repository is marked `verification: "needs-review"`.**

They were authored from structural knowledge of each regime and have **not** been checked line-by-line against the cited primary sources by a person with legal training. Until that count reads zero:

- Nothing here is citable.
- This product must not be presented as authoritative.
- The count is displayed in the masthead on every page, deliberately.

This is a launch gate, and it needs a lawyer, not an engineer. See [`data/README.md`](data/README.md).

CyberLex is a research and orientation tool. **It is not legal advice.**

---

## Quick start

```bash
npm install
cp .env.example .env.local   # add a Groq key for the assistant (optional)
npm run dev
```

Modules 1–4 are entirely static curated data and need **no** API key. Without one, `/assistant` renders a designed unavailable state and everything else works normally.

```bash
npm run build     # production build
npm run lint      # eslint
npx tsc --noEmit  # typecheck
```

> **If routes 404 while reporting successful compilation**, clear the Turbopack filesystem cache: `rm -rf .next`. It is enabled by default in Next 16 and goes stale across interrupted dev sessions.

---

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `GROQ_API_KEY` | For the assistant only | Server-side only. Never `NEXT_PUBLIC_`. |
| `GROQ_MODEL` | No | Default `openai/gpt-oss-120b`. Groq deprecates models regularly — this is env-configurable so a deprecation is a config change, not a deploy. |
| `AI_REQUEST_TIMEOUT_MS` | No | Hard ceiling on upstream time, retries included. Default `20000`. |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | No | Per-IP throttle. Defaults `10` / `60000`. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata, OG images, sitemap. |

`process.env` is read in exactly one place — [`lib/env.ts`](lib/env.ts) — which is `server-only`, so an accidental client import fails the **build** rather than leaking a key.

> Groq blocks some VPN and datacenter exit IPs, returning `403 "Access denied. Please check your network settings."` with a perfectly valid key. If the assistant reports the service unavailable, try without a VPN.

---

## Architecture in one screen

```
data/*.ts          raw curated records — never imported by components
    ↓
lib/data/*.ts      async repository — the swap boundary
    ↓
app/**/page.tsx    Server Components resolve data, pass it down
    ↓
components/**      presentation only; zero client JS unless interactive
```

An ESLint rule blocks `@/data/*` imports outside `lib/data/`. Every repository function is `async` despite the data being static today, so swapping in a database changes only `lib/data/` — no component churn.

**State lives in the URL.** Filters, comparator selection and the revenue assumption are all query params: shareable, bookmarkable, server-readable, back-button-correct. There is no client state library and no duplicated filter logic.

**The world map is real geography** — `world-atlas` topojson projected through `d3-geo` at module scope on the server. Only the resulting SVG path strings reach the browser, so the map costs **0 KB of client JS**.

---

## Modules

| Route | What it does |
|-------|--------------|
| `/` | Console: jurisdiction index + live map + readout strip. Filters and sort in the URL; the map mirrors the filtered set. |
| `/jurisdictions/[code]` | Score breakdown by weighted dimension, tracked instruments, phase schedules, regulators, primary sources. |
| `/compare` | 2–3 jurisdictions across 14 metrics. Criminal exposure normalised to years; fine ceilings normalised against an adjustable revenue with the native structure always shown. |
| `/tracker` | The differentiator — the gap between enactment and enforceability, and what is blocking each instrument. |
| `/ai-crimes` | 6 techniques × 10 jurisdictions. Distinguishes *direct* from *analogical* coverage, and "no clear coverage" from "not researched". |
| `/assistant` | Plain-English question → Overview / Sanctions / Compliance Takeaways, grounded in tracked records and schema-validated before render. |
| `/methodology` | The scoring model, weights and limits, rendered from the source of truth — no second copy. |

---

## Principles this codebase actually enforces

**Unknown is a value, not a blank.** `no-provision` ("this jurisdiction has no such rule") and `not-researched` ("we have not checked") are different legal claims and are rendered differently everywhere. Conflating them is treated as a correctness bug.

**Never guess a figure.** Where a value could not be established it is `NOT_RESEARCHED`. A visible gap is honest; a plausible invented penalty is unrecoverable.

**The AI is not trusted.** `json_object` plus our own zod validation and one repair attempt — never `json_schema`, whose enforcement is unreliable on this model class. A response that parses but does not match the schema is a failure, never a partial render. The model's cited jurisdictions are filtered against real codes so a hallucination cannot become an in-app link.

**Colour is never the only channel.** Every status carries a word; every coverage cell carries a glyph.

**Measure, don't estimate.** Accessibility and layout are verified with an automated sweep across 11 routes × 5 viewports, not by eye.

Full detail: [`docs/rules.md`](docs/rules.md).

---

## Verified

Automated sweep, 11 routes × {320, 375, 768, 1024, 1440}px:

- **Horizontal overflow:** 0 failures (wide tables scroll inside their own container)
- **Heading structure, landmarks, labels, alt text, focus order:** 0 issues
- **Contrast:** 0 failures against real composited backgrounds
- **Reduced motion:** 0 violations; Lenis smooth scroll fully bypassed
- **Client bundle:** 0 references to `GROQ_API_KEY`, the key value, `gsk_`, or `groq-sdk`
- **Assistant failure modes:** 11 of 14 individually triggered ([`docs/memory.md`](docs/memory.md))

---

## Documentation

| File | Contents |
|------|----------|
| [`docs/prd.md`](docs/prd.md) | Problem, personas, user stories, success criteria, out-of-scope |
| [`docs/architecture.md`](docs/architecture.md) | Route map, file structure, tech-stack rationale, data flows |
| [`docs/rules.md`](docs/rules.md) | Engineering rules, conventions, AI error-handling contract |
| [`docs/design.md`](docs/design.md) | "Obsidian" design system — palette, type, motifs, layout |
| [`docs/phases.md`](docs/phases.md) | Build plan, phase by phase |
| [`docs/memory.md`](docs/memory.md) | Running state, decisions log, known limitations |
| [`data/README.md`](data/README.md) | Sourcing rules and the update procedure |
