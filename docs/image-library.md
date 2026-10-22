# Inventory image library

The current direction shows large warehouse operations with a candid, realistic photographic style: tall stocked pallet racks, multiple bulk pallet lots, receiving areas and sorting benches. Keep the high roof and warehouse depth visible alongside the foreground products. Use natural daylight, creased packaging, handling marks, scratched work surfaces and ordinary working clutter. Wear should be commercially plausible; avoid filthy or hazardous settings. Navy/blue steel, orange rack beams and natural kraft cardboard suit the existing brand. Avoid glossy CGI, perfect symmetry, retail product displays and unsupported brand/customer logos. No people, drivers, hands, arms, silhouettes or human reflections in any scene.

The homepage/About hero is also candid, with a cinematic establishing view of stocked racks and a parked, unattended forklift in warm afternoon light. Keep the empty operator cabin clear, forks lowered and the warehouse legible. Use restrained photographic contrast rather than theatrical fog or artificial colour grading. Its mobile version and social preview use the same new scene.

These are AI-generated illustrative scenes, not photographs of SR Infotech's actual facilities or staff. Describe them accurately in alt text and never present them as evidence of capacity, certifications, ownership or operating history. The existing logos are retained.

| Image key | Intended use |
| --- | --- |
| `hero` | Homepage/about: cinematic warehouse racks, bulk cartons and parked forklift, no driver |
| `apparel` | Apparel category: garment intake tables and open lots in front of tall warehouse racks |
| `footwear` | Footwear category/guide: matched pairs, shoeboxes and bulk cartons in a large warehouse; no people |
| `home-kitchen` | Home/kitchen category: cookware and ceramics in a large receiving/consolidation bay |
| `electronics` | Electronics category: bulk return cartons and sorting benches with palletised stock behind |
| `warehouse` | Manifest/stock-list guidance: inventory desk overlooking a large warehouse receiving bay |
| `apparel-stocklots` | Apparel preparation guide: tagged garments, idle scanner and bulk apparel lots beside stocked racks |
| `electronics-grading` | Electronics checklist: unattended sample-review bench, conveyor and bulk warehouse stock; no certification implied |
| `stock-conditions` | Stock-condition guide: mixed surplus, opened returns and worn packaging in a large sorting area |

Files live in `public/images/`. The hero has 1200×1200 and 640×640 WebP exports. Landscape scenes have 1200×800 and 640×427 WebP exports using `<key>.webp` and `<key>-small.webp`. `social-cover.jpg` is a 1200×630 crop of the new hero. The shared card and page templates choose sizes through `srcset`; keep explicit width/height attributes and lazy loading on below-the-fold cards.

The blog image enum is in `src/content.config.ts`. For a new scene, add both responsive WebP sizes and its schema option, set an article-specific `imageAlt`, then run `npm run verify` and review desktop/mobile crops. Do not change article publication dates merely because an image changed.

The footwear image added on 22 October 2026 uses the same built-in image-generation tool and warehouse direction. Its files are `public/images/footwear.webp` (1200×800) and `public/images/footwear-small.webp` (640×427). Its private prompt is `local-context/footwear-image/prompts.json`, with the full-resolution original in `artifacts/footwear/originals/footwear.png`.

The October 2026 refresh used the built-in image-generation tool. The current eight warehouse-scale prompts and source paths are in git-ignored `local-context/image-refresh-warehouse-scale/prompts.json`; full-resolution originals are preserved under ignored `artifacts/image-refresh-warehouse-scale/originals/`. The earlier image sets remain in the corresponding `image-refresh` and `image-refresh-candid` local folders for reference. These local folders are not served by the production build.
