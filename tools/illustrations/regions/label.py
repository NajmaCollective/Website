"""Step 2 of the region pipeline. Labels the enclosed white areas of each rasterised pose.

Hand-drawn linework has hairline gaps, so the ink is dilated before labelling (closing
the gaps), then the labels are grown back over every white pixel. Straight 'barrier'
lines from data/barriers.json (in pose units) close the few gaps too wide for that.
Writes data/raster/<pose>-labels.npy and a numbered preview, <pose>-labels.png, which is
what data/regions-map.json refers to when it assigns region numbers to colour roles.

    python3 regions/label.py [pose ...]      # default: every pose in regions-map.json
"""
import json, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from skimage.segmentation import expand_labels

DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
RASTER = os.path.join(DATA, 'raster')
K = 5  # px of gap closing at 1.25 px per pose unit
barriers = json.load(open(os.path.join(DATA, 'barriers.json')))
meta = json.load(open(os.path.join(RASTER, 'meta.json')))
names = sys.argv[1:] or list(json.load(open(os.path.join(DATA, 'regions-map.json'))))
font = ImageFont.load_default(size=24)

for name in names:
    im = np.array(Image.open(os.path.join(RASTER, f'{name}.png')).convert('RGBA'))
    alpha = im[..., 3] > 127
    ink = (alpha & (im[..., :3].mean(axis=2) <= 127)).astype(np.uint8)
    m = meta[name]
    px = lambda x, y: (int(round((x - m['vx']) * m['S'])), int(round((y - m['vy']) * m['S'])))
    for x1, y1, x2, y2 in barriers.get(name, []):
        cv2.line(ink, px(x1, y1), px(x2, y2), 1, 5)
    white = (alpha & (ink == 0)).astype(np.uint8)
    closed = cv2.dilate(ink, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * K + 1, 2 * K + 1)))
    core = (white & (closed == 0)).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(core, connectivity=4)
    keep = sorted((i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] >= 40), key=lambda i: -stats[i, cv2.CC_STAT_AREA])
    remap = np.zeros(n, np.int32)
    for k, i in enumerate(keep, 1):
        remap[i] = k
    labels = expand_labels(remap[lab], distance=K + 3) * white
    np.save(os.path.join(RASTER, f'{name}-labels.npy'), labels.astype(np.int16))

    palette = np.random.default_rng(3).integers(70, 235, size=(len(keep) + 1, 3)).astype(np.uint8)
    vis = np.full(im.shape[:2] + (3,), 245, np.uint8)
    vis[alpha] = 30
    for k in range(1, len(keep) + 1):
        vis[labels == k] = palette[k]
    preview = Image.fromarray(vis)
    draw = ImageDraw.Draw(preview)
    for k in range(1, len(keep) + 1):
        mask = (labels == k).astype(np.uint8)
        if not mask.any():
            continue
        dist = cv2.distanceTransform(mask, cv2.DIST_L2, 3)
        y, x = np.unravel_index(np.argmax(dist), dist.shape)
        draw.ellipse([x - 16, y - 16, x + 16, y + 16], fill=(255, 255, 255), outline=(0, 0, 0))
        draw.text((x, y), str(k), fill=(0, 0, 0), anchor='mm', font=font)
    preview.save(os.path.join(RASTER, f'{name}-labels.png'))
    print(name, 'regions:', len(keep))
