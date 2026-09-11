import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { RandomCommentPickerClient } from '@/components/tools/RandomCommentPickerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { Trophy, ShieldCheck, Filter, Users, Info } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['random-comment-picker'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/random-comment-picker',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to pick a winner from YouTube video comments automatically?',
    a: 'Paste your YouTube video or Shorts link into the tool, set your giveaway rules (such as filter duplicate users or require a specific keyword like #giveaway), choose the number of winners, and click "Start Draw" to choose a winner in real time with 100% transparency.',
  },
  {
    q: 'Does it filter duplicate comments from the same user?',
    a: 'Yes! The duplicate filter ensures each unique user channel is entered into the prize pool only once, preventing comment spammers from rigging contest outcomes.',
  },
  {
    q: 'Can I pick multiple winners from YouTube comments?',
    a: 'Yes. You can select between 1 and 10 winners simultaneously. Each chosen winner is uniquely selected from the pool without repeats.',
  },
  {
    q: 'Does the comment picker work for YouTube Shorts giveaways?',
    a: 'Yes! Paste any YouTube Shorts URL to load all public comments and run an unbiased giveaway draw.',
  },
  {
    q: 'Is this YouTube giveaway comment picker free with no login?',
    a: 'Yes, 100% free with no account creation, no sign-in, and no OAuth permissions required.',
  },
];

export default function RandomCommentPickerPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/random-comment-picker',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Random Comment Picker', url: '/random-comment-picker' },
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
        <Breadcrumbs items={[{ label: 'Random Comment Picker' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Fair Giveaway Picker</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Random Comment Picker for Giveaways
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Pick fair, transparent, and randomized giveaway winners from any YouTube video comments and Shorts. Filter duplicate names and search contest keywords.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <RandomCommentPickerClient />

        {/* Feature Highlights */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              Why Use a Fair Random Comment Picker for YouTube Giveaways?
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Guarantee complete contest transparency for your subscribers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Users className="w-4 h-4 text-[#7C3AED]" />
                <h3>Anti-Spam Duplicate Filter</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Automatically consolidates multiple entries from the same user so everyone gets an equal chance.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Filter className="w-4 h-4 text-emerald-600" />
                <h3>Custom Keyword Qualification</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Require participants to include a specific hashtag (#giveaway) or answer a question in their comment.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <h3>Cryptographically Random Draw</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Utilizes secure pseudo-random number generation for tamper-proof winner selection.
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
        <RelatedTools currentToolId="random-comment-picker" />
      </div>
    </>
  );
}
