import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { MonetizationCheckerClient } from '@/components/tools/MonetizationCheckerClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { HelpCircle, CheckCircle2, AlertCircle, Info, DollarSign } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['monetization-checker'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/monetization-checker',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to check if a YouTube channel is monetized online free?',
    a: 'Paste any YouTube channel link, handle (e.g. @MrBeast), or video URL into our checker. YT MONETIZE inspects public monetization markers including channel memberships, merch shelf integrations, ad break cues, and subscriber milestones to provide an objective confidence score.',
  },
  {
    q: 'How to know if a YouTube channel is making money and what is its RPM/CPM?',
    a: 'While private AdSense dashboards are not publicly accessible, our checker evaluates view volume, video length, niche categories, and observed ad placement signals to calculate realistic RPM and revenue estimates.',
  },
  {
    q: 'What are the official YouTube Partner Program (YPP) requirements in 2026?',
    a: 'To qualify for YouTube monetization (YPP), creators typically need 1,000 subscribers and 4,000 valid public watch hours in the past 12 months, or 1,000 subscribers and 10 million valid public Shorts views in the last 90 days.',
  },
  {
    q: 'Why can a YouTube monetization result show "Unable to Determine"?',
    a: 'A channel might be enrolled in YPP but have demonetized a specific video, or an account might be pending manual review. Our tool transparently indicates when data is inconclusive rather than fabricating misleading results.',
  },
  {
    q: 'How to check YouTube channel monetization without logging in?',
    a: 'All lookups on YT MONETIZE are 100% free, anonymous, and operate entirely through public endpoints without requiring your YouTube login or channel authorization.',
  },
];

export default function MonetizationCheckerPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/monetization-checker',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Monetization Checker', url: '/monetization-checker' },
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
        <Breadcrumbs items={[{ label: 'Monetization Checker' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <DollarSign className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>YPP Status &amp; Ad Signal Checker</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Monetization Checker (Channel &amp; Video Status)
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Check publicly observable YouTube monetization signals, ad delivery markers, RPM metrics, and Partner Program indicators for any channel or video free without login.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <MonetizationCheckerClient />

        {/* How The Monetization Checker Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How the YouTube Monetization Checker Evaluates Channels
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Because private YouTube Partner Program agreements are never exposed publicly, our tool analyzes a multi-layered matrix of observable indicators:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. YPP Eligibility Criteria</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Evaluates subscriber milestones against the 1,000-subscriber YPP threshold and verified channel badge statuses.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Commercial Monetization Features</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Checks for active &quot;Join&quot; channel memberships, verified merchandise storefronts, and Super Thanks enablement.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. Ad Placement Signals</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Inspects public video stream metadata for mid-roll ad cue availability and commercial topic category markers.
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
        <RelatedTools currentToolId="monetization-checker" />
      </div>
    </>
  );
}
