/* Creates files GitHub Pages needs for SPA deep-links. */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexHtml = path.join(distDir, 'index.html');
const notFoundHtml = path.join(distDir, '404.html');
const noJekyll = path.join(distDir, '.nojekyll');

if (!fs.existsSync(indexHtml)) {
  // eslint-disable-next-line no-console
  console.error('postbuild: dist/index.html not found. Did you run the build first?');
  process.exit(1);
}

fs.copyFileSync(indexHtml, notFoundHtml);
fs.writeFileSync(noJekyll, '', 'utf8');

