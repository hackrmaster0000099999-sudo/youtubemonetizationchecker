import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { ChannelIdFinderClient } from '@/components/tools/ChannelIdFinderClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { Info, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Channel ID Finder',
  description:
    'Find a YouTube channel ID from a channel URL, handle, or username with our free Channel ID Finder. Get the channel identifier quickly and easily.',
  path: '/channel-id-finder',
});

const faqs = [
  {
    q: 'What is a YouTube Channel ID?',
    a: 'A YouTube Channel ID is a unique, immutable 24-character string starting with "UC" (for example, UCX6OQ3DkcsbYNE6H8uQQuVA) that permanently identifies a YouTube channel regardless of name or handle changes.',
  },
  {
    q: 'Where is a YouTube Channel ID required?',
    a: 'Channel IDs are needed when configuring YouTube Data API queries, setting up third-party analytics dashboards, adding live subscriber counters, embedding RSS feeds, or white-listing creator accounts in advertising software.',
  },
  {
    q: 'How does this tool find the Channel ID from a handle or video link?',
    a: 'The tool queries YouTube public endpoint manifests, resolves vanity URLs and @handles to their canonical resource representations, and extracts the primary UC-prefixed identifier.',
  },
  {
    q: 'Can a channel owner change their YouTube Channel ID?',
    a: 'No. While creators can change their display name, custom URL, and @handle, the underlying UC channel ID remains permanently fixed for the lifetime of the channel.',
  },
];

export default function ChannelIdFinderPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Channel ID Finder',
    description: 'Find and copy canonical 24-character YouTube channel IDs from URLs, handles, and video links with YT MONETIZE.',
    path: '/channel-id-finder',
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
            <span>Channel ID Utility</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Channel ID Finder
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Find the canonical 24-character YouTube channel ID (UC...) for any channel, creator handle, or video URL. One-click copy with instant RSS feed links.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ChannelIdFinderClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How to Find Any YouTube Channel ID
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              YouTube introduced modern @handles and custom URLs, but most developer tools, plugins, and RSS readers still require the raw 24-character Channel ID:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Paste Any YouTube Link</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Enter any format including <code className="font-mono-data text-[12px] bg-white/60 px-1 py-0.5 rounded border border-[#EDE8F9]">youtube.com/@handle</code>, custom URLs, legacy usernames, or video URLs.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Instant Canonical Extraction</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                The engine resolves redirects, parses verified channel metadata, and extracts the unique UC-prefixed identifier immediately.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. One-Click Copy & RSS</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Copy the channel ID with one tap, or grab the ready-to-use YouTube XML RSS feed link for feed readers and Discord bots.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4.5 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl text-[14px] text-[#635B80] space-y-2 shadow-2xs">
            <p>
              Once you have the channel ID, you can check its monetization status with our{' '}
              <Link href="/monetization-checker" className="text-[#7C3AED] font-bold hover:underline">
                YouTube Monetization Checker
              </Link>{' '}
              or inspect full metadata in the{' '}
              <Link href="/data-viewer" className="text-[#7C3AED] font-bold hover:underline">
                YouTube Metadata Viewer
              </Link>
              .
            </p>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#EDE8F9]">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
            When You Need a YouTube Channel ID
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">API Integrations:</strong>
              When setting up YouTube Data API v3 scripts, channel endpoints strictly mandate the UC channel ID.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">RSS Feeds &amp; Webhooks:</strong>
              Syndicating new video notifications to Discord, Telegram, or RSS readers requires the channel XML feed URL.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">Website Widgets &amp; Embeds:</strong>
              Third-party YouTube subscribe buttons and showcase sliders often require the permanent ID.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">Creator Collaboration:</strong>
              Cross-check official channel identifiers to prevent impersonation when signing influencer agreements.
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

        {/* Related Tools */}
        <RelatedTools currentToolId="channel-id-finder" />
      </div>
    </>
  );
}
