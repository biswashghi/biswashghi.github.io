import { featuredProjects, projectSections } from '../projects';
import profile from './profile';
import summary from './summary';
import experience from './experience';
import education from './education';
import certifications from './certifications';
import skills from './skills';

const allProjects = [...featuredProjects, ...projectSections.flatMap((section) => section.projects)];

// Resume inclusion is opt-in: a project only appears here if it defines a
// `resume` field on itself in projects.js. This keeps the resume a curated
// subset rather than a mirror of the public projects page.
export const assembleResume = () => {
  const projects = allProjects
    .filter((project) => project.resume)
    .sort((a, b) => (a.resume.order ?? 0) - (b.resume.order ?? 0))
    .map((project) => ({
      id: project.id,
      title: project.resume.title || project.title,
      meta: project.resume.meta || 'Personal project',
      bullets: project.resume.bullets,
    }));

  return { profile, summary, experience, projects, skills, education, certifications };
};

export default assembleResume;
