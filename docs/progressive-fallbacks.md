# Browser Support and Progressive Fallbacks

## Supported browsers

The public site targets current Microsoft Edge, Chrome, Firefox, and Safari releases. The Playwright responsive suite runs the same viewport, keyboard, reduced-motion, and fallback checks against Chromium, Firefox, and WebKit engine projects.

## Core content and layout

The page renders headings, approved copy, landmark structure, internal anchors, architecture relationship lists, and external recovery actions in HTML. These remain usable when client-side enhancements are unavailable. CSS keeps the page contained from 320px through 1920px and uses responsive reflow rather than duplicated content.

## Motion

Motion is optional. The browser `prefers-reduced-motion: reduce` preference disables continuous CSS animation and shortens transitions. The static ecosystem map, relationship labels, controls, and CTA links remain present regardless of motion support. The motion policy excludes video and canvas rendering; CSS effects are limited to the named `gemstone-breathe` and `gemstone-path-flow` animations.

## Browser capability fallbacks

Navigation uses `IntersectionObserver` only to enhance active-section indication. If the observer is unavailable, navigation links remain normal same-document anchors. The architecture relationship list and hero labels are always rendered so an SVG or interaction enhancement is never the sole source of meaning.

## Optional external embeds

Briefing and Microsoft Forms embeds are optional browser enhancements. A configured iframe uses `loading="lazy"`. Missing configuration renders no iframe. Blocked, unsupported, or timed-out embeds retain clearly labeled external recovery links. New-tab links use `noopener noreferrer`.

## Automated coverage

Run the responsive checks with:

```sh
npm run test:e2e -- responsive
```

The suite checks the required viewport widths, horizontal containment, keyboard focus visibility, reduced-motion behavior, an unavailable-observer fallback, no video or canvas workload, bounded named CSS animations, and lazy iframe attributes.
