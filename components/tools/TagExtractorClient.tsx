'use client';

import React, { useState } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { SaveButton } from '@/components/common/SaveButton';
import { VideoData } from '@/lib/youtube/types';
import { Tag as TagIcon, Hash, ShieldCheck, ExternalLink } from 'lucide-react';

export function TagExtractorClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [video, setVideo] = useState<VideoData | null>(null);

  const handleExtract = async (input: string) => {
    setLoading(true);
    setError(null);
    setVideo(null);

    try {
      const res = await fetch('/api/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, tool: 'tag-extractor' }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to extract tags.');
      }

      if (json.type !== 'VIDEO') {
        throw new Error('Please provide an individual YouTube video URL (e.g. youtube.com/watch?v=... or youtu.be/...) to inspect video SEO tags.');
      }

      const videoData = json.data as VideoData;
      setVideo(videoData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error extracting tags.');
    } finally {
      setLoading(false);
    }
  };

  const tags = video?.tags || [];
  const commaSeparatedTags = tags.join(', ');

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs rounded-2xl">
        <YouTubeInputForm
          id="tag-extractor-form"
          initialValue={inputValue}
          placeholder="Paste YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="Extract Tags"
          loadingText="Extracting tags..."
          isLoading={loading}
          onSubmit={handleExtract}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#5B6169]">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
          <span>Parses public search tags directly from video source metadata.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Parsing video metadata and extracting hidden SEO tags..." />}
      {error && (
        <ToolError
          title="Tag Extraction Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {video && (
        <div className="bg-white border border-[#E3E2DE] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-[#F0EFEB]">
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                Video Found
              </span>
              <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C] leading-snug">
                {video.title}
              </h2>
              <div className="text-[13px] text-[#5B6169]">
                Channel: <span className="text-[#16181C] font-semibold">{video.channelTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <SaveButton
                item={{
                  id: `tags_${video.id}`,
                  toolId: 'tag-extractor',
                  toolName: 'Tag Extractor',
                  category: 'SEO',
                  targetType: 'VIDEO',
                  title: video.title,
                  handle: video.channelTitle,
                  avatarUrl: video.thumbnails.medium || video.thumbnails.default || undefined,
                  url: `https://www.youtube.com/watch?v=${video.id}`,
                  metaText: `${tags.length} SEO Tags`,
                  badgeType: 'neutral',
                  summary: tags.slice(0, 5).join(', ') || 'No tags found',
                }}
              />

              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E3E2DE] bg-[#F9F9F8] hover:bg-white rounded-xl text-[13px] font-medium text-[#16181C] transition-colors"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {tags.length === 0 ? (
            <div className="p-8 text-center bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl space-y-2">
              <TagIcon className="w-8 h-8 text-[#5B6169] mx-auto opacity-50" />
              <div className="font-bold text-[15px] text-[#16181C]">No Public Tags Found</div>
              <p className="text-[13px] text-[#5B6169] max-w-md mx-auto">
                This creator did not specify custom search tags for this video, or they rely exclusively on title and description keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EFEB]">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#D6293C]" />
                  <span className="font-bold text-[15px] text-[#16181C]">
                    {tags.length} Tags Extracted
                  </span>
                </div>
                <CopyButton
                  id="copy-all-tags-btn"
                  textToCopy={commaSeparatedTags}
                  label="Copy All Tags"
                />
              </div>

              {/* Tag Badges */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Individual Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(tag);
                      }}
                      title="Click to copy tag"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F9F9F8] border border-[#E3E2DE] hover:border-[#16181C] hover:bg-white rounded-lg active:scale-95 transition-all text-[13px] text-[#16181C] font-mono-data cursor-pointer"
                    >
                      <span className="text-[#9E9E9E]">#</span>
                      <span className="font-medium">{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Raw Box */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Raw Comma-Separated String
                </div>
                <div className="p-3.5 bg-[#F9F9F8] border border-[#E3E2DE] rounded-xl font-mono-data text-[12px] text-[#16181C] break-all select-all leading-relaxed">
                  {commaSeparatedTags}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
