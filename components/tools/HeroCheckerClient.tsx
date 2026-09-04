'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { MonetizationResultView } from '@/components/tools/MonetizationResultView';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export function HeroCheckerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    type: 'CHANNEL' | 'VIDEO';
    channelData?: ChannelData;
    videoData?: VideoData;
  } | null>(null);

  const handleLookup = async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to analyze YouTube data.');
      }

      if (json.type === 'VIDEO') {
        setResult({ type: 'VIDEO', videoData: json.data });
      } else {
        setResult({ type: 'CHANNEL', channelData: json.data });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pt-2 text-left">
        <YouTubeInputForm
          id="hero-monetization-form"
          placeholder="Paste YouTube channel or video URL (e.g. youtube.com/@handle)"
          buttonText="Check Now"
          loadingText="Checking..."
          isLoading={loading}
          onSubmit={handleLookup}
        />
      </div>

      {/* Hero Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-[13px] text-[#5B6169]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
          <span>100% Free &amp; No Login</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#C77C11]" />
          <span>Public Signal Analysis</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-[#5B6169]" />
          <span>Private &amp; Anonymous</span>
        </div>
      </div>

      {/* Live Hero Results */}
      {loading && <ToolLoading message="Analyzing YouTube channel &amp; public monetization signals..." />}
      {error && (
        <ToolError
          title="Analysis Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}
      {result && (
        <div className="text-left animate-in fade-in-50 duration-200">
          <MonetizationResultView
            type={result.type}
            channelData={result.channelData}
            videoData={result.videoData}
          />
        </div>
      )}
    </div>
  );
}
