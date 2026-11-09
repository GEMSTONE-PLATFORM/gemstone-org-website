# GEMSTONE Public Website
## Kiro Development Brief

Build a modern, visually stunning, production-quality public website for **GEMSTONE**, the **Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem**.

The website must present GEMSTONE as a forward-leaning, government-owned digital engineering and modeling and simulation ecosystem.

The site should be appropriate for:

- Government
- Department of War users
- Industry
- Academia
- International partners
- Engineering organizations
- Modeling and simulation communities
- Technical and non-technical decision-makers

The finished website must **not look like a conventional government website or today's typical defense-technology website**.

GEMSTONE should represent **where digital engineering, modeling and simulation, distributed compute, data, and connected technical environments are going next**.

The experience should be immersive, sophisticated, technically credible, visually memorable, and distinctly GEMSTONE.

---

# 1. Overall Design Direction

Create an original visual identity for GEMSTONE that feels **more forward-leaning than today's traditional government, aerospace, and defense-technology websites**.

Do not imitate the visual language of existing defense-technology companies.

GEMSTONE should feel like it is establishing the next visual language for government digital engineering rather than following an existing commercial design trend.

## Design Inspiration

Take broad visual inspiration from:

- Microsoft's modern technology experiences and polished enterprise interfaces
- Advanced aerospace and digital engineering environments
- Mission-control interfaces
- Scientific and engineering visualization
- Large-scale distributed system visualization
- Digital twins
- High-performance computing
- Secure distributed networks
- Modern data visualization
- **TRON-inspired digital environments**

TRON should influence the site's **atmosphere**, particularly:

- Luminous network lines
- Glowing data pathways
- Digital grids
- Connected nodes
- Layered depth
- Controlled cyan and electric-blue illumination
- Dark digital environments
- Movement of information through interconnected systems
- Smooth, deliberate motion

Use TRON only as **creative and atmospheric inspiration**.

Do not reproduce copyrighted:

- Characters
- Logos
- Vehicles
- Recognizable scenes
- Interface designs
- Typography
- Other branded elements

Do not make the website look like a video game.

The desired balance is:

> **Microsoft-level polish + advanced engineering visualization + TRON-inspired digital connectivity + an original GEMSTONE identity**

The site should make visitors feel like they are interacting with the interface to a next-generation digital engineering ecosystem rather than simply viewing another government program website.

---

# 2. Core Visual Concept

The website should visually reinforce the core concept of GEMSTONE:

> **A connected digital ecosystem where organizations, environments, tools, data, compute, models, simulations, and users can interact across a distributed architecture.**

The visual language should communicate:

- Connectivity
- Distribution
- Interoperability
- Modularity
- Scale
- Security
- Movement
- Reuse
- Extensibility
- Digital engineering
- Modeling and simulation

Use networks, connections, nodes, layers, data movement, dimensional depth, and subtle animation to make the ecosystem feel **alive and connected**.

The visitor should understand visually that GEMSTONE connects environments rather than requiring organizations to replace them.

---

# 3. Technical Stack

Use:

- Next.js using the App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- ESLint
- Prettier

The application must be:

- Fully responsive
- Mobile friendly
- Accessible
- WCAG 2.1 AA compliant where applicable
- Keyboard navigable
- Screen-reader compatible
- Optimized for performance
- Optimized for search engines
- Compatible with modern browsers

Target:

- Microsoft Edge
- Chrome
- Firefox
- Safari

Use semantic HTML.

Avoid unnecessary client-side rendering.

Only components requiring interaction, browser state, or client-side animation should use `"use client"`.

---

# 4. Critical Requirement: Easy UI and Content Updates

The website must be designed from the beginning to be **extremely easy to update**.

Do not build the site as one large page component.

The architecture must deliberately separate:

1. Content
2. UI components
3. Site configuration
4. Integrations
5. Branding
6. Assets
7. Design tokens
8. Animations
9. Section visibility
10. Application logic

A future developer should be able to modify content, visual styling, branding, integrations, or individual sections without understanding or modifying the entire application.

Most routine changes should require editing **one obvious content or configuration file**.

Examples:

- Changing text should not require editing React component logic.
- Changing a logo should not require editing a section component.
- Changing the briefing URL should require changing one configuration value.
- Changing the Microsoft Form should require changing one configuration value.
- Adding a capability should require adding one entry to a content array.
- Adding an FAQ should require adding one entry to a content array.
- Changing the primary color should propagate through the entire site.
- Changing animation intensity should be controlled globally.
- Sections should be independently enabled or disabled.
- The visual experience should remain modular and maintainable.

