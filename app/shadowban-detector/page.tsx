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
  description:
    'Check public YouTube visibility signals for potential search or discovery issues with our free Shadowban Detector and understand what the results may indicate.',
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
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Shadowban &amp; Visibility Detector
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Diagnose public YouTube channel search discoverability, canonical handle routing, RSS feed access, and algorithmic visibility health.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ShadowbanDetectorClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How the YouTube Visibility Diagnostic Operates
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Our automated diagnostic engine runs technical checks against publicly available YouTube endpoint markers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Canonical Handle Resolution</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Verifies that the channel&apos;s custom handle routes cleanly to the primary UC channel ID without broken redirects.
              </p>
            </div>

            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Search &amp; Feed Discovery</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Checks that video uploads are broadcast to public XML syndication streams without restriction headers.
              </p>
            </div>

            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. Content Safety Flags</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Evaluates family-friendly metadata classifications that dictate whether content is recommended on home feeds.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl text-[14px] text-[#635B80] space-y-2 shadow-2xs">
            <p>
              Concerned about channel monetization? Run a diagnostic with our{' '}
              <Link href="/monetization-checker" className="text-[#7C3AED] font-semibold hover:underline">
                YouTube Monetization Checker
              </Link>{' '}
              or inspect complete technical parameters in the{' '}
              <Link href="/data-viewer" className="text-[#7C3AED] font-semibold hover:underline">
                YouTube Metadata Viewer
              </Link>
              .
            </p>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#EDE8F9]">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
            When to Run a Visibility Audit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="tool-card-3d p-5 text-[14px] text-[#635B80]">
              <strong className="text-[#181135] block mb-1 text-[15px]">Sudden Viewership Drops:</strong>
              Check if a drop in views is caused by public indexing anomalies or normal audience interest variance.
            </div>
            <div className="tool-card-3d p-5 text-[14px] text-[#635B80]">
              <strong className="text-[#181135] block mb-1 text-[15px]">After Content Niche Pivots:</strong>
              Verify channel metadata routing after changing video topics or uploading new formats.
            </div>
            <div className="tool-card-3d p-5 text-[14px] text-[#635B80]">
              <strong className="text-[#181135] block mb-1 text-[15px]">Community Guidelines Checks:</strong>
              Ensure video feeds and comment modules are active across public API streams.
            </div>
            <div className="tool-card-3d p-5 text-[14px] text-[#635B80]">
              <strong className="text-[#181135] block mb-1 text-[15px]">Routine Health Audits:</strong>
              Run quarterly health checks to ensure your channel metadata remains clean and properly indexed.
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="tool-card-3d p-5 space-y-2">
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

        {/* Related Tools */}
        <RelatedTools currentToolId="shadowban-detector" />
      </div>
    </>
  );
}
