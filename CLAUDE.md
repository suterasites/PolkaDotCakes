# CLAUDE.md - Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** - never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool - Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `Assets/` and `brand_assets/` folders before designing. They may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values - do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens - not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Deployment
- **Always commit and push after making changes.** After every set of changes, commit to `main` and `git push origin main`. Vercel auto-deploys from the `main` branch on GitHub.
- Do not wait for the user to ask - push is part of completing a task.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design - match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not use em dashes or en dashes anywhere - no Unicode characters, no `&mdash;`, no `&ndash;`, no `&#8212;`, no `&#8211;`. Use regular hyphens (-) instead.

## Multi-Page Consistency
- **Navbar:** The navbar must be identical across all pages. If the navbar is modified on any page, apply the same change to every other page immediately.
- **Footer:** The footer must be identical across all pages. If the footer is modified on any page, apply the same change to every other page immediately.
- **Internal links:** All text links that reference a page on the site must link to the correct page URL. When a new page is created, scan all existing pages and update any mentions of that topic to link to the new page.

# Site Checklist

Use this checklist for every page on the site. Each page must have the following metadata and content requirements configured before launch.

---

## Per-Page Checklist

### Page: _______________

**Meta & SEO**
- [ ] **Title Tag** - Under 60 characters, includes primary keyword, brand name at end
- [ ] **Meta Description** - Under 160 characters, includes a clear CTA and primary keyword
- [ ] **Page Canonical URL** - Self-referencing canonical set, uses preferred URL format (trailing slash consistency, www vs non-www)
- [ ] **Open Graph Title** - Optimised for social sharing, can differ from title tag if needed
- [ ] **Open Graph Description** - Written for social click-through, under 200 characters
- [ ] **Search Title** - Google Business / search appearance title confirmed
- [ ] **Search Description** - Google Business / search appearance description confirmed

**Schema & Structured Data**
- [ ] **JSON-LD Schema** - Appropriate schema type applied (LocalBusiness, Service, FAQPage, etc.)
- [ ] **Schema.org Structured Data** - Validated via Google Rich Results Test, no errors or warnings
- [ ] **Identity Schema** - Organization or LocalBusiness identity schema present on key pages (name, logo, URL, contact info, social profiles, sameAs links)

**Sitemaps & Indexing**
- [ ] **XML Sitemap** - Page is included in the XML sitemap with correct URL, lastmod date, and priority value

**Content & AI Readability**
- [ ] **Minimum 500 Words** - Page contains at least 500 words of unique, relevant body content (excluding nav, footer, boilerplate)
- [ ] **Rendered Content LLM Readability** - Page content is fully rendered in the HTML source (not hidden behind JS-only rendering), uses semantic HTML (h1-h6, p, ul/ol, section, article), has a clear content hierarchy that AI crawlers and LLMs can parse and summarise accurately

## Site-Wide Checks

These items apply once across the entire site, not per page.

- [ ] **XML Sitemap generated** - sitemap.xml created with all pages, correct URLs, lastmod dates, and priority values
- [ ] **XML Sitemap submitted** - Submitted to Google Search Console
- [ ] **XML Sitemap auto-updates** - Static site, manual updates required when pages are added/removed
- [ ] **Robots.txt** - robots.txt created, references sitemap URL, allows all crawlers
- [ ] **Identity Schema on Home** - LocalBusiness schema with name, logo, URL, phone, email, address, areaServed, openingHours, aggregateRating, sameAs
- [ ] **Schema validation clean** - Validated via Google Rich Results Test

---

## Quick Reference - Character Limits

| Element | Max Length |
|---|---|
| Title Tag | 60 characters |
| Meta Description | 160 characters |
| OG Title | 60 characters |
| OG Description | 200 characters |
| Search Title | 60 characters |
| Search Description | 160 characters |

---

## JSON-LD Schema Types - Common for Service Businesses

- **LocalBusiness** - Home page, About page
- **Service** - Individual service pages
- **FAQPage** - FAQ sections or pages
- **BreadcrumbList** - All inner pages
- **WebSite** - Home page (with SearchAction if applicable)
- **Review / AggregateRating** - Testimonials or review pages
- **Organization** - Identity schema (name, logo, sameAs social links)

---

## LLM Readability - What to Check

When verifying rendered content is LLM-readable, confirm the following:

1. **Server-side or pre-rendered HTML** - Content is in the HTML source, not loaded entirely via client-side JavaScript after page load
2. **Semantic heading hierarchy** - Single H1 per page, logical H2-H6 nesting, no skipped levels
3. **Paragraph and list structure** - Body content uses `<p>`, `<ul>`, `<ol>` tags rather than divs with styled text
4. **Section and article tags** - Major content blocks wrapped in `<section>` or `<article>` for clear content boundaries
5. **Descriptive alt text on images** - Every image has alt text that describes the content, not just "image1.jpg"
6. **No critical content in images only** - Key information (phone numbers, addresses, service lists) exists as text, not embedded in graphics
7. **Clean readable text** - No keyword stuffing, no hidden text, no excessive boilerplate repeated across pages

---

*Duplicate the page section for each additional page on the site.*
