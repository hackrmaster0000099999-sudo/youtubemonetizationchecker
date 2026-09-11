'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  X,
  Trash2,
  Download,
  ExternalLink,
  Copy,
  Check,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useSavedItems, SavedItem, exportSavedItemsJson } from '@/lib/saved-items/storage';
import { ToolIcon, CategoryIcon } from '@/components/common/ToolIcon';
import { TOOLS } from '@/lib/constants/site';

interface SavedItemsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedItemsDrawer({ isOpen, onClose }: SavedItemsDrawerProps) {
  const { items, count, remove, clear } = useSavedItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Categories list based on available saved items
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['All', ...cats];
  }, [items]);

  // Filter items
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

  const handleClearAll = () => {
    clear();
    setConfirmClear(false);
  };

  const formatSavedDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        id="saved-items-drawer"
        className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E3E2DE] animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EDE8F9] flex items-center justify-between bg-[#F8F5FE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[13px] bg-[#F2ECFE] border border-[#DDD0FA] flex items-center justify-center text-[#7C3AED]">
              <Bookmark className="w-5 h-5 fill-[#7C3AED]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-[#181135]">Saved in Browser</h2>
                <span className="text-[11px] font-mono-data font-bold text-[#7C3AED] bg-[#F2ECFE] px-2.5 py-0.5 rounded-full border border-[#DDD0FA]">
                  {count}
                </span>
              </div>
              <p className="text-[11px] text-[#635B80] mt-0.5">
                Client-side storage • 100% private to your device
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#635B80] hover:text-[#181135] hover:bg-[#F8F5FE] border border-transparent hover:border-[#EDE8F9] transition-all cursor-pointer"
            aria-label="Close saved items drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="p-4 border-b border-[#EDE8F9] bg-white space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#635B80] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved channels, videos, or tools..."
              className="w-full pl-9 pr-8 py-2 text-[13px] bg-[#F8F5FE] border border-[#EDE8F9] rounded-xl text-[#181135] placeholder:text-[#8C929D] focus:outline-hidden focus:border-[#7C3AED] focus:bg-white transition-all"
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

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                      : 'bg-[#F8F5FE] text-[#635B80] border-[#EDE8F9] hover:text-[#181135] hover:border-[#DDD0FA]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Batch Actions: Export & Clear */}
          {items.length > 0 && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono-data text-[#635B80]">
                Showing {filteredItems.length} of {items.length} records
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportSavedItemsJson}
                  title="Download JSON backup"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#635B80] hover:text-[#181135] px-2 py-1 rounded-md border border-[#EDE8F9] hover:bg-[#F8F5FE] transition-all cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>

                {confirmClear ? (
                  <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-md border border-red-200">
                    <span className="text-[10px] text-red-700 font-bold">Clear all?</span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded cursor-pointer hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="text-[10px] text-[#635B80] hover:text-[#181135] px-1"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    title="Clear all saved items"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded-md border border-red-200 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Saved Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#F8F5FE]">
          {filteredItems.length === 0 ? (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-6 bg-white border border-[#EDE8F9] rounded-2xl">
              <div className="w-12 h-12 rounded-[18px] bg-[#F2ECFE] border border-[#DDD0FA] flex items-center justify-center text-[#7C3AED] mb-3">
                <Bookmark className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#181135]">
                {searchQuery ? 'No matching saved items' : 'No saved records yet'}
              </h3>
              <p className="text-[12px] text-[#635B80] max-w-xs mt-1 leading-relaxed">
                {searchQuery
                  ? `No saved items match "${searchQuery}". Try clearing your search.`
                  : 'Whenever you use any tool (Monetization Checker, Channel ID Finder, Calculator, etc.), click the "Save to Browser" button to pin it here.'}
              </p>
              {!searchQuery && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-xs">
                  {TOOLS.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#181135] bg-[#F8F5FE] border border-[#EDE8F9] px-2.5 py-1 rounded-xl hover:border-[#7C3AED] transition-all"
                    >
                      <ToolIcon name={tool.icon} className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{tool.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            filteredItems.map((item) => {
              const matchedTool = TOOLS.find((t) => t.id === item.toolId);
              const toolTargetPath = matchedTool ? matchedTool.path : '/monetization-checker';

              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-white border border-[#EDE8F9] rounded-2xl shadow-2xs hover:border-[#DDD0FA] transition-all space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar / Thumbnail */}
                    {item.avatarUrl ? (
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#EDE8F9] shrink-0 bg-[#F8F5FE]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.avatarUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[#F2ECFE] border border-[#DDD0FA] shrink-0 flex items-center justify-center text-[#7C3AED]">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F4EFFE] px-2 py-0.5 rounded-md border border-[#DDD0FA]">
                          {item.toolName}
                        </span>
                        <span className="text-[10px] font-mono-data text-[#8C929D] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatSavedDate(item.savedAt)}
                        </span>
                      </div>

                      <h4 className="text-[13px] font-bold text-[#181135] truncate mt-1">
                        {item.title}
                      </h4>
                      {item.handle && (
                        <p className="text-[11px] font-mono-data text-[#635B80] truncate">
                          {item.handle.startsWith('@') ? item.handle : `@${item.handle}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Summary Metric Badge if present */}
                  {item.metaText && (
                    <div className="text-[11px] font-medium bg-[#F8F5FE] border border-[#EDE8F9] px-2.5 py-1.5 rounded-xl flex items-center justify-between">
                      <span className="text-[#635B80] text-[10px] font-bold uppercase tracking-wider">
                        Saved Result:
                      </span>
                      <span
                        className={`font-semibold ${
                          item.badgeType === 'success'
                            ? 'text-[#10B981]'
                            : item.badgeType === 'danger'
                            ? 'text-red-600'
                            : item.badgeType === 'warning'
                            ? 'text-amber-600'
                            : 'text-[#181135]'
                        }`}
                      >
                        {item.metaText}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#EDE8F9]">
                    <div className="flex items-center gap-1.5">
                      {/* Copy link button */}
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.url)}
                        title="Copy YouTube URL"
                        className="p-1.5 text-[11px] font-semibold text-[#635B80] hover:text-[#181135] hover:bg-[#F8F5FE] rounded-lg border border-[#EDE8F9] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#10B981]" />
                            <span className="text-[#10B981] text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy URL</span>
                          </>
                        )}
                      </button>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        title="Remove from browser cache"
                        className="p-1.5 text-[11px] text-[#635B80] hover:text-red-600 hover:bg-red-50 rounded-lg border border-[#EDE8F9] hover:border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Open in tool */}
                    <Link
                      href={toolTargetPath}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] hover:text-[#6D28D9] bg-[#F2ECFE] hover:bg-[#EDE8F9] border border-[#DDD0FA] px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Privacy Guarantee */}
        <div className="p-3.5 border-t border-[#EDE8F9] bg-[#F8F5FE] flex items-center gap-2 text-[11px] text-[#635B80]">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>
            <strong>Browser Storage Only:</strong> All items are saved strictly in your device&apos;s
            local storage. Zero server uploads.
          </span>
        </div>
      </div>
    </div>
  );
}
