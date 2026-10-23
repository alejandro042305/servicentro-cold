// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE } from './src/config/site.ts';
import { siteUrl } from './src/lib/data.ts';

// Rutas que no van al sitemap: landings de Ads, gracias, kit interno y 404.
const EXCLUIR = ['/lp/', '/gracias/', '/_kit/', '/404'];

// Vista previa en GitHub Pages: SITE_URL y BASE_PATH llegan desde el workflow.
// En Hostinger no se definen: el sitio vive en la raíz del dominio de site.ts.
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || siteUrl(SITE.dominio),
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: false,
  integrations: [
    icon({ include: { lucide: ['*'] } }),
    sitemap({ filter: (page) => !EXCLUIR.some((r) => page.includes(r)) }),
  ],
  image: { responsiveStyles: false },
});
