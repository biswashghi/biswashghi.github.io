import React from 'react';

const Figure = ({ src, alt, caption }) => {
  return (
    <figure className="figure">
      <img className="figure__img" src={src} alt={alt || ''} loading="lazy" decoding="async" />
      {caption ? <figcaption className="figure__cap">{caption}</figcaption> : null}
    </figure>
  );
};

export default Figure;
