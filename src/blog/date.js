export const parseIsoDateToLocal = (iso) => {
  // Treat YYYY-MM-DD as a local "calendar date" (not UTC), so it doesn't shift by timezone.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(year, month - 1, day);
};

export const formatIsoDate = (iso, formatOptions) => {
  try {
    const localDate = parseIsoDateToLocal(iso) || new Date(iso);
    return localDate.toLocaleDateString(undefined, formatOptions);
  } catch {
    return iso;
  }
};

