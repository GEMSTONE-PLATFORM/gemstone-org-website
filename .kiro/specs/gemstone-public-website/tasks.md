# Implementation Plan: GEMSTONE Public Website

## Overview

Implement the GEMSTONE public website as a static-export-compatible Next.js App Router application using TypeScript, Tailwind CSS, Framer Motion, Lucide React Icons, Vitest, React Testing Library, axe-based accessibility checks, and Playwright integration tests. The plan follows the approved design and refined requirements: typed content and configuration are created before presentation, pure state and mapping functions are tested before they are wired into client components, and every optional integration has a usable static fallback.

The implementation language is TypeScript. The site must remain a server-rendered, progressively enhanced single landing page with no backend, database, API route, server action, runtime secret, response storage, or unsupported public claim.

## Tasks

- [x] 1. Establish the Next.js application foundation and validation toolchain
  - [x] 1.1 Initialize the Next.js App Router project with TypeScript and the required dependencies: Tailwind CSS, Framer Motion, Lucide React Icons, Vitest, React Testing Library, `@testing-library/jest-dom`, `@axe-core/playwright`, and Playwright.
    - Add scripts for `dev`, `build`, `lint`, `typecheck`, `format`, `format:check`, `test:unit`, `test:component`, `test:a11y`, `test:e2e`, and `validate:release` without adding a server runtime.
    - Keep the initial application runnable with a minimal page and layout.
    - Verify with `npm install`, `npm run lint`, `npm run typecheck`, and `npm run build`.
    - _Requirements: 16.1, 16.2, 19.1, 19.6_

  - [x] 1.2 Configure static export and static asset handling.
    - Set `output: "export"`, configure static-compatible image behavior, and establish `public/branding`, `public/images/hero`, `public/images/architecture`, `public/images/backgrounds`, `public/images/inspiration`, and `public/documents` boundaries.
    - Ensure no route handler, API route, server action, middleware requiring a runtime, request-time data source, or runtime image optimizer is introduced.
    - Verify with `npm run build` and inspection that an exported `out` bundle is produced without a Node.js runtime requirement.
    - _Requirements: 16.1, 16.2, 16.3, 15.3_

  - [x] 1.3 Configure ESLint, Prettier, TypeScript no-emit validation, Vitest, React Testing Library, axe accessibility checks, and Playwright.
    - Create test setup files, browser/project configuration, deterministic test environment settings, and a minimal passing unit test.
    - Configure accessibility tests to cover semantic landmarks, focusability, names/roles/values, and contrast-related assertions where automation supports them.
    - Verify with `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run test:unit`, `npm run test:component`, `npm run test:a11y`, and the Playwright configuration check.
    - _Requirements: 13.9, 15.6, 19.1, 19.6, 19.7_

  - [x] 1.4 Define shared TypeScript contracts for content, site configuration, assets, integrations, motion, metadata, sections, links, architecture graphs, matrix relationships, and fallback states.
    - Include the design contracts for `FeatureItem`, `CapabilityItem`, `DifferentiatorItem`, `FAQItem`, `ArchitectureContent`, `SiteSections`, `SiteConfig`, `AssetConfig`, `BriefingConfig`, `IntegrationConfig`, `MotionIntensity`, and `MotionConfig`.
    - Use readonly arrays where content must not be mutated and model internal versus external links explicitly.
    - Verify with `npm run typecheck` and a type-level fixture test for valid and invalid representative values.
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 7.1, 9.2, 14.1, 17.7_