---

# 5. Recommended Project Structure

Use a structure similar to:

~~~text
src/
  app/
    layout.tsx
    page.tsx
    globals.css

  components/
    layout/
      Header.tsx
      Footer.tsx
      Navigation.tsx
      SectionContainer.tsx

    sections/
      HeroSection.tsx
      AboutSection.tsx
      WhyGemstoneSection.tsx
      ArchitectureSection.tsx
      CapabilitiesSection.tsx
      DifferentiatorsSection.tsx
      FAQSection.tsx
      BriefingSection.tsx
      RequestInformationSection.tsx

    ui/
      Button.tsx
      Card.tsx
      FeatureCard.tsx
      CapabilityCard.tsx
      Accordion.tsx
      AnimatedSection.tsx
      GlowBackground.tsx
      NetworkBackground.tsx
      ArchitectureDiagram.tsx
      MediaViewer.tsx
      SectionHeading.tsx

  content/
    site-content.ts
    navigation.ts
    capabilities.ts
    differentiators.ts
    faq.ts

  config/
    site-config.ts
    asset-config.ts
    integration-config.ts
    motion-config.ts

  lib/
    motion.ts
    accessibility.ts
    utilities.ts

  types/
    content.ts
    site.ts

public/
  branding/
    gemstone-logo.svg
    gemstone-logo-horizontal.svg
    gemstone-mark.svg
    partner-logos/

  images/
    hero/
    architecture/
    backgrounds/
    inspiration/

  documents/
~~~

This exact structure can be improved if there is a technically superior implementation, but maintain the same **separation of responsibilities and ease of future updates**.

---

# 6. Content Separation

Do not hardcode repeated marketing content inside React page components.

Place editable content under:

~~~text
src/content/
~~~

Use strongly typed TypeScript objects and arrays for:

- Navigation
- Hero content
- About content
- Feature cards
- Architecture descriptions
- Capabilities
- Differentiators
- FAQs
- Footer content
- Contact information
- Disclaimers

The goal is for a non-developer or minimally technical developer to be able to update most website wording without modifying component logic.

---

# 7. Site Configuration

Create:

~~~text
src/config/site-config.ts
~~~

Use it for:

- Site title
- Site description
- Contact information
- Public-release statement
- Navigation behavior
- Section enablement
- External links
- SEO configuration
- Feature toggles

For example:

~~~ts
export const siteConfig = {
  siteName: "GEMSTONE",
  fullName:
    "Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem",

  sections: {
    about: true,
    architecture: true,
    capabilities: true,
    differentiators: true,
    faq: true,
    briefing: true,
    requestInformation: true,
  },
};
~~~

A section must be capable of being enabled or disabled without deleting its implementation.

---

# 8. Branding and Provided Logos

I will provide official GEMSTONE logos.

I may also provide:

- Images
- Diagrams
- Screenshots
- Existing GEMSTONE graphics
- Visual concepts
- Reference material
- Inspiration images

Use those supplied assets as the primary source for establishing the GEMSTONE visual identity.

Do **not** recreate, alter, redraw, or substitute the official GEMSTONE logo unless explicitly instructed.

Support:

- SVG
- PNG
- WebP

Use placeholder locations until final assets are provided.

Recommended locations:

~~~text
/public/branding/gemstone-logo.svg
/public/branding/gemstone-logo-horizontal.svg
/public/branding/gemstone-mark.svg
~~~

Create:

~~~text
src/config/asset-config.ts
~~~

For example:

~~~ts
export const assetConfig = {
  logo: "/branding/gemstone-logo.svg",
  horizontalLogo: "/branding/gemstone-logo-horizontal.svg",
  mark: "/branding/gemstone-mark.svg",
  heroBackground: "/images/hero/gemstone-hero.webp",
};
~~~

Changing a logo should require changing only the asset or its configuration reference.

Preserve:

- Original aspect ratio
- Transparency
- Resolution
- Brand colors

Use Next.js image optimization where appropriate.

---

# 9. Visual Reference Assets

I will provide visual reference material that Kiro should use for inspiration when building the UI.

Place reference material under:

~~~text
/public/images/inspiration/
~~~

Study these assets for:

