/**
 * Format uptime seconds into human readable duration
 * @param {number} seconds
 * @returns {string}
 */
export const formatUptime = (seconds) => {
  if (seconds === undefined || seconds === null) return '—';
  const sec = Math.floor(seconds);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const remainingSeconds = sec % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
};

/**
 * Format ISO date string to localized time
 * @param {string} isoString
 * @returns {string}
 */
export const formatTimestamp = (isoString) => {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return '—';
  }
};

/**
 * Format ISO date string to localized date
 * @param {string} isoString
 * @returns {string}
 */
export const formatDate = (isoString) => {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

