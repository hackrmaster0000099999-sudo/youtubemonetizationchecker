import { RecentCheckItem } from './store';

export function saveUserRecentCheck(item: RecentCheckItem): void {
  if (typeof window === 'undefined') return;

  try {
    const key = 'yt_monetize_recent_checks';
    const existingRaw = localStorage.getItem(key);
    let existing: RecentCheckItem[] = existingRaw ? JSON.parse(existingRaw) : [];

    // Remove duplicates
    existing = existing.filter(
      (e) =>
        e.id !== item.id &&
        (!e.handle || !item.handle || e.handle.toLowerCase() !== item.handle.toLowerCase()) &&
        e.title.toLowerCase() !== item.title.toLowerCase()
    );

    // Add to top
    existing.unshift(item);
    // Keep max 20 locally
    existing = existing.slice(0, 20);

    localStorage.setItem(key, JSON.stringify(existing));

    // Dispatch custom event to notify all RecentlyCheckedSection instances in current tab
    window.dispatchEvent(new CustomEvent('yt-monetize-check-added', { detail: item }));
  } catch (err) {
    console.warn('Failed to save recent check to local storage:', err);
  }
}