- Visual hierarchy
- Lighting
- Color balance
- Depth
- Spacing
- Card styling
- Navigation
- Connection patterns
- Network visualization
- Motion
- Typography relationships
- Section transitions

Use these references to establish the desired visual direction.

Do not directly duplicate another website or proprietary design.

Create an **original GEMSTONE visual experience** informed by the references.

---

# 10. Color Palette

Start with:

| Function | Color |
|---|---|
| Main Background | `#071826` |
| Elevated Surface | `#0B2239` |
| Primary Cyan | `#00D4FF` |
| Secondary Blue | `#4EC3E0` |
| Accent Blue | `#7EE0FF` |
| Primary Text | `#F8FAFC` |

Use an accessible blue-gray for secondary text.

Use controlled opacity for:

- Borders
- Glass surfaces
- Grid lines
- Network connections
- Background elements

Do not scatter raw hexadecimal values throughout components.

Create centralized CSS variables and design tokens.

For example:

~~~css
:root {
  --gemstone-bg: #071826;
  --gemstone-surface: #0b2239;
  --gemstone-primary: #00d4ff;
  --gemstone-secondary: #4ec3e0;
  --gemstone-accent: #7ee0ff;
  --gemstone-text: #f8fafc;
}
~~~

---

# 11. Design Language

Use:

- Glassmorphism
- Controlled translucent surfaces
- Cyan and blue glow
- Animated gradients
- Digital engineering visual elements
- Cybersecurity-inspired surfaces
- Particle or network backgrounds
- Luminous connection lines
- Data pathways
- Digital grids
- Layered structural depth
- Clean typography
- Large spacing
- Strong visual hierarchy
- Purposeful motion

Avoid:

- Excessive neon
- Excessive glowing text
- Video-game styling
- Busy backgrounds
- Constant distracting movement
- Generic SaaS website layouts
- Generic corporate stock imagery
- Overdone glass effects
- Excessive card layouts

Use visual effects to communicate **system structure and connectivity**, not simply as decoration.

---

# 12. Typography

Typography should communicate:

- Precision
- Engineering
- Technical sophistication
- Government professionalism
- Modernity

Use a strong display treatment for major headings and a highly readable sans-serif typeface for body content.

Avoid novelty science-fiction fonts for body text.

Maintain strong readability at all screen sizes.

---

# 13. Header and Navigation

Create a responsive sticky header.

Include:

- GEMSTONE logo
- About
- Architecture
- Capabilities
- Differentiators
- FAQ
- Briefing
- Contact
- Request Information

Requirements:

- Smooth-scroll navigation
- Active section state
- Accessible mobile navigation
- Keyboard navigation
- Visible focus states
- Escape-key closing for mobile navigation
- Appropriate focus management

Initially keep the header visually integrated with the hero.

As the user scrolls, transition it into a slightly more defined glass or dark surface.

Avoid layout movement when this transition occurs.

---

# 14. Section 1: Hero

## Headline

> **Government-Owned Open Source for Digital Engineering and Modeling & Simulation**

## Subheadline

> **GEMSTONE empowers organizations to build, publish, discover, and integrate tools, data, and compute across secure environments.**

## Primary CTA

**Request Information**

The button should scroll directly to the Microsoft Forms Request Information section.

## Secondary CTA

**View Briefing**

The button should scroll directly to the GEMSTONE Briefing section.

## Hero Visualization

The hero should be one of the site's signature experiences.

Create an animated representation of the GEMSTONE ecosystem incorporating concepts such as:

- Organizations
- Environments
- Nodes
- Tools
- Data
- Compute
- Models
- Simulations
- Users
- Hub services

Use:

- Floating nodes
- Animated connection lines
- Luminous data paths
- Controlled particle movement
- Digital grid structures
- Layered depth
- Cyan illumination
- Slow gradients
- Subtle parallax where appropriate

The animation should visually imply information and capabilities moving through an interconnected ecosystem.

It should feel futuristic and sophisticated while remaining professional.

Do not sacrifice headline readability.

Provide a reduced-motion alternative.

---

# 15. Section 2: What Is GEMSTONE?

## Title

> **What is GEMSTONE?**

## Body

> **GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.**

Create a visualization incorporating:

- Organizations
- Tools
- Data
- Compute
- GEMSTONE

Rather than displaying a basic vertical flowchart, create a visually interconnected system.

GEMSTONE should appear to **connect and enable** these resources.

Requirements:

