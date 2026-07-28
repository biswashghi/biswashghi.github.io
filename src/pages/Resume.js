import React from 'react';
import ResumeSection from '../components/Resume/ResumeSection';

const Resume = () => {
  return (
    <div className="page">
      <header className="page__header">
        <div className="page__row">
          <div>
            <h1 className="page__title">Resume</h1>
          </div>
          <div className="page__actions">
            <a className="button" href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer">
              Download latest resume
            </a>
          </div>
        </div>
      </header>

      <div className="card">
        <ResumeSection />
      </div>
    </div>
  );
};

export default Resume;
