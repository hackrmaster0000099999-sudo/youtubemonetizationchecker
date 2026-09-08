'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolError } from '@/components/common/ToolError';
import { SaveButton } from '@/components/common/SaveButton';
import { formatNumber } from '@/lib/formatters/number';
import {
  ShieldCheck,
  EyeOff,
  Maximize2,
  Minimize2,
  Repeat,
  Play,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Sparkles,
  Info,
  Sliders,
  Volume2,
  Tv,
} from 'lucide-react';

export function PrivateViewerClient() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [channelTitle, setChannelTitle] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Player Settings
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [loop, setLoop] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [startTime, setStartTime] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Helper to extract 11-char video ID from any YouTube URL
  const extractVideoId = (input: string): string | null => {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    return match ? match[1] : null;
  };

  const handleLoadVideo = async (input: string) => {
    setError(null);
    const id = extractVideoId(input);

    if (!id) {
      setError('Please provide a valid YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)');
      return;
    }

    setVideoId(id);
    setLoading(true);

    // Fetch video metadata in background
    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: id }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.type === 'VIDEO' && json.data) {
          setVideoTitle(json.data.title || null);
          setChannelTitle(json.data.channelTitle || null);
          setViewCount(json.data.viewCount || null);
          setPublishedAt(json.data.publishedAt || null);
        }
      }
    } catch {
      // Non-blocking: video will still play in nocookie mode even if metadata fails
    } finally {
      setLoading(false);
    }
  };

  // Construct privacy-enhanced embed URL
  const getEmbedUrl = () => {
    if (!videoId) return '';
    const params = new URLSearchParams({
      rel: '0', // Only show related videos from the same channel
      modestbranding: '1',
      iv_load_policy: '3', // Hide annotations
      enablejsapi: '1',
    });

    if (autoplay) params.set('autoplay', '1');
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', videoId);
    }
    if (startTime && !isNaN(Number(startTime)) && Number(startTime) > 0) {
      params.set('start', startTime);
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  };

  const handleCopyEmbedUrl = () => {
    const url = getEmbedUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs rounded-2xl">
        <YouTubeInputForm
          id="private-viewer-form"
          initialValue={inputValue}
          placeholder="Paste YouTube video link to watch privately..."
          buttonText="Watch Anonymously"
          loadingText="Loading private player..."
          isLoading={loading}
          onSubmit={handleLoadVideo}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[13px] text-[#5B6169]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
            <span>Powered by official YouTube Privacy-Enhanced Mode (No-Cookie).</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#5B6169]">Try sample:</span>
            <button
              type="button"
              onClick={() => handleLoadVideo('https://www.youtube.com/watch?v=jfKfPfyJRdk')}
              className="text-[#D6293C] font-semibold hover:underline cursor-pointer"
            >
              Lofi Girl Focus
            </button>
            <span className="text-[#E8E7E3]">•</span>
            <button
              type="button"
              onClick={() => handleLoadVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
              className="text-[#D6293C] font-semibold hover:underline cursor-pointer"
            >
              Rick Astley
            </button>
          </div>
        </div>
      </div>

      {error && (
        <ToolError
          title="Invalid Video Link"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* When video is loaded */}
      {videoId && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Privacy Guarantees Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white border border-[#E8E7E3] flex items-center gap-2.5 shadow-2xs">
              <Lock className="w-4 h-4 text-[#1E9E6B] shrink-0" />
              <div className="text-[12px]">
                <strong className="block text-[#16181C]">No Watch History</strong>
                <span className="text-[#5B6169]">Will not pollute YouTube profile</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#E8E7E3] flex items-center gap-2.5 shadow-2xs">
              <EyeOff className="w-4 h-4 text-[#2563EB] shrink-0" />
              <div className="text-[12px]">
                <strong className="block text-[#16181C]">No Tracking Cookies</strong>
                <span className="text-[#5B6169]">youtube-nocookie.com embed</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#E8E7E3] flex items-center gap-2.5 shadow-2xs">
              <Tv className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <div className="text-[12px]">
                <strong className="block text-[#16181C]">No Algorithm Bias</strong>
                <span className="text-[#5B6169]">No recommendation traps</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#E8E7E3] flex items-center gap-2.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#D6293C] shrink-0" />
              <div className="text-[12px]">
                <strong className="block text-[#16181C]">100% Anonymous</strong>
                <span className="text-[#5B6169]">No sign-in or data logging</span>
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="bg-white border border-[#E8E7E3] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <button
                type="button"
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors cursor-pointer font-medium ${
                  isTheaterMode
                    ? 'bg-[#16181C] text-white border-[#16181C]'
                    : 'bg-[#F9F9F8] text-[#16181C] border-[#E8E7E3] hover:bg-[#F0EFEB]'
                }`}
              >
                {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isTheaterMode ? 'Standard View' : 'Theater Mode'}</span>
              </button>

              <button
                type="button"
                onClick={() => setLoop(!loop)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors cursor-pointer font-medium ${
                  loop
                    ? 'bg-[#1E9E6B] text-white border-[#1E9E6B]'
                    : 'bg-[#F9F9F8] text-[#16181C] border-[#E8E7E3] hover:bg-[#F0EFEB]'
                }`}
                title="Automatically repeat video playback"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Loop: {loop ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoplay(!autoplay)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors cursor-pointer font-medium ${
                  autoplay
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-[#F9F9F8] text-[#16181C] border-[#E8E7E3] hover:bg-[#F0EFEB]'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Autoplay: {autoplay ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <SaveButton
                item={{
                  id: `private_${videoId}`,
                  toolId: 'private-viewer',
                  toolName: 'Private Viewer',
                  category: 'Media',
                  targetType: 'VIDEO',
                  title: videoTitle || `YouTube Video ${videoId}`,
                  handle: channelTitle || undefined,
                  avatarUrl: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
                  url: `https://www.youtube.com/watch?v=${videoId}`,
                  metaText: 'Privacy-Enhanced Stream',
                  badgeType: 'success',
                  summary: 'Saved for private, no-history tracking viewing',
                }}
              />

              <button
                type="button"
                onClick={handleCopyEmbedUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-semibold text-[#16181C] hover:bg-[#F0EFEB] transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                    <span className="text-[#1E9E6B]">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
                    <span>Copy Private Link</span>
                  </>
                )}
              </button>

              <a
                href={`https://www.youtube-nocookie.com/embed/${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D6293C] text-white text-[12px] font-semibold hover:bg-[#B81E2F] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Fullscreen Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Video Player Frame Container */}
          <div
            className={`transition-all duration-300 mx-auto bg-black border border-[#E8E7E3] shadow-md ${
              isTheaterMode ? 'w-full max-w-6xl' : 'w-full max-w-4xl'
            }`}
          >
            <div className="relative w-full aspect-video">
              <iframe
                key={getEmbedUrl()}
                src={getEmbedUrl()}
                title={videoTitle || 'Private YouTube Player'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
          </div>

          {/* Video Information Card */}
          {videoTitle && (
            <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#1E9E6B] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Now Playing in Anonymous Isolation</span>
                </span>
                <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C] leading-snug">
                  {videoTitle}
                </h2>
                {channelTitle && (
                  <p className="text-[14px] text-[#5B6169]">
                    Channel: <span className="text-[#16181C] font-semibold">{channelTitle}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E7E3] text-[12px]">
                {viewCount !== null && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] font-medium text-[#16181C]">
                    <span>{formatNumber(viewCount)} Views</span>
                  </div>
                )}
                {publishedAt && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] font-medium text-[#5B6169]">
                    <span>Published: {publishedAt}</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] border border-[#A7F3D0] text-[#065F46] font-semibold">
                  <span>Privacy Mode Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Technical Notice */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] flex items-start gap-3 text-[13px] text-[#5B6169] leading-relaxed">
            <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#16181C]">How Anonymous Viewing Works:</span>
              <p>
                This viewer embeds video content from <code>youtube-nocookie.com</code>, an official privacy domain maintained by Google. In this mode, YouTube will not store information about visitors on your web page unless they actively play the video, and the session will never be linked to your signed-in Google account watch history or influence your personal recommendation algorithm.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
