import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { DescriptionViewerClient } from '@/components/tools/DescriptionViewerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { FileText, Clock, Link as LinkIcon, Search, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['description-viewer'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/description-viewer',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to extract description from YouTube video online free?',
    a: 'Simply paste any YouTube video or Shorts link into our YouTube Description Extractor and click "Extract Description". The complete text appears formatted with a single-click "Copy Description" button or "Download .TXT" option.',
  },
  {
    q: 'How to copy YouTube description text with timestamps and chapters?',
    a: 'The tool automatically scans the description for timestamp markers (e.g. 00:00, 02:15, 1:12:00) and organizes them into a dedicated chapters section with a one-click "Copy All Chapters" button.',
  },
  {
    q: 'Can I extract links from YouTube video description?',
    a: 'Yes! The extractor separates all external links, affiliate URLs, social profiles, and cited resources into an easily inspectable table.',
  },
  {
    q: 'What is the maximum character limit for YouTube descriptions?',
    a: 'YouTube allows up to 5,000 characters per video description. Our tool displays real-time character counts, word counts, and formatting analytics.',
  },
  {
    q: 'Is this YouTube description scraper and viewer free for Shorts?',
    a: 'Yes, 100% free with no login, no installation, and full compatibility with standard YouTube videos and Shorts.',
  },
];

export default function DescriptionViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/description-viewer',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Description Extractor & Viewer', url: '/description-viewer' },
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
        <Breadcrumbs items={[{ label: 'Description Viewer' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Description &amp; Metadata Grabber</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Description Extractor &amp; Text Viewer
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Extract, inspect, and copy formatted YouTube video descriptions. Discover timestamps, chapters, external links, hashtags, and text analytics in seconds.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <DescriptionViewerClient />

        {/* Feature Highlights */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              Features of the YouTube Description Extractor
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Analyze structure, affiliate tracking links, and SEO keyword placement:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                <h3>Timestamp Extraction</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Extract video chapters and timeline bookmarks with one-click copying for quick study notes or video editing.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <LinkIcon className="w-4 h-4 text-emerald-600" />
                <h3>External Link Parsing</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Filter and inspect all URLs, sponsor links, discord servers, and social handles listed in the video box.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <h3>Text Stats &amp; Limits</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Track exact character counts, word counts, and line lengths relative to YouTube&apos;s 5,000-character ceiling.
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
        <RelatedTools currentToolId="description-viewer" />
      </div>
    </>
  );
}
