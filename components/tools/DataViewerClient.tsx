'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { ChannelData, VideoData } from '@/lib/youtube/types';
import { formatDate } from '@/lib/formatters/number';
import { Code, ExternalLink, ShieldCheck } from 'lucide-react';

export function DataViewerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        body: JSON.stringify({ input }),
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
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs">
        <YouTubeInputForm
          id="data-viewer-form"
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
          title="Inspection Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {rawResult && (
        <div className="bg-white border border-[#E8E7E3] p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-6 border-b border-[#E8E7E3]">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#5B6169] uppercase tracking-wider">
                {isVideo ? 'Video Metadata' : 'Channel Metadata'}
              </span>
              <h2 className="text-[18px] md:text-[22px] font-semibold text-[#16181C]">
                {isVideo ? videoData?.title : channelData?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border active:scale-95 transition-all cursor-pointer ${
                  showJson
                    ? 'bg-[#16181C] text-white border-[#16181C]'
                    : 'bg-[#FCFCFB] text-[#16181C] border-[#E8E7E3] hover:border-[#16181C]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showJson ? 'Show Formatted Table' : 'Show Raw JSON'}</span>
              </button>
            </div>
          </div>

          {showJson ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#5B6169] uppercase tracking-wider">
                  Raw JSON Data Object
                </span>
                <CopyButton
                  id="copy-json-btn"
                  textToCopy={jsonString}
                  label="Copy JSON"
                />
              </div>
              <pre className="p-4 bg-[#16181C] text-[#E8E7E3] font-mono-data text-[12px] overflow-x-auto leading-relaxed max-h-[500px]">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Structured Key-Value Table */}
              <div className="space-y-2">
                <div className="text-[14px] font-semibold text-[#16181C]">
                  Technical Attributes
                </div>
                <div className="border border-[#E8E7E3] divide-y divide-[#E8E7E3] text-[13px]">
                  {isVideo && videoData ? (
                    <>
                      <div className="flex flex-col sm:flex-row p-3 bg-[#FCFCFB]">
                        <span className="w-48 font-semibold text-[#5B6169]">Video ID</span>
                        <div className="flex-1 flex items-center justify-between font-mono-data text-[#16181C]">
                          <span>{videoData.id}</span>
                          <CopyButton textToCopy={videoData.id} label="Copy" className="text-[11px] py-0.5 px-2" />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-white">
                        <span className="w-48 font-semibold text-[#5B6169]">Channel Title</span>
                        <span className="flex-1 text-[#16181C] font-medium">{videoData.channelTitle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-[#FCFCFB]">
                        <span className="w-48 font-semibold text-[#5B6169]">Channel ID</span>
                        <div className="flex-1 flex items-center justify-between font-mono-data text-[#16181C]">
                          <span>{videoData.channelId}</span>
                          <CopyButton textToCopy={videoData.channelId} label="Copy" className="text-[11px] py-0.5 px-2" />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-white">
                        <span className="w-48 font-semibold text-[#5B6169]">Published Date</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{formatDate(videoData.publishedAt)}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-[#FCFCFB]">
                        <span className="w-48 font-semibold text-[#5B6169]">View Count</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{videoData.viewCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-white">
                        <span className="w-48 font-semibold text-[#5B6169]">Like Count</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{videoData.likeCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-[#FCFCFB]">
                        <span className="w-48 font-semibold text-[#5B6169]">Duration</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{videoData.duration || 'Not specified'}</span>
                      </div>
                    </>
                  ) : channelData ? (
                    <>
                      <div className="flex flex-col sm:flex-row p-3 bg-[#FCFCFB]">
                        <span className="w-48 font-semibold text-[#5B6169]">Channel ID (UC-Format)</span>
                        <div className="flex-1 flex items-center justify-between font-mono-data text-[#16181C]">
                          <span>{channelData.id}</span>
                          <CopyButton textToCopy={channelData.id} label="Copy" className="text-[11px] py-0.5 px-2" />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-white">
                        <span className="w-48 font-semibold text-[#5B6169]">Handle</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{channelData.handle}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-[#FCFCFB]">
                        <span className="w-48 font-semibold text-[#5B6169]">Subscriber Count</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{channelData.subscriberText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-white">
                        <span className="w-48 font-semibold text-[#5B6169]">Total Public Videos</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{channelData.videoCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-[#FCFCFB]">
                        <span className="w-48 font-semibold text-[#5B6169]">Lifetime Channel Views</span>
                        <span className="flex-1 font-mono-data text-[#16181C]">{channelData.viewCountText}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row p-3 bg-white">
                        <span className="w-48 font-semibold text-[#5B6169]">Creation Date</span>
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
