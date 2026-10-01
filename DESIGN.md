# Najma · Material 3 design

The site uses Google Material Web 2.4.1 as its only UI component library and Google Material Symbols Outlined for every icon. Material 3 supplies the colour roles, type scale, corner scale and motion curves. Stock photography from `assets/stock/` and stock video loops in `assets/video/` carry the imagery. No other visual framework, icon library or custom artwork is used.

## Identity

The logo pairs Najma's eight-pointed star, set inside a twelve-lobed Material "cookie" shape, with a wordmark drawn from Roboto Flex. The dot on the j is a small terracotta star. Files live in `assets/brand/`: the full logo and its reverse, the mark and its reverse, the wordmark, `favicon.svg` and `apple-touch-icon.png`. `tools/build_brand.py` regenerates them from the Roboto Flex variable font (`python3 tools/build_brand.py path/to/RobotoFlex.ttf`). The header and footer carry the logo inline so both stars can turn on hover.

## System

- **Colour.** Material 3 colour roles in `css/tokens.css`. Forest green anchors the identity, with mint, sage and peach containers. Tonal bands take `.tone-primary`, `.tone-secondary`, `.tone-tertiary` or `.tone-inverse`, and each re-scopes the colour roles it needs: the peach band switches the primary role to terracotta, and the dark band re-scopes every role, so Material buttons, links and icons inside a band follow it automatically.
- **Type.** Roboto Flex throughout, the variable member of Material's Roboto family. Display and headline styles use heavier weights and a slightly wider setting.
- **Imagery.** Every picture is a photograph from `assets/stock/` or a video loop from `assets/video/`, set in a Material extra-large rounded container (`.media`, `.hero-media`). Pages use five patterns: a portrait hero photograph or video beside the headline; feature bands, where a tonal band is half photograph; split sections, where a photograph sits beside the copy; a photograph or video tile that completes a card grid; and closing bands, where a stock video loop with a dark background (a night sky, light on water, ink, sunlight through leaves) is screened onto the dark green so only its light shows. Named teachers and the Café facilitator appear only in their own approved photographs, shown as circular avatars because the originals are small. Anyone without a photograph gets a Material monogram.
- **Icons.** Material Symbols sit directly on the surface in a colour role, at optical sizes matched to their role: light-weight 44px symbols above section headings (36px on phones), 40px in cards and steps, 28px beside sub-headings. Card symbols fill on hover. Icons carry no containers or frames.
- **Motion.** On load the hero photograph opens out to its frame and settles from a slight zoom while the copy rises in. As the page scrolls, the hero photograph drifts, each photograph opens out and settles as it enters, section symbols draw in, cards rise in sequence, the steps rail fills, the programme's session bars draw across and the closing renders drift. Buttons tighten their corners on press. Every scroll-linked effect is progressive: browsers without scroll timelines show the finished state. `prefers-reduced-motion` removes all movement.
- **Layout.** From 1024px, each section's heading takes the left column and its reading copy the right. In reading sections with a single heading, the heading stays in view while the copy scrolls. Card grids, option cards and teacher cards run the full width. Feature bands sit side by side from 1200px and stack, photograph first, below that. The example programme's sessions run four across from 1200px and two across below. Below 1024px the hero reads headline, photograph, then detail.

## Where each image is used

| Page | Section | Asset |
| --- | --- | --- |
| Home | Hero | Video: `home-video-call` A video call at the laptop (Mixkit) |
| | Meet Najma at the Solidarity Café | `F4AS3X2swic` Hello from home |
| | What would you like to study? | `hANJmBwxKn0` A lifelong reader |
| | Every lesson builds on the last | `12OZwblVQUg` Study in your own space |
| | English for your organisation | `YDWdxElP3XI` Working through an idea |
| Lessons | Hero | `CPz2KWjCwDQ` Comfortable with learning |
| | What would you like to study? | `GpbEuMKFQew` Time for a chapter |
| | How lessons develop | `LQ1t-8Ms5PY` Learning through conversation |
| | Learning with your organisation | `LVooQvKjLjw` A thoughtful exchange |
| | Join us at the Solidarity Café | Video: `night-sky` Night sky (Mixkit) |
| Teachers | Hero | `-8XKPC-lLHU` Reading by the window |
| | Meet a teacher before you book | `s2uH89aClpE` A welcoming video call |
| | Book your lesson | Video: `sea-light` Light on the water (Mixkit) |
| For organisations | Hero | Video: `org-group` Talking round a table (Mixkit) |
| | What could your group work on? | Video: `teal-water` Teal water (Mixkit) |
| | Example programme | `4PU-OC8sW98` Planning the next step |
| | Who we work with | `PviMD8jDeYE` Thinking at the whiteboard |
| | Talk to us about a programme | Video: `ink` Ink in water (Mixkit) |
| Solidarity Café | Hero | Video: `cafe-greeting` Waving to someone on a call (Mixkit) |
| | The next Solidarity Café | `g86airJZ4Gs` Coffee and conversation |
| | What happens in a session? | `D8NwgmdkgOY` A conversation across screens |
| | Meet your facilitator | No stock photograph: Dilan Akbayır's monogram, replaced by her own approved photograph when it arrives |
| | English in the Café | `tSyU-mWc010` Listening together |
| | Join the next Café | Video: `night-sky` Night sky (Mixkit) |
| About | Hero | `s2DbUV-yx2A` Learning side by side |
| | Where Najma came from | `NHdIIaU3mDE` Olives in the light |
| | Owned and run by our members | `dKBTFoarrOU` A conversation on the sofa |
| | Where would you like to start? | Video: `leaf-light` Sunlight through leaves (Mixkit) |

