import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { DataViewerClient } from '@/components/tools/DataViewerClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Metadata Viewer',
  description: 'Inspect public YouTube channel and video metadata, creation dates, duration, engagement ratios, and raw structured JSON payloads.',
  path: '/data-viewer',
});

const faqs = [
  {
    q: 'What is the YouTube Metadata Viewer?',
    a: 'The YouTube Metadata Viewer is a developer and creator diagnostic utility that parses and exposes normalized technical fields, channel creation dates, exact view counts, video duration, and raw JSON schema objects from YouTube endpoints.',
  },
  {
    q: 'Can I view the raw JSON payload returned by YouTube?',
    a: 'Yes. Toggle the "Show Raw JSON" button to view and copy the complete structured JSON response for use in API debugging or developer scripts.',
  },
  {
    q: 'Does this tool show private channel data?',
    a: 'No. All information is retrieved strictly from publicly accessible endpoints. Private analytics, earnings, and viewer demographics are never exposed.',
  },
  {
    q: 'Is this YouTube Data Viewer free to use?',
    a: 'Yes, 100% free with no registration or rate limits.',
  },
];

export default function DataViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Metadata Viewer',
    description: 'Inspect raw public YouTube video and channel metadata with YT MONETIZE.',
    path: '/data-viewer',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Metadata Viewer', url: '/data-viewer' },
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
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Metadata &amp; Raw Data Viewer
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Inspect public channel and video technical metadata, upload dates, lifetime statistics, and raw structured JSON data payloads.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <DataViewerClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              How the YouTube Data Viewer Works
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Our inspection engine normalizes public API schemas into accessible structured views and developer JSON objects:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>1. Input Resource</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Provide any valid YouTube video link, channel URL, or creator handle to initiate inspection.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>2. Schema Normalization</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                The engine cleans and maps raw YouTube fields into standardized technical attributes like ISO timestamps and duration codes.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>3. Formatted &amp; Raw JSON</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Review data in a clean key-value table or switch to the raw JSON tab with a one-click copy button.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] text-[14px] text-[#5B6169] space-y-2">
            <p>
              Looking to extract specific video tags? Use our{' '}
              <Link href="/tag-extractor" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Tag Extractor
              </Link>{' '}
              or find canonical channel IDs with the{' '}
              <Link href="/channel-id-finder" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Channel ID Finder
              </Link>
              .
            </p>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#E8E7E3]">
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
            When to Use the YouTube Data Viewer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Developer Debugging:</strong>
              Inspect raw payload shapes and field names when building custom YouTube API integrations or webhooks.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Historical Auditing:</strong>
              Check exact channel creation timestamps and upload dates without relying on rounded UI badges.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Channel Valuation:</strong>
              Review aggregate metrics, video volume, and engagement indicators when assessing digital creator assets.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Content Research:</strong>
              Analyze publishing cadences and metadata structures used by leading channels in any category.
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
        <RelatedTools currentToolId="data-viewer" />
      </div>
    </>
  );
}
