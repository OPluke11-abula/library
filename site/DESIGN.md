# Grand Library Design System Specification (`site/DESIGN.md`)

Single Source of Truth (SSOT) for visual tokens, typographic cadence, surface hierarchy, and accessibility gates across the static Astro presentation layer (`site/`).

---

## 1. Design Identity & Surface Mode

- **Theme**: *Midnight Archival Monograph* — a quiet, high-contrast dark scholarly reading room blending obsidian paper surfaces, warm archival gold highlights, and optical sapphire cyan interactions.
- **Primary Mode**: `Read` (long-form technical derivation, KaTeX mathematics, and Mermaid diagrams within `65ch–75ch` / `760px` column width).
- **Secondary Entry Mode**: `Persuade` (structured index cover and direction selector tracks on Home and Learning Paths).
- **Parametric Dials**:
  - `DESIGN_VARIANCE`: `Medium` (focal hierarchy and asymmetric showcase layout without sacrificing predictable navigation or mobile fold budgets).
  - `MOTION_INTENSITY`: `Subtle` (`150ms–220ms` `cubic-bezier(0.16, 1, 0.3, 1)` responsive feedback and passive reading progress hairline; zero ambient neon pulse loops; full `prefers-reduced-motion` support).
  - `VISUAL_DENSITY`: `Editorial` (generous breathing room, hairline structural dividers instead of stacked badges).

---

## 2. Color & Contrast System (WCAG AA `>= 4.5:1`)

| Token | Hex / Value | Role | Minimum Contrast vs `--bg-elevated` (`#172133`) |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#090d16` | Global obsidian reading canvas | Base |
| `--bg-surface` | `#0f1624` | Primary cards, TOC sidebar, drawers | Subtle elevation |
| `--bg-elevated` | `#172133` | Nested controls, code/pill surfaces, table headers | Elevated surface |
| `--bg-hover` | `#1e2a40` | Interactive hover surface | Hover surface |
| `--border-subtle` | `#1c273b` | Default `1px` structural border | Hairline |
| `--border-accent` | `#2c3c58` | Emphasized control border | Focus/hover hairline |
| `--text-primary` | `#f5f7fa` | Primary copy and display headings | `> 13:1` |
| `--text-secondary` | `#a8b6ca` | Descriptions, body supporting prose | `> 7.5:1` |
| `--text-muted` | `#8e9db2` | Tertiary labels, captions, breadcrumbs | `> 5.3:1` |
| `--accent-gold` | `#dfc068` | Foundational volumes, invariants, quotes, theorems | `> 8.5:1` |
| `--accent-cyan` | `#56ccf2` | Primary CTAs, active TOC, links, focus outlines | `> 8.8:1` |

*Compatibility Note*: Surface tones are calibrated around `#0d1322` / `#1a2234` / `#38bdf8` / `#d4af37` used inside pre-rendered Mermaid SVGs in `site/src/data/mermaid-cache/`.

---

## 3. Typography & Hierarchy

- **Font Stacks (Zero External CDN)**: Offline system editorial serif (`Georgia`, `Noto Serif CJK TC`, `Songti TC`, `serif`), readable UI sans (`system-ui`, `PingFang TC`, `Microsoft JhengHei`, `sans-serif`), and technical monospace (`ui-monospace`, `Menlo`, `Consolas`, `monospace`).
- **Display & Headings**: Tightened tracking (`-0.02em` on H1, `-0.015em` on H2), `text-wrap: balance`, `text-wrap: pretty` on body prose.
- **Monospace Restraint**: Strictly reserved for `LIB-###` call numbers, formal contract badges, code blocks, inline code spans, and topological span identifiers—never for prose track counts or section headings.
- **Numerical Alignment**: `font-variant-numeric: tabular-nums` on step numbers, hall counts, and specification metadata.

---

## 4. Layout, Spacing & Structural Rules

- **Asymmetric Entry & Balanced Wings**:
  - Home recommended showcase highlights `LIB-001` as a horizontal focal lead card above a 3-column row (`LIB-101`, `LIB-405`, `LIB-504`).
  - Ten Knowledge Halls render as a balanced 2-column library wing grid (5 symmetrical rows, zero orphan final card).
- **Reader Viewport Budgets**:
  - Desktop `1440×900` & Mobile `390×844` zero horizontal scroll (`scrollWidth <= clientWidth`).
  - Mobile Reader `開始學習` CTA stays above `720px` and `#lesson-start` opens within `844px`.

---

## 5. Anti-AI-Slop Constraints

1. Zero tracked ALL-CAPS eyebrow labels stacked above content headings.
2. Zero UI Emoji characters across navigation, footer, cards, headings, or controls (`Icon.astro` SVGs only).
3. Zero pulsing/infinite decorative glow animations or generic gradient-text accents.
4. Preserve all Playwright verification hooks, single `<h1>` per page, opposite-language mirror navigation, and read-only integrity of the 56 root Markdown volumes.
