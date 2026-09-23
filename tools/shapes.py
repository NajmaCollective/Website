"""Material 3 Expressive shape geometry for Najma.

Every shape is a rounded polygon, normalised so its furthest point sits on the
unit circle and its first point faces straight up. `polar(shape, n)` samples the
outline at n evenly spaced angles, so any two shapes with the same n can be
interpolated point by point. That is what lets CSS morph one into another.
"""
import math

def _norm(x, y):
    d = math.hypot(x, y)
    return (x / d, y / d) if d else (0.0, 0.0)

def rounded_polygon(vertices, radii, steps=48):
    """Replace each vertex with a circular arc tangent to both edges."""
    out = []
    k = len(vertices)
    for i, (px, py) in enumerate(vertices):
        ax, ay = vertices[i - 1]
        bx, by = vertices[(i + 1) % k]
        ux, uy = _norm(ax - px, ay - py)
        vx, vy = _norm(bx - px, by - py)
        cos_t = max(-1.0, min(1.0, ux * vx + uy * vy))
        theta = math.acos(cos_t)
        r = radii[i]
        if r <= 0 or theta < 1e-6 or abs(theta - math.pi) < 1e-6:
            out.append((px, py)); continue
        t = r / math.tan(theta / 2)
        lim = 0.5 * min(math.hypot(ax - px, ay - py), math.hypot(bx - px, by - py))
        if t > lim:
            t = lim; r = t * math.tan(theta / 2)
        t1 = (px + ux * t, py + uy * t)
        t2 = (px + vx * t, py + vy * t)
        bxs, bys = _norm(ux + vx, uy + vy)
        h = r / math.sin(theta / 2)
        cx, cy = px + bxs * h, py + bys * h
        a1 = math.atan2(t1[1] - cy, t1[0] - cx)
        a2 = math.atan2(t2[1] - cy, t2[0] - cx)
        da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi  # short way round
        for s in range(steps + 1):
            a = a1 + da * s / steps
            out.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return out

def star(points, inner, round_outer, round_inner=None, rotate=0.0):
    round_inner = round_outer if round_inner is None else round_inner
    verts, radii = [], []
    for i in range(points * 2):
        a = -math.pi / 2 + rotate + i * math.pi / points
        rad = 1.0 if i % 2 == 0 else inner
        verts.append((rad * math.cos(a), rad * math.sin(a)))
        radii.append(round_outer if i % 2 == 0 else round_inner)
    return rounded_polygon(verts, radii)

def regular(sides, rounding, rotate=0.0):
    verts = [(math.cos(-math.pi / 2 + rotate + i * 2 * math.pi / sides),
              math.sin(-math.pi / 2 + rotate + i * 2 * math.pi / sides)) for i in range(sides)]
    return rounded_polygon(verts, [rounding] * sides)

def circle():
    return [(math.cos(-math.pi / 2 + i * 2 * math.pi / 720), math.sin(-math.pi / 2 + i * 2 * math.pi / 720)) for i in range(720)]

def normalise(pts):
    m = max(math.hypot(x, y) for x, y in pts)
    return [(x / m, y / m) for x, y in pts]

def densify(pts, max_seg=0.01):
    out = []
    for i, (x0, y0) in enumerate(pts):
        x1, y1 = pts[(i + 1) % len(pts)]
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / max_seg))
        for s in range(n):
            out.append((x0 + (x1 - x0) * s / n, y0 + (y1 - y0) * s / n))
    return out

def polar(pts, n):
    """Radius of the outline at n angles, starting at the top, clockwise on screen."""
    dense = densify(normalise(pts))
    samples = sorted(((math.atan2(y, x) + math.pi / 2) % (2 * math.pi), math.hypot(x, y)) for x, y in dense)
    angs = [a for a, _ in samples]; rads = [r for _, r in samples]
    import bisect
    res = []
    for i in range(n):
        a = i * 2 * math.pi / n
        j = bisect.bisect_left(angs, a)
        a0, r0 = (angs[j - 1], rads[j - 1]) if j > 0 else (angs[-1] - 2 * math.pi, rads[-1])
        a1, r1 = (angs[j], rads[j]) if j < len(angs) else (angs[0] + 2 * math.pi, rads[0])
        f = 0 if a1 == a0 else (a - a0) / (a1 - a0)
        res.append((a, r0 + (r1 - r0) * f))
    return res

