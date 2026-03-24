import React from 'react';
import Callout from './Callout';
import Figure from './Figure';

const isExternalHref = (href) => typeof href === 'string' && /^https?:\/\//i.test(href);

const A = (props) => {
  const href = props.href;
  const external = isExternalHref(href);
  return (
    <a
      {...props}
      target={external ? '_blank' : props.target}
      rel={external ? 'noopener noreferrer' : props.rel}
    />
  );
};

const Img = (props) => <img loading="lazy" decoding="async" {...props} />;

export const mdxComponents = {
  a: A,
  img: Img,
  Callout,
  Figure,
};
