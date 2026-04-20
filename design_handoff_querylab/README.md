# Handoff: QueryLab — Landing page & /analyze redesign

## Overview
A minimalist frontend for the SQL Query Analyzer project (QueryLab). Covers two
pages:

- **Landing / Dashboard** (`/`) — editorial hero, schematic preview, 4-cell module grid. Alternate "Terminal" hero available.
- **Analyzer** (`/analyze`) — editor card with gutter + tinted SQL, 4-metric bar, tabbed output (Results table, Plan tree, Suggestions).

Both pages share a sidebar, topbar, and a new dark-mode toggle.

## About the Design Files
The file `QueryLab.html` in this folder is a **design reference** — a standalone
React + Babel prototype showing intended look, layout, and behaviour. It is not
production code to copy verbatim.

Your target codebase already exists at `client/` — a **Next.js 15 + Tailwind v4 + shadcn/ui** app. Recreate these designs there using the existing component patterns (shadcn `Card`, `Button`, `Badge`, `Tabs`, `Separator`, `Kbd`, etc.) and existing CSS tokens in `client/src/app/globals.css`. Do not ship the HTML.

## Fidelity
**High-fidelity.** Final colours, typography, spacing, and interaction states. Recreate pixel-perfectly using the codebase's existing primitives.

## Design tokens (already present in `globals.css`, plus a few additions)

### Colors — OKLCH, matching existing theme
| Token | Light | Dark |
|---|---|---|
| `--background` | `oklch(0.992 0 0)` | `oklch(0.155 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.97 0 0)` |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--muted` | `oklch(0.968 0 0)` | `oklch(0.245 0 0)` |
| `--muted-foreground` | `oklch(0.52 0 0)` | `oklch(0.68 0 0)` |
| `--border` | `oklch(0.918 0 0)` | `oklch(0.30 0 0)` |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.92 0 0)` |
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.175 0 0)` |
| `--sidebar-accent` (active row) | `oklch(0.955 0 0)` | `oklch(0.27 0 0)` |

Severity palette (used in plan tree + suggestions):
- **Accent / success:** `oklch(0.70 0.14 150)` light, `oklch(0.78 0.16 150)` dark
- **Warn:** `oklch(0.75 0.14 70)` light, `oklch(0.82 0.15 75)` dark
- **Danger:** `oklch(0.63 0.19 25)` light, `oklch(0.72 0.18 25)` dark

### Type
- UI: `Inter` (400 / 500 / 600 / 700), font features `"cv11","ss01","ss03"`
- Mono / numbers / SQL: `JetBrains Mono` (400 / 500 / 600)
- Headline display: Inter 500, letter-spacing `-0.035em`, line-height `1.02`

### Radius, borders, shadow
- Radius: `10px` (`--radius`). Use shadcn's derived sizes as-is.
- Borders: 1px hairline. No heavy shadows. Hover shadow on cards: `0 2px 10px rgba(0,0,0,.05)`.
- Dot indicator for "live": 6px circle, 3px halo via `box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)`.

### Spacing cues
- Sidebar width: 232–240px (current is 240, either fine)
- Topbar height: 56px (`h-14`)
- Main padding: `px-10 py-6` on wide screens
- Card header padding: `p-3 px-4`
- Grid gap inside content: `gap-3` (12px)

---

## Screens

### 1. Landing page (`/` — replaces current `DashboardPage`)

**Goal:** replace the "Stats strip with em-dashes + 4 module cards" pattern with a cleaner editorial landing.

**Layout** — single column, `max-width: 960px`, centered.
1. **Eyebrow** — `text-[11px] uppercase tracking-[.14em]` in muted, prefixed by an 18px hairline divider. Content: `Postgres workbench · v0.1`
2. **Headline** — `text-[56px] leading-[1.02] tracking-[-.035em] font-medium`, `max-w-[780px]`, `text-wrap: balance`.
   Copy: *"Read a query's `EXPLAIN` like prose. Then fix it."*
   Note: the word `EXPLAIN` is set in JetBrains Mono (italic-less, `font-weight: 400`). "Then fix it." is in `text-muted-foreground`.
3. **Sub-paragraph** — 15px, line-height 1.6, `max-w-[560px]`, muted.
   Copy: *"QueryLab is a quiet workbench for SQL. Run a statement against your read-only role, see the plan tree, the costs, the bottlenecks — and a short list of things worth changing."*
4. **Single CTA** — primary button "Open Analyzer" → `/analyze`, with a trailing arrow icon. No secondary CTA.
5. **Preview strip** — 1px bordered rounded container showing two columns:
   - Left: static SQL snippet with line numbers (columns `1` through `6`), syntax-tinted keywords in `#4b5563` (light) / `oklch(0.72 0 0)` (dark).
   - Right: mini plan tree — 4 rows, each with a 2px colored bar (severity), node type, tag pill (warning/indexed), and a right-aligned mono cost.
   - Top strip: `EXPLAIN (ANALYZE, FORMAT JSON)` in mono + right-aligned `42.18 ms`.
