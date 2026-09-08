'use client';

import { useCallback, useSyncExternalStore } from 'react';

export interface SavedItem {
  id: string; // unique item id
  toolId: string;
  toolName: string;
  category: string;
  targetType: 'CHANNEL' | 'VIDEO' | 'PLAYLIST';
  title: string;
  handle?: string;
  avatarUrl?: string;
  url: string;
  savedAt: number; // timestamp
  metaText?: string; // e.g. "Likely Monetized", "$450 - $1,200/mo", "UCxxxx"
  badgeType?: 'success' | 'warning' | 'danger' | 'neutral';
  summary?: string; // short summary text
}

const STORAGE_KEY = 'yt_monetize_saved_items_v1';
const EVENT_NAME = 'yt_monetize_saved_items_changed';

/**
 * Get all saved items from localStorage (Client-side browser cache only)
 */
export function getSavedItems(): SavedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Failed to read saved items from browser cache:', err);
    return [];
  }
}

/**
 * Save an item to the browser cache (localStorage)
 */
export function saveItem(
  item: Omit<SavedItem, 'id' | 'savedAt'> & { id?: string }
): SavedItem {
  if (typeof window === 'undefined') {
    return {
      ...item,
      id: item.id || `${item.toolId}_${Date.now()}`,
      savedAt: Date.now(),
    };
  }

  const existing = getSavedItems();
  const itemId = item.id || `${item.toolId}_${encodeURIComponent(item.url || item.title)}`.toLowerCase();

  // Check if item already exists with this ID or toolId+url
  const filtered = existing.filter(
    (existingItem) =>
      existingItem.id !== itemId &&
      !(existingItem.toolId === item.toolId && existingItem.url === item.url)
  );

  const newItem: SavedItem = {
    ...item,
    id: itemId,
    savedAt: Date.now(),
  };

  const updated = [newItem, ...filtered];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
  }

  return newItem;
}

/**
 * Remove an item from the browser cache
 */
export function removeSavedItem(id: string): void {
  if (typeof window === 'undefined') return;
  const existing = getSavedItems();
  const updated = existing.filter((item) => item.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.error('Failed to remove item from localStorage:', err);
  }
}

/**
 * Check if a specific resource is saved in browser cache for this tool
 */
export function isItemSaved(toolId: string, urlOrId: string): boolean {
  if (typeof window === 'undefined' || !urlOrId) return false;
  const existing = getSavedItems();
  const query = urlOrId.trim().toLowerCase();

  return existing.some(
    (item) =>
      item.toolId === toolId &&
      (item.id.toLowerCase() === query ||
        item.url.toLowerCase() === query ||
        (item.handle && item.handle.toLowerCase() === query))
  );
}

/**
 * Clear all items from browser cache
 */
export function clearAllSavedItems(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: [] }));
  } catch (err) {
    console.error('Failed to clear saved items:', err);
  }
}

/**
 * Export saved items as a formatted JSON file download
 */
export function exportSavedItemsJson(): void {
  if (typeof window === 'undefined') return;
  const items = getSavedItems();
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yt-monetize-saved-items-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function notifyStorageChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedRaw: string | null = null;
let cachedSnapshot: SavedItem[] = [];

function getSnapshot(): SavedItem[] {
  if (typeof window === 'undefined') return cachedSnapshot;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSnapshot = raw ? (JSON.parse(raw) as SavedItem[]) : [];
    }
  } catch {
    cachedSnapshot = [];
  }
  return cachedSnapshot;
}

const emptySnapshot: SavedItem[] = [];
function getServerSnapshot(): SavedItem[] {
  return emptySnapshot;
}

function subscribeClient(): () => void {
  return () => {};
}
function getClientSnapshot(): boolean {
  return true;
}
function getServerClientSnapshot(): boolean {
  return false;
}

/**
 * React hook to listen to browser saved items changes in real time
 */
export function useSavedItems() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isClient = useSyncExternalStore(subscribeClient, getClientSnapshot, getServerClientSnapshot);

  const save = useCallback((itemData: Omit<SavedItem, 'id' | 'savedAt'> & { id?: string }) => {
    return saveItem(itemData);
  }, []);

  const remove = useCallback((id: string) => {
    removeSavedItem(id);
  }, []);

  const clear = useCallback(() => {
    clearAllSavedItems();
  }, []);

  const checkIsSaved = useCallback((toolId: string, urlOrId: string) => {
    return isItemSaved(toolId, urlOrId);
  }, []);

  const refresh = useCallback(() => {
    notifyStorageChange();
  }, []);

  return {
    items,
    count: items.length,
    isClient,
    save,
    remove,
    clear,
    refresh,
    isSaved: checkIsSaved,
  };
}