- Responsive
- Accessible
- Clearly labeled
- Animated where appropriate
- Understandable without animation
- Consistent with the hero's design language

---

# 16. Section 3: Why GEMSTONE?

Create four primary feature cards.

## Bring Your Own Environment

Organizations can connect and enhance existing environments instead of replacing them.

## Controlled Collaboration

Share information securely across organizations and network boundaries.

## Security First

Multiple layers of security support operations across classified and unclassified environments.

## Reuse Instead of Rebuild

Promote discoverability and reuse of tools, services, and data.

Each card should include:

- Appropriate icon
- Concise title
- Short description
- Subtle illumination
- Hover behavior
- Keyboard focus behavior
- Responsive sizing

The content must remain understandable without hover.

---

# 17. Section 4: Architecture

## Title

> **The Architecture**

Build an interactive architecture visualization.

The visualization must communicate three principal GEMSTONE concepts:

### GEMSTONE Hub

Centralized enterprise services that connect communities.

### GEMSTONE Node

Mission-specific digital environments connected through the ecosystem.

### GEMSTONE Client

User-facing tools, services, data, and compute resources.

The Hub should connect to multiple Nodes and Clients.

Use:

- Animated connections
- Directional data motion
- Hover details
- Focus details
- Luminous pathways
- Layered depth
- Subtle state changes

## Important Architectural Principle

Do not visually imply that all data must flow into or be stored centrally in the GEMSTONE Hub.

The design should communicate a **distributed connected ecosystem**.

Organizations and Nodes retain their own environments and capabilities while participating in the broader ecosystem.

Provide:

- Desktop visualization
- Mobile-friendly representation
- Non-animated fallback
- Accessible labels
- Descriptions
- Legend if necessary

---

# 18. Section 5: GEMSTONE Capabilities

## Title

> **Capabilities**

Build a responsive icon-based capability grid.

### Scalable Adoption

Enables scalable adoption by allowing organizations to tailor and connect existing environments.

### Controlled Proprietary Data

Supports protection of controlled proprietary data while keeping data inside organizational boundaries.

### Marketplace Integration

Provides a marketplace for integrating new or custom tools.

### Data Transformation

Includes built-in CI/CD-style data transformation across tools.

Each capability should include:

- Icon
- Short title
- Concise description
- Hover/focus interaction
- Subtle lighting
- Responsive layout

Store all capabilities in a typed content array.

Adding a capability should require adding another object to the array rather than building another component.

---

# 19. Section 6: Differentiators

## Title

> **What Makes GEMSTONE Different?**

Include:

- Fully Government-Owned Open Source
- Air-Gap Deployment
- Multiple Security Layers Including IL-7
- Secure Libraries for Application Development
- Distribution Pipeline for New Capabilities
- Custom Applications Approved Within Minutes
- Development and Deployment of Tailored Environments in One Day
- Unified Plugin System
- Approved and Hardened Python Libraries
- Deploy Models and Simulations as API-Consumable Services
- Software Development Kit
- Distributed Simulation Enablement

Use:

- Luminous icons
- Sophisticated cards or panels
- Staggered entrances
- Responsive layout
- Controlled hover behavior
- Clear visual grouping

Do not introduce additional security, accreditation, approval, performance, or deployment claims.

Keep every differentiator in:

~~~text
src/content/differentiators.ts
~~~

This is especially important because public-facing claims may need to be modified during public-release review.

---

# 20. Section 7: Frequently Asked Questions

## Title

> **Frequently Asked Questions**

Create an accessible animated accordion.

### What is GEMSTONE?

GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.

### Who can use GEMSTONE?

Anyone in the Department of War plus industry, academic, and international partners.

### What are GEMSTONE's capabilities?

- Enables scalable adoption through connected environments
- Protects controlled proprietary data
- Provides marketplace integration for tools
- Includes CI/CD-style data transformation

### What makes GEMSTONE different?

Government ownership, open-source architecture, air-gap deployment support, advanced security layers, SDK extensibility, rapid application deployment, distributed simulation capability, and hardened development environments.

## Accordion Requirements

Support:

- Animated expansion
- Animated collapse
- Keyboard interaction
- Screen readers
- Proper ARIA attributes
- Visible focus states
- Enter
- Space
- Reduced-motion preferences

Store FAQ content independently of the accordion component.

---

# 21. Section 8: GEMSTONE Briefing

## Title

> **GEMSTONE Briefing**