- [x] 2. Build the typed content, configuration, branding, and reference-asset boundaries
  - [x] 2.1 Create typed content files for the approved hero, About, Why GEMSTONE, architecture, Modeling and Simulation Matrix, ecosystem, analyst benefits, capabilities, differentiators, FAQs, footer, privacy placeholder, and public-release wording.
    - Keep all ownership, open-source, security, IL-level, air-gap, approval-time, deployment-time, distribution, and availability wording in reviewable content data.
    - Use only wording from `kiroprompt.md`, `design.md`, and the extracted approved content from `initial-images/GEMSTONEInfo.pptx`; do not add claims.
    - Verify with content fixture tests that required exact hero copy, FAQ entries, and approved differentiator identifiers exist.
    - _Requirements: 2.1, 4.1, 4.2, 4.7, 5.1, 5.2, 5.3, 6.1, 7.1, 7.4, 7.5, 8.1, 8.2, 8.3, 9.1, 12.1, 12.6_

  - [x] 2.2 Create centralized site, navigation, asset, integration, motion, and SEO configuration.
    - Define enabled sections and navigation target IDs, approved metadata defaults, public-release configuration, optional footer destinations, logo paths, motion intensity defaults, small-screen motion behavior, briefing URL placeholder, briefing actions, and `NEXT_PUBLIC_MICROSOFT_FORM_URL` build-time input.
    - Keep the briefing URL in one configuration value and treat blank, whitespace-only, and the approved placeholder as missing.
    - Verify with `npm run typecheck` and configuration fixture tests that no URL or metadata value is duplicated in section components.
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 3.1, 8.3, 10.1, 11.2, 14.1, 17.1, 17.2, 17.3, 17.7_

  - [x] 2.3 Add branding placeholders and reference-material handling without treating reference assets as production content.
    - Add approved-logo placeholder locations and safe text/mark fallback references under `public/branding` without recreating or altering the official logo.
    - Preserve `initial-images/GEMSTONEInfo.pptx` as source/reference material only; document that it informs approved content and visual direction but is not rendered as a production image, logo, or branded UI.
    - Add the supplied screenshots or extracted visual references only to the inspiration boundary when needed, with no production import path.
    - Verify with a static asset test or repository check that no component imports `initial-images/GEMSTONEInfo.pptx` and that branding paths are configuration-driven.
    - _Requirements: 1.4, 1.5, 1.6, 2.3, 18.1, 18.2_

  - [x] 2.4 Write property tests for typed source boundaries.
    - **Property 3: Content array rendering is non-mutating.** Generate valid capability, differentiator, FAQ, feature, and navigation arrays and assert rendering/mapping leaves the source arrays and entries structurally unchanged.
    - **Property 4: Typed content is the claim source.** Assert every rendered public claim equals an approved Content_Repository or Configuration_Repository value and is not generated from an unapproved presentation string.
    - **Validates: Requirements 2.1, 2.6, 8.1, 8.3, 9.2, 17.7**
    - Verify with `npm run test:unit -- content`.

- [x] 3. Create the visual foundations and reusable UI primitives
  - [x] 3.1 Implement centralized GEMSTONE design tokens, Tailwind mappings, typography, focus styles, responsive containers, dark layered surfaces, controlled cyan/blue illumination, grid/network treatments, and reduced-motion CSS fallbacks.
    - Keep raw colors out of section components and verify semantic token use across normal, hover, focus, disabled, and reduced-motion states.
    - Establish responsive styles for 320, 375, 768, 1024, 1440, and 1920 CSS pixels without intentional horizontal overflow.
    - Verify with `npm run typecheck`, `npm run lint`, and component snapshots or style assertions for focus and reduced-motion selectors.
    - _Requirements: 1.2, 1.3, 2.7, 13.2, 13.7, 13.8, 13.9, 14.4, 14.5, 15.1, 15.2, 15.5_

  - [x] 3.2 Implement reusable `SectionContainer`, `SectionHeading`, `Button`, `Card`, icon resolution, status/fallback, responsive media, and external-link primitives.
    - Make controls semantic, keyboard operable, visibly focused, approximately 44 by 44 CSS pixels where practical, and safe for new-tab behavior.
    - Give fallback primitives slots for approved explanatory text and recovery links without inventing claims.
    - Verify with React Testing Library and axe tests for names, roles, focus indicators, heading relationships, and link attributes.
    - _Requirements: 1.3, 5.7, 6.8, 8.3, 10.8, 11.8, 13.2, 13.3, 13.7, 16.8, 18.8_

  - [x] 3.3 Add component-level visual and interaction test helpers for responsive viewport setup, reduced-motion preference, keyboard activation, and static fallback assertions.
    - Keep helpers framework-neutral enough for server-rendered and client-island tests.
    - Verify with a passing representative component test at mobile and desktop viewport sizes.
    - _Requirements: 13.1, 13.3, 13.8, 14.3, 14.4, 15.1, 15.2, 19.6, 19.7_

