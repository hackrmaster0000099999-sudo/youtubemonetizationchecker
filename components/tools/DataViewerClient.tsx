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
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="data-viewer-form"
          initialValue={inputValue}
          placeholder="Enter any YouTube channel URL, @handle, or video link"
          buttonText="Inspect Metadata"
          loadingText="Fetching schema..."
          isLoading={loading}
          onSubmit={handleInspect}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
        <div className="tool-card-3d p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-[#EDE8F9]">
            <div>
              <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">
                {rawResult.type} Identified
              </span>
              <h2 className="text-[18px] sm:text-[22px] font-bold text-[#181135]">
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-[13px] font-bold rounded-xl cursor-pointer transition-colors ${
                  showJson
                    ? 'btn-siampay-primary text-white border-transparent'
                    : 'border-[#DDD0FA] bg-white/80 text-[#181135] hover:bg-white hover:text-[#7C3AED] shadow-2xs'
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
                <span className="text-[12px] font-bold text-[#635B80] uppercase tracking-wider">
                  Raw JSON Payload
                </span>
                <CopyButton
                  id="copy-json-payload-btn"
                  textToCopy={jsonString}
                  label="Copy JSON"
                />
              </div>
              <pre className="p-4 bg-[#181135] text-emerald-400 rounded-2xl font-mono text-[12px] overflow-x-auto max-h-[480px] border border-[#2D225A]">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider">
                Normalized Technical Schema
              </div>

              <div className="border border-[#EDE8F9] rounded-2xl overflow-hidden text-[13px] bg-white/80 backdrop-blur-md">
                <div className="divide-y divide-[#EDE8F9]">
                  <div className="flex flex-col sm:flex-row p-4 bg-white/60">
                    <span className="w-48 font-bold text-[#635B80]">Resource Type</span>
                    <span className="flex-1 font-mono text-[#181135] font-bold">{rawResult.type}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row p-4 bg-white/40">
                    <span className="w-48 font-bold text-[#635B80]">Resource ID</span>
                    <span className="flex-1 font-mono text-[#181135] font-bold">{rawResult.data.id}</span>
                  </div>

                  {isVideo && videoData ? (
                    <>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/60">
                        <span className="w-48 font-bold text-[#635B80]">Parent Channel ID</span>
                        <span className="flex-1 font-mono text-[#181135]">{videoData.channelId}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/40">
                        <span className="w-48 font-bold text-[#635B80]">Parent Channel Title</span>
                        <span className="flex-1 text-[#181135] font-bold">{videoData.channelTitle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/60">
                        <span className="w-48 font-bold text-[#635B80]">Published At (ISO)</span>
                        <span className="flex-1 font-mono text-[#181135]">{videoData.publishedAt}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/40">
                        <span className="w-48 font-bold text-[#635B80]">Total Public Views</span>
                        <span className="flex-1 font-mono text-[#181135] font-bold">
                          {videoData.viewCount != null ? videoData.viewCount.toLocaleString() : 'Not publicly available'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/60">
                        <span className="w-48 font-bold text-[#635B80]">Duration Format</span>
                        <span className="flex-1 font-mono text-[#181135]">{videoData.duration}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/40">
                        <span className="w-48 font-bold text-[#635B80]">Tags Count</span>
                        <span className="flex-1 font-mono text-[#181135] font-bold">{videoData.tags.length} detected</span>
                      </div>
                    </>
                  ) : channelData ? (
                    <>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/60">
                        <span className="w-48 font-bold text-[#635B80]">Custom URL</span>
                        <span className="flex-1 font-mono text-[#181135]">{channelData.customUrl || 'None assigned'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/40">
                        <span className="w-48 font-bold text-[#635B80]">Handle</span>
                        <span className="flex-1 font-mono text-[#181135] font-bold">{channelData.handle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/60">
                        <span className="w-48 font-bold text-[#635B80]">Subscriber Count</span>
                        <span className="flex-1 font-mono text-[#181135] font-bold">{channelData.subscriberText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/40">
                        <span className="w-48 font-bold text-[#635B80]">Total Public Videos</span>
                        <span className="flex-1 font-mono text-[#181135] font-bold">{channelData.videoCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/60">
                        <span className="w-48 font-bold text-[#635B80]">Lifetime Channel Views</span>
                        <span className="flex-1 font-mono text-[#181135] font-bold">{channelData.viewCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-4 bg-white/40">
                        <span className="w-48 font-bold text-[#635B80]">Creation Date</span>
                        <span className="flex-1 font-mono text-[#181135] font-bold">{formatDate(channelData.publishedAt)}</span>
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
