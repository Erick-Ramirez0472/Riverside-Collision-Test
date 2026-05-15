# Riverside Collision Repair Website

Static website for Riverside Collision Repair with a quote request form that posts to your Cloudflare Worker.

## Files

```text
.
├── index.html
├── api/
│   └── send-quote.js        # Optional Vercel-style API copy; not used by GitHub Pages
├── .github/
│   └── workflows/
│       └── pages.yml
├── .nojekyll
├── package.json             # Optional Vercel metadata
├── vercel.json              # Optional Vercel metadata
└── README.md
```

## GitHub Pages

GitHub Pages hosts the static website. The quote form should post to your Cloudflare Worker.

To deploy the page through GitHub:

1. Upload or push every file in this folder, including `.nojekyll`, `.github/workflows/pages.yml`, and `index.html`.
2. In the repository, go to **Settings -> Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to the `main` branch or run the workflow manually from the **Actions** tab.

If GitHub Pages only shows the repository title or README, `index.html` was not uploaded to the Pages source.

## Logo

Place your logo file at the repository root as `riversidelogo.png`. The site will use it automatically and will show a text fallback if the file is missing.

## Cloudflare Worker Form Endpoint

In [index.html](index.html), find the quote form:

```html
<form class="quote-form" id="quoteForm" data-endpoint="/api/send-quote" novalidate>
```

Replace `/api/send-quote` with your Cloudflare Worker URL, for example:

```html
<form class="quote-form" id="quoteForm" data-endpoint="https://your-worker.your-subdomain.workers.dev" novalidate>
```

Your Worker needs to allow requests from your GitHub Pages domain with CORS.

## Local Notes

This folder is not currently a git repository. If you want to push it from this folder, run:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