- [x] 4. Assemble the accessible page shell, navigation, and footer
  - [x] 4.1 Implement the explicit section registry and `src/app/page.tsx` composition in approved order.
    - Render only enabled sections, keep the page-level `h1` unique, pass typed content/configuration into sections, and preserve meaningful server-rendered HTML before hydration.
    - Keep page composition free of marketing copy, raw colors, integration URLs, or section-specific interaction logic.
    - Verify with a server-rendered component test and `npm run build`.
    - _Requirements: 1.1, 2.8, 3.9, 16.3, 18.6_

  - [x] 4.2 Implement the skip link, semantic landmarks, section IDs, stable `main` target, focus-visible styling, and page-level heading hierarchy.
    - Ensure every enabled section has a labeled heading and every internal target has a unique stable ID.
    - Verify with axe, keyboard component tests, and an exported HTML inspection that the skip link and main target are present without client JavaScript.
    - _Requirements: 3.8, 13.1, 13.2, 13.3, 13.9, 16.3, 18.6_

  - [x] 4.3 Implement the sticky responsive header and desktop/mobile navigation.
    - Include the official logo, enabled About/Architecture/Capabilities/Differentiators/FAQ/Briefing/Request Information targets, active-section support, stable layout footprint, configured scroll transition, `aria-expanded`, `aria-controls`, focus entry/return, Escape close, and link-triggered mobile close.
    - Omit links for disabled sections and map Contact only to an approved enabled target.
    - Verify with component and keyboard tests for focus management, Escape, Enter/Space, disabled target filtering, anchor resolution, and no layout-footprint change.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9, 12.2, 12.3, 13.3_

  - [x] 4.4 Implement the configurable footer with GEMSTONE identity, full name, release statement, approved links, optional privacy/accessibility/logo/social/copyright/back-to-top elements, and empty-value filtering.
    - Ensure no empty social link, empty external destination, or unsupported optional label is emitted.
    - Verify with component tests for enabled/disabled targets, configured/empty optional values, public-release rendering, and new-tab link safety.
    - _Requirements: 8.6, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 16.8_

  - [x] 4.5 Write the section visibility property test.
    - **Property 1: Section visibility is configuration-equivalent.** For every valid `SiteSections` configuration, assert enabled sections render exactly once and disabled sections render zero times.
    - **Validates: Requirements 2.8, 3.9**
    - Verify with `npm run test:unit -- sections`.

  - [x] 4.6 Write the navigation integrity property test.
    - **Property 2: Enabled navigation targets resolve uniquely.** For every valid navigation collection and section configuration, assert each internal link resolves to exactly one enabled section and no link targets a missing or disabled section.
    - **Validates: Requirements 3.2, 3.9, 12.2**
    - Verify with `npm run test:unit -- navigation`.

  - [x] 4.7 Write the optional-footer filtering property test.
    - **Property 13: Optional footer values do not create empty links.** Generate footer configurations containing absent, blank, and non-empty optional values and assert only approved non-empty values render.
    - **Validates: Requirements 12.4, 12.5**
    - Verify with `npm run test:unit -- footer`.

- [x] 5. Implement the hero and GEMSTONE introduction
  - [x] 5.1 Implement `HeroSection` with the exact approved headline and subheadline, CTA anchors, ecosystem labels, layered network visualization, readable content layer, and static no-animation/no-image fallback.
    - Represent organizations, environments, Nodes, tools, data, compute, models, simulations, users, and Hub services with labeled content or equivalent text; keep decorative paths hidden from assistive technology when not informational.
    - Keep Request Information and View Briefing targets aligned with enabled sections.
    - Verify with component tests for exact copy, CTA destinations, heading count, static fallback, and reduced-motion rendering.
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 13.4, 14.2, 14.6, 18.2_

  - [x] 5.2 Implement `AboutSection` for “What is GEMSTONE?” with the approved definition and an accessible Organizations/Tools/Data/Compute/GEMSTONE relationship representation.
    - Use a responsive visual enhancement plus equivalent labeled DOM content; do not imply replacement of existing environments or central ownership of all data.
    - Verify with component and axe tests with animation enabled, reduced, and unavailable.
    - _Requirements: 4.7, 6.6, 6.7, 7.6, 13.1, 13.6, 14.4, 18.6_

  - [x] 5.3 Write hero and About component tests.
    - Assert exact approved headline, definition, subheadline, internal CTA links, one page-level `h1`, accessible labels, no hover-only explanation, and static content availability before hydration.
    - Verify with `npm run test:component -- HeroSection AboutSection` and `npm run test:a11y -- HeroSection AboutSection`.
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 13.1, 13.3, 16.3, 18.6_

