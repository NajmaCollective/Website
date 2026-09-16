# Najma visual redesign

This redesign gives all six pages a shared Material 3 theme with forest-green primary surfaces, warm ivory backgrounds, sage containers and a terracotta Café accent. Roboto Flex provides the display typography. Roboto remains the reading and component typeface. Google's Material Web 2.4.1 remains the only UI component dependency.

The homepage separates the introduction, pricing and community routes into distinct compositions. Inner pages use editorial columns with numbered section labels. All existing page URLs and substantive pricing and operating terms are preserved. Native disclosure elements shorten the FAQ presentation while keeping answers accessible through the keyboard.

## Content awaiting approval

Teacher records in `js/teachers-data.js` remain drafts. Set `published: true` only when a record is approved for display. Set `intro: true` only when that teacher offers a free introductory appointment. Until then the teacher directory shows an enquiry state. It filters by teaching area and honours `?service=intro`.

Café event details and facilitator biographies still require confirmation. The website displays explicit pending states in place of bracketed authoring instructions. Existing lesson enquiries continue to use the site's email address.

## Verification

JavaScript syntax and static internal-link/anchor checks pass across all six pages. Each page has one first-level heading and unique element IDs. Core theme pairs meet WCAG AA text contrast. Teacher-directory checks cover draft exclusion, topic filtering, the introductory appointment option, and HTML escaping.

The cloud preview browser blocked local preview URLs and local file access. Desktop/mobile visual verification and live Material Web interaction checks therefore remain pending. Before merging, serve the repository using `python -m http.server 8765` and review it at desktop and narrow mobile widths. Check the Material menu, filter chips, keyboard focus and FAQ disclosure controls. External Google Fonts and the existing Material Web CDN require network access.
