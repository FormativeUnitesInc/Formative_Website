# Formative — Marketing Website

A fast, responsive, SEO/AEO-optimized marketing site for **Formative** (Formative Unites), the trust-first creator marketplace. Static HTML/CSS/JS — no build step — ready for **GitHub Pages**.

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — dual creator/brand hero, trust pillars, matching engine, signup |
| `creators.html` | For Creators — value prop, journey, media kit, waitlist |
| `brands.html` | For Brands — matching engine, escrow, demo request |
| `how-it-works.html` | Deal flow, the CBA engine explained, the five trust guarantees |
| `about.html` | Mission, values, positioning |
| `nil.html` | NIL — workshop story, compliance stance, and the downloadable deck library |
| `industries.html` | Industries hub linking to each vertical |
| `industries/*.html` | 10 industry landing pages (video games, restaurants, athleisure, CPG, beauty & fashion, fitness & wellness, food & beverage, tech & apps, entertainment, politics & advocacy) |
| `thank-you.html` | Post-submit confirmation (adapts to waitlist vs demo) |
| `404.html` | Branded not-found page |
| `workshops/*.pptx` | 20 NIL workshop decks — 10 sports × High School + College |
| `workshops/*.pdf` | NIL Compliance Reference + Personal Brand Brief |

Supporting: `assets/` (css, js, images), `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`, `CNAME`, `.nojekyll`.

---

## Preview locally

From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Use a server rather than opening the files directly, so the absolute `/assets/...` paths resolve.)

---

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `formative-site`).
2. Put these files at the **root** of the repo and push:
   ```bash
   git init
   git add .
   git commit -m "Formative marketing site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages**. Under **Build and deployment**, set **Source = Deploy from a branch**, **Branch = main**, **Folder = / (root)**. Save.
4. Wait ~1 minute. Your site publishes at `https://YOUR-USERNAME.github.io/YOUR-REPO/` (or your custom domain, below).

`.nojekyll` is included so GitHub serves the files as-is.

---

## Deploy to Cloudflare Pages (alternative)

This static site also runs on Cloudflare Pages with zero build config:

1. Push the files to the GitHub repo (`FormativeUnitesInc/Formative_Website`).
2. In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
3. Build settings: **Framework preset = None**, **Build command = (empty)**, **Build output directory = `/`**. Deploy.
4. Set the custom domain (`formativeunites.us`) under the Pages project's **Custom domains** tab. On Cloudflare Pages the `CNAME` file is ignored — the dashboard manages the domain — so you can leave it or delete it.

No `wrangler.toml` is needed for a plain static Pages project. (If you'd rather deploy from the CLI: `npx wrangler pages deploy . --project-name formative`.)

---

## Custom domain (`formativeunites.us`)

This repo is preconfigured for **formativeunites.us** (the `CNAME` file, and the canonical/Open-Graph URLs in each page).

To make it live on that domain:

1. Keep the `CNAME` file (already contains `formativeunites.us`).
2. At your DNS provider add either:
   - Four **A records** for the apex `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, **or**
   - A **CNAME** for `www` → `YOUR-USERNAME.github.io`.
3. In **Settings → Pages → Custom domain**, confirm `formativeunites.us` and enable **Enforce HTTPS**.

**Using a different domain or just the github.io URL?**
- Delete the `CNAME` file.
- Find-and-replace `https://formativeunites.us` with your real base URL across the `.html` files, `sitemap.xml`, `robots.txt`, and `llms.txt` (keeps canonical tags, Open Graph, and structured data correct).

---

## Wire up the forms (important)

The waitlist and demo forms currently point at a placeholder. Until you connect a backend, submitting simply **forwards to the thank-you page** (so you can test the flow). To actually capture leads, connect a static-friendly form service — **[Formspree](https://formspree.io)** is the quickest:

1. Create a free Formspree form; copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `index.html`, `creators.html`, and `brands.html`, replace every
   `action="https://formspree.io/f/YOUR_FORM_ID"` with your endpoint.
3. Done. On submit, the JS posts to Formspree and redirects to
   `thank-you.html?type=waitlist` (creators) or `?type=demo` (brands).

The forms already send helpful hidden fields: `role`, `_subject`, and `_next` (the redirect target). Other services (Getform, Basin, Netlify Forms) work the same way — just swap the `action`.

> Tip: for Formspree's no-JavaScript fallback redirect, change each `_next`
> value to an absolute URL, e.g. `https://formativeunites.us/thank-you.html?type=waitlist`.

---

## Editing content & brand

- **Colors, type, spacing** live as CSS variables at the top of `assets/css/styles.css` (`:root`). The Formative palette (Dark Indigo `#312E81`, Deep Violet `#5B21B6`, Neon Purple `#A855F7`, Hot Pink `#FF329A`) and gradients are all there.
- **Type** uses Avenir where available (Apple devices) and falls back to **Mulish** (Google Fonts) — a close geometric match.
- **Logo** is an inline SVG recreation of the Formative mark (scalable + recolorable). The official raster/vector logos live in your brand Drive folder (`Logos/`) if you'd prefer to drop those in.
- **Interactions** (mobile nav, FAQ accordion, scroll reveals, parallax, form handling) are in `assets/js/main.js` — dependency-free.

---

## Built-in SEO / AEO

- Unique `<title>` + meta description per page, canonical URLs, Open Graph + Twitter cards, and a shareable `assets/img/og.png`.
- Structured data (JSON-LD): Organization, WebSite, Product, BreadcrumbList, HowTo, and FAQPage.
- `sitemap.xml`, `robots.txt` (welcomes major AI answer-engine crawlers), and an `llms.txt` summarizing the product for LLMs.
- Semantic HTML, accessible landmarks/labels, skip link, WCAG-minded contrast, and `prefers-reduced-motion` support.
- Responsive and fast: system-friendly fonts, no framework, minimal JS.
