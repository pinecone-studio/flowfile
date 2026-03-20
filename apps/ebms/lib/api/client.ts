const apiUnavailableMessage =
  'Backend is not reachable. Start apps/worker on http://127.0.0.1:8787 or set NEXT_PUBLIC_API_BASE_URL.';

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return normalizeBaseUrl(configuredBaseUrl);
  }

  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:8787';
  }

  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://127.0.0.1:8787';
  }

  return normalizeBaseUrl(window.location.origin);
}

export function buildApiUrl(path: string) {
  return `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(buildApiUrl(path), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      throw new Error(
        errorBody?.message || `Request failed with status ${response.status}`,
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(apiUnavailableMessage);
    }

    throw error;
  }
}

export async function requestGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  path = '/graphql',
): Promise<T> {
  const response = await requestJson<{
    data?: T;
    errors?: Array<{ message?: string }>;
  }>(path, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.errors?.length) {
    throw new Error(response.errors[0]?.message || 'GraphQL request failed');
  }

  if (!response.data) {
    throw new Error('GraphQL response returned no data');
  }

  return response.data;
}
