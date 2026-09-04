'use client';

import React from 'react';
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
} from 'lucide-react';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { CopyButton } from '@/components/common/CopyButton';
import { formatDate } from '@/lib/formatters/number';

interface MonetizationResultViewProps {
  type: 'CHANNEL' | 'VIDEO';
  channelData?: ChannelData;
  videoData?: VideoData;
}

export function MonetizationResultView({ type, channelData, videoData }: MonetizationResultViewProps) {
  const isVideo = type === 'VIDEO' && Boolean(videoData);
  const data = isVideo ? videoData! : channelData!;

  const status = data.monetization.status;
  const isPositive = status === 'Likely Monetized' || status === 'Monetization Signals Detected';
  const confidence = data.monetization.confidence;
  const detectedSignalsCount = data.monetization.signals.filter((s) => s.detected).length;
  const totalSignalsCount = data.monetization.signals.length;

  return (
    <div id="monetization-result-container" className="space-y-6 my-8">
      {/* 1. Main Result & Identity Header Card */}
      <div className="bg-white border border-[#E8E7E3] overflow-hidden">
        {/* Optional Banner Backdrop for Channel */}
        {!isVideo && channelData?.bannerUrl && (
          <div className="relative w-full h-28 md:h-36 bg-[#F2F1EE] border-b border-[#E8E7E3] overflow-hidden">
            <img
              src={channelData.bannerUrl}
              alt={`${channelData.title} Banner`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          {/* Identity Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E7E3]">
            <div className="flex items-start md:items-center gap-4">
              {isVideo ? (
                <div className="relative shrink-0">
                  <img
                    src={videoData?.thumbnails.medium || videoData?.thumbnails.default || ''}
                    alt={videoData?.title || 'Video Thumbnail'}
                    className="w-32 h-20 md:w-36 md:h-22 object-cover border border-[#E8E7E3] bg-[#FCFCFB]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-[11px] font-mono-data font-medium">
                    {videoData?.duration || 'Video'}
                  </div>
                </div>
              ) : (
                <div className="relative shrink-0">
                  <img
                    src={channelData?.avatarUrl || ''}
                    alt={channelData?.title || 'Channel Avatar'}
                    className="w-18 h-18 md:w-20 md:h-20 rounded-full object-cover border-2 border-white ring-1 ring-[#E8E7E3] bg-[#FCFCFB]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#5B6169] bg-[#F2F1EE] border border-[#E8E7E3]">
                    {isVideo ? 'Video Evaluation' : 'Verified Channel'}
                  </span>
                  {!isVideo && channelData?.country && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[12px] text-[#5B6169]">
                      <Globe className="w-3 h-3 text-[#5B6169]" />
                      <span>{channelData.country}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-[22px] md:text-[24px] font-semibold text-[#16181C] leading-snug break-words">
                  {isVideo ? videoData?.title : channelData?.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#5B6169]">
                  {isVideo ? (
                    <span className="font-medium text-[#16181C]">By {videoData?.channelTitle}</span>
                  ) : (
                    <span className="font-mono-data font-medium text-[#16181C]">
                      {channelData?.handle || `@${channelData?.title.replace(/\s+/g, '')}`}
                    </span>
                  )}
                  {isVideo && videoData?.publishedAt && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5B6169]" />
                        {formatDate(videoData.publishedAt)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Open Button */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <a
                href={isVideo ? `https://www.youtube.com/watch?v=${data.id}` : (channelData?.channelUrl || `https://www.youtube.com/channel/${data.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-[#16181C] bg-white border border-[#E8E7E3] hover:border-[#16181C] transition-colors"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5B6169]" />
              </a>
            </div>
          </div>

          {/* 2. Primary Verdict Banner */}
          <div
            className={`p-6 border ${
              isPositive
                ? 'bg-[rgba(30,158,107,0.04)] border-[rgba(30,158,107,0.25)]'
                : 'bg-[rgba(199,124,17,0.04)] border-[rgba(199,124,17,0.25)]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E7E3]">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isPositive
                      ? 'bg-[rgba(30,158,107,0.12)] text-[#1E9E6B]'
                      : 'bg-[rgba(199,124,17,0.12)] text-[#C77C11]'
                  }`}
                >
                  {isPositive ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-[#5B6169]">
                    Monetization Status Verdict
                  </div>
                  <div className="text-[20px] md:text-[22px] font-bold text-[#16181C] tracking-tight">
                    {status}
                  </div>
                </div>
              </div>

              {/* Confidence Meter Badge */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] font-semibold uppercase text-[#5B6169]">Signal Confidence</div>
                  <div className="text-[13px] font-medium text-[#16181C] capitalize">
                    {confidence} Confidence ({detectedSignalsCount}/{totalSignalsCount} signals)
                  </div>
                </div>
                <div
                  id="monetization-status-pill"
                  className={`px-3 py-1.5 text-[13px] font-semibold tracking-wide border ${
                    isPositive
                      ? 'bg-[rgba(30,158,107,0.12)] border-[rgba(30,158,107,0.3)] text-[#1E9E6B]'
                      : 'bg-[rgba(199,124,17,0.12)] border-[rgba(199,124,17,0.3)] text-[#C77C11]'
                  }`}
                >
                  {isPositive ? 'Verified Active' : 'Limited Signals'}
                </div>
              </div>
            </div>

            {/* Verdict Explanation */}
            <p className="text-[14px] text-[#16181C] leading-relaxed pt-4">
              {data.monetization.reason}
            </p>
          </div>

          {/* 3. Fast Reference Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FCFCFB] border border-[#E8E7E3] text-[13px]">
            <div className="flex items-center justify-between gap-2 px-2 py-1">
              <span className="text-[#5B6169]">{isVideo ? 'Video ID:' : 'Canonical Channel ID:'}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono-data font-semibold text-[#16181C]">{data.id}</span>
                <CopyButton textToCopy={data.id} label="Copy ID" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 py-1 border-t sm:border-t-0 sm:border-l border-[#E8E7E3]">
              <span className="text-[#5B6169]">{isVideo ? 'Channel ID:' : 'Canonical URL:'}</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono-data text-[#16181C] truncate max-w-[170px] sm:max-w-[200px]">
                  {isVideo ? videoData?.channelId : (channelData?.channelUrl || `https://youtube.com/channel/${data.id}`)}
                </span>
                <CopyButton
                  textToCopy={isVideo ? videoData?.channelId || '' : (channelData?.channelUrl || `https://youtube.com/channel/${data.id}`)}
                  label="Copy"
                />
              </div>
            </div>
          </div>

          {/* 4. Key Performance & Metadata Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-semibold text-[#16181C] uppercase tracking-wider text-[12px] text-[#5B6169]">
                {isVideo ? 'Video Metrics & Signals' : 'Channel Metrics & YPP Eligibility'}
              </h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {isVideo ? (
                <>
                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Total Views</span>
                    </div>
                    <div className="text-[18px] md:text-[20px] font-mono-data font-semibold text-[#16181C]">
                      {videoData?.viewCountText}
                    </div>
                    <div className="text-[11px] text-[#5B6169]">Public playbacks</div>
                  </div>

                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <Video className="w-3.5 h-3.5" />
                      <span>Duration</span>
                    </div>
                    <div className="text-[18px] md:text-[20px] font-mono-data font-semibold text-[#16181C]">
                      {videoData?.duration || 'Not available'}
                    </div>
                    <div className="text-[11px] text-[#5B6169]">Content length</div>
                  </div>

                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Category</span>
                    </div>
                    <div className="text-[16px] md:text-[18px] font-semibold text-[#16181C] truncate">
                      {videoData?.category || 'Standard Video'}
                    </div>
                    <div className="text-[11px] text-[#5B6169]">Topic classification</div>
                  </div>

                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ad Appropriateness</span>
                    </div>
                    <div className="text-[16px] md:text-[18px] font-semibold text-[#1E9E6B] truncate">
                      {videoData?.restrictions.madeForKids ? 'Kids Restricted' : 'Ad Safe'}
                    </div>
                    <div className="text-[11px] text-[#5B6169]">
                      {videoData?.restrictions.madeForKids ? 'Limited personalized ads' : 'Standard ad formats'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <Users className="w-3.5 h-3.5" />
                      <span>Subscribers</span>
                    </div>
                    <div className="text-[18px] md:text-[20px] font-mono-data font-semibold text-[#16181C]">
                      {channelData?.subscriberText}
                    </div>
                    <div className="text-[11px] font-medium">
                      {(channelData?.subscriberCount ?? 0) >= 1000 ? (
                        <span className="text-[#1E9E6B]">✓ Meets 1,000 YPP goal</span>
                      ) : (
                        <span className="text-[#C77C11]">Below 1,000 YPP threshold</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <Video className="w-3.5 h-3.5" />
                      <span>Public Videos</span>
                    </div>
                    <div className="text-[18px] md:text-[20px] font-mono-data font-semibold text-[#16181C]">
                      {channelData?.videoCountText}
                    </div>
                    <div className="text-[11px] text-[#5B6169]">Indexed uploads</div>
                  </div>

                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lifetime Views</span>
                    </div>
                    <div className="text-[18px] md:text-[20px] font-mono-data font-semibold text-[#16181C]">
                      {channelData?.viewCountText}
                    </div>
                    <div className="text-[11px] text-[#5B6169]">Channel aggregate</div>
                  </div>

                  <div className="p-4 border border-[#E8E7E3] bg-[#FCFCFB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6169]">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Country / Region</span>
                    </div>
                    <div className="text-[16px] md:text-[18px] font-semibold text-[#16181C] truncate">
                      {channelData?.country || 'Global'}
                    </div>
                    <div className="text-[11px] text-[#5B6169]">Official location</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 5. Public Signals Analysis Breakdown */}
          <div className="space-y-4 pt-4 border-t border-[#E8E7E3]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[#16181C]">
                  Public Monetization Signals ({detectedSignalsCount}/{totalSignalsCount} Detected)
                </h3>
                <p className="text-[13px] text-[#5B6169] mt-0.5">
                  Detailed inspection of publicly accessible commercial tags, membership endpoints, and ad metadata.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#E8E7E3] border border-[#E8E7E3] bg-white">
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
                        className={`text-[11px] font-semibold px-2 py-0.5 border ${
                          signal.detected
                            ? 'bg-[rgba(30,158,107,0.08)] border-[rgba(30,158,107,0.2)] text-[#1E9E6B]'
                            : 'bg-[#F2F1EE] border-[#E8E7E3] text-[#5B6169]'
                        }`}
                      >
                        {signal.detected ? 'Signal Confirmed' : 'Signal Absent'}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#5B6169] leading-relaxed">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Quick Action Shortcuts for this Channel/Video */}
          <div className="pt-2">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#5B6169] mb-3">
              Explore More Tools for This {isVideo ? 'Video' : 'Channel'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              <Link
                href={`/earnings-calculator${channelData?.viewCount ? `?views=${Math.round(channelData.viewCount / Math.max(1, channelData.videoCount || 1))}` : ''}`}
                className="flex items-center gap-2.5 p-3 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white transition-all text-[13px] text-[#16181C] font-medium"
              >
                <TrendingUp className="w-4 h-4 text-[#D6293C] shrink-0" />
                <span className="truncate">Calculate Earnings</span>
              </Link>

              <Link
                href={`/channel-id-finder?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white transition-all text-[13px] text-[#16181C] font-medium"
              >
                <Radio className="w-4 h-4 text-[#5B6169] shrink-0" />
                <span className="truncate">Channel ID &amp; RSS</span>
              </Link>

              <Link
                href={`/image-downloader?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white transition-all text-[13px] text-[#16181C] font-medium"
              >
                <ImageIcon className="w-4 h-4 text-[#5B6169] shrink-0" />
                <span className="truncate">Download Artwork</span>
              </Link>

              <Link
                href={`/shadowban-detector?q=${encodeURIComponent(data.id)}`}
                className="flex items-center gap-2.5 p-3 border border-[#E8E7E3] bg-[#FCFCFB] hover:border-[#16181C] hover:bg-white transition-all text-[13px] text-[#16181C] font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-[#5B6169] shrink-0" />
                <span className="truncate">Scan Visibility</span>
              </Link>
            </div>
          </div>

          {/* 7. Critical Estimate Disclaimer per PRD Section 18 */}
          <div
            id="critical-monetization-disclaimer"
            className="p-5 border border-[#E8E7E3] bg-[#FCFCFB] space-y-2"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#16181C]">
              <HelpCircle className="w-4 h-4 text-[#5B6169] shrink-0" />
              <span>Public Observation &amp; Accuracy Transparency</span>
            </div>
            <p className="text-[13px] text-[#5B6169] leading-relaxed">
              Public YouTube data cannot confirm a creator&apos;s official YouTube Partner Program (YPP) contractual status with 100% certainty. YouTube does not expose private creator monetization toggles in any public API. This report is an objective, confidence-weighted evaluation based on observable public signals (e.g. active channel memberships, commercial merchandise integrations, ad metadata signatures, and subscriber thresholds).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

