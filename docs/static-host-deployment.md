# Static-host deployment guidance

GEMSTONE is built as a static export. `npm run build` produces the deployable `out/` directory. Deploy that directory to an approved static host or CDN. The deployed site does not require a Node.js application server, API route, database, proxy, or response store.

## Build-time configuration

Microsoft Forms is configured only through the optional public build variable in `.env.example`:

```text
NEXT_PUBLIC_MICROSOFT_FORM_URL=
```

Set the reviewed Microsoft Forms URL in the static-host or CI build environment before running `npm run build`. Do not commit a populated `.env` file.

`NEXT_PUBLIC_*` values are embedded in the generated browser assets. They are visible to every site visitor and must never contain secrets, credentials, tokens, internal-only URLs, or other sensitive values. A URL change, including setting, removing, or replacing `NEXT_PUBLIC_MICROSOFT_FORM_URL`, requires a new build and redeployment of `out/`. Purge or version CDN-cached assets as required by the hosting platform so the new build is served consistently.

The briefing URL is deliberately not an environment variable. Update the single reviewed value in `src/config/integration-config.ts` only after external-host approval. Changing that value also requires a new static build and deployment.

## Deployment procedure

1. Review the approved static assets under `public/`. Use official branding only from `public/branding/` and approved production imagery only from `public/images/`. `initial-images/` remains source and inspiration material; it is not a production asset path.
2. Configure the reviewed Microsoft Forms URL in the build environment if the form should be enabled. Leave it unset to publish the intentional not-connected state without an iframe.
3. Run the production build: `npm run build`.
4. Publish the generated `out/` directory to the approved static host or CDN. Do not deploy `.next/`, source files, `.env` files, or repository metadata as public site assets.
5. Associate the approved domain, enable TLS with a valid certificate, redirect HTTP to HTTPS, and verify the canonical public URL after deployment.
6. Test the deployed site over HTTPS, including the missing and configured form states, briefing fallback actions, internal links, and browser console/network policy errors.

## Content Security Policy and external origins

Set a deployment-level Content Security Policy (CSP) before release. Start from a restrictive same-origin policy for static site assets and allow only explicitly reviewed origins.

- Permit scripts, styles, fonts, images, and other static assets from the site origin and any approved CDN origin only.
- Set `frame-src` to the exact approved Microsoft Forms origin and the exact approved briefing-host origin when those integrations are enabled. Do not use wildcard frame origins.
- Restrict `frame-ancestors` to the approved embedding policy for this public site, set `object-src 'none'`, and use `base-uri 'self'` unless an approved deployment need requires otherwise.
- Do not add broad `*` source allowances, unreviewed analytics hosts, remote script hosts, or unapproved asset origins merely to suppress CSP errors.
- Validate the finalized policy against the generated static site in a staging deployment. Next.js-generated assets and the selected static-host/CDN configuration may require narrowly scoped, reviewed policy adjustments.

Microsoft Forms and briefing documents remain external origins. Confirm during external-host review that each approved URL uses HTTPS and can be opened by intended visitors. Test framing in staging because the site cannot reliably inspect cross-origin framing policy. If an external host blocks or cannot provide a usable iframe, the site must retain its labeled external-open recovery action.

The site does not proxy, scrape, inject, execute, collect, or store Microsoft Forms responses, briefing content, or any other external-origin response. Do not add a backend or client-side remote-script integration to bypass external-host restrictions.

## Release security checks

Before publishing, confirm that:

- no secrets appear in source files, `public/`, `.env.example`, build logs, or any `NEXT_PUBLIC_*` value;
- all external URLs and origins are reviewed and approved for public release;
- deployed static assets are approved and do not include inspiration-only or internal source material;
- HTTPS, domain, TLS, CSP, Microsoft Forms framing, and briefing-host framing have been verified in the deployment environment; and
- a fresh build and redeployment occurred after every public configuration change.
