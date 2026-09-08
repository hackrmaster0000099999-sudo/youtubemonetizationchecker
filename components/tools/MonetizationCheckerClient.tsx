'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { MonetizationResultView } from '@/components/tools/MonetizationResultView';
import { RecentlyCheckedSection } from '@/components/common/RecentlyCheckedSection';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { saveUserRecentCheck } from '@/lib/recent-checks/client';
import { ShieldCheck, ThumbsUp, ThumbsDown, Flag, Bookmark, Share2 } from 'lucide-react';

export function MonetizationCheckerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [likesCount, setLikesCount] = useState(2218);
  const [hasLiked, setHasLiked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(352);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [result, setResult] = useState<{
    type: 'CHANNEL' | 'VIDEO';
    channelData?: ChannelData;
    videoData?: VideoData;
  } | null>(null);

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
      {/* Search Input Box */}
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] rounded-2xl space-y-5 shadow-xs">
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
        <div className="flex items-center justify-between pt-2 border-t border-[#F0EFEB] flex-wrap gap-4 text-[13px] text-[#5B6169]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
            <span>Real-time public signal evaluation · 100% Free</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasLiked ? 'text-[#1E9E6B] font-bold' : 'hover:text-[#16181C]'
              }`}
              title="Helpful tool"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likesCount.toLocaleString()}</span>
            </button>

            <span className="text-[#E8E7E3]">|</span>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasDisliked ? 'text-[#D6293C] font-bold' : 'hover:text-[#16181C]'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{dislikesCount.toLocaleString()}</span>
            </button>

            <span className="text-[#E8E7E3]">|</span>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved ? 'text-[#D6293C] font-bold' : 'hover:text-[#16181C]'
              }`}
              title="Save tool"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
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
