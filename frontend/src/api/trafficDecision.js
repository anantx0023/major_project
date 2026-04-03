const ENDPOINT = '/traffic-decision';

function getErrorMessageFromBody(body) {
  if (!body) return null;
  if (typeof body === 'string') return body;
  if (typeof body === 'object') {
    const parts = [];
    if (body.error) parts.push(String(body.error));
    if (body.details) parts.push(String(body.details));
    if (parts.length > 0) return parts.join(': ');
  }
  return null;
}

async function readResponseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

/**
 * Upload exactly 4 direction videos to the backend.
 * The backend expects form fields: north, south, east, west.
 */
export async function submitTrafficDecision(
  { north, south, east, west },
  { signal } = {},
) {
  const formData = new FormData();
  formData.append('north', north);
  formData.append('south', south);
  formData.append('east', east);
  formData.append('west', west);

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    body: formData,
    signal,
  });

  const body = await readResponseBody(response);

  if (!response.ok) {
    const message =
      getErrorMessageFromBody(body) ||
      `Request failed (HTTP ${response.status})`;
    throw new Error(message);
  }

  if (!body || typeof body !== 'object') {
    throw new Error('Unexpected response from server');
  }

  return body;
}
