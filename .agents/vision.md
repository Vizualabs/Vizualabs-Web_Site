# Hero Title Marquee — Implementation Blueprint

> **For the primary agent:** this is the complete spec. Implement exactly what is
> written here and nothing more. The user has approved this blueprint.

---

## 1. Mission

Rework the hero heading of the landing page (`/`):

- **"Vizualise"** (line 1) stays **100% static** — unchanged in content,
  position, size, color, and entrance animation.
- **"Your Digital Success"** (line 2) becomes an **infinite, seamless marquee
  that loops right → left** across the screen.
- The scroll-driven image sequence must keep working **exactly** as it does
  today — the marquee must not affect it, compete with it, or be coupled to it.
- The title must **stay pinned and visible for the whole scroll** — the current
  fade-out-on-scroll behavior is removed (user-approved; see §5.3).

## 2. Reference images (what the user showed)

- **Image 1 — TARGET composition:** "Vizualise" sits statically at the top.
  The "Your Digital Success" line is composed *around* the VR boy — words pass
  **behind** his silhouette and re-emerge on the other side. Every word is
  readable; nothing is permanently hidden. Stats card bottom-right, badge pill
  top-center, "Our Approach" bottom-left.
- **Image 2 — CURRENT BUG:** line 2 is static and sits permanently behind the
  boy's head / black silhouette region, so the title reads
  **"Your Di……uccess"** — "Digital" is swallowed by the dark shadow around the
  subject. The heading is broken as static text.

## 3. Root cause

`src/components/hero/HeroTitle.tsx` renders line 2 as fixed text layered
*underneath* the image-sequence canvas. The canvas is masked to the subject's
silhouette (`hero-subject-mask.png`), so the boy permanently occludes the
middle of the static line. Any word that lands behind him stays hidden forever.

**Fix strategy:** keep the under-canvas layering (the Image 1 composition is
text-behind-subject — that is intentional and must be preserved), but make
line 2 **move**. A word passing behind the boy for a moment reads as depth;
a word *stuck* there reads as a bug. Motion is the legibility fix — do not
re-layer the title above the canvas.

## 4. Requirements

- **R1 — "Vizualise" untouched.** Same span, same classes, same reveal
  animation, same position. Do not refactor it.
- **R2 — Line 2 = infinite right→left marquee.** "Your" stays white,
  "Digital Success" keeps the red `#FF5E4D` accent (`hero-title-accent`) and
  its glow animation — on **every** repeated copy. The loop must be seamless:
  no gap, no jump at the wrap point.
- **R3 — Zero coupling with scroll.** The marquee is a **pure CSS keyframe
  animation** (`transform` only) on a dedicated inner track. **No** JS timers,
  **no** React state, **no** scroll listeners, **no** GSAP for the marquee.
- **R4 — Title stays pinned during scroll.** Remove the scroll fade
  (`syncTitleFade`). "Vizualise" + the looping line remain visible through the
  whole 350vh scroll, still layered **under** the silhouette-masked canvas.
  The frame sequence (`readScrollFrame` / `drawFrame`) is untouched.
- **R5 — Never wraps.** The marquee line stays on one line at every viewport
  (`white-space: nowrap`; existing fluid font-size rules stay).
- **R6 — Accessible.** Exactly one accessible copy of the phrase; all duplicate
  copies are `aria-hidden="true"`. Under `prefers-reduced-motion: reduce` the
  marquee collapses to one static, centered phrase.
- **R7 — Nothing else changes.** Blaze fire, BrandIntro, canvas mask, stats
  card, badge pill, "Our Approach", DOM order / z-index / paint order, fonts,
  frame-loading pipeline, other sections and routes — all untouched.

## 5. Implementation spec

### 5.1 `src/components/hero/HeroTitle.tsx`

Line 1 stays byte-for-byte identical. Line 2 becomes:

```tsx
// One phrase unit of the loop. Duplicates are aria-hidden.
function MarqueePhrase({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="hero-marquee-phrase" aria-hidden={hidden || undefined}>
      <span className="text-white">Your </span>
      <span className="hero-title-accent is-in">Digital Success</span>
    </span>
  )
}
```

```tsx
<span className="hero-title-line hero-title-marquee">
  {/* reveal animation stays HERE, on the inner — unchanged behavior */}
  <span
    className={`hero-title-inner ${start ? 'is-in' : ''}`}
    style={{ animationDelay: '130ms' }}
  >
    {/* the marquee transform lives on THIS child track, never on
        .hero-title-inner (its fill-forwards rise would override it) */}
    <span className="hero-marquee-track">
      <span className="hero-marquee-group">
        <MarqueePhrase />
        <MarqueePhrase hidden />
      </span>
      <span className="hero-marquee-group" aria-hidden="true">
        <MarqueePhrase hidden />
        <MarqueePhrase hidden />
      </span>
    </span>
  </span>
</span>
```

Rules that matter:

- Keep the accent-glow conditional exactly as today:
  `className={\`hero-title-accent ${start ? 'is-in' : ''}\`}` (the sketch above
  abbreviates — preserve the `start` gate so the glow still fires on reveal).
- Add `w-full` to the `<h1>` (keep all its existing classes). Without it the
  `width: max-content` track would stretch the h1 to thousands of px and break
  centering of line 1 and the overflow clipping of line 2.