6. **Modules grid** — 4 equal columns separated by 1px dividers (use `gap-px` on a `bg-border` wrapper), each cell 148px min-height.
   - Cell content: mono number label (`01`, `02`, `03`, `04`) → bold title → muted 1-sentence description → availability tag (emerald dot + "Available" for Analyzer, muted "Soon" for the others).
   - Modules: **01 Analyzer**, **02 Benchmark**, **03 Compare**, **04 History**.
7. **Footer pellets** — 3 mono labels separated by 3px dots: `postgres 14 / 15 / 16 · node · fastify · prisma · readonly role enforced`.

**Remove** from existing `page.tsx`: the `STATS` block, the decorative icon-in-rounded-square pattern on cards, and the "awaiting history service" filler copy.

### 2. Analyzer (`/analyze`)

Keep the component tree from `components/analyzer/*`, but adjust these specifics:

#### Editor card
- Header: 30×30 muted-background icon square with the `Terminal` lucide icon, then title + subtitle stack.
- Right side, in order: `⌘↵ run` kbd hint, "Clear" ghost button (Eraser icon), vertical separator, "Analyze" outline button (Sparkles icon), "Run" primary button (Play icon).
- Editor body: split in two with a 1px vertical separator — left gutter 38px wide (`oklch(0.99 0 0)` light / `oklch(0.185 0 0)` dark, right-aligned line numbers in mono), right-side SQL editor with tokenized keywords.

#### Metrics bar
- 4 equal cells separated by 1px dividers (same `gap-px` trick as landing modules).
- Per cell: uppercase label (`text-[10px] tracking-[.14em]`), then value in mono 22px/600, then unit in mono 11px muted.
- Cell 1 (Execution): show small emerald `fast` tag on the right of the value when the query is fast.

#### Tabs
- Segmented control, not underline — `inline-flex` with `bg-muted` container, 2px padding, 6px inner radius. Active tab: `bg-card`, shadow `0 1px 2px rgba(0,0,0,.04)`.
- Tab labels: `Results` (badge = row count), `Execution Plan` (no badge; live dot when plan present), `Suggestions` (badge = count).
- To the right of the tabs: mono `status · time` indicator (`idle` / `running…` / `42.18 ms`).

#### Results table
- Column headers: uppercase `text-[10.5px] tracking-[.12em]`, muted. Type annotation to the right of the column name in mono (`int`, `text`, `timestamp`) using `--border-strong` colour.
- Rows: 1px bottom dividers, 9px × 14px padding, mono cells. Zero values (`0`) rendered in muted foreground.
- Footer row: `Showing 7 of 2,418 rows` on the left, `42.18 ms · 312 buffers` in mono on the right.

#### Plan tree
Match the existing `plan-tree.tsx` but standardise severity colours to the palette above, and:
- Each node: rounded 10px card, 1px border, **3px full-height accent bar on the left** (rounded right edge) coloured per severity.
- Header line: chevron → 6px severity dot → node type (semibold) → `on <relation>` / `using <index>` in mono-muted → right-aligned tag pill.
- Tag pill background: `oklch(0.97 0.03 80)` for warning, `oklch(0.96 0.03 150)` for indexed. Dark mode: `color-mix(in oklab, <tag fg> 20%, var(--card))`.
- Stats grid below: 4 columns — Cost / Est. Rows / Actual Rows / Time (ms), indented 30px to align under the node name.
- Conditions block (when present): 2-column — uppercase 44px label + `code` chip (`bg-muted`, 4px radius, mono 11.5px).

