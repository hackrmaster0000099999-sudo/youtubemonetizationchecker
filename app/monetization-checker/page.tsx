import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { MonetizationCheckerClient } from '@/components/tools/MonetizationCheckerClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { HelpCircle, CheckCircle2, AlertCircle, Info, DollarSign } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Monetization Checker',
  description:
    'Check publicly available YouTube monetization signals for a channel or video with our free YouTube Monetization Checker and understand what the results indicate.',
  path: '/monetization-checker',
});

const faqs = [
  {
    q: 'Can I officially see whether a YouTube channel is in the YouTube Partner Program?',
    a: 'No third-party tool has private access to YouTube internal creator dashboards or AdSense banking contracts. YT MONETIZE inspects publicly observable signals such as channel memberships, ad break cues, verified merch shelves, and public metrics to provide an objective, confidence-weighted estimate.',
  },
  {
    q: 'What information does the YouTube Monetization Checker use?',
    a: 'The checker evaluates channel subscriber thresholds (minimum 1,000 subscribers required for YPP), public video ad cues, channel membership buttons, official merchandise integration, and video category classifications.',
  },
  {
    q: 'Why can a YouTube monetization result be uncertain?',
    a: 'A creator may be accepted into the YouTube Partner Program but choose not to monetize certain videos, or a brand new channel may have applied and be awaiting manual YPP review. In such cases, the tool transparently returns "Unable to Determine" rather than a misleading false positive.',
  },
  {
    q: 'Does checking a channel alert the creator or affect their account?',
    a: 'No. All lookups are completely anonymous, client-safe, and read-only from public YouTube endpoints. It does not send any notification to the channel owner.',
  },
];

export default function MonetizationCheckerPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Monetization Checker',
    description: 'Check public YouTube monetization signals for any channel or video with YT MONETIZE.',
    path: '/monetization-checker',
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
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Monetization Checker' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3E2DE] text-[12px] font-bold text-[#5B6169] uppercase tracking-wider shadow-2xs">
            <DollarSign className="w-3.5 h-3.5 text-[#D6293C]" />
            <span>Monetization Diagnostic</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Monetization Checker
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Check publicly observable monetization signals for any YouTube channel, handle, or video. Enter any link below to get a clear, confidence-weighted analysis in seconds.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <MonetizationCheckerClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              How the YouTube Monetization Checker Works
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Our automated diagnostic engine inspects multiple public layers of YouTube channel and video data to detect evidence of commercial monetization:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>1. YPP Milestone Thresholds</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Channels must have a minimum of 1,000 subscribers and active public uploads to meet standard YouTube Partner Program baseline qualification criteria.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>2. Commercial Features</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                The presence of channel memberships (the &quot;Join&quot; button), Super Thanks, or official connected merchandising store shelves confirms approved Partner Program status.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>3. Public Ad Signals</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Public stream player manifests and video response tags indicate whether ad inventory cues and commercial monetization placements are active.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] text-[14px] text-[#5B6169] space-y-2">
            <p>
              Need to look up the permanent channel identifier first? Use our{' '}
              <Link href="/channel-id-finder" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Channel ID Finder
              </Link>
              . To calculate potential channel ad revenue from daily views, visit the{' '}
              <Link href="/earnings-calculator" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Earnings Calculator
              </Link>
              .
            </p>
          </div>

          {/* Transparent Notice */}
          <div className="p-5 border border-[#E8E7E3] bg-[#FCFCFB] flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#5B6169] shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#5B6169] leading-relaxed space-y-1">
              <div className="font-semibold text-[#16181C]">Important Transparency Notice</div>
              <p>
                This result is an estimate based on publicly observable signals and does not confirm a creator&apos;s private contract or AdSense status. YT MONETIZE is an independent creator utility and is not affiliated with YouTube or Google LLC.
              </p>
            </div>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#E8E7E3]">
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
            When to Use This Tool
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Competitor Research:</strong>
              Check if competing channels in your niche have successfully unlocked ad revenue and commercial features.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Brand Sponsorship Vetting:</strong>
              Marketers and sponsors can quickly verify whether an influencer is actively running ad campaigns.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Channel Monetization Tracking:</strong>
              Track your own channel growth milestones as you progress toward YouTube Partner Program qualification.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Due Diligence for Acquisitions:</strong>
              Inspect public health metrics before partnering with or acquiring a digital creator brand.
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
        <RelatedTools currentToolId="monetization-checker" />
      </div>
    </>
  );
}
