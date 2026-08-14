# `data/` — curated records

This directory is the database in v1. Nothing outside `lib/data/` may import from it — an ESLint rule enforces the boundary (`docs/architecture.md` §2.1).

---

## ⚠️ Current state: NOT launch-ready

**Every record in this directory carries `verification: "needs-review"`.**

The records were authored from secondary knowledge and structural understanding of each regime. They have **not** been checked line-by-line against the cited primary sources by a human. Until they are:

- No figure here is citable.
- The product must not be presented publicly as authoritative.
- Human verification is a **launch gate** (`docs/phases.md` Phase 8).

The `needsReview` count in the dashboard readout is deliberately visible. It is not a bug; it is the product being honest about its own state, and it should read `0` before launch.

---

## The rules

### 1. Every legal fact carries a source and a date

Each record implements `Sourced`:

```ts
sources: SourceRef[];      // ≥ 1, pointing at data/sources.ts ids
lastVerified: string;      // ISO date
verification: VerificationStatus;
```

A record without a primary source citation does not ship. This is the product's entire credibility claim.

### 2. Official publishers only

`data/sources.ts` accepts:

- Primary legislation from an official publisher (EUR-Lex, legislation.gov.uk, Singapore Statutes Online, India Code, Planalto, Federal Register of Legislation, uscode.house.gov)
- Official regulator guidance and regulator homepages
- Gazette notifications and parliamentary records
- Treaty texts from the depositary organisation

It does **not** accept: news articles, blog posts, law-firm client alerts, Wikipedia, or aggregator summaries. These may be useful for finding a source; they are never the source.

Prefer stable identifiers — EUR-Lex ELI URLs, `legislation.gov.uk` chapter references, SSO act slugs — over search-result links.

### 3. Unknown is a value, not a blank

`Known<T>` has three states and they mean different things:

| State | Meaning |
|-------|---------|
| `known(v)` | Established and sourced |
| `NO_PROVISION` | The jurisdiction genuinely has no such provision |
| `NOT_RESEARCHED` | We have not established it |

**Never guess.** A visible `NOT_RESEARCHED` is honest; a plausible invented figure is the single worst failure this product can have (`docs/rules.md` §3.3). Conflating `NO_PROVISION` with `NOT_RESEARCHED` is a correctness bug, not a styling choice — the UI renders them distinctly.

### 4. Analogical mappings are arguments, not facts

In `ai-crimes.ts`, `coverage: "analogical"` asserts that a provision drafted before the technique existed can be stretched to reach it. Write the `rationale` so the argument can be attacked — including the reason it might fail. Several entries note exactly where the analogy strains (the authorisation element in prompt injection, for instance). That is the interesting content, not a weakness.

### 5. Strictness dimensions are judgements on a published rubric

The six dimensions in `jurisdictions.ts` are analyst scores against the definitions in `lib/scoring/weights.ts`, which are published verbatim at `/methodology`. They are a **comparative indicator, not a measurement** (`docs/prd.md` R-3). `enforcementIntensity` is the least reproducible and is weighted accordingly.

---

## Files

| File | Contents |
|------|----------|
| `sources.ts` | Primary source registry. Everything else references ids from here. **Add sources first.** |
| `jurisdictions.ts` | 10 jurisdictions: region, map geometry, regulators, AI posture, strictness dimensions, profile |
| `laws.ts` | 27 tracked instruments with status, dates, phase schedules |
| `metrics.ts` | Comparator values: sentences, fine structures, reporting windows, AI governance |
| `drafts.ts` | Unnotified acts and bills in the pipeline — the tracker's content |
| `ai-crimes.ts` | 6 technique taxonomy + per-jurisdiction statutory mappings |

---

## Update procedure

1. **Add the source first** to `sources.ts` with a fresh `retrieved` date.
2. Author or amend the record, citing that source id with a `pinpoint` where possible.
3. Set `lastVerified` to today and `verification` honestly — `needs-review` unless you personally read the instrument.
4. If a fact could not be established, use `NOT_RESEARCHED`. Do not estimate.
5. Run `npx tsc --noEmit` — unknown source ids throw in development via `lib/data/sources.ts`.
6. Note the change in `docs/memory.md`.

**Review cadence:** legislative state is the fastest-moving data here. `drafts.ts` goes stale quickest, then `metrics.ts`. The staleness threshold is 120 days (`lib/constants/thresholds.ts`); records past it render a "verify before relying" affordance.

---

## Known scope limits (v1)

Deliberate, per `docs/prd.md` §6:

- Federal / national level only. No US state law, no EU Member State transposition detail, no Indian state law.
- No sector-specific deep dives (health, finance, defence) beyond flagging that variations exist.
- UAE free zones (DIFC, ADGM) run separate regimes and are out of scope.
- Sources may be non-English; summaries are English only.
- No full statute text is mirrored — we link to primary sources.
