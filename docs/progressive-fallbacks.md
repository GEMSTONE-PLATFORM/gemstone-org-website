# Browser support and fallback behavior

## What works without optional browser features

The website keeps its headings, written content, navigation links, FAQ answers, Architecture explanation, briefing links, and form fallback text in normal page HTML. They remain available if animation, JavaScript enhancements, or embedded external content is unavailable.

## Network topology explorer

The Hero section contains a browser-only network explorer. Visitors can add Hubs, add Nodes to a selected Hub, and add Clients to a selected Node.

These additions are examples for the current visit only. They reset when the page reloads because the public website is a static GitHub Pages site and does not store visitor-created data.

The published starting topology is stored in `src/content/site-manifest.ts`. Updating that configuration and running `npm run build` changes the starting graph for every visitor.

## Motion and accessibility

The browser setting `prefers-reduced-motion: reduce` disables continuous animation and shortens transitions. The controls, topology, Architecture details, and page content remain available without animation.

Navigation uses `IntersectionObserver` only to highlight the active section. If it is unavailable, all navigation links continue to work normally.

## Briefing and form embeds

Briefing and Microsoft Forms embeds load only when configured and use lazy loading. Missing, blocked, unsupported, or timed-out embeds keep clear external links and fallback explanations.

## Checks

Run the responsive browser checks with:

```sh
npm run test:e2e -- responsive
```

Run all release checks with:

```sh
npm run validate:release
```
