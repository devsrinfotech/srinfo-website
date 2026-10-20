import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root = path.resolve('dist');
async function filesIn(dir) {
  const files = await readdir(dir, {withFileTypes:true});
  return (await Promise.all(files.map(file => file.isDirectory() ? filesIn(path.join(dir,file.name)) : path.join(dir,file.name)))).flat();
}
const files = await filesIn(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const pages = new Map();
const titles = new Set();
const descriptions = new Set();
const checkedLogos = new Set();
const decode = value => value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(?:39|x27);/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match=>[match[1],decode(match[2])]));
let pageCount = 0;
for (const file of htmlFiles) {
  const html = await readFile(file,'utf8');
  const relative = path.relative(root,file).replaceAll('\\','/');
  if (/^(contact|blogs|privacy-policy)\.html$/.test(relative)) continue;
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${relative}: exactly one h1`);
  assert.match(html, /<title>.+?<\/title>/,`${relative}: title`);
  assert.match(html, /name="description" content="[^"]+"/,`${relative}: description`);
  assert.match(html, /rel="canonical" href="https:\/\/srinfotech\.biz\//,`${relative}: production canonical`);
  assert.match(html, /property="og:image"/,`${relative}: social image`);
  assert.equal((html.match(/id="site-analytics"/g)||[]).length,1,`${relative}: one shared analytics initializer`);
  assert.match(html, /G-MVWQDQYKX9/,`${relative}: original GA4 measurement ID`);
  const metadata = Object.fromEntries([...html.matchAll(/<meta\b[^>]*>/g)].map(([tag])=>attributes(tag)).filter(tag=>tag.name || tag.property).map(tag=>[tag.name || tag.property,tag.content]));
  const canonical = attributes(html.match(/<link rel="canonical"[^>]*>/)?.[0] || '').href;
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || '');
  const indexable = !metadata.robots?.includes('noindex');
  assert.ok(!titles.has(title),`${relative}: duplicate title`);
  assert.ok(!descriptions.has(metadata.description),`${relative}: duplicate description`);
  assert.equal(metadata['og:url'],canonical,`${relative}: social/canonical URL mismatch`);
  assert.equal(metadata['og:title'],title,`${relative}: social title mismatch`);
  assert.equal(metadata['og:description'],metadata.description,`${relative}: social description mismatch`);
  assert.equal(new URL(canonical).origin,'https://srinfotech.biz',`${relative}: canonical host`);
  assert.equal(new URL(canonical).search,'',`${relative}: canonical must not carry query parameters`);
  titles.add(title);
  descriptions.add(metadata.description);
  assert.ok(!pages.has(canonical),`${relative}: duplicate canonical`);
  const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>{
    const schema=JSON.parse(match[1]);
    return schema['@graph'] || [schema];
  });
  const webpage=nodes.find(node=>node['@type']==='WebPage');
  assert.equal(webpage?.url,canonical,`${relative}: page entity URL`);
  assert.equal(webpage?.name,title,`${relative}: page entity title`);
  const organization=nodes.find(node=>node['@type']==='Organization');
  const logo=typeof organization?.logo==='string' ? organization.logo : organization?.logo?.url;
  assert.ok(logo,`${relative}: organization logo`);
  if(!checkedLogos.has(logo)) {
    const image=await sharp(path.join(root,new URL(logo).pathname)).metadata();
    assert.ok(image.width>=112 && image.height>=112,'Organization logo must meet minimum image dimensions');
    checkedLogos.add(logo);
  }
  const breadcrumbs=nodes.filter(node=>node['@type']==='BreadcrumbList');
  if (html.includes('aria-label="Breadcrumb"')) {
    assert.equal(breadcrumbs.length,1,`${relative}: one breadcrumb schema for the visible trail`);
    assert.equal(breadcrumbs[0].itemListElement.at(-1).item,canonical,`${relative}: final breadcrumb URL`);
  }
  const article=nodes.find(node=>node['@type']==='BlogPosting');
  if (article) {
    assert.equal(article.mainEntityOfPage['@id'],`${canonical}#webpage`,`${relative}: article/page relationship`);
    assert.equal(breadcrumbs[0].itemListElement.at(-1).name,article.headline,`${relative}: article breadcrumb title`);
    assert.equal(article.datePublished,metadata['article:published_time'],`${relative}: publication metadata`);
    assert.equal(article.dateModified,metadata['article:modified_time'],`${relative}: modification metadata`);
    assert.ok(Date.parse(article.dateModified)>=Date.parse(article.datePublished),`${relative}: invalid article chronology`);
    assert.ok(Date.parse(article.dateModified)<=Date.now(),`${relative}: future article modification date`);
    assert.ok(article.author?.name && article.author?.url,`${relative}: identifiable article author`);
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const img=attributes(tag);
    assert.ok(Object.hasOwn(img,'alt'),`${relative}: image needs an alt attribute`);
    assert.ok(Number(img.width)>0 && Number(img.height)>0,`${relative}: reserve image dimensions`);
  }
  const links=[...html.matchAll(/<a\b[^>]*>/g)].map(([tag])=>attributes(tag).href).filter(href=>href?.startsWith('/') && !href.startsWith('//')).map(href=>{
    const url=new URL(href,'https://srinfotech.biz');
    return url.origin+url.pathname;
  });
  pages.set(canonical,{indexable,links,modified:metadata['article:modified_time']});
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const value = match[1].split(/[?#]/)[0];
    if (value.startsWith('//') || !value) continue;
    const target = path.join(root,decodeURIComponent(value));
    let exists = false;
    try { const info=await stat(target); exists=info.isFile() || (info.isDirectory() && (await stat(path.join(target,'index.html'))).isFile()); } catch {}
    assert.ok(exists,`${relative}: broken internal URL ${value}`);
  }
  pageCount++;
}
assert.ok(!files.some(file=>file.includes('old business website data')),'Old website archive must not ship');
assert.ok(!files.some(file=>file.includes('local-context')),'Local context must not ship');
const sitemapIndex = await readFile(path.join(root,'sitemap-index.xml'),'utf8');
assert.equal(await readFile(path.join(root,'sitemap.xml'),'utf8'),sitemapIndex,'Legacy sitemap URL matches the generated index');
assert.match(await readFile(path.join(root,'robots.txt'),'utf8'),/Sitemap: https:\/\/srinfotech\.biz\/sitemap-index\.xml/);
const sitemap = await readFile(path.join(root,'sitemap-0.xml'),'utf8');
assert.ok(!sitemap.includes('/404') && !sitemap.includes('contact.html'),'No error or legacy aliases in sitemap');
const sitemapFiles=files.filter(file=>/^sitemap-\d+\.xml$/.test(path.basename(file)));
const sitemapEntries=(await Promise.all(sitemapFiles.map(file=>readFile(file,'utf8')))).flatMap(xml=>[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match=>({
  url:decode(match[1].match(/<loc>([^<]+)<\/loc>/)?.[1] || ''),
  modified:match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
})));
const listed=new Set(sitemapEntries.map(entry=>entry.url));
assert.equal(listed.size,sitemapEntries.length,'No duplicate sitemap URLs');
for (const [url,page] of pages) {
  assert.equal(listed.has(url),page.indexable,`Sitemap/indexability mismatch: ${url}`);
  if(page.modified) assert.equal(sitemapEntries.find(entry=>entry.url===url)?.modified,page.modified,`Accurate sitemap lastmod: ${url}`);
}
for(const url of listed) assert.ok(pages.get(url)?.indexable,`Sitemap references a missing or non-indexable page: ${url}`);
const reached=new Set();
const queue=['https://srinfotech.biz/'];
while(queue.length) {
  const url=queue.shift();
  if(reached.has(url)) continue;
  reached.add(url);
  const page=pages.get(url);
  if(page) queue.push(...page.links.filter(link=>pages.has(link) && !reached.has(link)));
}
for(const [url,page] of pages) if(page.indexable) assert.ok(reached.has(url),`Orphan page: ${url}`);
for (const file of htmlFiles.filter(file => path.relative(root,file).replaceAll('\\','/').match(/^insights\/[^/]+\/index\.html$/))) {
  const articlePath = path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'');
  assert.ok(sitemap.includes(`https://srinfotech.biz/${articlePath}`),`Published article missing from sitemap: ${articlePath}`);
}
assert.match(await readFile(path.join(root,'rss.xml'),'utf8'), /prepare-surplus-stock-list/);
console.log(`Verified ${pageCount} content/error pages: unique metadata, canonical/entity alignment, article dates, breadcrumbs, image attributes and local links. Exact sitemap coverage, lastmod, crawlable reachability, RSS and archive exclusion passed.`);
