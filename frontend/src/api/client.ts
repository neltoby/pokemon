import axios, { AxiosRequestConfig } from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000
});

// Simple in-flight de-duplication for GET requests
const inflight = new Map<string, Promise<any>>();

function keyFor(method: string, url: string, params?: Record<string, any>) {
  const sortedParams = params
    ? JSON.stringify(
        Object.keys(params)
          .sort()
          .reduce((acc, k) => {
            acc[k] = params[k];
            return acc;
          }, {} as Record<string, any>)
      )
    : '';
  return `${method.toUpperCase()} ${url}?${sortedParams}`;
}

export async function getJSON<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const params = config?.params as Record<string, any> | undefined;
  const key = keyFor('GET', url, params);

  const existing = inflight.get(key);
  if (existing) {
    const resp = await existing;
    return resp.data as T;
  }

  const req = apiClient.get<T>(url, config);
  inflight.set(key, req as unknown as Promise<any>);
  try {
    const resp = await req;
    return resp.data as T;
  } finally {
    inflight.delete(key);
  }
}
