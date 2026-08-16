# CyberLex Global — Design System

**Version:** 2.0 — "Obsidian"
**Last updated:** 2026-08-15
**Implemented in:** `app/globals.css` (Tailwind v4 `@theme`) + `components/`
**Supersedes:** v1.0 "Deep Stack" (blue-shifted slate, card grid, glass tiers, scanline motifs) — rejected in review as generic dark-mode SaaS.

---

## 0. Design Thesis

**The map is the interface, not the decoration.** The product's subject is jurisdictional, so geography is the primary organising structure — not a grid of cards with a world map pasted behind it.

Four principles, each a reversal of the v1 draft:

1. **True black, warm ink.** The ground is `#000000`. Greys are warm-neutral, never blue-shifted — blue-grey is the single most reliable tell of a template dark theme.
2. **Colour means data, never brand.** The interactive/brand colour is **bone** (off-white). All hue is reserved for legal-status semantics. Nothing in the system is ever both a brand accent and a data value, so no colour carries two meanings.
3. **Hairlines, not boxes.** Depth comes from 1px rules, negative space, and a single top light. There are no cards, no stacked glass panels, no rounded containers. Radii are 2–4px — effectively square.
4. **Type does the work.** An editorial serif at display size against monospace data labels. The contrast between the two *is* the visual identity; ornament is unnecessary once that's carrying weight.

**Anti-goals, explicitly:** card grids · glow-on-hover cards · animated scanlines and grid meshes · gradient-filled buttons · blue/purple accent on slate · rounded-2xl everything · decorative motion with no informational job.

The product is dark-only.

---

## 1. Colour

### 1.1 Ground — true black

| Token | Hex | Use |
|-------|-----|-----|
| `--color-void` | `#000000` | Page ground. Pure black, no exceptions. |
| `--color-abyss` | `#050506` | Row hover, rail background |
| `--color-hull` | `#0A0A0B` | Raised surface where one is unavoidable |
| `--color-plate` | `#101011` | Popovers, sheets, dropdowns |
| `--color-riser` | `#17171A` | Pressed/selected fill |
| `--color-rule` | `#1E1E21` | ⭐ The default hairline. The most-used token in the system. |
| `--color-rule-strong` | `#2C2C31` | Emphasised divider, map graticule |

### 1.2 Ink — warm neutral

**Every step that carries text passes WCAG AA (4.5:1)**, measured against the darkest surface it actually appears on (`#0A0A0B`) — not against pure black, and not by estimate.

| Token | Hex | Measured | Use |
|-------|-----|----------|-----|
| `--color-bone` | `#F2EFE9` | 18.4:1 | ⭐ Brand + interactive. Active nav, primary buttons, focus ring, key figures. |
| `--color-ink-100` | `#E8E5DF` | 16.9:1 | Body, headings |
| `--color-ink-300` | `#A6A29B` | 7.8:1 | Secondary text, descriptions |
| `--color-ink-500` | `#8C877E` | 5.5:1 | Labels, meta |
| `--color-ink-700` | `#7F7A72` | 4.6:1 | Dimmest text step — statute years, citations, column labels |
| `--color-ink-900` | `#26241F` | — | Structural fills only. **Never text.** |

> **Corrected in Phase 8.** The original ramp put `ink-500` at 4.15:1 and `ink-700` at 2.14:1, with `ink-700` documented as "decorative only". An automated sweep found it used for **67 pieces of text and zero decorations** — including statute years, which are legal facts. Both tokens were lightened rather than the 67 usages rewritten, because the token was wrong, not the usage. `--color-null` was lightened from `#5F5C57` (2.9:1) to `#8F8A82` (5.8:1) for the same reason: "Not researched" is a substantive claim, not a muted decoration.
>
> **Never estimate a contrast ratio.** Measure it against the composited background, per route.

### 1.3 Data semantics — muted, not neon

Retuned from v1's saturated set. On true black, neon reads cheap; desaturated reads expensive.

| Token | Hex | Meaning |
|-------|-----|---------|
| `--color-live` | `#4CC38A` | **In force** |
| `--color-partial` | `#58C4BD` | **Partially in force** |
| `--color-pending` | `#E3B23C` | **Unnotified** — passed, not commenced |
| `--color-draft` | `#D97757` | **Draft** — bill under review |
| `--color-synthetic` | `#9E7BE8` | **AI-related**, everywhere |
| `--color-critical` | `#E5484D` | Severe strictness, no statutory coverage, errors |
| `--color-null` | `#5F5C57` | Repealed, unknown, not researched |

Each has a `-dim` companion (`--color-live-dim` etc.) for fills and tracks.

Because brand is bone, the v1 rule about separating "status hues" from "score ramp hues" is no longer needed — but the ramp still reuses the semantic tokens: `live` (Permissive) → `partial` (Moderate) → `pending` (Strict) → `critical` (Severe), always with the band word rendered beside it.

