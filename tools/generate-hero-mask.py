"""
Build a tight union-silhouette mask for the hero image sequence.

The frames are opaque photos on pure black, so the canvas paints a black
rectangle that would hide any text placed behind it. Masking the canvas with
this silhouette removes that rectangle and leaves only the subject, so text
underneath is occluded by the boy rather than by a hidden box.

Two sources are combined:

- BASE — the optimized `public/Frist-opt` WebPs, thresholded at 28/255. Their
  lossy compression raises the black background to ~27, so 28 is the lowest
  threshold that still rejects the noise. This gives the body/legs outline the
  design ships with.

- TRUTH — the ORIGINAL 2160x3840 JPEGs, thresholded at 5/255 (their background
  is clean, max ~1). This correctly captures the boy's genuinely dark hair,
  which the BASE threshold (28) would otherwise cut out as holes.

The final mask is BASE with the dark-hair holes in the HEAD region filled from
TRUTH — nothing else changes, so the body/legs keep their shipped shape.
"""
import glob, os
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

SRC_OPT = os.path.join(ROOT, "public", "Frist-opt")
# Original 2160x3840 JPEGs were removed from the repo to ship only the
# optimized WebPs. Recover them first:
#   git show 4493496:public/Frist/ezgif-frame-001.jpg > ezgif-frame-001.jpg
SRC_ORIG = os.environ.get("HERO_MASK_SRC_ORIG", os.path.join(ROOT, "public", "Frist"))
OUT = os.path.join(ROOT, "public", "hero-subject-mask.png")

CROP_H = 1813
WORK_W = 640
THRESH_BASE = 28.0
THRESH_TRUTH = 5.0
HEAD_TOP = 232          # keep the faint-hair fringe trimmed (no margin above hair)
HEAD_BOTTOM = 360       # only fix the hair/head; leave face+body+legs as BASE


def union(files, loader, thresh):
    acc = None
    for f in files:
        a = np.asarray(loader(f)).astype(np.float32)
        lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
        m = (lum > thresh).astype(np.float32)
        acc = m if acc is None else np.maximum(acc, m)
    return acc


def largest_component(mask):
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


def load_opt(f):
    im = Image.open(f).convert("RGB")
    im = im.crop((0, 0, im.width, CROP_H))
    return im.resize((WORK_W, round(CROP_H * WORK_W / im.width)), Image.BILINEAR)


def load_orig(f):
    im = Image.open(f).convert("RGB").resize((1280, 2276), Image.BILINEAR)
    im = im.crop((0, 0, 1280, CROP_H))
    return im.resize((WORK_W, 906), Image.BILINEAR)


opt_files = sorted(glob.glob(os.path.join(SRC_OPT, "*.webp")))
orig_files = sorted(glob.glob(os.path.join(SRC_ORIG, "*.jpg")) or glob.glob(os.path.join(SRC_ORIG, "*.webp")))
print(f"{len(opt_files)} optimized frames, {len(orig_files)} original frames")

base_acc = union(opt_files, load_opt, THRESH_BASE)
base = Image.fromarray((base_acc * 255).astype(np.uint8), "L")
base = base.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MinFilter(3))
base = np.asarray(base) > 127

truth_acc = union(orig_files, load_orig, THRESH_TRUTH)
truth = largest_component(truth_acc > 0)

holes = truth & ~base
holes[:HEAD_TOP] = False
holes[HEAD_BOTTOM:] = False
final = base | holes

a8 = np.where(final, 255, 0).astype(np.uint8)
rgba = np.dstack([
    np.full_like(a8, 255),
    np.full_like(a8, 255),
    np.full_like(a8, 255),
    a8,
])
out = Image.fromarray(rgba, "RGBA")
out.save(OUT, optimize=True)

ys, xs = np.where(final)
print(f"wrote {OUT}  {out.size}  {os.path.getsize(OUT)/1024:.1f} KB")
print(f"final: opaque {100*(a8>127).mean():.1f}%  bbox x{xs.min()}..{xs.max()} y{ys.min()}..{ys.max()}")
