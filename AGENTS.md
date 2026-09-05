# AGENTS.md — LÉVARO

Guidance for any AI coding agent working in this repository. Read this before touching UI code.

## Project

LÉVARO is a premium/luxury fashion e-commerce site.
Stack: **Next.js (App Router, TypeScript), Tailwind CSS, GSAP + ScrollTrigger, Supabase (`@supabase/ssr`)**. Uses `proxy.ts` instead of `middleware.ts`. No payment gateway — purchases redirect to WhatsApp with a pre-filled message (size, color, product). Auth/login is implemented. Admin dashboard lives under `/admin` in a `(dashboard)` route group.

The storefront must feel like a fashion house that happens to have a store — never a generic e-commerce template wearing a luxury skin. When in doubt, remove UI rather than add it.

---

## Design system

### Colors — four only, no accent color

| Token | Hex | Use |
|---|---|---|
| `near-black` | `#0A0A0A` | Primary dark background (reads as ink, not pure black) |
| `off-white` | `#F5F3EF` | Primary light background (warm, not clinical) |
| `charcoal` | `#1C1C1C` | Mid-tone, section transitions |
| `gray` | `#8C8A85` | Secondary/utility text only |

Never introduce gold, metallics, gradients, glassmorphism, heavy drop shadows, or an accent color. Never add rounded cards by default — corners stay sharp unless a component explicitly calls for a pill shape.

Banned UI patterns: SALE/discount badges, star ratings, review counts, stock-status labels, newsletter signup blocks, generic image-zoom-on-hover (`scale-105`).

### Typography — two families only

- **Display** (headlines, section titles, department/collection names): a tall, condensed grotesque. This carries the brand identity — treat it as an architectural element on the page, not decoration.
- **Utility sans** (nav, labels, prices, metadata): plain, tight-tracked sans, always uppercase, letter-spaced.

No third typeface. No traditional luxury serif as the dominant voice.

### Motion — one signature curve

Every animation in the codebase uses the same easing: `cubic-bezier(0.65, 0, 0.35, 1)`. Define it once (e.g. a shared GSAP default ease or a Tailwind/CSS custom property) and reuse it everywhere — don't let individual components invent their own easing.

Banned: bounce, elastic, back-out, random rotation, particle effects, "everything scales on hover," excessive parallax.

Allowed scale range: **1.0 → 1.04 max**, and only in the hero's entrance reveal. Every other interaction uses opacity, clip-path masks, or position — never scale.

---

## Component architecture

Build sections as self-contained, reusable components:

`Header`, `MenuOverlay`, `Hero`, `NewArrivals`, `ProductRail`, `ProductCard`, `Departments`, `DepartmentItem`, `Collections`, `CollectionItem`, `BrandStory`, `Footer`

Each owns its own GSAP/ScrollTrigger timeline but imports the shared easing curve rather than redefining it.

## Layout rules

- 12-column grid, 24px gutter, 80px outer margin on desktop (1440px reference)
- Minimum 120px vertical rhythm between major sections — a background color change (black ↔ off-white ↔ charcoal) is itself the section transition; don't add a divider on top of it
- Mobile (390px reference) is its own composition, never a scaled-down desktop layout — different image crops, stacked (not side-by-side) department blocks, full-screen (not side-panel) menu overlay

## Content discipline

Priority order when adding anything to the storefront: brand identity → visual impact → typography → photography → motion → product discovery → navigation. The homepage and category pages should intentionally show **less** information than a typical e-commerce site — no SKU, no long descriptions, no secondary CTAs competing with the primary one.

No invented brand history — no founding year, no city of origin, no heritage/craftsmanship claims. Brand copy stays philosophical/abstract (form, movement, material, identity), never biographical.

## Header/nav constraints

No permanent navbar, no permanent sidebar, no visible cart/wishlist/search/account icons in the header. Header is two elements only: wordmark (left) and a `MENU` trigger (right) that opens a full-height overlay — never a persistent dropdown or mega-menu.

## Preloader / Page Loading Curtain Requirement

Every storefront page in this application (e.g. `/`, `/about`, `/shop`, etc.) MUST include `<Preloader />`.
The preloader is **fully functional, not merely decorative**. It actively and strictly waits for:
1. `document.fonts.ready` (all brand typography)
2. `document.readyState === 'complete'` / window load (all stylesheets, scripts, network requests)
3. GPU bitmap decoding (`Image.decode()`) of all critical imagery
The curtain only lifts after the page is 100% loaded and decoded, ensuring zero layout shifts, zero font jumps, and zero image pop-in across the entire site.

## Full reference

The complete section-by-section build spec (hero copy direction, motion timelines, exact measurements, mobile breakpoints) lives in `levaro-homepage-prompt.md`. Treat this file as the binding constraints; that file as the detailed implementation brief.