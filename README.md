# SR Infotech — surplus inventory buying

A modern, mobile-first corporate website for SR Infotech's new pan-India liquidation buying business. Built with Astro, TypeScript, local fonts and static HTML.

## Run

Use Node 22.12+ (or a supported newer Node release).

```sh
npm ci
npm run dev
npm run verify
```

The development URL is printed in the terminal. Production output is `dist/`.

```sh
npm run build
npm run preview
```

For browser checks, install/use Chrome and point the suite at the running preview:

```powershell
$env:PREVIEW_URL='http://127.0.0.1:4321'
npm run test:browser
```

The suite covers 320, 390, 768, 1024 and 1440px layouts, accessibility, mobile menu, search/filtering, legacy contact navigation and mocked form delivery. It saves desktop/mobile screenshots in ignored `artifacts/`. In restricted environments, `ASTRO_TELEMETRY_DISABLED=1` avoids Astro writing a telemetry config outside the project.

## Add an article

```sh
npm run new-post -- "How to prepare your next surplus inventory lot"
```

Edit the generated Markdown file, then set `draft: false` when reviewed. Articles appear automatically in insights, related articles, RSS and the sitemap. See [the content playbook](docs/content-playbook.md).

## Project map

| Location | Purpose |
| --- | --- |
| `src/data/site.ts` | One source for contact details and social links |
| `src/data/business.ts` | Buying categories, solutions and FAQs |
| `src/content/blog/` | Schema-validated Markdown articles |
| `src/layouts/` | Metadata, structured data and page shell |
| `src/components/` | Header, footer, cards, FAQs, steps and CTAs |
| `src/pages/` | Prerendered routes and RSS |
| `src/lib/contact.mjs` | Original CRM endpoint and payload adapter |
| `public/images/` | Local, optimised visual assets |
| `tests/` | Contract, publishing and browser checks |
| `docs/` | Research, publishing and launch guidance |

## Launch

The new website is prepared locally; it has not been deployed. Serve **only `dist/`**, never the repository root. The original business archive and spilled legacy root files were deleted at the owner's request; retained integrations and assets live in the new source and `public/`.

The existing `srinfotech.biz` domain is retained. A manual GitHub Pages workflow is included for the existing GitHub repository; setup and remaining CRM verification are documented in [launch notes](docs/launch-notes.md).

Further references: [research and search strategy](docs/research-and-search-strategy.md), [SEO/GEO/AEO audit](docs/seo-audit.md), [verification results](docs/verification.md), and [generated visuals, saved asset paths and prompt set](docs/asset-provenance.md).
