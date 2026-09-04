import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { ShadowbanDetectorClient } from '@/components/tools/ShadowbanDetectorClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Shadowban Detector',
  description: 'Check if a YouTube channel or video is experiencing public indexing issues, search restrictions, or algorithmic visibility suppression.',
  path: '/shadowban-detector',
});

const faqs = [
  {
    q: 'Does YouTube officially "shadowban" channels?',
    a: 'According to YouTube official product leadership and algorithm engineering teams, YouTube does not have a "shadowban" switch. Instead, low viewership is usually caused by changing audience trends, lower click-through rates (CTR), weak average view duration (AVD), or non-violating content being categorized as "borderline".',
  },
  {
    q: 'What does this visibility diagnostic check?',
    a: 'Our tool checks whether the channel is indexable in public searches, whether canonical handles resolve correctly, whether public video streams are restricted, and whether age-rating classifications are appropriately configured.',
  },
  {
    q: 'How can I recover views if my impressions suddenly drop?',
    a: 'Focus on improving thumbnail CTR, optimizing the first 30 seconds of your video hook to maximize retention, analyzing YouTube Studio traffic source analytics, and maintaining consistent uploads in your defined niche.',
  },
  {
    q: 'Is this YouTube visibility scanner free?',
    a: 'Yes, 100% free with no login required.',
  },
];

export default function ShadowbanDetectorPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Shadowban Detector',
    description: 'Check channel indexing health and public search visibility markers with YT MONETIZE.',
    path: '/shadowban-detector',
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
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Shadowban &amp; Visibility Detector
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Diagnose public YouTube channel search discoverability, canonical handle routing, RSS feed access, and algorithmic visibility health.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ShadowbanDetectorClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              How the YouTube Visibility Diagnostic Operates
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Our automated diagnostic engine runs technical checks against publicly available YouTube endpoint markers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>1. Canonical Handle Resolution</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Verifies that the channel&apos;s custom handle routes cleanly to the primary UC channel ID without broken redirects.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>2. Search &amp; Feed Discovery</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Checks that video uploads are broadcast to public XML syndication streams without restriction headers.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>3. Content Safety Flags</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Evaluates family-friendly metadata classifications that dictate whether content is recommended on home feeds.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] text-[14px] text-[#5B6169] space-y-2">
            <p>
              Concerned about channel monetization? Run a diagnostic with our{' '}
              <Link href="/monetization-checker" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Monetization Checker
              </Link>{' '}
              or inspect complete technical parameters in the{' '}
              <Link href="/data-viewer" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Metadata Viewer
              </Link>
              .
            </p>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#E8E7E3]">
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
            When to Run a Visibility Audit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Sudden Viewership Drops:</strong>
              Check if a drop in views is caused by public indexing anomalies or normal audience interest variance.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">After Content Niche Pivots:</strong>
              Verify channel metadata routing after changing video topics or uploading new formats.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Community Guidelines Checks:</strong>
              Ensure video feeds and comment modules are active across public API streams.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Routine Health Audits:</strong>
              Run quarterly health checks to ensure your channel metadata remains clean and properly indexed.
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
        <RelatedTools currentToolId="shadowban-detector" />
      </div>
    </>
  );
}
