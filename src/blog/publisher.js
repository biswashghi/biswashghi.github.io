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

const safeFilename = (name) =>
  String(name || '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '');

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
