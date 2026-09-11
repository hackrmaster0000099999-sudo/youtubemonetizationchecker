'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { MonetizationResultView } from '@/components/tools/MonetizationResultView';
import { RecentlyCheckedSection } from '@/components/common/RecentlyCheckedSection';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { saveUserRecentCheck } from '@/lib/recent-checks/client';
import { useSavedItems } from '@/lib/saved-items/storage';
import { ShieldCheck, ThumbsUp, ThumbsDown, Flag, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';

export function MonetizationCheckerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [likesCount, setLikesCount] = useState(2218);
  const [hasLiked, setHasLiked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(352);
  const [hasDisliked, setHasDisliked] = useState(false);
  const { isSaved, toggle } = useSavedItems();
  const [justSavedTool, setJustSavedTool] = useState(false);
  const [result, setResult] = useState<{
    type: 'CHANNEL' | 'VIDEO';
    channelData?: ChannelData;
    videoData?: VideoData;
  } | null>(null);

  const isToolSaved = isSaved('monetization-checker', '/monetization-checker', 'tool_monetization_checker');

  const handleToggleToolSave = () => {
    const wasAdded = toggle({
      id: 'tool_monetization_checker',
      toolId: 'monetization-checker',
      toolName: 'Monetization Checker',
      category: 'Monetization',
      targetType: 'CHANNEL',
      title: 'YouTube Monetization Checker Tool',
      url: '/monetization-checker',
      metaText: 'Quick Access Bookmark',
      badgeType: 'neutral',
      summary: 'Analyze monetization status & ad eligibility signals.',
    });

    if (wasAdded) {
      setJustSavedTool(true);
      setTimeout(() => setJustSavedTool(false), 2000);
    } else {
      setJustSavedTool(false);
    }
  };

  const handleCheck = async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tool: 'monetization-checker' }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to analyze monetization.');
      }

      if (json.type === 'VIDEO') {
        const video: VideoData = json.data;
        setResult({ type: 'VIDEO', videoData: video });

        const isMonetized =
          video.monetization?.status === 'Likely Monetized' ||
          video.monetization?.status === 'Monetization Signals Detected';

        saveUserRecentCheck({
          id: video.id,
          targetType: 'VIDEO',
          title: video.title,
          handle: video.channelHandle,
          avatarUrl:
            video.thumbnails?.high ||
            video.thumbnails?.medium ||
            `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          tool: 'monetization-checker',
          category: 'Monetization',
          statusText: isMonetized ? 'Monetized' : 'Not Monetized',
          statusType: isMonetized ? 'success' : 'danger',
          metaText: video.channelTitle,
          timestamp: Date.now(),
        });
      } else {
        const channel: ChannelData = json.data;
        setResult({ type: 'CHANNEL', channelData: channel });

        const isMonetized =
          channel.monetization?.status === 'Likely Monetized' ||
          channel.monetization?.status === 'Monetization Signals Detected';

        saveUserRecentCheck({
          id: channel.id,
          targetType: 'CHANNEL',
          title: channel.title,
          handle: channel.handle,
          avatarUrl: channel.avatarUrl,
          url: channel.channelUrl || `https://www.youtube.com/${channel.handle || `channel/${channel.id}`}`,
          tool: 'monetization-checker',
          category: 'Monetization',
          statusText: isMonetized ? 'Monetized' : 'Not Monetized',
          statusType: isMonetized ? 'success' : 'danger',
          metaText: channel.subscriberText || channel.title,
          timestamp: Date.now(),
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error evaluating monetization.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (url: string) => {
    setInputValue(url);
    handleCheck(url);
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      if (hasDisliked) {
        setDislikesCount((prev) => prev - 1);
        setHasDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setDislikesCount((prev) => prev - 1);
      setHasDisliked(false);
    } else {
      setDislikesCount((prev) => prev + 1);
      setHasDisliked(true);
      if (hasLiked) {
        setLikesCount((prev) => prev - 1);
        setHasLiked(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box - Liquid Glass Card */}
      <div className="tool-card-3d p-6 sm:p-8 space-y-5">
        <YouTubeInputForm
          id="monetization-page-form"
          initialValue={inputValue}
          placeholder="Enter channel URL, @handle, channel ID, or video link"
          buttonText="Check Monetization Status"
          loadingText="Analyzing signals..."
          isLoading={loading}
          onSubmit={handleCheck}
        />

        {/* Action feedback bar */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EDE8F9] flex-wrap gap-4 text-[13px] text-[#635B80]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span className="font-medium">Real-time public signal evaluation · 100% Free</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasLiked ? 'text-[#10B981] font-bold' : 'hover:text-[#181135]'
              }`}
              title="Helpful tool"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likesCount.toLocaleString()}</span>
            </button>

            <span className="text-[#DDD0FA]">•</span>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasDisliked ? 'text-[#EF4444] font-bold' : 'hover:text-[#181135]'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{dislikesCount.toLocaleString()}</span>
            </button>

            <span className="text-[#DDD0FA]">•</span>

            <button
              type="button"
              onClick={handleToggleToolSave}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isToolSaved ? 'text-[#7C3AED] font-bold' : 'hover:text-[#181135]'
              }`}
              title={isToolSaved ? 'Saved in Browser (Click to remove)' : 'Save tool to Browser'}
            >
              {isToolSaved ? (
                <BookmarkCheck className="w-4 h-4 fill-[#7C3AED] text-white" />
              ) : (
                <Bookmark className="w-4 h-4 text-inherit" />
              )}
              <span className="hidden sm:inline">
                {justSavedTool ? 'Saved in Browser!' : isToolSaved ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <ToolLoading message="Evaluating public YouTube monetization markers, ad breaks, and channel data..." />
      )}

      {/* Error state */}
      {error && (
        <ToolError
          title="Analysis Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Result view */}
      {result && (
        <MonetizationResultView
          type={result.type}
          channelData={result.channelData}
          videoData={result.videoData}
        />
      )}

      {/* Real Recently Checked Channels section (Matches User Screenshot) */}
      <RecentlyCheckedSection
        title="Recently Checked Channels"
        category="Monetization"
        toolId="monetization-checker"
        onSelect={handleSelectRecent}
        limit={6}
      />
    </div>
  );
}
