'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  Bookmark,
  Hash,
  Download,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { CaptionCategory, CaptionItem } from '@/lib/constants/captions';
import { useSavedItems, toggleSavedItem, isItemSaved } from '@/lib/saved-items/storage';

interface SingleCaptionViewProps {
  caption: CaptionItem;
  category: CaptionCategory;
  relatedCaptions: CaptionItem[];
}

export function SingleCaptionView({
  caption,
  category,
  relatedCaptions,
}: SingleCaptionViewProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const saved = isItemSaved('captions-hub', `caption-${caption.id}`);

  const fullTextWithTags = caption.tags && caption.tags.length > 0
    ? `${caption.text}\n\n${caption.tags.join(' ')}`
    : caption.text;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(caption.text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyWithTags = async () => {
    try {
      await navigator.clipboard.writeText(fullTextWithTags);
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleBookmark = () => {
    toggleSavedItem({
      id: `caption-${caption.id}`,
      toolId: 'captions-hub',
      toolName: 'Bangla & English Captions',
      category: category.id.toUpperCase(),
      targetType: 'CAPTION',
      title: caption.title || caption.text.slice(0, 70),
      url: `/captions/${category.id}/${caption.slug || caption.id}`,
      metaText: caption.language === 'bangla' ? 'বাংলা ক্যাপশন' : 'English Caption',
      badgeType: 'neutral',
      summary: caption.tags?.join(' ') || '',
    });
  };

  const handleDownloadImage = async () => {
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

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnWhatsApp = () => {
    const text = `${caption.text}\n\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Back to Category Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/captions/${category.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{category.banglaName} ক্যাপশন লিস্টে ফিরে যান</span>
        </Link>
        <span className="text-xs text-[#827A9E]">
          URL Slug: <code className="bg-[#F4F1FA] text-[#635B80] px-1.5 py-0.5 rounded text-[11px]">/{caption.slug || caption.id}</code>
        </span>
      </div>

      {/* Main Single Post Card */}
      <article className="bg-white border border-[#EDE8F9] rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6">
        {/* Header Tags & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F4F1FA] pb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.banglaName}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F4F1FA] text-[#635B80] uppercase">
              {caption.language === 'bangla' ? 'বাংলা' : 'English'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border text-sm font-medium transition-all ${
                saved
                  ? 'bg-[#EDE9FE] border-[#C4B5FD] text-[#7C3AED]'
                  : 'bg-white border-[#EDE8F9] text-[#635B80] hover:bg-[#FAF8FE]'
              }`}
              title={saved ? 'সংরক্ষিত' : 'সেভ করুন'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-[#EDE8F9] text-[#635B80] hover:bg-[#FAF8FE] text-sm transition-all"
              title="পোস্টের লিংক কপি করুন"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title if present */}
        {caption.title && (
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181135] leading-tight">
            {caption.title}
          </h1>
        )}

        {/* Hosted Image if present */}
        {caption.imageUrl && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-[#EDE8F9] bg-[#FAF8FE] max-h-[540px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={caption.imageUrl}
                alt={caption.title || caption.text.slice(0, 50)}
                className="w-full h-auto max-h-[520px] object-contain"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleDownloadImage}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8FE] border border-[#DDD0FA] text-xs font-bold text-[#7C3AED] hover:bg-[#F3EEFC] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ছবি ডাউনলোড করুন (HD)</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Caption Content Body */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FCFCFB] border border-[#F0ECFA]">
          <p className="text-lg sm:text-2xl font-medium text-[#181135] leading-relaxed whitespace-pre-line select-text">
            {caption.text}
          </p>
        </div>

        {/* Hashtags */}
        {caption.tags && caption.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Hash className="w-4 h-4 text-[#7C3AED]" />
            {caption.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-[#7C3AED] bg-[#F5F3FF] border border-[#EDE9FE] px-2.5 py-1 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#F4F1FA] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7C3AED] text-white text-sm font-bold shadow-xs hover:bg-[#6D28D9] transition-all cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>ক্যাপশন কপি করুন</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyWithTags}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#DDD0FA] text-[#7C3AED] text-sm font-bold hover:bg-[#FAF8FE] transition-all cursor-pointer"
            >
              {copiedTags ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>ট্যাগসহ কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4" />
                  <span>+ট্যাগসহ কপি</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#827A9E] mr-1">শেয়ার করুন:</span>
            <button
              onClick={shareOnWhatsApp}
              className="px-3 py-2 rounded-xl bg-[#E8F8F0] text-[#059669] text-xs font-bold hover:bg-[#D4F2E2] transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={shareOnFacebook}
              className="px-3 py-2 rounded-xl bg-[#EBF3FF] text-[#1877F2] text-xs font-bold hover:bg-[#D9E9FF] transition-colors"
            >
              Facebook
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-[#F4F1FA] text-[#635B80] text-xs font-bold hover:bg-[#EDE9FE] transition-colors"
            >
              {copiedUrl ? 'কপি হয়েছে!' : 'লিংক কপি'}
            </button>
          </div>
        </div>
      </article>

      {/* Related Captions from Category */}
      {relatedCaptions.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[#181135]">
              {category.banglaName} ক্যাটাগরির আরও জনপ্রিয় ক্যাপশন
            </h2>
            <Link
              href={`/captions/${category.id}`}
              className="text-xs font-bold text-[#7C3AED] hover:underline"
            >
              সবগুলো দেখুন &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedCaptions.slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                className="bg-white border border-[#EDE8F9] rounded-2xl p-5 hover:border-[#C4B5FD] transition-all space-y-3"
              >
                <p className="text-sm text-[#181135] line-clamp-3 leading-relaxed">
                  {rel.text}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#F8F7FC] text-xs">
                  <span className="text-[#827A9E]">
                    {rel.language === 'bangla' ? 'বাংলা' : 'English'}
                  </span>
                  <Link
                    href={`/captions/${category.id}/${rel.slug || rel.id}`}
                    className="font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    <span>ক্যাপশন দেখুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
