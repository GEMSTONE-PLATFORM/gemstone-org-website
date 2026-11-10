# GEMSTONE branding boundary

This directory is the application boundary for supplied, approved GEMSTONE
branding assets. The configured production locations are:

- `gemstone-logo.svg` for the official primary logo
- `gemstone-logo-horizontal.svg` for the official horizontal logo
- `gemstone-mark.svg` for the official mark

Those filenames are reserved for the supplied official assets. This repository
does not recreate, redraw, recolor, crop, or otherwise alter the official logo.
Do not substitute a logo derived from `initial-images/GEMSTONEInfo.pptx`.

Until approved logo files are supplied, the safe text-only fallback references
are `gemstone-wordmark-fallback.txt` and `gemstone-mark-fallback.txt`. The
single-character value in the mark fallback is a text placeholder, not an
official GEMSTONE mark and must not be presented as one.

`src/config/asset-config.ts` is the only application-owned source for these
branding paths. Components must consume that configuration rather than
hard-coding paths or importing files from `initial-images`.
