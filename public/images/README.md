# Put website images here

This folder holds images that can appear on the public GEMSTONE website.

## Choose the right folder

| What is the image for?               | Put it in this folder | Example name                                  |
| ------------------------------------ | --------------------- | --------------------------------------------- |
| The top of the homepage              | `hero/`               | `gemstone-hero-network-2026-11.webp`          |
| An architecture or technical section | `architecture/`       | `gemstone-architecture-hub-node-2026-11.svg`  |
| A decorative page background         | `backgrounds/`        | `gemstone-background-cyan-lines-2026-11.webp` |
| An idea that is not approved yet     | `inspiration/`        | Any clear filename                            |

Use lowercase filenames with dashes. Good file types are `webp`, `png`, `jpg`, and `svg`.

## Make an image appear on the website

Putting a file here saves it in the website project, but it does **not** automatically place it on a page.

After adding a file, tell Kiro:

> Use `[full file path]` in the `[section name]` section. It is `[decorative/informative]`. It should `[any crop, placement, or readability instruction]`.

Example:

> Use `public/images/backgrounds/gemstone-background-cyan-lines-2026-11.webp` as a subtle page background. It is decorative. Keep all writing easy to read.

Kiro will place the image, make it work on phones and laptops, add an image description when needed, test the page, and create a pull request.

## Do not use `inspiration/` for public images

`inspiration/` is for drafts, screenshots, and examples only. Images there are never shown on the public website until they are approved and moved to `hero/`, `architecture/`, or `backgrounds/`.

For logo replacement instructions, see [`../branding/README.md`](../branding/README.md). For the full guide, see [`../../HOW-TO-UPDATE-THE-WEBSITE.md`](../../HOW-TO-UPDATE-THE-WEBSITE.md).
