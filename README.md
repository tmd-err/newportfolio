# Yahya Tamda — Immersive Developer Portfolio

A cinematic, scroll-driven 3D portfolio built with **Next.js 16 (App Router,
Cache Components)**, **React Three Fiber**, **GSAP ScrollTrigger**, and
**Tailwind CSS v4**. Fully trilingual: English, French and Arabic (RTL).

Live: https://tamdayahya.vercel.app

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en, /fr or /ar
npm run build      # production build (Turbopack)
npm run start      # serve the production build
npx tsc --noEmit   # typecheck
npx eslint .       # lint
```

## Architecture

```
app/
  [locale]/            # root layout lives here; sets <html lang> and dir
    layout.tsx         # fonts, header, metadata (hreflang, OG)
    page.tsx           # the scroll journey
    not-found.tsx
    projects/[slug]/   # static project detail pages
  sitemap.ts  robots.ts  globals.css
proxy.ts               # locale detection + redirect (Next 16 "proxy", ex-middleware)

components/
  navigation/          # SiteHeader, LanguageSwitcher, ProgressRail
  sections/            # one component per act (HTML overlay content)
  ui/                  # brand icons (lucide dropped brand icons in v1)
  Reveal.tsx           # IntersectionObserver scroll reveals

features/experience/
  ExperienceLayer.tsx  # client boundary: WebGL probe, GSAP scrub wiring,
                       # pointer/NDC tracking, SPA nav + hover chip,
                       # reduced-motion/low-power detection
  ExperienceCanvas.tsx # the R3F canvas (dynamic import, ssr:false)
  CameraRig.tsx        # per-frame camera, banking, fog/bg color grading
  InteractionRig.tsx   # raycast hover/click for 3D installations
  camera-path.ts       # camera keyframes + color stops (the choreography)
  journey-store.ts     # mutable journey store (no React state per frame)
  props/               # reusable kit: Facility (architecture, robots,
                       # bays), Screens (animated display content)
  worlds/              # ExteriorWorld (glass facade + city), OpsFloorWorld
                       # (server aisles + project bays), DescentWorld
                       # (stairwell void), NucleusWorld (the core)

data/                  # single source of truth: projects, skills, timeline, profile
lib/i18n/              # locales + typed dictionaries (en / fr / ar)
```

### How the journey works

- Each scroll act is a `<section>` whose height is declared in `svh`
  (`SceneSection`). Because heights are viewport-relative, every act owns a
  **fixed fraction of total scroll**, independent of screen size.
- A GSAP `ScrollTrigger` (scrub-smoothed) maps that scroll fraction to
  `journey.progress` (0 → 1).
- `CameraRig` interpolates `CAMERA_KEYS` — position + look-at keyframes —
  every frame, with banking into turns and pointer parallax. The route:
  drone approach across the plaza → sliding glass doors → the AI
  operations floor → a monumental stairwell descent → the underground
  nucleus, revealed from a low upward-looking angle.
- `COLOR_STOPS` cross-fade `scene.background` and fog so each environment
  owns its palette (golden-hour exterior → cool ops floor → deep blue
  descent → the glowing core).
- Project bays register in `journey.interactables`; `InteractionRig`
  raycasts on pointer move (and on scroll so hover tracks a still cursor),
  lighting the bay's accent and showing a DOM chip. Clicking empty space
  while hovering navigates to the project page.
- A custom reticle cursor (`CustomCursor`) replaces the system cursor on
  fine pointers — context states for links and 3D interactables.

### Accessibility & fallbacks

- All real content is semantic HTML **outside** the canvas; the 3D scene is
  decorative (`aria-hidden`, `pointer-events: none`).
- No WebGL → layered CSS aurora fallback, everything still works.
- `prefers-reduced-motion` → instant camera tracking, no parallax, no idle
  animation; reveals become instant.
- No-JS → `.reveal` elements render visible via a `<noscript>` override.

### Performance

- DPR capped (`[1, 1.25]` mobile / `[1, 1.75]` desktop), fewer particles and
  no MSAA below 820px.
- No post-processing chain — emissive materials + fog + CSS vignette/grain.
- Static prerender for every locale and project page (Cache Components).

### Contact form

There is no backend: the form composes a `mailto:` with subject/body
pre-filled and opens the visitor's mail client. This is intentional and
labelled in the UI.

### Content sources

All facts come from `public/assets/infos/tamda_yahya.pdf` and the previous
live site. Nothing is invented. To update content: edit `data/` (structure,
links, stacks) and `lib/i18n/dictionaries/` (localized copy).

## Deployment

Standard Vercel deployment — no env vars required. The CV is served as a
static asset from `public/assets/infos/tamda_yahya.pdf`.
