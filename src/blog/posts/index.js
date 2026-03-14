import EventProcessingPost, { meta as eventProcessingMeta } from './event-processing-at-scale.mdx';
import TeachingWebPost, { meta as teachingWebMeta } from './teaching-web-systems.mdx';

export const posts = [
  { ...eventProcessingMeta, Component: EventProcessingPost },
  { ...teachingWebMeta, Component: TeachingWebPost },
].sort((a, b) => {
  const da = new Date(a.date).getTime();
  const db = new Date(b.date).getTime();
  return db - da;
});

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null;
}

