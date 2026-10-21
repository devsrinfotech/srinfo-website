# Inventory image library

The approved first homepage hero remains unchanged, including its mobile version, its About-page reuse and the social-preview crop. All other inventory images use a candid, realistic photographic style in compact stockrooms: reused master cartons, repeated product quantities, stock grouping and review benches. Use natural uneven daylight, creased packaging, handling marks, scratched tables and ordinary working clutter. Keep wear commercially plausible; avoid filthy or hazardous settings. Retain subtle navy/blue fixtures and natural kraft cardboard rather than a forced blue cast. Avoid enormous warehouses, glossy CGI, perfect symmetry, isolated retail product displays, consumer sale imagery and unsupported brand/customer logos. No people, hands, arms, silhouettes or human reflections in these scenes.

These are AI-generated illustrative scenes, not photographs of SR Infotech's actual facilities or staff. Describe them accurately in alt text and never present them as evidence of capacity, certifications, ownership or operating history. The existing logos are retained.

| Image key | Intended use |
| --- | --- |
| `hero` | Homepage/about: mixed apparel, kitchenware and electronics with open cartons and palletised bulk stock |
| `apparel` | Apparel category: folded garments and reused cartons on a worn stockroom table |
| `home-kitchen` | Home/kitchen category: cookware, ceramics and containers in handled cartons |
| `electronics` | Electronics category: return devices, cables and open master cartons in a small stockroom |
| `warehouse` | Manifest/stock-list guidance: used inventory desk surrounded by mixed stock cartons |
| `apparel-stocklots` | Apparel preparation guide: blank tags, idle scanner and garments partway through sorting |
| `electronics-grading` | Electronics checklist: unattended sample-device review bench beside bulk cartons; no testing certification implied |
| `stock-conditions` | Stock-condition guide: sealed surplus, open-box returns and worn outer packaging on a working table |

Files live in `public/images/`. The hero has 1200×1200 and 640×640 WebP exports. Landscape scenes have 1200×800 and 640×427 WebP exports using `<key>.webp` and `<key>-small.webp`. `social-cover.jpg` is a 1200×630 crop of the new hero. The shared card and page templates choose sizes through `srcset`; keep explicit width/height attributes and lazy loading on below-the-fold cards.

The blog image enum is in `src/content.config.ts`. For a new scene, add both responsive WebP sizes and its schema option, set an article-specific `imageAlt`, then run `npm run verify` and review desktop/mobile crops. Do not change article publication dates merely because an image changed.

The October 2026 refresh used the built-in image-generation tool. The current seven candid stockroom prompts and source paths are in git-ignored `local-context/image-refresh-candid/prompts.json`; their full-resolution originals are preserved under ignored `artifacts/image-refresh-candid/originals/`. The retained hero and the earlier image set remain documented in `local-context/image-refresh/prompts.json` and `artifacts/image-refresh/originals/`. These local folders are not served by the production build.
