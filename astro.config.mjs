// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://blog.argostudio.co',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
    mdx(),
  ],
});
