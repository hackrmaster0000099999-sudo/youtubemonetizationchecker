import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { TagExtractorClient } from '@/components/tools/TagExtractorClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { CheckCircle2, Info, Tag } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['tag-extractor'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/tag-extractor',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to see tags on YouTube video free?',
    a: 'YouTube hides video tags in standard watch pages. Paste any YouTube video or Shorts link into our Tag Extractor to inspect, extract, and copy every hidden keyword tag embedded in the video metadata without installing browser extensions.',
  },
  {
    q: 'How to copy competitor YouTube video tags online?',
    a: 'Paste your competitor&apos;s video URL into our tool. Once the tags are parsed, click the "Copy All Tags" button to copy a ready-to-paste comma-separated list formatted for YouTube Studio.',
  },
  {
    q: 'Can I extract tags and keywords from YouTube Shorts?',
    a: 'Yes. Paste any YouTube Shorts URL into the search bar to inspect the specific tags and SEO keywords used by the creator to optimize discovery on the Shorts feed.',
  },
  {
    q: 'Do YouTube tags help video ranking and getting high views?',
    a: 'Tags help YouTube search algorithms understand contextual synonyms, misspellings, and related topics. When combined with an optimized title, detailed description, and high click-through thumbnail, tags boost search visibility.',
  },
  {
    q: 'Is this YouTube tag grabber and keyword finder free?',
    a: 'Yes, 100% free with unlimited extractions, zero sign-up requirements, and instant one-click copying.',
  },
];

export default function TagExtractorPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/tag-extractor',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Tag Extractor', url: '/tag-extractor' },
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
        <Breadcrumbs items={[{ label: 'Tag Extractor' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <Tag className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>SEO &amp; Keyword Extractor</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Tag Extractor &amp; Video Keyword Finder
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Extract, inspect, and copy hidden SEO tags and topic keywords from any public YouTube video or Shorts link in one click.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <TagExtractorClient />

        {/* SEO Best Practices Guide */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How to Use Extracted YouTube Tags for Video SEO
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Analyze successful competitor keywords to optimize your YouTube upload metadata:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Niche Benchmark</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Extract tags from the top 5 ranking videos in your search niche to identify common keyword patterns.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Long-Tail Keywords</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Identify specific multi-word search queries where ranking competition is lower.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. One-Click Copy</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Copy formatted comma-separated tags ready to paste into your YouTube Studio tag box.
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
        <RelatedTools currentToolId="tag-extractor" />
      </div>
    </>
  );
}
