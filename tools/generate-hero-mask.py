"""
Build a tight union-silhouette mask for the hero image sequence.

The frames are opaque photos on pure black, so the canvas paints a black
rectangle that would hide any text placed behind it. Masking the canvas with
this silhouette removes that rectangle and leaves only the subject, so text
underneath is occluded by the boy rather than by a hidden box.

The mask is generated from the ORIGINAL 2160x3840 source frames (not the
optimized `public/Frist-opt` WebPs). The WebPs carry lossy-compression noise in
their black background (up to ~27/255), so a luminance threshold can't separate
the boy's dark hair from the noise. The originals have a clean background
(max ~1/255), so a low threshold cleanly captures the full subject including
the dark hair, and a largest-connected-component pass drops the stray bright
vertical line on the right edge.
"""
import glob, os
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# Original 2160x3840 JPEGs. They were removed from the repo to ship only the
# optimized WebPs; recover them first:
#   git show 4493496:public/Frist/ezgif-frame-001.jpg > ezgif-frame-001.jpg
SRC = os.environ.get(
    "HERO_MASK_SRC",
    os.path.join(ROOT, "public", "Frist"),
)
OUT = os.path.join(ROOT, "public", "hero-subject-mask.png")

CROP_H = 1813          # runtime crop: (0,0,1280,1813)
WORK_W = 640           # matches the output width; no upscale, crisp edges
THRESH = 5.0           # original background measures <= 1/255, so this is clean


def largest_component(mask):
    """Keep only the largest 4-connected component (drops the right-edge line)."""
    H, W = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    best = None
    best_size = 0
    for y in range(H):
        for x in range(W):
            if mask[y, x] and not visited[y, x]:
                q = deque([(y, x)])
                visited[y, x] = True
                comp = []
                while q:
                    cy, cx = q.popleft()
                    comp.append((cy, cx))
                    for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not visited[ny, nx]:
                            visited[ny, nx] = True
                            q.append((ny, nx))
                if len(comp) > best_size:
                    best_size = len(comp)
                    best = comp
    out = np.zeros_like(mask, dtype=bool)
    for y, x in best:
        out[y, x] = True
    return out


files = sorted(glob.glob(os.path.join(SRC, "*.jpg")) or glob.glob(os.path.join(SRC, "*.webp")))
print(f"{len(files)} frames")

acc = None
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB")
    if im.width != 1280 or im.height != 2276:
        im = im.resize((1280, 2276), Image.BILINEAR)
    im = im.crop((0, 0, 1280, CROP_H))
    im = im.resize((WORK_W, round(CROP_H * WORK_W / 1280)), Image.BILINEAR)
    a = np.asarray(im).astype(np.float32)
    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    m = (lum > THRESH).astype(np.float32)
    acc = m if acc is None else np.maximum(acc, m)

acc = largest_component(acc > 0)
print(f"union coverage: {100*acc.mean():.1f}%")

mask = Image.fromarray((acc * 255).astype(np.uint8), mode="L")

# Close interior holes (genuinely black hair/shirt) with no net grow, so the
# silhouette hugs the subject with neither a black rim nor a clipped edge.
mask = mask.filter(ImageFilter.MaxFilter(5))   # dilate (radius 2)
mask = mask.filter(ImageFilter.MinFilter(5))   # erode back (closing)

a8 = np.asarray(mask).astype(np.uint8)
a8 = np.where(a8 > 127, 255, 0).astype(np.uint8)  # keep binary

# Write the silhouette into the ALPHA channel, not luminance.
#
# CSS `mask-image` defaults to mask-mode: match-source, which for a raster
# image means its alpha channel. A grayscale PNG is fully opaque everywhere,
# so it would mask nothing at all. Encoding the matte as alpha keeps the mask
# working without relying on mask-mode: luminance, which Blink only gained
# support for recently.
rgba = np.dstack([
    np.full_like(a8, 255),
    np.full_like(a8, 255),
    np.full_like(a8, 255),
    a8,
])
out = Image.fromarray(rgba, mode="RGBA")
out.save(OUT, optimize=True)

ys, xs = np.where(a8 > 127)
bbox = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
print(f"wrote {OUT}  {out.size}  {os.path.getsize(OUT)/1024:.1f} KB (RGBA, matte in alpha)")
print(f"final: opaque {100*(a8>127).mean():.1f}%  clear {100*(a8<=127).mean():.1f}%  bbox x{bbox[0]}..{bbox[2]} y{bbox[1]}..{bbox[3]}")
