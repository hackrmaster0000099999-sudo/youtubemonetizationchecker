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
        <div className="bg-white border border-[#E8E7E3] p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-6 border-b border-[#E8E7E3]">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#5B6169] uppercase tracking-wider">
                Video Found
              </span>
              <h2 className="text-[18px] md:text-[22px] font-semibold text-[#16181C]">
                {video.title}
              </h2>
              <div className="text-[14px] text-[#5B6169]">
                Channel: <span className="text-[#16181C] font-medium">{video.channelTitle}</span>
              </div>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] active:scale-95 transition-all text-[13px] font-medium text-[#16181C] shrink-0"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#5B6169]" />
            </a>
          </div>

          {/* Active Preview */}
          {previewUrl && (
            <div className="space-y-2">
              <div className="text-[12px] font-semibold text-[#5B6169] uppercase tracking-wider">
                High-Resolution Preview
              </div>
              <div className="relative aspect-video max-w-2xl bg-[#FCFCFB] border border-[#E8E7E3] overflow-hidden">
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
          <div className="space-y-3 pt-2">
            <div className="text-[14px] font-semibold text-[#16181C]">
              Available Image Sizes &amp; Direct Downloads
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resolutions.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-[14px] text-[#16181C]">{res.name}</div>
                    <div className="font-mono-data text-[12px] text-[#5B6169]">{res.dimension}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(res.url)}
                      className="px-2.5 py-1.5 text-[12px] border border-[#E8E7E3] bg-white hover:border-[#16181C] active:scale-95 transition-all text-[#16181C] font-medium cursor-pointer"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(res.url, `youtube-thumbnail-${video.id}-${res.tag}`)}
                      className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-[#D6293C] hover:bg-[#B8202F] active:scale-95 transition-all cursor-pointer"
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
