'use client';

import React, { useState, useId } from 'react';
import {
  TrendingUp,
  DollarSign,
  Eye,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Video,
  Search,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Clock,
  Zap,
} from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';
import { formatNumber, formatDate } from '@/lib/formatters/number';
import { ChannelData, VideoData } from '@/lib/youtube/types';

interface NichePreset {
  name: string;
  rpm: number;
}

const NICHES: NichePreset[] = [
  { name: 'Finance & Crypto', rpm: 12.0 },
  { name: 'Tech & Software', rpm: 7.5 },
  { name: 'Business & Real Estate', rpm: 8.5 },
  { name: 'Health & Fitness', rpm: 4.5 },
  { name: 'Education & How-To', rpm: 5.0 },
  { name: 'Lifestyle & Travel', rpm: 3.5 },
  { name: 'Gaming', rpm: 2.2 },
  { name: 'Entertainment & Comedy', rpm: 2.5 },
  { name: 'News & Commentary', rpm: 3.0 },
];

interface FetchedResource {
  type: 'CHANNEL' | 'VIDEO';
  channel?: ChannelData;
  video?: VideoData;
  isMonetized: boolean;
  unmonetizedReason?: string;
  // Real YouTube Channel Analytics
  realAnalytics?: {
    daysActive: number;
    dailyAvgViews: number;
    monthlyVelocity: number;
    avgViewsPerVideo: number;
    uploadsPerMonth: number;
    lowMonthlyRevenue: number;
    avgMonthlyRevenue: number;
    highMonthlyRevenue: number;
    lowYearlyRevenue: number;
    highYearlyRevenue: number;
  };
}

