export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export const CACHE_TTL = {
  CHANNEL_MS: 6 * 60 * 60 * 1000, // 6 hours
  VIDEO_MS: 3 * 60 * 60 * 1000,   // 3 hours
  TAGS_MS: 12 * 60 * 60 * 1000,   // 12 hours
  SHORT_MS: 10 * 60 * 1000,       // 10 minutes
};

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });

    // Simple cache eviction to avoid memory bloat in long-running processes
    if (this.store.size > 2000) {
      const now = Date.now();
      for (const [k, v] of this.store.entries()) {
        if (now > v.expiresAt) {
          this.store.delete(k);
        }
      }
    }
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

// Global singleton across hot reloads in Node.js
const globalForCache = globalThis as unknown as { appCache?: MemoryCache };
export const appCache = globalForCache.appCache ?? new MemoryCache();
if (process.env.NODE_ENV !== 'production') globalForCache.appCache = appCache;
