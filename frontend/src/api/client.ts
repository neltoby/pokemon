import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import {
  API_TIMEOUT_MS,
  API_PROBE_TIMEOUT_MS,
  API_INITIAL_RETRY_DELAY_MS,
  API_MAX_RETRY_DELAY_MS,
} from '../constants/ui';

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL,
  timeout: API_TIMEOUT_MS
});

// Simple in-flight de-duplication for GET requests
const inflight = new Map<string, Promise<unknown>>();

function keyFor(
  method: string,
  url: string,
  params?: Record<string, unknown>
): string {
  const sortedParams = params
    ? JSON.stringify(
        Object.keys(params)
          .sort()
          .reduce((acc, k) => {
            (acc as Record<string, unknown>)[k] = params[k];
            return acc;
          }, {} as Record<string, unknown>)
      )
    : '';
  return `${method.toUpperCase()} ${url}?${sortedParams}`;
}

// Render free-tier cold starts: wait until backend is awake before first calls
let backendAwake = false;
let waking: Promise<void> | null = null;

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

async function ensureBackendAwake(): Promise<void> {
  if (backendAwake) return;
  if (waking) return waking;

  const probe = axios.create({ baseURL, timeout: API_PROBE_TIMEOUT_MS });
  waking = (async () => {
    let delay = API_INITIAL_RETRY_DELAY_MS;
    for (;;) {
      try {
        const resp = await probe.get('/health', { validateStatus: () => true });
        if (resp.status === 200) {
          backendAwake = true;
          break;
        }
      } catch {
        // ignore, keep retrying
      }
      await sleep(delay);
      delay = Math.min(Math.floor(delay * 1.5), API_PROBE_TIMEOUT_MS);
    }
  })();

  try {
    await waking;
  } finally {
    waking = null;
  }
}

export async function getJSON<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const params = config?.params as Record<string, unknown> | undefined;
  const key = keyFor('GET', url, params);

  const existing = inflight.get(key);
  if (existing) {
    return (existing as Promise<T>);
  }

  const task = (async () => {
    // Prevent startup timeout errors by waiting for backend to wake
    await ensureBackendAwake();
    let delay = API_INITIAL_RETRY_DELAY_MS;
    for (;;) {
      try {
        const resp = await apiClient.get<T>(url, config);
        return resp.data as T;
      } catch (e) {
        const err = e as AxiosError;
        const status = err.response?.status;
        const isNetwork = !!err.isAxiosError && (!status || status >= 500);
        const isTimeout = err.code === 'ECONNABORTED';
        if (isNetwork || isTimeout) {
          // Re-probe backend and retry until it responds
          backendAwake = false;
          await ensureBackendAwake();
          await sleep(delay);
          delay = Math.min(Math.floor(delay * 1.5), API_MAX_RETRY_DELAY_MS);
          continue;
        }
        throw err;
      }
    }
  })();

  inflight.set(key, task as Promise<unknown>);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}

export async function postJSON<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  await ensureBackendAwake();
  let delay = 500;
  for (;;) {
    try {
      const resp = await apiClient.post<T>(url, body, config);
      return resp.data as T;
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status;
      const isNetwork = !!err.isAxiosError && (!status || status >= 500);
      const isTimeout = err.code === 'ECONNABORTED';
      if (isNetwork || isTimeout) {
        backendAwake = false;
        await ensureBackendAwake();
        await sleep(delay);
        delay = Math.min(Math.floor(delay * 1.5), 3000);
        continue;
      }
      throw err;
    }
  }
}

export async function deleteJSON<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  await ensureBackendAwake();
  let delay = 500;
  for (;;) {
    try {
      const resp = await apiClient.delete<T>(url, config);
      return resp.data as T;
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status;
      const isNetwork = !!err.isAxiosError && (!status || status >= 500);
      const isTimeout = err.code === 'ECONNABORTED';
      if (isNetwork || isTimeout) {
        backendAwake = false;
        await ensureBackendAwake();
        await sleep(delay);
        delay = Math.min(Math.floor(delay * 1.5), 3000);
        continue;
      }
      throw err;
    }
  }
}
