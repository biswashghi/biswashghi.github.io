import React from 'react';

const SafetyPanel = () => (
  <div className="card">
    <h2 className="section-title">Safety</h2>
    <p className="muted">
      Posts are built and deployed by GitHub Actions. The post composer on <code>/blog</code> blocks risky MDX like
      <code> import</code>/<code>export</code> in the body to reduce accidental build breaks.
    </p>
    <p className="muted">
      Tip: keep uploads small. Large images/videos will slow down your site and can hit GitHub API limits.
    </p>
  </div>
);

export default SafetyPanel;
