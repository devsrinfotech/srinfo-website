import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
const dates = new Map();
for (const entry of await readdir(new URL('insights/', output), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const html = await readFile(new URL(`insights/${entry.name}/index.html`, output), 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const modified = html.match(/<meta property="article:modified_time" content="([^"]+)"/)?.[1];
  if (canonical && modified) dates.set(canonical, modified);
}
// Only article dates are supplied: never fabricate freshness from the build time.
for (const file of await readdir(output)) {
  if (!/^sitemap-\d+\.xml$/.test(file)) continue;
  const url = new URL(file, output);
  const xml = await readFile(url, 'utf8');
  const updated = xml.replace(/<url>[\s\S]*?<\/url>/g, entry => {
    const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const modified = dates.get(location);
    return modified
      ? entry.replace(/<lastmod>[^<]*<\/lastmod>/g, '').replace('</url>', `<lastmod>${modified}</lastmod></url>`)
      : entry;
  });
  await writeFile(url, updated);
}
// Preserve the previous website's sitemap URL using the generated index.
// Copy the complete index so this stays correct if Astro splits larger sitemaps.
await copyFile(
  new URL('../dist/sitemap-index.xml', import.meta.url),
  new URL('../dist/sitemap.xml', import.meta.url),
);
console.log('Preserved /sitemap.xml as an alias of the generated sitemap index.');
