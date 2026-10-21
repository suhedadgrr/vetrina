import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirectMap, shortLinks } from './content/links.ts';

// SITE_URL ve BASE_PATH ortam değişkenleriyle deploy hedefine göre ayarlanır.
// Özel alan adı / Cloudflare Pages:  SITE_URL=https://vetrina.com.tr  BASE_PATH=/
// GitHub Pages (proje sitesi):       SITE_URL=https://<kullanici>.github.io  BASE_PATH=/Vetrina---Web-
const site = process.env.SITE_URL || 'https://vetrina.example';
const base = process.env.BASE_PATH || '/';

// Üretim şablonları (OG/paylaşım görselleri, PDF, showreel) yalnızca STUDIO=1 ile derlenir;
// canlı sitenin çıktısına (dist) girmez. `npm run assets` bunu otomatik yapar.
const studio = {
  name: 'vetrina-studio',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (!process.env.STUDIO) return;
      for (const [pattern, entrypoint] of [
        ['/studio/og/[slug]', './src/studio/og/[slug].astro'],
        ['/studio/share/[slug]/[format]', './src/studio/share/[slug]/[format].astro'],
        ['/studio/showreel', './src/studio/showreel.astro'],
        ['/studio/b2b-deck', './src/studio/b2b-deck.astro'],
      ]) {
        injectRoute({ pattern, entrypoint });
      }
    },
  },
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  prefetch: false,
  redirects: redirectMap(),
  integrations: [
    studio,
    sitemap({
      filter: (page) =>
        !page.includes('/tesekkurler/') && !shortLinks.some((l) => page.endsWith(`/${l.slug}/`)),
    }),
  ],
});
