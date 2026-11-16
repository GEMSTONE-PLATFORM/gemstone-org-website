# GEMSTONE Public Website

Static, single-page public website for the Government Enterprise Modeling and
Simulation Trusted Operations Networked Ecosystem (GEMSTONE). The Next.js App
Router application exports static files and does not require a Node.js server,
application backend, database, API route, or response store after its build
completes.

## Prerequisites

- Node.js 24 LTS and npm 11, matching the CI workflow and package engine requirements.
- npm, which is used by the committed `package-lock.json`.
- Playwright browser binaries for browser, accessibility, and integration tests.
  Install them once when they are not already available:

  ```sh
  npx playwright install
  ```

## Install and run locally

Install the locked dependency set:

```sh
npm ci
```

Use `npm install` only when intentionally updating dependencies and the lockfile.

Start the local development server:

```sh
npm run dev
```

The development server prints the local URL. Stop it with `Ctrl+C`.

### Optional Microsoft Forms build-time setting

Microsoft Forms is the only current environment-based public setting. Create a
local, uncommitted `.env.local` file when an approved form URL is available:

```dotenv
NEXT_PUBLIC_MICROSOFT_FORM_URL=https://approved-form-host.example/path
```

`NEXT_PUBLIC_*` values are embedded in the client bundle at development/build
time. Do not put secrets, credentials, tokens, or unapproved URLs in this
variable. Restart the development server after changing `.env.local`, and run a
new production build before deployment.

When the value is absent, blank, whitespace-only, or the configured placeholder,
the site intentionally omits the form iframe and shows its not-connected state.

## Validation commands

All commands below reflect scripts in `package.json`.

| Purpose                   | Command                          | Notes                                                                                                                                           |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint source and tests     | `npm run lint`                   | Runs ESLint across the repository.                                                                                                              |
| TypeScript validation     | `npm run typecheck`              | Runs `tsc --noEmit`; it creates no JavaScript output.                                                                                           |
| Apply formatting          | `npm run format`                 | Runs Prettier with `--write` and changes files.                                                                                                 |
| Check formatting          | `npm run format:check`           | Runs Prettier without changing files.                                                                                                           |
| Unit tests                | `npm run test:unit`              | Runs the Vitest unit suite in `tests/unit`.                                                                                                     |
| Component tests           | `npm run test:component`         | Runs the Vitest component suite in `tests/component`.                                                                                           |
| Accessibility tests       | `npm run test:a11y`              | Runs Playwright tests tagged `@a11y`, including axe checks.                                                                                     |
| Browser/integration tests | `npm run test:e2e`               | Runs the complete Playwright suite in `tests/e2e`.                                                                                              |
| Responsive browser checks | `npm run test:e2e -- responsive` | Runs Playwright tests whose title/path matches `responsive`.                                                                                    |
| Production static build   | `npm run build`                  | Produces the deployable static bundle in `out/`.                                                                                                |
| Release browser checks    | `npm run test:e2e:release`       | Runs non-`@a11y` Playwright coverage; `validate:release` runs tagged axe checks separately.                                                     |
| Release validation        | `npm run validate:release`       | Runs every automated release gate in a fixed order, then inspects `out/` for static HTML, assets, links, claims, and runtime-only dependencies. |

Before a release, run the aggregate command from a clean working tree:

```sh
npm run validate:release
```

The release runner executes linting, TypeScript validation, formatting, unit
and property tests (including maintainability checks), component tests, tagged
axe accessibility checks, non-duplicative Playwright integration/responsive/
fallback checks, the production static build, and static-export inspection. It
sets `CI=1` for browser checks so Playwright starts an isolated local server
instead of reusing a potentially stale development server.

The browser suite starts the configured local development server on port 3100.
It covers current Chromium, Firefox, and WebKit projects when their browser
binaries are installed. Browser tests exercise responsive containment,
keyboard behavior, reduced motion, no-JavaScript fallbacks, and accessible
landmarks/controls.

## Build and static deployment

The production build uses `output: "export"` and static-compatible image
handling in `next.config.ts`:

```sh
npm run build
```

Publish `out/` as the static-host publish directory, or upload the **contents**
of `out/` to the web root. Serve the generated HTML, JavaScript, CSS, fonts,
and assets directly from the static host or CDN over HTTPS. Do not run
`next start` or provision a Node.js application server for this deployment;
there is no `start` script because the built site is static.

Before publishing, verify that the host configuration:

- maps the public domain and TLS certificate to the static site;
- serves `out/index.html` and static assets without rewriting away asset paths;
- permits only approved static assets and reviewed external origins;
- allows framing from the approved Microsoft Forms and briefing hosts only when
  the corresponding integration is enabled; and
- preserves new-tab external-link behavior and does not inject third-party
  scripts or external HTML.

