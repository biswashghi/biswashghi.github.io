import FirstCruiseBahamas, { meta as eventProcessingMeta } from './first-cruise-bahamas.mdx';

export const posts = [
  { ...eventProcessingMeta, Component: FirstCruiseBahamas },
].sort((a, b) => {
  const da = new Date(a.date).getTime();
  const db = new Date(b.date).getTime();
  return db - da;
});

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null;
}

