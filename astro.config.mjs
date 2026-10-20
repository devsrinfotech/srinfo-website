import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://srinfotech.biz',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') && !page.endsWith('.html') })],
});
