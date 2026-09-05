'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { Download, ExternalLink, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export function ImageDownloaderClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<ChannelData | null>(null);

  const handleFetch = async (input: string) => {
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
        throw new Error(json.error || 'Failed to retrieve channel assets.');
      }

      if (json.type === 'VIDEO') {
        const v = json.data as VideoData;
        const channelRes = await fetch('/api/youtube/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: v.channelId }),
        });
        const channelJson = await channelRes.json();
        if (channelRes.ok && channelJson.data) {
          setChannel(channelJson.data as ChannelData);
        } else {
          throw new Error('Could not fetch parent channel artwork.');
        }
      } else {
        setChannel(json.data as ChannelData);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error extracting channel images.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="image-downloader-form"
          placeholder="Enter channel URL, @handle, or video link"
          buttonText="Extract Artwork"
          loadingText="Extracting images..."
          isLoading={loading}
          onSubmit={handleFetch}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#5B6169]">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
          <span>Retrieves original high-resolution channel banners, logos, and profile avatars.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Retrieving channel avatars, logos, and cover banners..." />}
      {error && (
        <ToolError
          title="Extraction Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {channel && (
        <div className="bg-white border border-[#E3E2DE] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-[#F0EFEB]">
            <div className="flex items-center gap-3.5">
              {channel.avatarUrl ? (
                <img
                  src={channel.avatarUrl}
                  alt={channel.title}
                  className="w-14 h-14 rounded-full border border-[#E3E2DE] object-cover bg-[#F9F9F8] shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#EAE9E5] border border-[#E3E2DE] flex items-center justify-center font-bold text-[#16181C] shrink-0">
                  {channel.title.charAt(0)}
                </div>
              )}
              <div className="space-y-0.5">
                <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C]">
                  {channel.title}
                </h2>
                <div className="text-[13px] text-[#5B6169] flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#16181C]">{channel.handle}</span>
                  {channel.subscriberText && <span>• {channel.subscriberText}</span>}
                </div>
              </div>
            </div>

            <a
              href={channel.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E3E2DE] bg-white hover:border-[#16181C] rounded-xl text-[13px] font-medium text-[#16181C] shrink-0 self-start sm:self-center transition-colors"
            >
              <span>View Channel</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#5B6169]" />
            </a>
          </div>

          {/* Section 1: Channel Banner */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-[#16181C] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#5B6169]" />
                  <span>Channel Header Banner / Cover Art</span>
                </h3>
                <p className="text-[12px] text-[#5B6169] mt-0.5">
                  Original high-resolution widescreen banner artwork.
                </p>
              </div>
              {channel.bannerUrl && (
                <button
                  type="button"
                  onClick={() =>
                    handleDownload(
                      channel.bannerUrl!,
                      `youtube-banner-${channel.id}.jpg`
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#16181C] hover:bg-[#2A2E35] active:bg-black rounded-xl shrink-0 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Banner</span>
                </button>
              )}
            </div>

            {channel.bannerUrl ? (
              <div className="w-full h-36 sm:h-56 bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl overflow-hidden">
                <img
                  src={channel.bannerUrl}
                  alt={`${channel.title} banner`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="p-6 border border-dashed border-[#E3E2DE] bg-[#F9F9F8] rounded-xl text-center text-[13px] text-[#5B6169]">
                This channel has not uploaded a custom channel header banner.
              </div>
            )}
          </div>

          {/* Section 2: Channel Profile / Avatar */}
          <div className="space-y-3.5 pt-5 border-t border-[#F0EFEB]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-[#16181C] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#5B6169]" />
                  <span>Channel Profile Avatar / Logo (HD)</span>
                </h3>
                <p className="text-[12px] text-[#5B6169] mt-0.5">
                  Full-resolution 800x800 avatar image.
                </p>
              </div>
              {channel.avatarUrl && (
                <button
                  type="button"
                  onClick={() =>
                    handleDownload(
                      channel.avatarUrl!.replace(/=s\d+/, '=s800'),
                      `youtube-avatar-${channel.id}.jpg`
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#16181C] hover:bg-[#2A2E35] active:bg-black rounded-xl shrink-0 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HD Avatar</span>
                </button>
              )}
            </div>

            {channel.avatarUrl && (
              <div className="flex items-center gap-4 p-4 bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl">
                <img
                  src={channel.avatarUrl.replace(/=s\d+/, '=s800')}
                  alt={`${channel.title} profile avatar`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#E3E2DE] object-cover bg-white shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 text-[13px] text-[#5B6169]">
                  <div className="font-semibold text-[#16181C]">Format: High Resolution JPG / PNG</div>
                  <div>Aspect Ratio: 1:1 Square (Circular Crop)</div>
                  <div className="text-[11px] text-[#5B6169]">Source: Official Google UserContent CDN</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
