"""
Build a tight union-silhouette mask for the hero image sequence.

The frames are opaque photos on pure black, so the canvas paints a black
rectangle that would hide any text placed behind it. Masking the canvas with
this silhouette removes that rectangle and leaves only the subject, so text
underneath is occluded by the boy rather than by a hidden box.

The mask is the union of ALL frames, closed to fill the subject's genuinely
dark interior (hair/shirt), with only a minimal grow so the silhouette hugs
the subject tightly instead of leaving a black rim around him.
"""
import glob, os
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "public", "Frist-opt")
OUT = os.path.join(ROOT, "public", "hero-subject-mask.png")

CROP_H = 1813          # same crop the runtime uses (1280x1813)
WORK_W = 640           # matches the output width; no upscale, crisp edges
THRESH = 28.0          # optimized WebP frames carry background noise up to ~27/255

files = sorted(glob.glob(os.path.join(SRC, "*.webp")))
print(f"{len(files)} frames")

acc = None
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB")
    im = im.crop((0, 0, im.width, CROP_H))
    im = im.resize((WORK_W, round(CROP_H * WORK_W / im.width)), Image.BILINEAR)
    a = np.asarray(im).astype(np.float32)
    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    m = (lum > THRESH).astype(np.float32)
    acc = m if acc is None else np.maximum(acc, m)

print(f"union coverage: {100*acc.mean():.1f}%")

mask = Image.fromarray((acc * 255).astype(np.uint8), mode="L")

# Close interior holes (dark hair/shirt), then a minimal grow for safety.
mask = mask.filter(ImageFilter.MaxFilter(5))   # dilate (radius 2)
mask = mask.filter(ImageFilter.MinFilter(5))   # erode back (closing)
mask = mask.filter(ImageFilter.MaxFilter(3))   # minimal final grow (radius 1)

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
