import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublished, newestFirst } from '../src/lib/content.mjs';

test('drafts and future posts are excluded from all public collections', () => {
  const now = new Date('2026-10-20T10:00:00Z');
  assert.equal(isPublished({ pubDate: '2026-10-20', draft: false }, now), true);
  assert.equal(isPublished({ pubDate: '2026-10-20', draft: true }, now), false);
  assert.equal(isPublished({ pubDate: '2026-10-21', draft: false }, now), false);
});

test('scheduled publishing follows India calendar boundaries', () => {
  const post = { pubDate: '2026-10-21', draft: false };
  assert.equal(isPublished(post, new Date('2026-10-20T18:29:59Z')), false);
  assert.equal(isPublished(post, new Date('2026-10-20T18:30:00Z')), true);
});

test('equal publication dates use a stable secondary ordering', () => {
  const posts = [
    {id:'b',data:{pubDate:'2026-10-20'}},
    {id:'a',data:{pubDate:'2026-10-20'}},
    {id:'newest',data:{pubDate:'2026-10-21'}},
  ];
  assert.deepEqual(posts.sort(newestFirst).map(post => post.id), ['newest','a','b']);
});
