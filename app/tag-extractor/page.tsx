import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { TagExtractorClient } from '@/components/tools/TagExtractorClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Tag Extractor',
  description: 'Extract hidden SEO tags, keywords, and metadata from any public YouTube video. One-click copy for competitor keyword research.',
  path: '/tag-extractor',
});

const faqs = [
  {
    q: 'How do I view tags on a YouTube video?',
    a: 'YouTube hides video tags by default on watch pages. Paste any YouTube video URL into our Tag Extractor to inspect every hidden keyword tag embedded in the video metadata.',
  },
  {
    q: 'Do YouTube tags still help with video rankings?',
    a: 'According to YouTube official Creator documentation, tags play a modest role in helping search algorithms correct common spelling mistakes or search synonym variations. Titles, descriptions, and watch retention remain the primary ranking drivers.',
  },
  {
    q: 'Can I copy all extracted tags at once?',
    a: 'Yes. Our tool formats all discovered tags into a comma-separated list that can be copied with one click and pasted directly into YouTube Studio upload metadata.',
  },
  {
    q: 'Is this YouTube Tag Extractor free?',
    a: 'Yes, 100% free with unlimited extractions and no sign-up required.',
  },
];

export default function TagExtractorPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Tag Extractor',
    description: 'Extract hidden SEO tags and keywords from any public YouTube video with YT MONETIZE.',
    path: '/tag-extractor',
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
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Video Tag Extractor
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Extract public SEO keywords and search tags embedded in any public YouTube video to analyze competitor strategies and optimize your own video metadata.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <TagExtractorClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              How YouTube Video Tag Extraction Works
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              When a creator uploads a video and adds tags in YouTube Studio, they are stored in the video&apos;s public DOM schema:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>1. Video URL Parse</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Paste any standard watch URL (<code className="font-mono-data text-[12px] bg-[#FCFCFB] px-1">watch?v=...</code>) or mobile short URL.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>2. Keyword Parsing</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Our server queries the public video manifest and isolates keyword tag arrays attached to the video ID.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>3. One-Click Copy</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Copy individual tags or the complete comma-separated string to easily paste into your own video upload metadata.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] text-[14px] text-[#5B6169] space-y-2">
            <p>
              Want to see all public video metadata in one place? Use our{' '}
              <Link href="/data-viewer" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Metadata Viewer
              </Link>{' '}
              or download thumbnail artwork using the{' '}
              <Link href="/thumbnail-downloader" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Thumbnail Downloader
              </Link>
              .
            </p>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#E8E7E3]">
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
            When to Extract YouTube Tags
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Competitor Keyword Analysis:</strong>
              Discover which long-tail search queries top-ranking creators in your niche are targeting.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Content Brainstorming:</strong>
              Identify related search keywords to expand on in future video titles and descriptions.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">SEO Audits:</strong>
              Inspect older uploads to ensure your metadata aligns with modern search queries.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Upload Efficiency:</strong>
              Quickly generate clean comma-separated tag lists ready for YouTube Studio.
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-[#E8E7E3] border border-[#E8E7E3] bg-white">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 space-y-2">
                <h3 className="text-[16px] font-semibold text-[#16181C] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#5B6169]" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#5B6169] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentToolId="tag-extractor" />
      </div>
    </>
  );
}
