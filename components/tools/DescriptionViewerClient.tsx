'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { SaveButton } from '@/components/common/SaveButton';
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
  const [inputValue, setInputValue] = useState('');
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
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="description-viewer-form"
          initialValue={inputValue}
          placeholder="Paste YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="Extract Description"
          loadingText="Extracting video metadata &amp; description..."
          isLoading={loading}
          onSubmit={handleFetch}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <FileText className="w-4 h-4 text-[#7C3AED]" />
          <span>Instantly copy or download complete descriptions, chapters, and links.</span>
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
          <div className="tool-card-3d p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start">
            <div className="relative w-full md:w-[220px] aspect-video bg-[#181135] shrink-0 overflow-hidden rounded-2xl border border-[#EDE8F9] shadow-2xs">
              {data.thumbnail ? (
                <Image
                  src={data.thumbnail}
                  alt={data.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#635B80]">
                  <FileText className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                  Source Video
                </span>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#181135] leading-snug line-clamp-2">
                  {data.title}
                </h2>
                <div className="text-[14px] text-[#635B80]">
                  Channel: <span className="text-[#181135] font-semibold">{data.author}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[12px]">
                {data.viewCount !== undefined && data.viewCount !== null && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#EDE8F9] rounded-xl font-semibold text-[#181135] shadow-2xs">
                    <Eye className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>{formatNumber(data.viewCount)} Views</span>
                  </div>
                )}
                {data.publishedAt && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#EDE8F9] rounded-xl font-medium text-[#635B80] shadow-2xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Published: {data.publishedAt}</span>
                  </div>
                )}
                <SaveButton
                  item={{
                    id: `description_${data.id}`,
                    toolId: 'description-viewer',
                    toolName: 'Description Viewer',
                    category: 'SEO',
                    targetType: 'VIDEO',
                    title: data.title,
                    handle: data.author,
                    avatarUrl: data.thumbnail || undefined,
                    url: `https://www.youtube.com/watch?v=${data.id}`,
                    metaText: `${data.stats.characters} chars (${data.stats.words} words)`,
                    badgeType: 'neutral',
                    summary: `${data.timestamps?.length || 0} chapters • ${data.links?.length || 0} links • ${data.hashtags?.length || 0} hashtags`,
                  }}
                />

                <a
                  href={`https://www.youtube.com/watch?v=${data.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl font-semibold text-[#181135] hover:text-[#7C3AED] transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Open Video</span>
                  <ExternalLink className="w-3 h-3 text-[#7C3AED]" />
                </a>
              </div>
            </div>
          </div>

          {/* 4 Key Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Characters */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Characters</span>
                <Type className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {formatNumber(data.stats.characters)}
              </div>
              <div className="text-[12px] text-[#635B80]">
                {data.stats.charLimitPercentage}% of 5,000 max limit
              </div>
            </div>

            {/* Words & Lines */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Word Count</span>
                <AlignLeft className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {formatNumber(data.stats.words)}
              </div>
              <div className="text-[12px] text-[#635B80]">
                Across {formatNumber(data.stats.lines)} lines
              </div>
            </div>

            {/* Chapters / Timestamps */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Timestamps</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {data.timestamps.length}
              </div>
              <div className="text-[12px] text-[#635B80]">
                {data.timestamps.length > 0 ? 'Video chapters detected' : 'No chapters found'}
              </div>
            </div>

            {/* Links & Hashtags */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Links &amp; Tags</span>
                <LinkIcon className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {data.links.length} <span className="text-[14px] text-[#635B80] font-normal">links</span>
              </div>
              <div className="text-[12px] text-[#635B80]">
                {data.hashtags.length} hashtags detected
              </div>
            </div>
          </div>

          {/* Main Description Box & Action Bar */}
          <div className="tool-card-3d p-5 sm:p-6 space-y-4">
            {/* Action Bar Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EDE8F9] pb-4">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer rounded-xl border ${
                    activeTab === 'text'
                      ? 'btn-siampay-primary text-white border-transparent'
                      : 'bg-white/70 text-[#635B80] border-[#EDE8F9] hover:text-[#181135]'
                  }`}
                >
                  Full Description ({formatNumber(data.stats.characters)} chars)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('timestamps')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer rounded-xl border ${
                    activeTab === 'timestamps'
                      ? 'btn-siampay-primary text-white border-transparent'
                      : 'bg-white/70 text-[#635B80] border-[#EDE8F9] hover:text-[#181135]'
                  }`}
                >
                  Chapters ({data.timestamps.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('links')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer rounded-xl border ${
                    activeTab === 'links'
                      ? 'btn-siampay-primary text-white border-transparent'
                      : 'bg-white/70 text-[#635B80] border-[#EDE8F9] hover:text-[#181135]'
                  }`}
                >
                  Extracted Links ({data.links.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('hashtags')}
                  className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer rounded-xl border ${
                    activeTab === 'hashtags'
                      ? 'btn-siampay-primary text-white border-transparent'
                      : 'bg-white/70 text-[#635B80] border-[#EDE8F9] hover:text-[#181135]'
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl text-[12px] font-semibold text-[#181135] hover:border-[#7C3AED] transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  {copiedDesc ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Copy Description</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="btn-siampay-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white text-[12px] font-bold rounded-xl cursor-pointer whitespace-nowrap"
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
                  <Search className="w-4 h-4 text-[#635B80] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords or links inside this description..."
                    className="w-full pl-9 pr-4 py-2 bg-white/80 border border-[#EDE8F9] rounded-xl text-[13px] text-[#181135] placeholder-[#9E9E9E] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#635B80] hover:text-[#181135]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Pre-formatted Text Box */}
                {data.description ? (
                  <div className="relative bg-white/60 border border-[#EDE8F9] rounded-2xl p-4 sm:p-5 max-h-[500px] overflow-y-auto font-mono text-[13px] leading-relaxed text-[#181135] whitespace-pre-wrap select-text selection:bg-[#7C3AED]/20 shadow-2xs">
                    {searchQuery ? (
                      filteredLines.length > 0 ? (
                        filteredLines.join('\n')
                      ) : (
                        <span className="text-[#635B80] italic">
                          No matching lines found for &quot;{searchQuery}&quot;.
                        </span>
                      )
                    ) : (
                      data.description
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#635B80] bg-white/40 border border-[#EDE8F9] rounded-2xl">
                    This video has no description provided by the creator.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Chapters / Timestamps */}
            {activeTab === 'timestamps' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#635B80]">
                    Timestamps automatically extracted from the description:
                  </p>
                  {data.timestamps.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyTimestamps}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl text-[12px] font-semibold text-[#181135] hover:border-[#7C3AED] transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedTimestamps ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Copy All Chapters</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {data.timestamps.length > 0 ? (
                  <div className="border border-[#EDE8F9] divide-y divide-[#EDE8F9] bg-white/60 rounded-2xl overflow-hidden shadow-2xs">
                    {data.timestamps.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 text-[13px] hover:bg-white/80 transition-colors"
                      >
                        <span className="font-mono font-bold text-[#7C3AED] bg-[#EDE8F9] px-2 py-0.5 rounded-md border border-[#DDD0FA] shrink-0">
                          {t.timestamp}
                        </span>
                        <span className="text-[#181135] font-medium flex-1">{t.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#635B80] bg-white/40 border border-[#EDE8F9] rounded-2xl">
                    No timestamps or chapter markers were detected in this video description.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Extracted Links */}
            {activeTab === 'links' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#635B80]">
                    External links and social media URLs found in the description:
                  </p>
                  {data.links.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyLinks}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl text-[12px] font-semibold text-[#181135] hover:border-[#7C3AED] transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedLinks ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Copy All Links</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {data.links.length > 0 ? (
                  <div className="border border-[#EDE8F9] divide-y divide-[#EDE8F9] bg-white/60 rounded-2xl overflow-hidden shadow-2xs">
                    {data.links.map((linkItem, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 text-[13px] hover:bg-white/80 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <LinkIcon className="w-3.5 h-3.5 text-[#635B80] shrink-0" />
                          <span className="text-[11px] font-bold uppercase text-[#7C3AED] bg-[#EDE8F9] px-1.5 py-0.5 rounded shrink-0">
                            {linkItem.domain}
                          </span>
                          <span className="text-[#181135] truncate select-all">{linkItem.url}</span>
                        </div>

                        <a
                          href={linkItem.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center gap-1 text-[12px] text-[#7C3AED] font-semibold hover:underline shrink-0"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#635B80] bg-white/40 border border-[#EDE8F9] rounded-2xl">
                    No external URLs or links were found in this description.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Hashtags */}
            {activeTab === 'hashtags' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#635B80]">
                    Hashtags detected in the description:
                  </p>
                  {data.hashtags.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyHashtags}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl text-[12px] font-semibold text-[#181135] hover:border-[#7C3AED] transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedHashtags ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Copy All Hashtags</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {data.hashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-4 bg-white/60 border border-[#EDE8F9] rounded-2xl shadow-2xs">
                    {data.hashtags.map((h, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 border border-[#EDE8F9] rounded-xl text-[13px] font-semibold text-[#7C3AED] shadow-2xs"
                      >
                        <Hash className="w-3 h-3 text-[#7C3AED]" />
                        <span>{h.replace(/^#/, '')}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#635B80] bg-white/40 border border-[#EDE8F9] rounded-2xl">
                    No hashtags (#tag) were included in this video description.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Notice Card */}
          <div className="p-4.5 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl flex items-start gap-3 text-[13px] text-[#635B80] leading-relaxed shadow-2xs">
            <Info className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#181135]">Creator Tip:</span>
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
