import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { CommentViewerClient } from '@/components/tools/CommentViewerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { CheckCircle2, MessageSquare, Search, Trophy, Filter, Info } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['comment-viewer'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/comment-viewer',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to search comments on YouTube video free online?',
    a: 'Simply paste any YouTube video link (e.g., youtube.com/watch?v=... or youtu.be/...) into our Comment Viewer. Type any specific word, phrase, or username in the filter box to find exact comment matches in real time.',
  },
  {
    q: 'How to view all comments on a YouTube video online without app?',
    a: 'Our online reader connects to YouTube public comment feeds, loading top comments, timestamps, author names, like counts, and replies directly in your browser without logging in.',
  },
  {
    q: 'How to search YouTube comments by username?',
    a: 'Enter the username or creator handle into the search filter to display all comments and replies authored by that specific user across the video discussion thread.',
  },
  {
    q: 'Why are comments disabled on some YouTube videos?',
    a: 'If a creator turned off comments in YouTube Studio, or if the video is designated as "Made for Kids" or age-restricted, YouTube restricts comment threads on that video.',
  },
  {
    q: 'Can I export or copy YouTube comments to text or JSON?',
    a: 'Yes. You can copy individual comments, use "Copy All" for a formatted text list, or click "Export JSON" to download the complete structured comment dataset.',
  },
];

export default function CommentViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/comment-viewer',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Comment Viewer', url: '/comment-viewer' },
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
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Comment Viewer' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <MessageSquare className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Comment Search &amp; Analysis Tool</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Comment Viewer &amp; Search Engine
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Search specific words in YouTube comments, filter by username, view top replies, and inspect discussions from any public video without signing in.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <CommentViewerClient />

        {/* Feature Highlights */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How to Search and Filter YouTube Video Comments
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Explore comment conversations and audience feedback with precision filtering:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Search className="w-4 h-4 text-[#7C3AED]" />
                <h3>Instant Word Search</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Find exact keywords, timestamps, or product mentions across hundreds of video comments instantly.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Filter className="w-4 h-4 text-emerald-600" />
                <h3>Username Filtering</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Filter comments posted by specific community members, channel moderators, or creator replies.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3>Giveaway Random Picker</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Pick a fair and transparent giveaway winner from loaded comments with duplicate user filtering.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-[#EDE8F9] border border-[#EDE8F9] bg-white/80 backdrop-blur-md rounded-2xl shadow-xs overflow-hidden">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 space-y-2">
                <h3 className="text-[16px] font-bold text-[#181135] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#7C3AED]" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#635B80] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular SEO Search Queries */}
        <PopularSearchQueries
          mainKeyword={seo.mainKeyword}
          searchQueries={seo.searchQueries}
        />

        {/* Related Tools */}
        <RelatedTools currentToolId="comment-viewer" />
      </div>
    </>
  );
}
