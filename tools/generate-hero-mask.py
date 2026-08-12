"""
Build a soft union-silhouette mask for the hero image sequence.

The frames are opaque photos on pure black, so the canvas paints a black
rectangle that would hide any text placed behind it. Masking the canvas with
this silhouette removes that rectangle and leaves only the subject, so text
underneath is occluded by the boy rather than by a hidden box.

The mask is the union of ALL frames (dilated + blurred) so no pose is ever
clipped as the sequence plays.
"""
import glob, os
import numpy as np
from PIL import Image, ImageFilter

SRC = r"D:\Vizualabs-Projects\Vizualabs-Web_Site\public\Frist-opt"
OUT = r"D:\Vizualabs-Projects\Vizualabs-Web_Site\public\hero-subject-mask.png"

CROP_H = 1813          # same crop the runtime uses
WORK_W = 320           # analyse small; the mask is soft so this is plenty
THRESH = 3.0           # background measures max 3/255, so anything above is subject

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
    if i % 30 == 0:
        print(f"  {i}: coverage {100*m.mean():.1f}%  union {100*acc.mean():.1f}%")

print(f"union coverage: {100*acc.mean():.1f}%")

mask = Image.fromarray((acc * 255).astype(np.uint8), mode="L")

# Close holes (dark hair/shirt interior) then grow slightly so no pose clips.
mask = mask.filter(ImageFilter.MaxFilter(9))   # dilate
mask = mask.filter(ImageFilter.MaxFilter(9))   # dilate again
mask = mask.filter(ImageFilter.MinFilter(5))   # erode back a touch (closing)
mask = mask.filter(ImageFilter.MaxFilter(7))   # final grow

# Upscale, then soften so the silhouette edge blends into the black backdrop.
mask = mask.resize((640, round(640 * CROP_H / 1280)), Image.BILINEAR)
mask = mask.filter(ImageFilter.GaussianBlur(9))

# Push mid-tones up so the interior is solidly opaque, edges stay soft.
arr = np.asarray(mask).astype(np.float32) / 255.0
arr = np.clip(arr * 1.9 - 0.12, 0, 1)
mask = Image.fromarray((arr * 255).astype(np.uint8), mode="L")
mask = mask.filter(ImageFilter.GaussianBlur(4))

# Write the silhouette into the ALPHA channel, not luminance.
#
# CSS `mask-image` defaults to mask-mode: match-source, which for a raster
# image means its alpha channel. A grayscale PNG is fully opaque everywhere,
# so it would mask nothing at all. Encoding the matte as alpha keeps the mask
# working without relying on mask-mode: luminance, which Blink only gained
# support for recently.
a8 = np.asarray(mask).astype(np.uint8)
rgba = np.dstack([
    np.full_like(a8, 255),
    np.full_like(a8, 255),
    np.full_like(a8, 255),
    a8,
])
out = Image.fromarray(rgba, mode="RGBA")
out.save(OUT, optimize=True)
print(f"wrote {OUT}  {out.size}  {os.path.getsize(OUT)/1024:.1f} KB (RGBA, matte in alpha)")
print(f"final: fully-opaque {100*(a8>250).mean():.1f}%  fully-clear {100*(a8<5).mean():.1f}%")
