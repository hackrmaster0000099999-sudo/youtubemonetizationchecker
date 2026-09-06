'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { VideoCommentsResult, YouTubeComment } from '@/lib/youtube/types';
import { formatNumber } from '@/lib/formatters/number';
import {
  Trophy,
  Users,
  Filter,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  UserCheck,
  Hash,
  Sparkles,
} from 'lucide-react';

interface GiveawaySettings {
  filterDuplicates: boolean;
  requiredKeyword: string;
  minLikes: number;
  winnerCount: number;
}

export function RandomCommentPickerClient() {
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VideoCommentsResult | null>(null);
  const [commentsList, setCommentsList] = useState<YouTubeComment[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // Giveaway Settings
  const [settings, setSettings] = useState<GiveawaySettings>({
    filterDuplicates: true,
    requiredKeyword: '',
    minLikes: 0,
    winnerCount: 1,
  });

  // Winners state
  const [winners, setWinners] = useState<YouTubeComment[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [copiedWinners, setCopiedWinners] = useState(false);

  // Fetch comments from API
  const fetchComments = async (input: string, pageToken?: string) => {
    if (pageToken) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
      setData(null);
      setCommentsList([]);
      setWinners([]);
      setNextPageToken(null);
    }

    try {
      const res = await fetch('/api/youtube/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          order: 'time',
          pageToken,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to load video comments.');
      }

      const result: VideoCommentsResult = json.data;

      if (pageToken) {
        setCommentsList((prev) => [...prev, ...result.comments]);
      } else {
        setData(result);
        setCommentsList(result.comments);
      }
      setNextPageToken(result.nextPageToken || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to retrieve comments.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = (input: string) => {
    setCurrentInput(input);
    fetchComments(input);
  };

  const handleLoadMore = () => {
    if (!currentInput || !nextPageToken || loadingMore) return;
    fetchComments(currentInput, nextPageToken);
  };

  // Qualified eligible comments pool based on settings
  const eligiblePool = useMemo(() => {
    if (commentsList.length === 0) return [];

    let filtered = [...commentsList];

    // Filter by keyword if provided
    if (settings.requiredKeyword.trim()) {
      const kw = settings.requiredKeyword.trim().toLowerCase();
      filtered = filtered.filter((c) => c.text.toLowerCase().includes(kw));
    }

    // Filter by min likes
    if (settings.minLikes > 0) {
      filtered = filtered.filter((c) => c.likeCount >= settings.minLikes);
    }

    // Filter duplicates (one entry per user ID or authorName)
    if (settings.filterDuplicates) {
      const seen = new Set<string>();
      const unique: YouTubeComment[] = [];
      for (const comment of filtered) {
        const identifier = comment.authorChannelId || comment.authorName.toLowerCase();
        if (!seen.has(identifier)) {
          seen.add(identifier);
          unique.push(comment);
        }
      }
      filtered = unique;
    }

    return filtered;
  }, [commentsList, settings]);

  // Draw winners with suspense animation
  const handleDrawWinners = () => {
    if (eligiblePool.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setWinners([]);

    const neededCount = Math.min(settings.winnerCount, eligiblePool.length);

    let step = 0;
    const interval = setInterval(() => {
      const tempSample: YouTubeComment[] = [];
      const shuffled = [...eligiblePool].sort(() => 0.5 - Math.random());
      for (let i = 0; i < neededCount; i++) {
        tempSample.push(shuffled[i]);
      }
      setWinners(tempSample);
      step++;

      if (step >= 12) {
        clearInterval(interval);
        // Final secure randomized selection
        const finalPool = [...eligiblePool];
        const selected: YouTubeComment[] = [];
        for (let i = 0; i < neededCount; i++) {
          const randomIndex = Math.floor(Math.random() * finalPool.length);
          selected.push(finalPool[randomIndex]);
          finalPool.splice(randomIndex, 1);
        }
        setWinners(selected);
        setIsDrawing(false);

        // Celebratory confetti shower (ফুল/রঙিন কাগজ ছড়িয়ে পড়ার উৎসবের অনুভূতি)
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#D6293C', '#1E9E6B', '#2563EB', '#F59E0B', '#8B5CF6'],
            disableForReducedMotion: true,
          });

          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 55,
              origin: { x: 0.05, y: 0.7 },
              colors: ['#D6293C', '#1E9E6B', '#F59E0B'],
            });
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 55,
              origin: { x: 0.95, y: 0.7 },
              colors: ['#2563EB', '#1E9E6B', '#D6293C'],
            });
          }, 200);
        } catch {
          // Graceful fallback if canvas is not supported
        }
      }
    }, 90);
  };

  // Copy winners formatted list
  const handleCopyWinners = () => {
    if (winners.length === 0 || !data) return;
    const text = winners
      .map(
        (w, i) =>
          `🏆 Winner #${i + 1}: ${w.authorName}\nChannel: ${w.authorChannelUrl || 'N/A'}\nComment: "${w.text}"\nLikes: ${w.likeCount}`
      )
      .join('\n\n--------------------------\n\n');

    navigator.clipboard.writeText(
      `🎉 YouTube Giveaway Winners for "${data.video.title}"\n\n${text}\n\nSelected fairly via YT MONETIZE Random Comment Picker`
    );
    setCopiedWinners(true);
    setTimeout(() => setCopiedWinners(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="random-comment-picker-form"
          placeholder="Paste YouTube video URL (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="Load Video Comments"
          loadingText="Loading comments..."
          isLoading={loading}
          onSubmit={handleSubmit}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[13px] text-[#5B6169]">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#D6293C]" />
            <span>Fair, transparent, and unbiased winner selection for YouTube giveaways.</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="text-[#5B6169]">Try sample:</span>
            <button
              type="button"
              onClick={() => handleSubmit('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
              className="text-[#D6293C] font-semibold hover:underline"
            >
              Sample Video
            </button>
          </div>
        </div>
      </div>

      {loading && <ToolLoading message="Fetching comments from YouTube and preparing giveaway pool..." />}

      {error && (
        <ToolError
          title="Unable to Pick Comments"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Target Video Info Bar */}
          <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row gap-5 items-start">
            <div className="relative w-full md:w-[220px] aspect-video bg-[#16181C] shrink-0 overflow-hidden border border-[#E8E7E3]">
              {data.video.thumbnail ? (
                <Image
                  src={data.video.thumbnail}
                  alt={data.video.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#5B6169]">
                  <MessageSquare className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Contest Video
                </span>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#16181C] leading-snug line-clamp-2">
                  {data.video.title}
                </h2>
                <div className="text-[14px] text-[#5B6169]">
                  By: <span className="text-[#16181C] font-semibold">{data.video.channelTitle}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-medium text-[#16181C]">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D6293C]" />
                  <span>{formatNumber(data.video.commentCount || commentsList.length)} Comments on Video</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] border border-[#A7F3D0] text-[12px] font-semibold text-[#065F46]">
                  <Users className="w-3.5 h-3.5 text-[#1E9E6B]" />
                  <span>{commentsList.length} Comments Loaded</span>
                </div>
                {eligiblePool.length !== commentsList.length && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] border border-[#BFDBFE] text-[12px] font-semibold text-[#1D4ED8]">
                    <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{eligiblePool.length} Eligible Entries</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Disabled Warning */}
          {data.commentsDisabled && (
            <div className="p-6 bg-[#FCFCFB] border border-[#E8E7E3] flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#D6293C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-[16px] font-semibold text-[#16181C]">Comments Are Disabled</h3>
                <p className="text-[14px] text-[#5B6169] leading-relaxed">
                  Comments are disabled on this video by the creator or restricted by YouTube. A random winner cannot be picked.
                </p>
              </div>
            </div>
          )}

          {!data.commentsDisabled && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Giveaway Filter & Draw Controls */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="border-b border-[#E8E7E3] pb-3">
                    <h3 className="text-[16px] font-bold text-[#16181C] flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#D6293C]" />
                      <span>Giveaway Rules &amp; Filters</span>
                    </h3>
                    <p className="text-[12px] text-[#5B6169] mt-0.5">
                      Configure eligibility filters before picking winners.
                    </p>
                  </div>

                  {/* Settings Form */}
                  <div className="space-y-4">
                    {/* Number of Winners */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#16181C] flex items-center gap-2">
                        <span>Number of Winners:</span>
                        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-[#D6293C] bg-[#D6293C]/10 border border-[#D6293C]/20 rounded-xs">
                          {settings.winnerCount}
                        </span>
                      </label>
                      <select
                        value={settings.winnerCount}
                        onChange={(e) =>
                          setSettings((prev) => ({ ...prev, winnerCount: parseInt(e.target.value) || 1 }))
                        }
                        className="w-full px-3 py-2 bg-[#F9F9F8] border border-[#E8E7E3] text-[13px] text-[#16181C] focus:outline-hidden focus:border-[#16181C]"
                      >
                        {[1, 2, 3, 4, 5, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Winner' : 'Winners'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Duplicates */}
                    <div className="flex items-start gap-3 p-3 bg-[#F9F9F8] border border-[#E8E7E3]">
                      <input
                        type="checkbox"
                        id="filterDuplicates"
                        checked={settings.filterDuplicates}
                        onChange={(e) =>
                          setSettings((prev) => ({ ...prev, filterDuplicates: e.target.checked }))
                        }
                        className="mt-0.5 h-4 w-4 text-[#D6293C] border-[#E8E7E3] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="filterDuplicates" className="text-[13px] text-[#16181C] cursor-pointer">
                        <span className="font-semibold block">Filter Duplicate Users</span>
                        <span className="text-[12px] text-[#5B6169] block">
                          Only count one entry per person even if they commented multiple times.
                        </span>
                      </label>
                    </div>

                    {/* Required Keyword */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#16181C] flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-[#5B6169]" />
                        <span>Filter by Keyword or Hashtag (Optional):</span>
                      </label>
                      <input
                        type="text"
                        value={settings.requiredKeyword}
                        onChange={(e) =>
                          setSettings((prev) => ({ ...prev, requiredKeyword: e.target.value }))
                        }
                        placeholder="e.g. #giveaway or answer"
                        className="w-full px-3 py-2 bg-[#F9F9F8] border border-[#E8E7E3] text-[13px] text-[#16181C] placeholder-[#5B6169] focus:outline-hidden focus:border-[#16181C]"
                      />
                    </div>

                    {/* Minimum Likes */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#16181C] flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5 text-[#5B6169]" />
                        <span>Minimum Comment Likes (Optional):</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settings.minLikes || ''}
                        onChange={(e) =>
                          setSettings((prev) => ({ ...prev, minLikes: parseInt(e.target.value) || 0 }))
                        }
                        placeholder="0 (no minimum required)"
                        className="w-full px-3 py-2 bg-[#F9F9F8] border border-[#E8E7E3] text-[13px] text-[#16181C] placeholder-[#5B6169] focus:outline-hidden focus:border-[#16181C]"
                      />
                    </div>
                  </div>

                  {/* Summary of Eligible Entries */}
                  <div className="p-3.5 bg-[#FCFCFB] border border-[#E8E7E3] text-[13px] space-y-1">
                    <div className="flex justify-between text-[#5B6169]">
                      <span>Total Comments Loaded:</span>
                      <span className="font-semibold text-[#16181C]">{commentsList.length}</span>
                    </div>
                    <div className="flex justify-between text-[#1E9E6B] font-semibold">
                      <span>Eligible Contestants:</span>
                      <span>{eligiblePool.length} entries</span>
                    </div>
                  </div>

                  {/* Primary CTA: Draw Winners */}
                  <button
                    type="button"
                    onClick={handleDrawWinners}
                    disabled={eligiblePool.length === 0 || isDrawing}
                    className="w-full py-3 px-4 bg-[#D6293C] hover:bg-[#B81E2F] text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    <Trophy className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
                    <span>{isDrawing ? 'Picking Random Winner...' : 'Pick Random Winner Now'}</span>
                  </button>

                  {/* Load more button if available */}
                  {nextPageToken && (
                    <div className="pt-2 text-center border-t border-[#E8E7E3]">
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="text-[12px] font-semibold text-[#5B6169] hover:text-[#16181C] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{loadingMore ? 'Loading next 50...' : 'Load 50 More Comments into Pool'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Winners Display Board */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs min-h-[380px] flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E7E3] pb-3 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Trophy className="w-5 h-5 text-[#D6293C] shrink-0" />
                      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#16181C] whitespace-nowrap flex items-center gap-1.5">
                        <span>Contest Winners</span>
                        {winners.length > 0 && (
                          <span className="text-[#D6293C] font-extrabold">({winners.length})</span>
                        )}
                      </h3>
                    </div>

                    {winners.length > 0 && !isDrawing && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleCopyWinners}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-semibold text-[#16181C] hover:bg-[#F0EFEB] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {copiedWinners ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#1E9E6B] shrink-0" />
                              <span className="text-[#1E9E6B]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#5B6169] shrink-0" />
                              <span>Copy Winners</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleDrawWinners}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D6293C] text-white text-[12px] font-semibold hover:bg-[#B81E2F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                          <span>Re-Draw</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Celebratory Winner Announcement Banner */}
                  {winners.length > 0 && !isDrawing && (
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#F0FDF4] border border-[#A7F3D0] text-[#065F46] text-[13px] font-medium mb-4 rounded-xs animate-in fade-in duration-300">
                      <Sparkles className="w-4 h-4 text-[#1E9E6B] shrink-0" />
                      <span>
                        Congratulations! Winner{winners.length > 1 ? 's' : ''} selected fairly and randomly from {eligiblePool.length} eligible entries.
                      </span>
                    </div>
                  )}

                  {/* When no winners are picked yet */}
                  {winners.length === 0 && !isDrawing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-[#F9F9F8] border border-[#E8E7E3] flex items-center justify-center text-[#5B6169]">
                        <Trophy className="w-7 h-7 text-[#D6293C]" />
                      </div>
                      <div className="space-y-1 max-w-[340px]">
                        <h4 className="text-[16px] font-semibold text-[#16181C]">
                          Ready to Draw Winners
                        </h4>
                        <p className="text-[13px] text-[#5B6169] leading-relaxed">
                          We found {eligiblePool.length} eligible entries based on your rules. Click &ldquo;Pick Random Winner Now&rdquo; to begin.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Display Winners Cards */}
                  {winners.length > 0 && (
                    <div className="space-y-4 flex-1">
                      {winners.map((winner, idx) => (
                        <div
                          key={winner.id || idx}
                          className={`p-5 border transition-all ${
                            isDrawing
                              ? 'border-[#D6293C] bg-[#FCFCFB] animate-pulse'
                              : 'border-[#1E9E6B] bg-[#F0FDF4]/30 shadow-2xs'
                          }`}
                        >
                          {/* Winner Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative">
                                <div className="relative w-12 h-12 rounded-full bg-[#E8E7E3] overflow-hidden border border-[#1E9E6B]">
                                  {winner.authorAvatarUrl ? (
                                    <Image
                                      src={winner.authorAvatarUrl}
                                      alt={winner.authorName}
                                      fill
                                      referrerPolicy="no-referrer"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#5B6169]">
                                      <Users className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1E9E6B] text-white flex items-center justify-center text-[10px] font-bold">
                                  #{idx + 1}
                                </div>
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[12px] font-bold text-[#1E9E6B] uppercase tracking-wider">
                                    Winner #{idx + 1}
                                  </span>
                                </div>
                                {winner.authorChannelUrl ? (
                                  <a
                                    href={winner.authorChannelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[16px] font-bold text-[#16181C] hover:text-[#D6293C] transition-colors flex items-center gap-1.5 truncate"
                                  >
                                    <span className="truncate">{winner.authorName}</span>
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                  </a>
                                ) : (
                                  <div className="text-[16px] font-bold text-[#16181C] truncate">
                                    {winner.authorName}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <CopyButton
                                textToCopy={winner.text}
                                label="Copy Comment"
                                className="text-[12px] px-2.5 py-1"
                              />
                            </div>
                          </div>

                          {/* Winner Comment Body */}
                          <div className="p-3.5 bg-white border border-[#E8E7E3] text-[14px] text-[#16181C] leading-relaxed whitespace-pre-line rounded-xs">
                            &ldquo;{winner.text}&rdquo;
                          </div>

                          {/* Interaction Meta */}
                          <div className="flex items-center gap-4 mt-2.5 text-[12px] text-[#5B6169]">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3 text-[#5B6169]" />
                              <span>{winner.likeCount} Likes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-[#5B6169]" />
                              <span>{winner.replyCount} Replies</span>
                            </div>
                            {winner.publishedAt && (
                              <div className="text-[#5B6169]">
                                Commented: {winner.publishedAt}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
