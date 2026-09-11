'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { SaveButton } from '@/components/common/SaveButton';
import { HiddenVideoScanResult } from '@/lib/youtube/types';
import { formatNumber } from '@/lib/formatters/number';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Play,
  Copy,
  Check,
  ExternalLink,
  ListVideo,
  AlertCircle,
  HelpCircle,
  Search,
  FolderSearch,
} from 'lucide-react';

export function HiddenVideoFinderClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<HiddenVideoScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'unlisted' | 'private' | 'playlists'>('unlisted');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleScan = async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/youtube/scan-hidden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to scan channel for hidden videos.');
      }

      setResult(json.data);

      // Default to the most interesting tab
      if (json.data?.unlistedVideos?.length > 0) {
        setActiveTab('unlisted');
      } else if (json.data?.privateSlots?.length > 0) {
        setActiveTab('private');
      } else {
        setActiveTab('playlists');
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to complete scan. Please verify the channel or playlist link.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(videoId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="hidden-video-finder-form"
          initialValue={inputValue}
          placeholder="Enter YouTube Channel URL, @handle, or Playlist link to scan..."
          buttonText="Scan for Hidden Videos"
          loadingText="Scanning channel playlists and unlisted items..."
          isLoading={loading}
          onSubmit={handleScan}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <FolderSearch className="w-4 h-4 text-[#7C3AED]" />
          <span>Scans public playlists and collections to reveal unlisted videos.</span>
        </div>
      </div>

      {loading && (
        <ToolLoading message="Performing deep playlist inspection and querying YouTube API for unlisted video statuses..." />
      )}

      {error && (
        <ToolError
          title="Scan Error"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Target Profile Card */}
          <div className="tool-card-3d p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-14 h-14 bg-[#181135] shrink-0 overflow-hidden rounded-full border border-[#EDE8F9] shadow-2xs">
                {result.targetInfo.avatarOrThumb ? (
                  <Image
                    src={result.targetInfo.avatarOrThumb}
                    alt={result.targetInfo.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <ListVideo className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                  Target {result.targetType}
                </span>
                <h2 className="text-[18px] sm:text-[22px] font-bold text-[#181135] truncate">
                  {result.targetInfo.title}
                </h2>
                <div className="text-[13px] text-[#635B80]">
                  ID: <span className="font-mono text-[#181135]">{result.targetInfo.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SaveButton
                item={{
                  id: `hidden_${result.targetInfo.id}`,
                  toolId: 'hidden-video-finder',
                  toolName: 'Hidden Video Finder',
                  category: 'Channel',
                  targetType: result.targetType === 'PLAYLIST' ? 'PLAYLIST' : 'CHANNEL',
                  title: result.targetInfo.title,
                  handle: `@${result.targetInfo.id}`,
                  avatarUrl: result.targetInfo.avatarOrThumb || undefined,
                  url:
                    result.targetType === 'PLAYLIST'
                      ? `https://www.youtube.com/playlist?list=${result.targetInfo.id}`
                      : `https://www.youtube.com/channel/${result.targetInfo.id}`,
                  metaText: `${result.stats.unlistedCount} Unlisted • ${result.stats.privateSlotsCount} Private`,
                  badgeType: result.stats.unlistedCount > 0 ? 'warning' : 'neutral',
                  summary: `${result.stats.publicCount} public videos • ${result.stats.playlistsScanned} playlists scanned`,
                }}
              />

              <a
                href={
                  result.targetType === 'PLAYLIST'
                    ? `https://www.youtube.com/playlist?list=${result.targetInfo.id}`
                    : `https://www.youtube.com/channel/${result.targetInfo.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl text-[12px] font-semibold text-[#181135] hover:bg-white hover:text-[#7C3AED] transition-colors shadow-2xs cursor-pointer"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
              </a>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unlisted Videos Found */}
            <div
              className={`tool-card-3d p-5 space-y-1 ${
                result.stats.unlistedCount > 0
                  ? 'border-amber-400 bg-amber-500/10'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Unlisted Videos
                </span>
                <EyeOff
                  className={`w-4 h-4 ${
                    result.stats.unlistedCount > 0 ? 'text-amber-500' : 'text-[#635B80]'
                  }`}
                />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {result.stats.unlistedCount}
              </div>
              <div className="text-[12px] text-[#635B80]">
                {result.stats.unlistedCount > 0
                  ? 'Found in public playlists'
                  : 'None detected in playlists'}
              </div>
            </div>

            {/* Private Slots Locked */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Private Slots
                </span>
                <Lock className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#7C3AED] tracking-tight">
                {result.stats.privateSlotsCount}
              </div>
              <div className="text-[12px] text-[#635B80]">Locked or deleted by creator</div>
            </div>

            {/* Total Videos Scanned */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Videos Scanned
                </span>
                <Eye className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {formatNumber(result.stats.totalVideosScanned)}
              </div>
              <div className="text-[12px] text-[#635B80]">
                {result.stats.publicCount} public items checked
              </div>
            </div>

            {/* Playlists Inspected */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Playlists Scanned
                </span>
                <ListVideo className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {result.stats.playlistsScanned}
              </div>
              <div className="text-[12px] text-[#635B80]">Channel collections inspected</div>
            </div>
          </div>

          {/* Tab Navigation & Lists */}
          <div className="tool-card-3d p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#EDE8F9] pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('unlisted')}
                className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all cursor-pointer border ${
                  activeTab === 'unlisted'
                    ? 'btn-siampay-primary text-white border-transparent'
                    : 'bg-white/80 text-[#635B80] border-[#EDE8F9] hover:bg-white hover:text-[#181135]'
                }`}
              >
                Unlisted Videos ({result.unlistedVideos.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('private')}
                className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all cursor-pointer border ${
                  activeTab === 'private'
                    ? 'btn-siampay-primary text-white border-transparent'
                    : 'bg-white/80 text-[#635B80] border-[#EDE8F9] hover:bg-white hover:text-[#181135]'
                }`}
              >
                Private / Locked Slots ({result.privateSlots.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('playlists')}
                className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all cursor-pointer border ${
                  activeTab === 'playlists'
                    ? 'btn-siampay-primary text-white border-transparent'
                    : 'bg-white/80 text-[#635B80] border-[#EDE8F9] hover:bg-white hover:text-[#181135]'
                }`}
              >
                All Inspected Playlists ({result.playlists.length})
              </button>
            </div>

            {/* TAB 1: Unlisted Videos */}
            {activeTab === 'unlisted' && (
              <div className="space-y-4">
                {result.unlistedVideos.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[13px] text-[#635B80]">
                      These videos are marked as <strong>Unlisted</strong> by the creator, but were indexed inside their public playlists:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.unlistedVideos.map((vid) => (
                        <div
                          key={vid.videoId}
                          className="border border-[#EDE8F9] bg-white/70 backdrop-blur-sm p-4 rounded-2xl flex flex-col justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex gap-3 items-start">
                            <div className="relative w-28 aspect-video bg-[#181135] shrink-0 border border-[#EDE8F9] rounded-xl overflow-hidden shadow-2xs">
                              <Image
                                src={vid.thumbnail}
                                alt={vid.title}
                                fill
                                referrerPolicy="no-referrer"
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                Unlisted
                              </span>
                              <h3 className="text-[14px] font-bold text-[#181135] line-clamp-2 leading-snug">
                                {vid.title}
                              </h3>
                              <p className="text-[12px] text-[#635B80] truncate">
                                Playlist: {vid.playlistTitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#EDE8F9] text-[12px]">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(vid.videoId)}
                              className="inline-flex items-center gap-1 text-[#635B80] hover:text-[#181135] cursor-pointer"
                            >
                              {copiedId === vid.videoId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>

                            <Link
                              href="/private-viewer"
                              className="inline-flex items-center gap-1 text-[#7C3AED] font-semibold hover:underline"
                            >
                              <span>Watch in Private Viewer</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#635B80] bg-white/50 border border-[#EDE8F9] rounded-2xl space-y-2">
                    <p className="font-bold text-[#181135]">No unlisted videos found in public playlists.</p>
                    <p className="text-[13px] max-w-md mx-auto">
                      The creator has either not attached unlisted videos to public playlists, or only uploads fully public content.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Private Slots */}
            {activeTab === 'private' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-800 rounded-2xl text-[13px] leading-relaxed flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <strong className="block font-bold">About Private Videos:</strong>
                    When a video is marked as <strong>Private</strong>, Google strictly blocks unauthorized streaming. Our tool detects the existence of these slots in playlists, but legitimate privacy and security protocols prevent unauthorized video decoding.
                  </div>
                </div>

                {result.privateSlots.length > 0 ? (
                  <div className="border border-[#EDE8F9] divide-y divide-[#EDE8F9] bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xs">
                    {result.privateSlots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 text-[13px]"
                      >
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#7C3AED] shrink-0" />
                          <div>
                            <span className="font-bold text-[#181135]">Private Video Slot</span>
                            <span className="text-[#635B80] ml-2">in &quot;{slot.playlistTitle}&quot;</span>
                          </div>
                        </div>
                        <span className="text-[12px] font-mono text-[#635B80]">
                          ID: {slot.videoId}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#635B80] bg-white/50 border border-[#EDE8F9] rounded-2xl">
                    No locked private video slots detected in the scanned playlists.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: All Playlists */}
            {activeTab === 'playlists' && (
              <div className="space-y-3">
                <p className="text-[13px] text-[#635B80]">
                  Inspected playlists belonging to this channel:
                </p>
                <div className="border border-[#EDE8F9] divide-y divide-[#EDE8F9] bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xs">
                  {result.playlists.map((pl) => (
                    <div
                      key={pl.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ListVideo className="w-4 h-4 text-[#7C3AED] shrink-0" />
                        <div>
                          <h4 className="font-bold text-[#181135] text-[14px]">{pl.title}</h4>
                          <div className="flex items-center gap-2 text-[12px] text-[#635B80]">
                            <span>{pl.itemCount} Total Videos</span>
                            {pl.unlistedCount > 0 && (
                              <span className="text-amber-700 font-semibold">
                                • {pl.unlistedCount} Unlisted
                              </span>
                            )}
                            {pl.privateCount > 0 && (
                              <span className="text-[#7C3AED] font-semibold">
                                • {pl.privateCount} Private
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <a
                        href={`https://www.youtube.com/playlist?list=${pl.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] text-[#7C3AED] font-semibold hover:underline shrink-0"
                      >
                        <span>Open Playlist</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Educational Security & Technical FAQ Notice */}
          <div className="p-5 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl space-y-2 text-[13px] text-[#635B80] leading-relaxed shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-[#181135]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Technical Security Standard: Unlisted vs. Private Videos</span>
            </div>
            <p>
              <strong>Unlisted Videos:</strong> Accessible by anyone who has the link, and frequently discoverable through public playlist indexes, embeds, and archives.
            </p>
            <p>
              <strong>Private Videos:</strong> Strictly locked by Google servers behind OAuth login. Any website claiming to decode private YouTube videos without the creator’s Google credentials is a phishing scam.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
