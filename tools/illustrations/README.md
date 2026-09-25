# Illustration build

Builds the site's illustrations into `assets/illustrations/` and the profile placeholder into `assets/teachers/`.

```sh
cd tools/illustrations
npm install
npm run build              # every scene
node build.mjs hero-home   # one scene or spot, by name
```

Node 18 or later. The build needs no browser.

## How a figure is made

1. `export-parts.mjs` reads every Open Peeps piece from `react-peeps` into `data/parts.json` (generated on first use, git-ignored). Each path is either the piece's white fill or its black linework.
2. A pose's single white fill covers skin, clothes and props alike. `data/regions.json` splits it into colour roles (`skin`, `cloth2`, `prop`, `shoe`, `sole`, `sock`, `chair`), traced from the artwork itself.
3. `lib/figure.mjs` stacks the fill in the garment colour, the role regions in their colours, then the original linework on top, followed by hair, face, facial hair and glasses at the offsets Open Peeps uses. `place: { cx, bottom, height }` positions a figure in scene units.
4. `lib/kit.mjs` supplies the Najma star, the Material shapes, speech bubbles, video tiles and small props. `lib/palette.mjs` holds the colours, skin tones and shared motion.

Each scene in `scenes/` returns a complete SVG. `scenes/spots.mjs` exports the card spots as a set.

## Regenerating the colour regions

Only needed when a pose is added or a region assignment changes. It needs Playwright's Chromium and Python 3 with `numpy`, `opencv-python-headless`, `scikit-image` and `Pillow`.

```sh
npm run regions
```

- `regions/render.mjs` measures every piece (`data/bbox.json`) and rasterises the poses listed in `data/regions-map.json` to `data/raster/` (git-ignored).
- `regions/label.py` numbers each enclosed white area and writes a preview, `data/raster/<pose>-labels.png`. Hairline gaps in the linework are closed automatically; `data/barriers.json` closes the few that are wider.
- `data/regions-map.json` assigns those numbers to colour roles. Anything unlisted keeps the garment colour. Check a new pose's preview, then add its entry.
- `regions/trace.py` turns the assigned areas into path data in `data/regions.json`.

The committed `data/regions.json` and `data/bbox.json` are reproduced byte for byte by these steps.

## Conventions

- One ink colour (`INK`) for all linework, so every scene reads as one set.
- Skin tones come from `SKIN`; spread them across each scene.
- Motion stays on `transform` and `opacity`, entrances play once, and loops use a finite iteration count.
- Give every scene a `title` and `desc`. The page supplies the alt text: descriptive for editorial scenes, empty for heroes and spots, which sit beside text that already says the same thing.
