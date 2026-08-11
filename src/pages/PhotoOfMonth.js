import React from 'react';
import PhotoOfMonthPanel from '../components/Admin/PhotoOfMonthPanel';
import useAdminCredentials from '../components/Admin/useAdminCredentials';
import photosOfMonth from '../data/photosOfMonth.json';

const formatMonth = (value) => {
  if (!/^\d{4}-\d{2}$/.test(value || '')) return value;
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
};

const sortedPhotos = [...photosOfMonth].sort((a, b) => String(b.month).localeCompare(String(a.month)));

const photoAlt = (photo) => photo.caption || `Photo of the month for ${formatMonth(photo.month)}`;

const PhotoOfMonth = () => {
  const { repoFull, token, hasToken } = useAdminCredentials();

  return (
    <div className="page">
      <header className="page__header photo-month-head">
        <div>
          <p className="kicker">Photo log</p>
          <h1 className="page__title">Photo of the Month</h1>
          <p className="page__lede">
            I take a lot of photos and rarely go back through them. This is a small reason to revisit the past month and
            choose one image that visually made an impact on me.
          </p>
        </div>
        <div className="page__actions">
          {hasToken ? (
            <a className="button button--ghost" href="#photo-month-upload">
              Upload photo
            </a>
          ) : null}
        </div>
      </header>

      {sortedPhotos.length ? (
        <section className="photo-month-grid" aria-label="Photo of the Month archive">
          {sortedPhotos.map((photo, index) => (
            <figure className="photo-month-card" key={photo.month}>
              <img src={photo.src} alt={photoAlt(photo)} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
              <figcaption>
                <p className="photo-month-card__month">{formatMonth(photo.month)}</p>
                {photo.caption ? <p className="photo-month-card__caption">{photo.caption}</p> : null}
              </figcaption>
            </figure>
          ))}
        </section>
      ) : (
        <section className="photo-month-empty" aria-label="No photos yet">
          <p className="kicker">No entries yet</p>
          <h2>A place to look back through the camera roll and keep one photo that still feels important.</h2>
        </section>
      )}

      {hasToken ? (
        <section id="photo-month-upload" className="inline-admin-panel" aria-label="Upload photo of the month">
          <PhotoOfMonthPanel repoFull={repoFull} token={token} />
        </section>
      ) : null}
    </div>
  );
};

export default PhotoOfMonth;
