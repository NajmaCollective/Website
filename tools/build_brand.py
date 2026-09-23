"""Builds Najma's logo files from Roboto Flex and the shape set.

Run from the repo root:  python3 tools/build_brand.py path/to/RobotoFlex.ttf
Writes assets/brand/*.svg.
"""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shapes import star, lobed, normalise, rounded_path, star_vertices
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FOREST, MINT, TERRACOTTA, SAGE = '#315d4b', '#c5ebd6', '#82533e', '#dce6cc'
DEEP, INV_PRIMARY, PEACH = '#203e32', '#b0d9bd', '#ffdbc9'

def fmt(v):
    return f"{v:.2f}".rstrip('0').rstrip('.')

def path_from_points(pts, cx, cy, r):
    pts = normalise(pts)
    step = max(1, len(pts) // 480)
    return "M" + "L".join(f"{fmt(cx + x * r)} {fmt(cy + y * r)}" for x, y in pts[::step]) + "Z"

# ---- Mark geometry -------------------------------------------------------
# A Material "Cookie" container holding Najma's eight-pointed star.
# Container: a twelve-lobed Material cookie. Star: eight points, rounded tips.
CONTAINER = (star_vertices(12, 0.90), [0.16, 0.02] * 12)
STAR = (star_vertices(8, 0.60), [0.11, 0.04] * 8)
STAR_SCALE = 0.66

def star_d(cx, cy, r):
    v = STAR[0]; m = max(math.hypot(x, y) for x, y in v)
    return rounded_path(v, STAR[1], cx, cy, r)

def mark_svg(size=48, bg=MINT, fg=FOREST, standalone=True):
    c = size / 2
    body = (f'<path fill="{bg}" d="{rounded_path(CONTAINER[0], CONTAINER[1], c, c, c)}"/>'
            f'<path class="najma-star" fill="{fg}" d="{star_d(c, c, c * STAR_SCALE)}"/>')
    if not standalone:
        return body
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">{body}</svg>'

# ---- Wordmark ------------------------------------------------------------
def wordmark_paths(font_path, text='Najma', loc=None, tracking=-18):
    loc = loc or {'wght': 640, 'wdth': 104, 'opsz': 72, 'YTLC': 530, 'GRAD': 0}
    vf = TTFont(font_path)
    font = instantiateVariableFont(vf, loc)
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font['head'].unitsPerEm
    x = 0
    parts, tittle = [], None
    for ch in text:
        gname = cmap[ord(ch)]
        glyph = gs[gname]
        rec = RecordingPen(); glyph.draw(rec)
        # Split into contours so the dot on the j can be swapped for a star.
        contours, cur = [], []
        for op, args in rec.value:
            cur.append((op, args))
            if op in ('closePath', 'endPath'):
                contours.append(cur); cur = []
        keep = contours
        if ch == 'j':
            def top(c):
                ys = [p[1] for op, a in c for p in a]
                return min(ys) if ys else 0
            dot = max(contours, key=top)
            keep = [c for c in contours if c is not dot]
            bp = BoundsPen(gs)
            for op, a in dot: getattr(bp, op)(*a)
            xmin, ymin, xmax, ymax = bp.bounds
            tittle = (x + (xmin + xmax) / 2, (ymin + ymax) / 2, (xmax - xmin))
        pen = SVGPathPen(gs, ntos=lambda n: str(round(n)))
        tp = TransformPen(pen, (1, 0, 0, -1, x, 0))
        for c in keep:
            for op, a in c: getattr(tp, op)(*a)
        parts.append(pen.getCommands())
        x += glyph.width + tracking
    ascent = font['hhea'].ascent
    capH = getattr(font['OS/2'], 'sCapHeight', 712)
    return ' '.join(parts), x - tracking, capH, tittle, upm

def build(font_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    d, width, capH, (tx, ty, tw), upm = wordmark_paths(font_path)
    # Coordinates are font units with baseline at y=0; flip y for the star.
    star_r = tw * 0.86
    tstar = star_d(tx, -ty, star_r)
    pad = 20
    top = capH + pad + 40
    vb_w = width + pad * 2
    vb_h = top + 240  # room for the j descender
    def wordmark(fg=FOREST, accent=TERRACOTTA):
        return (f'<g transform="translate({pad} {top})"><path fill="{fg}" d="{d}"/>'
                f'<path class="najma-tittle" fill="{accent}" d="{tstar}"/></g>')
    wm = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(vb_w)} {fmt(vb_h)}" role="img" aria-label="Najma">{wordmark()}</svg>'
    open(os.path.join(out_dir, 'najma-wordmark.svg'), 'w').write(wm)
    wm_rev = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(vb_w)} {fmt(vb_h)}" role="img" aria-label="Najma">{wordmark("#f0f6eb", PEACH)}</svg>'
    open(os.path.join(out_dir, 'najma-wordmark-reverse.svg'), 'w').write(wm_rev)
    # Lockup: the mark sized to the cap height plus a little, centred on the x-height band.
    m = capH * 1.42
    gap = m * 0.24
    lock_w = m + gap + vb_w
    lock_h = max(m, vb_h)
    my = top - capH / 2 - m / 2 - 8
    def lockup(bg, fg, wfg, acc):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {fmt(my - 10)} {fmt(lock_w)} {fmt(vb_h - my + 10)}" role="img" aria-label="Najma">'
                f'<g transform="translate(0 {fmt(my)}) scale({fmt(m / 48)})">{mark_svg(48, bg, fg, False)}</g>'
                f'<g transform="translate({fmt(m + gap - pad)} 0)">{wordmark(wfg, acc)}</g></svg>')
    open(os.path.join(out_dir, 'najma-logo.svg'), 'w').write(lockup(MINT, FOREST, FOREST, TERRACOTTA))
    open(os.path.join(out_dir, 'najma-logo-reverse.svg'), 'w').write(lockup(INV_PRIMARY, DEEP, '#f0f6eb', PEACH))
    open(os.path.join(out_dir, 'najma-mark.svg'), 'w').write(mark_svg(48))
    open(os.path.join(out_dir, 'najma-mark-reverse.svg'), 'w').write(mark_svg(48, INV_PRIMARY, DEEP))
    fav = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="{MINT}" d="{rounded_path(CONTAINER[0], CONTAINER[1], 24, 24, 24)}"/>'
           f'<path fill="{FOREST}" d="{star_d(24, 24, 24 * 0.76)}"/></svg>')
    open(os.path.join(out_dir, 'favicon.svg'), 'w').write(fav)
    return {'wordmark_viewbox': (vb_w, vb_h)}

if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    info = build(sys.argv[1], os.path.join(root, 'assets', 'brand'))
    print('wordmark viewBox', info['wordmark_viewbox'])
