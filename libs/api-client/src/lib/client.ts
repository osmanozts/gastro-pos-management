let baseUrl = '';

export function configureApiClient(options: { baseUrl: string }) {
  baseUrl = options.baseUrl.replace(/\/$/, '');
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as Record<string, unknown>).message)
        : res.statusText;
    throw new ApiError(res.status, body, message);
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function get<T>(path: string): Promise<T> {
  return fetch(`${baseUrl}${path}`, {
    credentials: 'include',
  }).then((res) => handleResponse<T>(res));
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).then((res) => handleResponse<T>(res));
}

export function patch<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${baseUrl}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).then((res) => handleResponse<T>(res));
}

export function del<T>(path: string): Promise<T> {
  return fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then((res) => handleResponse<T>(res));
}
