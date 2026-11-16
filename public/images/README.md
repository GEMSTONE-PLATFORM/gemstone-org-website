# Website images

Put final images in the matching folder, add the file path to `src/content/site-manifest.ts`, then run `npm run build`.

| Use                | Folder          | Manifest setting    |
| ------------------ | --------------- | ------------------- |
| Hero image         | `hero/`         | `heroImage`         |
| Architecture image | `architecture/` | `architectureImage` |
| Page background    | `backgrounds/`  | `pageBackground`    |

Example:

1. Add `gemstone-hero-network.webp` to `hero/`.
2. In `src/content/site-manifest.ts`, change `heroImage: ""` to `heroImage: "/images/hero/gemstone-hero-network.webp"`.
3. Run `npm run build`.

Use `inspiration/` for drafts, screenshots, and ideas. Files in that folder do not appear on the public site.

Read [`../../HOW-TO-UPDATE-THE-WEBSITE.md`](../../HOW-TO-UPDATE-THE-WEBSITE.md) for the full update guide.