- [x] 6. Implement Why GEMSTONE, capabilities, and differentiators
  - [x] 6.1 Implement `WhyGemstoneSection` with Bring Your Own Environment, Controlled Collaboration, Security First, and Reuse Instead of Rebuild.
    - Use typed data, non-color-only icons or text, readable descriptions, focus behavior, and restrained hover illumination that is not required for comprehension.
    - Verify with component and axe tests for all four approved items and keyboard focus.
    - _Requirements: 5.1, 5.2, 5.7, 13.3, 13.6, 14.2_

  - [x] 6.2 Implement the generic `CapabilitiesSection` from the approved typed capability array.
    - Render Scalable Adoption, Controlled Proprietary Data, Marketplace Integration, and Data Transformation without item-specific branches; preserve approved descriptions about existing environments, organizational boundaries, tools, and CI/CD-style transformation.
    - Verify by adding a fixture capability and asserting it renders without component changes, plus component and accessibility tests.
    - _Requirements: 2.6, 5.3, 5.4, 5.5, 5.6, 5.7, 13.3, 13.6_

  - [x] 6.3 Implement the generic `DifferentiatorsSection` from the reviewable approved claims array.
    - Include government-owned open source, air-gap deployment, secure libraries, multiple security layers including IL-7, distribution pipeline, approval within minutes, tailored environments in one day, unified plugin system, hardened Python libraries, API-consumable model/simulation services, SDK extensibility, and distributed simulations.
    - Add review indicators without inventing additional security, accreditation, performance, partnership, or availability claims.
    - Verify with claim fixture tests and component/axe tests for every approved differentiator.
    - _Requirements: 2.6, 8.1, 8.2, 8.3, 8.5, 13.3, 13.6_

  - [x] 6.4 Write unit and component tests for Why GEMSTONE, capabilities, and differentiators.
    - Assert array-driven rendering, non-color-only meaning, exact approved wording, stable IDs, keyboard operability, and no hover dependency.
    - Verify with `npm run test:component -- WhyGemstoneSection CapabilitiesSection DifferentiatorsSection` and axe checks.
    - _Requirements: 2.6, 5.1, 5.2, 5.3, 5.7, 8.1, 8.2, 8.5, 13.3, 13.6_

- [x] 7. Implement architecture, Modeling and Simulation Matrix, and ecosystem explanations
  - [x] 7.1 Implement pure architecture graph validation and selection utilities.
    - Validate unique entity IDs, valid Hub/Node/Client kinds, valid connection endpoints, selected-entity lookup, and null behavior for unknown IDs without mutating content.
    - Verify with unit tests for valid graphs, disconnected or malformed fixtures, unknown selections, and immutability.
    - _Requirements: 6.1, 6.5, 6.8, 6.9, 13.6_

  - [x] 7.2 Write the architecture graph endpoint property test.
    - **Property 5: Architecture graph endpoints are valid.** Generate valid graphs and assert every connection endpoint refers to a declared entity and every selection is a declared entity or null.
    - **Validates: Requirements 6.1, 6.5, 6.8**
    - Verify with `npm run test:unit -- architecture-graph`.

  - [x] 7.3 Implement the accessible `ArchitectureDiagram` and `ArchitectureSection`.
    - Provide labeled Hub, Node, and Client entities, legend, visible detail panel, keyboard focus and Enter/Space activation, selected-connection emphasis, restrained status announcement, responsive SVG/stacked representation, and static readable relationship list.
    - Describe Hub as service/connection point, Nodes as tailorable mission/team/community backbones, Clients as user-facing resources, and distributed ownership without central-data-store language.
    - Verify with component and axe tests for mouse, keyboard, screen-reader text, reduced motion, and non-rendering fallback.
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.6, 13.3, 13.6, 14.2, 18.2_

  - [x] 7.4 Write the distributed-architecture semantics property test.
    - **Property 6: Architecture representation preserves distributed semantics.** For every valid architecture content model, assert accessible output includes Hub, Node, Client, local organizational/Node ownership, and no central-data-store or all-data-centralization label.
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.6, 6.7, 7.6**
    - Verify with `npm run test:unit -- architecture-semantics`.

  - [x] 7.5 Implement the Modeling and Simulation Matrix and ecosystem content presentation.
    - Explain multiple environments within an organization, mission-specific Nodes for different communities or missions, Clients subscribing to one or more Nodes, secure subscription, data exchange, information sharing, digital supply chains, meshing across government and industry, and approved analyst benefits.
    - Distinguish organizations, environments, Nodes, Clients, and shared connections without implying replacement or universal centralization; provide readable content when visualization is unavailable.
    - Verify with content and component tests for all approved relationships and benefits.
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 18.2, 18.7_

  - [x] 7.6 Write the matrix relationship property test.
    - **Property 7: Matrix relationships remain referentially valid.** Generate valid matrix models and assert every Node/Client subscription refers to a declared Node and every displayed identity remains stable.
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.6**
    - Verify with `npm run test:unit -- matrix`.

  - [x] 7.7 Write architecture and matrix component/accessibility tests.
    - Assert equivalent desktop/mobile information, valid labels and relationships, focus activation, Escape/selection behavior, static fallback, and no prohibited centralization wording.
    - Verify with `npm run test:component -- ArchitectureSection MatrixSection` and `npm run test:a11y -- ArchitectureSection MatrixSection`.
    - _Requirements: 6.5, 6.8, 6.9, 7.4, 7.5, 7.7, 13.3, 13.6, 14.4_

