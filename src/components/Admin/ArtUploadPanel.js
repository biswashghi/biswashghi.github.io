import React, { useState } from 'react';
import { publishArtImageToGitHub, WEB_SAFE_IMAGE_ACCEPT } from '../../blog/publisher';
import AdminStatus from './AdminStatus';
import { artBuckets, filenameFromFile, idleStatus } from './adminUtils';

const artFilenameFromFile = (file) => filenameFromFile(file, 'art-upload');
const NEW_BUCKET_VALUE = '__new_art_bucket__';

const ArtUploadPanel = ({ repoFull, token }) => {
  const [artBucket, setArtBucket] = useState(artBuckets[0]);
  const [newBucketTitle, setNewBucketTitle] = useState('');
  const [artFile, setArtFile] = useState(null);
  const [artFilename, setArtFilename] = useState('');
  const [artStatus, setArtStatus] = useState(idleStatus);

  const uploadArt = async () => {
    setArtStatus(idleStatus);
    const repoTrimmed = repoFull.trim();
    const tokenTrimmed = token.trim();
    const bucketTitle = artBucket === NEW_BUCKET_VALUE ? newBucketTitle.trim() : artBucket;
    if (!repoTrimmed.includes('/')) {
      setArtStatus({ state: 'error', message: 'Repo must be in the form owner/repo.' });
      return;
    }
    if (!tokenTrimmed) {
      setArtStatus({ state: 'error', message: 'Missing token.' });
      return;
    }
    if (!artFile) {
      setArtStatus({ state: 'error', message: 'Choose an image first.' });
      return;
    }
    if (!bucketTitle) {
      setArtStatus({ state: 'error', message: 'Choose a bucket or enter a new bucket name.' });
      return;
    }

    try {
      setArtStatus({ state: 'working', message: 'Uploading art image to GitHub...' });
      const result = await publishArtImageToGitHub({
        token: tokenTrimmed,
        repoFull: repoTrimmed,
        bucketTitle,
        file: artFile,
        filename: artFilename || artFilenameFromFile(artFile),
      });
      setArtStatus({
        state: 'ok',
        message: `Uploaded ${result.imagePath} and updated Art.js. GitHub Pages will refresh after deploy.`,
      });
      setArtFile(null);
      if (artBucket === NEW_BUCKET_VALUE) setNewBucketTitle('');
    } catch (e) {
      setArtStatus({ state: 'error', message: e.message || 'Art upload failed.' });
    }
  };

  return (
    <div className="card admin-card--wide">
      <h2 className="section-title">Art Upload</h2>
      <div className="form">
        <div className="admin-row">
          <div className="field">
            <label className="field__label" htmlFor="art-bucket">
              Bucket
            </label>
            <select
              id="art-bucket"
              className="field__input"
              value={artBucket}
              onChange={(e) => setArtBucket(e.target.value)}
            >
              {artBuckets.map((bucket) => (
                <option key={bucket} value={bucket}>
                  {bucket}
                </option>
              ))}
              <option value={NEW_BUCKET_VALUE}>Add new bucket...</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="art-file">
              Image
            </label>
            <input
              id="art-file"
              className="field__input"
              type="file"
              accept={WEB_SAFE_IMAGE_ACCEPT}
              onChange={(e) => {
                const nextFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                setArtFile(nextFile);
                if (nextFile) setArtFilename(artFilenameFromFile(nextFile));
              }}
            />
          </div>
        </div>

        {artBucket === NEW_BUCKET_VALUE ? (
          <div className="field">
            <label className="field__label" htmlFor="art-new-bucket">
              New bucket name
            </label>
            <input
              id="art-new-bucket"
              className="field__input"
              value={newBucketTitle}
              onChange={(e) => setNewBucketTitle(e.target.value)}
              placeholder="Photo Studies"
            />
          </div>
        ) : null}

        <div className="field">
          <label className="field__label" htmlFor="art-filename">
            Site filename
          </label>
          <input
            id="art-filename"
            className="field__input"
            value={artFilename}
            onChange={(e) => setArtFilename(artFilenameFromFile({ name: e.target.value }))}
            placeholder="new-drawing.jpg"
          />
          <p className="muted admin-help">
            Uploads to <code>src/assets/images/drawing/</code> and adds the image to the selected Art bucket. New
            buckets are created on publish.
          </p>
        </div>

        <div className="admin-actions">
          <button className="button" type="button" onClick={uploadArt} disabled={artStatus.state === 'working'}>
            {artStatus.state === 'working' ? 'Uploading…' : 'Upload to Art'}
          </button>
          <AdminStatus status={artStatus} />
        </div>
      </div>
    </div>
  );
};

export default ArtUploadPanel;
