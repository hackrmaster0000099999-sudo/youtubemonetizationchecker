'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { SaveButton } from '@/components/common/SaveButton';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { formatDate } from '@/lib/formatters/number';
import { Code, ExternalLink, ShieldCheck } from 'lucide-react';

export function DataViewerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [rawResult, setRawResult] = useState<{
    type: 'CHANNEL' | 'VIDEO';
    data: ChannelData | VideoData;
  } | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleInspect = async (input: string) => {
    setLoading(true);
    setError(null);
    setRawResult(null);

    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tool: 'data-viewer' }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to inspect YouTube data.');
      }

      setRawResult(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error retrieving resource data.');
    } finally {
      setLoading(false);
    }
  };

  const isVideo = rawResult?.type === 'VIDEO';
  const videoData = isVideo ? (rawResult?.data as VideoData) : null;
  const channelData = !isVideo ? (rawResult?.data as ChannelData) : null;
  const jsonString = rawResult ? JSON.stringify(rawResult.data, null, 2) : '';

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs rounded-2xl">
        <YouTubeInputForm
          id="data-viewer-form"
          initialValue={inputValue}
          placeholder="Enter any YouTube channel URL, @handle, or video link"
          buttonText="Inspect Metadata"
          loadingText="Fetching schema..."
          isLoading={loading}
          onSubmit={handleInspect}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#5B6169]">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
          <span>Inspects normalized technical schema fields, durations, dates, and raw JSON payloads.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Retrieving raw API schema and structured endpoint metadata..." />}
      {error && (
        <ToolError
          title="Data Inspection Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {rawResult && (
        <div className="bg-white border border-[#E3E2DE] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-[#F0EFEB]">
            <div>
              <span className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                {rawResult.type} Identified
              </span>
              <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C]">
                {rawResult.data.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <SaveButton
                item={{
                  id: `data_${rawResult.data.id}`,
                  toolId: 'data-viewer',
                  toolName: 'Data Viewer',
                  category: 'Channel',
                  targetType: rawResult.type === 'VIDEO' ? 'VIDEO' : 'CHANNEL',
                  title: rawResult.data.title,
                  handle:
                    rawResult.type === 'VIDEO'
                      ? (rawResult.data as VideoData).channelTitle
                      : (rawResult.data as ChannelData).handle,
                  avatarUrl:
                    rawResult.type === 'VIDEO'
                      ? (rawResult.data as VideoData).thumbnails.medium || (rawResult.data as VideoData).thumbnails.default || undefined
                      : (rawResult.data as ChannelData).avatarUrl || undefined,
                  url:
                    rawResult.type === 'VIDEO'
                      ? `https://www.youtube.com/watch?v=${rawResult.data.id}`
                      : `https://www.youtube.com/channel/${rawResult.data.id}`,
                  metaText: `${rawResult.type} Schema Data`,
                  badgeType: 'neutral',
                  summary: 'Technical YouTube schema metadata & raw JSON payload',
                }}
              />

              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-[13px] font-semibold rounded-xl cursor-pointer transition-colors ${
                  showJson
                    ? 'border-[#16181C] bg-[#16181C] text-white'
                    : 'border-[#E3E2DE] bg-[#F9F9F8] text-[#16181C] hover:bg-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showJson ? 'View Structured' : 'View JSON Payload'}</span>
              </button>
            </div>
          </div>

          {showJson ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Raw JSON Payload
                </span>
                <CopyButton
                  id="copy-json-payload-btn"
                  textToCopy={jsonString}
                  label="Copy JSON"
                />
              </div>
              <pre className="p-4 bg-[#16181C] text-[#34D399] rounded-xl font-mono-data text-[12px] overflow-x-auto max-h-[480px]">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-[12px] font-bold text-[#5B6169] uppercase tracking-wider">
                Normalized Technical Schema
              </div>

              <div className="border border-[#E3E2DE] rounded-xl overflow-hidden text-[13px]">
                <div className="divide-y divide-[#F0EFEB]">
                  <div className="flex flex-col sm:flex-row p-3.5 bg-white">
                    <span className="w-48 font-bold text-[#5B6169]">Resource Type</span>
                    <span className="flex-1 font-mono-data text-[#16181C]">{rawResult.type}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row p-3.5 bg-[#F9F9F8]">
                    <span className="w-48 font-bold text-[#5B6169]">Resource ID</span>
                    <span className="flex-1 font-mono-data text-[#16181C] font-semibold">{rawResult.data.id}</span>
                  </div>

                  {isVideo && videoData ? (
                    <>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-white">
                        <span className="w-48 font-bold text-[#5B6169]">Parent Channel ID</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{videoData.channelId}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-[#F9F9F8]">
                        <span className="w-48 font-bold text-[#5B6169]">Parent Channel Title</span>
                        <span className="flex-1 text-[#16181C] font-medium">{videoData.channelTitle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-white">
                        <span className="w-48 font-bold text-[#5B6169]">Published At (ISO)</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{videoData.publishedAt}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-[#F9F9F8]">
                        <span className="w-48 font-bold text-[#5B6169]">Total Public Views</span>
                        <span className="flex-1 font-mono-data text-[#16181C] font-semibold">
                          {videoData.viewCount != null ? videoData.viewCount.toLocaleString() : 'Not publicly available'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-white">
                        <span className="w-48 font-bold text-[#5B6169]">Duration Format</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{videoData.duration}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-[#F9F9F8]">
                        <span className="w-48 font-bold text-[#5B6169]">Tags Count</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{videoData.tags.length} detected</span>
                      </div>
                    </>
                  ) : channelData ? (
                    <>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-white">
                        <span className="w-48 font-bold text-[#5B6169]">Custom URL</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{channelData.customUrl || 'None assigned'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-[#F9F9F8]">
                        <span className="w-48 font-bold text-[#5B6169]">Handle</span>
                        <span className="flex-1 font-mono-data text-[#16181C] font-semibold">{channelData.handle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-white">
                        <span className="w-48 font-bold text-[#5B6169]">Subscriber Count</span>
                        <span className="flex-1 font-mono-data text-[#16181C] font-semibold">{channelData.subscriberText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-[#F9F9F8]">
                        <span className="w-48 font-bold text-[#5B6169]">Total Public Videos</span>
                        <span className="flex-1 font-mono-data text-[#16181C] font-semibold">{channelData.videoCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-white">
                        <span className="w-48 font-bold text-[#5B6169]">Lifetime Channel Views</span>
                        <span className="flex-1 font-mono-data text-[#16181C] font-semibold">{channelData.viewCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3.5 bg-[#F9F9F8]">
                        <span className="w-48 font-bold text-[#5B6169]">Creation Date</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{formatDate(channelData.publishedAt)}</span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