- [x] 8. Implement the FAQ accordion
  - [x] 8.1 Implement pure FAQ state transition utilities for known and unknown IDs.
    - Keep multiple items open as permitted by the design, preserve answer content, and synchronize expanded state, control IDs, panel IDs, and visibility state.
    - Verify with unit tests for open, close, repeated toggle, unknown ID, and reduced-motion state handling.
    - _Requirements: 9.2, 9.3, 9.5, 9.6, 14.4_

  - [x] 8.2 Write the FAQ state synchronization property test.
    - **Property 8: FAQ state remains synchronized.** For any FAQ collection and sequence of known or unknown toggles, assert only known items change and each control/panel/state relationship remains synchronized.
    - **Validates: Requirements 9.2, 9.3, 9.5**
    - Verify with `npm run test:unit -- faq-state`.

  - [x] 8.3 Implement the accessible `Accordion` and `FAQSection` with approved questions and answers.
    - Use native buttons, stable IDs, `aria-expanded`, `aria-controls`, controlled panels, appropriate region labels, Enter/Space activation, visible focus, and static/correct behavior when Framer Motion is unavailable or reduced motion is active.
    - Verify with component and axe tests for pointer, keyboard, assistive-technology attributes, and reduced motion.
    - _Requirements: 9.1, 9.3, 9.4, 9.5, 9.6, 13.3, 14.4, 18.6_

  - [x] 8.4 Write FAQ integration tests.
    - Assert the independent typed FAQ array drives all rendered questions, expanded answers remain in the DOM relationship, and no answer depends on hover or animation.
    - Verify with `npm run test:component -- FAQSection` and `npm run test:a11y -- FAQSection`.
    - _Requirements: 2.6, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 9. Implement briefing and Microsoft Forms integrations with safe fallbacks
  - [x] 9.1 Implement pure integration URL/state resolution and external-link helpers.
    - Treat absent, blank, whitespace-only, and exact placeholder briefing/form URLs as missing; distinguish missing, idle, loading, loaded, blocked, and unsupported states; produce no iframe target for missing configuration.
    - Keep external URLs in centralized configuration and validate new-tab attributes and accessible indications.
    - Verify with unit tests for all URL forms and state transitions.
    - _Requirements: 10.1, 10.2, 10.7, 11.2, 11.3, 16.5, 16.8, 18.3, 18.4_

  - [x] 9.2 Write the missing-integration property test.
    - **Property 10: Missing integration configuration is non-embeddable.** For any absent, blank, whitespace-only, or exact placeholder briefing/form URL, assert missing state and no iframe request target.
    - **Validates: Requirements 10.1, 10.2, 11.2, 11.3, 18.3, 18.4**
    - Verify with `npm run test:unit -- integration-state`.

  - [x] 9.3 Implement `BriefingSection` and `MediaViewer` using one centralized briefing configuration value.
    - Render title, description, document-format indicator, View Briefing, optional Download Briefing, optional Open in New Tab, loading state, lazy/proximity or interaction-triggered loading, blocked/unsupported/timeout fallback, responsive frame, and readable external recovery.
    - Never claim to inspect cross-origin framing policy; keep external viewing available and apply `target="_blank"` with `rel="noopener noreferrer"` plus accessible new-tab text.
    - Verify with component tests for missing, valid, loading, loaded, blocked, unsupported, timeout, download-disabled, and new-tab states.
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 15.4, 18.3, 18.5_

  - [x] 9.4 Implement `RequestInformationSection` and `MicrosoftFormEmbed` using `NEXT_PUBLIC_MICROSOFT_FORM_URL`.
    - Render the exact approved title and subtitle, missing/not-connected state without an iframe, configured responsive lazy iframe with descriptive title/loading state, privacy-notice placeholder, and Open Request Information Form external fallback.
    - Do not duplicate fields, read or store form responses, inject iframe CSS, or add backend behavior.
    - Verify with component tests for absent/configured/placeholder URLs, iframe attributes, external fallback, privacy placeholder, and no response-handling code.
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 15.4, 16.4, 18.4, 18.5_

  - [x] 9.5 Write the integration recovery property test.
    - **Property 11: Configured integration has a recovery action.** For every valid briefing or Microsoft Forms URL and modeled blocked, timed-out, or unsupported state, assert a clearly labeled external recovery link exists.
    - **Validates: Requirements 10.3, 10.6, 11.4, 11.6**
    - Verify with `npm run test:unit -- integration-recovery`.

  - [x] 9.6 Write the new-tab external-link safety property test.
    - **Property 12: New-tab external links are safe.** For every rendered new-tab external link, assert `rel="noopener noreferrer"` and an accessible indication of new-tab behavior.
    - **Validates: Requirements 10.8, 11.8, 16.8**
    - Verify with `npm run test:unit -- external-links`.

  - [x] 9.7 Write integration tests for configured and missing briefing/form flows.
    - Use Playwright fixtures or controlled local test pages to verify no empty iframe is rendered for missing configuration, lazy loading occurs only when appropriate, external recovery actions remain available, and configured URLs are not proxied or stored.
    - Verify with `npm run test:e2e -- integrations`.
    - _Requirements: 10.2, 10.5, 10.6, 11.3, 11.4, 11.6, 15.4, 16.4, 18.3, 18.4, 18.5_

