import React from 'react';
import PhotoOfMonthPanel from '../components/Admin/PhotoOfMonthPanel';
import useAdminCredentials from '../components/Admin/useAdminCredentials';
import photosOfMonth from '../data/photosOfMonth.json';

const formatMonth = (value) => {
  if (!/^\d{4}-\d{2}$/.test(value || '')) return value;
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
};

const photosByMonth = Object.entries(
  photosOfMonth.reduce((groups, photo) => {
    if (!photo || !photo.month || !photo.src) return groups;
    groups[photo.month] = [...(groups[photo.month] || []), photo];
    return groups;
  }, {})
)
  .sort(([a], [b]) => String(b).localeCompare(String(a)))
  .map(([month, photos]) => ({ month, photos: photos.slice(0, 2) }));

const photoAlt = (photo) => photo.caption || `Photo from ${formatMonth(photo.month)}`;

const PhotoOfMonth = () => {
  const { repoFull, token, hasToken } = useAdminCredentials();

  return (
    <div className="page">
      <header className="page__header photo-month-head">
        <div>
          <p className="kicker">Photo log</p>
          <h1 className="page__title">Photos of the Month</h1>
          <p className="page__lede">
            I take a lot of photos and rarely go back through them. This is a small reason to revisit the past month and
            choose two images that visually made an impact on me.
          </p>
        </div>
        <div className="page__actions">
          {hasToken ? (
            <a className="button button--ghost" href="#photo-month-upload">
              Upload photos
            </a>
          ) : null}
        </div>
      </header>

      {photosByMonth.length ? (
        <section className="photo-month-archive" aria-label="Photos of the Month archive">
          {photosByMonth.map(({ month, photos }, monthIndex) => (
            <section className="photo-month-group" key={month} aria-labelledby={`photo-month-${month}`}>
              <div className="photo-month-group__divider">
                <h2 id={`photo-month-${month}`}>{formatMonth(month)}</h2>
              </div>
              <div className={`photo-month-grid photo-month-grid--${photos.length}`}>
                {photos.map((photo, photoIndex) => (
                  <figure className="photo-month-card" key={`${photo.month}-${photo.src}`}>
                    <img
                      src={photo.src}
                      alt={photoAlt(photo)}
                      loading={monthIndex === 0 && photoIndex === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    {photo.caption ? (
                      <figcaption>
                        <p className="photo-month-card__caption">{photo.caption}</p>
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </section>
      ) : (
        <section className="photo-month-empty" aria-label="No photos yet">
          <p className="kicker">No entries yet</p>
          <h2>A place to look back through the camera roll and keep two photos that still feel important.</h2>
        </section>
      )}

      {hasToken ? (
        <section id="photo-month-upload" className="inline-admin-panel" aria-label="Upload photos of the month">
          <PhotoOfMonthPanel repoFull={repoFull} token={token} />
        </section>
      ) : null}
    </div>
  );
};

export default PhotoOfMonth;
