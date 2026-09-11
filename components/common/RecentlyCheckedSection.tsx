'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecentCheckItem } from '@/lib/recent-checks/store';
import { ArrowUpRight, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';

interface RecentlyCheckedSectionProps {
  toolId?: string;
  category?: 'Monetization' | 'Channel' | 'Analytics' | 'Video';
  title?: string;
  description?: string;
  onSelect?: (input: string) => void;
  targetPath?: string;
  limit?: number;
  className?: string;
}

export function RecentlyCheckedSection({
  toolId,
  category,
  title = 'Recently Checked Channels',
  description,
  onSelect,
  targetPath = '/monetization-checker',
  limit = 5,
  className = '',
}: RecentlyCheckedSectionProps) {
  const [items, setItems] = useState<RecentCheckItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let ignore = false;

    const loadRecent = async () => {
      try {
        const params = new URLSearchParams();
        if (toolId) params.set('tool', toolId);
        if (category) params.set('category', category);
        params.set('limit', String(limit));

        const res = await fetch(`/api/recent-checks?${params.toString()}`);
        if (!res.ok || ignore) return;

        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          // Also check local storage for this user's personal recent lookups
          try {
            const localData = localStorage.getItem('yt_monetize_recent_checks');
            if (localData) {
              const userRecent: RecentCheckItem[] = JSON.parse(localData);
              // Merge user recent at top while removing duplicates
              const merged = [...userRecent];
              for (const item of data.items) {
                if (
                  !merged.some(
                    (m) =>
                      (m.id && m.id === item.id) ||
                      m.title.toLowerCase() === item.title.toLowerCase()
                  )
                ) {
                  merged.push(item);
                }
              }
              if (!ignore) {
                setItems(merged.slice(0, limit));
              }
              return;
            }
          } catch {
            // Ignore localStorage errors
          }

          if (!ignore) {
            setItems(data.items.slice(0, limit));
          }
        }
      } catch (err) {
        console.warn('Failed to load recent checks:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadRecent();

    // Listen for custom check events dispatched when user runs a check
    const handleNewCheck = (e: Event) => {
      const customEvent = e as CustomEvent<RecentCheckItem>;
      if (customEvent.detail) {
        setItems((prev) => {
          const existsIndex = prev.findIndex(
            (p) =>
              (p.id && p.id === customEvent.detail.id) ||
              p.title.toLowerCase() === customEvent.detail.title.toLowerCase()
          );
          let updated = [...prev];
          if (existsIndex !== -1) {
            updated.splice(existsIndex, 1);
          }
          updated.unshift(customEvent.detail);
          return updated.slice(0, limit);
        });
      }
    };

    window.addEventListener('yt-monetize-check-added', handleNewCheck);
    return () => {
      ignore = true;
      window.removeEventListener('yt-monetize-check-added', handleNewCheck);
    };
  }, [toolId, category, limit]);

  const handleItemClick = (item: RecentCheckItem) => {
    const val = item.url || item.handle || item.id;
    if (onSelect) {
      onSelect(val);
      // Scroll smoothly to the input form if needed
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      id="recently-checked-section"
      className={`tool-card-3d p-6 sm:p-7 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-3 border-b border-[#EDE8F9]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] sm:text-[19px] font-bold text-[#181135] tracking-tight">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#059669] text-[11px] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Live
            </span>
          </div>
          {description ? (
            <p className="text-[13px] text-[#635B80] mt-0.5">{description}</p>
          ) : (
            <p className="text-[12px] text-[#635B80] mt-0.5">
              Verified real-time creator lookups on YT MONETIZE
            </p>
          )}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[#EDE8F9]/60">
        {loading && items.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-[#635B80] space-y-2">
            <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading real recent lookups...</p>
          </div>
        ) : (
          items.map((item, idx) => {
            const isFailed = failedImages[item.id || item.title];
            const isMonetized =
              item.statusType === 'success' ||
              item.statusText.toLowerCase().includes('monetized');
            const isNotMonetized =
              item.statusType === 'danger' ||
              item.statusText.toLowerCase().includes('not monetized');

            const content = (
              <div
                key={item.id || idx}
                onClick={() => handleItemClick(item)}
                className="group flex items-center justify-between py-3 px-2.5 -mx-1.5 rounded-xl hover:bg-white/70 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Channel / Video Avatar */}
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full shrink-0 overflow-hidden bg-white/80 border border-[#DDD0FA] shadow-xs flex items-center justify-center">
                    {!isFailed && item.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.avatarUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [item.id || item.title]: true,
                          }))
                        }
                      />
                    ) : (
                      <span className="text-[15px] font-bold text-[#635B80] uppercase">
                        {item.title.charAt(0) || 'Y'}
                      </span>
                    )}
                  </div>

                  {/* Channel Title & Status */}
                  <div className="min-w-0">
                    <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#181135] group-hover:text-[#7C3AED] transition-colors truncate">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-0.5">
                      {isMonetized ? (
                        <span className="text-[12px] font-semibold text-[#059669] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Monetized
                        </span>
                      ) : isNotMonetized ? (
                        <span className="text-[12px] font-semibold text-[#EF4444] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Not Monetized
                        </span>
                      ) : (
                        <span className="text-[12px] font-medium text-[#635B80]">
                          {item.statusText}
                        </span>
                      )}

                      {item.metaText && (
                        <span className="text-[11px] text-[#8C82A6] hidden xs:inline truncate">
                          · {item.metaText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side action button */}
                <div className="shrink-0 pl-2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold text-[#635B80] group-hover:text-[#7C3AED] group-hover:bg-[#EDE8F9]/60 transition-colors">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            );

            // If onSelect is not available, render as a Link to the tool
            if (!onSelect) {
              const href = `${targetPath}?url=${encodeURIComponent(
                item.url || item.handle || item.id
              )}`;
              return (
                <Link key={item.id || idx} href={href} className="block">
                  {content}
                </Link>
              );
            }

            return content;
          })
        )}
      </div>
    </div>
  );
}
