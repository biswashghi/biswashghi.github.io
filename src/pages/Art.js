import React from 'react';
import ArtUploadPanel from '../components/Admin/ArtUploadPanel';
import useAdminCredentials from '../components/Admin/useAdminCredentials';

const buckets = [
  {
    title: 'Architecture Class Studies',
    description: 'Early exercises in perspective, structure, spatial rhythm, and architectural composition.',
    drawings: [
      'drawing1.jpg',
      'drawing2.jpg',
      'drawing3.jpg',
      'drawing4.jpg',
      'drawing5.jpg',
      'drawing6.jpg',
      'drawing7.jpg',
      'drawing8.jpg',
      'drawing9.jpg',
      'drawing10.jpg',
      'architecture-shell-studies.jpg',
    ],
  },
  {
    title: 'Sketchbook Fragments',
    description: 'Loose studies and remaining pieces from the archive.',
    drawings: ['drawing11-clean.jpg', 'sketchbook-img-0741.jpg'],
  },
];

const Art = () => {
  const { repoFull, token, hasToken } = useAdminCredentials();

  return (
    <div className="page">
      <header className="page__header art-head">
        <div>
          <p className="kicker">Drawing archive</p>
          <h1 className="page__title">Art</h1>
          <p className="page__lede">
            Architecture drawings, sketches, and visual studies from a period where drawing was a bigger part of how I
            thought through form and space.
          </p>
        </div>
        <div className="page__actions">
          {hasToken ? (
            <a className="button button--ghost" href="#art-upload">
              Upload art
            </a>
          ) : null}
        </div>
      </header>

      <div className="art-buckets">
        {buckets.map((bucket, bucketIndex) => (
          <section className="art-bucket" key={bucket.title} aria-labelledby={`art-bucket-${bucketIndex}`}>
            <div className="art-bucket__head">
              <p className="art-bucket__count">{String(bucketIndex + 1).padStart(2, '0')}</p>
              <div>
                <h2 id={`art-bucket-${bucketIndex}`}>{bucket.title}</h2>
                <p>{bucket.description}</p>
              </div>
            </div>

            <div className="art-grid">
              {bucket.drawings.map((drawing, drawingIndex) => (
                <figure className="art-piece" key={drawing}>
                  <img
                    src={`/assets/images/drawing/${drawing}`}
                    alt={`${bucket.title} drawing ${drawingIndex + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>
                    {String(bucketIndex + 1).padStart(2, '0')}.{String(drawingIndex + 1).padStart(2, '0')}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>

      {hasToken ? (
        <section id="art-upload" className="inline-admin-panel" aria-label="Upload art">
          <ArtUploadPanel repoFull={repoFull} token={token} />
        </section>
      ) : null}
    </div>
  );
};

export default Art;
