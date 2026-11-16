# How to update the GEMSTONE website

This guide is for people who do **not** write website code.

## The simple rule

1. Put the file in the correct folder.
2. Tell Kiro what you want it to do on the website.
3. Kiro adds it to the page, checks that it works on phones and laptops, and creates a pull request for review.

Adding a new image file does **not** make it appear on the website by itself. You must also say where you want to use it.

## Replace a logo

Put the approved replacement file in `public/branding/` and keep the exact filename below.

| If you are replacing…   | Use this exact filename        | Where it appears              |
| ----------------------- | ------------------------------ | ----------------------------- |
| The main GEMSTONE logo  | `gemstone-logo.svg`            | General brand use             |
| The wide GEMSTONE logo  | `gemstone-logo-horizontal.svg` | Laptop and desktop header     |
| The small GEMSTONE mark | `gemstone-mark.svg`            | Phone header and browser icon |

Do not rename these files. Do not crop, recolor, trace, or rebuild the logo. Replace the file only with an approved version from the branding team.

After adding a logo, tell Kiro:

> I replaced `public/branding/gemstone-mark.svg`. Please check that it looks correct on a phone and update the pull request.

## Add or replace an image

Choose the folder based on where the image belongs.

| Image purpose                     | Put it here                   | Example filename                              |
| --------------------------------- | ----------------------------- | --------------------------------------------- |
| Hero or top-of-page image         | `public/images/hero/`         | `gemstone-hero-network-2026-11.webp`          |
| Architecture or technical diagram | `public/images/architecture/` | `gemstone-architecture-hub-node-2026-11.svg`  |
| Decorative page background        | `public/images/backgrounds/`  | `gemstone-background-cyan-lines-2026-11.webp` |

Use short, lowercase names with dashes. Use `webp`, `png`, `jpg`, or `svg`.

After adding an image, send Kiro a request like this:

> Use `public/images/hero/gemstone-hero-network-2026-11.webp` in the Hero section. It is decorative, should not cover the title, and should look good on both phones and laptops.

For an image that conveys information, include a short description for visitors using screen readers:

> Use `public/images/architecture/gemstone-architecture-hub-node-2026-11.svg` in the Architecture section. It shows a Hub connected to two Nodes and two Clients. This image is informative.

Kiro will add the image to the website code, preserve the correct image shape, add the needed description when appropriate, and check the layout.

## Add a background image

Put final, approved background art in:

```text
public/images/backgrounds/
```

Then tell Kiro:

> Use `public/images/backgrounds/gemstone-background-cyan-lines-2026-11.webp` as a subtle website background. Keep all words easy to read and do not place the official logo over a busy part of the image.

Backgrounds are decorative. They should support the page, not compete with text, forms, or logos.

## Keep an image for review only

If an image is an idea, a screenshot, or still needs approval, put it in:

```text
public/images/inspiration/
```

Files in this folder are **not** displayed on the public website. Tell Kiro when an image has been approved and should be moved into a production folder.

## Update words on the site

You do not need to edit code. Send Kiro the exact old and new wording, plus where it appears.

Example:

> In the Architecture section, replace “[old text]” with “[new text].”

## Add a PowerPoint briefing for download

1. Put the final approved PowerPoint file in `public/documents/`.
2. Name it like this:

   ```text
   gemstone-briefing-YYYY-MM.pptx
   ```

   Example: `gemstone-briefing-2026-11.pptx`

3. Tell Kiro:

   > Add `public/documents/gemstone-briefing-2026-11.pptx` to the GEMSTONE Briefing section as the downloadable briefing.

Kiro will connect the download button and verify it works.

## Before asking Kiro to publish an update

Make sure you have:

- the final approved file, not a draft or screenshot;
- permission to use it publicly;
- a clear instruction for where it belongs;
- any required short description of what an informative image shows.

Do not put passwords, private data, or unapproved material in the public website folders.