- **2 identical groups × 2 phrases each.** `translateX(-50%)` loops seamlessly
  only if each group is **≥ viewport width** — 2 phrases per group clears every
  breakpoint (390 → 1920 px) with margin. **Verify by measurement** (see §7);
  if any breakpoint shows group width < 100vw, bump to 3 phrases per group.
- The `forwardRef` wrapper can be dropped (nothing writes to the node anymore —
  see §5.3); the component becomes `function HeroTitle({ start }: { start: boolean })`.
  Keep `data-testid="hero-title"` and `aria-hidden={!start}` on the root.

### 5.2 `src/styles.css` (append to the hero-heading block)

```css
/* Line 2 is a full-width marquee strip; .hero-title-line already clips it. */
.hero-title-marquee {
  width: 100%;
}

.hero-marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: hero-marquee-scroll var(--hero-marquee-duration, 22s) linear infinite;
}

.hero-marquee-group {
  display: flex;
  flex-shrink: 0;
}

.hero-marquee-phrase {
  white-space: nowrap;
  /* gap between iterations — inside the group, so it is part of the loop period */
  padding-right: 0.75em;
}

/* Right → left travel: negative X. Do NOT reverse. */
@keyframes hero-marquee-scroll {
  to {
    transform: translateX(-50%);
  }
}
```

Add to the existing `@media (prefers-reduced-motion: reduce)` block:

```css
.hero-marquee-track {
  animation: none;
  width: 100%;
  justify-content: center;
}

.hero-marquee-group + .hero-marquee-group,
.hero-marquee-phrase + .hero-marquee-phrase {
  display: none; /* collapse to one static, centered phrase */
}
```

Do **not** animate `transform` on `.hero-title-inner` for line 2 — its
`hero-title-rise` animation uses `fill: forwards`, which would permanently
override a marquee transform on the same element. Track must stay a child.

### 5.3 `src/components/hero/ScrollHeroSection.tsx` — remove the fade

User-approved change: **the title no longer fades on scroll.**

- Delete the `syncTitleFade` function and **all three call sites**
  (inside the scroll RAF, in `handleResize`, and the initial setup).
- Delete `titleRef`, the `ref={titleRef}` prop on `<HeroTitle>`, and the
  `willChange: 'opacity'` inline style on the title container.
- Delete/rewrite the "Fade the heading out over the first part of the scroll"
  comment block — the heading now persists; the sequence plays behind it.
- The scroll RAF keeps doing frame work only (`readScrollFrame` →
  `findReadyFrame` → `drawFrame`). **Do not touch anything else in this file.**

Result: during the whole 350vh scroll the title stays visible and keeps
looping, the boy's frames play over it, and the silhouette occlusion moves
with the sequence — the marquee never stops, never resets, never reacts to
scroll.

## 6. Test updates — `tests/e2e/landing.spec.ts`

1. **Line ~220 — strict-mode violation:** `.hero-title-accent` now matches
   4 nodes. Change to:
   ```ts
   await expect(title.locator('.hero-title-accent').first()).toHaveText('Digital Success')
   await expect(title.locator('.hero-title-accent')).toHaveCount(4)
   ```
2. **Replace the whole test `'fades out as the sequence takes over'`**
   (lines ~339–360) with `'stays pinned and visible while the sequence plays'`:
   boot, scroll to `0.3 * innerHeight`, `0.8 * innerHeight`, and the bottom of
   `[data-testid="hero-scroll-container"]`; at each stop assert the title's
   computed `opacity` is `1` and `visibility` is `visible`. Also assert
   `(await track.evaluate(el => getComputedStyle(el).animationName))` is
   `'hero-marquee-scroll'`.
3. Optionally add to the heading suite: each `.hero-marquee-group`'s
   `getBoundingClientRect().width` is **≥ `window.innerWidth`** at the same
   five breakpoints used by the unwrap test.
4. **Keep passing unchanged:** two `.hero-title-line` count; line-heights
   unwrap check; layering (title before canvas, no z-index); entrance
   animation settle check (`.hero-title-inner` ends at opacity 1 / identity
   transform — this is why the marquee transform must live on the track).

## 7. Acceptance criteria

1. "Vizualise" is pixel-identical to before and never moves.
2. "Your Digital Success" glides right → left continuously; the wrap point is
   invisible (no jump, no gap) at 390 / 768 / 1280 / 1440 / 1920 px widths.
3. Words pass **behind** the VR boy and re-emerge — matching the Image 1
   composition — and no word is ever statically trapped behind him.
4. Scrolling through the full 350vh: the frame sequence plays exactly as
   before, with zero jank from the marquee (compositor-only transform), and
   the title remains on screen, still looping, the entire time. Scrolling back
   up shows it mid-loop — it never stopped.
5. `prefers-reduced-motion`: one static centered line, no loop.
6. `npx playwright test tests/e2e/landing.spec.ts --reporter=list` is green.

## 8. Guardrails — DO NOT TOUCH

- `Blaze`, `BrandIntro`, `heroFrames.ts`, the frame preload/decode pipeline.
- The canvas silhouette mask (`hero-subject-mask.png`, `--hero-mask-*` vars,
  `syncMaskGeometry`) and the under-canvas layering of the title.
- Stats card, badge pill, "Our Approach", vignette overlay.
- Fluid font-size rules for `.hero-title-type` (they are why the line never
  wraps; the marquee adds `nowrap` as belt-and-braces, not a replacement).
- Anything outside the hero heading + the `syncTitleFade` removal.
