# Najma · Material 3 design

The site uses Google Material Web 2.4.1 as its only UI component library and Google Material Symbols Outlined for every icon. Material 3 supplies the colour roles, type scale, corner scale and motion curves. Photography and abstract renders from `assets/stock/` carry the imagery. No other visual framework, icon library or custom artwork is used.

## Identity

The logo pairs Najma's eight-pointed star, set inside a twelve-lobed Material "cookie" shape, with a wordmark drawn from Roboto Flex. The dot on the j is a small terracotta star. Files live in `assets/brand/`: the full logo and its reverse, the mark and its reverse, the wordmark, `favicon.svg` and `apple-touch-icon.png`. `tools/build_brand.py` regenerates them from the Roboto Flex variable font (`python3 tools/build_brand.py path/to/RobotoFlex.ttf`). The header and footer carry the logo inline so both stars can turn on hover.

## System

- **Colour.** Material 3 colour roles in `css/tokens.css`. Forest green anchors the identity, with mint, sage and peach containers. Tonal bands take `.tone-primary`, `.tone-secondary`, `.tone-tertiary` or `.tone-inverse`, and each re-scopes the colour roles it needs: the peach band switches the primary role to terracotta, and the dark band re-scopes every role, so Material buttons, links and icons inside a band follow it automatically.
- **Type.** Roboto Flex throughout, the variable member of Material's Roboto family. Display and headline styles use heavier weights and a slightly wider setting.
- **Imagery.** Every picture is a photograph or render from `assets/stock/`, set in a Material extra-large rounded container (`.media`, `.hero-media`). Pages use five patterns: a portrait hero photograph beside the headline; feature bands, where a tonal band is half photograph; split sections, where a photograph sits beside the copy; a photograph tile that completes a card grid; and closing bands, where an abstract render is screened onto the dark green so only its light shows. Named teachers appear only in their own approved photographs, shown as circular avatars because the originals are small. A teacher without a photograph gets a Material monogram.
- **Icons.** Material Symbols sit directly on the surface in a colour role, at optical sizes matched to their role: light-weight 44px symbols above section headings (36px on phones), 40px in cards and steps, 28px beside sub-headings. Card symbols fill on hover. Icons carry no containers or frames.
- **Motion.** On load the hero photograph opens out to its frame and settles from a slight zoom while the copy rises in. As the page scrolls, the hero photograph drifts, each photograph opens out and settles as it enters, section symbols draw in, cards rise in sequence, the steps rail fills, the programme's session bars draw across and the closing renders drift. Buttons tighten their corners on press. Every scroll-linked effect is progressive: browsers without scroll timelines show the finished state. `prefers-reduced-motion` removes all movement.
- **Layout.** From 1024px, each section's heading takes the left column and its reading copy the right. In reading sections with a single heading, the heading stays in view while the copy scrolls. Card grids, option cards and teacher cards run the full width. Feature bands sit side by side from 1200px and stack, photograph first, below that. The example programme's sessions run four across from 1200px and two across below. Below 1024px the hero reads headline, photograph, then detail.

## Where each image is used

| Page | Section | Asset |
| --- | --- | --- |
| Home | Hero | `j0dCClyasFk` A lively online conversation |
| | Meet Najma at the Solidarity Café | `F4AS3X2swic` Hello from home |
| | What would you like to study? | `hANJmBwxKn0` A lifelong reader |
| | Keep learning with Najma | `12OZwblVQUg` Study in your own space |
| | English for your organisation | `YDWdxElP3XI` Working through an idea |
| Lessons | Hero | `CPz2KWjCwDQ` Comfortable with learning |
| | What would you like to study? | `GpbEuMKFQew` Time for a chapter |
| | How lessons develop | `LQ1t-8Ms5PY` Learning through conversation |
| | Learning with your organisation | `LVooQvKjLjw` A thoughtful exchange |
| | Meet Najma at the Solidarity Café | `XJaPfJz7xW8` Folded possibilities (render) |
| Teachers | Hero | `-8XKPC-lLHU` Reading by the window |
| | Choosing a teacher | `NLuDzsdyQ6M` Focus by the window |
| | Meet a teacher before you book | `s2uH89aClpE` A welcoming video call |
| | Book your lesson | `LP1_iwrHTrE` Building a rhythm (render) |
| For organisations | Hero | `PSksbOVDhWk` Sharing a plan |
| | What could your group work on? | `n6aIqCWqADI` Translucent folds (render) |
| | Example programme | `4PU-OC8sW98` Planning the next step |
| | Who we work with | `PviMD8jDeYE` Thinking at the whiteboard |
| | Discuss a programme for your organisation | `qCYKtOov--s` Warm light on dark teal (render) |
| Solidarity Café | Hero | `gRmyW5p_4lQ` Time to connect |
| | The next Solidarity Café | `g86airJZ4Gs` Coffee and conversation |
| | What happens in a session? | `D8NwgmdkgOY` A conversation across screens |
| | English in the Café | `tSyU-mWc010` Listening together |
| | Join the next Café | `XJaPfJz7xW8` Folded possibilities (render) |
| About | Hero | `s2DbUV-yx2A` Learning side by side |
| | Where Najma came from | `NHdIIaU3mDE` Olives in the light |
| | A collective shaped by its teachers | `dKBTFoarrOU` A conversation on the sofa |
| | Starting small | `G0qTNcwmCaQ` A small beginning (render) |
| | Find your place in Najma | `8UP_QbfMfPM` An unfolding form (render) |

