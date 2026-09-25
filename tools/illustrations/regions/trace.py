"""Step 3 of the region pipeline. Traces the labelled regions that data/regions-map.json
assigns to each colour role (skin, cloth2, prop, shoe, sole, sock, chair) into SVG path
data in pose units, and writes data/regions.json for lib/figure.mjs.

    python3 regions/trace.py
"""
import json, os
import numpy as np, cv2

DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
RASTER = os.path.join(DATA, 'raster')
meta = json.load(open(os.path.join(RASTER, 'meta.json')))
rmap = json.load(open(os.path.join(DATA, 'regions-map.json')))
GROW = 3  # px: tucks each fill under the neighbouring ink line

out = {}
for name, roles in rmap.items():
    m = meta[name]
    S = m['S']
    labels = np.load(os.path.join(RASTER, f'{name}-labels.npy'))
    out[name] = {}
    for role, ids in roles.items():
        if role.startswith('_'):
            continue
        mask = np.isin(labels, ids).astype(np.uint8) * 255
        mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * GROW + 1, 2 * GROW + 1)))
        # `_fillHoles` roles are traced as solid shapes (e.g. a laptop lid without its logo)
        mode = cv2.RETR_EXTERNAL if role in roles.get('_fillHoles', []) else cv2.RETR_CCOMP
        contours, _ = cv2.findContours(mask, mode, cv2.CHAIN_APPROX_NONE)
        d = []
        for c in contours:
            if cv2.contourArea(c) < 12:
                continue
            pts = cv2.approxPolyDP(c, 0.9, True).reshape(-1, 2)
            if len(pts) < 3:
                continue
            d.append('M' + 'L'.join(f'{(x + .5) / S + m["vx"]:.1f} {(y + .5) / S + m["vy"]:.1f}' for x, y in pts) + 'Z')
        out[name][role] = ''.join(d)
json.dump(out, open(os.path.join(DATA, 'regions.json'), 'w'))
print('traced', len(out), 'poses')