**Status is never colour-only.** Every status carries a 4px square swatch *and* its word. No icons on status: at this type size a word is faster to read than a glyph, and it survives colour-blindness and greyscale printing.

---

## 2. Typography

### 2.1 Families

| Role | Family | Why |
|------|--------|-----|
| **Display** | **Instrument Serif** (400, + italic) | Editorial, high-contrast, slightly condensed. Set very large and never bold, it reads as a publication rather than an app. The italic is used as an *emphasis inside the headline* ("Passed *is not* in force") — a typographic device, not decoration. |
| **UI** | **Geist** | Neutral, tight, excellent at small sizes. Deliberately recessive so the serif and the mono carry the character. |
| **Data** | **Geist Mono** | Tabular figures for every score, window, and fine. Also carries *all* labels — micro-caps in mono is the system's connective tissue. |

Self-hosted via `next/font/google`: no external requests, no layout shift.

### 2.2 Scale

| Token | Size / leading | Family | Use |
|-------|---------------|--------|-----|
| `text-display` | `clamp(3rem, 8vw, 7.5rem)` / 0.92, 400, `-0.035em` | serif | The one headline per page |
| `text-display-sm` | `clamp(2rem, 4vw, 3.25rem)` / 1 | serif | Section openers, mobile display |
| `text-serif-lead` | `clamp(1.25rem, 2vw, 1.75rem)` / 1.35 | serif | Pull quotes, statute excerpts |
| `text-h2` | `1.375rem` / 1.25, 500 | sans | Section headings |
| `text-h3` | `1.0625rem` / 1.35, 500 | sans | Row titles |
| `text-body` | `0.9375rem` / 1.6 | sans | Body |
| `text-body-sm` | `0.8125rem` / 1.55 | sans | Secondary, rail rows |
| `text-micro` | `0.625rem`, 500, `0.16em`, uppercase | **mono** | ⭐ Every label, column head, and eyebrow |
| `text-data-xl` | `3.5rem` / 0.9, `-0.04em` | mono | Hero figures |
| `text-data-lg` | `1.375rem` | mono | Readout figures |
| `text-data` | `0.8125rem` | mono | Inline figures |
| `text-code` | `0.6875rem`, `0.02em` | mono | Statute refs, ISO codes, dates |

**Rules:** display type is never bold. Prose caps at 62ch. Every comparable number is mono with `tabular-nums`. Labels are mono micro-caps — sans is never used for a label.

---

## 3. Surfaces & Depth

There is no glass tier system. On true black, translucency muddies more than it separates.

| Device | Spec |
|--------|------|
| **Hairline** | `1px solid var(--color-rule)`. Structural separation. Prefer a single rule over a bounding box. |
| **`rule-fade`** | Hairline that fades to transparent at both ends — a rule that doesn't box its content. |
| **Top light** | One `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(242,239,233,0.05), transparent 70%)` per major region. The *only* ambient gradient. |
| **`veil`** | The single translucent surface: `color-mix(void 72%)` + `blur(24px)`. Used only where content must float over the map. Has an opaque `@supports` fallback. |
| **`grain`** | SVG turbulence at **2.2%** opacity, page-fixed. The only ambient texture — no grid mesh, no scanlines. |
| **Radii** | `sm 2px · md 3px · lg 4px · xl 6px`. Effectively square. |
| **Shadow** | Nearly unused. Elevation is a light hairline (`0 1px 0 rgba(255,255,255,0.04)`), not a dark blur — black cannot cast a shadow on black. |

---

## 4. Signature Motifs

### 4.1 ⭐ The map — the product's primary object

Real vector geography, not a decorative graphic.

- **Data:** `world-atlas` `countries-110m` topojson, projected with `d3-geo` `geoNaturalEarth1`, fitted to a 1000×500 viewBox.
- **Server-resolved.** Projection runs at module scope on the server; only the resulting SVG path strings reach the browser. Verified: zero references to `d3-geo`/`world-atlas` in any client chunk. The map costs **0 KB of client JS**.
- **Untracked land** — `#232327 → #141416` vertical gradient, hairline black separators. Present but recessive.
- **Tracked jurisdictions** — `#4A4A54 → #33333B`, lifted clearly out of the ground, with a `#4A4A52` outline.
- **Markers** — a 2.6px dot in the jurisdiction's status colour, a 22px radial glow, a slow expanding ring (3s), and the ISO code in mono at 8px.
- **Antarctica is removed.** It carries no tracked jurisdiction and reads as a bright slab across the bottom edge.
- **EU is a bloc, not a country** — it resolves to all 27 member-state geometries and lights them as a group.

### 4.2 The index rail