No photograph appears twice. The Café's closing render, Folded possibilities, repeats on the Lessons page's Café band so the Café keeps one visual signature. The café scenes illustrate conversation, following the stock notes: the Café itself meets online, which the video-call photographs on the home page and in "What happens in a session?" show. Photographs carry the alt text from `assets/stock/manifest.json`; renders are decorative and take `alt=""`.

## Maintenance notes

- **Adding an image.** Copy an existing `<img>` from a page and change the paths. List every export of the asset in `srcset`, keep the 1920px export's `width` and `height`, and set `--focus` in the `style` attribute to the crop's focal point (`--zoom` tightens the crop around that point). `sizes` describes the width the photograph is drawn at, which can exceed its frame because `object-fit: cover` crops it. Lazy-load everything except the hero, which takes `fetchpriority="high"`.
- **Larger exports.** Photographs drawn wider than 960 CSS pixels need exports above 1920px to stay sharp on 2× screens. `python3 tools/export_stock_sizes.py ID:2560` creates them from the masters with the collection's settings and records them in the manifest. `python3 tools/validate_stock_assets.py` then checks every file's size and checksum.
- **Icons.** The Material Symbols stylesheet is subset with `icon_names=` to the icons the site uses, which keeps the font small. When you add an icon anywhere (HTML or JavaScript), add its name to that list in every page's `<head>`, keeping the list in alphabetical order, or the icon will show as its name in plain text.
- **Section structure.** A section's heading sits in `.section-head` and its reading copy in `.section-body`. Card sets and `.section-foot` follow them and span both columns. Browsers constrain a sticky grid item by the whole section, so a heading sticks only when it is the section's only heading and no full-width content follows it; otherwise it would slide over the content below.

## Behaviour and accessibility

The teachers page renders every record in `js/teachers-data.js`. Area filter chips narrow the list, announce the number shown to screen readers and keep the choice in the URL (`?area=`), so links can arrive with a filter applied. Each profile expands in place. The mobile navigation is a Material menu, which closes on Escape or an outside click.

`js/utils.js` renders the teacher previews on the Home, Lessons, For organisations and About pages. It finds each section by its heading's visible text, ignoring the decorative Material Symbols ligature, and replaces the bracketed placeholder paragraphs in that section. If you rename one of those headings, update its entry in `js/utils.js` to match.

All text meets WCAG AA contrast: the colour roles were checked analytically, and text in the closing bands was measured against the rendered artwork behind it at 390, 768, 1024 and 1440px. Forced-colour outlines and a reduced-transparency fallback for the header are included.

## Validation

Run `node --check js/utils.js` and `node --check js/teachers.js` for syntax checks, and `python3 tools/validate_stock_assets.py` for the image files. `node tests/interactions.cjs` fails with the same error before and after the photography redesign: its fixtures expect a confirmed-profile flag, a service filter and a carousel that the current pages do not have.

The redesign was reviewed in Chromium at widths from 320 to 2560px on all six pages, with and without reduced motion. The checks confirmed that there is no horizontal overflow, that sticky headings never leave their section or overlap other content, that every link, fragment and image path resolves, that each page has one H1 and unique IDs, that the teacher filters, profile toggles and mobile menu work, that everything in the reading zone of the screen is fully revealed while motion is on, and that every photograph loads a source at least 1.97 times its drawn width on 2× screens. A text comparison confirmed that every rendered text run and every label and aria-label value is unchanged; the only additions are the photographs' alt text.

Design references: https://m3.material.io/ and https://github.com/material-components/material-web
