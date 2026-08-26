import React, { useEffect } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/photos.by.biswash/';
const INSTAGRAM_EMBED_SCRIPT = 'https://www.instagram.com/embed.js';

const PhotoOfMonth = () => {
  useDocumentTitle('Photography');

  useEffect(() => {
    const processEmbed = () => window.instgrm?.Embeds?.process();
    const existingScript = document.querySelector(`script[src="${INSTAGRAM_EMBED_SCRIPT}"]`);

    if (existingScript) {
      if (window.instgrm) processEmbed();
      else existingScript.addEventListener('load', processEmbed, { once: true });

      return () => existingScript.removeEventListener('load', processEmbed);
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = INSTAGRAM_EMBED_SCRIPT;
    script.addEventListener('load', processEmbed, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener('load', processEmbed);
  }, []);

  return (
    <div className="page">
      <header className="page__header photo-month-head">
        <div>
          <p className="kicker">Through my lens</p>
          <h1 className="page__title">Photography</h1>
          <p className="page__lede">
            I share my latest photographs on Instagram. Follow along there to see the complete, up-to-date collection.
          </p>
        </div>
      </header>

      <section className="instagram-profile" aria-label="Photography on Instagram">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={INSTAGRAM_PROFILE_URL}
          data-instgrm-version="14"
        >
          <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noreferrer">
            View @photos.by.biswash on Instagram
          </a>
        </blockquote>
      </section>
    </div>
  );
};

export default PhotoOfMonth;
