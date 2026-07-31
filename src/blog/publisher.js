const DEFAULT_REPO = 'biswashghi/biswashghi.github.io';

const TOKEN_STORAGE_KEY = 'blog_admin_github_pat_v1';
const REPO_STORAGE_KEY = 'blog_admin_github_repo_v1';

export const adminStorage = {
  DEFAULT_REPO,
  TOKEN_STORAGE_KEY,
  REPO_STORAGE_KEY,
  getToken() {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  },
  setToken(token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clearToken() {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  },
  getRepo() {
    return localStorage.getItem(REPO_STORAGE_KEY) || DEFAULT_REPO;
  },
  setRepo(repoFull) {
    localStorage.setItem(REPO_STORAGE_KEY, repoFull);
  },
};

export const todayLocalIsoDate = () => {
  const d = new Date();
  const y = String(d.getFullYear());
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const slugify = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
};

export const isValidSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const stripFencedCode = (mdx) => {
  // Remove fenced code blocks to avoid false positives when checking for MDX JS usage.
  return String(mdx || '').replace(/```[\s\S]*?```/g, '');
};

export const validateMdxBodySafety = (body) => {
  const text = stripFencedCode(body);
  const forbidden = [
    { pattern: /\bimport\s+/, reason: 'MDX body must not contain import statements.' },
    { pattern: /\bexport\s+/, reason: 'MDX body must not contain export statements.' },
    { pattern: /\bprocess\./, reason: 'MDX body must not reference process.*.' },
    { pattern: /\brequire\s*\(/, reason: 'MDX body must not call require().' },
  ];
  for (const rule of forbidden) {
    if (rule.pattern.test(text)) return rule.reason;
  }
  return null;
};

const toBase64 = async (file) => {
  const buf = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

export const ghFetch = async (url, token, init = {}) => {
  const method = (init.method || 'GET').toUpperCase();
  const tokenTrimmed = String(token || '').trim();
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      // Fine-grained PATs work reliably with Bearer.
      Authorization: `Bearer ${tokenTrimmed}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const message =
      typeof data === 'object' && data && data.message ? data.message : String(data || 'Request failed');
    const err = new Error(`${method} ${url} -> HTTP ${res.status}: ${message}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

const createBlob = async ({ owner, repo, token, content, encoding }) => {
  return ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, token, {
    method: 'POST',
    body: JSON.stringify({ content, encoding }),
  });
};

const parseRepoFull = (repoFull) => {
  const [owner, repo, ...rest] = String(repoFull || '').trim().split('/');
  if (!owner || !repo || rest.length) throw new Error('Repo must be in the form owner/repo.');
  return { owner, repo };
};

const getRepositoryBase = async ({ owner, repo, token }) => {
  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, token);
  const branch = repoInfo.default_branch || 'main';
  const ref = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, token);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits/${baseCommitSha}`,
    token
  );
  return { branch, baseCommitSha, baseTreeSha: baseCommit.tree.sha };
};

const isReferenceConflict = (error) => error && (error.status === 409 || error.status === 422);

export const commitRepositoryChanges = async ({ token, repoFull, message, changes, maxAttempts = 2 }) => {
  const tokenTrimmed = String(token || '').trim();
  const { owner, repo } = parseRepoFull(repoFull);
  if (!tokenTrimmed) throw new Error('Missing GitHub token.');
  if (!message || !Array.isArray(changes) || !changes.length) throw new Error('A commit message and at least one change are required.');
  const paths = new Set();
  for (const change of changes) {
    if (!change?.path || paths.has(change.path)) throw new Error('Each commit change needs a unique path.');
    paths.add(change.path);
  }

  let lastError;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const { branch, baseCommitSha, baseTreeSha } = await getRepositoryBase({ owner, repo, token: tokenTrimmed });
      const tree = [];
      for (const change of changes) {
        const content = change.file ? await toBase64(change.file) : String(change.content || '');
        const blob = await createBlob({
          owner,
          repo,
          token: tokenTrimmed,
          content,
          encoding: change.file ? 'base64' : 'utf-8',
        });
        tree.push({ path: change.path, mode: '100644', type: 'blob', sha: blob.sha });
      }
      const newTree = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, tokenTrimmed, {
        method: 'POST',
        body: JSON.stringify({ base_tree: baseTreeSha, tree }),
      });
      const newCommit = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, tokenTrimmed, {
        method: 'POST',
        body: JSON.stringify({ message, tree: newTree.sha, parents: [baseCommitSha] }),
      });
      await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, tokenTrimmed, {
        method: 'PATCH',
        body: JSON.stringify({ sha: newCommit.sha }),
      });
      return { branch, commitSha: newCommit.sha, changedPaths: [...paths] };
    } catch (error) {
      lastError = error;
      if (!isReferenceConflict(error) || attempt + 1 >= maxAttempts) throw error;
    }
  }
  throw lastError;
};

export const WEB_SAFE_IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,image/avif,image/svg+xml';

export const safeFilename = (name) =>
  String(name || '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '');

const extensionForUpload = (file) => {
  const nameExt = String(file?.name || '').match(/\.([A-Za-z0-9]+)$/)?.[1]?.toLowerCase();
  if (nameExt === 'jpeg') return 'jpg';
  if (nameExt) return nameExt;
  if (file?.type === 'image/jpeg') return 'jpg';
  if (file?.type === 'image/png') return 'png';
  if (file?.type === 'image/webp') return 'webp';
  if (file?.type === 'image/avif') return 'avif';
  if (file?.type === 'image/gif') return 'gif';
  if (file?.type === 'image/svg+xml') return 'svg';
  return 'jpg';
};

const isHeicFilename = (name) => /\.(heic|heif)$/i.test(String(name || ''));

const heicError = 'HEIC/HEIF images are not web-safe for this site yet. Export the image as JPG, PNG, WebP, AVIF, GIF, or SVG first.';

const assertNotHeicUpload = (file, filename) => {
  if (isHeicFilename(file?.name) || isHeicFilename(filename) || /hei[cf]/i.test(String(file?.type || ''))) {
    throw new Error(heicError);
  }
};

const assertWebSafeImageUpload = (file, filename, label) => {
  if (!file) throw new Error(`Choose ${label || 'an image'} first.`);
  if (!file.type || !file.type.startsWith('image/')) throw new Error(`${label || 'Upload'} must be an image.`);
  assertNotHeicUpload(file, filename);
};

const decodeBase64Utf8 = (value) => {
  const binary = atob(String(value || '').replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const parseArtArchive = (source) => {
  const archive = JSON.parse(source);
  if (!Array.isArray(archive)) throw new Error('src/data/art.json must contain an array.');
  return archive;
};

const updateArtArchive = (archive, bucketTitle, filename) => {
  const title = String(bucketTitle || '').trim();
  const safeFile = safeFilename(filename);
  if (!title || !safeFile) throw new Error('Missing art bucket or filename.');
  const existing = archive.find((bucket) => bucket && bucket.title === title);
  if (existing) {
    const drawings = Array.isArray(existing.drawings) ? existing.drawings : [];
    return archive.map((bucket) =>
      bucket === existing ? { ...bucket, drawings: drawings.includes(safeFile) ? drawings : [...drawings, safeFile] } : bucket
    );
  }
  return [...archive, { title, description: 'A growing bucket of uploaded visual work.', drawings: [safeFile] }];
};

export const buildMdxWithFrontmatter = ({ title, slug, date, excerpt, coverSrc, coverAlt, body }) => {
  const safeTitle = String(title || '').replace(/"/g, '\\"').trim();
  const safeSlug = String(slug || '').trim();
  const safeDate = String(date || '').trim();
  const safeExcerpt = String(excerpt || '').replace(/"/g, '\\"').trim();

  const safeCoverSrc = String(coverSrc || '').trim();
  const safeCoverAlt = String(coverAlt || '').replace(/"/g, '\\"').trim();

  const frontmatterLines = [
    '---',
    `title: "${safeTitle}"`,
    `slug: "${safeSlug}"`,
    `date: "${safeDate}"`,
    `excerpt: "${safeExcerpt}"`,
    'cover:',
    `  src: "${safeCoverSrc}"`,
    `  alt: "${safeCoverAlt}"`,
    '---',
    '',
  ];

  return `${frontmatterLines.join('\n')}${String(body || '').trim()}\n`;
};

export const publishPostToGitHub = async ({
  token,
  repoFull,
  title,
  slug,
  date,
  excerpt,
  coverAlt,
  body,
  coverFile,
  extraFiles,
}) => {
  const coverUploadPath = coverFile ? `src/assets/uploads/${safeFilename(coverFile.name)}` : '';
  const coverPublic = coverFile ? coverUploadPath.replace(/^src\/assets\//, '/assets/') : '';
  const mdx = buildMdxWithFrontmatter({
    title,
    slug,
    date,
    excerpt,
    coverSrc: coverPublic,
    coverAlt,
    body,
  });

  const mdxPath = `src/blog/posts/${slug}.mdx`;
  const uploads = [];
  if (coverFile) uploads.push({ file: coverFile, path: coverUploadPath });
  for (const f of extraFiles || []) uploads.push({ file: f, path: `src/assets/uploads/${safeFilename(f.name)}` });

  const allUploads = [...uploads.map((u) => u.file)];
  for (const f of allUploads) {
    if (f.size > 25 * 1024 * 1024) throw new Error(`File too large (${f.name}). Keep uploads under ~25MB.`);
    assertNotHeicUpload(f, safeFilename(f.name));
  }

  const result = await commitRepositoryChanges({
    token,
    repoFull,
    message: `blog: ${slug}`,
    changes: [{ path: mdxPath, content: mdx }, ...uploads.map((upload) => ({ path: upload.path, file: upload.file }))],
  });
  return { path: mdxPath, ...result };
};

export const publishArtImageToGitHub = async ({ token, repoFull, bucketTitle, file, filename }) => {
  const { owner, repo } = parseRepoFull(repoFull);
  const tokenTrimmed = String(token || '').trim();
  if (!bucketTitle) throw new Error('Choose an art bucket.');
  if (!file) throw new Error('Choose an image to upload.');
  if (file.size > 25 * 1024 * 1024) throw new Error(`File too large (${file.name}). Keep uploads under ~25MB.`);

  const uploadName = safeFilename(filename || file.name);
  if (!uploadName) throw new Error('Filename is required.');
  assertWebSafeImageUpload(file, uploadName, 'Art upload');
  const imagePath = `src/assets/images/drawing/${uploadName}`;
  const dataPath = 'src/data/art.json';
  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, tokenTrimmed);
  const branch = repoInfo.default_branch || 'main';
  const artInfo = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}?ref=${encodeURIComponent(branch)}`,
    tokenTrimmed
  );
  const nextArchive = updateArtArchive(parseArtArchive(decodeBase64Utf8(artInfo.content)), bucketTitle, uploadName);
  const result = await commitRepositoryChanges({
    token,
    repoFull,
    message: `art: add ${uploadName}`,
    // The archive content was read above; retrying stale JSON could overwrite a concurrent edit.
    maxAttempts: 1,
    changes: [
      { path: imagePath, file },
      { path: dataPath, content: `${JSON.stringify(nextArchive, null, 2)}\n` },
    ],
  });
  return { imagePath, dataPath, ...result };
};