The application does not proxy briefing content or Microsoft Forms, inject
external HTML, execute remote scripts, collect form fields, or store external
responses. An external host can block framing, and a parent page cannot
reliably inspect a cross-origin host's framing policy. Keep the visible
external recovery actions available and test them with the real approved host
before release.

## Editable content and configuration

For normal website updates, use only:

```text
src/content/site-manifest.ts
```

It is the single build-time master configuration for website text, section titles, image paths, the starter network topology, and default public content. Replace files in `public/` when needed, update their paths in the manifest, then run `npm run build`. You do not need to change a component file for normal content, logo, background, or image updates.

Read [`HOW-TO-UPDATE-THE-WEBSITE.md`](HOW-TO-UPDATE-THE-WEBSITE.md) for step-by-step instructions.

The files below are compatibility adapters used by the application and tests. Leave them unchanged for routine updates.

| What you want to change                                                                  | Normal update location                                            |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Website wording, section titles, cards, FAQs, starter topology, and optional image paths | `src/content/site-manifest.ts`                                    |
| Replace a logo file                                                                      | `public/branding/`                                                |
| Add a Hero, Architecture, or background image                                            | `public/images/` and then its matching path in `site-manifest.ts` |
| Add a downloadable PowerPoint briefing                                                   | `public/documents/` and `src/config/integration-config.ts`        |
| Change website navigation, motion, form connection, or technical deployment settings     | `src/config/`                                                     |

For everyday page content and asset updates, edit `site-manifest.ts` and the matching file under `public/`. The other files are technical settings and normally do not need to change.

### Logos, images, backgrounds, and briefings

If you do not write website code, use the plain-language guide:

[**How to update the GEMSTONE website**](HOW-TO-UPDATE-THE-WEBSITE.md)

It explains exactly where to put a logo, image, background, or briefing file, what to name it, and which line in `src/content/site-manifest.ts` to update before running `npm run build`.

Quick locations:

- Official logos: `public/branding/`
- Website images: `public/images/`
- Downloadable PowerPoint briefings: `public/documents/`
- Drafts and examples that must not appear publicly: `public/images/inspiration/`

Use only approved files. Do not place passwords, personal information, or unapproved material in public folders.

The website reads normal asset choices from `src/content/site-manifest.ts`. `src/config/asset-config.ts` only adds the correct deployment path during the build.

## Briefing and form integration checks

The briefing URL is centralized in `src/config/integration-config.ts`. The
literal `GEMSTONE_BRIEFING_URL_GOES_HERE`, a blank value, and whitespace-only
values are treated as missing and must not create an iframe. A valid reviewed
URL can expose the configured View, Download, and Open in New Tab actions.

Microsoft Forms reads `NEXT_PUBLIC_MICROSOFT_FORM_URL` at build time. The form
integration is external: this site does not duplicate fields, submit values,
read submissions, or store responses. A valid reviewed URL creates a lazy
iframe with an external fallback link. A missing or placeholder value creates
no iframe and preserves the not-connected fallback.

Test both states before a release:

1. **Missing configuration:** remove the local form setting and leave the
   briefing placeholder in place. Run the component and browser suites, then
   confirm the no-iframe fallback messages and available static content.
2. **Configured integration:** set an approved form URL in `.env.local` and
   replace the centralized briefing placeholder with an approved briefing URL.
   Restart local development or rebuild the static output. Confirm lazy iframe
   attributes, descriptive titles, View/Download/Open actions as configured,
   and external recovery links with the real host.
3. **Blocked or unsupported embedding:** verify the external recovery link,
   rather than claiming that the site can identify a cross-origin policy.

Do not commit `.env.local`, real credentials, or unreviewed external URLs.

## Rebuild and redeploy conditions

A static deployment must be rebuilt with `npm run build` and republished from
`out/` whenever any bundled input changes, including:

- TypeScript, CSS, page, component, content, or configuration changes;
- section visibility, navigation, metadata, public-release wording, footer
  settings, motion settings, design tokens, typography, or asset-path changes;
- adding, replacing, or removing files under `public/`;
- the centralized briefing URL changing; or
- `NEXT_PUBLIC_MICROSOFT_FORM_URL` changing, including clearing it to restore
  the missing-form fallback.

Changes made only to content hosted by an external briefing or Microsoft Forms
provider do not alter the exported site bundle. They still require external-host
review and a deployment-like integration check when they affect framing,
permissions, privacy, or user-visible behavior.

## Release gates

Before publication, an authorized release owner must:

1. Run the validation commands above and resolve failures.
2. Check internal anchors, mobile navigation, CTA destinations, keyboard
   operation, focus visibility, reduced motion, responsive containment,
   missing-image behavior, and configured/missing integration fallbacks.
3. Review page metadata, approved logo assets, all Public Claims, and the
   configured public-release statement against the approved source material.
4. Complete accessibility, privacy, cybersecurity, external-host, domain/TLS,
   Content Security Policy, and deployment-configuration reviews.

Do not publish until those reviews approve the actual content, external origins,
and static-host configuration.
