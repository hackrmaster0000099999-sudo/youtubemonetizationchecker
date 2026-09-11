'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { SaveButton } from '@/components/common/SaveButton';
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
  const [inputValue, setInputValue] = useState('');
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
        body: JSON.stringify({ input, tool: 'thumbnail-downloader' }),
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
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="thumbnail-downloader-form"
          initialValue={inputValue}
          placeholder="Paste YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="Get Thumbnails"
          loadingText="Extracting..."
          isLoading={loading}
          onSubmit={handleFetch}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
        <div className="tool-card-3d p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-[#EDE8F9]">
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                Video Found
              </span>
              <h2 className="text-[18px] sm:text-[22px] font-bold text-[#181135] leading-snug">
                {video.title}
              </h2>
              <div className="text-[13px] text-[#635B80]">
                Channel: <span className="text-[#181135] font-semibold">{video.channelTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <SaveButton
                item={{
                  id: `thumbnail_${video.id}`,
                  toolId: 'thumbnail-downloader',
                  toolName: 'Thumbnail Downloader',
                  category: 'Media',
                  targetType: 'VIDEO',
                  title: video.title,
                  handle: video.channelTitle,
                  avatarUrl: video.thumbnails.medium || video.thumbnails.default || undefined,
                  url: `https://www.youtube.com/watch?v=${video.id}`,
                  metaText: `Thumbnails Ready`,
                  badgeType: 'neutral',
                  summary: `YouTube video thumbnails by ${video.channelTitle}`,
                }}
              />

              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#DDD0FA] bg-white/80 hover:border-[#7C3AED] rounded-xl text-[13px] font-semibold text-[#181135] transition-colors shadow-2xs"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
              </a>
            </div>
          </div>

          {/* Active Preview */}
          {previewUrl && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                High-Resolution Preview
              </div>
              <div className="relative aspect-video max-w-2xl bg-white/40 border border-[#EDE8F9] rounded-2xl overflow-hidden shadow-xs">
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
            <div className="text-[14px] font-bold text-[#181135]">
              Available Image Sizes &amp; Direct Downloads
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {resolutions.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4.5 border border-[#EDE8F9] bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold text-[14px] text-[#181135]">{res.name}</div>
                    <div className="font-mono-data text-[12px] text-[#635B80]">{res.dimension}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(res.url)}
                      className="px-3 py-1.5 text-[12px] border border-[#DDD0FA] bg-white hover:border-[#7C3AED] rounded-xl text-[#181135] font-semibold cursor-pointer transition-colors shadow-2xs"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(res.url, `youtube-thumbnail-${video.id}-${res.tag}`)}
                      className="btn-siampay-primary px-3.5 py-1.5 text-[12px] font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5"
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
