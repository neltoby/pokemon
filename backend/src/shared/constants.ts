// Backend constants (avoid magic numbers)
export const FIRST_GENERATION_MAX = 150;
export const READ_CACHE_MAX_AGE_SECONDS = 300; // 5 minutes
export const IMAGE_CACHE_MAX_AGE_SECONDS = 3600; // 1 hour

export const UPSTREAM_TIMEOUT_MS = 15000;
export const AXIOS_RETRIES = 3;

export const SEMAPHORE_MAX_CONCURRENCY = 10;
export const LRU_MAX_SIZE = 200;
export const LRU_DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const DETAILS_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
export const RATE_LIMIT_MAX = 120;

export const DEFAULT_PAGE_SIZE = 50;

