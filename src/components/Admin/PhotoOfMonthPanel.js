import React, { useState } from 'react';
import { publishPhotoOfMonthToGitHub } from '../../blog/publisher';
import AdminStatus from './AdminStatus';
import { filenameFromFile, idleStatus, monthNow } from './adminUtils';

const photoFilenameFromFile = (file, month) => filenameFromFile(file, 'photo', `${month || monthNow()}-`);

const PhotoOfMonthPanel = ({ repoFull, token }) => {
  const [photoMonth, setPhotoMonth] = useState(monthNow());
  const [photoFile, setPhotoFile] = useState(null);
  const [photoFilename, setPhotoFilename] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoAlt, setPhotoAlt] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoStatus, setPhotoStatus] = useState(idleStatus);

  const uploadPhotoOfMonth = async () => {
    setPhotoStatus(idleStatus);
    const repoTrimmed = repoFull.trim();
    const tokenTrimmed = token.trim();
    if (!repoTrimmed.includes('/')) {
      setPhotoStatus({ state: 'error', message: 'Repo must be in the form owner/repo.' });
      return;
    }
    if (!tokenTrimmed) {
      setPhotoStatus({ state: 'error', message: 'Missing token.' });
      return;
    }
    if (!photoFile) {
      setPhotoStatus({ state: 'error', message: 'Choose a photo first.' });
      return;
    }

    try {
      setPhotoStatus({ state: 'working', message: 'Uploading monthly photo to GitHub...' });
      const result = await publishPhotoOfMonthToGitHub({
        token: tokenTrimmed,
        repoFull: repoTrimmed,
        month: photoMonth,
        file: photoFile,
        filename: photoFilename || photoFilenameFromFile(photoFile, photoMonth),
        title: photoTitle,
        caption: photoCaption,
        alt: photoAlt,
      });
      setPhotoStatus({
        state: 'ok',
        message: `Uploaded ${result.imagePath} and updated photosOfMonth.json. GitHub Pages will refresh after deploy.`,
      });
      setPhotoFile(null);
    } catch (e) {
      setPhotoStatus({ state: 'error', message: e.message || 'Photo upload failed.' });
    }
  };

  return (
    <div className="card admin-card--wide">
      <h2 className="section-title">Photo of the Month</h2>
      <div className="form">
        <div className="admin-row">
          <div className="field">
            <label className="field__label" htmlFor="photo-month">
              Month
            </label>
            <input
              id="photo-month"
              className="field__input"
              type="month"
              value={photoMonth}
              onChange={(e) => {
                setPhotoMonth(e.target.value);
                if (photoFile) setPhotoFilename(photoFilenameFromFile(photoFile, e.target.value));
              }}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="photo-file">
              Photo
            </label>
            <input
              id="photo-file"
              className="field__input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const nextFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                setPhotoFile(nextFile);
                if (nextFile) setPhotoFilename(photoFilenameFromFile(nextFile, photoMonth));
              }}
            />
          </div>
        </div>

        <div className="admin-row">
          <div className="field">
            <label className="field__label" htmlFor="photo-title">
              Title
            </label>
            <input
              id="photo-title"
              className="field__input"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              placeholder="Optional short title"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="photo-filename">
              Site filename
            </label>
            <input
              id="photo-filename"
              className="field__input"
              value={photoFilename}
              onChange={(e) => setPhotoFilename(photoFilenameFromFile({ name: e.target.value }, photoMonth))}
              placeholder="2026-07-photo.jpg"
            />
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="photo-alt">
            Alt text
          </label>
          <input
            id="photo-alt"
            className="field__input"
            value={photoAlt}
            onChange={(e) => setPhotoAlt(e.target.value)}
            placeholder="Short visual description"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="photo-caption">
            Caption
          </label>
          <textarea
            id="photo-caption"
            className="field__input field__input--textarea"
            value={photoCaption}
            onChange={(e) => setPhotoCaption(e.target.value)}
            placeholder="Optional note about why this photo represents the month."
          />
          <p className="muted admin-help">
            Uploads to <code>src/assets/images/photo-of-month/</code>. Uploading the same month again replaces that
            month's entry.
          </p>
        </div>

        <div className="admin-actions">
          <button className="button" type="button" onClick={uploadPhotoOfMonth} disabled={photoStatus.state === 'working'}>
            {photoStatus.state === 'working' ? 'Uploading…' : 'Upload Monthly Photo'}
          </button>
          <AdminStatus status={photoStatus} />
        </div>
      </div>
    </div>
  );
};

export default PhotoOfMonthPanel;
