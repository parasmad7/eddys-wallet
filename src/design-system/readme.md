# Eddy's Wallet — Design System

A virtual allowance-tracking web app that teaches kids financial literacy — no real money, no bank accounts, no debit cards. This design system is built from the product's PRD and technical architecture (no UI or brand assets existed yet — see **Sources** below), translating "kid-friendly but not childish, with clear parent/child separation" into tokens, components, and three UI kits.

## Sources

- GitHub repo: [`parasmad7/eddys-wallet`](https://github.com/parasmad7/eddys-wallet) — `README.md` (PRD), `docs/architecture.md`, `docs/market-research.md`. The repo has no source code yet; explore it further for the authoritative requirements as the product gets built.
- No Figma file, screenshots, or existing brand assets were provided. Colors, type, mascot, and iconography here are original design decisions made to satisfy the PRD's UX principles (§8) — not extracted from an existing brand.

## Product context

One responsive PWA, two modes gated by a JWT role claim:
- **Parent mode** — email/password login, manages children, deposits/withdraws, configures allowance + interest rates, unlocks loans/credit, views all activity.
- **Kid mode** — family-code + PIN login (no email), read-only-plus-transfer view of the child's own accounts, sets savings goals, watches interest and progress.

Learning progression the product teaches, in order: **Start** (balance) → **Savings** (interest, goals) → **Borrowing** (parent-to-child loans) → **Credit** (revolving simulation). Money is always integer cents; the ledger is immutable.

## Intentional additions

No component inventory existed in the source, so this is an original component set sized to the PRD's screens (accounts, ledger, goals, loans, PIN login, allowance/interest rules). Two components exist purely to serve this brand's "fun and educational" mandate and have no PRD counterpart to point to:
- **EddyTip** — the mascot's teaching callout, used exactly where the PRD calls for introducing a new financial concept.
- **AchievementBadge** — renders the PRD's "financial literacy badges" (§5.10).

## Content fundamentals

- **Voice**: second person, direct to the kid ("You saved $12 this week") or the parent ("You control the pace"). Warm but factual — explains *why*, not just *what* ("Saving means choosing not to spend now").
- **Tone by mode**: kid-mode copy is short, concrete, encouraging, never patronizing ("Nice work! Three weeks in a row."). Parent-mode copy is plain and administrative ("Configure allowance and interest").
- **Numbers over adjectives**: "$3.20 to go" beats "almost there" — concrete amounts motivate kids and the PRD explicitly requires clear currency formatting ($10.50, never $10.5).
- **No emoji as decoration**; a wave (👋) is used once, in a greeting, echoing casual kid-app conventions — not scattered through UI copy.
- **Financial terms are always defined in-line the first time**, in an EddyTip, e.g. "Interest — your savings earn a little extra every month, just for staying put."

## Visual foundations

- **Palette**: Grape (violet-purple, `--grape-500 #7C4DF4`) is the brand hue; Tangerine (`--tang-500 #FF7A1A`) is the celebratory accent, used sparingly (max one per screen — hero CTAs, goal-reached states). Semantic hues carry fixed meaning: **Mint** = money in / savings / growth, **Berry** = money out / debt, **Gold** = interest & rewards, **Sky** = informational. Neutrals ("Ink") are warm violet-tinted greys, never true grey.
- **Type**: Baloo 2 (rounded, heavy display face) for headlines, hero balances, and section titles; Nunito for body copy and UI labels; IBM Plex Mono for the family code. All currency renders in Baloo 2 with tabular numerals — money is never in the body font.
- **Spacing**: 4px base grid, generous by kid-app standards (kid mode applies a `--density:1.15` roominess multiplier vs. parent mode's compact `1`).
- **Backgrounds**: flat brand-tinted surfaces, no photography, no textures/grain. Gradients are used deliberately and only in two places — account balance hero cards (diagonal, meaning-coded by account kind) and mode-colored app headers — never as a decorative page background.
- **Animation**: `--ease-standard` for ordinary UI (buttons, toggles); `--ease-bounce` reserved for celebratory moments — PIN dots, coin-drop, goal-reached, badge-earned. Respects `prefers-reduced-motion`.
- **Hover / press**: hover lifts cards by `-2px` with a deeper shadow; buttons use a solid "chunky" offset shadow (`--shadow-chunky`) that collapses flat and the button nudges down `2px` on press — a physical, tap-like affordance rather than a color shift.
- **Borders & shadows**: 1–2px hairlines in `--border-subtle/default`; all shadows are violet-tinted (never neutral grey black). No inner shadows except form-field focus rings.
- **Corner radii**: rounded throughout — `--radius-lg/xl` cards, full-pill buttons and tags. Kid mode is rounder (`--radius-card: --radius-xl`) than parent mode (`--radius-md`), reinforcing the mode split established by header color.
- **Parent vs. kid separation**: enforced by `data-theme="kid"` / `"parent"` re-pointing the same semantic tokens (deeper grape + squarer radii + denser layout for parent; brighter gradient header + roomier spacing for kid) — see the "Parent vs Kid mode" card in Brand.
- **Transparency/blur**: used only for modal scrims (`rgba(30,26,46,.45)` + blur) and `onBrand`-variant icon buttons sitting on a colored header.
- **Imagery**: none provided or invented — the system uses flat illustration (the mascot) and iconography instead of photography, matching a virtual-money, no-PII product.
- **Cards**: 1px hairline border + soft violet shadow + generous radius; tone variants (`plain/tint/mint/accent/sunken`) carry semantic color washes.

## Iconography

No icon assets existed in the source repo (no code yet), so this system uses **Lucide** (`lucide-static`, CDN-loaded via CSS mask in the `Icon` component) — a clean, consistently 2px-stroke line-icon set that suits "clean, not childish." Icons always inherit `currentColor`. No emoji are used as icons; the one mascot illustration (`assets/eddy-mascot.svg`) and coin-mark logo are the system's only custom art, both flagged as placeholders below.

## Fonts — substitution flagged

**No font files were provided** (the source repo has no code or brand assets). Google Fonts substitutes were chosen to fit "playful, rounded, kid-friendly but not childish": **Baloo 2** (display) + **Nunito** (body) + **IBM Plex Mono** (codes). If Eddy's Wallet has (or commissions) real brand fonts, swap `tokens/fonts.css` and flag it here.

## Logo & mascot — placeholders, please replace

**No logo or mascot exists in the source repo.** `assets/logo.svg`, `assets/logo-mark.svg`, and `assets/eddy-mascot.svg` are original placeholder art (a simple coin mark + a friendly coin-character "Eddy") made to unblock screen design — not a real brand identity. Replace with real brand assets as soon as they exist; do not treat this mascot as final brand direction.

## Index

- `styles.css` — root import list (link this one file).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `themes.css` (parent/kid/dark scopes), `fonts.css`, `base.css`.
- `assets/` — logo, mark, mascot (all placeholders, see above).
- `guidelines/` — foundation specimen cards (Brand, Colors, Type, Spacing groups) shown in the Design System tab.
- `components/core/` — Icon, Button, IconButton, Card, Badge, Tag, SectionHeader.
- `components/forms/` — Input, MoneyInput, Select, Switch, Checkbox, SegmentedControl, PinPad.
- `components/money/` — MoneyAmount, ProgressBar, BalanceCard, TransactionRow, GoalCard, StatTile, LoanCard.
- `components/feedback/` — EddyTip, AchievementBadge, Dialog, Toast, Tooltip, EmptyState.
- `components/navigation/` — AppHeader, TabBar, Tabs, AvatarChip (+ Avatar).
- `ui_kits/kid_app/` — kid-mode PWA on an iPhone frame: login, wallet, goals, history, me.
- `ui_kits/parent_app/` — parent-mode dashboard in a browser frame: family view, child detail (accounts/activity/rules/loans), deposit flow.
- `ui_kits/marketing/` — public landing page.
- `SKILL.md` — portable skill file for use in Claude Code or other agent tooling.

## Caveats & help wanted

1. **No real brand assets exist yet** — logo, mascot, and fonts here are placeholders built to unblock screen design (flagged above). Please share real ones if/when they exist, or tell us to keep iterating on the placeholder mascot concept.
2. **Palette was picked from your grape/tangerine brief**, not extracted from an existing brand — sanity check it against any brand guidelines you have in mind.
3. **Credit-card simulation (Phase 2)** has a components-level LoanCard but no dedicated revolving-balance screen yet — flagged as an empty state in the parent Loans tab.

**Please iterate with us** — tell us which screens to push further (e.g. onboarding/signup flow, badges detail screen, CSV export), whether the mascot direction should change, and whether parent mode should skew even more "data-dense fintech" vs. kid mode's playfulness.
