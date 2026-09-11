'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { MonetizationResultView } from '@/components/tools/MonetizationResultView';
import { RecentlyCheckedSection } from '@/components/common/RecentlyCheckedSection';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { saveUserRecentCheck } from '@/lib/recent-checks/client';

export function HeroCheckerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<{
    type: 'CHANNEL' | 'VIDEO';
    channelData?: ChannelData;
    videoData?: VideoData;
  } | null>(null);

  const handleLookup = async (input: string) => {
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
        throw new Error(json.error || 'Failed to analyze YouTube data.');
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
      setError(err instanceof Error ? err.message : 'Failed to retrieve information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (url: string) => {
    setInputValue(url);
    handleLookup(url);
  };

  return (
    <div className="space-y-6">
      <div className="pt-2 text-left">
        <YouTubeInputForm
          id="hero-monetization-form"
          initialValue={inputValue}
          placeholder="Paste YouTube channel or video URL (e.g. youtube.com/@handle)"
          buttonText="Check Now"
          loadingText="Checking..."
          isLoading={loading}
          onSubmit={handleLookup}
        />
      </div>

      {/* Live Hero Results */}
      {loading && <ToolLoading message="Analyzing YouTube channel &amp; public monetization signals..." />}
      {error && (
        <ToolError
          title="Analysis Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}
      {result && (
        <div className="text-left animate-in fade-in-50 duration-200">
          <MonetizationResultView
            type={result.type}
            channelData={result.channelData}
            videoData={result.videoData}
          />
        </div>
      )}

      {/* Recently Checked Channels */}
      <div className="pt-4 text-left">
        <RecentlyCheckedSection
          title="Recently Checked Channels"
          category="Monetization"
          toolId="monetization-checker"
          onSelect={handleSelectRecent}
          limit={5}
        />
      </div>
    </div>
  );
}
