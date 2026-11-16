# Update the GEMSTONE website without writing frontend code

You can update the published text, images, backgrounds, logos, and starter network yourself.

## The three things you use

| What you want to change                                           | File or folder to use          |
| ----------------------------------------------------------------- | ------------------------------ |
| Website words, section titles, image choices, and starter network | `src/content/site-manifest.ts` |
| Logos                                                             | `public/branding/`             |
| Images and backgrounds                                            | `public/images/`               |

After making your changes, run:

```sh
npm run build
```

The build reads `src/content/site-manifest.ts` and the files in `public/`. It creates a new version of the website in the `out/` folder.

## Change words on the website

Open:

```text
src/content/site-manifest.ts
```

Everything you normally need is in the `content` section. The labels tell you what each part changes:

- `sectionTitles` changes section headings and the introductory Architecture paragraph.
- `hero` changes the first title, description, and buttons.
- `about` changes the “What is GEMSTONE?” section.
- `whyGemstone`, `capabilities`, `differentiators`, and `faq` change their cards and answers.
- `architecture` changes the default Hub–Node–Client diagram.
- `hero.topology` changes the starter network graph in the Hero section.

Change only the words inside quotation marks. Keep the commas, brackets, and names such as `title`, `description`, `question`, and `answer` unchanged.

Example. To change a title, find:

```ts
title: "Current title",
```

and change only the words between the quotation marks:

```ts
title: "New approved title",
```

## Replace a logo

Replace the logo file in `public/branding/`. Keep the exact filename.

| Replace this             | Exact filename                 |
| ------------------------ | ------------------------------ |
| Main GEMSTONE logo       | `gemstone-logo.svg`            |
| Wide laptop/desktop logo | `gemstone-logo-horizontal.svg` |
| Small phone logo         | `gemstone-mark.svg`            |

You do not need to change the master configuration when replacing a logo with the same filename. Run `npm run build` when you are finished.

Use only approved logo files. Do not crop, recolor, stretch, trace, or recreate them.

## Add or replace an image

First put the file in the correct folder.

| Image purpose                | Folder                        | Example filename                      |
| ---------------------------- | ----------------------------- | ------------------------------------- |
| Hero/top-of-page image       | `public/images/hero/`         | `gemstone-hero-network.webp`          |
| Architecture/technical image | `public/images/architecture/` | `gemstone-architecture-hub-node.svg`  |
| Page background              | `public/images/backgrounds/`  | `gemstone-background-cyan-lines.webp` |

Then open `src/content/site-manifest.ts` and update the matching image line near the top:

```ts
heroImage: "",
pageBackground: "",
architectureImage: "",
```

For example, if you added `public/images/hero/gemstone-hero-network.webp`, change this:

```ts
heroImage: "",
```

to this:

```ts
heroImage: "/images/hero/gemstone-hero-network.webp",
```

Run `npm run build`. The new Hero image now replaces the generated Hero network visual automatically.

## Use a background image

Put the final background file in:

```text
public/images/backgrounds/
```

Then set `pageBackground` in `src/content/site-manifest.ts` to the file path. Use a subtle image that leaves all words readable. Do not place an official logo over a busy area.

## Keep a file out of the public site

Put drafts, screenshots, and ideas in:

```text
public/images/inspiration/
```

Files in `inspiration/` do not appear on the public website. Move an approved final image to `hero/`, `architecture/`, or `backgrounds/` before adding its path to `site-manifest.ts`.

## Change the starter network graph

The Hero network starts with three connected Hubs. Each Hub has Nodes, and each Node has Clients. The starting items are under:

```text
src/content/site-manifest.ts → content → hero → topology
```

- Add an item to `entities` to add a Hub, Node, or Client to the published starting graph.
- Add a matching line to `connections` to join two items.
- Use a Node’s `parentId` to identify its Hub.
- Use a Client’s `parentId` to identify its Node.

Visitors can also use the on-page **Add Hub**, **Add Node to selected Hub**, and **Add Client to selected Node** controls to explore a larger network. Those visitor-made additions are examples only and reset when the page reloads.

## Add a PowerPoint briefing

1. Put the final PowerPoint in `public/documents/`.
2. Name it `gemstone-briefing-YYYY-MM.pptx`, such as `gemstone-briefing-2026-11.pptx`.
3. Update the briefing address in `src/config/integration-config.ts` using the same path.
4. Run `npm run build`.

## Before publishing

Run:

```sh
npm run build
npm run validate:release
```

Then publish the contents of `out/`, or merge the approved branch so GitHub Actions builds and publishes the site.

Do not put passwords, private information, or unapproved files in public folders.
