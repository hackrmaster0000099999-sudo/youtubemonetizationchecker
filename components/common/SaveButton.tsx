'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { saveItem, removeSavedItem, isItemSaved, SavedItem } from '@/lib/saved-items/storage';

interface SaveButtonProps {
  item: {
    id?: string;
    toolId: string;
    toolName: string;
    category: string;
    targetType: 'CHANNEL' | 'VIDEO' | 'PLAYLIST';
    title: string;
    handle?: string;
    avatarUrl?: string;
    url: string;
    metaText?: string;
    badgeType?: 'success' | 'warning' | 'danger' | 'neutral';
    summary?: string;
  };
  variant?: 'default' | 'sm' | 'icon';
  className?: string;
}

export function SaveButton({ item, variant = 'default', className = '' }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    const checkState = () => {
      setSaved(isItemSaved(item.toolId, item.url || item.id || ''));
    };

    checkState();

    const handleStorageChange = () => {
      checkState();
    };

    window.addEventListener('yt_monetize_saved_items_changed', handleStorageChange);
    return () => {
      window.removeEventListener('yt_monetize_saved_items_changed', handleStorageChange);
    };
  }, [item.toolId, item.url, item.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const targetUrlOrId = item.url || item.id || '';
    const currentlySaved = isItemSaved(item.toolId, targetUrlOrId);

    if (currentlySaved) {
      // Find item ID
      const computedId = item.id || `${item.toolId}_${encodeURIComponent(item.url || item.title)}`.toLowerCase();
      removeSavedItem(computedId);
      setSaved(false);
      setJustSaved(false);
    } else {
      saveItem(item);
      setSaved(true);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={saved ? 'Saved in Browser Cache (Click to remove)' : 'Save to Browser Cache (Private, offline)'}
        aria-label={saved ? 'Remove from saved items' : 'Save to browser cache'}
        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          saved
            ? 'border-[#D6293C]/30 bg-[#FDF2F3] text-[#D6293C]'
            : 'border-[#E3E2DE] bg-white hover:bg-[#F9F9F8] text-[#5B6169] hover:text-[#16181C]'
        } ${className}`}
      >
        {saved ? (
          <BookmarkCheck className="w-4 h-4 fill-[#D6293C] text-white" />
        ) : (
          <Bookmark className="w-4 h-4 text-inherit" />
        )}
      </button>
    );
  }

  if (variant === 'sm') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={saved ? 'Saved in browser cache (localStorage)' : 'Save to browser cache'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-semibold transition-all cursor-pointer ${
          saved
            ? 'border-[#D6293C]/30 bg-[#FDF2F3] text-[#D6293C]'
            : 'border-[#E3E2DE] bg-white hover:bg-[#F9F9F8] text-[#5B6169] hover:text-[#16181C]'
        } ${className}`}
      >
        {saved ? (
          <>
            <BookmarkCheck className="w-3.5 h-3.5 fill-[#D6293C] text-white" />
            <span>{justSaved ? 'Saved in Browser!' : 'Saved'}</span>
          </>
        ) : (
          <>
            <Bookmark className="w-3.5 h-3.5 text-[#5B6169]" />
            <span>Save</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={
        saved
          ? 'Saved in your local browser cache. Click to unsave.'
          : 'Save to your local browser cache (100% private, never stored on server)'
      }
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold transition-all cursor-pointer ${
        saved
          ? 'border-[#D6293C]/40 bg-[#FDF2F3] text-[#D6293C] shadow-2xs'
          : 'border-[#E3E2DE] bg-white hover:bg-[#F9F9F8] text-[#16181C] hover:border-[#16181C]'
      } ${className}`}
    >
      {saved ? (
        <>
          {justSaved ? (
            <Check className="w-4 h-4 text-[#D6293C] animate-in zoom-in-50 duration-150" />
          ) : (
            <BookmarkCheck className="w-4 h-4 fill-[#D6293C] text-white" />
          )}
          <span>{justSaved ? 'Saved in Browser Cache!' : 'Saved in Browser'}</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 text-[#5B6169]" />
          <span>Save to Browser</span>
        </>
      )}
    </button>
  );
}