Create a visually polished section that allows visitors to access the current GEMSTONE briefing directly from the website.

## Briefing URL

**The actual GEMSTONE briefing URL will be provided directly here.**

When the URL is provided, insert it into **one centralized briefing configuration location**.

Do not scatter the URL throughout components.

Create:

~~~text
src/config/integration-config.ts
~~~

For example:

~~~ts
export const briefingConfig = {
  url: "GEMSTONE_BRIEFING_URL_GOES_HERE",
  title: "GEMSTONE Briefing",
  allowDownload: true,
  allowOpenInNewTab: true,
};
~~~

When the final URL is supplied, replace:

~~~text
GEMSTONE_BRIEFING_URL_GOES_HERE
~~~

with the provided URL.

Do not require an environment variable for the briefing URL unless later specifically instructed.

## Briefing Experience

Support:

- PDF
- PowerPoint
- Browser-native document viewing where possible
- Embedded viewing where the host allows it
- External document viewing as a fallback

Include:

- GEMSTONE Briefing title
- Short description
- Professional preview
- File/document indicator
- Embedded viewer when supported
- Expanded viewing where practical
- **View Briefing** button
- **Download Briefing** button where supported
- **Open in New Tab** option
- Loading state
- Error state
- Accessible fallback

If embedding fails because of:

- CSP
- `X-Frame-Options`
- Browser restrictions
- Authentication
- Document-host limitations
- Unsupported document formats

do not display a broken iframe.

Instead, display a polished briefing card containing:

- **View Briefing**
- **Download Briefing**, when supported

External links opened in a new tab must use:

~~~html
rel="noopener noreferrer"
~~~

Keep the briefing presentation independent from the briefing URL so the briefing can be replaced by changing **one configuration value**.

---

# 22. Section 9: Request More Information

## Title

> **Request More Information**

## Subtitle

> **Connect with the GEMSTONE team to learn more.**

This section must contain an embedded **Microsoft Form**.

Use a Microsoft Forms iframe.

The Microsoft Form will be created and managed separately from the website.

Use a configurable value initially:

~~~text
MICROSOFT_FORM_URL
~~~

Prefer:

~~~text
NEXT_PUBLIC_MICROSOFT_FORM_URL
~~~

for deployment-specific configuration.

The Microsoft Form should collect:

- First Name
- Last Name
- Email
- Organization
- Organization Type
- Interest Area
- Additional Comments

The fields themselves will be configured inside Microsoft Forms.

The website should **not separately collect or store these responses**.

## Microsoft Forms Integration

Implement:

- Responsive iframe container
- Descriptive iframe title
- Lazy loading
- Loading state
- Missing-configuration state
- Accessible fallback
- Open-in-new-tab option
- Privacy notice placeholder

If the Microsoft Forms URL is unavailable, do not display a broken iframe.

Display a polished placeholder stating that the Request Information form has not yet been connected.

If Microsoft Forms prevents embedding, provide:

> **Open Request Information Form**

as an external link.

Do not attempt to inject CSS into Microsoft Forms or directly restyle iframe content.

Style the **surrounding GEMSTONE interface** so the form feels integrated into the overall experience.

---

# 23. Section 10: Footer

Include:

## GEMSTONE

**Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem**

Include links to:

- About
- Architecture
- Capabilities
- FAQ
- Briefing
- Contact

Include:

> **Approved for Public Release. Distribution Unlimited.**

Make the public-release statement configurable.

Allow optional placeholders for:

- Contact
- Privacy
- Accessibility
- Government organization logos
- Social links
- Copyright
- Back to top

Do not show empty social links.

---

# 24. Animation Requirements

Use Framer Motion throughout the website where appropriate.

Include:

- Hero entrance
- Section fade-ins
- Staggered entrances
- Animated network connections
- Data movement
- Feature-card interactions
- Architecture transitions
- FAQ transitions
- Button interactions
- Header transition
- Background network movement

Animations should be:

- Smooth
- Deliberate
- Sophisticated
- Subtle
- Meaningful
- High performance

Avoid excessive animation.

Continuous animations must not create excessive CPU/GPU utilization.

Avoid large continuous effects on mobile devices.

Respect:

~~~text
prefers-reduced-motion
~~~

Centralize animation variants under:

~~~text
src/config/motion-config.ts
~~~

Support:

~~~ts
type MotionIntensity =
  | "reduced"
  | "standard"
  | "enhanced";
