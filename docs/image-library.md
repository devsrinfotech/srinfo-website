# Inventory image library

The current visual direction shows bulk buying and processing: master cartons, palletised lots, repeated product quantities, stock grouping and review benches. Keep the navy/azure brand palette, natural kraft cardboard and bright, clean lighting. Avoid isolated retail product displays, consumer sale imagery and unsupported brand/customer logos.

These are AI-generated illustrative scenes, not photographs of SR Infotech's actual facilities or staff. Describe them accurately in alt text and never present them as evidence of capacity, certifications, ownership or operating history. The existing logos are retained.

| Image key | Intended use |
| --- | --- |
| `hero` | Homepage/about: mixed apparel, kitchenware and electronics with open cartons and palletised bulk stock |
| `apparel` | Apparel category: repeated garments grouped into master cartons |
| `home-kitchen` | Home/kitchen category: bulk cookware, ceramics and packed cartons |
| `electronics` | Electronics category: repeated devices and accessories with intake/sorting equipment |
| `warehouse` | Manifest/stock-list guidance: inventory desk surrounded by mixed stock lots |
| `apparel-stocklots` | Apparel preparation guide: blank tags, scanner and garments sorted into lots |
| `electronics-grading` | Electronics checklist: sample-device/accessory review beside bulk cartons; no testing certification implied |
| `stock-conditions` | Stock-condition guide: sealed surplus, open-box returns and damaged outer packaging |

Files live in `public/images/`. The hero has 1200×1200 and 640×640 WebP exports. Landscape scenes have 1200×800 and 640×427 WebP exports using `<key>.webp` and `<key>-small.webp`. `social-cover.jpg` is a 1200×630 crop of the new hero. The shared card and page templates choose sizes through `srcset`; keep explicit width/height attributes and lazy loading on below-the-fold cards.

The blog image enum is in `src/content.config.ts`. For a new scene, add both responsive WebP sizes and its schema option, set an article-specific `imageAlt`, then run `npm run verify` and review desktop/mobile crops. Do not change article publication dates merely because an image changed.

The October 2026 refresh used the built-in image-generation tool. Full prompts and local source paths are in the git-ignored `local-context/image-refresh/prompts.json`; full-resolution originals are preserved under ignored `artifacts/image-refresh/originals/`. Neither folder is served by the production build.
