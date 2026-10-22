import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(15).max(110),
    description: z.string().min(60).max(180),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['Inventory strategy', 'Supplier guides', 'Electronics', 'Apparel', 'Footwear']),
    image: z.enum(['warehouse', 'apparel', 'footwear', 'home-kitchen', 'electronics', 'hero', 'apparel-stocklots', 'electronics-grading', 'stock-conditions']),
    imageAlt: z.string().min(5),
    readingTime: z.number().int().min(1),
    author: z.string().default('SR Infotech'),
    relatedCategories: z.array(z.enum(['apparel', 'footwear', 'home-kitchen', 'electronics'])).default([]),
    draft: z.boolean().default(true),
  }).refine(data => !data.updatedDate || data.updatedDate >= data.pubDate, {
    message: 'updatedDate must not precede pubDate.',
    path: ['updatedDate'],
  }),
});
export const collections = { blog };