~~~

Default:

~~~text
standard
~~~

This allows the animation personality of the site to be adjusted globally rather than editing dozens of components.

---

# 25. Accessibility

Implement WCAG 2.1 AA practices.

Include:

- Semantic heading hierarchy
- Skip-to-content
- Keyboard-accessible navigation
- Visible focus indicators
- Accessible accordions
- Appropriate contrast
- Descriptive buttons
- Useful alternative text
- Decorative imagery hidden from assistive technologies
- Reduced-motion support
- Accessible iframe titles
- Logical tab order
- Accessible external links
- Appropriate touch targets

Target touch controls of approximately:

~~~text
44 x 44 CSS pixels
~~~

where practical.

Do not communicate meaning using color alone.

The website must remain understandable without animation.

---

# 26. Performance

Target excellent performance despite the sophisticated visual presentation.

Optimize:

- Images
- Animations
- JavaScript
- Embedded documents
- Microsoft Forms
- Fonts
- Initial page load

Use:

- Next.js image optimization
- Responsive images
- Lazy loading
- Dynamic loading when appropriate
- Static fallbacks
- Lightweight SVG/CSS effects

Avoid:

- Large autoplay background videos
- Huge JavaScript packages
- Unnecessary client components
- Excessive canvas processing
- Excessive particles
- Unnecessary continuous animations

The visual sophistication should come from **good design**, not brute-force browser rendering.

Target strong Lighthouse results for:

- Performance
- Accessibility
- Best Practices
- SEO

---

# 27. SEO and Metadata

Use the Next.js Metadata API.

Include:

- Page title
- Page description
- Open Graph metadata
- Open Graph image
- Favicon
- Canonical URL support
- Search-friendly heading structure

Suggested title:

> **GEMSTONE | Government-Owned Digital Engineering and Modeling & Simulation Ecosystem**

Suggested description:

> **GEMSTONE connects tools, data, compute, and secure digital environments across government, industry, academic, and international partner organizations.**

Centralize metadata in configuration.

---

# 28. Claims and Public-Release Management

Because this is a public-facing government website, make claims easy to review and modify.

Keep statements involving:

- Security
- Government ownership
- IL levels
- Deployment times
- Application approval
- Air-gap operation
- Performance
- Distribution
- Environment availability

inside editable content files.

Do not introduce claims that are not explicitly provided in this brief.

Do not imply:

- A particular ATO
- Accreditation for an unspecified environment
- Certification by another agency
- Authorization for a classified network
- Commercial endorsement
- Corporate partnership
- Guaranteed availability
- Guaranteed performance

Do not imply endorsement, sponsorship, authorization, or partnership by Microsoft or any other commercial organization unless explicitly provided and approved.

---

# 29. Error and Fallback States

Create polished fallback states for:

- Missing GEMSTONE logo
- Missing hero image
- Missing visual assets
- Missing Microsoft Forms URL
- Microsoft Forms embedding blocked
- Missing briefing URL
- Briefing embedding blocked
- Unsupported briefing format
- Image loading failure
- Reduced-motion configuration
- Client-side JavaScript unavailable where practical

The core website content must remain understandable even when optional visual effects or embeds fail.

---

# 30. README and Maintainability Documentation

Create a detailed:

~~~text
README.md
~~~

Document:

1. How to install dependencies
2. How to run locally
3. How to run linting
4. How to run TypeScript validation
5. How to build production
6. Where GEMSTONE logos are located
7. How to replace GEMSTONE logos
8. Where inspiration assets belong
9. How to change colors
10. How to change typography
11. How to modify motion intensity
12. How to edit website content
13. How to add a capability
14. How to add a differentiator
15. How to modify FAQ entries
16. How to enable or disable sections
17. How to change the GEMSTONE briefing URL
18. How to configure Microsoft Forms
19. How to update navigation
20. How to update the public-release statement
21. How to deploy the application
22. Which changes require rebuilding or redeploying the website

---

# 31. Manual Setup

Clearly document anything requiring manual configuration.

## GEMSTONE Branding

1. Place approved GEMSTONE logos in:

~~~text
/public/branding/
~~~

2. Place approved GEMSTONE imagery under:

~~~text
/public/images/
~~~

3. Place design reference material under:

~~~text
/public/images/inspiration/
~~~

4. Verify logo presentation across the website.

## GEMSTONE Briefing

5. Obtain the final GEMSTONE briefing URL.

