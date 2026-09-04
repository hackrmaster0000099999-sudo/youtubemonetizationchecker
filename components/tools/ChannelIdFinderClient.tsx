'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { ExternalLink, Rss, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ChannelIdFinderClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        body: JSON.stringify({ input }),
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
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="channel-id-finder-form"
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
        <div className="bg-white border border-[#E8E7E3] overflow-hidden">
          {/* Banner cover if available */}
          {channel.bannerUrl && (
            <div className="w-full h-32 md:h-44 bg-[#FCFCFB] border-b border-[#E8E7E3] overflow-hidden">
              <img
                src={channel.bannerUrl}
                alt={`${channel.title} banner`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E7E3]">
              <div className="flex items-center gap-4">
                {channel.avatarUrl ? (
                  <img
                    src={channel.avatarUrl}
                    alt={channel.title}
                    className="w-16 h-16 rounded-full border border-[#E8E7E3] object-cover bg-[#FCFCFB] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#FCFCFB] border border-[#E8E7E3] flex items-center justify-center font-bold text-[20px] text-[#16181C]">
                    {channel.title.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-[20px] md:text-[24px] font-semibold text-[#16181C]">
                    {channel.title}
                  </h2>
                  <div className="flex items-center gap-2 text-[14px] text-[#5B6169] mt-0.5 flex-wrap">
                    <span className="font-medium text-[#16181C]">{channel.handle}</span>
                    {channel.country && <span>• {channel.country}</span>}
                    {channel.subscriberText && <span>• {channel.subscriberText}</span>}
                    {channel.videoCountText && <span>• {channel.videoCountText}</span>}
                  </div>
                </div>
              </div>

              <a
                href={channel.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] active:scale-95 transition-all text-[13px] font-medium text-[#16181C] shrink-0"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5B6169]" />
              </a>
            </div>

            {/* Primary Channel ID Box */}
            <div className="space-y-2 p-5 bg-[#FCFCFB] border border-[#E8E7E3]">
              <div className="text-[12px] font-semibold text-[#5B6169] uppercase tracking-wider">
                Canonical YouTube Channel ID (UC-Format)
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="font-mono-data text-[18px] md:text-[20px] font-semibold text-[#16181C] break-all select-all">
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
                This permanent 24-character ID never changes even if the channel owner alters their display name or @handle.
              </p>
            </div>

            {/* Additional Identifiers & RSS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#E8E7E3] bg-white space-y-2">
                <div className="text-[11px] font-semibold text-[#5B6169] uppercase tracking-wider">
                  Channel Handle URL
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-data text-[13px] text-[#16181C] truncate">
                    {channel.channelUrl}
                  </span>
                  <CopyButton
                    id="copy-channel-url-btn"
                    textToCopy={channel.channelUrl}
                    label="Copy"
                  />
                </div>
              </div>

              <div className="p-4 border border-[#E8E7E3] bg-white space-y-2">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#5B6169] uppercase tracking-wider">
                  <Rss className="w-3 h-3 text-[#C77C11]" />
                  <span>Channel RSS Feed</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-data text-[13px] text-[#16181C] truncate">
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
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/monetization-checker`}
                className="flex-1 p-3 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] active:scale-95 transition-all text-[13px] font-semibold text-[#16181C] text-center flex items-center justify-center gap-1.5"
              >
                <span>Check Monetization</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D6293C]" />
              </Link>
              <Link
                href="/image-downloader"
                className="flex-1 p-3 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] active:scale-95 transition-all text-[13px] font-semibold text-[#16181C] text-center flex items-center justify-center gap-1.5"
              >
                <span>Download Channel Images</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D6293C]" />
              </Link>
              <Link
                href="/earnings-calculator"
                className="flex-1 p-3 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] active:scale-95 transition-all text-[13px] font-semibold text-[#16181C] text-center flex items-center justify-center gap-1.5"
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