export function EarningsCalculatorClient() {
  const [views, setViews] = useState<number>(100000);
  const [rpm, setRpm] = useState<number>(3.5);
  const [monetizedPct, setMonetizedPct] = useState<number>(80);
  const [timeframe, setTimeframe] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [contentFormat, setContentFormat] = useState<'LONG_FORM' | 'SHORTS'>('LONG_FORM');

  // Channel/Video Live Lookup
  const [urlInput, setUrlInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedResource, setFetchedResource] = useState<FetchedResource | null>(null);

  const viewsInputId = useId();
  const rpmInputId = useId();
  const monetizedPctInputId = useId();

  const handleFormatChange = (format: 'LONG_FORM' | 'SHORTS') => {
    setContentFormat(format);
    if (format === 'SHORTS') {
      setRpm(0.06);
      if (views < 1000000) setViews(2000000);
    } else {
      setRpm(3.5);
      if (views > 5000000) setViews(100000);
    }
  };

  const handleLiveLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setIsFetching(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/youtube/monetization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Could not inspect this YouTube resource.');
      }

      if (json.data.type === 'VIDEO') {
        const video: VideoData = json.data.video;
        setFetchedResource({
          type: 'VIDEO',
          video,
          isMonetized: json.data.monetization.status === 'Likely Monetized' || json.data.monetization.status === 'Monetization Signals Detected',
        });
        setViews(video.viewCount || 50000);
      } else if (json.data.type === 'CHANNEL') {
        const channel: ChannelData = json.data.channel;
        const totalViews = channel.viewCount ?? 0;
        const vidCount = channel.videoCount ?? 0;
        const subCount = channel.subscriberCount ?? 0;

        const meetsSubs = subCount >= 1000;
        const hasUploads = vidCount > 0;
        const isSignalsPositive =
          channel.monetization.status === 'Likely Monetized' ||
          channel.monetization.status === 'Monetization Signals Detected';

        const isMonetized = meetsSubs && hasUploads && isSignalsPositive;

        let reason = '';
        if (vidCount === 0 && subCount === 0) {
          reason = 'This channel has 0 public videos and 0 subscribers. It does not meet YouTube Partner Program (YPP) requirements.';
        } else if (!meetsSubs) {
          reason = `This channel has ${formatNumber(subCount)} subscribers, which is below the 1,000 subscriber YPP requirement.`;
        } else if (vidCount === 0) {
          reason = 'This channel has 0 public videos uploaded.';
        } else if (!isSignalsPositive) {
          reason = 'No active commercial or monetization markers were detected on this channel.';
        }

        // Real YouTube Channel Math
        const publishedTime = channel.publishedAt ? new Date(channel.publishedAt).getTime() : 0;
        const daysActive = publishedTime > 0 && !isNaN(publishedTime)
          ? Math.max(30, Math.floor((Date.now() - publishedTime) / (1000 * 60 * 60 * 24)))
          : 365;
        const monthsActive = Math.max(1, daysActive / 30.4375);
        const dailyAvgViews = Math.round(totalViews / daysActive);
        const monthlyVelocity = Math.max(0, Math.round(dailyAvgViews * 30.4375));
        const avgViewsPerVideo = Math.round(totalViews / Math.max(1, vidCount));
        const uploadsPerMonth = Number((vidCount / monthsActive).toFixed(1));

        let lowMonthly = 0;
        let avgMonthly = 0;
        let highMonthly = 0;

        if (isMonetized && monthlyVelocity > 0) {
          // Conservative ($1.50 RPM, 75% coverage)
          lowMonthly = Math.round((monthlyVelocity * 0.75 * 1.50) / 1000);
          // Standard ($3.80 RPM, 80% coverage)
          avgMonthly = Math.round((monthlyVelocity * 0.80 * 3.80) / 1000);
          // Premium ($7.50 RPM, 85% coverage)
          highMonthly = Math.round((monthlyVelocity * 0.85 * 7.50) / 1000);
        }

        setFetchedResource({
          type: 'CHANNEL',
          channel,
          isMonetized,
          unmonetizedReason: isMonetized ? undefined : reason,
          realAnalytics: {
            daysActive,
            dailyAvgViews,
            monthlyVelocity,
            avgViewsPerVideo,
            uploadsPerMonth,
            lowMonthlyRevenue: lowMonthly,
            avgMonthlyRevenue: avgMonthly,
            highMonthlyRevenue: highMonthly,
            lowYearlyRevenue: lowMonthly * 12,
            highYearlyRevenue: highMonthly * 12,
          },
        });

        if (isMonetized && monthlyVelocity > 0) {
          setViews(monthlyVelocity);
        } else {
          setViews(0);
        }
      }
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Error inspecting YouTube resource.');
    } finally {
      setIsFetching(false);
    }
  };

  // Math: Revenue calculations
  const effectiveViews = views * (monetizedPct / 100);
  const baseRevenue = (effectiveViews / 1000) * rpm;
  const activeMultiplier = timeframe === 'MONTHLY' ? 1 : 12;
  const displayedRevenue = baseRevenue * activeMultiplier;
  const yearlyEstimatedViews = views * 12;

  const calcMilestone = (mViews: number) => {
    return ((mViews * (monetizedPct / 100)) / 1000) * rpm * activeMultiplier;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount < 10 && amount > 0 ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Channel or Video Fetcher Card (Native Android Surface) */}
      <div className="bg-white border border-[#E3E2DE] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EFEB] pb-4">
          <div className="space-y-1">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#16181C]">
              Channel Real Earnings &amp; RPM Analyzer
            </h2>
            <p className="text-[13px] text-[#5B6169]">
              Enter any YouTube channel URL, @handle, or video link to evaluate verified real view metrics and revenue projections.
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16181C] bg-[#F2F1EE] border border-[#E3E2DE] rounded-full shrink-0">
            Real Data Engine
          </span>
        </div>

        <form onSubmit={handleLiveLookup} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B6169]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste channel URL or @handle (e.g. @MrBeast, @nazar, or youtube.com/@handle)"
                disabled={isFetching}
                className="w-full pl-10 pr-4 py-3 text-[14px] text-[#16181C] bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl placeholder-[#8E95A0] focus:outline-none focus:bg-white focus:border-[#16181C] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isFetching || !urlInput.trim()}
              className="px-6 py-3 text-[14px] font-bold text-white bg-[#16181C] hover:bg-[#2A2E35] active:bg-[#000000] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isFetching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Analyze Channel</span>
                </>
              )}
            </button>
          </div>

          {fetchError && (
            <div className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] text-[13px] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D6293C]" />
              <span>{fetchError}</span>
            </div>
          )}
        </form>

        {/* Display Fetched Resource & Real Metrics */}
        {fetchedResource && (
          <div className="p-4 sm:p-5 bg-[#F9F9F8] border border-[#E3E2DE] rounded-2xl space-y-5">
            {fetchedResource.type === 'CHANNEL' && fetchedResource.channel && (
              <>
                {/* Channel Header Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E7E3]">
                  <div className="flex items-center gap-3 min-w-0">
                    {fetchedResource.channel.avatarUrl ? (
                      <img
                        src={fetchedResource.channel.avatarUrl}
                        alt={fetchedResource.channel.title}
                        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border border-[#E3E2DE] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-full bg-[#E8E7E3] flex items-center justify-center font-bold text-[#16181C] shrink-0">
                        {fetchedResource.channel.title.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-[17px] sm:text-[19px] font-bold text-[#16181C] leading-snug">
                        {fetchedResource.channel.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#5B6169]">
                        {fetchedResource.channel.handle && (
                          <span className="font-mono-data font-semibold text-[#16181C]">
                            {fetchedResource.channel.handle}
                          </span>
                        )}
                        <span className="text-[#C4C4C0]">•</span>
                        <span className="font-mono-data text-[#5B6169] text-[11px] sm:text-[12px] break-all">
                          {fetchedResource.channel.id}
                        </span>
                        <CopyButton textToCopy={fetchedResource.channel.id} label="Copy ID" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {fetchedResource.isMonetized ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-white bg-[#1E9E6B] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Monetized
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-white bg-[#D6293C] shrink-0">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Not Monetized
                      </span>
                    )}

                    <a
                      href={fetchedResource.channel.channelUrl || `https://youtube.com/channel/${fetchedResource.channel.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 text-[12px] font-medium text-[#16181C] bg-white border border-[#E3E2DE] hover:border-[#16181C] rounded-lg shrink-0 transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3 text-[#5B6169]" />
                    </a>
                  </div>
                </div>

                {/* 4 Metric Cards (Native Android Tiles - Zero Clipping) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div className="p-3.5 bg-white border border-[#E3E2DE] rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5B6169]">
                      <Users className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>Subscribers</span>
                    </div>
                    <div className="text-[17px] sm:text-[19px] font-mono-data font-bold text-[#16181C]">
                      {formatNumber(fetchedResource.channel.subscriberCount ?? 0)}
                    </div>
                    <div className="text-[11px] leading-tight">
                      {(fetchedResource.channel.subscriberCount ?? 0) >= 1000 ? (
                        <span className="text-[#1E9E6B] font-semibold">✓ Meets 1K YPP</span>
                      ) : (
                        <span className="text-[#D6293C] font-semibold">Below 1K YPP</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E3E2DE] rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5B6169]">
                      <Eye className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>Lifetime Views</span>
                    </div>
                    <div className="text-[17px] sm:text-[19px] font-mono-data font-bold text-[#16181C]">
                      {formatNumber(fetchedResource.channel.viewCount ?? 0)}
                    </div>
                    <div className="text-[11px] text-[#5B6169] leading-tight">Total audience</div>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E3E2DE] rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5B6169]">
                      <Video className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>Videos</span>
                    </div>
                    <div className="text-[17px] sm:text-[19px] font-mono-data font-bold text-[#16181C]">
                      {formatNumber(fetchedResource.channel.videoCount ?? 0)}
                    </div>
                    <div className="text-[11px] text-[#5B6169] leading-tight">Indexed uploads</div>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E3E2DE] rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5B6169]">
                      <Calendar className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>Registration</span>
                    </div>
                    <div className="text-[14px] sm:text-[15px] font-bold text-[#16181C] leading-snug">
                      {fetchedResource.channel.publishedAt ? formatDate(fetchedResource.channel.publishedAt) : 'Not specified'}
                    </div>
                    <div className="text-[11px] text-[#5B6169] leading-tight">Channel launch</div>
                  </div>
                </div>

                {/* Real YouTube Channel Revenue & Velocity Box */}
                {fetchedResource.isMonetized && fetchedResource.realAnalytics ? (
                  <div className="p-4 sm:p-5 bg-white border border-[#E3E2DE] rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EFEB] pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#1E9E6B]/10 text-[#1E9E6B] flex items-center justify-center">
                          <DollarSign className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[13px] font-bold text-[#16181C]">
                          Real Channel Ad Revenue Range
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5B6169]">
                        Grounded in {formatNumber(fetchedResource.realAnalytics.daysActive)} days active lifespan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-xl bg-[#F9F9F8] border border-[#EAE9E5] space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6169]">
                          Estimated Monthly Earnings
                        </span>
                        <div className="text-[20px] sm:text-[22px] font-mono-data font-extrabold text-[#16181C]">
                          {formatCurrency(fetchedResource.realAnalytics.lowMonthlyRevenue)} – {formatCurrency(fetchedResource.realAnalytics.highMonthlyRevenue)}
                        </div>
                        <p className="text-[11px] text-[#5B6169]">
                          Based on ~{formatNumber(fetchedResource.realAnalytics.monthlyVelocity)} monthly views @ $1.50 - $7.50 RPM
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F9F9F8] border border-[#EAE9E5] space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6169]">
                          Estimated Yearly Earnings
                        </span>
                        <div className="text-[20px] sm:text-[22px] font-mono-data font-extrabold text-[#1E9E6B]">
                          {formatCurrency(fetchedResource.realAnalytics.lowYearlyRevenue)} – {formatCurrency(fetchedResource.realAnalytics.highYearlyRevenue)}
                        </div>
                        <p className="text-[11px] text-[#5B6169]">
                          Annualized projection based on channel current view momentum
                        </p>
                      </div>
                    </div>

                    {/* Secondary Real Analytics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[12px]">
                      <div className="p-2.5 rounded-lg bg-[#F9F9F8] border border-[#EAE9E5]">
                        <span className="text-[#5B6169] block text-[11px]">Daily View Velocity</span>
                        <span className="font-mono-data font-bold text-[#16181C]">
                          ~{formatNumber(fetchedResource.realAnalytics.dailyAvgViews)} views/day
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F9F9F8] border border-[#EAE9E5]">
                        <span className="text-[#5B6169] block text-[11px]">Average Per Video</span>
                        <span className="font-mono-data font-bold text-[#16181C]">
                          ~{formatNumber(fetchedResource.realAnalytics.avgViewsPerVideo)} views
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F9F9F8] border border-[#EAE9E5] col-span-2 sm:col-span-1">
                        <span className="text-[#5B6169] block text-[11px]">Upload Frequency</span>
                        <span className="font-mono-data font-bold text-[#16181C]">
                          ~{fetchedResource.realAnalytics.uploadsPerMonth} uploads/mo
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] text-[13px] leading-relaxed flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#D6293C]" />
                    <div>
                      <span className="font-bold block">Unmonetized Channel — Estimated Earnings: $0.00</span>
                      <span>
                        {fetchedResource.unmonetizedReason || 'This channel does not meet YouTube Partner Program monetization criteria.'}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {fetchedResource.type === 'VIDEO' && fetchedResource.video && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <img
                  src={fetchedResource.video.thumbnails.medium || fetchedResource.video.thumbnails.default || ''}
                  alt={fetchedResource.video.title}
                  className="w-28 h-18 object-cover rounded-xl border border-[#E3E2DE] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-bold uppercase text-[#16181C] bg-[#E8E7E3] rounded-md">
                      Video Found
                    </span>
                    <span className="text-[12px] text-[#5B6169]">
                      by {fetchedResource.video.channelTitle}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#16181C] leading-snug">
                    {fetchedResource.video.title}
                  </h3>
                  <div className="text-[12px] text-[#5B6169] flex flex-wrap items-center gap-x-2">
                    <span><strong>Live Views:</strong> {formatNumber(fetchedResource.video.viewCount)}</span>
                    <span>•</span>
                    <span><strong>Duration:</strong> {fetchedResource.video.duration || 'Standard'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive Simulator (Native Android Segmented Controls & Sliders) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 bg-white border border-[#E3E2DE] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0EFEB] pb-4">
            <h2 className="text-[17px] font-bold text-[#16181C] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#16181C]" />
              Simulator &amp; Custom Projection
            </h2>
            <span className="text-[12px] text-[#5B6169]">Fine-tune variables</span>
          </div>

          {/* Android Segmented Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl">
            {/* Revenue Window */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                Revenue Window
              </label>
              <div className="flex rounded-lg p-1 bg-[#EAE9E5]">
                <button
                  type="button"
                  onClick={() => setTimeframe('MONTHLY')}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all cursor-pointer ${
                    timeframe === 'MONTHLY'
                      ? 'bg-white text-[#16181C] shadow-xs'
                      : 'text-[#5B6169] hover:text-[#16181C]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe('YEARLY')}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all cursor-pointer ${
                    timeframe === 'YEARLY'
                      ? 'bg-white text-[#16181C] shadow-xs'
                      : 'text-[#5B6169] hover:text-[#16181C]'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Content Format */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                Content Format
              </label>
              <div className="flex rounded-lg p-1 bg-[#EAE9E5]">
                <button
                  type="button"
                  onClick={() => handleFormatChange('LONG_FORM')}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all cursor-pointer ${
                    contentFormat === 'LONG_FORM'
                      ? 'bg-white text-[#16181C] shadow-xs'
                      : 'text-[#5B6169] hover:text-[#16181C]'
                  }`}
                >
                  Long-form
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatChange('SHORTS')}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all cursor-pointer ${
                    contentFormat === 'SHORTS'
                      ? 'bg-white text-[#16181C] shadow-xs'
                      : 'text-[#5B6169] hover:text-[#16181C]'
                  }`}
                >
                  Shorts
                </button>
              </div>
            </div>
          </div>

          {/* Views Slider & Input */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label htmlFor={viewsInputId} className="text-[13px] font-bold text-[#16181C]">
                {timeframe === 'MONTHLY' ? 'Monthly Monetizable Views' : 'Annual Monetizable Views'}
              </label>
              <input
                type="number"
                min={0}
                max={100000000}
                step={1000}
                value={views}
                onChange={(e) => setViews(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right font-mono-data text-[15px] font-bold text-[#16181C] bg-[#F9F9F8] px-2.5 py-1 rounded-lg border border-[#E3E2DE] focus:outline-none focus:border-[#16181C]"
              />
            </div>
            <input
              id={viewsInputId}
              type="range"
              min={0}
              max={contentFormat === 'SHORTS' ? 20000000 : 5000000}
              step={contentFormat === 'SHORTS' ? 10000 : 2500}
              value={views}
              onChange={(e) => setViews(Number(e.target.value))}
              className="w-full accent-[#16181C] cursor-pointer h-2 bg-[#EAE9E5] rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-[#5B6169] font-mono-data">
              <span>0</span>
              <span>100K</span>
              <span>1M</span>
              <span>2.5M</span>
              <span>{contentFormat === 'SHORTS' ? '20M+' : '5M+'}</span>
            </div>
          </div>

          {/* Android Horizontal Scrollable Niche Chips */}
          {contentFormat === 'LONG_FORM' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Select Niche Preset (RPM Benchmark)
                </label>
                <span className="text-[11px] text-[#5B6169]">Swipe horizontally →</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x -mx-1 px-1">
                {NICHES.map((n) => (
                  <button
                    key={n.name}
                    type="button"
                    onClick={() => setRpm(n.rpm)}
                    className={`px-3 py-1.5 text-[12px] rounded-xl border transition-all cursor-pointer font-medium whitespace-nowrap shrink-0 ${
                      rpm === n.rpm
                        ? 'border-[#16181C] bg-[#16181C] text-white shadow-xs'
                        : 'border-[#E3E2DE] bg-white text-[#16181C] hover:border-[#16181C]'
                    }`}
                  >
                    {n.name} (${n.rpm.toFixed(1)})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom RPM Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={rpmInputId} className="text-[13px] font-bold text-[#16181C]">
                {contentFormat === 'SHORTS' ? 'Shorts RPM ($/1K views)' : 'Video RPM ($/1K views)'}
              </label>
              <div className="font-mono-data text-[15px] font-bold text-[#16181C]">
                ${rpm.toFixed(2)}
              </div>
            </div>
            <input
              id={rpmInputId}
              type="range"
              min={contentFormat === 'SHORTS' ? 0.01 : 0.5}
              max={contentFormat === 'SHORTS' ? 0.5 : 25.0}
              step={contentFormat === 'SHORTS' ? 0.01 : 0.1}
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-full accent-[#16181C] cursor-pointer h-2 bg-[#EAE9E5] rounded-lg"
            />
          </div>

          {/* Monetized Playback Coverage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={monetizedPctInputId} className="text-[13px] font-bold text-[#16181C]">
                Monetized Playback Coverage
              </label>
              <div className="font-mono-data text-[15px] font-bold text-[#16181C]">
                {monetizedPct}%
              </div>
            </div>
            <input
              id={monetizedPctInputId}
              type="range"
              min={40}
              max={100}
              step={5}
              value={monetizedPct}
              onChange={(e) => setMonetizedPct(Number(e.target.value))}
              className="w-full accent-[#16181C] cursor-pointer h-2 bg-[#EAE9E5] rounded-lg"
            />
            <p className="text-[11px] text-[#5B6169]">
              Accounts for ad blockers, geographic inventory variations, and viewers without ads.
            </p>
          </div>
        </div>

        {/* Results Projection Column (Android Material Card) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E3E2DE] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            {/* Big Prominent Revenue Display */}
            <div className="space-y-1 border-b border-[#F0EFEB] pb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6169]">
                Simulated {timeframe.toLowerCase()} revenue
              </span>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-mono-data text-[36px] sm:text-[42px] font-extrabold text-[#16181C] tracking-tight">
                  {formatCurrency(displayedRevenue)}
                </span>
                <span className="text-[14px] font-bold text-[#5B6169]">USD</span>
              </div>
              <div className="text-[12px] text-[#5B6169]">
                Based on {formatNumber(Math.round(effectiveViews * activeMultiplier))} monetized views @ ${rpm.toFixed(2)} RPM
              </div>
            </div>

            {/* Scale Comparison Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#F9F9F8] border border-[#EAE9E5]">
                <div className="text-[11px] text-[#5B6169]">Monthly Basis</div>
                <div className="font-mono-data font-bold text-[16px] text-[#16181C]">
                  {formatCurrency(baseRevenue)}
                </div>
                <div className="text-[10px] text-[#5B6169] font-mono-data">
                  {formatNumber(views)} views
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F8] border border-[#EAE9E5]">
                <div className="text-[11px] text-[#5B6169]">Annual Basis</div>
                <div className="font-mono-data font-bold text-[16px] text-[#1E9E6B]">
                  {formatCurrency(baseRevenue * 12)}
                </div>
                <div className="text-[10px] text-[#5B6169] font-mono-data">
                  {formatNumber(yearlyEstimatedViews)} views
                </div>
              </div>
            </div>

            {/* Milestone Benchmarks (Protected layout - Zero Clipping) */}
            <div className="space-y-2.5 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B6169]">
                Scale Benchmarks ({timeframe.toLowerCase()})
              </div>
              <div className="space-y-2">
                {[
                  { label: '10,000 Views', count: 10000 },
                  { label: '100,000 Views', count: 100000 },
                  { label: '1,000,000 Views', count: 1000000 },
                  { label: '5,000,000 Views', count: 5000000 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#F9F9F8] border border-[#EAE9E5] text-[13px]"
                  >
                    <span className="text-[#5B6169] font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                    <span className="font-mono-data font-bold text-[#16181C] text-right shrink-0">
                      {formatCurrency(calcMilestone(item.count))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