- [x] 10. Apply centralized motion, reduced-motion, performance, and browser-support behavior
  - [x] 10.1 Implement motion configuration and pure motion resolution.
    - Support `reduced`, `standard`, and `enhanced`, default to `standard`, honor `prefers-reduced-motion`, disable continuous small-screen background motion when configured, and bound durations/effects.
    - Verify with unit tests for every configured intensity, preference combination, and small-screen setting.
    - _Requirements: 2.5, 14.1, 14.3, 14.4, 14.5, 14.7_

  - [x] 10.2 Write the reduced-motion precedence property test.
    - **Property 9: Reduced-motion preference has precedence.** For every configured intensity, assert a reduced-motion preference resolves to `reduced`; without the preference, the configured intensity is preserved.
    - **Validates: Requirements 14.1, 14.3, 14.4**
    - Verify with `npm run test:unit -- motion`.

  - [x] 10.3 Wire purposeful motion into hero, section reveals, network paths, architecture, cards, FAQ, buttons, header, and background layers with static fallbacks.
    - Import Framer Motion only in narrowly scoped client components, prefer transform/opacity, avoid unbounded particles/video, keep text/CTAs readable, and preserve all interaction outcomes without animation.
    - Verify with component tests under reduced motion and a production bundle inspection for client-island scope.
    - _Requirements: 1.2, 1.3, 4.5, 4.6, 6.8, 9.6, 13.9, 14.2, 14.4, 14.6, 14.7, 15.5, 15.7, 18.7_

  - [x] 10.4 Add performance and browser-support checks.
    - Add Playwright checks for supported viewport widths, no horizontal overflow, keyboard navigation, focus visibility, reduced-motion behavior, and browser-compatible fallbacks; add bundle/static asset assertions for deferred integrations and bounded effects.
    - Verify with `npm run test:e2e -- responsive` and the production build.
    - _Requirements: 13.7, 13.8, 13.9, 14.7, 15.1, 15.2, 15.4, 15.5, 15.6, 15.7, 19.7_

- [x] 11. Implement SEO metadata, image strategy, and static-export content preservation
  - [x] 11.1 Implement `buildMetadata` through the Next.js Metadata API from centralized approved configuration.
    - Emit the approved title and description, canonical only when configured, Open Graph image only when configured, and favicon/brand reference when available; never construct metadata from component prose.
    - Verify with metadata unit tests and exported HTML inspection.
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

  - [x] 11.2 Write the metadata mapping property test.
    - **Property 14: Metadata mirrors approved configuration.** For every valid metadata configuration, assert generated title, description, canonical, Open Graph image, and favicon values equal approved configuration and absent optionals produce no unsupported metadata.
    - **Validates: Requirements 17.1, 17.4, 17.5, 17.6, 17.7**
    - Verify with `npm run test:unit -- metadata`.

  - [x] 11.3 Implement responsive/static asset loading and failure behavior.
    - Use explicit image dimensions, appropriate `sizes`, lazy/deferred loading for non-critical assets, meaningful alt text for content images, empty alt/hidden semantics for decoration, and static gradient/grid/network fallbacks for missing images.
    - Keep official logos authoritative and preserve aspect ratio, transparency, resolution, and brand colors.
    - Verify with component tests, image attribute assertions, and an exported asset inspection.
    - _Requirements: 1.4, 13.4, 15.3, 15.4, 18.1, 18.2_

  - [x] 11.4 Add static-export inspection tests.
    - Assert exported HTML contains meaningful headings, approved copy, section anchors, static architecture explanation, FAQ content, and external fallback links before client hydration.
    - Assert no runtime-only APIs, secret values, server actions, route handlers, request-time data, or response storage paths are present.
    - Verify with `npm run build` followed by `npm run test:e2e -- export`.
    - _Requirements: 16.2, 16.3, 16.4, 16.5, 16.7, 18.6, 19.6, 19.7_

  - [x] 11.5 Write an end-to-end accessibility and reflow test matrix.
    - Cover semantic landmarks, one `h1`, keyboard navigation, mobile menu focus, FAQ and architecture controls, iframe titles, external-link labels, zoom/reflow containment, and viewport widths 320, 375, 768, 1024, 1440, and 1920.
    - Verify with `npm run test:a11y` and `npm run test:e2e -- accessibility responsive`.
    - _Requirements: 3.5, 3.6, 3.8, 6.8, 9.3, 9.5, 13.1, 13.2, 13.3, 13.5, 13.7, 13.8, 13.9, 15.1, 15.2, 15.6, 19.7_

