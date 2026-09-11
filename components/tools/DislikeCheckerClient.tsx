'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { SaveButton } from '@/components/common/SaveButton';
import { DislikeAnalysis } from '@/lib/youtube/types';
import { formatNumber, formatCompactNumber } from '@/lib/formatters/number';
import {
  ThumbsDown,
  ThumbsUp,
  Percent,
  Star,
  Eye,
  BarChart2,
  Info,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';

export function DislikeCheckerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState<DislikeAnalysis | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleFetchDislikes = async (input: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch('/api/youtube/dislikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch video dislike data.');
      }

      setData(json.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to analyze video dislikes. Please verify the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!data) return;
    const summary = `📊 YouTube Like/Dislike Analytics for "${data.video.title}"
👍 Likes: ${formatNumber(data.likes)} (${data.approvalRating}%)
👎 Dislikes: ${formatNumber(data.dislikes)} (${data.dislikeRatio}%)
⭐ Star Rating: ${data.rating} / 5.0
🎯 Audience Sentiment: ${data.sentiment}
👀 Total Views: ${formatNumber(data.video.viewCount || 0)}
📉 Dislikes per 1,000 Views: ${data.dislikesPer1kViews}

Checked via YT MONETIZE (youtubemonetizationchecker.online/dislike-checker)`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Sentiment color badge helper
  const getSentimentBadge = (sentiment: DislikeAnalysis['sentiment']) => {
    switch (sentiment) {
      case 'Overwhelmingly Positive':
        return {
          bg: 'bg-[#F0FDF4]',
          border: 'border-[#A7F3D0]',
          text: 'text-[#065F46]',
          icon: <Award className="w-3.5 h-3.5 text-[#1E9E6B] shrink-0" />,
        };
      case 'Mostly Positive':
        return {
          bg: 'bg-[#EFF6FF]',
          border: 'border-[#BFDBFE]',
          text: 'text-[#1D4ED8]',
          icon: <ThumbsUp className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />,
        };
      case 'Mixed Sentiment':
        return {
          bg: 'bg-[#FFFBEB]',
          border: 'border-[#FDE68A]',
          text: 'text-[#B45309]',
          icon: <Activity className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />,
        };
      case 'High Dislike Ratio':
      default:
        return {
          bg: 'bg-[#FEF2F2]',
          border: 'border-[#FECACA]',
          text: 'text-[#991B1B]',
          icon: <TrendingDown className="w-3.5 h-3.5 text-[#D6293C] shrink-0" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Box */}
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="dislike-checker-form"
          initialValue={inputValue}
          placeholder="Enter YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="Check Dislikes & Ratio"
          loadingText="Analyzing video metrics..."
          isLoading={loading}
          onSubmit={handleFetchDislikes}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <ThumbsDown className="w-4 h-4 text-[#7C3AED]" />
          <span>Reveals estimated dislike counts and audience approval ratings.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Querying video telemetry and public dislike archive..." />}

      {error && (
        <ToolError
          title="Unable to Retrieve Dislikes"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Target Video Card */}
          <div className="tool-card-3d p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start">
            <div className="relative w-full md:w-[220px] aspect-video bg-[#181135] shrink-0 overflow-hidden rounded-2xl border border-[#EDE8F9] shadow-2xs">
              {data.video.thumbnail ? (
                <Image
                  src={data.video.thumbnail}
                  alt={data.video.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#635B80]">
                  <ThumbsDown className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                  Analyzed Video
                </span>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#181135] leading-snug line-clamp-2">
                  {data.video.title}
                </h2>
                <div className="text-[14px] text-[#635B80]">
                  Channel:{' '}
                  <span className="text-[#181135] font-semibold">{data.video.channelTitle}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[12px]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#EDE8F9] rounded-xl font-semibold text-[#181135] shadow-2xs">
                  <Eye className="w-3.5 h-3.5 text-[#635B80]" />
                  <span>{formatNumber(data.video.viewCount || 0)} Views</span>
                </div>
                {data.video.publishedAt && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#EDE8F9] rounded-xl font-medium text-[#635B80] shadow-2xs">
                    <span>Published: {data.video.publishedAt}</span>
                  </div>
                )}
                <SaveButton
                  item={{
                    id: `dislike_${data.videoId}`,
                    toolId: 'dislike-checker',
                    toolName: 'Dislike Checker',
                    category: 'Analytics',
                    targetType: 'VIDEO',
                    title: data.video.title,
                    handle: data.video.channelTitle,
                    avatarUrl: data.video.thumbnail || undefined,
                    url: `https://www.youtube.com/watch?v=${data.videoId}`,
                    metaText: `${data.approvalRating}% Approval (${formatNumber(data.dislikes)} dislikes)`,
                    badgeType: data.approvalRating >= 80 ? 'success' : data.approvalRating >= 60 ? 'warning' : 'danger',
                    summary: `${formatNumber(data.likes)} likes • ${formatNumber(data.dislikes)} dislikes`,
                  }}
                />

                <a
                  href={`https://www.youtube.com/watch?v=${data.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl font-semibold text-[#181135] hover:text-[#7C3AED] transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Open Video</span>
                  <ExternalLink className="w-3 h-3 text-[#7C3AED]" />
                </a>
              </div>
            </div>
          </div>

          {/* 4 Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Likes */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Total Likes</span>
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {formatNumber(data.likes)}
              </div>
              <div className="text-[12px] text-emerald-600 font-semibold">
                {data.approvalRating}% of all votes
              </div>
            </div>

            {/* Total Dislikes */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Estimated Dislikes</span>
                <ThumbsDown className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div className="text-[26px] font-extrabold text-[#7C3AED] tracking-tight">
                {formatNumber(data.dislikes)}
              </div>
              <div className="text-[12px] text-[#7C3AED] font-semibold">
                {data.dislikeRatio}% of all votes
              </div>
            </div>

            {/* Approval Rating */}
            <div className="tool-card-3d p-5 space-y-1">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Approval Rating</span>
                <Percent className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-[26px] font-extrabold text-[#181135] tracking-tight">
                {data.approvalRating}%
              </div>
              <div className="text-[12px] text-[#635B80]">
                Based on {formatCompactNumber(data.totalVotes)} ratings
              </div>
            </div>

            {/* Audience Sentiment */}
            <div className="tool-card-3d p-5 space-y-2">
              <div className="flex items-center justify-between text-[#635B80]">
                <span className="text-[12px] font-bold uppercase tracking-wider">Sentiment</span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                {(() => {
                  const badge = getSentimentBadge(data.sentiment);
                  return (
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-bold rounded-xl border ${badge.bg} ${badge.border} ${badge.text}`}
                    >
                      {badge.icon}
                      <span>{data.sentiment}</span>
                    </div>
                  );
                })()}
              </div>
              <div className="text-[12px] text-[#635B80]">
                Score: <strong className="text-[#181135]">{data.rating}</strong> / 5.0
              </div>
            </div>
          </div>

          {/* Visual Like-to-Dislike Ratio Bar */}
          <div className="tool-card-3d p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-[16px] font-bold text-[#181135] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#7C3AED]" />
                  <span>Like vs. Dislike Ratio Comparison</span>
                </h3>
                <p className="text-[12px] text-[#635B80]">
                  Visual representation of public engagement balance.
                </p>
              </div>

              <div className="flex items-center gap-4 text-[13px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" />
                  <span className="font-semibold text-[#181135]">Likes ({data.approvalRating}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#7C3AED] rounded-sm inline-block" />
                  <span className="font-semibold text-[#181135]">Dislikes ({data.dislikeRatio}%)</span>
                </div>
              </div>
            </div>

            {/* The Ratio Bar */}
            <div className="w-full h-8 bg-white/80 border border-[#EDE8F9] rounded-xl overflow-hidden flex shadow-2xs">
              <div
                style={{ width: `${Math.max(data.approvalRating, 0.5)}%` }}
                className="bg-emerald-500 h-full flex items-center justify-start px-2.5 text-white text-[11px] font-bold tracking-wider transition-all duration-500 overflow-hidden whitespace-nowrap"
                title={`Likes: ${formatNumber(data.likes)} (${data.approvalRating}%)`}
              >
                {data.approvalRating > 12 && `${data.approvalRating}%`}
              </div>
              <div
                style={{ width: `${Math.max(data.dislikeRatio, 0.5)}%` }}
                className="bg-[#7C3AED] h-full flex items-center justify-end px-2.5 text-white text-[11px] font-bold tracking-wider transition-all duration-500 overflow-hidden whitespace-nowrap"
                title={`Dislikes: ${formatNumber(data.dislikes)} (${data.dislikeRatio}%)`}
              >
                {data.dislikeRatio > 8 && `${data.dislikeRatio}%`}
              </div>
            </div>

            {/* Ratio Bar Sub-stats */}
            <div className="flex justify-between items-center text-[12px] text-[#635B80] pt-1">
              <span>👍 {formatNumber(data.likes)} Upvotes</span>
              <span>👎 {formatNumber(data.dislikes)} Downvotes</span>
            </div>
          </div>

          {/* Detailed Statistics Table */}
          <div className="tool-card-3d p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE8F9] pb-3">
              <h3 className="text-[16px] font-bold text-[#181135]">
                Engagement &amp; Audience Feedback Details
              </h3>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl text-[12px] font-semibold text-[#181135] hover:bg-white transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Copy Full Report</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div className="p-4 bg-white/70 border border-[#EDE8F9] rounded-2xl space-y-1 shadow-2xs">
                <span className="text-[#635B80] text-[12px] block">Dislikes per 1,000 Views:</span>
                <span className="text-[16px] font-bold text-[#181135]">
                  {data.dislikesPer1kViews}{' '}
                  <span className="text-[12px] font-normal text-[#635B80]">dislikes/1k views</span>
                </span>
                <p className="text-[11px] text-[#635B80] pt-0.5">
                  Shows how frequently viewers dislike relative to total traffic.
                </p>
              </div>

              <div className="p-4 bg-white/70 border border-[#EDE8F9] rounded-2xl space-y-1 shadow-2xs">
                <span className="text-[#635B80] text-[12px] block">Total Ratings Cast:</span>
                <span className="text-[16px] font-bold text-[#181135]">
                  {formatNumber(data.totalVotes)}{' '}
                  <span className="text-[12px] font-normal text-[#635B80]">total votes</span>
                </span>
                <p className="text-[11px] text-[#635B80] pt-0.5">
                  Combined number of likes and dislikes received.
                </p>
              </div>

              <div className="p-4 bg-white/70 border border-[#EDE8F9] rounded-2xl space-y-1 shadow-2xs">
                <span className="text-[#635B80] text-[12px] block">Voter Engagement Rate:</span>
                <span className="text-[16px] font-bold text-[#181135]">
                  {data.video.viewCount && data.video.viewCount > 0
                    ? `${((data.totalVotes / data.video.viewCount) * 100).toFixed(2)}%`
                    : 'N/A'}{' '}
                  <span className="text-[12px] font-normal text-[#635B80]">of viewers voted</span>
                </span>
                <p className="text-[11px] text-[#635B80] pt-0.5">
                  Average YouTube engagement usually ranges from 2% to 6%.
                </p>
              </div>

              <div className="p-4 bg-white/70 border border-[#EDE8F9] rounded-2xl space-y-1 shadow-2xs">
                <span className="text-[#635B80] text-[12px] block">5-Star Conversion Score:</span>
                <span className="text-[16px] font-bold text-[#181135]">
                  {data.rating} / 5.0{' '}
                  <span className="text-amber-500 font-bold">★</span>
                </span>
                <p className="text-[11px] text-[#635B80] pt-0.5">
                  Equivalent satisfaction score normalized to traditional 5-star rating.
                </p>
              </div>
            </div>
          </div>

          {/* Transparency & Disclaimer Box */}
          <div className="p-4 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl flex items-start gap-3 text-[13px] text-[#635B80] leading-relaxed shadow-2xs">
            <Info className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#181135]">Data Transparency Notice:</span>
              <p>{data.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
