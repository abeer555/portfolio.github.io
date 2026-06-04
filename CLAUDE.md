# abeer.is-a.dev — portfolio

Personal portfolio of Abeer Gupta. Live at https://abeer.is-a.dev (GitHub Pages, served straight from `main` — push = deploy, no CI).

## Stack

- **No framework, no build step.** Plain HTML + CSS + vanilla ES modules.
- **3D:** Three.js (pinned version, ESM from jsdelivr CDN) — `js/hero3d.js` (hero centerpiece) + `js/bg3d.js` (page background particle field, **desktop only**).
- **Animation:** GSAP + ScrollTrigger (pinned version, ESM from jsdelivr CDN) — `js/scrollfx.js`.
- **Entry point:** `index.html` (all critical CSS inline) + `js/main.js` (deferred module; also owns the custom cursor — fine pointers only — and boot-loader cleanup).
- **Boot loader:** pure CSS 3D cube overlay in `index.html`, self-dismissing at ~1.6s without JS; its headline is intentionally the LCP element. Hidden entirely under reduced motion.
- `js/hero3d.js`, `js/bg3d.js` and `js/scrollfx.js` are **dynamically imported** from `main.js` after first paint, and only when `prefers-reduced-motion` is not set. Never add render-blocking script/CSS for 3D or animation.
- Old design experiments (`style.css`, `script.js`, `*.backup`, `index_mouse.html`, `genericHackerBig.html`, `textAnimationsHacker.html`, `dorksensetouch.html`, `inspiration.html`, `DORKSENSE-README.md`) are intentionally kept but **unused** — don't wire them back in.

## Design system — neobrutalism × terminal

Dark terminal canvas, content in high-contrast blocks. Flat fills only — **no gradients, no glass, no blur**.

### Tokens (defined in `:root` in index.html)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#1a1a1a` | page canvas (subtle #000 grid lines on top) |
| `--panel` | `#111111` | content blocks |
| `--panel-2` | `#0b0b0b` | nested/terminal blocks |
| `--ink` | `#000000` | ALL borders + hard shadows |
| `--green` | `#00ff41` | primary accent (terminal green) |
| `--amber` | `#ffb000` | secondary accent |
| `--red` | `#ff3b3b` | sparing — errors, window dots |
| `--text` | `#ededed` | body text |
| `--dim` | `#a3a3a3` | secondary text (keep ≥ AA contrast on `--panel`) |

### Rules

- Borders: `2px solid var(--ink)` (3–4px for emphasis). Everywhere.
- Shadows: HARD offset, zero blur — `6px 6px 0 var(--ink)` (4px on small elements). On hover the element *presses into* its shadow: `transform: translate(6px, 6px); box-shadow: none`.
- Type: JetBrains Mono only. Headers extra-bold (800), uppercase, blocky.
- Every section header = plain-language label (e.g. `PROJECTS`, black-on-green block) **plus** a command-style string (e.g. `$ ls -la ~/projects/`). Never drop the plain label — recruiters skim.
- Skills are readable tagged chips grouped by category — not hex-dump rows.
- Snappy animations (snap into place, stagger, `power4.out`), not soft fades.

## Performance budget (non-negotiable)

- Lighthouse Performance: **~85+ desktop, ~75+ mobile** with the 3D enabled.
- 3D/animation JS is code-split and dynamically imported; static neobrutalist hero paints first, WebGL hydrates after idle + when in viewport.
- WebGL: mount only when hero is near viewport, pause render loop when offscreen (IntersectionObserver), dispose geometries/materials/renderer on teardown, `devicePixelRatio` capped at 1.75 (1.5 mobile), keep particle counts sane.
- `prefers-reduced-motion: reduce` → fully static page (3D + GSAP modules are never imported).
- Mobile gets simplified 3D (fewer particles, lower DPR cap).

## Always before finishing

Run the build + Lighthouse before finishing: there is no compile step, so "build" = serve the repo root statically (`python3 -m http.server`) and verify the page loads with no console errors; then run Lighthouse (desktop + mobile) and check the budgets above. Report actual numbers, and call out any effect that was simplified or cut to hold the budget.