- [x] 12. Complete fallback composition and configuration-isolation coverage
  - [x] 12.1 Implement shared failure/fallback composition for missing logo, missing image, unavailable animation, unavailable JavaScript, missing briefing/form URLs, blocked embeds, unsupported documents, and unavailable observers.
    - Preserve headings, approved copy, internal anchors, static architecture explanation, configuration-safe messages, and available external recovery actions without misleading success states or unsupported claims.
    - Verify with component fixtures for every fallback state and with no-JavaScript exported HTML inspection.
    - _Requirements: 4.6, 6.9, 7.7, 10.2, 10.6, 11.3, 11.6, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8_

  - [x] 12.2 Write the fallback comprehension property test.
    - **Property 15: Fallbacks preserve required comprehension.** For every valid fallback model, assert required headings, approved copy, internal anchors, static architecture explanation, and available recovery actions remain present.
    - **Validates: Requirements 4.6, 6.9, 7.7, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7**
    - Verify with `npm run test:unit -- fallbacks`.

  - [x] 12.3 Write the configuration-isolation property test.
    - **Property 16: Configuration changes preserve unrelated output.** For any valid fixture and single approved change to a content array, Design_Token, section visibility flag, logo path, briefing URL, or Microsoft Forms URL, assert the affected output changes while unrelated rendered structure remains unchanged.
    - **Validates: Requirements 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 10.1, 11.2**
    - Verify with `npm run test:unit -- configuration-isolation`.

  - [x] 12.4 Add fallback integration tests for missing assets, disabled JavaScript, reduced motion, disabled sections, and configured/missing external integrations.
    - Verify that every fallback is understandable, no empty iframe or empty optional link is emitted, and no fallback includes secrets or unsupported claims.
    - Verify with `npm run test:component -- fallbacks` and `npm run test:e2e -- fallback-matrix`.
    - _Requirements: 2.8, 4.6, 6.9, 7.7, 10.2, 11.3, 14.4, 16.3, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8_

- [x] 13. Complete maintainability documentation and deployment guidance
  - [x] 13.1 Write `README.md` with installation, local development, linting, TypeScript validation, unit/component/accessibility/integration tests, formatting, production build, static deployment, and rebuild/redeploy conditions.
    - Document where to edit hero/About/capability/differentiator/FAQ/footer/navigation/Public_Claim/public-release content and how to add array entries without changing components.
    - Document logo replacement, approved imagery, inspiration-only treatment of `initial-images/GEMSTONEInfo.pptx`, design tokens, typography, motion intensity, section toggles, briefing URL, and Microsoft Forms configuration.
    - _Requirements: 19.1, 19.2, 19.3, 19.4_

  - [x] 13.2 Add `.env.example` with `NEXT_PUBLIC_MICROSOFT_FORM_URL=` and document static-host deployment guidance.
    - Include HTTPS, domain/TLS, Content Security Policy, approved static assets, Microsoft Forms framing, briefing-host framing, external-origin review, and the fact that public environment changes require a rebuild.
    - Explicitly document that secrets must not be placed in source, public assets, or `NEXT_PUBLIC_*` values, and that the site does not proxy or store external responses.
    - Verify with a repository secret scan and documentation check.
    - _Requirements: 16.4, 16.5, 16.6, 16.7, 19.4, 19.5_

  - [x] 13.3 Add maintainability checks for content/config separation.
    - Add a repository test or lint rule that flags hardcoded approved public claims, integration URLs, raw component colors, and duplicated navigation targets outside their designated boundaries.
    - Verify with `npm run test:unit -- maintainability` and `npm run lint`.
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 8.3, 10.1, 11.2, 17.7, 19.2, 19.3_

