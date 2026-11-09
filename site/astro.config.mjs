import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://opluke11-abula.github.io',
  base: '/library',
  output: 'static',
  trailingSlash: 'always',
});
