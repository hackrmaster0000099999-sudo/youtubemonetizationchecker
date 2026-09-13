'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Flame,
  CloudRain,
  Zap,
  Heart,
  Compass,
  Users,
  Moon,
  Search,
  Copy,
  Check,
  Share2,
  Bookmark,
  Hash,
  X,
  SlidersHorizontal,
  HelpCircle,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { CAPTION_CATEGORIES, CAPTIONS_DATA, CaptionItem } from '@/lib/constants/captions';
import { useSavedItems, toggleSavedItem, isItemSaved } from '@/lib/saved-items/storage';
import Link from 'next/link';

interface CaptionsClientProps {
  initialCategoryId?: string;
}

export function CaptionsClient({ initialCategoryId }: CaptionsClientProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');

  // Active category: resolved from prop, URL query, or defaults to 'islamic'
  const activeCategory = useMemo(() => {
    const targetId = initialCategoryId || urlCategory;
    if (targetId) {
      const found = CAPTION_CATEGORIES.find((c) => c.id === targetId);
      if (found) return found;
    }
    return (
      CAPTION_CATEGORIES.find((c) => c.id === 'islamic') ||
      CAPTION_CATEGORIES[0]
    );
  }, [initialCategoryId, urlCategory]);

  // Tab mode state: strictly 'bangla', 'english', or 'image' (default: 'bangla')
  const [selectedMode, setSelectedMode] = useState<'bangla' | 'english' | 'image'>('bangla');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'plain' | 'tags' | null>(null);
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);
  const [liveCaptions, setLiveCaptions] = useState<CaptionItem[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  const { items: savedItems } = useSavedItems();

  // Category Icon Resolver
  const getCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Flame':
        return <Flame className={className} />;
      case 'CloudRain':
        return <CloudRain className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Fetch live captions from Firestore via API
  React.useEffect(() => {
    let isMounted = true;
    async function fetchLiveCaptions() {
      setIsLoadingLive(true);
      try {
        const res = await fetch(`/api/captions?category=${encodeURIComponent(activeCategory.id)}`);
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setLiveCaptions(json.data);
        }
      } catch (err) {
        console.warn('Could not fetch live captions from API:', err);
      } finally {
        if (isMounted) {
          setIsLoadingLive(false);
        }
      }
    }
    fetchLiveCaptions();
    return () => {
      isMounted = false;
    };
  }, [activeCategory.id]);

  // Combined pool of captions (Firestore live items prioritized, falling back to static constants)
  const combinedCaptions = useMemo(() => {
    if (liveCaptions.length > 0) {
      return liveCaptions;
    }
    return CAPTIONS_DATA.filter((c) => c.category === activeCategory.id);
  }, [liveCaptions, activeCategory.id]);

  // Filtered Captions for the current category, language, and search query
  const filteredCaptions = useMemo(() => {
    return combinedCaptions.filter((caption) => {
      // If Image mode, must have imageUrl
      if (selectedMode === 'image') {
        if (!caption.imageUrl) return false;
      } else {
        // Must match selected language ('bangla' or 'english')
        if (caption.language !== selectedMode) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesText = caption.text.toLowerCase().includes(query);
        const matchesTitle = caption.title ? caption.title.toLowerCase().includes(query) : false;
        const matchesTag = Array.isArray(caption.tags) && caption.tags.some((t) => t.toLowerCase().includes(query));
        const matchesSlug = caption.slug ? caption.slug.toLowerCase().includes(query) : false;
        if (!matchesText && !matchesTag && !matchesTitle && !matchesSlug) {
          return false;
        }
      }
      return true;
    });
  }, [combinedCaptions, selectedMode, searchQuery]);

  // Copy plain text
  const handleCopyText = async (caption: CaptionItem) => {
    try {
      await navigator.clipboard.writeText(caption.text);
      setCopiedId(caption.id);
      setCopiedType('plain');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = caption.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(caption.id);
      setCopiedType('plain');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    }
  };

  // Copy with hashtags
  const handleCopyWithTags = async (caption: CaptionItem) => {
    const fullText = `${caption.text}\n\n${caption.tags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(caption.id);
      setCopiedType('tags');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(caption.id);
      setCopiedType('tags');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    }
  };

  // Share handler
  const handleShare = async (caption: CaptionItem) => {
    const shareText = `${caption.text}\n\n${caption.tags.join(' ')}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Bangla & English Caption',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback
      }
    }
    // Fallback: Copy to clipboard
    handleCopyText(caption);
    setShareSuccessId(caption.id);
    setTimeout(() => setShareSuccessId(null), 2000);
  };

  // Download image handler
  const handleDownloadImage = async (caption: CaptionItem) => {
    if (!caption.imageUrl) return;
    try {
      const res = await fetch(caption.imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${caption.slug || 'photo-status'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(caption.imageUrl, '_blank');
    }
  };

  // Toggle bookmark in browser storage
  const handleToggleSave = (caption: CaptionItem) => {
    toggleSavedItem({
      id: `caption-${caption.id}`,
      toolId: 'captions-hub',
      toolName: 'Bangla & English Captions',
      category: caption.category.toUpperCase(),
      targetType: 'CAPTION',
      title: caption.text.slice(0, 70) + (caption.text.length > 70 ? '...' : ''),
      url: `/captions/${caption.category}`,
      metaText: caption.language === 'bangla' ? 'বাংলা ক্যাপশন' : 'English Caption',
      badgeType: 'neutral',
      summary: caption.tags.join(' '),
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Header Card */}
      <div className="bg-white border border-[#EDE8F9] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: activeCategory.color || '#7C3AED' }}
          >
            {getCategoryIcon(activeCategory.icon, 'w-6 h-6')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#181135]">{activeCategory.name}</h1>
              <span className="text-[13px] font-bold text-[#7C3AED] bg-[#F8F5FE] border border-[#DDD0FA] px-2.5 py-0.5 rounded-full shadow-2xs">
                {activeCategory.banglaName}
              </span>
              {activeCategory.badge && (
                <span className="text-[10px] font-extrabold text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activeCategory.badge}
                </span>
              )}
            </div>
            <p className="text-[14px] text-[#635B80] mt-1">{activeCategory.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF8FE] border border-[#EDE8F9] px-3.5 py-2 rounded-xl shrink-0 text-[13px] shadow-2xs">
          <span className="text-[#635B80]">মোড:</span>
          <span className="font-bold text-[#7C3AED]">
            {selectedMode === 'bangla'
              ? 'Bangla (ডিফল্ট)'
              : selectedMode === 'english'
              ? 'English'
              : 'Image'}
          </span>
        </div>
      </div>

      {/* Search & Mode Filter Bar (Bangla, English, Image) */}
      <div className="bg-white border border-[#EDE8F9] rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#635B80] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                selectedMode === 'image'
                  ? `এই ক্যাটাগরির ছবি খুঁজুন (Search images in ${activeCategory.name})...`
                  : `এই ক্যাটাগরিতে সার্চ করুন (Search captions or tags in ${activeCategory.name})...`
              }
              className="w-full pl-11 pr-10 py-3 bg-[#F8F5FE] border border-[#EDE8F9] rounded-2xl text-[14px] text-[#181135] placeholder-[#8E87A8] focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#635B80] hover:text-[#181135] transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Options: Bangla (ডিফল্ট), English, Image */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8F5FE] border border-[#EDE8F9] rounded-2xl shrink-0 self-start md:self-auto overflow-x-auto">
            <button
              type="button"
              id="lang-btn-bangla"
              onClick={() => setSelectedMode('bangla')}
              className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedMode === 'bangla'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#635B80] hover:text-[#181135]'
              }`}
            >
              <span>Bangla</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  selectedMode === 'bangla'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EDE8F9] text-[#7C3AED]'
                }`}
              >
                ডিফল্ট
              </span>
            </button>

            <button
              type="button"
              id="lang-btn-english"
              onClick={() => setSelectedMode('english')}
              className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedMode === 'english'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#635B80] hover:text-[#181135]'
              }`}
            >
              <span>English</span>
            </button>

            <button
              type="button"
              id="lang-btn-image"
              onClick={() => setSelectedMode('image')}
              className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedMode === 'image'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#635B80] hover:text-[#181135]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result Status Bar */}
      <div className="flex items-center justify-between px-1 text-[13px] text-[#635B80]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
          <span>
            {selectedMode === 'image' ? (
              <>
                Images for <strong className="text-[#7C3AED]">{activeCategory.name}</strong> ({activeCategory.banglaName})
              </>
            ) : (
              <>
                Showing <strong className="text-[#181135]">{filteredCaptions.length}</strong> {filteredCaptions.length === 1 ? 'caption' : 'captions'} in{' '}
                <strong className="text-[#7C3AED]">{activeCategory.name}</strong> ({selectedMode === 'bangla' ? 'Bangla' : 'English'})
              </>
            )}
          </span>
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-[#7C3AED] font-bold hover:underline cursor-pointer text-[12px]"
          >
            সার্চ মুছুন (Clear Search)
          </button>
        )}
      </div>

      {/* Main Content: Image Gallery or Captions Grid */}
      {selectedMode === 'image' ? (
        filteredCaptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaptions.map((caption) => {
              const isSaved = isItemSaved('captions-hub', `caption-${caption.id}`);
              const isJustCopiedPlain = copiedId === caption.id && copiedType === 'plain';

              return (
                <div
                  key={caption.id}
                  className="bg-white border border-[#EDE8F9] hover:border-[#DDD0FA] rounded-3xl overflow-hidden transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group"
                >
                  {/* Image Display */}
                  <div className="relative aspect-4/3 bg-[#FAF8FE] overflow-hidden border-b border-[#EDE8F9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={caption.imageUrl!}
                      alt={caption.title || caption.text.slice(0, 40)}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleSave(caption)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-[#7C3AED] text-white shadow-xs'
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title={isSaved ? 'সংরক্ষিত' : 'সেভ করুন'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Caption Info Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {caption.title && (
                        <h4 className="font-bold text-sm text-[#181135] mb-1 line-clamp-1">
                          {caption.title}
                        </h4>
                      )}
                      <p className="text-sm text-[#181135] font-medium line-clamp-3 leading-relaxed">
                        {caption.text}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#EDE8F9] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyText(caption)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isJustCopiedPlain
                              ? 'bg-[#10B981] text-white'
                              : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
                          }`}
                        >
                          {isJustCopiedPlain ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadImage(caption)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF8FE] border border-[#DDD0FA] text-[#7C3AED] hover:bg-[#F3EEFE] transition-colors cursor-pointer"
                          title="ছবি ডাউনলোড করুন"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ডাউনলোড</span>
                        </button>
                      </div>

                      <Link
                        href={`/captions/${activeCategory.id}/${caption.slug || caption.id}`}
                        className="text-xs font-bold text-[#7C3AED] hover:underline inline-flex items-center gap-1"
                      >
                        <span>স্বতন্ত্র পেজ</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#EDE8F9] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F5FE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center mx-auto shadow-2xs">
              <ImageIcon className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#181135]">
                {activeCategory.name} ফটো স্ট্যাটাস ও ছবি কালেকশন
              </h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                এই ক্যাটাগরিতে নতুন ও আকর্ষণীয় এইচডি ফটো স্ট্যাটাস ও উক্তি শীঘ্রই যুক্ত করা হচ্ছে।
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8FE] border border-[#EDE8F9] rounded-xl text-[12px] font-semibold text-[#7C3AED]">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>শীঘ্রই আসছে নতুন ফটো স্ট্যাটাস</span>
            </div>
          </div>
        )
      ) : filteredCaptions.length === 0 ? (
        <div className="bg-white border border-[#EDE8F9] rounded-3xl p-10 sm:p-14 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#F8F5FE] border border-[#EDE8F9] text-[#7C3AED] flex items-center justify-center mx-auto shadow-2xs">
            {searchQuery ? <Search className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-[#181135]">
              {searchQuery
                ? 'কোনো ক্যাপশন পাওয়া যায়নি'
                : `শীঘ্রই আসছে: ${activeCategory.name} (${activeCategory.banglaName})`}
            </h3>
            <p className="text-[14px] text-[#635B80] leading-relaxed">
              {searchQuery
                ? 'আপনার দেওয়া সার্চ অনুসন্ধানের সাথে মিলে এমন কোনো ক্যাপশন পাওয়া যায়নি।'
                : 'আমাদের টিম খুব শীঘ্রই এই ক্যাটাগরির জন্য নতুন ও আকর্ষণীয় বাংলা ও ইংরেজি ক্যাপশন এবং ভাইরাল সোশ্যাল মিডিয়া হ্যাশট্যাগ যুক্ত করবে।'}
            </p>
          </div>

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 bg-[#7C3AED] text-white text-[13px] font-bold rounded-xl hover:bg-[#6D28D9] transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>সার্চ ক্লিয়ার করুন (Clear Search)</span>
            </button>
          ) : (
            <div className="pt-2">
              <p className="text-[12px] font-bold text-[#635B80] mb-2 uppercase tracking-wider">
                প্রস্তাবিত হ্যাশট্যাগসমূহ (Suggested Hashtags):
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                {activeCategory.suggestedTags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] font-medium px-3 py-1 bg-[#F3EEFE] text-[#7C3AED] border border-[#DDD0FA] rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCaptions.map((caption) => {
            const isSaved = isItemSaved(`caption-${caption.id}`);
            const isJustCopiedPlain = copiedId === caption.id && copiedType === 'plain';
            const isJustCopiedTags = copiedId === caption.id && copiedType === 'tags';

            return (
              <div
                key={caption.id}
                className="bg-white border border-[#EDE8F9] hover:border-[#DDD0FA] rounded-3xl p-5 sm:p-6 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group space-y-5"
              >
                {/* Card Top: Badges & Bookmark */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#F3EEFE] text-[#7C3AED] border border-[#DDD0FA]">
                      {caption.category}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#F8F5FE] text-[#635B80] border border-[#EDE8F9]">
                      {caption.language === 'bangla' ? 'বাংলা' : 'EN'}
                    </span>
                    {caption.popular && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        Trending
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSave(caption)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-[#F3EEFE] border-[#DDD0FA] text-[#7C3AED]'
                        : 'bg-white border-[#EDE8F9] text-[#635B80] hover:text-[#7C3AED] hover:border-[#DDD0FA]'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save to Offline Browser Cache'}
                    aria-label="Save caption"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#7C3AED]' : ''}`} />
                  </button>
                </div>

                {/* Caption Text Body & Optional Image Thumbnail */}
                <div className="space-y-3 flex-1">
                  {caption.imageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-[#EDE8F9] max-h-48 bg-[#FAF8FE] mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={caption.imageUrl}
                        alt={caption.title || caption.text.slice(0, 30)}
                        className="w-full h-40 object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>ফটো স্ট্যাটাস</span>
                      </span>
                    </div>
                  )}

                  {caption.title && (
                    <h4 className="font-bold text-sm text-[#181135] mb-1">
                      {caption.title}
                    </h4>
                  )}

                  <p className="text-[16px] sm:text-[17px] text-[#181135] font-medium leading-relaxed select-all">
                    &ldquo;{caption.text}&rdquo;
                  </p>

                  {/* Hash Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {caption.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSearchQuery(tag.replace('#', ''))}
                        className="text-[12px] text-[#7C3AED] bg-[#F8F5FE] hover:bg-[#F2ECFE] border border-[#EDE8F9] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-[#EDE8F9] flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {/* Plain Copy */}
                    <button
                      type="button"
                      onClick={() => handleCopyText(caption)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                        isJustCopiedPlain
                          ? 'bg-[#10B981] text-white shadow-xs'
                          : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-2xs'
                      }`}
                    >
                      {isJustCopiedPlain ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>কপি করুন</span>
                        </>
                      )}
                    </button>

                    {/* Copy with Hashtags */}
                    <button
                      type="button"
                      onClick={() => handleCopyWithTags(caption)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                        isJustCopiedTags
                          ? 'bg-[#10B981] text-white border-[#10B981]'
                          : 'bg-white border-[#EDE8F9] text-[#181135] hover:bg-[#F8F5FE] hover:border-[#DDD0FA]'
                      }`}
                      title="Copy caption along with all hashtags"
                    >
                      {isJustCopiedTags ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>ট্যাগসহ কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Hash className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>+ট্যাগসহ কপি</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/captions/${caption.category}/${caption.slug || caption.id}`}
                      className="text-xs font-bold text-[#7C3AED] hover:underline inline-flex items-center gap-1 mr-1"
                      title="ক্যাপশনের স্বতন্ত্র পেজ দেখুন"
                    >
                      <span>স্বতন্ত্র পেজ</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    {/* Share button */}
                    <button
                      type="button"
                      onClick={() => handleShare(caption)}
                      className="p-2 rounded-xl border border-[#EDE8F9] bg-white text-[#635B80] hover:text-[#7C3AED] hover:border-[#DDD0FA] transition-all cursor-pointer"
                      title="Share this caption"
                      aria-label="Share caption"
                    >
                      {shareSuccessId === caption.id ? (
                        <Check className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEO & Educational Guide Section - Redesigned with editorial typography (No nested cards/boxes) */}
      <section
        id="creator-guide"
        aria-label="Social Media Creator & SEO Guide"
        className="bg-white border border-[#EDE8F9] rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 shadow-2xs"
      >
        {/* Header Block */}
        <div className="space-y-3 pb-6 border-b border-[#F0ECFA]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F3EEFE] text-[#7C3AED] text-[12px] font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Social Media Creator & SEO Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181135] tracking-tight leading-snug">
            সোশ্যাল মিডিয়া ক্রিয়েটরদের জন্য সেরা ক্যাপশন ও ফটো স্ট্যাটাস গাইড
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#554C75] leading-relaxed">
            ফেসবুক (Facebook), ইনস্টাগ্রাম (Instagram), হোয়াটসঅ্যাপ (WhatsApp) কিংবা ইউটিউব শর্টস—প্রতিটি সোশ্যাল প্ল্যাটফর্মে সফলতার মূল চাবিকাঠি হলো দৃষ্টিনন্দন ফটো বা ইমেজের সাথে একটি শক্তিশালী, অর্থপূর্ণ ক্যাপশন। <strong className="text-[#181135]">YT MONETIZE</strong>-এ আমরা নির্বাচিত বাংলা ও ইংরেজি ক্যাপশনের পাশাপাশি আকর্ষণীয় ফটো স্ট্যাটাস এবং ট্রেন্ডিং হ্যাশট্যাগ সমন্বিত করেছি, যা আপনার প্রতিটি পোস্টের এনগেজমেন্ট, অর্গানিক রিচ ও ফলোয়ার বৃদ্ধিতে সহায়তা করবে।
          </p>
        </div>

        {/* Editorial Content Flow - Clean hierarchy without nested boxes */}
        <div className="space-y-8 text-[#554C75] text-[15px] leading-relaxed">
          {/* Section 1: Caption Collection */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-[#181135] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#F3EEFE] text-[#7C3AED] font-black text-[13px] flex items-center justify-center shrink-0">
                ০১
              </span>
              <span>নির্বাচিত বাংলা ও ইংরেজি ক্যাপশন (Text Captions)</span>
            </h3>
            <p>
              একটি সুন্দর ক্যাপশন কেবল লেখার কয়েকটা লাইন নয়, এটি আপনার ব্যক্তিত্ব ও অনুভূতির আসল প্রতিচ্ছবি। বর্তমানে <strong className="text-[#7C3AED]">{activeCategory.name} ({activeCategory.banglaName})</strong> ক্যাটাগরিতে আমরা শত শত মৌলিক, প্রাসঙ্গিক ও গভীর ভাবার্থপূর্ণ উক্তি সন্নিবেশ করেছি। আমাদের সহজ ফিল্টারের মাধ্যমে আপনি যেকোনো মুহূর্তে বাংলা অথবা ইংরেজি ভাষায় স্যুইচ করে আপনার মনের মতো ক্যাপশন খুঁজে নিতে পারবেন।
            </p>
            <ul className="space-y-2 pt-1 pl-4">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 shrink-0" />
                <span><strong className="text-[#181135]">বাংলা ক্যাপশন:</strong> দেশীয় অনুভূতি, রোমান্টিক ছন্দ, গভীর জীবনদর্শন এবং মোটিভেশনের সাবলীল উপস্থাপনা।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 shrink-0" />
                <span><strong className="text-[#181135]">English Captions:</strong> আধুনিক সোশ্যাল মিডিয়া কালচার, অ্যাটিটিউড, বায়ো (Bio) ও শর্ট কোটসের প্রফেশনাল কালেকশন।</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-[#F0ECFA]" />

          {/* Section 2: Images & Visual Status (Highlighting the new Image feature) */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-[#181135] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#F3EEFE] text-[#7C3AED] font-black text-[13px] flex items-center justify-center shrink-0">
                ০২
              </span>
              <span>সোশ্যাল মিডিয়া ফটো ও স্ট্যাটাস ইমেজ (Visual Quotes & Photos)</span>
            </h3>
            <p>
              শুধু টেক্সট নয়, সোশ্যাল মিডিয়ায় ভিজ্যুয়াল কন্টেন্টের আকর্ষণ ও প্রভাব সবসময় বেশি। তাই প্রতিটি ক্যাটাগরিতে আমরা যুক্ত করেছি ডেডিকেটেড <strong className="text-[#181135]">Image (ছবি ও স্ট্যাটাস কার্ড)</strong> সেকশন। প্রোফাইল পিকচার (DP), ফেসবুক স্টোরি, ইনস্টাগ্রাম পোস্ট কিংবা হোয়াটসঅ্যাপ স্ট্যাটাসে সহজে ব্যবহারযোগ্য হাই-কোয়ালিটি ফটো স্ট্যাটাস এখান থেকেই সরাসরি সংগ্রহ করা সম্ভব।
            </p>
            <div className="bg-[#FAF8FE] border border-[#EDE8F9] rounded-2xl p-4 sm:p-5 text-[14px] text-[#4A4269] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#7C3AED]">
                <ImageIcon className="w-4 h-4" />
                <span>ফটো স্ট্যাটাস ব্যবহারের সুবিধাসমূহ:</span>
              </div>
              <p>
                • লেখা এবং ব্যাকগ্রাউন্ড ইমেজের পারফেক্ট ম্যাচিং যা দর্শকের দৃষ্টি আকর্ষণ করে তাৎক্ষণিকভাবে।<br />
                • ফটো এডিটিং অ্যাপে সময় নষ্ট না করে সরাসরি রেডিমেড কোট ইমেজ ডাউনলোড ও পোস্ট করার সুবিধা।<br />
                • ইনস্টাগ্রাম গ্রিড ও স্টোরির জন্য অপ্টিমাইজড রেজোলিউশন ও দৃষ্টিনন্দন টাইপোগ্রাফি।
              </p>
            </div>
          </div>

          <div className="h-px bg-[#F0ECFA]" />

          {/* Section 3: Viral Reach & Hashtags Strategy */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-[#181135] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#F3EEFE] text-[#7C3AED] font-black text-[13px] flex items-center justify-center shrink-0">
                ০৩
              </span>
              <span>অর্গানিক রিচ ও ট্রেন্ডিং ভাইরাল হ্যাশট্যাগ (#Hashtags)</span>
            </h3>
            <p>
              অ্যালগরিদমের চোখে আপনার পোস্টটি পৌঁছে দিতে হ্যাশট্যাগ অত্যন্ত গুরুত্বপূর্ণ ভূমিকা রাখে। আমাদের প্রতিটি ক্যাপশনের সঙ্গে রয়েছে গবেষণা-ভিত্তিক ট্রেন্ডিং হ্যাশট্যাগ। <strong className="text-[#181135]">&quot;+ট্যাগসহ কপি&quot;</strong> বাটনে ক্লিক করে আপনি এক ক্লিকেই সম্পূর্ণ ক্যাপশনটি প্রাসঙ্গিক হ্যাশট্যাগসহ কপি করে নিতে পারবেন, যা কোনো বাড়তি পরিশ্রম ছাড়াই ফেসবুক সার্চ ও ইনস্টাগ্রাম এক্সপ্লোর পেজে আপনার কন্টেন্টের দৃশ্যমানতা বৃদ্ধি করবে।
            </p>
          </div>

          <div className="h-px bg-[#F0ECFA]" />

          {/* Section 4: Fast Copy & Offline Storage */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-[#181135] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#F3EEFE] text-[#7C3AED] font-black text-[13px] flex items-center justify-center shrink-0">
                ০৪
              </span>
              <span>১-ক্লিকে ইনস্ট্যান্ট কপি এবং অফলাইন বুকমার্কিং</span>
            </h3>
            <p>
              কোনো সাইন-আপ বা ব্যক্তিগত তথ্যের ঝামেলা ছাড়াই আমাদের প্ল্যাটফর্মটি পুরোপুরি উন্মুক্ত। আপনার পছন্দের ক্যাপশন বা ইমেজগুলো বুকমার্ক আইকনে ক্লিক করে সরাসরি ব্রাউজারের লোকাল ক্যাশে সংরক্ষণ করে রাখতে পারেন, যাতে ইন্টারনেট সংযোগ ছাড়াও পরবর্তীতে যেকোনো সময় তা ব্যবহার করা যায়।
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-[#F0ECFA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-[#635B80]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>১০০% ফ্রি, দ্রুতগতি ও মোবাইল অপ্টিমাইজড ক্রিয়েটর টুল</span>
          </div>
          <span className="text-[#8E87A8]">কপিরাইট ফ্রি সোশ্যাল মিডিয়া ক্যাপশন ও ইমেজ রিসোর্স</span>
        </div>
      </section>
    </div>
  );
}
