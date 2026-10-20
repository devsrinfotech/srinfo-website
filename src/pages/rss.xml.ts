import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isPublished, newestFirst } from '../lib/content.mjs';
import { site } from '../data/site';
export async function GET() {
  const posts = (await getCollection('blog', ({data}) => isPublished(data))).sort(newestFirst);
  return rss({
    title: 'SR Infotech — Inventory Insights',
    description: 'Practical guides for brands and businesses selling surplus inventory in India.',
    site: site.url,
    items: posts.map(post => ({ title: post.data.title, pubDate: post.data.pubDate, description: post.data.description, link: `/insights/${post.id}/` })),
    customData: '<language>en-IN</language>',
  });
}
