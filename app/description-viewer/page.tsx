import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { DescriptionViewerClient } from '@/components/tools/DescriptionViewerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { FileText, Clock, Link as LinkIcon, Search, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Description Viewer - Extract, Copy & Download Video Descriptions',
  description:
    'Free YouTube Description Viewer. View, copy, and download full YouTube video descriptions. Extract timestamps, video chapters, social links, hashtags, and analyze word counts.',
  path: '/description-viewer',
});

const faqs = [
  {
    q: 'How do I copy a full YouTube video description?',
    a: 'Simply paste any YouTube video link into our YouTube Description Viewer and click "Extract Description". The complete text appears in a clean format with a single-click "Copy Description" button or "Download .TXT" option.',
  },
  {
    q: 'Can I extract timestamps and chapters from a YouTube description?',
    a: 'Yes! The tool automatically scans the description for timestamp markers (e.g. 00:00, 02:15, 1:12:00) and formats them into a clean chapters list with a "Copy All Chapters" button.',
  },
  {
    q: 'What is the character limit for YouTube video descriptions?',
    a: 'YouTube allows a maximum of 5,000 characters per video description. Our tool displays the exact character count, word count, line count, and percentage of the maximum limit used.',
  },
  {
    q: 'Why are the first 150 characters of a YouTube description so important?',
    a: 'The first 100 to 150 characters appear in YouTube search results snippets and Google SERP previews before the viewer clicks "Show More". Placing primary keywords and core topic summaries in this opening section significantly boosts search CTR and SEO.',
  },
  {
    q: 'Is this YouTube description extractor free to use?',
    a: 'Yes, 100% free with no login, no software installation, and no browser extension needed. You can analyze and copy descriptions from any public YouTube video instantly.',
  },
];

export default function DescriptionViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Description Extractor & Viewer',
    description:
      'View, extract, and copy full YouTube video descriptions with timestamps, links, hashtags, and text analytics.',
    path: '/description-viewer',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Description Viewer', url: '/description-viewer' },
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
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'YouTube Description Viewer' }]} />

        {/* Header Intro */}
        <div className="space-y-3 max-w-[820px]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE8F9] text-[#7C3AED] text-[12px] font-bold tracking-wide rounded-full border border-[#DDD0FA] shadow-2xs">
            <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Video Description &amp; Chapters Extractor</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Description Viewer &amp; Extractor
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Quickly view, search, copy, and download the full text description of any YouTube video. Automatically extract video chapters, affiliate links, and hashtags.
          </p>
        </div>

        {/* Client Interactive Tool */}
        <DescriptionViewerClient />

        {/* Contextual / Educational Section */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#181135]">
              Why Inspect &amp; Analyze YouTube Video Descriptions?
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Video descriptions are one of the strongest metadata signals used by YouTube’s recommendation algorithm and Google Search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#181135]">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                <h3>Copy Chapters &amp; Timestamps</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Extract chapter markers formatted for easy reuse, study notes, video summaries, or podcast show notes.
              </p>
            </div>

            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#181135]">
                <LinkIcon className="w-4 h-4 text-[#2563EB]" />
                <h3>Discover Affiliate &amp; Gear Links</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Quickly locate all external websites, gear lists, sponsor codes, and social media handles mentioned in any video.
              </p>
            </div>

            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#181135]">
                <Search className="w-4 h-4 text-emerald-600" />
                <h3>Competitor SEO Research</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Study top-ranking videos in your niche to see how successful creators structure descriptions, keywords, and calls-to-action.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practice Guide */}
        <section className="space-y-4 pt-4">
          <h2 className="text-[20px] md:text-[24px] font-semibold text-[#181135]">
            The Anatomy of a High-Ranking YouTube Description
          </h2>
          <div className="tool-card-3d p-6 space-y-4 text-[15px] text-[#181135] leading-relaxed">
            <p>
              To maximize video reach, audience engagement, and click-through rates, top creators structure descriptions into four key sections:
            </p>
            <ul className="space-y-2.5 list-disc pl-5 text-[14px] text-[#635B80]">
              <li>
                <strong className="text-[#181135]">1. The Hook &amp; Primary Keywords (First 150 characters):</strong> Concise summary of the video topic that appears above the &quot;Show More&quot; fold in search results.
              </li>
              <li>
                <strong className="text-[#181135]">2. Detailed Video Outline &amp; Chapters:</strong> Adding timestamps (e.g. <code>00:00</code>, <code>01:30</code>) enables Google Key Moments in Google Search results and improves retention.
              </li>
              <li>
                <strong className="text-[#181135]">3. Resources, Gear &amp; Call-to-Actions (CTAs):</strong> Direct links to your newsletter, website, products, and social media channels.
              </li>
              <li>
                <strong className="text-[#181135]">4. Relevant Hashtags:</strong> Adding 2 to 3 targeted hashtags (e.g. <code>#YouTubeSEO</code>) helps YouTube categorize your video within topic feeds.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#181135]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#635B80]">
              Everything you need to know about extracting and viewing YouTube video descriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="tool-card-3d p-6 space-y-2">
                <h3 className="text-[15px] font-semibold text-[#181135] flex items-start gap-2">
                  <span className="text-[#7C3AED] font-bold">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#635B80] leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentToolId="description-viewer" />
      </div>
    </>
  );
}
