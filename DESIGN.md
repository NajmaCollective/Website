# Najma · Material 3 redesign

The site uses Google Material Web 2.4.1 as its sole UI component library and Google Material Symbols Outlined for every icon. Native HTML provides semantic tables, disclosure panels and the scroll-snap carousel. No additional visual framework or icon library is introduced.

The shared palette uses Material 3 colour roles. Forest green anchors the identity. Ivory surfaces create breathing room, with sage and terracotta containers distinguishing learning formats. Typography uses Roboto. Shapes use the Material rounded scale and controls keep their Material state layers. A translucent navigation bar and a glass inset on the home feature panel provide depth; opaque surfaces support the main reading areas.

The homepage has a split hero, a teaching-area carousel, three pricing cards, a Café feature, an organisation feature and a teacher-revenue highlight. Interior pages share the system with individual feature panels. Lesson prices, the programme example and revenue allocation use semantic tables. FAQs use native keyboard-accessible disclosures.

## Behaviour and accessibility

The carousel supports touch scrolling and focusable keyboard navigation with Arrow Left, Arrow Right, Home and End. Previous/next controls appear when Material Web is available. It never advances automatically. Reduced-motion preferences disable smooth movement. Navigation uses a native disclosure at smaller widths and closes on Escape or an outside click. Colour-role text pairs were checked at 4.5:1 or above. Forced-colour outlines and reduced-transparency fallbacks are included.

Teacher profiles remain unpublished until `confirmed: true` is explicitly added to verified records in `js/teachers-data.js`. Optional `services` values are `intro` and `short`. Area and service filters combine, including links arriving with query parameters. The current repository contains draft teacher records, so an honest enquiry state is shown. Draft event information is described as awaiting confirmation.

## Validation

Run `node tests/interactions.cjs` for DOM-boundary tests of filtering, publication status, escaping, carousel controls and menu dismissal. Run `node --check js/utils.js` and `node --check js/teachers.js` for syntax checks.

The six HTML documents were checked for internal links, fragment targets, a single non-empty H1 and unique IDs. Material colour-role contrast checks passed. `git diff --check` passed.

Desktop and mobile visual review remains outstanding: the available browser blocked the local HTTP preview and shared-file preview under its security policy. DOM-boundary tests do not verify rendering, Material Web hydration, focus behaviour inside shadow roots or touch gestures. Review all six pages in a permitted preview at 390px, 768px and 1440px before merging. Include the lessons carousel, teacher filters, FAQ disclosures, menu, and horizontally scrolling tables. Verify Google Fonts and the Material Web CDN load in the deployment environment.

Design references: https://m3.material.io/ and https://github.com/material-components/material-web
