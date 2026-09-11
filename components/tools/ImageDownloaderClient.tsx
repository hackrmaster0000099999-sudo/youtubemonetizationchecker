'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { SaveButton } from '@/components/common/SaveButton';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { Download, ExternalLink, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export function ImageDownloaderClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [channel, setChannel] = useState<ChannelData | null>(null);

  const handleFetch = async (input: string) => {
    setLoading(true);
    setError(null);
    setChannel(null);

    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tool: 'image-downloader' }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to retrieve channel assets.');
      }

      let cData: ChannelData | null = null;

      if (json.type === 'VIDEO') {
        const v = json.data as VideoData;
        const channelRes = await fetch('/api/youtube/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: v.channelId }),
        });
        const channelJson = await channelRes.json();
        if (channelRes.ok && channelJson.data) {
          cData = channelJson.data as ChannelData;
          setChannel(cData);
        } else {
          throw new Error('Could not fetch parent channel artwork.');
        }
      } else {
        cData = json.data as ChannelData;
        setChannel(cData);
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
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="image-downloader-form"
          initialValue={inputValue}
          placeholder="Enter channel URL, @handle, or video link"
          buttonText="Extract Artwork"
          loadingText="Extracting images..."
          isLoading={loading}
          onSubmit={handleFetch}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
        <div className="tool-card-3d p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-[#EDE8F9]">
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
                <div className="text-[13px] text-[#635B80] flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#181135]">{channel.handle}</span>
                  {channel.subscriberText && <span>• {channel.subscriberText}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <SaveButton
                item={{
                  id: `channel_image_${channel.id}`,
                  toolId: 'image-downloader',
                  toolName: 'Image Downloader',
                  category: 'Media',
                  targetType: 'CHANNEL',
                  title: channel.title,
                  handle: channel.handle,
                  avatarUrl: channel.avatarUrl || undefined,
                  url: channel.channelUrl,
                  metaText: channel.bannerUrl ? 'Avatar & Banner Available' : 'Avatar Available',
                  badgeType: 'neutral',
                  summary: `${channel.subscriberText || ''} channel graphics & branding assets`,
                }}
              />

              <a
                href={channel.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#DDD0FA] bg-white/80 hover:border-[#7C3AED] rounded-xl text-[13px] font-semibold text-[#181135] transition-colors shadow-2xs"
              >
                <span>View Channel</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
              </a>
            </div>
          </div>

          {/* Section 1: Channel Banner */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-[#181135] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#7C3AED]" />
                  <span>Channel Header Banner / Cover Art</span>
                </h3>
                <p className="text-[12px] text-[#635B80] mt-0.5">
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
                  className="btn-siampay-primary px-4 py-2.5 text-[13px] font-bold rounded-xl shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Banner</span>
                </button>
              )}
            </div>

            {channel.bannerUrl ? (
              <div className="w-full h-36 sm:h-56 bg-white/40 border border-[#EDE8F9] rounded-2xl overflow-hidden shadow-2xs">
                <img
                  src={channel.bannerUrl}
                  alt={`${channel.title} banner`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="p-6 border border-dashed border-[#EDE8F9] bg-white/40 rounded-2xl text-center text-[13px] text-[#635B80]">
                This channel has not uploaded a custom channel header banner.
              </div>
            )}
          </div>

          {/* Section 2: Channel Profile / Avatar */}
          <div className="space-y-3.5 pt-5 border-t border-[#EDE8F9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-[#181135] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#7C3AED]" />
                  <span>Channel Profile Avatar / Logo (HD)</span>
                </h3>
                <p className="text-[12px] text-[#635B80] mt-0.5">
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
                  className="btn-siampay-primary px-4 py-2.5 text-[13px] font-bold rounded-xl shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HD Avatar</span>
                </button>
              )}
            </div>

            {channel.avatarUrl && (
              <div className="flex items-center gap-4 p-5 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl shadow-2xs">
                <img
                  src={channel.avatarUrl.replace(/=s\d+/, '=s800')}
                  alt={`${channel.title} profile avatar`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#DDD0FA] object-cover bg-white shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 text-[13px] text-[#635B80]">
                  <div className="font-bold text-[#181135]">Format: High Resolution JPG / PNG</div>
                  <div>Aspect Ratio: 1:1 Square (Circular Crop)</div>
                  <div className="text-[11px] text-[#635B80]">Source: Official Google UserContent CDN</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