No photograph appears twice. The Café's closing loop, Night sky, repeats on the Lessons page's Café band so the Café keeps one visual signature. The café scenes illustrate conversation, following the stock notes: the Café itself meets online, which the Café hero video, the video-call photograph on the home page and "What happens in a session?" show. Photographs carry the alt text from `assets/stock/manifest.json` and hero video posters the alt text from `assets/video/manifest.json`; the loops in closing bands and the grid tile are decorative and take `alt=""`. The ten abstract renders in `assets/stock/web/illustrations/` are no longer used.

## Maintenance notes

- **Adding an image.** Copy an existing `<img>` from a page and change the paths. List every export of the asset in `srcset`, keep the 1920px export's `width` and `height`, and set `--focus` in the `style` attribute to the crop's focal point (`--zoom` tightens the crop around that point). `sizes` describes the width the photograph is drawn at, which can exceed its frame because `object-fit: cover` crops it. Lazy-load everything except the hero, which takes `fetchpriority="high"`.
- **Larger exports.** Photographs drawn wider than 960 CSS pixels need exports above 1920px to stay sharp on 2× screens. `python3 tools/export_stock_sizes.py ID:2560` creates them from the masters with the collection's settings and records them in the manifest. `python3 tools/validate_stock_assets.py` then checks every file's size and checksum.
- **Icons.** The Material Symbols stylesheet is subset with `icon_names=` to the icons the site uses, which keeps the font small. When you add an icon anywhere (HTML or JavaScript), add its name to that list in every page's `<head>`, keeping the list in alphabetical order, or the icon will show as its name in plain text.
- **Section structure.** A section's heading sits in `.section-head` and its reading copy in `.section-body`. Card sets and `.section-foot` follow them and span both columns. Browsers constrain a sticky grid item by the whole section, so a heading sticks only when it is the section's only heading and no full-width content follows it; otherwise it would slide over the content below.

## Video

Every loop in `assets/video/` is stock footage from a stock video library; the site uses no artwork of its own. Each loop is stored as AV1 and H.264 at 720p (phones) and 1080p (from 1024px), with a WebP poster at 960 and 1920px:

- **Sourcing.** Every clip comes from Mixkit under its Stock Video Free License, which allows commercial use without attribution. Use only clips marked Free: Mixkit's Restricted licence doesn't cover this kind of use. Use filmed footage, and leave out clips tagged as motion graphics or 3D renders. Coverr (no attribution needed) also works; skip anything it marks as AI-generated or premium. Pexels and Pixabay block automated downloads, so clips from there have to be downloaded by hand.
- **Loops.** `tools/make_loop.sh` turns a still-camera stretch of a clip into a seamless loop by dissolving its end into its start, and `tools/encode_video.sh MASTER assets/video/NAME` makes the site's files. As with the photographs, the people in the hero loops are illustrative models and are never presented as Najma learners, teachers, Café participants or partner organisations.

`assets/video/sources.json` records each loop's source, licence and how it was made; `python3 tools/validate_video_assets.py --write` adds sizes and checksums to `manifest.json`, and without `--write` checks them, the size budgets (720p up to 1 MB, 1080p up to 2.5 MB) and every page reference. Masters stay out of git: the stock sources are linked, and `sources.json` records the exact stretch each loop uses.

`js/video.js` plays a loop only while at least half of it is on screen, and only the one most in view. The poster image sits underneath and stays whenever the video can't or shouldn't play. Nothing downloads or plays by itself for visitors who prefer reduced motion, have data saving on, or are on a 2G or 3G connection; each loop has a pause button (WCAG 2.2.2), and the visitor's choice applies to every loop and is remembered across pages.

## Behaviour and accessibility

The teachers page renders every record in `js/teachers-data.js`. Area filter chips and lesson-type chips narrow the list, announce the number shown to screen readers and keep the choice in the URL (`?area=` and `?service=short` or `?service=intro`), so links can arrive with a filter applied. The lesson-type filter reads each teacher's `offers` list, which must match the services shown in their profile. Each profile expands in place. The mobile navigation is a Material menu, which closes on Escape or an outside click; its button reports whether the menu is open (`aria-expanded`).

Until Material Web has loaded, `nav.css` hides the menu and holds the menu button at its final size, and `base.css` gives buttons and chips roughly their final size, so the page doesn't jump when the components arrive. On phones (below 600px) the hero shows the headline, a one-line introduction, the price and the main button before the photograph. Cards change shape on hover only on devices that can hover, and on keyboard focus.

