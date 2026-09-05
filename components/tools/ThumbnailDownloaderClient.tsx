'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { VideoData } from '@/lib/youtube/types';
import { Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface ThumbnailResolution {
  name: string;
  dimension: string;
  url: string;
  tag: string;
}

export function ThumbnailDownloaderClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFetch = async (input: string) => {
    setLoading(true);
    setError(null);
    setVideo(null);
    setPreviewUrl(null);

    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to extract video details.');
      }

      if (json.type !== 'VIDEO') {
        throw new Error('Please enter a YouTube video URL (e.g. youtube.com/watch?v=... or youtu.be/...) to download thumbnails.');
      }

      const videoData = json.data as VideoData;
      setVideo(videoData);
      setPreviewUrl(videoData.thumbnails.maxres || videoData.thumbnails.high || videoData.thumbnails.medium || videoData.thumbnails.default || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error extracting thumbnail.');
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
      // Fallback
      window.open(url, '_blank');
    }
  };

  const resolutions: ThumbnailResolution[] = video
    ? [
        video.thumbnails.maxres && {
          name: 'HD Quality (1080p / 720p)',
          dimension: '1280 x 720 px',
          url: video.thumbnails.maxres,
          tag: 'maxresdefault.jpg',
        },
        video.thumbnails.standard && {
          name: 'Standard Definition (SD)',
          dimension: '640 x 480 px',
          url: video.thumbnails.standard,
          tag: 'sddefault.jpg',
        },
        video.thumbnails.high && {
          name: 'High Quality (HQ)',
          dimension: '480 x 360 px',
          url: video.thumbnails.high,
          tag: 'hqdefault.jpg',
        },
        video.thumbnails.medium && {
          name: 'Medium Quality (MQ)',
          dimension: '320 x 180 px',
          url: video.thumbnails.medium,
          tag: 'mqdefault.jpg',
        },
      ].filter((r): r is ThumbnailResolution => Boolean(r))
    : [];

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="thumbnail-downloader-form"
          placeholder="Paste YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="Get Thumbnails"
          loadingText="Extracting..."
          isLoading={loading}
          onSubmit={handleFetch}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#5B6169]">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
          <span>Extracts direct official CDN image links at original source resolution.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Retrieving YouTube video thumbnail resolutions..." />}
      {error && (
        <ToolError
          title="Thumbnail Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {video && (
        <div className="bg-white border border-[#E3E2DE] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-[#F0EFEB]">
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                Video Found
              </span>
              <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C] leading-snug">
                {video.title}
              </h2>
              <div className="text-[13px] text-[#5B6169]">
                Channel: <span className="text-[#16181C] font-semibold">{video.channelTitle}</span>
              </div>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E3E2DE] bg-white hover:border-[#16181C] rounded-xl text-[13px] font-medium text-[#16181C] shrink-0 self-start sm:self-center transition-colors"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#5B6169]" />
            </a>
          </div>

          {/* Active Preview */}
          {previewUrl && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                High-Resolution Preview
              </div>
              <div className="relative aspect-video max-w-2xl bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl overflow-hidden">
                <img
                  src={previewUrl}
                  alt={`Thumbnail for ${video.title}`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {/* Resolution Options Grid */}
          <div className="space-y-3 pt-1">
            <div className="text-[14px] font-bold text-[#16181C]">
              Available Image Sizes &amp; Direct Downloads
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {resolutions.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-[#E3E2DE] bg-[#F9F9F8] rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold text-[14px] text-[#16181C]">{res.name}</div>
                    <div className="font-mono-data text-[12px] text-[#5B6169]">{res.dimension}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(res.url)}
                      className="px-3 py-1.5 text-[12px] border border-[#E3E2DE] bg-white hover:border-[#16181C] rounded-lg text-[#16181C] font-medium cursor-pointer transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(res.url, `youtube-thumbnail-${video.id}-${res.tag}`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-white bg-[#16181C] hover:bg-[#2A2E35] active:bg-black rounded-lg cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
