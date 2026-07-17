import React, { useState } from 'react';
import { publishPhotoOfMonthToGitHub, WEB_SAFE_IMAGE_ACCEPT } from '../../blog/publisher';
import AdminStatus from './AdminStatus';
import { idleStatus, monthNow } from './adminUtils';

const PhotoOfMonthPanel = ({ repoFull, token }) => {
  const [photoMonth, setPhotoMonth] = useState(monthNow());
  const [photoFile, setPhotoFile] = useState(null);
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
        caption: photoCaption,
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
              onChange={(e) => setPhotoMonth(e.target.value)}
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
              accept={WEB_SAFE_IMAGE_ACCEPT}
              onChange={(e) => {
                const nextFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                setPhotoFile(nextFile);
              }}
            />
            <p className="muted admin-help">
              File will be saved as <code>{photoMonth || 'YYYY-MM'}</code> with its image extension.
            </p>
          </div>
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