#### Suggestions
- List, not cards. 14px gap between severity dot and content. Bottom 1px divider between items.
- Title (semibold 13px) + inline uppercase category pill (Performance / Readability / High risk).
- Body paragraph in muted, `text-wrap: pretty`.
- If the suggestion ships an SQL snippet: mono code chip + "Copy" ghost button.

### 3. Sidebar — fix the active-state contrast bug
Current code uses `bg-sidebar-accent` but the inline style hard-codes the text inside the link. In dark mode the active row becomes white-on-white.

Fix: active row should use `--sidebar-accent` for background and `--sidebar-accent-foreground` for text. Remove any inline color on the child `<span>` that contains the icon + label (it is currently forcing a fixed grey that becomes invisible in dark mode).

### 4. Topbar — dark-mode toggle (new)
Add a 30×30 square icon button to the right cluster, after the version number. Border `1px solid var(--border)`, radius 8px, muted icon colour, no fill. Hover: `bg-muted`, `text-foreground`, `border-color: var(--border-strong)`.

Icons (from lucide): `<Moon/>` when light, `<Sun/>` when dark (14px).

Behaviour:
- On mount, read `localStorage.querylab_theme`. Fallback to `prefers-color-scheme`.
- Toggle adds/removes `.dark` on `<html>`, persists to localStorage.
- Use `next-themes` if preferred — the class-based approach in `globals.css` already supports `.dark` selectors.

---

## Interactions & behaviour

- **Page navigation** — standard Next.js `<Link>` between `/` and `/analyze`. Sidebar highlights the active route.
- **Run / Analyze** — unchanged from existing `analyzer-workbench.tsx`. Keyboard: `⌘↵` runs, `⌘⇧↵` analyzes. Tab auto-switches to Results (run) or Plan (analyze).
- **Plan tree expand/collapse** — each node starts `open`, chevron toggles children. Line rendering: children sit under a 1px left rail `bg-border` at `padding-left: 20px; margin-left: 10px`.
- **Theme toggle** — instant class swap, no transition animation on colours (avoids flashing).
- **Card hover** — 1px border darkens to `var(--border-strong)`, optional subtle shadow. No transform / lift.

## State management
No new state beyond what the existing `useQueryStore` provides. Add:
- `theme: 'light' | 'dark'` — handled by `next-themes` or a thin `useEffect`.
- Everything else uses the existing TanStack Query mutation in `analyzer-workbench.tsx`.

## Assets
- Icons: lucide-react (already in the codebase) — `Database`, `Terminal`, `Gauge`, `GitCompareArrows`, `History`, `BookOpen`, `ArrowRight`, `Play`, `Sparkles`, `Eraser`, `ChevronDown`, `ChevronRight`, `Zap`, `Search`, `Moon`, `Sun`.
- Fonts: Inter + JetBrains Mono, both already imported via `globals.css`. No new assets.

## Files to reference in the codebase
- `client/src/app/page.tsx` — rewrite as the new landing per "Screens → 1".
- `client/src/app/analyze/page.tsx` — unchanged wrapper.
- `client/src/components/analyzer/analyzer-workbench.tsx` — adjust tab style, metrics bar, editor header buttons.
- `client/src/components/analyzer/plan-tree.tsx` — confirm severity palette + 3px accent bar pattern.
- `client/src/components/analyzer/results-table.tsx` — add type annotations to column headers; footer row.
- `client/src/components/analyzer/suggestions-panel.tsx` — list style (not cards), copy button on SQL snippets.
- `client/src/components/layout/sidebar.tsx` — fix active-row dark-mode contrast.
- `client/src/components/layout/topbar.tsx` — add theme toggle button.
- `client/src/app/globals.css` — add the severity colour tokens above; dark-mode sidebar active already declared but confirm values match.

## Acceptance checklist
- [ ] Landing has 1 hero, 1 CTA, 1 preview, 1 module grid, 1 footer pellet row. No stats with em-dashes.
- [ ] Analyzer tabs are segmented (not underlined). Active tab has card background.
- [ ] Plan tree nodes have a 3px coloured accent bar on the left.
- [ ] Dark mode is togglable from the topbar and persisted.
- [ ] Sidebar active row is legible in both themes.
- [ ] All text sized per tokens above; no hard-coded px sizes outside these ranges.
