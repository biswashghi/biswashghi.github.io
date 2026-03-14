import FirstCruiseBahamas, { meta as eventProcessingMeta } from './first-cruise-bahamas.mdx';
import DrawingsPost, { meta as drawingsMeta } from './drawings.mdx';

export const posts = [
  { ...eventProcessingMeta, Component: FirstCruiseBahamas },
  { ...drawingsMeta, Component: DrawingsPost },
].sort((a, b) => {
  const da = new Date(a.date).getTime();
  const db = new Date(b.date).getTime();
  return db - da;
});

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null;
}