6. Insert that URL into:

~~~text
src/config/integration-config.ts
~~~

7. Verify the document host permits embedding if embedded viewing is desired.

8. Verify whether direct downloading is supported.

9. Test the fallback external-viewing experience.

## Microsoft Forms

10. Create the Microsoft Form.

11. Configure:

- First Name
- Last Name
- Email
- Organization
- Organization Type
- Interest Area
- Additional Comments

12. Configure who may submit the form.

13. Configure response ownership.

14. Configure notifications where appropriate.

15. Obtain the Microsoft Forms embed URL.

16. Configure:

~~~text
NEXT_PUBLIC_MICROSOFT_FORM_URL
~~~

17. Confirm the form is permitted to render inside an iframe.

## Production Environment

18. Configure the production domain.

19. Configure required DNS records.

20. Configure HTTPS.

21. Configure the TLS certificate.

22. Configure Content Security Policy rules.

23. Allow Microsoft Forms in the appropriate CSP directives.

24. Allow the GEMSTONE briefing host as required.

25. Configure approved analytics if required.

26. Validate site metadata and social previews.

27. Perform final accessibility testing.

28. Perform cybersecurity review.

29. Perform privacy review.

30. Perform public-affairs/public-release review.

31. Validate all security, deployment, ownership, performance, and approval claims before publication.

---

# 32. Final Validation

Before considering implementation complete:

1. Run ESLint.
2. Run TypeScript validation.
3. Run a production build.
4. Correct all build errors.
5. Verify there are no broken internal links.
6. Verify mobile navigation.
7. Test all CTAs.
8. Test keyboard navigation.
9. Test responsive behavior.
10. Test reduced-motion behavior.
11. Test with the Microsoft Form configured.
12. Test without the Microsoft Form configured.
13. Test the briefing URL.
14. Test the briefing fallback.
15. Test missing-image behavior.
16. Verify that updating content does not require changing components.
17. Verify that changing branding does not require changing page logic.
18. Verify the site at approximately:
   - 320 px mobile
   - 375 px mobile
   - 768 px tablet
   - 1024 px laptop
   - 1440 px desktop
   - 1920 px wide desktop
19. Verify no horizontal scrolling occurs at supported viewport widths.
20. Confirm that the final production build succeeds.

---

# 33. Final Deliverables

Generate a **complete working codebase**, not simply mockups or example components.

Deliver:

- Complete Next.js application
- App Router architecture
- TypeScript
- Tailwind CSS implementation
- Framer Motion implementation
- Responsive navigation
- Reusable UI components
- Separate section components
- Typed content objects
- Centralized site configuration
- Centralized asset configuration
- Centralized integration configuration
- Centralized motion configuration
- GEMSTONE logo placeholders
- Reference asset directories
- Interactive architecture visualization
- Responsive capability grid
- Differentiator presentation
- Accessible FAQ accordion
- GEMSTONE briefing integration
- Microsoft Forms integration
- Accessible fallback states
- SEO metadata
- `.env.example`
- `README.md`
- Production build configuration

Do not leave pseudo-code or incomplete components where a functional implementation can reasonably be created.

---

# 34. Final Quality Standard

The completed website should **not look like a conventional government website or an imitation of existing defense-tech companies**.

It should establish an original visual identity for GEMSTONE.

The experience should feel like the visitor is seeing a:

> **Next-generation government digital engineering ecosystem come to life.**

Combine:

- Microsoft-level visual polish
- Forward-leaning digital engineering design
- TRON-inspired interconnected environments
- Realistic systems visualization
- Animated data and network pathways
- Strong GEMSTONE branding
- Sophisticated architecture visualization
- Government credibility
- Technical precision
- Purposeful motion
- Accessible interaction
- Excellent performance
- Maintainable content
- Modular UI components

Most importantly, visually reinforce that:

> **GEMSTONE connects environments rather than replacing them.**

Organizations, Nodes, Clients, tools, data, compute, models, simulations, users, and the Hub should appear as parts of a broader **interconnected and distributed digital ecosystem**.

GEMSTONE should feel **ahead of the current defense-technology design language, not influenced by it**.

The finished site should feel:

> **Connected. Distributed. Secure. Dynamic. Government-Owned. Open. Forward-Leaning.**

The final reaction should not be:

> "This looks like a good government website."

It should be:

> **"This looks like the digital environment the government will be operating in next."**