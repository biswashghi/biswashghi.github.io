import React from 'react';

const Callout = ({ title, children, variant }) => {
  const className = ['callout', variant ? `callout--${variant}` : null].filter(Boolean).join(' ');
  return (
    <aside className={className}>
      {title ? <h3 className="callout__title">{title}</h3> : null}
      <div className="callout__body">{children}</div>
    </aside>
  );
};

export default Callout;