def svg_path(pts, cx, cy, scale, prec=2):
    pts = normalise(pts)
    f = lambda v: f"{v:.{prec}f}".rstrip('0').rstrip('.')
    d = "M" + " L".join(f"{f(cx + x * scale)} {f(cy + y * scale)}" for x, y in pts[::2]) + "Z"
    return d

def lobed(n, depth, power, rotate=0.0):
    """Scalloped outline. power < 1 gives round lobes with crisp notches
    (Material cookies and clovers); power > 1 gives soft points (Sunny, Burst)."""
    pts = []
    for i in range(1440):
        a = i * 2 * math.pi / 1440
        g = (1 + math.cos(n * (a - rotate))) / 2
        r = 1 - depth * (1 - g ** power)
        pts.append((r * math.sin(a), -r * math.cos(a)))
    return pts

# The Najma shape set. Names follow the Material 3 Expressive shape library.
SHAPES = {
    'circle':    circle(),
    'sunny':     star(8, 0.78, 0.25, 0.30),
    'verysunny': star(8, 0.66, 0.20, 0.20),
    'star':      star(8, 0.60, 0.11, 0.04),       # Najma's own star, as drawn in the logo
    'cookie4':   lobed(4, 0.13, 0.55),
    'cookie6':   lobed(6, 0.11, 0.55),
    'cookie9':   lobed(9, 0.09, 0.55),
    'cookie12':  lobed(12, 0.075, 0.55),
    'clover4':   lobed(4, 0.46, 0.42),
    'clover8':   lobed(8, 0.30, 0.50),
    'softburst': lobed(12, 0.17, 1.9),
    'pentagon':  regular(5, 0.40),
}

def rounded_path(vertices, radii, cx=0.0, cy=0.0, scale=1.0, prec=2):
    """Exact SVG path (lines + arcs) for a rounded polygon. Compact enough for logos."""
    f = lambda v: f"{v:.{prec}f}".rstrip('0').rstrip('.') or '0'
    k = len(vertices)
    segs = []
    for i, (px, py) in enumerate(vertices):
        ax, ay = vertices[i - 1]; bx, by = vertices[(i + 1) % k]
        ux, uy = _norm(ax - px, ay - py); vx, vy = _norm(bx - px, by - py)
        theta = math.acos(max(-1.0, min(1.0, ux * vx + uy * vy)))
        r = radii[i]
        t = r / math.tan(theta / 2)
        lim = 0.5 * min(math.hypot(ax - px, ay - py), math.hypot(bx - px, by - py))
        if t > lim:
            t = lim; r = t * math.tan(theta / 2)
        t1 = (px + ux * t, py + uy * t); t2 = (px + vx * t, py + vy * t)
        # sweep: convex corners turn clockwise (screen), reflex corners anticlockwise
        cross = (px - ax) * (by - py) - (py - ay) * (bx - px)
        sweep = 1 if cross > 0 else 0
        segs.append((t1, t2, r, sweep))
    T = lambda p: (cx + p[0] * scale, cy + p[1] * scale)
    s = segs[0][0]
    d = [f"M{f(T(s)[0])} {f(T(s)[1])}"]
    for i, (t1, t2, r, sweep) in enumerate(segs):
        if i > 0:
            d.append(f"L{f(T(t1)[0])} {f(T(t1)[1])}")
        d.append(f"A{f(r * scale)} {f(r * scale)} 0 0 {sweep} {f(T(t2)[0])} {f(T(t2)[1])}")
    return ''.join(d) + 'Z'

def star_vertices(points, inner, rotate=0.0):
    v = []
    for i in range(points * 2):
        a = -math.pi / 2 + rotate + i * math.pi / points
        rad = 1.0 if i % 2 == 0 else inner
        v.append((rad * math.cos(a), rad * math.sin(a)))
    return v
