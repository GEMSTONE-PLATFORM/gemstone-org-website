# GEMSTONE downloadable documents

Publish an approved GEMSTONE briefing here using this filename:

```text
gemstone-briefing-YYYY-MM.pptx
```

For example, a deck approved in November 2026 is named:

```text
gemstone-briefing-2026-11.pptx
```

Use lowercase kebab-case names. Keep the `.pptx` extension so visitors download the original PowerPoint deck. Do not overwrite a prior public deck. Give each updated deck its approval month and update the briefing configuration to match.

## Publish a new briefing

1. Add the approved PowerPoint deck to this directory.
2. In `src/config/integration-config.ts`, replace `BRIEFING_URL_PLACEHOLDER` with `publicAsset("/documents/gemstone-briefing-2026-11.pptx")`. Import `publicAsset` from `src/config/asset-config.ts` so the download URL also works when the site uses a base path.
3. Set `format` to `"powerpoint"` and `embed` to `false`. Browsers do not reliably render PowerPoint files in an iframe, while the section still provides clear view and download actions.
4. Run `npm run lint`, `npm run typecheck`, and `npm run build`.

The source deck under `initial-images/` remains source material. Copy only an approved, release-ready deck into this public directory.
