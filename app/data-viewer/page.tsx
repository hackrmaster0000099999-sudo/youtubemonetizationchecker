import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { DataViewerClient } from '@/components/tools/DataViewerClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { CheckCircle2, Info, BarChart2 } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['data-viewer'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/data-viewer',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to check exact YouTube video publish date and upload time?',
    a: 'Paste any YouTube video link into our Data Viewer. The tool inspects the canonical metadata schema to extract the exact ISO timestamp (date, hour, minute, second) when the video was uploaded and published.',
  },
  {
    q: 'How to check YouTube channel creation date online?',
    a: 'Enter a channel URL or handle into the search box. The tool displays the exact registration timestamp and founding date of the YouTube channel alongside lifetime view metrics.',
  },
  {
    q: 'Can I inspect hidden YouTube video metadata and raw JSON details?',
    a: 'Yes. Toggle the "Raw JSON" switch to inspect and copy normalized JSON metadata fields, including video IDs, channel identifiers, duration seconds, and category IDs for API development.',
  },
  {
    q: 'Does this tool show private YouTube statistics or personal data?',
    a: 'No. All telemetry is retrieved strictly from publicly accessible endpoints and manifests. Private earnings and subscriber identities are never exposed.',
  },
  {
    q: 'Is this YouTube Data Viewer and metadata extractor free?',
    a: 'Yes, 100% free with no registration, no API key requirements, and instant data parsing.',
  },
];

export default function DataViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/data-viewer',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Data Viewer', url: '/data-viewer' },
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
        <Breadcrumbs items={[{ label: 'Data Viewer' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <BarChart2 className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Metadata &amp; Telemetry Inspector</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Data Viewer &amp; Video Metadata Inspector
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Inspect public YouTube video and channel telemetry: exact upload timestamps, channel creation dates, technical specs, and raw structured JSON data.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <DataViewerClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              Technical YouTube Video Analytics &amp; Metadata
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Understand the technical parameters indexed by YouTube:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>Exact ISO Timestamps</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Discover the exact minute and second a video was published to YouTube servers.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>Video Duration Specs</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Parse ISO-8601 duration strings into total seconds and runtime formats.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>Developer JSON Export</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Copy structured JSON payloads for rapid debugging, API testing, and research scripts.
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
        <RelatedTools currentToolId="data-viewer" />
      </div>
    </>
  );
}
