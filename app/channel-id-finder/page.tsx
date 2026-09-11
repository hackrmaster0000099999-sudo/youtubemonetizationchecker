import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { ChannelIdFinderClient } from '@/components/tools/ChannelIdFinderClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { Info, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['channel-id-finder'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/channel-id-finder',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to find YouTube channel ID from URL or handle?',
    a: 'Paste any YouTube channel link (e.g. youtube.com/@username, youtube.com/c/customname, or a video URL) into the finder. Our tool resolves vanity names to extract the canonical 24-character UC channel identifier instantly.',
  },
  {
    q: 'What is a YouTube Channel ID and why is it needed for APIs?',
    a: 'A YouTube Channel ID is a permanent, unique 24-character string beginning with "UC" (e.g., UCX6OQ3DkcsbYNE6H8uQQuVA). It is required when setting up YouTube Data API integrations, webhooks, live subscriber counters, and RSS feeds.',
  },
  {
    q: 'How to get YouTube channel ID on mobile browser?',
    a: 'Open this page on your mobile device, paste the channel URL or share link from the YouTube mobile app, and tap "Find Channel ID". You can copy the resulting UC ID with one click.',
  },
  {
    q: 'Can a creator change their YouTube Channel ID?',
    a: 'No. While creators can change their handle (@name), display name, and custom URL, the underlying UC channel ID remains immutable and permanent forever.',
  },
  {
    q: 'Is this YouTube Channel ID Finder tool free?',
    a: 'Yes, 100% free with no sign-up, no extension installation, and unlimited lookups.',
  },
];

export default function ChannelIdFinderPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/channel-id-finder',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Channel ID Finder', url: '/channel-id-finder' },
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
        <Breadcrumbs items={[{ label: 'Channel ID Finder' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <Search className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Identifier Resolver</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Channel ID Finder &amp; Handle Converter
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Find and convert YouTube channel IDs from URLs, handles (@username), custom links, or video URLs into canonical 24-character UC identifiers.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ChannelIdFinderClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How to Find and Copy YouTube Channel IDs
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Our resolver queries YouTube&apos;s canonical registry to extract permanent channel identifiers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Input Any Format</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Accepts handles (e.g. @MrBeast), vanity URLs (youtube.com/c/name), or any video link from that creator.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Resolve Canonical ID</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                The resolver queries YouTube metadata to extract the official 24-character &quot;UC...&quot; string.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. One-Click Copy</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Copy the channel ID or use direct quick links to inspect monetization, telemetry, and banner assets.
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
        <RelatedTools currentToolId="channel-id-finder" />
      </div>
    </>
  );
}
