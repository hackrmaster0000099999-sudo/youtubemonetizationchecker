import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { CommentViewerClient } from '@/components/tools/CommentViewerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { CheckCircle2, MessageSquare, Search, Trophy, Filter } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Comment Viewer & Search',
  description:
    'Free YouTube Comment Viewer and search tool. View, search, filter, and pick random giveaway winners from any YouTube video without login.',
  path: '/comment-viewer',
});

const faqs = [
  {
    q: 'How do I search or view all comments on a YouTube video?',
    a: 'Simply paste any YouTube video link (e.g., youtube.com/watch?v=... or youtu.be/...) into our Comment Viewer. The tool fetches public comments, showing author names, avatars, timestamps, like counts, and reply numbers.',
  },
  {
    q: 'Can I search for specific keywords inside YouTube comments?',
    a: 'Yes! The Comment Viewer includes an instant keyword filter bar. As you type, the list updates in real time to show only comments containing your query or written by a specific user.',
  },
  {
    q: 'Can I pick a random comment winner for a YouTube giveaway?',
    a: 'Yes. Click the "Pick Random Winner" button on the comments toolbar. The tool will randomly choose a winner from all loaded comments, making it easy to run transparent YouTube giveaways and contests.',
  },
  {
    q: 'Why does it say comments are disabled for a video?',
    a: 'If a creator manually turned off comments in YouTube Studio, or if the video is designated as "Made for Kids" or age-restricted, YouTube restricts public comment threads for that video.',
  },
  {
    q: 'Can I export or copy comments?',
    a: 'Yes. You can copy individual comments, use "Copy All" to grab all loaded comments formatted with author and like details, or click "Export JSON" to download the structured data.',
  },
];

export default function CommentViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Comment Viewer & Search Tool',
    description:
      'Search, filter, analyze, and pick random winners from YouTube video comments with YT MONETIZE.',
    path: '/comment-viewer',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Comment Viewer', url: '/comment-viewer' },
  ]);

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-12 py-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Comment Viewer' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Comment Viewer &amp; Search
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Inspect public comment threads from any YouTube video. Search comments by keyword, filter top
            or newest discussions, pick transparent giveaway winners, and export comments without logging in.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <CommentViewerClient />

        {/* How It Works & Core Capabilities */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Key Features of the YouTube Comment Viewer
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Designed for creators, researchers, and viewers who need to analyze audience feedback and
              organize community interactions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <Search className="w-4 h-4 text-[#D6293C]" />
                <h3>Live Keyword Search</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Filter thousands of comments instantly by typing keywords, phrases, or specific usernames to
                find answers, feedback, or mentions.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <Trophy className="w-4 h-4 text-[#1E9E6B]" />
                <h3>Random Giveaway Picker</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Pick unbiased random winners for YouTube contests, community giveaways, or audience Q&amp;A
                spotlights with a single click.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <Filter className="w-4 h-4 text-[#5B6169]" />
                <h3>Smart Filter Tabs</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Filter comments by question marks (<code className="font-mono text-[12px] bg-[#F9F9F8] px-1">?</code>),
                highly liked remarks (10+ likes), or discussions with active reply threads.
              </p>
            </div>
          </div>
        </section>

        {/* Why Analyze YouTube Comments */}
        <section className="space-y-4 pt-4">
          <h2 className="text-[20px] md:text-[24px] font-semibold text-[#16181C]">
            Why Creators &amp; Researchers Analyze YouTube Comments
          </h2>
          <div className="p-6 bg-white border border-[#E8E7E3] space-y-4 text-[15px] text-[#383B40] leading-relaxed">
            <p>
              The comment section of a YouTube video is one of the richest sources of direct audience sentiment.
              Whether you are an independent creator trying to understand what your viewers want next, or a digital
              marketer researching competitor reception, examining comments reveals:
            </p>
            <ul className="space-y-2 list-disc list-inside text-[#5B6169]">
              <li>
                <strong className="text-[#16181C]">Unanswered Audience Questions:</strong> Spot common confusion or
                topics that warrant a dedicated follow-up video.
              </li>
              <li>
                <strong className="text-[#16181C]">Community Sentiment &amp; Feedback:</strong> See what jokes,
                timestamps, or advice resonated most with viewers based on like counts.
              </li>
              <li>
                <strong className="text-[#16181C]">Fair Contest Drawings:</strong> Conduct transparent giveaway winner
                drawings without biased manual scrolling.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#5B6169]">
              Common questions about inspecting and searching YouTube video comments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-5 bg-white border border-[#E8E7E3] space-y-2">
                <h3 className="text-[15px] font-semibold text-[#16181C] flex items-start gap-2">
                  <span className="text-[#D6293C] font-bold">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#5B6169] leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentToolId="comment-viewer" />
      </div>
    </>
  );
}
