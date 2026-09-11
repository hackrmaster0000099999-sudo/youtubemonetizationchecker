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
          channelUrl: c.channelUrl || `https://www.youtube.com/channel/${c.id}`,
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
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="channel-id-finder-form"
          initialValue={inputValue}
          placeholder="Paste channel URL, @handle, custom URL, or video link"
          buttonText="Find Channel ID"
          loadingText="Finding ID..."
          isLoading={loading}
          onSubmit={handleFind}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Resolves custom handles, legacy usernames, and video URLs into the permanent 24-character ID.</span>
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
        <div className="tool-card-3d overflow-hidden">
          {/* Banner cover if available */}
          {channel.bannerUrl && (
            <div className="w-full h-32 md:h-44 bg-white/40 border-b border-[#EDE8F9] overflow-hidden">
              <img
                src={channel.bannerUrl}
                alt={`${channel.title} banner`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="p-6 sm:p-7 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EDE8F9]">
              <div className="flex items-center gap-3.5">
                {channel.avatarUrl ? (
                  <img
                    src={channel.avatarUrl}
                    alt={channel.title}
                    className="w-14 h-14 rounded-full border border-[#DDD0FA] object-cover bg-white shadow-xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EDE8F9] border border-[#DDD0FA] flex items-center justify-center font-bold text-[18px] text-[#7C3AED] shrink-0">
                    {channel.title.charAt(0)}
                  </div>
                )}
                <div className="space-y-0.5">
                  <h2 className="text-[18px] sm:text-[22px] font-bold text-[#181135]">
                    {channel.title}
                  </h2>
                  <div className="flex items-center gap-2 text-[13px] text-[#635B80] flex-wrap">
                    <span className="font-semibold text-[#181135]">{channel.handle}</span>
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#DDD0FA] bg-white/80 hover:border-[#7C3AED] rounded-xl text-[13px] font-semibold text-[#181135] transition-colors shadow-2xs"
                >
                  <span>View on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
                </a>
              </div>
            </div>

            {/* Primary Channel ID Box (Liquid Glass Highlight Surface) */}
            <div className="space-y-2 p-5 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl shadow-2xs">
              <div className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                Canonical YouTube Channel ID (UC-Format)
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="font-mono-data text-[17px] sm:text-[21px] font-extrabold text-[#181135] break-all select-all">
                  {channel.id}
                </div>
                <CopyButton
                  id="copy-channel-id-btn"
                  textToCopy={channel.id}
                  label="Copy ID"
                  className="shrink-0"
                />
              </div>
              <p className="text-[12px] text-[#635B80] pt-1">
                This permanent 24-character ID never changes even if the channel alters its display name or @handle.
              </p>
            </div>

            {/* Additional Identifiers & RSS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4.5 border border-[#EDE8F9] bg-white/80 rounded-xl space-y-2 shadow-2xs">
                <div className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                  Channel Handle URL
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-data text-[12px] sm:text-[13px] text-[#181135] break-all">
                    {channel.channelUrl}
                  </span>
                  <CopyButton
                    id="copy-channel-url-btn"
                    textToCopy={channel.channelUrl}
                    label="Copy"
                  />
                </div>
              </div>

              <div className="p-4.5 border border-[#EDE8F9] bg-white/80 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                  <Rss className="w-3.5 h-3.5 text-amber-600" />
                  <span>Channel RSS Feed</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-data text-[12px] sm:text-[13px] text-[#181135] break-all">
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
                className="flex-1 p-3.5 border border-[#EDE8F9] bg-white/60 hover:bg-white hover:border-[#7C3AED] rounded-xl text-[13px] font-bold text-[#181135] text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Check Monetization</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED]" />
              </Link>
              <Link
                href="/image-downloader"
                className="flex-1 p-3.5 border border-[#EDE8F9] bg-white/60 hover:bg-white hover:border-[#7C3AED] rounded-xl text-[13px] font-bold text-[#181135] text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Download Channel Images</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED]" />
              </Link>
              <Link
                href="/earnings-calculator"
                className="flex-1 p-3.5 border border-[#EDE8F9] bg-white/60 hover:bg-white hover:border-[#7C3AED] rounded-xl text-[13px] font-bold text-[#181135] text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Calculate Earnings</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
