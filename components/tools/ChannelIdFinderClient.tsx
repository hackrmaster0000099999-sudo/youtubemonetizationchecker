'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { SaveButton } from '@/components/common/SaveButton';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { ExternalLink, Rss, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ChannelIdFinderClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [channel, setChannel] = useState<{
    id: string;
    title: string;
    handle: string;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    channelUrl: string;
    subscriberText?: string;
    videoCountText?: string;
    viewCountText?: string;
    country?: string | null;
  } | null>(null);

  const handleFind = async (input: string) => {
    setLoading(true);
    setError(null);
    setChannel(null);

    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tool: 'channel-id-finder' }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to locate YouTube channel ID.');
      }

      if (json.type === 'VIDEO') {
        const v = json.data as VideoData;
        setChannel({
          id: v.channelId,
          title: v.channelTitle,
          handle: `@${v.channelTitle.replace(/\s+/g, '')}`,
          avatarUrl: v.thumbnails.default || undefined,
          channelUrl: `https://www.youtube.com/channel/${v.channelId}`,
          subscriberText: 'Public Creator',
          videoCountText: '1+ Public Videos',
          viewCountText: v.viewCountText,
        });
      } else {
        const c = json.data as ChannelData;
        setChannel({
          id: c.id,
          title: c.title,
          handle: c.handle || `@${c.title.replace(/\s+/g, '')}`,
          avatarUrl: c.avatarUrl,
          bannerUrl: c.bannerUrl,
          channelUrl: c.channelUrl,
          subscriberText: c.subscriberText,
          videoCountText: c.videoCountText,
          viewCountText: c.viewCountText,
          country: c.country,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve channel ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs rounded-2xl">
        <YouTubeInputForm
          id="channel-id-finder-form"
          initialValue={inputValue}
          placeholder="Paste channel URL, @handle, custom URL, or video link"
          buttonText="Find Channel ID"
          loadingText="Finding ID..."
          isLoading={loading}
          onSubmit={handleFind}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#5B6169]">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
          <span>Resolves custom handles, legacy usernames, and video URLs into the 24-character ID.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Resolving YouTube channel ID and canonical profile data..." />}
      {error && (
        <ToolError
          title="Lookup Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {channel && (
        <div className="bg-white border border-[#E3E2DE] rounded-2xl overflow-hidden shadow-xs">
          {/* Banner cover if available */}
          {channel.bannerUrl && (
            <div className="w-full h-32 md:h-44 bg-[#F9F9F8] border-b border-[#E3E2DE] overflow-hidden">
              <img
                src={channel.bannerUrl}
                alt={`${channel.title} banner`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="p-5 sm:p-7 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EFEB]">
              <div className="flex items-center gap-3.5">
                {channel.avatarUrl ? (
                  <img
                    src={channel.avatarUrl}
                    alt={channel.title}
                    className="w-14 h-14 rounded-full border border-[#E3E2DE] object-cover bg-[#F9F9F8] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EAE9E5] border border-[#E3E2DE] flex items-center justify-center font-bold text-[18px] text-[#16181C] shrink-0">
                    {channel.title.charAt(0)}
                  </div>
                )}
                <div className="space-y-0.5">
                  <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C]">
                    {channel.title}
                  </h2>
                  <div className="flex items-center gap-2 text-[13px] text-[#5B6169] flex-wrap">
                    <span className="font-semibold text-[#16181C]">{channel.handle}</span>
                    {channel.country && <span>• {channel.country}</span>}
                    {channel.subscriberText && <span>• {channel.subscriberText}</span>}
                    {channel.videoCountText && <span>• {channel.videoCountText}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <SaveButton
                  item={{
                    id: `channel_id_${channel.id}`,
                    toolId: 'channel-id-finder',
                    toolName: 'Channel ID Finder',
                    category: 'Channel',
                    targetType: 'CHANNEL',
                    title: channel.title,
                    handle: channel.handle,
                    avatarUrl: channel.avatarUrl || undefined,
                    url: channel.channelUrl,
                    metaText: `Channel ID: ${channel.id}`,
                    badgeType: 'neutral',
                    summary: `${channel.subscriberText || ''} • ${channel.videoCountText || ''}`,
                  }}
                />

                <a
                  href={channel.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E3E2DE] bg-white hover:border-[#16181C] rounded-xl text-[13px] font-medium text-[#16181C] transition-colors"
                >
                  <span>View on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5B6169]" />
                </a>
              </div>
            </div>

            {/* Primary Channel ID Box (Native Android Highlight Surface) */}
            <div className="space-y-2 p-4 sm:p-5 bg-[#F9F9F8] border border-[#E3E2DE] rounded-2xl">
              <div className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                Canonical YouTube Channel ID (UC-Format)
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="font-mono-data text-[17px] sm:text-[20px] font-bold text-[#16181C] break-all select-all">
                  {channel.id}
                </div>
                <CopyButton
                  id="copy-channel-id-btn"
                  textToCopy={channel.id}
                  label="Copy ID"
                  className="shrink-0"
                />
              </div>
              <p className="text-[12px] text-[#5B6169] pt-1">
                This permanent 24-character ID never changes even if the channel alters its display name or @handle.
              </p>
            </div>

            {/* Additional Identifiers & RSS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 border border-[#E3E2DE] bg-white rounded-xl space-y-2">
                <div className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Channel Handle URL
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-data text-[12px] sm:text-[13px] text-[#16181C] break-all">
                    {channel.channelUrl}
                  </span>
                  <CopyButton
                    id="copy-channel-url-btn"
                    textToCopy={channel.channelUrl}
                    label="Copy"
                  />
                </div>
              </div>

              <div className="p-4 border border-[#E3E2DE] bg-white rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  <Rss className="w-3.5 h-3.5 text-[#C77C11]" />
                  <span>Channel RSS Feed</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-data text-[12px] sm:text-[13px] text-[#16181C] break-all">
                    https://www.youtube.com/feeds/videos.xml?channel_id={channel.id}
                  </span>
                  <CopyButton
                    id="copy-rss-feed-btn"
                    textToCopy={`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`}
                    label="Copy"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions to other tools */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Link
                href={`/monetization-checker`}
                className="flex-1 p-3 border border-[#E3E2DE] bg-[#F9F9F8] hover:bg-white hover:border-[#16181C] rounded-xl text-[13px] font-semibold text-[#16181C] text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Check Monetization</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D6293C]" />
              </Link>
              <Link
                href="/image-downloader"
                className="flex-1 p-3 border border-[#E3E2DE] bg-[#F9F9F8] hover:bg-white hover:border-[#16181C] rounded-xl text-[13px] font-semibold text-[#16181C] text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Download Channel Images</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D6293C]" />
              </Link>
              <Link
                href="/earnings-calculator"
                className="flex-1 p-3 border border-[#E3E2DE] bg-[#F9F9F8] hover:bg-white hover:border-[#16181C] rounded-xl text-[13px] font-semibold text-[#16181C] text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Calculate Earnings</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D6293C]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
