'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { DescriptionAnalysis } from '@/lib/youtube/types';
import { formatNumber } from '@/lib/formatters/number';
import {
  FileText,
  Copy,
  Check,
  Download,
  Clock,
  Link as LinkIcon,
  Hash,
  Search,
  ExternalLink,
  Eye,
  Info,
  Type,
  AlignLeft,
  Calendar,
} from 'lucide-react';

export function DescriptionViewerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DescriptionAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'timestamps' | 'links' | 'hashtags'>('text');
  const [searchQuery, setSearchQuery] = useState('');

  // Copy states
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTimestamps, setCopiedTimestamps] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleFetch = async (input: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setSearchQuery('');
    setActiveTab('text');

    try {
      const res = await fetch('/api/youtube/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to extract video description.');
      }

      setData(json.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to extract YouTube description. Please verify the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDescription = () => {
    if (!data?.description) return;
    navigator.clipboard.writeText(data.description);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!data?.description) return;
    const blob = new Blob([data.description], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `youtube-description-${data.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyTimestamps = () => {
    if (!data?.timestamps?.length) return;
    const text = data.timestamps.map((t) => `${t.timestamp} - ${t.label}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedTimestamps(true);
    setTimeout(() => setCopiedTimestamps(false), 2000);
  };

  const handleCopyLinks = () => {
    if (!data?.links?.length) return;
    const text = data.links.map((l) => l.url).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLinks(true);
    setTimeout(() => setCopiedLinks(false), 2000);
  };

  const handleCopyHashtags = () => {
    if (!data?.hashtags?.length) return;
    const text = data.hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  // Search filter for description lines
  const filteredLines = useMemo(() => {
    if (!data?.description) return [];
    const lines = data.description.split('\n');
    if (!searchQuery.trim()) return lines;
    return lines.filter((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="description-viewer-form"
          placeholder="Paste YouTube video or channel link (e.g. youtube.com/watch?v=...)"
          buttonText="Extract Description"
          loadingText="Extracting video metadata &amp; description..."
          isLoading={loading}
          onSubmit={handleFetch}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[13px] text-[#5B6169]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D6293C]" />
            <span>Instantly copy or download complete descriptions, chapters, and links.</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#5B6169]">Try sample:</span>
            <button
              type="button"
              onClick={() => handleFetch('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
              className="text-[#D6293C] font-semibold hover:underline cursor-pointer"
            >
              Rick Astley
            </button>
            <span className="text-[#E8E7E3]">•</span>
            <button
              type="button"
              onClick={() => handleFetch('https://www.youtube.com/watch?v=jNQXAC9IVRw')}
              className="text-[#D6293C] font-semibold hover:underline cursor-pointer"
            >
              First YouTube Video
            </button>
          </div>
        </div>
      </div>

      {loading && <ToolLoading message="Retrieving video metadata and full description..." />}

      {error && (
        <ToolError
          title="Extraction Error"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Target Video Card */}
          <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row gap-5 items-start">
            <div className="relative w-full md:w-[220px] aspect-video bg-[#16181C] shrink-0 overflow-hidden border border-[#E8E7E3]">
              {data.thumbnail ? (
                <Image
                  src={data.thumbnail}
                  alt={data.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#5B6169]">
                  <FileText className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Source Video
                </span>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#16181C] leading-snug line-clamp-2">
                  {data.title}
                </h2>
                <div className="text-[14px] text-[#5B6169]">
                  Channel: <span className="text-[#16181C] font-semibold">{data.author}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[12px]">
                {data.viewCount !== undefined && data.viewCount !== null && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] font-medium text-[#16181C]">
                    <Eye className="w-3.5 h-3.5 text-[#5B6169]" />
                    <span>{formatNumber(data.viewCount)} Views</span>
                  </div>
                )}
                {data.publishedAt && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] font-medium text-[#5B6169]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Published: {data.publishedAt}</span>
                  </div>
                )}
                <a
                  href={`https://www.youtube.com/watch?v=${data.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] font-semibold text-[#16181C] hover:text-[#D6293C] transition-colors cursor-pointer"
                >
                  <span>Open Video</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* 4 Key Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Characters */}
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Characters</span>
                <Type className="w-4 h-4 text-[#D6293C]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {formatNumber(data.stats.characters)}
              </div>
              <div className="text-[12px] text-[#5B6169]">
                {data.stats.charLimitPercentage}% of 5,000 max limit
              </div>
            </div>

            {/* Words & Lines */}
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Word Count</span>
                <AlignLeft className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {formatNumber(data.stats.words)}
              </div>
              <div className="text-[12px] text-[#5B6169]">
                Across {formatNumber(data.stats.lines)} lines
              </div>
            </div>

            {/* Chapters / Timestamps */}
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Timestamps</span>
                <Clock className="w-4 h-4 text-[#1E9E6B]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {data.timestamps.length}
              </div>
              <div className="text-[12px] text-[#5B6169]">
                {data.timestamps.length > 0 ? 'Video chapters detected' : 'No chapters found'}
              </div>
            </div>

            {/* Links & Hashtags */}
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Links &amp; Tags</span>
                <LinkIcon className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {data.links.length} <span className="text-[14px] text-[#5B6169] font-normal">links</span>
              </div>
              <div className="text-[12px] text-[#5B6169]">
                {data.hashtags.length} hashtags detected
              </div>
            </div>
          </div>

          {/* Main Description Box & Action Bar */}
          <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs space-y-4">
            {/* Action Bar Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8E7E3] pb-4">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer border ${
                    activeTab === 'text'
                      ? 'bg-[#D6293C] text-white border-[#D6293C]'
                      : 'bg-[#F9F9F8] text-[#5B6169] border-[#E8E7E3] hover:text-[#16181C]'
                  }`}
                >
                  Full Description ({formatNumber(data.stats.characters)} chars)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('timestamps')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer border ${
                    activeTab === 'timestamps'
                      ? 'bg-[#D6293C] text-white border-[#D6293C]'
                      : 'bg-[#F9F9F8] text-[#5B6169] border-[#E8E7E3] hover:text-[#16181C]'
                  }`}
                >
                  Chapters ({data.timestamps.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('links')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer border ${
                    activeTab === 'links'
                      ? 'bg-[#D6293C] text-white border-[#D6293C]'
                      : 'bg-[#F9F9F8] text-[#5B6169] border-[#E8E7E3] hover:text-[#16181C]'
                  }`}
                >
                  Extracted Links ({data.links.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('hashtags')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer border ${
                    activeTab === 'hashtags'
                      ? 'bg-[#D6293C] text-white border-[#D6293C]'
                      : 'bg-[#F9F9F8] text-[#5B6169] border-[#E8E7E3] hover:text-[#16181C]'
                  }`}
                >
                  Hashtags ({data.hashtags.length})
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyDescription}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-semibold text-[#16181C] hover:bg-[#F0EFEB] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedDesc ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                      <span className="text-[#1E9E6B]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>Copy Description</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D6293C] text-white text-[12px] font-semibold hover:bg-[#B81E2F] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Full Description */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                {/* Search Bar inside description */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#5B6169] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords or links inside this description..."
                    className="w-full pl-9 pr-4 py-2 bg-[#F9F9F8] border border-[#E8E7E3] text-[13px] text-[#16181C] placeholder-[#8F9499] focus:outline-none focus:border-[#D6293C] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#5B6169] hover:text-[#16181C]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Pre-formatted Text Box */}
                {data.description ? (
                  <div className="relative bg-[#FAFAF9] border border-[#E8E7E3] p-4 sm:p-5 max-h-[500px] overflow-y-auto font-mono text-[13px] leading-relaxed text-[#16181C] whitespace-pre-wrap select-text selection:bg-[#D6293C]/20">
                    {searchQuery ? (
                      filteredLines.length > 0 ? (
                        filteredLines.join('\n')
                      ) : (
                        <span className="text-[#5B6169] italic">
                          No matching lines found for &quot;{searchQuery}&quot;.
                        </span>
                      )
                    ) : (
                      data.description
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#5B6169] bg-[#FAFAF9] border border-[#E8E7E3]">
                    This video has no description provided by the creator.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Chapters / Timestamps */}
            {activeTab === 'timestamps' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#5B6169]">
                    Timestamps automatically extracted from the description:
                  </p>
                  {data.timestamps.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyTimestamps}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-semibold text-[#16181C] hover:bg-[#F0EFEB] transition-colors cursor-pointer"
                    >
                      {copiedTimestamps ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                          <span className="text-[#1E9E6B]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
                          <span>Copy All Chapters</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {data.timestamps.length > 0 ? (
                  <div className="border border-[#E8E7E3] divide-y divide-[#E8E7E3] bg-[#FAFAF9]">
                    {data.timestamps.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 text-[13px] hover:bg-white transition-colors"
                      >
                        <span className="font-mono font-bold text-[#D6293C] bg-[#D6293C]/10 px-2 py-0.5 border border-[#D6293C]/20 shrink-0">
                          {t.timestamp}
                        </span>
                        <span className="text-[#16181C] font-medium flex-1">{t.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#5B6169] bg-[#FAFAF9] border border-[#E8E7E3]">
                    No timestamps or chapter markers were detected in this video description.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Extracted Links */}
            {activeTab === 'links' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#5B6169]">
                    External links and social media URLs found in the description:
                  </p>
                  {data.links.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyLinks}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-semibold text-[#16181C] hover:bg-[#F0EFEB] transition-colors cursor-pointer"
                    >
                      {copiedLinks ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                          <span className="text-[#1E9E6B]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
                          <span>Copy All Links</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {data.links.length > 0 ? (
                  <div className="border border-[#E8E7E3] divide-y divide-[#E8E7E3] bg-[#FAFAF9]">
                    {data.links.map((linkItem, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 text-[13px] hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <LinkIcon className="w-3.5 h-3.5 text-[#5B6169] shrink-0" />
                          <span className="text-[11px] font-bold uppercase text-[#5B6169] bg-[#E8E7E3]/60 px-1.5 py-0.5 shrink-0">
                            {linkItem.domain}
                          </span>
                          <span className="text-[#16181C] truncate select-all">{linkItem.url}</span>
                        </div>

                        <a
                          href={linkItem.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center gap-1 text-[12px] text-[#2563EB] hover:underline shrink-0"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#5B6169] bg-[#FAFAF9] border border-[#E8E7E3]">
                    No external URLs or links were found in this description.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Hashtags */}
            {activeTab === 'hashtags' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#5B6169]">
                    Hashtags detected in the description:
                  </p>
                  {data.hashtags.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyHashtags}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-semibold text-[#16181C] hover:bg-[#F0EFEB] transition-colors cursor-pointer"
                    >
                      {copiedHashtags ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                          <span className="text-[#1E9E6B]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
                          <span>Copy All Hashtags</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {data.hashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-4 bg-[#FAFAF9] border border-[#E8E7E3]">
                    {data.hashtags.map((h, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E7E3] text-[13px] font-medium text-[#D6293C]"
                      >
                        <Hash className="w-3 h-3 text-[#5B6169]" />
                        <span>{h.replace(/^#/, '')}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#5B6169] bg-[#FAFAF9] border border-[#E8E7E3]">
                    No hashtags (#tag) were included in this video description.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] flex items-start gap-3 text-[13px] text-[#5B6169] leading-relaxed">
            <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#16181C]">Creator Tip:</span>
              <p>
                YouTube allows up to 5,000 characters in video descriptions. The first 2–3 lines (approx. 100–150 characters) appear above the &quot;Show More&quot; fold in search results and mobile apps, making them the most valuable for SEO keywords and primary calls-to-action.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
