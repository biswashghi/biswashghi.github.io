import React, { useState } from 'react';
import { publishPhotosOfMonthToGitHub, WEB_SAFE_IMAGE_ACCEPT } from '../../blog/publisher';
import AdminStatus from './AdminStatus';
import { idleStatus, monthNow } from './adminUtils';

const PhotoOfMonthPanel = ({ repoFull, token }) => {
  const [photoMonth, setPhotoMonth] = useState(monthNow());
  const [photoFiles, setPhotoFiles] = useState([]);
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
    if (photoFiles.length !== 2) {
      setPhotoStatus({ state: 'error', message: 'Choose exactly two photos for a month.' });
      return;
    }

    try {
      setPhotoStatus({ state: 'working', message: 'Uploading monthly photos to GitHub...' });
      const result = await publishPhotosOfMonthToGitHub({
        token: tokenTrimmed,
        repoFull: repoTrimmed,
        month: photoMonth,
        files: photoFiles,
        caption: photoCaption,
      });
      setPhotoStatus({
        state: 'ok',
        message: `Uploaded ${result.imagePaths.length} photo${result.imagePaths.length === 1 ? '' : 's'} and updated photosOfMonth.json. GitHub Pages will refresh after deploy.`,
      });
      setPhotoFiles([]);
    } catch (e) {
      setPhotoStatus({ state: 'error', message: e.message || 'Photo upload failed.' });
    }
  };

  return (
    <div className="card admin-card--wide">
      <h2 className="section-title">Photos of the Month</h2>
      <div className="form photo-upload-form">
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
              Photos
            </label>
            <input
              id="photo-file"
              className="field__input"
              type="file"
              accept={WEB_SAFE_IMAGE_ACCEPT}
              multiple
              onChange={(e) => {
                setPhotoFiles(Array.from(e.target.files || []));
              }}
            />
            <p className="muted admin-help">
              Choose exactly two photos. They will be saved under <code>{photoMonth || 'YYYY-MM'}</code>.
            </p>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="photo-caption">
            Caption
          </label>
          <textarea
            id="photo-caption"
            className="field__input field__input--textarea photo-upload-form__caption"
            value={photoCaption}
            onChange={(e) => setPhotoCaption(e.target.value)}
            placeholder="Optional note about why this photo represents the month."
          />
          <p className="muted admin-help">
            Uploading a new set replaces the existing photos for that month.
          </p>
        </div>

        <div className="admin-actions photo-upload-form__actions">
          <button className="button" type="button" onClick={uploadPhotoOfMonth} disabled={photoStatus.state === 'working'}>
            {photoStatus.state === 'working' ? 'Uploading…' : 'Upload Two Photos'}
          </button>
          <AdminStatus status={photoStatus} />
        </div>
      </div>
    </div>
  );
};

export default PhotoOfMonthPanel;
