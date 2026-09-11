import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { DislikeCheckerClient } from '@/components/tools/DislikeCheckerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { ThumbsDown, ShieldCheck, BarChart2, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['dislike-checker'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/dislike-checker',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to see dislikes on YouTube video 2026 without extensions?',
    a: 'While YouTube officially hid public dislike numbers from standard watch pages, our online web tool connects to open creator telemetry archives and the Return YouTube Dislike (RYD) database to reveal hidden dislike counts and sentiment statistics without requiring browser extensions.',
  },
  {
    q: 'How is the YouTube like vs dislike ratio and approval rating calculated?',
    a: 'Approval rating is calculated using the formula: [Likes / (Likes + Dislikes)] × 100. For example, a video with 9,500 likes and 500 dislikes has a 95% positive approval rating.',
  },
  {
    q: 'Can anyone see who specifically disliked a YouTube video?',
    a: 'No. YouTube votes are completely anonymous. Neither viewers nor the creator in YouTube Studio can see individual account names who clicked dislike.',
  },
  {
    q: 'What is considered a healthy audience sentiment ratio on YouTube?',
    a: 'An approval rating above 90% is considered healthy across most verticals. Ratings above 95% indicate strong audience trust, while ratings below 70% suggest controversial topics or misleading titles (clickbait).',
  },
  {
    q: 'Is this YouTube dislike counter and sentiment analyzer free?',
    a: 'Yes, 100% free with no login, no sign-up, and real-time data calculations.',
  },
];

export default function DislikeCheckerPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/dislike-checker',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Dislike & Sentiment Checker', url: '/dislike-checker' },
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
        <Breadcrumbs items={[{ label: 'Dislike Checker' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <ThumbsDown className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Audience Sentiment &amp; Feedback</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Dislike &amp; Sentiment Checker (Return Dislikes)
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Check hidden YouTube dislikes, analyze like-to-dislike ratios, view video approval ratings, and evaluate real-time audience sentiment without browser extensions.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <DislikeCheckerClient />

        {/* Metric Insights */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How the YouTube Audience Sentiment Analyzer Works
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Evaluating viewer engagement beyond vanity like counts:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <BarChart2 className="w-4 h-4 text-[#7C3AED]" />
                <h3>Statistical Dislike Modeling</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Aggregates community extension vote samples and historical API benchmarks to compute statistically sound dislike estimates.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>Approval Rating Grade</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Calculates precise positive vs negative ratios to rate community satisfaction on an objective 0–100% scale.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <h3>Viewer Discretion Filter</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Spot misleading tutorials, scam guides, or outdated software instructions before investing 20 minutes watching.
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
        <RelatedTools currentToolId="dislike-checker" />
      </div>
    </>
  );
}
