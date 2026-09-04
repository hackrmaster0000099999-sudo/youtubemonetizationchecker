'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { MonetizationResultView } from '@/components/tools/MonetizationResultView';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { ShieldCheck } from 'lucide-react';

export function MonetizationCheckerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    type: 'CHANNEL' | 'VIDEO';
    channelData?: ChannelData;
    videoData?: VideoData;
  } | null>(null);

  const handleCheck = async (input: string) => {
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
        throw new Error(json.error || 'Failed to analyze monetization.');
      }

      if (json.type === 'VIDEO') {
        setResult({ type: 'VIDEO', videoData: json.data });
      } else {
        setResult({ type: 'CHANNEL', channelData: json.data });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error evaluating monetization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="monetization-page-form"
          placeholder="Enter channel URL, @handle, channel ID, or video link"
          buttonText="Check Monetization"
          loadingText="Analyzing signals..."
          isLoading={loading}
          onSubmit={handleCheck}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#5B6169]">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
          <span>Real-time public signal evaluation. 100% free and anonymous.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Evaluating public YouTube monetization markers and channel data..." />}
      {error && (
        <ToolError
          title="Analysis Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}
      {result && (
        <MonetizationResultView
          type={result.type}
          channelData={result.channelData}
          videoData={result.videoData}
        />
      )}
    </div>
  );
}
