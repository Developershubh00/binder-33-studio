# Star Globe on the Hero

Add a 3D rotating globe to the right side of the hero section. Continents are rendered as fields of small glowing dots ("stars") positioned so that, in aggregate, they form the shapes of the world's landmasses — matching the reference image. The globe is large and cropped by the right edge so only ~3/4 of it is visible.

## Look & behavior
- Dark hero background (unchanged). Globe dots are white/silver glowing points, consistent with the existing white particle aesthetic of the hero.
- Faint latitude/longitude grid lines on the sphere for depth (thin, low opacity), like the reference.
- Continuous slow rotation around the vertical (Y) axis. Backface dots are dimmed/hidden so it reads as a real sphere.
- Respect `prefers-reduced-motion`: render a single static frame, no rotation.
- Subtle parallax/tilt on mouse move (optional, light) to add life.

## Placement
- Positioned absolutely on the right half of the hero, vertically centered, sized large and shifted right so it bleeds off the right edge (quarter/three-quarter visible).
- Sits behind the headline text (lower z-index than the text block), so copy stays readable on the left.
- On mobile, scaled down / pushed further off-screen or hidden to avoid clutter.

## How continents are built from dots
- Use an equirectangular world land mask (a small black/white world map where white = land) loaded at runtime onto an offscreen canvas.
- Sample the mask on a grid of latitude/longitude points; keep a point only where it falls on land. This yields evenly-spaced dots that trace continent shapes.
- Convert each kept (lat, lon) to 3D sphere coordinates, rotate by the current animation angle, project to 2D, and draw as a glowing dot. Dot opacity/size scales with depth (z), and points on the far hemisphere are culled or strongly dimmed.

## Technical details
- New component `src/components/StarGlobeCanvas.tsx` — HTML5 Canvas + TypeScript, DPR-scaled, `requestAnimationFrame` loop, same structural pattern as `BindingHeroCanvas.tsx` (resize handler, cleanup, reduced-motion guard).
- World mask asset added under `src/assets/` (a compact equirectangular land map) and imported as an ES module; sampled once on load, then cached as an array of `{lat, lon}` points.
- Sphere math: lat/lon → unit vector, Y-axis rotation, perspective projection (reuse the `project`/rotate approach already in the codebase).
- Integrate into `src/components/Hero.tsx`: render `<StarGlobeCanvas />` inside the hero `<section>`, absolutely positioned right, below the text container in stacking order. No changes to copy or other sections.

## Out of scope
- No backend, no new routes, no changes to other sections.

```text
[ hero section ]
  ┌───────────────────────────────────────┐
  │  We Build Things            ✦ ✦ ✦      │
  │  That Work               ✦  star  ✦  ✦ │  <- globe bleeds
  │  (subtext, CTA)         ✦  globe   ✦ ✦ │     off right edge
  │                            ✦ ✦ ✦       │
  └───────────────────────────────────────┘
```
