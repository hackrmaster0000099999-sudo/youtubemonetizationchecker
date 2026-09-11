import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { ShadowbanDetectorClient } from '@/components/tools/ShadowbanDetectorClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['shadowban-detector'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/shadowban-detector',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to check if YouTube channel is shadowbanned?',
    a: 'Paste your YouTube channel URL or @handle into our detector. The tool runs 5 public diagnostic tests: direct search indexing, @handle resolution, public video playback status, age/safe-search restrictions, and comment indexing health.',
  },
  {
    q: 'Why are my YouTube views suddenly dropping?',
    a: 'Sudden view drops are usually caused by lower click-through rates (CTR), drops in average view duration (AVD), seasonal audience behavior shifts, or content being flagged as borderline content (reducing recommendation impressions) rather than an intentional account shadowban.',
  },
  {
    q: 'How to fix YouTube shadowban on Shorts?',
    a: 'Avoid re-uploading duplicate content, clean up repetitive spam tags in titles/descriptions, improve viewer swipe-away percentage (aim for >70% viewed vs swiped away), and ensure audio tracks use approved YouTube Shorts library licenses.',
  },
  {
    q: 'How to check if my YouTube comment is shadowbanned?',
    a: 'Use our tool to verify channel health or open the video in an incognito window without logging in. If your comment is invisible in incognito mode, it was likely filtered by YouTube automatic spam filter or the creator held-for-review word blocklist.',
  },
  {
    q: 'How to unshadowban YouTube channel fast?',
    a: 'Audit recent uploads for copyright claims or community guidelines warnings, pause high-frequency spammy uploads for 48 hours, optimize titles and thumbnails for organic search, and engage directly with your active subscriber base.',
  },
];

export default function ShadowbanDetectorPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/shadowban-detector',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Shadowban Detector', url: '/shadowban-detector' },
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
        <Breadcrumbs items={[{ label: 'Shadowban Detector' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Channel Health &amp; Indexing Diagnostic</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Shadowban Detector &amp; Channel Visibility Checker
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Run real-time diagnostic checks on your YouTube channel search indexing, sudden view drops, video restrictions, and public visibility signals.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ShadowbanDetectorClient />

        {/* Diagnostic Explanation */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              Understanding YouTube Algorithm Penalties vs Shadowbans
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              YouTube engineers have clarified that the recommendation system responds to audience engagement metrics rather than secretive account switches:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Search Indexing</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Verifies whether your channel name and recent uploads appear in public YouTube search query indexes.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Handle Resolution</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Confirms that your unique YouTube handle resolves cleanly to the canonical channel ID without redirects.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. Borderline Content Checks</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Detects if content restrictions or age limitations are suppressing recommendation impressions.
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
        <RelatedTools currentToolId="shadowban-detector" />
      </div>
    </>
  );
}
