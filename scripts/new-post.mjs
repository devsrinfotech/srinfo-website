import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const title = process.argv.slice(2).join(' ').trim();
if (title.length < 15 || title.length > 110) {
  console.error('Usage: npm run new-post -- "A descriptive article title between 15 and 110 characters"');
  process.exit(1);
}
const slug = title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
if (!slug) throw new Error('Please use a title that creates a usable URL slug.');
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year:'numeric',month:'2-digit',day:'2-digit' }).format(new Date());
const directory = path.resolve('src/content/blog');
await mkdir(directory, {recursive:true});
const file = path.join(directory, `${slug}.md`);
const source = `---
title: ${JSON.stringify(title)}
description: "Replace this with a useful, accurate 60–180 character summary for inventory owners."
pubDate: ${date}
category: "Supplier guides"
relatedCategories: []
image: "warehouse"
imageAlt: "Illustrative warehouse receiving desk with mixed stock cartons and tall pallet racks"
readingTime: 4
draft: true
---

## Give the answer first

Write a direct, useful answer to the supplier's question. Replace this draft before publishing.

## Explain the practical next steps

Use original guidance, clear examples and verified sources where appropriate.

## Start a buying conversation

Link to a relevant category or service and [contact SR Infotech](/contact/).
`;
try {
  await writeFile(file, source, {flag:'wx'});
  console.log(`Draft created: ${file}\nReview the content and set draft: false when ready. Existing files are never overwritten.`);
} catch (error) {
  if (error.code === 'EEXIST') console.error(`A post already exists at ${file}. Edit that file or choose a distinct title.`);
  else throw error;
  process.exitCode = 1;
}
