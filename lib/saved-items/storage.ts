'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

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

let inMemoryItems: SavedItem[] | null = null;

function normalizeString(str?: string): string {
  if (!str) return '';
  return str.trim().toLowerCase();
}

function normalizeUrl(url?: string): string {
  if (!url) return '';
  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

/**
 * Get all saved items from localStorage (Client-side browser cache only)
 */
export function getSavedItems(): SavedItem[] {
  if (typeof window === 'undefined') return [];
  if (inMemoryItems !== null) return inMemoryItems;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      inMemoryItems = [];
      return inMemoryItems;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      inMemoryItems = parsed;
      return inMemoryItems;
    }
    inMemoryItems = [];
    return inMemoryItems;
  } catch (err) {
    console.warn('Failed to read saved items from browser cache:', err);
    inMemoryItems = [];
    return inMemoryItems;
  }
}

function persistAndBroadcast(items: SavedItem[]) {
  inMemoryItems = items;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }));
      try {
        window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
      } catch {
        // Fallback for environments where StorageEvent constructor has strict restrictions
      }
    } catch (err) {
      console.error('Failed to write to localStorage:', err);
    }
  }
}

/**
 * Save an item to the browser cache (localStorage)
 */
export function saveItem(
  item: Omit<SavedItem, 'id' | 'savedAt'> & { id?: string }
): SavedItem {
  const current = getSavedItems();
  const itemId = (
    item.id ||
    `${item.toolId}_${encodeURIComponent(item.url || item.title || Date.now().toString())}`
  ).toLowerCase();

  const normUrl = normalizeUrl(item.url);
  const normHandle = normalizeString(item.handle);

  // Check and remove any duplicate matching this resource
  const filtered = current.filter((existing) => {
    if (existing.id.toLowerCase() === itemId) return false;
    if (
      existing.toolId === item.toolId &&
      normUrl &&
      normalizeUrl(existing.url) === normUrl
    ) {
      return false;
    }
    if (
      existing.toolId === item.toolId &&
      normHandle &&
      normalizeString(existing.handle) === normHandle
    ) {
      return false;
    }
    return true;
  });

  const newItem: SavedItem = {
    ...item,
    id: itemId,
    savedAt: Date.now(),
  };

  const updated = [newItem, ...filtered];
  persistAndBroadcast(updated);
  return newItem;
}

/**
 * Remove an item from the browser cache
 */
export function removeSavedItem(idOrQuery: string, toolId?: string): void {
  if (typeof window === 'undefined' || !idOrQuery) return;
  const current = getSavedItems();
  const q = normalizeString(idOrQuery);
  const qUrl = normalizeUrl(idOrQuery);

  const updated = current.filter((item) => {
    // Direct ID match
    if (item.id.toLowerCase() === q) return false;
    // URL matching
    if (qUrl && normalizeUrl(item.url) === qUrl) return false;
    // Scoped matching if toolId is provided
    if (toolId && item.toolId === toolId) {
      if (normalizeString(item.handle) === q) return false;
      if (normalizeString(item.title) === q) return false;
      if (item.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  persistAndBroadcast(updated);
}

/**
 * Check if a specific resource is saved in browser cache
 */
export function isItemSaved(
  toolId: string,
  urlOrId?: string,
  customId?: string
): boolean {
  if (typeof window === 'undefined') return false;
  const items = getSavedItems();
  const query = normalizeString(urlOrId);
  const queryUrl = normalizeUrl(urlOrId);
  const idQuery = normalizeString(customId);

  if (!query && !idQuery) return false;

  return items.some((item) => {
    if (item.toolId !== toolId) return false;
    if (idQuery && item.id.toLowerCase() === idQuery) return true;
    if (query) {
      if (item.id.toLowerCase() === query) return true;
      if (normalizeString(item.url) === query) return true;
      if (queryUrl && normalizeUrl(item.url) === queryUrl) return true;
      if (item.handle && normalizeString(item.handle) === query) return true;
    }
    return false;
  });
}

/**
 * Toggle saved status of an item
 */
export function toggleSavedItem(
  item: Omit<SavedItem, 'id' | 'savedAt'> & { id?: string }
): boolean {
  const isSavedNow = isItemSaved(item.toolId, item.url || item.id || '', item.id);
  if (isSavedNow) {
    removeSavedItem(item.id || item.url || '', item.toolId);
    return false;
  } else {
    saveItem(item);
    return true;
  }
}

/**
 * Clear all items from browser cache
 */
export function clearAllSavedItems(): void {
  if (typeof window === 'undefined') return;
  persistAndBroadcast([]);
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
    inMemoryItems = null;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    inMemoryItems = null;
    callback();
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

function getSnapshot(): SavedItem[] {
  return getSavedItems();
}

const emptySnapshot: SavedItem[] = [];
function getServerSnapshot(): SavedItem[] {
  return emptySnapshot;
}

/**
 * React hook to listen to browser saved items changes in real time
 */
export function useSavedItems() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const save = useCallback(
    (itemData: Omit<SavedItem, 'id' | 'savedAt'> & { id?: string }) => {
      return saveItem(itemData);
    },
    []
  );

  const remove = useCallback((idOrQuery: string, toolId?: string) => {
    removeSavedItem(idOrQuery, toolId);
  }, []);

  const clear = useCallback(() => {
    clearAllSavedItems();
  }, []);

  const checkIsSaved = useCallback(
    (toolId: string, urlOrId?: string, customId?: string) => {
      return isItemSaved(toolId, urlOrId, customId);
    },
    []
  );

  const toggle = useCallback(
    (itemData: Omit<SavedItem, 'id' | 'savedAt'> & { id?: string }) => {
      return toggleSavedItem(itemData);
    },
    []
  );

  const refresh = useCallback(() => {
    inMemoryItems = null;
    notifyStorageChange();
  }, []);

  return {
    items,
    count: items.length,
    isClient,
    save,
    remove,
    clear,
    toggle,
    refresh,
    isSaved: checkIsSaved,
  };
}
