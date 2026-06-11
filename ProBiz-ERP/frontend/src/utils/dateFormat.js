// Pakistan Standard Time (PST) = UTC+5
const TZ = 'Asia/Karachi';

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-PK', {
    timeZone: TZ,
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-PK', {
    timeZone: TZ,
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('en-PK', {
    timeZone: TZ,
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};
