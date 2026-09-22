import { featuredProjects, projectSections } from '../projects';
import profile from './profile';
import summary from './summary';
import experience from './experience';
import education from './education';
import certifications from './certifications';
import skills from './skills';

const allProjects = [...featuredProjects, ...projectSections.flatMap((section) => section.projects)];

// Bullets may be written as plain strings or { text, priority }. Normalize
// to the object form so the page and the PDF generator see one shape.
// Priority 1 always stays; the PDF generator drops higher numbers first
// when the resume overflows one page. Strings default to priority 2.
const normalizeBullet = (bullet) =>
  typeof bullet === 'string' ? { text: bullet, priority: 2 } : { priority: 2, ...bullet };

const normalizeBullets = (bullets) => (bullets ? bullets.map(normalizeBullet) : bullets);

const normalizeEntry = (entry) => ({
  ...entry,
  bullets: normalizeBullets(entry.bullets),
  groups: entry.groups
    ? entry.groups.map((group) => ({ ...group, bullets: normalizeBullets(group.bullets) }))
    : entry.groups,
});

// Resume inclusion is opt-in: a project only appears here if it defines a
// `resume` field on itself in projects.js. This keeps the resume a curated
// subset rather than a mirror of the public projects page.
//
// Returns a fresh deep copy each call — the PDF generator mutates it while
// fitting to one page, and the web page must not see those edits.
export const assembleResume = () => {
  const projects = allProjects
    .filter((project) => project.resume)
    .sort((a, b) => (a.resume.order ?? 0) - (b.resume.order ?? 0))
    .map((project) => ({
      id: project.id,
      title: project.resume.title || project.title,
      meta: project.resume.meta || 'Personal project',
      bullets: normalizeBullets(project.resume.bullets),
    }));

  return {
    profile,
    summary,
    experience: experience.map(normalizeEntry),
    projects,
    skills,
    education: education.map(normalizeEntry),
    certifications: certifications.map(normalizeEntry),
  };
};

export default assembleResume;
