const ctx = require.context('./', false, /\.mdx$/);

export const posts = ctx
  .keys()
  .map((key) => {
    const mod = ctx(key);
    // Webpack interop can return either a module namespace object or the default export directly.
    const Component = (mod && mod.default) || mod;
    const meta = (mod && mod.meta) || {};
    return { ...meta, Component };
  })
  .filter((post) => post && post.slug && post.title && post.date)
  .sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return db - da;
  });

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null;
}
