'use client';

import React, { useState, useId } from 'react';
import { formatCurrency, formatNumber } from '@/lib/formatters/number';
import { DollarSign } from 'lucide-react';

interface NichePreset {
  name: string;
  rpm: number;
}

const NICHES: NichePreset[] = [
  { name: 'Gaming / Streaming', rpm: 2.2 },
  { name: 'Vlogs & Lifestyle', rpm: 3.5 },
  { name: 'Entertainment & Comedy', rpm: 3.0 },
  { name: 'Tech & Software', rpm: 7.5 },
  { name: 'Education & Tutorials', rpm: 5.5 },
  { name: 'Personal Finance & Crypto', rpm: 12.0 },
  { name: 'Business & Real Estate', rpm: 14.5 },
];

export function EarningsCalculatorClient() {
  const viewsInputId = useId();
  const rpmInputId = useId();
  const monetizedPctInputId = useId();

  const [views, setViews] = useState<number>(50000);
  const [rpm, setRpm] = useState<number>(4.5);
  const [monetizedPct, setMonetizedPct] = useState<number>(80);

  // Math: Estimated Revenue = (views * (monetizedPct / 100) / 1000) * rpm
  const effectiveViews = views * (monetizedPct / 100);
  const estimatedRevenue = (effectiveViews / 1000) * rpm;

  const per1k = ((1000 * (monetizedPct / 100)) / 1000) * rpm;
  const per10k = ((10000 * (monetizedPct / 100)) / 1000) * rpm;
  const per100k = ((100000 * (monetizedPct / 100)) / 1000) * rpm;
  const per1m = ((1000000 * (monetizedPct / 100)) / 1000) * rpm;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Column */}
      <div className="lg:col-span-7 p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-6 shadow-xs">
        <h2 className="text-[18px] font-semibold text-[#16181C] border-b border-[#E8E7E3] pb-3">
          Calculation Parameters
        </h2>

        {/* Views Slider & Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor={viewsInputId} className="text-[14px] font-medium text-[#16181C]">
              Estimated Views (Video or Monthly)
            </label>
            <span className="font-mono-data text-[15px] font-semibold text-[#16181C]">
              {formatNumber(views)}
            </span>
          </div>
          <input
            id={viewsInputId}
            type="range"
            min={1000}
            max={2000000}
            step={1000}
            value={views}
            onChange={(e) => setViews(Number(e.target.value))}
            className="w-full accent-[#D6293C] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#5B6169] font-mono-data">
            <span>1K</span>
            <span>500K</span>
            <span>1M</span>
            <span>2M+</span>
          </div>
        </div>

        {/* Niche Presets */}
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#5B6169] block">
            Select Channel Niche Preset (Approx. RPM)
          </label>
          <div className="flex flex-wrap gap-2">
            {NICHES.map((n) => (
              <button
                key={n.name}
                type="button"
                onClick={() => setRpm(n.rpm)}
                className={`px-3 py-1.5 text-[12px] border active:scale-95 transition-all cursor-pointer ${
                  rpm === n.rpm
                    ? 'border-[#16181C] bg-[#16181C] text-white font-medium shadow-xs'
                    : 'border-[#E8E7E3] bg-white text-[#16181C] hover:border-[#16181C]'
                }`}
              >
                {n.name} (${n.rpm.toFixed(1)})
              </button>
            ))}
          </div>
        </div>

        {/* Custom RPM Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <label htmlFor={rpmInputId} className="text-[14px] font-medium text-[#16181C]">
              Custom RPM (Revenue Per 1,000 Monetized Views)
            </label>
            <span className="font-mono-data text-[15px] font-semibold text-[#16181C]">
              ${rpm.toFixed(2)}
            </span>
          </div>
          <input
            id={rpmInputId}
            type="range"
            min={0.5}
            max={25.0}
            step={0.1}
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className="w-full accent-[#D6293C] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#5B6169] font-mono-data">
            <span>$0.50 (Low)</span>
            <span>$5.00 (Avg)</span>
            <span>$15.00 (High)</span>
            <span>$25.00+ (Fin/B2B)</span>
          </div>
        </div>

        {/* Monetized Views % */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor={monetizedPctInputId} className="text-[14px] font-medium text-[#16181C]">
              Monetized Playback Rate (Audience Ad-Block &amp; Premium Ratio)
            </label>
            <span className="font-mono-data text-[15px] font-semibold text-[#16181C]">
              {monetizedPct}%
            </span>
          </div>
          <input
            id={monetizedPctInputId}
            type="range"
            min={30}
            max={100}
            step={5}
            value={monetizedPct}
            onChange={(e) => setMonetizedPct(Number(e.target.value))}
            className="w-full accent-[#D6293C] cursor-pointer"
          />
          <p className="text-[12px] text-[#5B6169]">
            Typically 70%–85% of total views receive ads due to ad blockers, geographic inventory limits, and short viewing durations.
          </p>
        </div>
      </div>

      {/* Results Projection Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-6 md:p-8 bg-[#FCFCFB] border border-[#E8E7E3] space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5B6169]">
              Projected Creator Revenue
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-data text-[36px] md:text-[42px] font-bold text-[#16181C] tracking-tight">
                {formatCurrency(estimatedRevenue)}
              </span>
              <span className="text-[14px] font-medium text-[#5B6169]">USD</span>
            </div>
            <div className="text-[12px] text-[#5B6169]">
              Based on {formatNumber(Math.round(effectiveViews))} monetized playbacks at ${rpm.toFixed(2)} RPM
            </div>
          </div>

          <div className="border-t border-[#E8E7E3] pt-4 space-y-3">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#16181C]">
              Revenue Benchmark Scale
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px] py-1 border-b border-[#E8E7E3]">
                <span className="text-[#5B6169]">1,000 Views</span>
                <span className="font-mono-data font-semibold text-[#16181C]">{formatCurrency(per1k)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] py-1 border-b border-[#E8E7E3]">
                <span className="text-[#5B6169]">10,000 Views</span>
                <span className="font-mono-data font-semibold text-[#16181C]">{formatCurrency(per10k)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] py-1 border-b border-[#E8E7E3]">
                <span className="text-[#5B6169]">100,000 Views</span>
                <span className="font-mono-data font-semibold text-[#16181C]">{formatCurrency(per100k)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] py-1">
                <span className="text-[#5B6169]">1,000,000 Views</span>
                <span className="font-mono-data font-semibold text-[#D6293C]">{formatCurrency(per1m)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
