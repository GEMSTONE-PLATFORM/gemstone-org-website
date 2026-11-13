# GEMSTONE production images

Put approved, production-ready images in the directory that matches their purpose:

| Use                    | Directory                     | Naming convention                                 |
| ---------------------- | ----------------------------- | ------------------------------------------------- |
| Hero artwork           | `public/images/hero/`         | `gemstone-hero-<subject>-<YYYY-MM>.<ext>`         |
| Architecture artwork   | `public/images/architecture/` | `gemstone-architecture-<subject>-<YYYY-MM>.<ext>` |
| Decorative backgrounds | `public/images/backgrounds/`  | `gemstone-background-<subject>-<YYYY-MM>.<ext>`   |

Use lowercase kebab-case filenames. Use `webp` or `avif` for photographic/raster artwork where possible. Use `svg` for vector artwork. Do not replace the official logos here; those belong in [`../branding/`](../branding/README.md).

## Add an image to the website

1. Add an approved image under the matching directory, following the naming convention.
2. Add its public URL in `src/config/asset-config.ts`. Use `publicAsset("/images/<directory>/<filename>")` so the image also works when the site is published under a base path.
3. Use the configured asset in the relevant section. Informative images need concise alternative text. Decorative artwork must be hidden from assistive technology.
4. Run `npm run lint`, `npm run typecheck`, and `npm run build` before release.

Files in `initial-images/` and `public/images/inspiration/` are source or inspiration material. They are not automatically approved for public production use.
