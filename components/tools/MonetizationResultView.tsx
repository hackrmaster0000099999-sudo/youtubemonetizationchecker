'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  Radio,
  Eye,
  Video,
  Users,
  Globe,
  Calendar,
  Layers,
  DollarSign,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { CopyButton } from '@/components/common/CopyButton';
import { SaveButton } from '@/components/common/SaveButton';
import { formatDate } from '@/lib/formatters/number';

interface MonetizationResultViewProps {
  type: 'CHANNEL' | 'VIDEO';
  channelData?: ChannelData;
  videoData?: VideoData;
}

export function MonetizationResultView({ type, channelData, videoData }: MonetizationResultViewProps) {
  const [copiedAllTags, setCopiedAllTags] = useState(false);
  const isVideo = type === 'VIDEO' && Boolean(videoData);
  const data = isVideo ? videoData! : channelData!;

  // Determine monetization standing
  const subCount = isVideo ? 0 : Number(channelData?.subscriberCount) || 0;
  const vidCount = isVideo ? 1 : Number(channelData?.videoCount) || 0;
  const isZeroActivity = !isVideo && (subCount === 0 || vidCount === 0);

  const status = data.monetization.status;
  const isPositive =
    !isZeroActivity &&
    (status === 'Likely Monetized' || status === 'Monetization Signals Detected') &&
    (isVideo || subCount >= 1000);

  const confidence = data.monetization.confidence;
  const detectedSignalsCount = data.monetization.signals.filter((s) => s.detected).length;
  const totalSignalsCount = data.monetization.signals.length;

  // Extract tags if video has tags or derive keywords
  const tagsList: string[] = isVideo
    ? videoData?.tags || []
    : (channelData?.description
        ? Array.from(new Set(channelData.description.match(/#\w+/g) || []))
        : []);

  const handleCopyAllTags = () => {
    if (tagsList.length === 0) return;
    navigator.clipboard.writeText(tagsList.join(', '));
    setCopiedAllTags(true);
    setTimeout(() => setCopiedAllTags(false), 2000);
  };

  return (
    <div id="monetization-result-container" className="space-y-6 my-8">
      {/* 1. Main Header Card with Liquid Glass 2026 Identity */}
      <div className="tool-card-3d overflow-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-32 sm:h-48 bg-gradient-to-r from-[#181135] via-[#2F1F5E] to-[#181135] border-b border-white/50 overflow-hidden">
          {!isVideo && channelData?.bannerUrl ? (
            <img
              src={channelData.bannerUrl}
              alt={`${channelData.title} Banner`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-between px-8 opacity-25 pointer-events-none">
              <div className="text-white text-[24px] font-mono-data tracking-widest uppercase font-black">
                {isVideo ? 'VIDEO ANALYSIS' : 'CHANNEL REPORT'}
              </div>
              <div className="w-36 h-36 rounded-full border-4 border-white/20 -mr-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181135]/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Identity & Status Row */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EDE8F9]/80 -mt-16 sm:-mt-20 relative z-10">
            {/* Left: Avatar + Title */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
              {isVideo ? (
                <div className="relative shrink-0">
                  <img
                    src={videoData?.thumbnails.medium || videoData?.thumbnails.default || ''}
                    alt={videoData?.title || 'Video Thumbnail'}
                    className="w-32 h-20 sm:w-38 sm:h-24 object-cover rounded-2xl border-4 border-white bg-white shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-white text-[11px] font-mono-data font-medium rounded-md">
                    {videoData?.duration || 'Video'}
                  </div>
                </div>
              ) : (
                <div className="relative shrink-0">
                  {channelData?.avatarUrl ? (
                    <img
                      src={channelData.avatarUrl}
                      alt={channelData?.title || 'Channel Avatar'}
                      className="w-20 h-20 sm:w-26 sm:h-26 rounded-full object-cover border-4 border-white ring-2 ring-[#DDD0FA] bg-white shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9061F9] border-4 border-white flex items-center justify-center font-extrabold text-[28px] text-white shadow-md">
                      {channelData?.title?.charAt(0) || 'Y'}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F3EEFE] border border-[#DDD0FA] rounded-full whitespace-nowrap shrink-0 shadow-2xs">
                    {isVideo ? 'Video Evaluation' : 'Channel Verification'}
                  </span>
                  {!isVideo && channelData?.country && (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#635B80] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#EDE8F9] whitespace-nowrap shrink-0">
                      <Globe className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{channelData.country}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-[22px] sm:text-[28px] font-extrabold text-[#181135] leading-tight break-words tracking-tight">
                  {isVideo ? videoData?.title : channelData?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] sm:text-[14px] text-[#635B80]">
                  {isVideo ? (
                    <span className="font-semibold text-[#181135]">By {videoData?.channelTitle}</span>
                  ) : (
                    <span className="font-mono-data font-bold text-[#7C3AED]">
                      {channelData?.handle || `@${channelData?.title.replace(/\s+/g, '')}`}
                    </span>
                  )}
                  <span className="text-[#DDD0FA]">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-data text-[11px] sm:text-[12px] text-[#635B80] break-all">
                      {data.id}
                    </span>
                    <CopyButton textToCopy={data.id} label="Copy ID" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Big Prominent iOS 26 / Android 16 Liquid Glass Status Capsule & Direct Link */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              {isPositive ? (
                <div
                  id="monetization-status-verdict-pill"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[15px] font-extrabold shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] whitespace-nowrap shrink-0 border border-white/40"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Channel Monetized</span>
                </div>
              ) : (
                <div
                  id="monetization-status-verdict-pill"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-[15px] font-extrabold shadow-[0_10px_25px_-5px_rgba(239,68,68,0.4)] whitespace-nowrap shrink-0 border border-white/40"
                >
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Channel Not Monetized</span>
                </div>
              )}

              <SaveButton
                item={{
                  id: `monetization_${data.id}`,
                  toolId: 'monetization-checker',
                  toolName: 'Monetization Checker',
                  category: 'Monetization',
                  targetType: isVideo ? 'VIDEO' : 'CHANNEL',
                  title: isVideo ? (videoData?.title || 'Video') : (channelData?.title || 'Channel'),
                  handle: isVideo ? videoData?.channelTitle : channelData?.handle,
                  avatarUrl: isVideo
                    ? (videoData?.thumbnails.medium || videoData?.thumbnails.default || undefined)
                    : (channelData?.avatarUrl || undefined),
                  url: isVideo
                    ? `https://www.youtube.com/watch?v=${data.id}`
                    : (channelData?.channelUrl || `https://www.youtube.com/channel/${data.id}`),
                  metaText: isPositive ? 'Channel Monetized' : 'Not Monetized',
                  badgeType: isPositive ? 'success' : 'danger',
                  summary: `Confidence: ${confidence} (${detectedSignalsCount}/${totalSignalsCount} signals)`,
                }}
              />

              <a
                href={
                  isVideo
                    ? `https://www.youtube.com/watch?v=${data.id}`
                    : (channelData?.channelUrl || `https://www.youtube.com/channel/${data.id}`)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold text-[#181135] bg-white/90 hover:bg-white border border-[#DDD0FA] hover:border-[#7C3AED] rounded-2xl shadow-xs transition-all whitespace-nowrap shrink-0"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
              </a>
            </div>
          </div>

          {/* 2. Verdict Explanation Callout */}
          <div
            className={`p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl ${
              isPositive
                ? 'bg-[#10B981]/5 border-[#10B981]/25 shadow-xs'
                : 'bg-[#EF4444]/5 border-[#EF4444]/25 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isPositive ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`}
                />
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#181135]">
                  {isPositive ? 'Verified Commercial Signals' : 'Monetization Inactive / Below Threshold'}
                </span>
              </div>
              <div className="text-[12px] font-medium text-[#635B80] capitalize">
                Signal Confidence: <strong className="text-[#181135]">{confidence}</strong> ({detectedSignalsCount}/{totalSignalsCount} markers)
              </div>
            </div>
            <p className="text-[14px] sm:text-[15px] text-[#181135] leading-relaxed pt-3 font-normal">
              {isZeroActivity
                ? 'This channel currently has 0 videos and 0 subscribers. It does not meet the YouTube Partner Program (YPP) requirements. Projected ad revenue is $0.00.'
                : data.monetization.reason}
            </p>
          </div>

          {/* 3. Channel / Video Information Cards - Glass 3D Cards */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-bold text-[#635B80] uppercase tracking-wider">
              {isVideo ? 'Video Metrics & Classification' : 'Channel Basic Settings & Information'}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {/* Advertising Status */}
              <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#635B80]">Advertising Status</span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isPositive
                        ? 'bg-[#10B981]/15 text-[#10B981]'
                        : 'bg-[#EF4444]/15 text-[#EF4444]'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div
                  className={`text-[16px] sm:text-[18px] font-bold ${
                    isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}
                >
                  {isPositive ? 'Ads are active' : 'No ads active'}
                </div>
                <div className="text-[11px] text-[#635B80]">
                  {isPositive ? 'Commercial ad delivery' : 'No ad monetization'}
                </div>
              </div>

              {/* Authenticity Status */}
              <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#635B80]">Authenticity</span>
                  <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-bold text-[#181135]">
                  {isVideo ? 'Indexed Video' : 'Official Creator'}
                </div>
                <div className="text-[11px] text-[#635B80]">Standard YouTube account</div>
              </div>

              {/* Subscribers */}
              {!isVideo && (
                <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#635B80]">Subscribers</span>
                    <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-[16px] sm:text-[18px] font-mono-data font-bold text-[#181135]">
                    {channelData?.subscriberText || '0'}
                  </div>
                  <div className="text-[11px]">
                    {(channelData?.subscriberCount ?? 0) >= 1000 ? (
                      <span className="text-[#10B981] font-semibold">✓ Meets 1,000 YPP</span>
                    ) : (
                      <span className="text-[#EF4444] font-semibold">Below 1,000 YPP</span>
                    )}
                  </div>
                </div>
              )}

              {/* Views */}
              <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#635B80]">
                    {isVideo ? 'Video Views' : 'Lifetime Views'}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-mono-data font-bold text-[#181135]">
                  {isVideo ? videoData?.viewCountText : channelData?.viewCountText || '0'}
                </div>
                <div className="text-[11px] text-[#635B80]">
                  {isVideo ? 'Public video views' : 'Aggregated channel views'}
                </div>
              </div>

              {/* Videos Count or Duration */}
              <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#635B80]">
                    {isVideo ? 'Duration' : 'Videos Count'}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-mono-data font-bold text-[#181135]">
                  {isVideo ? videoData?.duration || 'Video' : channelData?.videoCountText || '0'}
                </div>
                <div className="text-[11px] text-[#635B80]">
                  {isVideo ? 'Content runtime' : 'Indexed video uploads'}
                </div>
              </div>

              {/* Category */}
              <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#635B80]">Category</span>
                  <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[15px] sm:text-[17px] font-bold text-[#181135]">
                  {isVideo ? videoData?.category || 'Standard' : 'Entertainment / Creator'}
                </div>
                <div className="text-[11px] text-[#635B80]">Primary genre</div>
              </div>

              {/* Kids Content */}
              <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#635B80]">Kids Content</span>
                  <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-bold text-[#181135]">
                  {isVideo && videoData?.restrictions.madeForKids ? 'Yes' : 'No'}
                </div>
                <div className="text-[11px] text-[#635B80]">COPPA designation</div>
              </div>

              {/* Creation Date / Started On */}
              <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#635B80]">Started On</span>
                  <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[14px] sm:text-[16px] font-bold text-[#181135] leading-snug">
                  {data.publishedAt ? formatDate(data.publishedAt) : 'Not specified'}
                </div>
                <div className="text-[11px] text-[#635B80]">Channel launch date</div>
              </div>

              {/* Country / Location */}
              {!isVideo && (
                <div className="p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl space-y-1.5 shadow-[0_4px_16px_-2px_rgba(124,58,237,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#635B80]">Location</span>
                    <div className="w-7 h-7 rounded-xl bg-[#F3EEFE] text-[#7C3AED] flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-[15px] sm:text-[17px] font-bold text-[#181135]">
                    {channelData?.country || 'Global'}
                  </div>
                  <div className="text-[11px] text-[#635B80]">Official country</div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Channel Tags / Keywords Section */}
          {tagsList.length > 0 && (
            <div className="p-5 sm:p-6 bg-white/90 backdrop-blur-xl border border-white rounded-2xl sm:rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#7C3AED]" />
                  <h3 className="text-[14px] font-bold text-[#181135]">
                    {isVideo ? 'Video SEO Tags' : 'Channel Tags & Keywords'} ({tagsList.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAllTags}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-[#7C3AED] bg-[#F3EEFE] hover:bg-[#EAE1FC] border border-[#DDD0FA] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedAllTags ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Copy All Tags</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {tagsList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-[12px] font-medium text-[#181135] bg-[#F6F4FD] border border-[#EDE8F9] rounded-xl hover:border-[#7C3AED] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Public Signals Deep-Dive Checklist */}
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="text-[15px] font-bold text-[#181135]">
                Public Signals Verification ({detectedSignalsCount}/{totalSignalsCount} Active)
              </h3>
              <p className="text-[13px] text-[#635B80] mt-0.5">
                Technical inspection of observable public markers, membership hooks, and advertising cues.
              </p>
            </div>

            <div className="divide-y divide-[#EDE8F9] border border-white rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-xl shadow-xs">
              {data.monetization.signals.map((signal, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex items-start gap-3.5 hover:bg-[#FBF9FE] transition-colors">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      signal.detected
                        ? 'bg-[#10B981]/15 text-[#10B981]'
                        : 'bg-[#F3EEFE] text-[#635B80]'
                    }`}
                  >
                    {signal.detected ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold text-[#181135]">{signal.name}</span>
                      <span
                        className={`text-[11px] font-bold px-3 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                          signal.detected
                            ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                            : 'bg-[#F3EEFE] border-[#EDE8F9] text-[#635B80]'
                        }`}
                      >
                        {signal.detected ? 'Confirmed' : 'Not Observed'}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#635B80] leading-relaxed">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Quick Action Shortcuts */}
          <div className="pt-2">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#635B80] mb-3">
              Explore More Tools for This {isVideo ? 'Video' : 'Channel'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Link
                href={`/earnings-calculator${
                  channelData?.viewCount
                    ? `?views=${Math.round(channelData.viewCount / Math.max(1, channelData.videoCount || 1))}`
                    : ''
                }`}
                className="flex items-center gap-2.5 p-3.5 border border-white bg-white/80 hover:bg-white rounded-2xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#181135] font-semibold"
              >
                <TrendingUp className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span className="truncate">Calculate Earnings</span>
              </Link>

              <Link
                href={`/channel-id-finder?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3.5 border border-white bg-white/80 hover:bg-white rounded-2xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#181135] font-semibold"
              >
                <Radio className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span className="truncate">Channel ID &amp; RSS</span>
              </Link>

              <Link
                href={`/image-downloader?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3.5 border border-white bg-white/80 hover:bg-white rounded-2xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#181135] font-semibold"
              >
                <ImageIcon className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span className="truncate">Download Artwork</span>
              </Link>

              <Link
                href={`/shadowban-detector?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3.5 border border-white bg-white/80 hover:bg-white rounded-2xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#181135] font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span className="truncate">Scan Visibility</span>
              </Link>
            </div>
          </div>

          {/* 7. Legal Disclaimer Note */}
          <div
            id="critical-monetization-disclaimer"
            className="p-5 border border-white/80 bg-white/70 backdrop-blur-md rounded-2xl space-y-1.5 shadow-2xs"
          >
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#181135]">
              <HelpCircle className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <span>Independent Public Signal Observation</span>
            </div>
            <p className="text-[12.5px] text-[#635B80] leading-relaxed">
              Public YouTube data cannot confirm a creator&apos;s official YouTube Partner Program (YPP) contractual status with 100% certainty. YouTube does not expose private creator toggles in any public API. This report is an objective evaluation based on observable public signals (active channel memberships, merchandise stores, ad placement cues, and subscriber benchmarks). YT MONETIZE is not affiliated with YouTube or Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