- [x] 14. Run final automated validation and complete release-readiness review
  - [x] 14.1 Implement the `validate:release` command and release checklist runner.
    - Run lint, typecheck, formatting check, unit tests including property tests, component tests, axe accessibility checks, Playwright integration/responsive/export tests, production static build, internal-link checks, and metadata/claim fixture checks.
    - Fail clearly on missing required checks, unresolved TypeScript errors, horizontal overflow, missing fallback actions, empty optional links, unsafe new-tab links, unsupported claims, or non-static runtime dependencies.
    - Verify with `npm run validate:release` from a clean working tree.
    - _Requirements: 13.9, 15.7, 16.1, 16.2, 17.1, 18.8, 19.6, 19.7_

  - [x] 14.2 Complete the final review task and record release gates in `README.md` or a review artifact.
    - Review public-release statement and every Public_Claim against `kiroprompt.md`, `design.md`, and the approved slide-deck content; confirm no unsupported ATO, accreditation, certification, classified-network authorization, commercial endorsement, sponsorship, partnership, guaranteed availability, or guaranteed performance claim exists.
    - Review privacy behavior to confirm Microsoft Forms fields/responses remain external; review cybersecurity boundaries, CSP guidance, secret handling, external-host framing and fallback behavior; review accessibility, keyboard/focus/reflow/reduced-motion behavior; review static deployment, HTTPS/TLS, metadata, external-origin configuration, and rebuild requirements.
    - Keep this review as a release-readiness gate only; do not deploy to production or add unsupported backend features.
    - Verify by attaching the completed automated validation output and documenting any manual review requiring an authorized release owner.
    - _Requirements: 8.1, 8.3, 8.5, 8.6, 11.5, 13.9, 14.3, 15.6, 16.4, 16.5, 16.6, 16.7, 17.7, 19.7, 19.8_

  - [x] 14.3 Final checkpoint: ensure all automated tests, formatting, type validation, static export, and release checks pass; leave the repository ready for implementation task execution and ask the user if any release-gate question remains.
    - _Requirements: 19.6, 19.7, 19.8_

## Notes

- Tasks marked with `*` are optional property-based or supplemental test tasks and can be skipped for a faster MVP; all non-optional implementation and validation tasks remain required.
- Every public claim, URL, logo reference, metadata value, section toggle, motion value, and optional footer value must remain in its designated typed content or configuration boundary.
- `initial-images/GEMSTONEInfo.pptx` is approved reference/source material only. It must not be rendered as a production image, treated as a logo, or used to introduce claims outside the approved source content.
- The design contains correctness properties, so each design property is represented by its own property-test sub-task. Property 16 is also included because the refined requirements define it as a cross-boundary configuration invariant.
- The implementation must not add a backend, database, API route, server action, authentication flow, telemetry pipeline, response store, proxy, or claims not present in the approved sources.
- Checkpoints verify the project remains buildable and testable after each major implementation wave.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4", "3.1"] },
    { "id": 4, "tasks": ["3.2", "4.1"] },
    { "id": 5, "tasks": ["3.3", "4.2", "4.3", "4.4"] },
    { "id": 6, "tasks": ["4.5", "4.6", "4.7"] },
    { "id": 7, "tasks": ["5.1", "5.2", "6.1", "6.2", "6.3"] },
    { "id": 8, "tasks": ["5.3", "6.4", "7.1", "8.1", "9.1", "10.1", "11.1"] },
    { "id": 9, "tasks": ["7.2", "7.3", "8.2", "9.2", "11.2", "12.1"] },
    { "id": 10, "tasks": ["7.4", "7.5", "8.3", "9.3", "9.4", "10.2", "11.3", "11.4"] },
    { "id": 11, "tasks": ["7.6", "7.7", "8.4", "9.5", "9.6", "10.3", "10.4", "11.5", "12.2"] },
    { "id": 12, "tasks": ["9.7", "12.3", "12.4", "13.1", "13.2", "13.3"] },
    { "id": 13, "tasks": ["14.1"] },
    { "id": 14, "tasks": ["14.2"] },
    { "id": 15, "tasks": ["14.3"] }
  ]
}
```
