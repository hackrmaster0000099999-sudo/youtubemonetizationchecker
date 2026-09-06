'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
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
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="hidden-video-finder-form"
          placeholder="Enter YouTube Channel URL, @handle, or Playlist link to scan..."
          buttonText="Scan for Hidden Videos"
          loadingText="Scanning channel playlists and unlisted items..."
          isLoading={loading}
          onSubmit={handleScan}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[13px] text-[#5B6169]">
          <div className="flex items-center gap-2">
            <FolderSearch className="w-4 h-4 text-[#D6293C]" />
            <span>Scans public playlists and collections to reveal unlisted videos.</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#5B6169]">Try sample:</span>
            <button
              type="button"
              onClick={() => handleScan('https://www.youtube.com/@freecodecamp')}
              className="text-[#D6293C] font-semibold hover:underline cursor-pointer"
            >
              freeCodeCamp
            </button>
            <span className="text-[#E8E7E3]">•</span>
            <button
              type="button"
              onClick={() => handleScan('https://www.youtube.com/@GoogleDevelopers')}
              className="text-[#D6293C] font-semibold hover:underline cursor-pointer"
            >
              Google Developers
            </button>
          </div>
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
          <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-14 h-14 bg-[#16181C] shrink-0 overflow-hidden rounded-full border border-[#E8E7E3]">
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
                <span className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Target {result.targetType}
                </span>
                <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C] truncate">
                  {result.targetInfo.title}
                </h2>
                <div className="text-[13px] text-[#5B6169]">
                  ID: <span className="font-mono text-[#16181C]">{result.targetInfo.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={
                  result.targetType === 'PLAYLIST'
                    ? `https://www.youtube.com/playlist?list=${result.targetInfo.id}`
                    : `https://www.youtube.com/channel/${result.targetInfo.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-semibold text-[#16181C] hover:bg-[#F0EFEB] transition-colors"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unlisted Videos Found */}
            <div
              className={`p-5 border shadow-xs space-y-1 ${
                result.stats.unlistedCount > 0
                  ? 'bg-[#FEF3C7]/30 border-[#F59E0B]'
                  : 'bg-white border-[#E8E7E3]'
              }`}
            >
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Unlisted Videos
                </span>
                <EyeOff
                  className={`w-4 h-4 ${
                    result.stats.unlistedCount > 0 ? 'text-[#F59E0B]' : 'text-[#5B6169]'
                  }`}
                />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {result.stats.unlistedCount}
              </div>
              <div className="text-[12px] text-[#5B6169]">
                {result.stats.unlistedCount > 0
                  ? 'Found in public playlists'
                  : 'None detected in playlists'}
              </div>
            </div>

            {/* Private Slots Locked */}
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Private Slots
                </span>
                <Lock className="w-4 h-4 text-[#D6293C]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {result.stats.privateSlotsCount}
              </div>
              <div className="text-[12px] text-[#5B6169]">Locked or deleted by creator</div>
            </div>

            {/* Total Videos Scanned */}
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Videos Scanned
                </span>
                <Eye className="w-4 h-4 text-[#1E9E6B]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {formatNumber(result.stats.totalVideosScanned)}
              </div>
              <div className="text-[12px] text-[#5B6169]">
                {result.stats.publicCount} public items checked
              </div>
            </div>

            {/* Playlists Inspected */}
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[#5B6169]">
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Playlists Scanned
                </span>
                <ListVideo className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#16181C] tracking-tight">
                {result.stats.playlistsScanned}
              </div>
              <div className="text-[12px] text-[#5B6169]">Channel collections inspected</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E7E3] pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('unlisted')}
                className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'unlisted'
                    ? 'bg-[#D6293C] text-white border-[#D6293C]'
                    : 'bg-[#F9F9F8] text-[#5B6169] border-[#E8E7E3] hover:text-[#16181C]'
                }`}
              >
                Unlisted Videos ({result.unlistedVideos.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('private')}
                className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'private'
                    ? 'bg-[#D6293C] text-white border-[#D6293C]'
                    : 'bg-[#F9F9F8] text-[#5B6169] border-[#E8E7E3] hover:text-[#16181C]'
                }`}
              >
                Private / Locked Slots ({result.privateSlots.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('playlists')}
                className={`px-3.5 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'playlists'
                    ? 'bg-[#D6293C] text-white border-[#D6293C]'
                    : 'bg-[#F9F9F8] text-[#5B6169] border-[#E8E7E3] hover:text-[#16181C]'
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
                    <p className="text-[13px] text-[#5B6169]">
                      These videos are marked as <strong>Unlisted</strong> by the creator, but were indexed inside their public playlists:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.unlistedVideos.map((vid) => (
                        <div
                          key={vid.videoId}
                          className="border border-[#E8E7E3] bg-[#FAFAF9] p-4 flex flex-col justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex gap-3 items-start">
                            <div className="relative w-28 aspect-video bg-[#16181C] shrink-0 border border-[#E8E7E3] overflow-hidden">
                              <Image
                                src={vid.thumbnail}
                                alt={vid.title}
                                fill
                                referrerPolicy="no-referrer"
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <span className="inline-block px-1.5 py-0.5 bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold uppercase tracking-wider">
                                Unlisted
                              </span>
                              <h3 className="text-[14px] font-bold text-[#16181C] line-clamp-2 leading-snug">
                                {vid.title}
                              </h3>
                              <p className="text-[12px] text-[#5B6169] truncate">
                                Playlist: {vid.playlistTitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E8E7E3] text-[12px]">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(vid.videoId)}
                              className="inline-flex items-center gap-1 text-[#5B6169] hover:text-[#16181C] cursor-pointer"
                            >
                              {copiedId === vid.videoId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                                  <span className="text-[#1E9E6B]">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>

                            <Link
                              href="/private-viewer"
                              className="inline-flex items-center gap-1 text-[#D6293C] font-semibold hover:underline"
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
                  <div className="p-8 text-center text-[#5B6169] bg-[#FAFAF9] border border-[#E8E7E3] space-y-2">
                    <p className="font-semibold text-[#16181C]">No unlisted videos found in public playlists.</p>
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
                <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[13px] leading-relaxed flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
                  <div>
                    <strong className="block font-bold">About Private Videos:</strong>
                    When a video is marked as <strong>Private</strong>, Google strictly blocks unauthorized streaming. Our tool detects the existence of these slots in playlists, but legitimate privacy and security protocols prevent unauthorized video decoding.
                  </div>
                </div>

                {result.privateSlots.length > 0 ? (
                  <div className="border border-[#E8E7E3] divide-y divide-[#E8E7E3] bg-[#FAFAF9]">
                    {result.privateSlots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 text-[13px]"
                      >
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#D6293C] shrink-0" />
                          <div>
                            <span className="font-semibold text-[#16181C]">Private Video Slot</span>
                            <span className="text-[#5B6169] ml-2">in &quot;{slot.playlistTitle}&quot;</span>
                          </div>
                        </div>
                        <span className="text-[12px] font-mono text-[#5B6169]">
                          ID: {slot.videoId}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#5B6169] bg-[#FAFAF9] border border-[#E8E7E3]">
                    No locked private video slots detected in the scanned playlists.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: All Playlists */}
            {activeTab === 'playlists' && (
              <div className="space-y-3">
                <p className="text-[13px] text-[#5B6169]">
                  Inspected playlists belonging to this channel:
                </p>
                <div className="border border-[#E8E7E3] divide-y divide-[#E8E7E3] bg-[#FAFAF9]">
                  {result.playlists.map((pl) => (
                    <div
                      key={pl.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ListVideo className="w-4 h-4 text-[#5B6169] shrink-0" />
                        <div>
                          <h4 className="font-semibold text-[#16181C] text-[14px]">{pl.title}</h4>
                          <div className="flex items-center gap-2 text-[12px] text-[#5B6169]">
                            <span>{pl.itemCount} Total Videos</span>
                            {pl.unlistedCount > 0 && (
                              <span className="text-[#B45309] font-medium">
                                • {pl.unlistedCount} Unlisted
                              </span>
                            )}
                            {pl.privateCount > 0 && (
                              <span className="text-[#D6293C] font-medium">
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
                        className="inline-flex items-center gap-1 text-[12px] text-[#2563EB] hover:underline shrink-0"
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
          <div className="p-5 bg-[#FCFCFB] border border-[#E8E7E3] space-y-2 text-[13px] text-[#5B6169] leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-[#16181C]">
              <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
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
