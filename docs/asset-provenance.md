# Brand and image assets

The existing coloured and white SR Infotech logos are copied unchanged from the old site's logo directory. All display assets are local under `public/images/`, with responsive WebP variants for the hero. No remote image or font service is required at runtime.

`public/images/organization-logo.png` is a 600×160 version of the original coloured logo, centred on white padding without enlargement or artwork changes. It is used in Organization structured data to meet [Google's minimum logo dimensions](https://developers.google.com/search/docs/appearance/structured-data/organization). The header still uses the original logo.

The five new illustrations/photos were generated with the built-in **image_gen** tool. They are illustrative, not evidence of owned facilities, actual stock or brand partnerships. No stock licences, customer relationships or photographed premises are claimed.

| Asset | Final project file | Use |
| --- | --- | --- |
| Modern inventory composition | `public/images/hero.webp` | Homepage and About |
| Small responsive hero | `public/images/hero-small.webp` | Mobile homepage |
| Warehouse | `public/images/warehouse.webp` | Stock-list article |
| Apparel | `public/images/apparel.webp` | Category and article |
| Home & kitchen | `public/images/home-kitchen.webp` | Category and article |
| Electronics | `public/images/electronics.webp` | Category and article |
| Social preview | `public/images/social-cover.jpg` | Metadata fallback |

Images were resized and compressed with Sharp for delivery. Original generated PNGs remain in the Codex generated-images directory; the website does not depend on them.

## Prompt set

### Final homepage hero
Use case: stylized-concept. Asset type: premium modern technology-forward B2B inventory procurement website hero, square composition. A beautiful high-end 3D still life: three immaculate pale ice-blue and white modular cubes of different heights on a reflective pale-blue platform, displaying a folded navy sweatshirt on left block, a white ceramic bowl and small stainless cooking pot on a middle block, and elegant matte dark navy headphones on right block. Subtle translucent frosted glass panels and a single luminous electric blue orbit swoosh linking the objects to communicate circular inventory, a small unbranded cardboard carton integrated in front. Background an airy very pale blue studio with deep navy accents and electric azure blue edge lighting. Dramatic carefully designed modern tech advertising art direction, sophisticated tangible physically rendered materials, soft shadows, generous negative space around composition. No text, no numbers, no logo, no watermark, no people, no money, no graphs, no interface labels. Excellent coherent proportions, high visual polish. This is an illustrative corporate brand visual.

### Warehouse
Use case: photorealistic-natural. Asset type: premium corporate liquidation business website hero background, landscape 3:2. Create an editorial architectural photograph of a modern spacious Indian industrial distribution warehouse, long orderly rows of steel racks containing clean neutral brown cardboard cartons on pallets, polished concrete floor, dramatic high ceiling, side daylight, atmospheric forest-green shadows with warm natural highlights. Camera from elevated mezzanine looking diagonally down the main aisle, strong cinematic geometry and leading lines. The warehouse is anonymous illustrative imagery, no logos, no visible company names, no recognizable faces, no text, no watermark. Restrained sophisticated grading, tangible materials, extremely realistic, high-end logistics annual report photography. Keep central right area particularly clear and beautiful for website image panel.

### Category photography
Shared prompt:

Use case: product-mockup. Asset type: premium corporate inventory liquidation website category photograph, landscape 3:2. Photograph [subject]. Sophisticated muted sage-gray studio backdrop, soft directional daylight from left, subtle shadows, beautiful editorial product photography, tactile materials, realistic proportions. Objects in middle with breathing room around them. No text, no logos, no watermarks, no people, no illustrative graphic overlays. This is illustrative inventory, not a named brand product.

Subjects:
- Apparel: a neat sculptural stack of folded ivory, sage and charcoal cotton shirts and knitwear on a low pale stone plinth, one neatly folded denim piece alongside, discreet blank paper swing tag.
- Home & kitchen: a sculptural grouping of warm white ceramic bowls and mugs, a brushed stainless steel cooking pot and natural wooden serving boards, carefully arranged on a low pale stone plinth.
- Electronics: a minimalist grouping of unbranded matte black over-ear headphones, a compact charcoal bluetooth speaker and a closed silver laptop, arranged on a low pale stone plinth.
