import { defineConfig } from 'astro/config';

// Static HTML for Cloudflare Pages.
// Build command: npm run build
// Output directory: dist
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
