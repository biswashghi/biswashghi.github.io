import React from 'react';
import ResumeSection from '../components/Resume/ResumeSection';

const Resume = () => {
  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Resume</h1>
        <p className="page__lede">
          A quick snapshot of what I have worked on. Replace the placeholders with your real experience.
        </p>
      </header>

      <div className="card">
        <ResumeSection />
      </div>
    </div>
  );
};

export default Resume;