`js/utils.js` renders the teacher previews on the Home, Lessons, For organisations and About pages from its own short list, so a new teacher needs adding there as well as to `js/teachers-data.js`. Each page marks the spot with an empty `<div data-teacher-previews-slot>`, which the script replaces with the preview cards; add `data-heading-level="h4"` when the slot sits under an h3. Without JavaScript the slot stays empty and the link to the Teachers page beside it still works. Headings can be reworded freely. The Home page's teaching-area links use the area values the Teachers page filters on: `general`, `professional`, `academic`, `exam` and `advocacy`.

The Café facilitator, Dilan Akbayır, has her own profile in the Café page's `#facilitator` section, written as static HTML and styled in `css/join.css`. The Home page's Café band and the About page's Café facilitation card link to it. She isn't a teacher, so she stays out of `js/teachers-data.js` and the teacher previews. To add her photograph, save the approved file as `assets/team/dilan-akbayir.jpg` (at least 216px square) and replace the monogram `<span>` in her avatar with `<img src="assets/team/dilan-akbayir.jpg" alt="Portrait of Dilan Akbayır" width="216" height="216" loading="lazy" decoding="async">`.

All text meets WCAG AA contrast: the colour roles were checked analytically, and text in the closing bands was measured against the video loops behind it at 390, 768, 1024 and 1440px. Forced-colour outlines and a reduced-transparency fallback for the header are included.

## Validation

Run `node --check js/utils.js` and `node --check js/teachers.js` for syntax checks, and `python3 tools/validate_stock_assets.py` for the image files. `node tests/interactions.cjs` fails: it was written for an earlier design, and its fixtures expect a confirmed-profile flag and a carousel that the current pages don't have. It needs replacing.

The redesign was reviewed in Chromium at widths from 320 to 2560px on all six pages, with and without reduced motion. The checks confirmed that there is no horizontal overflow, that sticky headings never leave their section or overlap other content, that every link, fragment and image path resolves, that each page has one H1 and unique IDs, that the teacher filters, profile toggles and mobile menu work, that everything in the reading zone of the screen is fully revealed while motion is on, and that every photograph loads a source at least 1.97 times its drawn width on 2× screens. A text comparison confirmed that every rendered text run and every label and aria-label value was unchanged by the redesign; the only additions were the photographs' alt text.

## Copy

In September 2026 the copy on all six pages was rewritten to the standard in `VOICE.md`, which is now the reference for any wording on the site. The rewrite kept every price, duration and commitment, merged the Lessons page's duplicate sections (lesson continuity, fees and the level test), moved the full fee breakdown to About (`about.html#income`), replaced unconfirmed Café and facilitator placeholders with an accurate status, and left the photography, layout and components unchanged. It was checked in Chromium at 390, 768, 1024 and 1440px for overflow, a single H1, unique IDs, filled teacher previews, resolving links and fragments, working teacher filters and a clear console.

A second pass later that month made the copy more natural and cut about 15% of it. Sentences now make a person the subject wherever a profile, proposal or page used to do the telling. The fee split changed to 85% for the teacher and three 5% shares (operations, Café facilitation and the proposed Al Manar contribution); the allocation bar and legend on About follow it, and the About page's shared roles now sit in their own section as two cards coloured to match their shares in the bar. The Starting small section on About and the Choosing a teacher section on Teachers were removed, Al Manar is linked to almanar-society.org, and the fourth teacher now appears in the previews.

In October 2026 the Café gained a named facilitator. Dilan Akbayır's profile sits on the Café page after "What happens in a session?", which now names her as the host, and the Home and About pages name her where they mention Café facilitation. Her text is her own, edited only to British spelling ("programmes").

Design references: https://m3.material.io/ and https://github.com/material-components/material-web

## Publishing and search

GitHub Pages publishes the `main` branch at https://najmacollective.github.io/Website/. `_config.yml` keeps the working documents, the draft PDF, `tools/`, `tests/` and the stock masters, previews and catalogue off the public site; add any new internal file to its `exclude` list. The repository itself stays public, so keep anything confidential out of it.

Every page carries a canonical link, share tags with `assets/brand/share-card.jpg` (1200 × 630, regenerated from `tools/share-card.html` with `node tools/render_share_card.cjs`), `lang="en-GB"` and structured data describing Najma. `sitemap.xml` lists the six pages and `404.html` is the not-found page.

najmacollective.org currently points at an expired Squarespace site. To move the website there:

1. At the domain registrar, point the apex domain at GitHub Pages (A records 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153) and `www` at `najmacollective.github.io` (CNAME). Keep the email (MX) records unchanged.
2. In the repository's Settings → Pages, set the custom domain to `najmacollective.org` and turn on Enforce HTTPS. GitHub adds a `CNAME` file and redirects the github.io address to the new domain.
3. Replace `https://najmacollective.github.io/Website/` with `https://najmacollective.org/` in every page's head, `sitemap.xml` and `robots.txt`, and `/Website/` with `/` in `404.html`.
4. Verify the domain in Google Search Console and Bing Webmaster Tools and submit `sitemap.xml`.
