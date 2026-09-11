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
      <div className="tool-card-3d p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#181135]">
              100% Client-Side Private Storage
            </h3>
            <p className="text-[13px] text-[#635B80]">
              All items below are stored in your device&apos;s browser cache (localStorage). None of this data is ever sent to or saved on any server.
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={exportSavedItemsJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#181135] bg-white/80 border border-[#DDD0FA] rounded-xl hover:text-[#7C3AED] hover:bg-white transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#635B80]" />
              <span>Export JSON</span>
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-2 bg-red-50/80 backdrop-blur-md p-1.5 rounded-xl border border-red-200">
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
                  className="text-[11px] text-[#635B80] px-1 hover:text-[#181135]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-red-600 bg-white/80 border border-red-200 rounded-xl hover:bg-red-50 transition-all cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Header */}
      <div className="tool-card-3d p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#635B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved channels, videos, handles, or tools..."
              className="w-full pl-10 pr-8 py-2.5 text-[13px] bg-white/80 border border-[#DDD0FA] rounded-xl text-[#181135] placeholder:text-[#8C929D] focus:outline-hidden focus:border-[#7C3AED] focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C929D] hover:text-[#181135]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Total Count */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-[12px] font-mono text-[#635B80]">
              Total Records: <strong className="text-[#181135]">{count}</strong>
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
                className={`text-[12px] font-bold px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer shadow-2xs ${
                  selectedCategory === cat
                    ? 'btn-siampay-primary text-white border-transparent'
                    : 'bg-white/80 text-[#635B80] border-[#DDD0FA] hover:text-[#7C3AED] hover:border-[#7C3AED]'
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
        <div className="min-h-[380px] tool-card-3d flex flex-col items-center justify-center text-center p-8">
          <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] mb-4">
            <Bookmark className="w-7 h-7 text-[#7C3AED]" />
          </div>
          <h3 className="text-[17px] font-bold text-[#181135]">
            {searchQuery ? 'No matching saved items found' : 'Your browser bookmark collection is empty'}
          </h3>
          <p className="text-[13px] text-[#635B80] max-w-md mt-1.5 leading-relaxed">
            {searchQuery
              ? `No saved items match "${searchQuery}". Please check your spelling or clear the search filter.`
              : 'Every tool in YT MONETIZE includes a "Save to Browser" button on its result card. When you click Save, the item is instantly stored offline in your browser.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 justify-center max-w-md">
            {TOOLS.slice(0, 4).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#181135] bg-white/80 border border-[#DDD0FA] px-3 py-2 rounded-xl hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all shadow-2xs"
              >
                <ToolIcon name={tool.icon} className="w-4 h-4 text-[#7C3AED]" />
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
                className="tool-card-3d p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  {/* Top Bar: Tool Tag & Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EDE8F9] px-2.5 py-1 rounded-lg border border-[#DDD0FA]">
                      {matchedTool ? (
                        <ToolIcon name={matchedTool.icon} className="w-3.5 h-3.5 text-[#7C3AED]" />
                      ) : null}
                      <span>{item.toolName}</span>
                    </span>

                    <span className="text-[11px] font-mono text-[#8C929D] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatSavedDate(item.savedAt)}
                    </span>
                  </div>

                  {/* Subject Info */}
                  <div className="flex items-start gap-3">
                    {item.avatarUrl ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#EDE8F9] shrink-0 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.avatarUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE8F9] shrink-0 flex items-center justify-center text-[#7C3AED]">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-[#181135] line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      {item.handle && (
                        <p className="text-[12px] font-mono text-[#635B80] truncate mt-0.5 font-bold">
                          {item.handle.startsWith('@') ? item.handle : `@${item.handle}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Summary Metric Badge */}
                  {item.metaText && (
                    <div className="text-[12px] font-medium bg-white/70 border border-[#EDE8F9] px-3 py-2 rounded-xl flex items-center justify-between">
                      <span className="text-[#635B80] text-[10px] font-bold uppercase tracking-wider">
                        Key Metric
                      </span>
                      <span
                        className={`font-bold ${
                          item.badgeType === 'success'
                            ? 'text-emerald-600'
                            : item.badgeType === 'danger'
                            ? 'text-rose-600'
                            : item.badgeType === 'warning'
                            ? 'text-amber-600'
                            : 'text-[#181135]'
                        }`}
                      >
                        {item.metaText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-[#EDE8F9] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.url)}
                      title="Copy YouTube URL"
                      className="p-1.5 text-[11px] font-bold text-[#635B80] hover:text-[#7C3AED] hover:bg-white rounded-lg border border-[#DDD0FA] bg-white/80 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
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
                      className="p-1.5 text-[11px] text-[#635B80] hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-[#DDD0FA] bg-white/80 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link
                    href={toolTargetPath}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[#7C3AED] hover:text-[#5B21B6] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/15 border border-[#7C3AED]/20 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
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
