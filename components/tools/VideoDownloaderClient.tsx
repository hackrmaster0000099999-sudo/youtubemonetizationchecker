'use client';

import React, { useState } from 'react';
import {
  Search,
  Download,
  Copy,
  Check,
  Film,
  Music,
  Sparkles,
  AlertCircle,
  Play,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  HardDrive,
  Eye,
} from 'lucide-react';
import { VideoDownloadOption, VideoDownloadResult } from '@/lib/youtube/types';
import { useSavedItems } from '@/lib/saved-items/storage';
import Link from 'next/link';

const EXAMPLE_VIDEOS = [
  {
    title: '4K Nature Relax (Sample)',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    label: '4K Nature 60fps',
  },
  {
    title: 'Lofi Hip Hop Beat',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    label: 'Lofi Music Stream',
  },
  {
    title: 'Short Cinematic Video',
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    label: 'Big Buck Bunny',
  },
];

export function VideoDownloaderClient() {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoDownloadResult | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'mp4' | 'webm' | 'audio'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const { isSaved, save, remove } = useSavedItems();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const handleLookup = async (urlToFetch?: string) => {
    const targetUrl = (urlToFetch || inputUrl).trim();
    if (!targetUrl) {
      setError('Please paste a YouTube video URL or Video ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setShowPlayer(false);

    try {
      const res = await fetch('/api/youtube/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to analyze video. Please check the URL.');
        setResult(null);
      } else if (data.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred while connecting to the server. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
        handleLookup(text);
      }
    } catch {
      // Clipboard permissions
    }
  };

  const filteredOptions = result?.options.filter((opt) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mp4') return opt.extension === 'mp4';
    if (activeTab === 'webm') return opt.extension === 'webm';
    if (activeTab === 'audio') return opt.type === 'audio';
    return true;
  });

  const isVideoSaved = result ? isSaved('video-downloader', result.video.id) : false;

  const handleToggleSave = () => {
    if (!result) return;
    const saveId = `video-downloader_${result.video.id}`;
    if (isVideoSaved) {
      remove(saveId);
    } else {
      save({
        id: saveId,
        toolId: 'video-downloader',
        toolName: 'YouTube Video Downloader',
        targetType: 'VIDEO',
        title: result.video.title,
        handle: result.video.channelTitle,
        avatarUrl: result.video.thumbnail,
        url: `https://www.youtube.com/watch?v=${result.video.id}`,
        category: 'Video',
        metaText: `${result.video.duration} • Ready`,
        badgeType: 'neutral',
        summary: `${result.options.length} download qualities available`,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Box Card */}
      <div className="p-6 md:p-8 bg-white border border-[#EDE8F9] rounded-3xl shadow-xs space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="video-url-input" className="block text-[14px] font-bold text-[#181135]">
              Paste YouTube Video or Shorts URL
            </label>
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  id="video-url-input"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g., https://www.youtube.com/watch?v=LXb3EKWsInQ or Shorts URL"
                  className="w-full h-12 pl-11 pr-24 text-[15px] text-[#181135] placeholder:text-[#8E87A8] bg-[#FAF8FF] border border-[#DDD0FA] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 rounded-2xl outline-hidden transition-all"
                />
                <Film className="w-5 h-5 text-[#8E87A8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                {inputUrl ? (
                  <button
                    type="button"
                    onClick={() => setInputUrl('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#8E87A8] hover:text-[#181135] px-2 py-1 bg-white border border-[#EDE8F9] rounded-lg transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#7C3AED] hover:text-[#6D28D9] px-2 py-1 bg-[#F2ECFE] hover:bg-[#EAE0FD] border border-[#DDD0FA] rounded-lg transition-colors cursor-pointer"
                  >
                    Paste
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !inputUrl.trim()}
                className="h-12 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-[#C4B5FD] text-white font-bold text-[15px] rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Formats...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Get Video Downloads</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[13px] text-[#635B80]">
            <span className="font-semibold text-[#181135]">Try an example:</span>
            {EXAMPLE_VIDEOS.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputUrl(ex.url);
                  handleLookup(ex.url);
                }}
                className="px-3 py-1 bg-[#F2ECFE] hover:bg-[#EAE0FD] border border-[#DDD0FA] text-[#7C3AED] font-medium rounded-xl text-[12px] transition-colors cursor-pointer"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl text-[14px] text-[#DC2626] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#DC2626] mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold">Could not fetch video details</strong>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Download Results Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Video Overview Card */}
          <div className="p-6 md:p-8 bg-white border border-[#EDE8F9] rounded-3xl shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Thumbnail / Player Box */}
              <div className="w-full lg:w-[360px] shrink-0 space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#EDE8F9] shadow-inner group">
                  {showPlayer ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${result.video.id}?autoplay=1&rel=0`}
                      title={result.video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <>
                      <img
                        src={result.video.thumbnail}
                        alt={result.video.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPlayer(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group-hover:scale-105 cursor-pointer"
                        aria-label="Play video preview"
                      >
                        <div className="w-14 h-14 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                          <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </div>
                      </button>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/80 text-white font-mono text-[12px] font-bold rounded-md">
                        {result.video.duration}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPlayer(!showPlayer)}
                    className="text-[13px] font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1.5 px-3 py-1.5 bg-[#F2ECFE] rounded-xl transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{showPlayer ? 'Close Player' : 'Play Preview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`text-[13px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                      isVideoSaved
                        ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                        : 'bg-white border-[#EDE8F9] text-[#635B80] hover:text-[#181135]'
                    }`}
                  >
                    {isVideoSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    <span>{isVideoSaved ? 'Saved' : 'Save for Later'}</span>
                  </button>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2ECFE] text-[12px] font-bold text-[#7C3AED]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{result.options.length} Direct Download Formats Available</span>
                  </div>
                  <h2 className="text-[20px] md:text-[24px] font-bold text-[#181135] leading-snug break-words">
                    {result.video.title}
                  </h2>
                </div>

                {/* Channel & Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF8FF] border border-[#EDE8F9] rounded-2xl text-[13px]">
                  <div>
                    <span className="text-[#8E87A8] block text-[11px] font-bold uppercase tracking-wider">Channel</span>
                    <span className="font-bold text-[#181135] truncate block">{result.video.channelTitle}</span>
                  </div>
                  <div>
                    <span className="text-[#8E87A8] block text-[11px] font-bold uppercase tracking-wider">Duration</span>
                    <span className="font-bold text-[#181135]">{result.video.duration} ({result.video.durationSeconds}s)</span>
                  </div>
                  <div>
                    <span className="text-[#8E87A8] block text-[11px] font-bold uppercase tracking-wider">Public Views</span>
                    <span className="font-bold text-[#181135]">{result.video.viewCountText || 'Available'}</span>
                  </div>
                </div>

                {/* Quick Copy actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(result.video.id, 'vid-id')}
                    className="px-3 py-1.5 bg-white hover:bg-[#FAF8FF] border border-[#EDE8F9] text-[#181135] text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === 'vid-id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8E87A8]" />}
                    <span>Video ID: {result.video.id}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(`https://www.youtube.com/watch?v=${result.video.id}`, 'clean-url')}
                    className="px-3 py-1.5 bg-white hover:bg-[#FAF8FF] border border-[#EDE8F9] text-[#181135] text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === 'clean-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8E87A8]" />}
                    <span>Copy Clean URL</span>
                  </button>

                  <Link
                    href={`/thumbnail-downloader?url=https://www.youtube.com/watch?v=${result.video.id}`}
                    className="px-3 py-1.5 bg-[#F2ECFE] hover:bg-[#EAE0FD] text-[#7C3AED] text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get 1080p Thumbnail</span>
                  </Link>

                  <Link
                    href={`/private-viewer?url=https://www.youtube.com/watch?v=${result.video.id}`}
                    className="px-3 py-1.5 bg-[#F2ECFE] hover:bg-[#EAE0FD] text-[#7C3AED] text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Watch Privately</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution & Format Selection Cards */}
          <div className="space-y-6">
            {/* Filter Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE8F9]">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-[#181135] flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#7C3AED]" />
                  <span>Choose Resolution &amp; Download Instantly</span>
                </h3>
                <p className="text-[13px] text-[#635B80]">
                  Click any button to directly download the video or audio file to your device with exact MB sizes.
                </p>
              </div>

              {/* Format Switcher Pills */}
              <div className="flex items-center gap-1 p-1 bg-[#F2ECFE] rounded-2xl border border-[#DDD0FA] self-start sm:self-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 text-[13px] font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-[#7C3AED] shadow-2xs'
                      : 'text-[#635B80] hover:text-[#181135]'
                  }`}
                >
                  All ({result.options.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mp4')}
                  className={`px-3.5 py-1.5 text-[13px] font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'mp4'
                      ? 'bg-white text-[#7C3AED] shadow-2xs'
                      : 'text-[#635B80] hover:text-[#181135]'
                  }`}
                >
                  MP4 Video
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('webm')}
                  className={`px-3.5 py-1.5 text-[13px] font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'webm'
                      ? 'bg-white text-[#7C3AED] shadow-2xs'
                      : 'text-[#635B80] hover:text-[#181135]'
                  }`}
                >
                  WEBM
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('audio')}
                  className={`px-3.5 py-1.5 text-[13px] font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'audio'
                      ? 'bg-white text-[#7C3AED] shadow-2xs'
                      : 'text-[#635B80] hover:text-[#181135]'
                  }`}
                >
                  Audio (MP3)
                </button>
              </div>
            </div>

            {/* Formats Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOptions && filteredOptions.map((opt) => {
                const downloadHref = `/api/youtube/download?id=${result.video.id}&quality=${opt.quality}&format=${opt.extension}&title=${encodeURIComponent(result.video.title)}`;

                return (
                  <div
                    key={opt.id}
                    className={`p-5 bg-white border rounded-2xl transition-all hover:border-[#7C3AED]/40 hover:shadow-md flex flex-col justify-between space-y-4 ${
                      opt.isPopular
                        ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/10 bg-gradient-to-b from-white to-[#FAF8FF]'
                        : 'border-[#EDE8F9]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[17px] font-bold text-[#181135]">{opt.label}</span>
                            {opt.isPopular && (
                              <span className="px-2 py-0.5 bg-[#7C3AED] text-white text-[10px] font-black rounded-md tracking-wider">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-[#635B80]">
                            <span className="font-mono-data bg-[#F2ECFE] text-[#7C3AED] px-1.5 py-0.5 rounded font-bold uppercase">
                              {opt.extension}
                            </span>
                            <span>•</span>
                            <span>{opt.resolution}</span>
                          </div>
                        </div>

                        {/* File Size Highlight Badge */}
                        <div className="text-right shrink-0">
                          <div className="px-2.5 py-1 bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] font-mono-data font-black text-[14px] rounded-xl">
                            {opt.sizeFormatted}
                          </div>
                          <span className="text-[10px] text-[#8E87A8] block mt-0.5 font-medium">Est. File Size</span>
                        </div>
                      </div>

                      {/* Specs description */}
                      <div className="p-3 bg-[#FAF8FF] border border-[#EDE8F9] rounded-xl text-[12px] text-[#635B80] space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Codec &amp; Bitrate:</span>
                          <span className="font-semibold text-[#181135]">{opt.codec} ({opt.bitrateKbps} kbps)</span>
                        </div>
                        {opt.fps && (
                          <div className="flex items-center justify-between">
                            <span>Frame Rate:</span>
                            <span className="font-semibold text-[#181135]">{opt.fps} FPS</span>
                          </div>
                        )}
                        {opt.note && (
                          <div className="text-[11px] text-[#7C3AED] font-medium pt-1 border-t border-[#EDE8F9]">
                            {opt.note}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Direct 1-Click Native Anchor Action Button - 100% immune to Popup Blockers */}
                    <div className="pt-2 border-t border-[#EDE8F9] flex items-center gap-2">
                      <a
                        href={downloadHref}
                        download={`${result.video.title}.${opt.extension}`}
                        className="flex-1 h-11 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs no-underline"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download {opt.extension.toUpperCase()} ({opt.sizeFormatted})</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopy(`${result.video.title} - ${opt.label} (${opt.sizeFormatted})`, `opt-${opt.id}`)}
                        title="Copy format info"
                        className="w-11 h-11 bg-white hover:bg-[#FAF8FF] border border-[#EDE8F9] text-[#635B80] hover:text-[#181135] rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      >
                        {copiedId === `opt-${opt.id}` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Format Comparison Matrix Table */}
          <div className="p-6 md:p-8 bg-white border border-[#EDE8F9] rounded-3xl shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-[18px] font-bold text-[#181135] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#7C3AED]" />
                <span>Format &amp; File Size Comparison Table</span>
              </h3>
              <p className="text-[13px] text-[#635B80]">
                Click &quot;Download&quot; on any line to immediately trigger direct file saving.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#EDE8F9]">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#FAF8FF] border-b border-[#EDE8F9] text-[#635B80] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Resolution / Tier</th>
                    <th className="py-3 px-4">Container</th>
                    <th className="py-3 px-4">Dimensions</th>
                    <th className="py-3 px-4">Codec</th>
                    <th className="py-3 px-4">Bitrate</th>
                    <th className="py-3 px-4 text-right">Estimated Size (MB)</th>
                    <th className="py-3 px-4 text-right">Direct Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE8F9] text-[#181135]">
                  {result.options.map((opt) => (
                    <tr key={`tbl-${opt.id}`} className="hover:bg-[#FAF8FF] transition-colors">
                      <td className="py-3 px-4 font-bold flex items-center gap-2">
                        {opt.type === 'audio' ? (
                          <Music className="w-4 h-4 text-[#7C3AED]" />
                        ) : (
                          <Film className="w-4 h-4 text-[#7C3AED]" />
                        )}
                        <span>{opt.label}</span>
                      </td>
                      <td className="py-3 px-4 font-mono uppercase font-bold text-[#7C3AED]">
                        {opt.extension}
                      </td>
                      <td className="py-3 px-4 text-[#635B80]">{opt.resolution}</td>
                      <td className="py-3 px-4 text-[#635B80]">{opt.codec}</td>
                      <td className="py-3 px-4 text-[#635B80]">{opt.bitrateKbps} kbps</td>
                      <td className="py-3 px-4 text-right font-mono-data font-bold text-[#7C3AED]">
                        {opt.sizeFormatted}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/api/youtube/download?id=${result.video.id}&quality=${opt.quality}&format=${opt.extension}&title=${encodeURIComponent(result.video.title)}`}
                          download={`${result.video.title}.${opt.extension}`}
                          className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-[12px] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs no-underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save {opt.extension.toUpperCase()}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
