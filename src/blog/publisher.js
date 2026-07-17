const DEFAULT_REPO = 'biswashghi/biswashghi.github.io';

const TOKEN_STORAGE_KEY = 'blog_admin_github_pat_v1';
const REPO_STORAGE_KEY = 'blog_admin_github_repo_v1';

export const adminStorage = {
  DEFAULT_REPO,
  TOKEN_STORAGE_KEY,
  REPO_STORAGE_KEY,
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  },
  setToken(token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
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

export const safeFilename = (name) =>
  String(name || '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '');

const decodeBase64Utf8 = (value) => {
  const binary = atob(String(value || '').replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const withArtDrawing = (source, bucketTitle, filename) => {
  const safeBucketTitle = String(bucketTitle || '').trim();
  const safeFile = safeFilename(filename);
  if (!safeBucketTitle || !safeFile) throw new Error('Missing art bucket or filename.');
  if (source.includes(`'${safeFile}'`)) return source;

  const titleMarker = `title: '${safeBucketTitle}'`;
  const bucketStart = source.indexOf(titleMarker);
  if (bucketStart === -1) throw new Error(`Could not find art bucket: ${safeBucketTitle}`);

  const drawingsKey = source.indexOf('drawings:', bucketStart);
  if (drawingsKey === -1) throw new Error(`Could not find drawings list for ${safeBucketTitle}.`);

  const arrayStart = source.indexOf('[', drawingsKey);
  if (arrayStart === -1) throw new Error(`Could not find drawings array for ${safeBucketTitle}.`);

  let depth = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < source.length; i += 1) {
    if (source[i] === '[') depth += 1;
    if (source[i] === ']') depth -= 1;
    if (depth === 0) {
      arrayEnd = i;
      break;
    }
  }
  if (arrayEnd === -1) throw new Error(`Could not parse drawings array for ${safeBucketTitle}.`);

  const lineStart = source.lastIndexOf('\n', drawingsKey) + 1;
  const lineIndent = source.slice(lineStart, drawingsKey).match(/^\s*/)[0] || '    ';
  const itemIndent = `${lineIndent}  `;
  const current = source
    .slice(arrayStart + 1, arrayEnd)
    .match(/'([^']+)'/g);
  const drawings = (current || []).map((item) => item.slice(1, -1));
  drawings.push(safeFile);

  const rendered = `[\n${drawings.map((item) => `${itemIndent}'${item}',`).join('\n')}\n${lineIndent}]`;
  return `${source.slice(0, arrayStart)}${rendered}${source.slice(arrayEnd + 1)}`;
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
  const tokenTrimmed = String(token || '').trim();
  const repoTrimmed = String(repoFull || '').trim();
  const [owner, repo] = repoTrimmed.split('/');
  if (!owner || !repo) throw new Error('Repo must be in the form owner/repo.');

  // Detect default branch and confirm repo access up-front.
  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, tokenTrimmed);
  const branch = repoInfo.default_branch || 'main';

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
  }

  // Get base commit + tree.
  const ref = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, tokenTrimmed);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits/${baseCommitSha}`,
    tokenTrimmed
  );
  const baseTreeSha = baseCommit.tree.sha;

  // Blobs
  const treeEntries = [];
  const mdxBlob = await createBlob({ owner, repo, token: tokenTrimmed, content: mdx, encoding: 'utf-8' });
  treeEntries.push({ path: mdxPath, mode: '100644', type: 'blob', sha: mdxBlob.sha });

  for (const u of uploads) {
    const b64 = await toBase64(u.file);
    const blob = await createBlob({ owner, repo, token: tokenTrimmed, content: b64, encoding: 'base64' });
    treeEntries.push({ path: u.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  // Tree
  const newTree = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, tokenTrimmed, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
  });

  // Commit
  const newCommit = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, tokenTrimmed, {
    method: 'POST',
    body: JSON.stringify({
      message: `blog: ${slug}`,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });

  // Update ref
  await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, tokenTrimmed, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  return { path: mdxPath, commitSha: newCommit.sha, branch };
};

export const publishArtImageToGitHub = async ({ token, repoFull, bucketTitle, file, filename }) => {
  const tokenTrimmed = String(token || '').trim();
  const repoTrimmed = String(repoFull || '').trim();
  const [owner, repo] = repoTrimmed.split('/');
  if (!owner || !repo) throw new Error('Repo must be in the form owner/repo.');
  if (!bucketTitle) throw new Error('Choose an art bucket.');
  if (!file) throw new Error('Choose an image to upload.');
  if (!file.type || !file.type.startsWith('image/')) throw new Error('Art upload must be an image.');
  if (file.size > 25 * 1024 * 1024) throw new Error(`File too large (${file.name}). Keep uploads under ~25MB.`);

  const uploadName = safeFilename(filename || file.name);
  if (!uploadName) throw new Error('Filename is required.');
  const imagePath = `src/assets/images/drawing/${uploadName}`;
  const artPagePath = 'src/pages/Art.js';

  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, tokenTrimmed);
  const branch = repoInfo.default_branch || 'main';

  const ref = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, tokenTrimmed);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits/${baseCommitSha}`,
    tokenTrimmed
  );
  const baseTreeSha = baseCommit.tree.sha;

  const artInfo = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${artPagePath}?ref=${encodeURIComponent(branch)}`,
    tokenTrimmed
  );
  const artSource = decodeBase64Utf8(artInfo.content);
  const nextArtSource = withArtDrawing(artSource, bucketTitle, uploadName);

  const imageBlob = await createBlob({
    owner,
    repo,
    token: tokenTrimmed,
    content: await toBase64(file),
    encoding: 'base64',
  });
  const artBlob = await createBlob({
    owner,
    repo,
    token: tokenTrimmed,
    content: nextArtSource,
    encoding: 'utf-8',
  });

  const newTree = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, tokenTrimmed, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: [
        { path: imagePath, mode: '100644', type: 'blob', sha: imageBlob.sha },
        { path: artPagePath, mode: '100644', type: 'blob', sha: artBlob.sha },
      ],
    }),
  });

  const newCommit = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, tokenTrimmed, {
    method: 'POST',
    body: JSON.stringify({
      message: `art: add ${uploadName}`,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });

  await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, tokenTrimmed, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  return { imagePath, artPagePath, commitSha: newCommit.sha, branch };
};

export const publishPhotoOfMonthToGitHub = async ({
  token,
  repoFull,
  month,
  file,
  filename,
  title,
  caption,
  alt,
}) => {
  const tokenTrimmed = String(token || '').trim();
  const repoTrimmed = String(repoFull || '').trim();
  const [owner, repo] = repoTrimmed.split('/');
  if (!owner || !repo) throw new Error('Repo must be in the form owner/repo.');
  if (!/^\d{4}-\d{2}$/.test(String(month || '').trim())) throw new Error('Month must be YYYY-MM.');
  if (!file) throw new Error('Choose an image to upload.');
  if (!file.type || !file.type.startsWith('image/')) throw new Error('Photo of the Month upload must be an image.');
  if (file.size > 25 * 1024 * 1024) throw new Error(`File too large (${file.name}). Keep uploads under ~25MB.`);

  const safeMonth = String(month).trim();
  const uploadName = safeFilename(filename || file.name);
  if (!uploadName) throw new Error('Filename is required.');
  const imagePath = `src/assets/images/photo-of-month/${uploadName}`;
  const dataPath = 'src/data/photosOfMonth.json';
  const publicSrc = imagePath.replace(/^src\/assets\//, '/assets/');

  const repoInfo = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, tokenTrimmed);
  const branch = repoInfo.default_branch || 'main';

  const ref = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, tokenTrimmed);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits/${baseCommitSha}`,
    tokenTrimmed
  );
  const baseTreeSha = baseCommit.tree.sha;

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
    alt: String(alt || title || `Photo of the month for ${safeMonth}`).trim(),
    title: String(title || '').trim(),
    caption: String(caption || '').trim(),
  };
  const nextPhotos = existing
    .filter((entry) => entry && entry.month !== safeMonth)
    .concat(nextEntry)
    .sort((a, b) => String(b.month).localeCompare(String(a.month)));
  const nextData = `${JSON.stringify(nextPhotos, null, 2)}\n`;

  const imageBlob = await createBlob({
    owner,
    repo,
    token: tokenTrimmed,
    content: await toBase64(file),
    encoding: 'base64',
  });
  const dataBlob = await createBlob({
    owner,
    repo,
    token: tokenTrimmed,
    content: nextData,
    encoding: 'utf-8',
  });

  const newTree = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, tokenTrimmed, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: [
        { path: imagePath, mode: '100644', type: 'blob', sha: imageBlob.sha },
        { path: dataPath, mode: '100644', type: 'blob', sha: dataBlob.sha },
      ],
    }),
  });

  const newCommit = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, tokenTrimmed, {
    method: 'POST',
    body: JSON.stringify({
      message: `photo: ${safeMonth}`,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });

  await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, tokenTrimmed, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  return { imagePath, dataPath, commitSha: newCommit.sha, branch };
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
