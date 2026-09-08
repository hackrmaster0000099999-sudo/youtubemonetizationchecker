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
      <div className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-4 shadow-xs rounded-2xl">
        <YouTubeInputForm
          id="comment-viewer-form"
          initialValue={currentInput}
          placeholder="Paste YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)"
          buttonText="View Comments"
          loadingText="Loading comments..."
          isLoading={loading}
          onSubmit={handleSubmit}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[13px] text-[#5B6169]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#D6293C]" />
            <span>Parses public top comments, replies, like counts, and authors.</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="text-[#5B6169]">Try sample:</span>
            <button
              type="button"
              onClick={() => handleSubmit('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
              className="text-[#D6293C] font-semibold hover:underline"
            >
              Rick Astley Video
            </button>
          </div>
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
          <div className="bg-white border border-[#E8E7E3] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row gap-5 items-start">
            {/* Thumbnail */}
            <div className="relative w-full md:w-[240px] aspect-video bg-[#16181C] shrink-0 overflow-hidden border border-[#E8E7E3]">
              {data.video.thumbnail ? (
                <img
                  src={data.video.thumbnail}
                  alt={data.video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#5B6169]">
                  <MessageSquare className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Video Details */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
                  Target Video
                </span>
                <h2 className="text-[18px] sm:text-[22px] font-bold text-[#16181C] leading-snug line-clamp-2">
                  {data.video.title}
                </h2>
                <div className="text-[14px] text-[#5B6169]">
                  Channel:{' '}
                  <span className="text-[#16181C] font-semibold">{data.video.channelTitle}</span>
                </div>
              </div>

              {/* Stats Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {data.video.commentCount !== null && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-medium text-[#16181C]">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D6293C]" />
                    <span>{formatNumber(data.video.commentCount)} Total Comments</span>
                  </div>
                )}
                {data.video.viewCount && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-medium text-[#16181C]">
                    <Eye className="w-3.5 h-3.5 text-[#5B6169]" />
                    <span>{formatCompactNumber(data.video.viewCount)} Views</span>
                  </div>
                )}
                {data.video.likeCount && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] border border-[#E8E7E3] text-[12px] font-medium text-[#16181C]">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#5B6169]" />
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
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#D6293C] font-semibold hover:underline"
                >
                  <span>Open Video on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Comments Disabled Notification */}
          {data.commentsDisabled && (
            <div className="p-6 bg-[#FCFCFB] border border-[#E8E7E3] flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#D6293C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-[16px] font-semibold text-[#16181C]">Comments Are Disabled</h3>
                <p className="text-[14px] text-[#5B6169] leading-relaxed">
                  The creator of this video has turned off the comment section or YouTube has
                  restricted comments for this upload (such as Made for Kids content). No public
                  comments are available to display.
                </p>
              </div>
            </div>
          )}

          {/* Comments Section & Controls */}
          {!data.commentsDisabled && (
            <div className="bg-white border border-[#E8E7E3] shadow-xs">
              {/* Toolbar Header */}
              <div className="p-5 border-b border-[#E8E7E3] space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Left: Heading & Count */}
                  <div>
                    <h3 className="text-[18px] font-bold text-[#16181C]">
                      Public Comments ({commentsList.length} loaded)
                    </h3>
                    <p className="text-[13px] text-[#5B6169]">
                      Showing {filteredComments.length} of {commentsList.length} loaded comments
                    </p>
                  </div>

                  {/* Right: Actions (Sort, Random Picker, Copy/Export) */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Sort Switcher */}
                    <div className="flex items-center border border-[#E8E7E3] bg-[#F9F9F8] p-0.5 text-[12px] font-semibold">
                      <button
                        type="button"
                        onClick={() => handleSortChange('relevance')}
                        className={`px-3 py-1.5 transition-colors ${
                          sortOrder === 'relevance'
                            ? 'bg-white text-[#16181C] shadow-2xs font-bold'
                            : 'text-[#5B6169] hover:text-[#16181C]'
                        }`}
                      >
                        Top Comments
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSortChange('time')}
                        className={`px-3 py-1.5 transition-colors ${
                          sortOrder === 'time'
                            ? 'bg-white text-[#16181C] shadow-2xs font-bold'
                            : 'text-[#5B6169] hover:text-[#16181C]'
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F9F9F8] hover:bg-[#F0EFEB] text-[#16181C] border border-[#E8E7E3] text-[12px] font-semibold transition-colors disabled:opacity-50"
                      title="Pick a random commenter for giveaways or Q&A"
                    >
                      <Trophy className="w-3.5 h-3.5 text-[#D6293C]" />
                      <span>Pick Random Winner</span>
                    </button>

                    {/* Copy All Comments Button */}
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      disabled={commentsList.length === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F8] hover:bg-[#F0EFEB] text-[#16181C] border border-[#E8E7E3] text-[12px] font-semibold transition-colors disabled:opacity-50"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1E9E6B]" />
                          <span className="text-[#1E9E6B]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
                          <span>Copy All</span>
                        </>
                      )}
                    </button>

                    {/* Export JSON Button */}
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      disabled={commentsList.length === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F8] hover:bg-[#F0EFEB] text-[#16181C] border border-[#E8E7E3] text-[12px] font-semibold transition-colors disabled:opacity-50"
                      title="Download comments as JSON"
                    >
                      <Download className="w-3.5 h-3.5 text-[#5B6169]" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {/* Live Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#5B6169] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search comments by keyword, author, or question..."
                      className="w-full pl-9 pr-9 py-2 bg-[#F9F9F8] border border-[#E8E7E3] text-[13px] text-[#16181C] placeholder-[#5B6169] focus:outline-hidden focus:border-[#16181C] focus:bg-white"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6169] hover:text-[#16181C]"
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
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold border transition-all ${
                        activeFilter === 'all'
                          ? 'bg-[#16181C] text-white border-[#16181C] shadow-2xs'
                          : 'bg-white text-[#16181C] border-[#E8E7E3] hover:border-[#16181C]/40 hover:bg-[#F9F9F8]'
                      }`}
                    >
                      <Layers className={`w-3.5 h-3.5 ${activeFilter === 'all' ? 'text-white' : 'text-[#5B6169]'}`} />
                      <span>All</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-xs font-bold ${
                          activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-[#F0EFEB] text-[#5B6169]'
                        }`}
                      >
                        {filterCounts.all}
                      </span>
                    </button>

                    {/* Has Replies */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter('replies')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold border transition-all ${
                        activeFilter === 'replies'
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                          : 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] hover:bg-[#DBEAFE]'
                      }`}
                    >
                      <MessageSquare className={`w-3.5 h-3.5 ${activeFilter === 'replies' ? 'text-white' : 'text-[#2563EB]'}`} />
                      <span>Has Replies</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-xs font-bold ${
                          activeFilter === 'replies' ? 'bg-white/20 text-white' : 'bg-[#DBEAFE] text-[#1E40AF]'
                        }`}
                      >
                        {filterCounts.replies}
                      </span>
                    </button>

                    {/* Most Liked (10+) */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter('liked')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold border transition-all ${
                        activeFilter === 'liked'
                          ? 'bg-[#1E9E6B] text-white border-[#1E9E6B] shadow-2xs'
                          : 'bg-[#F0FDF4] text-[#065F46] border-[#A7F3D0] hover:bg-[#DCFCE7]'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${activeFilter === 'liked' ? 'text-white' : 'text-[#1E9E6B]'}`} />
                      <span>Most Liked (10+)</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-xs font-bold ${
                          activeFilter === 'liked' ? 'bg-white/20 text-white' : 'bg-[#D1FAE5] text-[#047857]'
                        }`}
                      >
                        {filterCounts.liked}
                      </span>
                    </button>

                    {/* Questions (?) */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter('questions')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold border transition-all ${
                        activeFilter === 'questions'
                          ? 'bg-[#D6293C] text-white border-[#D6293C] shadow-2xs'
                          : 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA] hover:bg-[#FEE2E2]'
                      }`}
                    >
                      <HelpCircle className={`w-3.5 h-3.5 ${activeFilter === 'questions' ? 'text-white' : 'text-[#D6293C]'}`} />
                      <span>Questions (?)</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-xs font-bold ${
                          activeFilter === 'questions' ? 'bg-white/20 text-white' : 'bg-[#FEE2E2] text-[#B91C1C]'
                        }`}
                      >
                        {filterCounts.questions}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Feed */}
              <div className="divide-y divide-[#E8E7E3]">
                {filteredComments.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <MessageSquare className="w-10 h-10 text-[#5B6169] mx-auto opacity-40" />
                    <div className="space-y-1">
                      <h4 className="text-[16px] font-semibold text-[#16181C]">
                        No matching comments found
                      </h4>
                      <p className="text-[13px] text-[#5B6169]">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#D6293C] hover:underline"
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
                      className="p-5 hover:bg-[#FCFCFB] transition-colors space-y-3"
                    >
                      {/* Author Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full bg-[#E8E7E3] shrink-0 overflow-hidden border border-[#E8E7E3]">
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
                              <div className="w-full h-full flex items-center justify-center text-[#5B6169]">
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
                                  className="text-[14px] font-semibold text-[#16181C] hover:text-[#D6293C] transition-colors truncate"
                                >
                                  {comment.authorName}
                                </a>
                              ) : (
                                <span className="text-[14px] font-semibold text-[#16181C] truncate">
                                  {comment.authorName}
                                </span>
                              )}
                              {comment.isPinned && (
                                <span className="px-2 py-0.5 bg-[#D6293C]/10 text-[#D6293C] text-[11px] font-bold">
                                  Pinned
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-[#5B6169]">
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
                      <div className="text-[14px] text-[#16181C] leading-relaxed whitespace-pre-line pl-12">
                        {comment.text}
                      </div>

                      {/* Interaction Footer Bar */}
                      <div className="flex items-center gap-4 pl-12 text-[12px] text-[#5B6169]">
                        <div className="flex items-center gap-1 font-medium text-[#16181C]">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#5B6169]" />
                          <span>{formatCompactNumber(comment.likeCount)} likes</span>
                        </div>
                        {comment.replyCount > 0 && (
                          <div className="flex items-center gap-1 font-medium text-[#5B6169]">
                            <MessageSquare className="w-3.5 h-3.5 text-[#5B6169]" />
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
                <div className="p-5 border-t border-[#E8E7E3] bg-[#FCFCFB] text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#16181C] hover:bg-[#383B40] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
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
                  <p className="text-[12px] text-[#5B6169] mt-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#E8E7E3] max-w-[540px] w-full p-6 sm:p-8 space-y-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setWinnerModalOpen(false)}
              className="absolute right-4 top-4 text-[#5B6169] hover:text-[#16181C]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#D6293C]/10 text-[#D6293C] flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] sm:text-[24px] font-bold text-[#16181C]">
                Random Comment Winner
              </h3>
              <p className="text-[13px] text-[#5B6169]">
                Selected randomly from {filteredComments.length} loaded comments
              </p>
            </div>

            {/* Winner Card */}
            {pickedWinner && (
              <div
                className={`p-5 bg-[#FCFCFB] border ${
                  isPicking ? 'border-[#D6293C] animate-pulse' : 'border-[#1E9E6B]'
                } space-y-4`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8E7E3] shrink-0 overflow-hidden border border-[#E8E7E3]">
                    {pickedWinner.authorAvatarUrl ? (
                      <img
                        src={pickedWinner.authorAvatarUrl}
                        alt={pickedWinner.authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#5B6169]">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-bold text-[#16181C] truncate">
                      {pickedWinner.authorName}
                    </h4>
                    <div className="text-[12px] text-[#5B6169] flex items-center gap-2">
                      <span>{pickedWinner.publishedAt}</span>
                      <span>•</span>
                      <span>{pickedWinner.likeCount} likes</span>
                    </div>
                  </div>
                </div>

                <div className="text-[14px] text-[#16181C] leading-relaxed bg-white p-3.5 border border-[#E8E7E3] max-h-[140px] overflow-y-auto whitespace-pre-line">
                  &ldquo;{pickedWinner.text}&rdquo;
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWinnerModalOpen(false)}
                className="px-4 py-2 border border-[#E8E7E3] text-[13px] font-medium text-[#16181C] hover:bg-[#F9F9F8] transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={pickRandomWinner}
                disabled={isPicking}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#D6293C] hover:bg-[#B81E2F] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
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
