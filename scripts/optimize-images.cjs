/*
Image asset flow

  src/assets/originals/images/ or uploads/       Read-only, full-quality source files
                         |
                         v
                   Walk every file
                         |
          +--------------+--------------+
          |                             |
          v                             v
    HEIC / HEIF                      Other files
      skipped                            |
                                   +-----+-----------------------------+
                                   |                                   |
                                   v                                   v
                          Video, SVG, GIF, small image          JPG, JPEG, PNG, WebP, AVIF
                                  copied unchanged                       |
                                                                    rotate from EXIF
                                                                    resize to <= 2400px
                                                                    encode at web quality
                                                                    keep original if smaller
                                                                           |
                                                                           v
  src/assets/images/ or uploads/       Written only when the served file changed
                         |
                         v
                    webpack copies it to dist/assets/

Run by npm start and npm run build. It never modifies files under originals/.
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const ORIGINAL_ROOT = path.join(ROOT, 'src/assets/originals');
const OUTPUT_ROOT = path.join(ROOT, 'src/assets');
const TARGETS = [
  { source: path.join(ORIGINAL_ROOT, 'images'), output: path.join(OUTPUT_ROOT, 'images') },
  { source: path.join(ORIGINAL_ROOT, 'uploads'), output: path.join(OUTPUT_ROOT, 'uploads') },
];
const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const BLOCKED_EXTS = new Set(['.heic', '.heif']);
const MAX_DIMENSION = 2400;
const JPG_QUALITY = 93;
const WEBP_QUALITY = 91;
const AVIF_QUALITY = 72;
const HARD_MAX_BYTES = 900 * 1024;
const MIN_SAVINGS_RATIO = 0.08;
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
    if (entry.name === '.DS_Store') continue;
    out.push(full);
  }
  return out;
};

const toOptimizer = (pipeline, ext) => {
  if (ext === '.jpg' || ext === '.jpeg') {
    return pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true });
  }
  if (ext === '.png') {
    return pipeline.png({ compressionLevel: 9 });
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

const ensureParentDir = async (absPath) => {
  await fs.promises.mkdir(path.dirname(absPath), { recursive: true });
};

const sameBuffer = async (absPath, next) => {
  try {
    const current = await fs.promises.readFile(absPath);
    return current.equals(next);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
};

const prepareOutput = async (absPath) => {
  const ext = path.extname(absPath).toLowerCase();
  const source = await fs.promises.readFile(absPath);
  if (BLOCKED_EXTS.has(ext)) return { status: 'skipped', before: source.length, output: null };
  if (!SUPPORTED_EXTS.has(ext)) return { status: 'copied', before: source.length, output: source };
  if (source.length < MIN_SIZE_BYTES) return { status: 'copied', before: source.length, output: source };

  const probe = sharp(source, { failOn: 'none' });
  const meta = await probe.metadata();
  if (!meta.width || !meta.height) return { status: 'copied', before: source.length, output: source };

  let optimized = await toOptimizer(makePipeline(source, MAX_DIMENSION), ext).toBuffer();

  // Only apply a second pass to unusually large files; keep detail the default.
  if ((ext === '.jpg' || ext === '.jpeg' || ext === '.webp') && optimized.length > HARD_MAX_BYTES) {
    const tightened =
      ext === '.webp'
        ? await makePipeline(source, 2200).webp({ quality: 88 }).toBuffer()
        : await makePipeline(source, 2200).jpeg({ quality: 89, mozjpeg: true, progressive: true }).toBuffer();
    if (tightened.length < optimized.length) {
      optimized = tightened;
    }
  }
  const savings = source.length - optimized.length;
  const ratio = source.length > 0 ? savings / source.length : 0;
  const shouldOptimize = optimized.length < source.length && ratio >= MIN_SAVINGS_RATIO;
  return {
    status: shouldOptimize ? 'optimized' : 'copied',
    before: source.length,
    output: shouldOptimize ? optimized : source,
  };
};

const materializeFile = async ({ sourcePath, outputPath }) => {
  const result = await prepareOutput(sourcePath);
  if (!result.output) return { ...result, after: 0 };
  if (await sameBuffer(outputPath, result.output)) {
    return { ...result, status: 'unchanged', after: result.output.length };
  }
  await ensureParentDir(outputPath);
  await fs.promises.writeFile(outputPath, result.output);
  return { ...result, after: result.output.length };
};

const formatKb = (bytes) => `${Math.round(bytes / 1024)}KB`;

const main = async () => {
  const files = TARGETS.flatMap((target) =>
    walkFiles(target.source).map((sourcePath) => ({
      sourcePath,
      outputPath: path.join(target.output, path.relative(target.source, sourcePath)),
    }))
  );
  if (!files.length) {
    console.log('optimize-images: no original assets found.');
    return;
  }

  let optimizedCount = 0;
  let copiedCount = 0;
  let skippedCount = 0;
  let unchangedCount = 0;
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    try {
      const result = await materializeFile(file);
      beforeTotal += result.before;
      afterTotal += result.after;
      if (result.status === 'optimized') optimizedCount += 1;
      if (result.status === 'copied') copiedCount += 1;
      if (result.status === 'skipped') skippedCount += 1;
      if (result.status === 'unchanged') unchangedCount += 1;
    } catch (err) {
      skippedCount += 1;
      const rel = path.relative(ROOT, file.sourcePath);
      console.warn(`optimize-images: skipped ${rel} (${err.message})`);
    }
  }

  const savings = beforeTotal - afterTotal;
  console.log(
    `optimize-images: optimized ${optimizedCount}, copied ${copiedCount}, unchanged ${unchangedCount}, skipped ${skippedCount}. ` +
      `Saved ${formatKb(Math.max(savings, 0))} (${formatKb(beforeTotal)} -> ${formatKb(afterTotal)}).`
  );
};

main().catch((err) => {
  console.error(`optimize-images: failed (${err.message})`);
  process.exit(1);
});
