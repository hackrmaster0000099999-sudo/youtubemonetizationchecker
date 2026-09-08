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
      {/* 1. Main Header Card with 2026 Visual Identity */}
      <div className="tool-card-3d overflow-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-32 sm:h-44 bg-gradient-to-r from-[#16181C] via-[#2D3139] to-[#16181C] border-b border-[#E8E7E3] overflow-hidden">
          {!isVideo && channelData?.bannerUrl ? (
            <img
              src={channelData.bannerUrl}
              alt={`${channelData.title} Banner`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-between px-8 opacity-20 pointer-events-none">
              <div className="text-white text-[24px] font-mono-data tracking-widest uppercase">
                {isVideo ? 'VIDEO ANALYSIS' : 'CHANNEL REPORT'}
              </div>
              <div className="w-32 h-32 rounded-full border-4 border-white/20 -mr-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Identity & Status Row */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#F0EFEB] -mt-14 sm:-mt-16 relative z-10">
            {/* Left: Avatar + Title */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
              {isVideo ? (
                <div className="relative shrink-0">
                  <img
                    src={videoData?.thumbnails.medium || videoData?.thumbnails.default || ''}
                    alt={videoData?.title || 'Video Thumbnail'}
                    className="w-32 h-20 sm:w-36 sm:h-22 object-cover rounded-2xl border-4 border-white bg-[#FCFCFB] shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-white text-[11px] font-mono-data font-medium rounded">
                    {videoData?.duration || 'Video'}
                  </div>
                </div>
              ) : (
                <div className="relative shrink-0">
                  {channelData?.avatarUrl ? (
                    <img
                      src={channelData.avatarUrl}
                      alt={channelData?.title || 'Channel Avatar'}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white ring-1 ring-[#E8E7E3] bg-[#FCFCFB] shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F2F1EE] border-4 border-white flex items-center justify-center font-extrabold text-[28px] text-[#16181C] shadow-md">
                      {channelData?.title?.charAt(0) || 'Y'}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#5B6169] bg-[#F2F1EE] border border-[#E8E7E3] rounded-full whitespace-nowrap shrink-0">
                    {isVideo ? 'Video Evaluation' : 'Channel Verification'}
                  </span>
                  {!isVideo && channelData?.country && (
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#5B6169] whitespace-nowrap shrink-0">
                      <Globe className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>{channelData.country}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#16181C] leading-tight break-words">
                  {isVideo ? videoData?.title : channelData?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] sm:text-[14px] text-[#5B6169]">
                  {isVideo ? (
                    <span className="font-semibold text-[#16181C]">By {videoData?.channelTitle}</span>
                  ) : (
                    <span className="font-mono-data font-bold text-[#16181C]">
                      {channelData?.handle || `@${channelData?.title.replace(/\s+/g, '')}`}
                    </span>
                  )}
                  <span className="text-[#C4C4C0]">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-data text-[11px] sm:text-[12px] text-[#5B6169] break-all">
                      {data.id}
                    </span>
                    <CopyButton textToCopy={data.id} label="Copy ID" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Big Prominent 2026 Status Pill & Direct Link */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              {isPositive ? (
                <div
                  id="monetization-status-verdict-pill"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E9E6B] text-white text-[14px] sm:text-[15px] font-extrabold shadow-sm whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Channel Monetized</span>
                </div>
              ) : (
                <div
                  id="monetization-status-verdict-pill"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6293C] text-white text-[14px] sm:text-[15px] font-extrabold shadow-sm whitespace-nowrap shrink-0"
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-[#16181C] bg-white border border-[#E8E7E3] hover:border-[#16181C] rounded-xl hover:shadow-xs transition-all whitespace-nowrap shrink-0"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5B6169]" />
              </a>
            </div>
          </div>

          {/* 2. Verdict Explanation Callout */}
          <div
            className={`p-5 rounded-2xl border ${
              isPositive
                ? 'bg-[rgba(30,158,107,0.05)] border-[rgba(30,158,107,0.25)]'
                : 'bg-[#FFF1F2] border-[#FECDD3]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isPositive ? 'bg-[#1E9E6B]' : 'bg-[#D6293C]'
                  }`}
                />
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#16181C]">
                  {isPositive ? 'Verified Commercial Signals' : 'Monetization Inactive / Below Threshold'}
                </span>
              </div>
              <div className="text-[12px] font-medium text-[#5B6169] capitalize">
                Signal Confidence: {confidence} ({detectedSignalsCount}/{totalSignalsCount} markers)
              </div>
            </div>
            <p className="text-[14px] text-[#16181C] leading-relaxed pt-3">
              {isZeroActivity
                ? 'This channel currently has 0 videos and 0 subscribers. It does not meet the YouTube Partner Program (YPP) requirements. Projected ad revenue is $0.00.'
                : data.monetization.reason}
            </p>
          </div>

          {/* 3. Channel / Video Information Cards (2026 Reference Design Grid) */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-bold text-[#5B6169] uppercase tracking-wider">
              {isVideo ? 'Video Metrics & Classification' : 'Channel Basic Settings & Information'}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {/* Advertising Status */}
              <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#5B6169]">Advertising Status</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isPositive
                        ? 'bg-[rgba(30,158,107,0.1)] text-[#1E9E6B]'
                        : 'bg-[#FFF1F2] text-[#D6293C]'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div
                  className={`text-[16px] sm:text-[18px] font-bold ${
                    isPositive ? 'text-[#1E9E6B]' : 'text-[#D6293C]'
                  }`}
                >
                  {isPositive ? 'Ads are active' : 'No ads active'}
                </div>
                <div className="text-[11px] text-[#5B6169]">
                  {isPositive ? 'Commercial ad delivery' : 'No ad monetization'}
                </div>
              </div>

              {/* Authenticity Status */}
              <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#5B6169]">Authenticity</span>
                  <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#16181C] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-bold text-[#16181C]">
                  {isVideo ? 'Indexed Video' : 'Official Creator'}
                </div>
                <div className="text-[11px] text-[#5B6169]">Standard YouTube account</div>
              </div>

              {/* Subscribers */}
              {!isVideo && (
                <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#5B6169]">Subscribers</span>
                    <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#5B6169] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-[16px] sm:text-[18px] font-mono-data font-bold text-[#16181C]">
                    {channelData?.subscriberText || '0'}
                  </div>
                  <div className="text-[11px]">
                    {(channelData?.subscriberCount ?? 0) >= 1000 ? (
                      <span className="text-[#1E9E6B] font-semibold">✓ Meets 1,000 YPP</span>
                    ) : (
                      <span className="text-[#D6293C] font-semibold">Below 1,000 YPP</span>
                    )}
                  </div>
                </div>
              )}

              {/* Views */}
              <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#5B6169]">
                    {isVideo ? 'Video Views' : 'Lifetime Views'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#5B6169] flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-mono-data font-bold text-[#16181C]">
                  {isVideo ? videoData?.viewCountText : channelData?.viewCountText || '0'}
                </div>
                <div className="text-[11px] text-[#5B6169]">
                  {isVideo ? 'Public video views' : 'Aggregated channel views'}
                </div>
              </div>

              {/* Videos Count or Duration */}
              <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#5B6169]">
                    {isVideo ? 'Duration' : 'Videos Count'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#5B6169] flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-mono-data font-bold text-[#16181C]">
                  {isVideo ? videoData?.duration || 'Video' : channelData?.videoCountText || '0'}
                </div>
                <div className="text-[11px] text-[#5B6169]">
                  {isVideo ? 'Content runtime' : 'Indexed video uploads'}
                </div>
              </div>

              {/* Category */}
              <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#5B6169]">Category</span>
                  <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#5B6169] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[15px] sm:text-[17px] font-bold text-[#16181C]">
                  {isVideo ? videoData?.category || 'Standard' : 'Entertainment / Creator'}
                </div>
                <div className="text-[11px] text-[#5B6169]">Primary genre</div>
              </div>

              {/* Kids Content */}
              <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#5B6169]">Kids Content</span>
                  <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#5B6169] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[16px] sm:text-[18px] font-bold text-[#16181C]">
                  {isVideo && videoData?.restrictions.madeForKids ? 'Yes' : 'No'}
                </div>
                <div className="text-[11px] text-[#5B6169]">COPPA designation</div>
              </div>

              {/* Creation Date / Started On */}
              <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#5B6169]">Started On</span>
                  <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#5B6169] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[14px] sm:text-[16px] font-bold text-[#16181C] leading-snug">
                  {data.publishedAt ? formatDate(data.publishedAt) : 'Not specified'}
                </div>
                <div className="text-[11px] text-[#5B6169]">Channel launch date</div>
              </div>

              {/* Country / Location */}
              {!isVideo && (
                <div className="p-4 bg-white border border-[#E8E7E3] rounded-2xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#5B6169]">Location</span>
                    <div className="w-7 h-7 rounded-full bg-[#F2F1EE] text-[#5B6169] flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-[15px] sm:text-[17px] font-bold text-[#16181C]">
                    {channelData?.country || 'Global'}
                  </div>
                  <div className="text-[11px] text-[#5B6169]">Official country</div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Channel Tags / Keywords Section (From Reference Screenshot) */}
          {tagsList.length > 0 && (
            <div className="p-5 bg-white border border-[#E8E7E3] rounded-2xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D6293C]" />
                  <h3 className="text-[14px] font-bold text-[#16181C]">
                    {isVideo ? 'Video SEO Tags' : 'Channel Tags & Keywords'} ({tagsList.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAllTags}
                  className="inline-flex items-center gap-1 px-3 py-1 text-[12px] font-semibold text-[#16181C] bg-[#FCFCFB] hover:bg-white border border-[#E8E7E3] hover:border-[#16181C] rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedAllTags ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>Copy All Tags</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {tagsList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[12px] font-medium text-[#16181C] bg-[#F7F6F3] border border-[#E8E7E3] rounded-lg hover:border-[#16181C] transition-colors"
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
              <h3 className="text-[15px] font-bold text-[#16181C]">
                Public Signals Verification ({detectedSignalsCount}/{totalSignalsCount} Active)
              </h3>
              <p className="text-[13px] text-[#5B6169] mt-0.5">
                Technical inspection of observable public markers, membership hooks, and advertising cues.
              </p>
            </div>

            <div className="divide-y divide-[#F0EFEB] border border-[#E8E7E3] rounded-2xl overflow-hidden bg-white shadow-2xs">
              {data.monetization.signals.map((signal, idx) => (
                <div key={idx} className="p-4 flex items-start gap-3.5 hover:bg-[#FCFCFB] transition-colors">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      signal.detected
                        ? 'bg-[rgba(30,158,107,0.12)] text-[#1E9E6B]'
                        : 'bg-[#F2F1EE] text-[#5B6169]'
                    }`}
                  >
                    {signal.detected ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#C77C11]" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold text-[#16181C]">{signal.name}</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                          signal.detected
                            ? 'bg-[rgba(30,158,107,0.08)] border-[rgba(30,158,107,0.2)] text-[#1E9E6B]'
                            : 'bg-[#F2F1EE] border-[#E8E7E3] text-[#5B6169]'
                        }`}
                      >
                        {signal.detected ? 'Confirmed' : 'Not Observed'}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#5B6169] leading-relaxed">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Quick Action Shortcuts */}
          <div className="pt-2">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#5B6169] mb-3">
              Explore More Tools for This {isVideo ? 'Video' : 'Channel'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Link
                href={`/earnings-calculator${
                  channelData?.viewCount
                    ? `?views=${Math.round(channelData.viewCount / Math.max(1, channelData.videoCount || 1))}`
                    : ''
                }`}
                className="flex items-center gap-2.5 p-3.5 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white rounded-xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#16181C] font-semibold"
              >
                <TrendingUp className="w-4 h-4 text-[#D6293C] shrink-0" />
                <span className="truncate">Calculate Earnings</span>
              </Link>

              <Link
                href={`/channel-id-finder?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3.5 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white rounded-xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#16181C] font-semibold"
              >
                <Radio className="w-4 h-4 text-[#5B6169] shrink-0" />
                <span className="truncate">Channel ID &amp; RSS</span>
              </Link>

              <Link
                href={`/image-downloader?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3.5 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white rounded-xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#16181C] font-semibold"
              >
                <ImageIcon className="w-4 h-4 text-[#5B6169] shrink-0" />
                <span className="truncate">Download Artwork</span>
              </Link>

              <Link
                href={`/shadowban-detector?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3.5 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white rounded-xl shadow-2xs hover:shadow-xs transition-all text-[13px] text-[#16181C] font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-[#5B6169] shrink-0" />
                <span className="truncate">Scan Visibility</span>
              </Link>
            </div>
          </div>

          {/* 7. Legal Disclaimer Note */}
          <div
            id="critical-monetization-disclaimer"
            className="p-5 border border-[#E8E7E3] bg-[#FCFCFB] rounded-2xl space-y-1.5 shadow-2xs"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#16181C]">
              <HelpCircle className="w-4 h-4 text-[#5B6169] shrink-0" />
              <span>Independent Public Signal Observation</span>
            </div>
            <p className="text-[13px] text-[#5B6169] leading-relaxed">
              Public YouTube data cannot confirm a creator&apos;s official YouTube Partner Program (YPP) contractual status with 100% certainty. YouTube does not expose private creator toggles in any public API. This report is an objective evaluation based on observable public signals (active channel memberships, merchandise stores, ad placement cues, and subscriber benchmarks). YT MONETIZE is not affiliated with YouTube or Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
