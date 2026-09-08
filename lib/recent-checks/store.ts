export interface RecentCheckItem {
  id: string; // Channel ID (UC...), video ID, or custom ID
  targetType: 'CHANNEL' | 'VIDEO' | 'PLAYLIST';
  title: string;
  handle?: string;
  avatarUrl: string;
  url: string; // The URL to check or navigate to
  tool: string; // e.g. 'monetization-checker'
  category: 'Monetization' | 'Channel' | 'Analytics' | 'Video';
  statusText: string; // e.g. 'Monetized', 'Not Monetized'
  statusType: 'success' | 'danger' | 'warning' | 'neutral';
  metaText?: string; // e.g. '7.9M Subscribers', '2.6M Views'
  timestamp: number; // Unix timestamp ms
}

class RecentChecksStore {
  private items: RecentCheckItem[] = [];
  private readonly MAX_ITEMS = 100;

  constructor() {
    this.items = [];
  }

  public getRecentChecks(options?: {
    category?: 'Monetization' | 'Channel' | 'Analytics' | 'Video';
    tool?: string;
    limit?: number;
  }): RecentCheckItem[] {
    const limit = options?.limit ?? 5;
    let filtered = this.items;

    if (options?.tool) {
      filtered = filtered.filter((item) => item.tool === options.tool);
    } else if (options?.category) {
      filtered = filtered.filter((item) => item.category === options.category);
    }

    return filtered.slice(0, limit);
  }

  public addCheck(newItem: Omit<RecentCheckItem, 'timestamp'> & { timestamp?: number }): RecentCheckItem {
    const item: RecentCheckItem = {
      ...newItem,
      timestamp: newItem.timestamp || Date.now(),
    };

    // Deduplicate: if exists by id, handle, or title, remove old copy
    const existingIndex = this.items.findIndex(
      (existing) =>
        (existing.id && existing.id === item.id) ||
        (existing.handle && item.handle && existing.handle.toLowerCase() === item.handle.toLowerCase()) ||
        existing.title.toLowerCase() === item.title.toLowerCase()
    );

    if (existingIndex !== -1) {
      this.items.splice(existingIndex, 1);
    }

    // Prepend to top
    this.items.unshift(item);

    // Limit maximum retained items
    if (this.items.length > this.MAX_ITEMS) {
      this.items = this.items.slice(0, this.MAX_ITEMS);
    }

    return item;
  }
}

// Global singleton to persist across Next.js API requests
const globalForChecks = globalThis as unknown as { recentChecksStore?: RecentChecksStore };
export const recentChecksStore = globalForChecks.recentChecksStore ?? new RecentChecksStore();
if (process.env.NODE_ENV !== 'production') globalForChecks.recentChecksStore = recentChecksStore;

