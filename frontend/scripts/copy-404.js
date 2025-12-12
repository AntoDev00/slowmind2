// Generates a SPA fallback for GitHub Pages so hard refresh on nested routes doesn't 404
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');
const fallbackPath = path.join(buildDir, '404.html');

if (!fs.existsSync(indexPath)) {
  console.error('[copy-404] build/index.html not found. Did you run `npm run build`?');
  process.exit(0);
}

try {
  fs.copyFileSync(indexPath, fallbackPath);
  console.log('[copy-404] Created build/404.html for SPA fallback');
} catch (err) {
  console.error('[copy-404] Failed to create 404.html', err);
}
