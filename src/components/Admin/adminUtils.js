import { slugify } from '../../blog/publisher';

export const artBuckets = ['Architecture Class Studies', 'Sketchbook Fragments'];

export const idleStatus = { state: 'idle', message: '' };

export const statusClassName = (state) => {
  if (state === 'error') return 'admin-err';
  if (state === 'ok') return 'admin-ok';
  return 'muted';
};

export const monthNow = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const filenameFromFile = (file, fallback, prefix = '') => {
  if (!file || !file.name) return '';
  const lastDot = file.name.lastIndexOf('.');
  const rawName = lastDot === -1 ? file.name : file.name.slice(0, lastDot);
  const rawExt = lastDot === -1 ? '' : file.name.slice(lastDot + 1).toLowerCase();
  const ext = rawExt || 'jpg';
  const safeName = slugify(rawName) || fallback;
  return `${prefix}${safeName}.${ext}`;
};
