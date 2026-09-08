'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  X,
} from 'lucide-react';
import { useSavedItems, exportSavedItemsJson } from '@/lib/saved-items/storage';
import { TOOLS } from '@/lib/constants/site';
import { ToolIcon } from '@/components/common/ToolIcon';

export function SavedPageClient() {
  const { items, count, remove, clear, isClient } = useSavedItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['All', ...cats];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.handle && item.handle.toLowerCase().includes(q)) ||
        item.toolName.toLowerCase().includes(q) ||
        (item.metaText && item.metaText.toLowerCase().includes(q)) ||
        item.url.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSavedDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isClient) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D6293C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Banner */}
      <div className="p-4 bg-white border border-[#E3E2DE] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(30,158,107,0.1)] border border-[#1E9E6B]/20 flex items-center justify-center text-[#1E9E6B] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#16181C]">
              100% Client-Side Private Storage
            </h3>
            <p className="text-[12px] text-[#5B6169]">
              All items below are stored in your device&apos;s browser cache (localStorage). None of this data is ever sent to or saved on any server.
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={exportSavedItemsJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#16181C] bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl hover:border-[#16181C] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5B6169]" />
              <span>Export JSON</span>
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-2 bg-red-50 p-1 rounded-xl border border-red-200">
                <span className="text-[11px] text-red-700 font-bold px-1">Clear all?</span>
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setConfirmClear(false);
                  }}
                  className="text-[11px] font-bold bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-[11px] text-[#5B6169] px-1 hover:text-[#16181C]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Header */}
      <div className="p-4 bg-white border border-[#E3E2DE] rounded-2xl space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#5B6169] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved channels, videos, handles, or tools..."
              className="w-full pl-9 pr-8 py-2 text-[13px] bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl text-[#16181C] placeholder:text-[#8C929D] focus:outline-hidden focus:border-[#16181C] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C929D] hover:text-[#16181C]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Total Count */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-[12px] font-mono-data text-[#5B6169]">
              Total Records: <strong>{count}</strong>
            </span>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[12px] font-semibold px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#16181C] text-white border-[#16181C]'
                    : 'bg-[#F9F9F8] text-[#5B6169] border-[#E3E2DE] hover:text-[#16181C] hover:border-[#16181C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Saved Items */}
      {filteredItems.length === 0 ? (
        <div className="min-h-[380px] bg-white border border-[#E3E2DE] rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(214,41,60,0.08)] border border-[#D6293C]/20 flex items-center justify-center text-[#D6293C] mb-4">
            <Bookmark className="w-7 h-7 text-[#D6293C]" />
          </div>
          <h3 className="text-[17px] font-bold text-[#16181C]">
            {searchQuery ? 'No matching saved items found' : 'Your browser bookmark collection is empty'}
          </h3>
          <p className="text-[13px] text-[#5B6169] max-w-md mt-1.5 leading-relaxed">
            {searchQuery
              ? `No saved items match "${searchQuery}". Please check your spelling or clear the search filter.`
              : 'Every tool in YT MONETIZE includes a "Save to Browser" button on its result card. When you click Save, the item is instantly stored offline in your browser.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 justify-center max-w-md">
            {TOOLS.slice(0, 4).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#16181C] bg-[#F9F9F8] border border-[#E3E2DE] px-3 py-2 rounded-xl hover:border-[#16181C] hover:text-[#D6293C] transition-all"
              >
                <ToolIcon name={tool.icon} className="w-4 h-4 text-[#D6293C]" />
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const matchedTool = TOOLS.find((t) => t.id === item.toolId);
            const toolTargetPath = matchedTool ? matchedTool.path : '/monetization-checker';

            return (
              <div
                key={item.id}
                className="bg-white border border-[#E3E2DE] rounded-2xl p-4 shadow-2xs hover:border-[#16181C]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  {/* Top Bar: Tool Tag & Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5B6169] bg-[#F9F9F8] px-2.5 py-1 rounded-lg border border-[#E3E2DE]">
                      {matchedTool ? (
                        <ToolIcon name={matchedTool.icon} className="w-3.5 h-3.5 text-[#D6293C]" />
                      ) : null}
                      <span>{item.toolName}</span>
                    </span>

                    <span className="text-[11px] font-mono-data text-[#8C929D] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatSavedDate(item.savedAt)}
                    </span>
                  </div>

                  {/* Subject Info */}
                  <div className="flex items-start gap-3">
                    {item.avatarUrl ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E3E2DE] shrink-0 bg-[#F0EFEB]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.avatarUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#F0EFEB] border border-[#E3E2DE] shrink-0 flex items-center justify-center text-[#5B6169]">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-[#16181C] line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      {item.handle && (
                        <p className="text-[12px] font-mono-data text-[#5B6169] truncate mt-0.5">
                          {item.handle.startsWith('@') ? item.handle : `@${item.handle}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Summary Metric Badge */}
                  {item.metaText && (
                    <div className="text-[12px] font-medium bg-[#F9F9F8] border border-[#E3E2DE] px-3 py-2 rounded-xl flex items-center justify-between">
                      <span className="text-[#5B6169] text-[10px] font-bold uppercase tracking-wider">
                        Key Metric
                      </span>
                      <span
                        className={`font-bold ${
                          item.badgeType === 'success'
                            ? 'text-[#1E9E6B]'
                            : item.badgeType === 'danger'
                            ? 'text-[#D6293C]'
                            : item.badgeType === 'warning'
                            ? 'text-[#E07A14]'
                            : 'text-[#16181C]'
                        }`}
                      >
                        {item.metaText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-[#F0EFEB] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.url)}
                      title="Copy YouTube URL"
                      className="p-1.5 text-[11px] font-semibold text-[#5B6169] hover:text-[#16181C] hover:bg-[#F9F9F8] rounded-lg border border-[#E3E2DE] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                          <span className="text-[#1E9E6B]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      title="Remove from browser cache"
                      className="p-1.5 text-[11px] text-[#5B6169] hover:text-red-600 hover:bg-red-50 rounded-lg border border-[#E3E2DE] hover:border-red-200 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link
                    href={toolTargetPath}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[#D6293C] hover:text-[#B51E30] bg-[rgba(214,41,60,0.06)] hover:bg-[rgba(214,41,60,0.12)] border border-[#D6293C]/20 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
