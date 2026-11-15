import API from '../api/client';

// Fetch a file from an authenticated API endpoint (the axios client attaches the
// bearer token) and save it to disk. A plain <a href> can't be used because the
// API requires the Authorization header, which links don't send.
export async function downloadFile(apiPath, fallbackName = 'download') {
  const res = await API.get(apiPath, { responseType: 'blob' });

  // Prefer the filename the server set in Content-Disposition.
  let filename = fallbackName;
  const cd = res.headers?.['content-disposition'];
  const match = cd && /filename="?([^"]+)"?/.exec(cd);
  if (match) filename = match[1];

  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
