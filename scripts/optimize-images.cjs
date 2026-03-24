/* Optimize blog/site images in-place before start/build to improve load times. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TARGET_DIRS = ['src/assets/images', 'src/assets/uploads'];
const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const MAX_DIMENSION = 1600;
const JPG_QUALITY = 76;
const WEBP_QUALITY = 76;
const AVIF_QUALITY = 50;
const HARD_MAX_BYTES = 240 * 1024;
const MIN_SAVINGS_RATIO = 0.02;
const MIN_SIZE_BYTES = 80 * 1024;

const walkFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full));
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (SUPPORTED_EXTS.has(ext)) out.push(full);
  }
  return out;
};

const toOptimizer = (pipeline, ext) => {
  if (ext === '.jpg' || ext === '.jpeg') {
    return pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true });
  }
  if (ext === '.png') {
    return pipeline.png({ compressionLevel: 9, palette: true, quality: JPG_QUALITY });
  }
  if (ext === '.webp') {
    return pipeline.webp({ quality: WEBP_QUALITY });
  }
  return pipeline.avif({ quality: AVIF_QUALITY });
};

const makePipeline = (source, maxDimension) =>
  sharp(source, { failOn: 'none' })
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    });

const optimizeFile = async (absPath) => {
  const ext = path.extname(absPath).toLowerCase();
  if (!SUPPORTED_EXTS.has(ext)) return { status: 'skipped', before: 0, after: 0 };

  const source = await fs.promises.readFile(absPath);
  if (source.length < MIN_SIZE_BYTES) return { status: 'skipped', before: source.length, after: source.length };

  const probe = sharp(source, { failOn: 'none' });
  const meta = await probe.metadata();
  if (!meta.width || !meta.height) return { status: 'skipped', before: source.length, after: source.length };

  let optimized = await toOptimizer(makePipeline(source, MAX_DIMENSION), ext).toBuffer();

  // Keep very large JPEG/WebP files under control for faster blog loading.
  if ((ext === '.jpg' || ext === '.jpeg' || ext === '.webp') && optimized.length > HARD_MAX_BYTES) {
    const tightened =
      ext === '.webp'
        ? await makePipeline(source, 1400).webp({ quality: 68 }).toBuffer()
        : await makePipeline(source, 1400).jpeg({ quality: 68, mozjpeg: true, progressive: true }).toBuffer();
    if (tightened.length < optimized.length) {
      optimized = tightened;
    }
  }
  const savings = source.length - optimized.length;
  const ratio = source.length > 0 ? savings / source.length : 0;
  const shouldWrite = optimized.length < source.length && ratio >= MIN_SAVINGS_RATIO;

  if (!shouldWrite) {
    return { status: 'unchanged', before: source.length, after: source.length };
  }

  await fs.promises.writeFile(absPath, optimized);
  return { status: 'optimized', before: source.length, after: optimized.length };
};

const formatKb = (bytes) => `${Math.round(bytes / 1024)}KB`;

const main = async () => {
  const files = TARGET_DIRS.flatMap((rel) => walkFiles(path.join(ROOT, rel)));
  if (!files.length) {
    console.log('optimize-images: no target images found.');
    return;
  }

  let optimizedCount = 0;
  let skippedCount = 0;
  let unchangedCount = 0;
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    try {
      const result = await optimizeFile(file);
      beforeTotal += result.before;
      afterTotal += result.after;
      if (result.status === 'optimized') optimizedCount += 1;
      if (result.status === 'skipped') skippedCount += 1;
      if (result.status === 'unchanged') unchangedCount += 1;
    } catch (err) {
      skippedCount += 1;
      const rel = path.relative(ROOT, file);
      console.warn(`optimize-images: skipped ${rel} (${err.message})`);
    }
  }

  const savings = beforeTotal - afterTotal;
  console.log(
    `optimize-images: optimized ${optimizedCount}, unchanged ${unchangedCount}, skipped ${skippedCount}. ` +
      `Saved ${formatKb(Math.max(savings, 0))} (${formatKb(beforeTotal)} -> ${formatKb(afterTotal)}).`
  );
};

main().catch((err) => {
  console.error(`optimize-images: failed (${err.message})`);
  process.exit(1);
});