export const publishPhotoOfMonthToGitHub = async ({
  token,
  repoFull,
  month,
  file,
  caption,
}) => {
  const tokenTrimmed = String(token || '').trim();
  const { owner, repo } = parseRepoFull(repoFull);
  if (!/^\d{4}-\d{2}$/.test(String(month || '').trim())) throw new Error('Month must be YYYY-MM.');
  if (!file) throw new Error('Choose an image to upload.');
  if (file.size > 25 * 1024 * 1024) throw new Error(`File too large (${file.name}). Keep uploads under ~25MB.`);

  const safeMonth = String(month).trim();
  const uploadName = `${safeMonth}.${extensionForUpload(file)}`;
  if (!uploadName) throw new Error('Filename is required.');
  assertWebSafeImageUpload(file, uploadName, 'Photo of the Month upload');
  const imagePath = `src/assets/images/photo-of-month/${uploadName}`;
  const dataPath = 'src/data/photosOfMonth.json';
  const publicSrc = imagePath.replace(/^src\/assets\//, '/assets/');

  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, tokenTrimmed);
  const branch = repoInfo.default_branch || 'main';

  let existing = [];
  try {
    const dataInfo = await ghFetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}?ref=${encodeURIComponent(branch)}`,
      tokenTrimmed
    );
    existing = JSON.parse(decodeBase64Utf8(dataInfo.content));
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  if (!Array.isArray(existing)) throw new Error(`${dataPath} must contain a JSON array.`);

  const nextEntry = {
    month: safeMonth,
    src: publicSrc,
    caption: String(caption || '').trim(),
  };
  const nextPhotos = existing
    .filter((entry) => entry && entry.month !== safeMonth)
    .concat(nextEntry)
    .sort((a, b) => String(b.month).localeCompare(String(a.month)));
  const nextData = `${JSON.stringify(nextPhotos, null, 2)}\n`;

  const result = await commitRepositoryChanges({
    token,
    repoFull,
    message: `photo: ${safeMonth}`,
    // The monthly data was read above; surface conflicts rather than overwriting newer entries.
    maxAttempts: 1,
    changes: [
      { path: imagePath, file },
      { path: dataPath, content: nextData },
    ],
  });
  return { imagePath, dataPath, ...result };
};

export const deletePostFromGitHub = async ({ token, repoFull, slug }) => {
  const tokenTrimmed = String(token || '').trim();
  const repoTrimmed = String(repoFull || '').trim();
  const [owner, repo] = repoTrimmed.split('/');
  if (!owner || !repo) throw new Error('Repo must be in the form owner/repo.');
  if (!slug) throw new Error('Missing slug.');

  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, tokenTrimmed);
  const branch = repoInfo.default_branch || 'main';

  const path = `src/blog/posts/${slug}.mdx`;
  const info = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`,
    tokenTrimmed
  );

  if (!info || !info.sha) {
    throw new Error(`Could not resolve SHA for ${path}.`);
  }

  await ghFetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, tokenTrimmed, {
    method: 'DELETE',
    body: JSON.stringify({
      message: `blog: delete ${slug}`,
      sha: info.sha,
      branch,
    }),
  });

  return { path, branch };
};
