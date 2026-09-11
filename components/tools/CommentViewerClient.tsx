'use client';

import React, { useState, useMemo } from 'react';
import { YouTubeInputForm } from '@/components/forms/YouTubeInputForm';
import { ToolLoading } from '@/components/common/ToolLoading';
import { ToolError } from '@/components/common/ToolError';
import { CopyButton } from '@/components/common/CopyButton';
import { SaveButton } from '@/components/common/SaveButton';
import { VideoCommentsResult, YouTubeComment } from '@/lib/youtube/types';
import { formatCompactNumber, formatNumber } from '@/lib/formatters/number';
import {
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Search,
  Filter,
  Trophy,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Clock,
  Eye,
  Calendar,
  X,
  User,
  HelpCircle,
  Layers,
} from 'lucide-react';

type SortOrder = 'relevance' | 'time';
type FilterType = 'all' | 'replies' | 'liked' | 'questions';

export function CommentViewerClient() {
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VideoCommentsResult | null>(null);
  const [commentsList, setCommentsList] = useState<YouTubeComment[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevance');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // Client-side filtering & searching
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Random Comment Picker modal state
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [pickedWinner, setPickedWinner] = useState<YouTubeComment | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  // Copy all state
  const [copiedAll, setCopiedAll] = useState(false);

  const fetchComments = async (input: string, order: SortOrder, pageToken?: string) => {
    if (pageToken) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
      setData(null);
      setCommentsList([]);
      setNextPageToken(null);
    }

    try {
      const res = await fetch('/api/youtube/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          order,
          pageToken,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch comments.');
      }

      const result: VideoCommentsResult = json.data;

      if (pageToken) {
        setCommentsList((prev) => [...prev, ...result.comments]);
      } else {
        setData(result);
        setCommentsList(result.comments);
      }
      setNextPageToken(result.nextPageToken || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while retrieving comments.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = (input: string) => {
    setCurrentInput(input);
    fetchComments(input, sortOrder);
  };

  const handleSortChange = (newOrder: SortOrder) => {
    if (newOrder === sortOrder || !currentInput) return;
    setSortOrder(newOrder);
    fetchComments(currentInput, newOrder);
  };

  const handleLoadMore = () => {
    if (!currentInput || !nextPageToken || loadingMore) return;
    fetchComments(currentInput, sortOrder, nextPageToken);
  };

  // Filter and search comments
  const filteredComments = useMemo(() => {
    return commentsList.filter((comment) => {
      // 1. Text or author search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const textMatch = comment.text.toLowerCase().includes(q);
        const authorMatch = comment.authorName.toLowerCase().includes(q);
        if (!textMatch && !authorMatch) return false;
      }

      // 2. Filter tabs
      if (activeFilter === 'replies') {
        return comment.replyCount > 0;
      }
      if (activeFilter === 'liked') {
        return comment.likeCount >= 10;
      }
      if (activeFilter === 'questions') {
        return comment.text.includes('?');
      }

      return true;
    });
  }, [commentsList, searchQuery, activeFilter]);

  // Compute count of comments for each filter category
  const filterCounts = useMemo(() => {
    let replies = 0;
    let liked = 0;
    let questions = 0;
    for (const c of commentsList) {
      if (c.replyCount > 0) replies++;
      if (c.likeCount >= 10) liked++;
      if (c.text.includes('?')) questions++;
    }
    return {
      all: commentsList.length,
      replies,
      liked,
      questions,
    };
  }, [commentsList]);

  // Pick random winner
  const pickRandomWinner = () => {
    const pool = filteredComments.length > 0 ? filteredComments : commentsList;
    if (pool.length === 0) return;

    setIsPicking(true);
    setWinnerModalOpen(true);

    // Short exciting shuffle effect
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setPickedWinner(pool[randomIndex]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsPicking(false);
      }
    }, 80);
  };

  // Copy all comments text
  const handleCopyAll = () => {
    if (commentsList.length === 0) return;
    const text = commentsList
      .map(
        (c, i) =>
          `#${i + 1} | ${c.authorName} (${c.likeCount} likes, ${c.replyCount} replies)\n${c.text}\n`
      )
      .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Export as JSON file
  const handleExportJSON = () => {
    if (!data || commentsList.length === 0) return;
    const exportData = {
      video: data.video,
      exportedAt: new Date().toISOString(),
      totalLoaded: commentsList.length,
      comments: commentsList,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube_comments_${data.video.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="tool-card-3d p-6 md:p-8 space-y-4">
        <YouTubeInputForm
          id="comment-viewer-form"
          initialValue={currentInput}
          placeholder="Paste YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="View Comments"
          loadingText="Loading comments..."
          isLoading={loading}
          onSubmit={handleSubmit}
        />
        <div className="flex items-center gap-2 text-[13px] text-[#635B80]">
          <MessageSquare className="w-4 h-4 text-[#7C3AED]" />
          <span>Parses public top comments, replies, like counts, and authors.</span>
        </div>
      </div>

      {loading && <ToolLoading message="Connecting to YouTube and retrieving public comments..." />}

      {error && (
        <ToolError
          title="Unable to Retrieve Comments"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Result Section */}
      {data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Video Summary Header Card */}
          <div className="tool-card-3d p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start">
            {/* Thumbnail */}
            <div className="relative w-full md:w-[240px] aspect-video bg-[#181135] shrink-0 overflow-hidden rounded-2xl border border-[#EDE8F9] shadow-2xs">
              {data.video.thumbnail ? (
                <img
                  src={data.video.thumbnail}
                  alt={data.video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#635B80]">
                  <MessageSquare className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Video Details */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#635B80] uppercase tracking-wider">
                  Target Video
                </span>
                <h2 className="text-[18px] sm:text-[22px] font-bold text-[#181135] leading-snug line-clamp-2">
                  {data.video.title}
                </h2>
                <div className="text-[14px] text-[#635B80]">
                  Channel:{' '}
                  <span className="text-[#181135] font-semibold">{data.video.channelTitle}</span>
                </div>
              </div>

              {/* Stats Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {data.video.commentCount !== null && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#EDE8F9] rounded-xl text-[12px] font-semibold text-[#181135] shadow-2xs">
                    <MessageSquare className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>{formatNumber(data.video.commentCount)} Total Comments</span>
                  </div>
                )}
                {data.video.viewCount && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#EDE8F9] rounded-xl text-[12px] font-semibold text-[#181135] shadow-2xs">
                    <Eye className="w-3.5 h-3.5 text-[#635B80]" />
                    <span>{formatCompactNumber(data.video.viewCount)} Views</span>
                  </div>
                )}
                {data.video.likeCount && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#EDE8F9] rounded-xl text-[12px] font-semibold text-[#181135] shadow-2xs">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#635B80]" />
                    <span>{formatCompactNumber(data.video.likeCount)} Likes</span>
                  </div>
                )}
              </div>

              <div className="pt-1 flex items-center gap-3">
                <SaveButton
                  item={{
                    id: `comments_${data.video.id}`,
                    toolId: 'comment-viewer',
                    toolName: 'Comment Viewer',
                    category: 'Engagement',
                    targetType: 'VIDEO',
                    title: data.video.title,
                    handle: data.video.channelTitle,
                    avatarUrl: data.video.thumbnail || undefined,
                    url: `https://www.youtube.com/watch?v=${data.video.id}`,
                    metaText: `${formatNumber(data.video.commentCount || 0)} comments`,
                    badgeType: 'neutral',
                    summary: `${formatCompactNumber(data.video.viewCount || 0)} views • ${formatCompactNumber(data.video.likeCount || 0)} likes`,
                  }}
                />

                <a
                  href={`https://www.youtube.com/watch?v=${data.video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#DDD0FA] rounded-xl text-[13px] text-[#181135] font-semibold hover:text-[#7C3AED] transition-colors shadow-2xs cursor-pointer"
                >
                  <span>Open Video on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
                </a>
              </div>
            </div>
          </div>

          {/* Comments Disabled Notification */}
          {data.commentsDisabled && (
            <div className="p-6 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl flex items-start gap-4 shadow-2xs">
              <AlertCircle className="w-6 h-6 text-[#7C3AED] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-[#181135]">Comments Are Disabled</h3>
                <p className="text-[14px] text-[#635B80] leading-relaxed">
                  The creator of this video has turned off the comment section or YouTube has
                  restricted comments for this upload (such as Made for Kids content). No public
                  comments are available to display.
                </p>
              </div>
            </div>
          )}

          {/* Comments Section & Controls */}
          {!data.commentsDisabled && (
            <div className="tool-card-3d overflow-hidden">
              {/* Toolbar Header */}
              <div className="p-5 border-b border-[#EDE8F9] space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Left: Heading & Count */}
                  <div>
                    <h3 className="text-[18px] font-bold text-[#181135]">
                      Public Comments ({commentsList.length} loaded)
                    </h3>
                    <p className="text-[13px] text-[#635B80]">
                      Showing {filteredComments.length} of {commentsList.length} loaded comments
                    </p>
                  </div>

                  {/* Right: Actions (Sort, Random Picker, Copy/Export) */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Sort Switcher */}
                    <div className="flex items-center border border-[#EDE8F9] bg-white/70 rounded-xl p-1 text-[12px] font-semibold shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleSortChange('relevance')}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          sortOrder === 'relevance'
                            ? 'bg-[#181135] text-white font-bold shadow-2xs'
                            : 'text-[#635B80] hover:text-[#181135]'
                        }`}
                      >
                        Top Comments
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSortChange('time')}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          sortOrder === 'time'
                            ? 'bg-[#181135] text-white font-bold shadow-2xs'
                            : 'text-[#635B80] hover:text-[#181135]'
                        }`}
                      >
                        Newest First
                      </button>
                    </div>

                    {/* Random Comment Picker Button */}
                    <button
                      type="button"
                      onClick={pickRandomWinner}
                      disabled={commentsList.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 hover:bg-white text-[#181135] border border-[#DDD0FA] rounded-xl text-[12px] font-semibold transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
                      title="Pick a random commenter for giveaways or Q&A"
                    >
                      <Trophy className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Pick Random Winner</span>
                    </button>

                    {/* Copy All Comments Button */}
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      disabled={commentsList.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 hover:bg-white text-[#181135] border border-[#DDD0FA] rounded-xl text-[12px] font-semibold transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Copy All</span>
                        </>
                      )}
                    </button>

                    {/* Export JSON Button */}
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      disabled={commentsList.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 hover:bg-white text-[#181135] border border-[#DDD0FA] rounded-xl text-[12px] font-semibold transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
                      title="Download comments as JSON"
                    >
                      <Download className="w-3.5 h-3.5 text-[#635B80]" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {/* Live Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#635B80] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search comments by keyword, author, or question..."
                      className="w-full pl-9 pr-9 py-2 bg-white/80 border border-[#EDE8F9] rounded-xl text-[13px] text-[#181135] placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#7C3AED] focus:bg-white transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#635B80] hover:text-[#181135] cursor-pointer"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills with Distinct Color Accents & Live Counters */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* All Comments */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-all cursor-pointer ${
                        activeFilter === 'all'
                          ? 'btn-siampay-primary text-white border-transparent shadow-2xs'
                          : 'bg-white/70 text-[#181135] border-[#EDE8F9] hover:bg-white'
                      }`}
                    >
                      <Layers className={`w-3.5 h-3.5 ${activeFilter === 'all' ? 'text-white' : 'text-[#635B80]'}`} />
                      <span>All</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                          activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-[#EDE8F9] text-[#7C3AED]'
                        }`}
                      >
                        {filterCounts.all}
                      </span>
                    </button>

                    {/* Has Replies */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter('replies')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-all cursor-pointer ${
                        activeFilter === 'replies'
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                          : 'bg-blue-50/70 text-blue-700 border-blue-200 hover:bg-blue-100/70'
                      }`}
                    >
                      <MessageSquare className={`w-3.5 h-3.5 ${activeFilter === 'replies' ? 'text-white' : 'text-blue-600'}`} />
                      <span>Has Replies</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                          activeFilter === 'replies' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {filterCounts.replies}
                      </span>
                    </button>

                    {/* Most Liked (10+) */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter('liked')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-all cursor-pointer ${
                        activeFilter === 'liked'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-emerald-50/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${activeFilter === 'liked' ? 'text-white' : 'text-emerald-600'}`} />
                      <span>Most Liked (10+)</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                          activeFilter === 'liked' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {filterCounts.liked}
                      </span>
                    </button>

                    {/* Questions (?) */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter('questions')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-all cursor-pointer ${
                        activeFilter === 'questions'
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-2xs'
                          : 'bg-purple-50/70 text-purple-700 border-purple-200 hover:bg-purple-100/70'
                      }`}
                    >
                      <HelpCircle className={`w-3.5 h-3.5 ${activeFilter === 'questions' ? 'text-white' : 'text-[#7C3AED]'}`} />
                      <span>Questions (?)</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                          activeFilter === 'questions' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {filterCounts.questions}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Feed */}
              <div className="divide-y divide-[#EDE8F9]">
                {filteredComments.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <MessageSquare className="w-10 h-10 text-[#635B80] mx-auto opacity-40" />
                    <div className="space-y-1">
                      <h4 className="text-[16px] font-bold text-[#181135]">
                        No matching comments found
                      </h4>
                      <p className="text-[13px] text-[#635B80]">
                        {searchQuery
                          ? `No comments match "${searchQuery}". Try a different keyword.`
                          : 'No comments match the selected filter.'}
                      </p>
                    </div>
                    {(searchQuery || activeFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveFilter('all');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-[#7C3AED] hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                ) : (
                  filteredComments.map((comment, index) => (
                    <div
                      key={comment.id || index}
                      className="p-5 hover:bg-white/60 transition-colors space-y-3"
                    >
                      {/* Author Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full bg-[#EDE8F9] shrink-0 overflow-hidden border border-[#DDD0FA] shadow-2xs">
                            {comment.authorAvatarUrl ? (
                              <img
                                src={comment.authorAvatarUrl}
                                alt={comment.authorName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback placeholder
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#635B80]">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Name & Handle */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {comment.authorChannelUrl ? (
                                <a
                                  href={comment.authorChannelUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[14px] font-semibold text-[#181135] hover:text-[#7C3AED] transition-colors truncate"
                                >
                                  {comment.authorName}
                                </a>
                              ) : (
                                <span className="text-[14px] font-semibold text-[#181135] truncate">
                                  {comment.authorName}
                                </span>
                              )}
                              {comment.isPinned && (
                                <span className="px-2 py-0.5 bg-[#EDE8F9] text-[#7C3AED] text-[11px] font-bold rounded-md">
                                  Pinned
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-[#635B80]">
                              {comment.publishedAt}
                            </div>
                          </div>
                        </div>

                        {/* Quick Copy Single Comment */}
                        <CopyButton
                          textToCopy={comment.text}
                          label="Copy"
                          className="shrink-0 text-[12px] px-2.5 py-1"
                        />
                      </div>

                      {/* Comment Body */}
                      <div className="text-[14px] text-[#181135] leading-relaxed whitespace-pre-line pl-12">
                        {comment.text}
                      </div>

                      {/* Interaction Footer Bar */}
                      <div className="flex items-center gap-4 pl-12 text-[12px] text-[#635B80]">
                        <div className="flex items-center gap-1 font-medium text-[#181135]">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>{formatCompactNumber(comment.likeCount)} likes</span>
                        </div>
                        {comment.replyCount > 0 && (
                          <div className="flex items-center gap-1 font-medium text-[#635B80]">
                            <MessageSquare className="w-3.5 h-3.5 text-[#635B80]" />
                            <span>{formatNumber(comment.replyCount)} replies</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Load More Button */}
              {nextPageToken && (
                <div className="p-5 border-t border-[#EDE8F9] bg-white/40 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="btn-siampay-primary inline-flex items-center gap-2 px-6 py-2.5 text-white text-[13px] font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Loading next batch...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Load More Comments</span>
                      </>
                    )}
                  </button>
                  <p className="text-[12px] text-[#635B80] mt-2">
                    Loads 50 additional comments from YouTube Data API
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Random Winner Picker Modal */}
      {winnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181135]/40 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white/95 backdrop-blur-2xl border border-[#EDE8F9] rounded-3xl max-w-[540px] w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setWinnerModalOpen(false)}
              className="absolute right-4 top-4 text-[#635B80] hover:text-[#181135] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE8F9] text-[#7C3AED] flex items-center justify-center mx-auto shadow-2xs border border-[#DDD0FA]">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] sm:text-[24px] font-bold text-[#181135]">
                Random Comment Winner
              </h3>
              <p className="text-[13px] text-[#635B80]">
                Selected randomly from {filteredComments.length} loaded comments
              </p>
            </div>

            {/* Winner Card */}
            {pickedWinner && (
              <div
                className={`p-5 bg-white/80 rounded-2xl border ${
                  isPicking ? 'border-[#7C3AED] animate-pulse' : 'border-emerald-500'
                } space-y-4 shadow-2xs`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#EDE8F9] shrink-0 overflow-hidden border border-[#DDD0FA]">
                    {pickedWinner.authorAvatarUrl ? (
                      <img
                        src={pickedWinner.authorAvatarUrl}
                        alt={pickedWinner.authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#635B80]">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-bold text-[#181135] truncate">
                      {pickedWinner.authorName}
                    </h4>
                    <div className="text-[12px] text-[#635B80] flex items-center gap-2">
                      <span>{pickedWinner.publishedAt}</span>
                      <span>•</span>
                      <span>{pickedWinner.likeCount} likes</span>
                    </div>
                  </div>
                </div>

                <div className="text-[14px] text-[#181135] leading-relaxed bg-white/70 p-3.5 border border-[#EDE8F9] rounded-xl max-h-[140px] overflow-y-auto whitespace-pre-line">
                  &ldquo;{pickedWinner.text}&rdquo;
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWinnerModalOpen(false)}
                className="px-4 py-2 border border-[#EDE8F9] rounded-xl text-[13px] font-semibold text-[#181135] hover:bg-white/80 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={pickRandomWinner}
                disabled={isPicking}
                className="btn-siampay-primary inline-flex items-center gap-1.5 px-5 py-2 text-white text-[13px] font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <RotateCcw className={`w-4 h-4 ${isPicking ? 'animate-spin' : ''}`} />
                <span>Pick Another Winner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