The jurisdiction list is typographic rows, **not cards**:
`ISO code (mono, ink-700) · name (h3) · status swatch + word (right) / act + year (body-sm) / score rule`
Separated by hairlines. Hover fills `abyss` and slides a bone marker in from the left edge (`row-mark`).

### 4.3 The score rule

Strictness is a **hairline with a travelling tick**, not a bar and not v1's 20-segment meter: a 1px track, a filled portion in the band colour, a 10px vertical tick at the value, then the number in mono and the band word. One precise line reads more like an instrument than twenty lit blocks.

### 4.4 The readout strip

A full-width band of `dl` cells divided by hairlines, each `micro` label above a `data-lg` figure. Fixed to the bottom of the console. Deliberately reminiscent of an instrument panel's status bar.

### 4.5 `row-mark`

The universal hover affordance: a 1px bone bar grows from centre to full height at the row's left edge over 260ms. Replaces card lift and glow entirely. Also serves as the `data-active` selected state.

### 4.6 Iconography

**Lucide, used sparingly.** In v2 the interface is almost icon-free — status uses swatch + word, nav uses text. Icons appear only where they add information a word cannot (module identity in the mobile nav, external-link and source affordances). 1.5px stroke, `currentColor`, `aria-hidden` unless standalone-actionable.

---

## 5. Layout

### 5.1 The console

The dashboard is a **full-viewport console**, not a scrolling page:

```
┌────────────────────────────────────────────────────────┐
│ CyberLex GLOBAL   Dashboard Compare Tracker …    ▪ LIVE│  masthead, 1px rule
├──────────────────┬─────────────────────────────────────┤
│ JURISDICTION     │  2026 · GLOBAL SURVEY               │
│ INDEX            │  Passed is not                      │
│ ─────────────────│  in force.          ·   ·           │
│ CN China     ▪   │                  ·        ·  ·      │
│    ───────┤ 91   │        [ world map, bleeding right ] │
│ ─────────────────│              ·         ·            │
│ SG Singapore ▪   │                                     │
│    ──────┤  84   │  ▪ In force ▪ Partial ▪ Unnotified  │
├──────────────────┴─────────────────────────────────────┤
│ JURISDICTIONS │ IN FORCE │ UNNOTIFIED │ … readout      │
└────────────────────────────────────────────────────────┘
```

Rail `27rem`, map `flex-1`. The map is nudged `+4% x / +5% y` so the headline sits over open Pacific rather than over North America.

**DOM order is map-section first** (so the `<h1>` is reached early), with the rail pulled left on desktop via `lg:order-1`. Mobile therefore reads: headline → map → legend → index → readout.

### 5.2 Spacing & breakpoints

4px base. Gutters `20px` mobile / `32px` desktop. Container is full-bleed — the console has no max width; only prose is capped (62ch).

Breakpoints unchanged from v1: `lg` (1024px) remains the structural switch — console splits to two columns, top nav appears, mobile bottom nav takes over below it.

---

## 6. Motion

Sparse and informational. **Anything purely decorative was cut in v2.**

| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `animate-breathe` | 4s opacity 0.35↔0.9 — the "live" status dot only |
| `animate-ping-slow` | 3s expanding ring — map markers only |
| `row-mark` | 260ms height grow on hover |

Everything else is a 150–260ms colour or opacity transition. **Lenis smooth scroll is bypassed entirely** under `prefers-reduced-motion`, and the global reduced-motion block clamps all animation.

**Removed in v2:** scanline sweep, grid mesh, corner brackets, card lift, shimmer, staggered card entrances, corner blooms.

---

## 7. Navigation

**Desktop (`≥ lg`)** — masthead only: serif wordmark + mono "GLOBAL" left, five text links centre, status right. No icons, no buttons, no pill backgrounds. Active link is `bone`; inactive `ink-500`. 1px bottom rule.

**Mobile (`< lg`)** — fixed bottom nav, 5 items, Lucide icon + mono micro label, `veil` surface, 1px top rule, `env(safe-area-inset-bottom)` aware. Active: bone icon + label, 1px bone bar above the item. *(Phase 2.)*

---

## 8. Checklist (per component)

- [ ] Semantic tokens only — no arbitrary colour values
- [ ] No card, no box, no radius above 6px, unless justified in review
- [ ] Colour meaning duplicated by a word
- [ ] `:focus-visible` bone ring, 3px offset, unmodified
- [ ] Touch targets ≥ 44px below `lg`
- [ ] Text ≥ 4.5:1 (measure the real composite over the map)
- [ ] Motion has an informational job, and respects `prefers-reduced-motion`
- [ ] Numerals in mono with `tabular-nums`
- [ ] Loading / empty / error / populated states designed
- [ ] Verified at 320 / 375 / 768 / 1024 / 1440
