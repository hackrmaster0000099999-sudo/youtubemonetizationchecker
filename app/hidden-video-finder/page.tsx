import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { HiddenVideoFinderClient } from '@/components/tools/HiddenVideoFinderClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { FolderSearch, EyeOff, Lock, ShieldCheck, ListVideo, Info } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['hidden-video-finder'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/hidden-video-finder',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to find unlisted YouTube videos without link?',
    a: 'When creators set videos to "Unlisted", they are hidden from the public channel video feed but can still be added to public or custom playlists. Our scanner indexes the channel’s public playlists and uploads to detect any unlisted video links and secret playlist items without requiring the direct URL.',
  },
  {
    q: 'Can this tool play or unlock private YouTube videos?',
    a: 'No, and neither can any legitimate tool on the internet. Private videos are strictly locked on Google’s secure servers and require the channel owner’s authenticated Google account. Our tool transparently detects private video slots inside playlists, but does not fabricate or violate Google security protocols.',
  },
  {
    q: 'What is the difference between Unlisted and Private YouTube videos?',
    a: 'Unlisted videos can be watched by anyone who has the link or finds them inside a playlist. Private videos can only be watched by the channel owner and up to 50 specific invited Google accounts.',
  },
  {
    q: 'How to discover hidden videos on YouTube playlists and channels?',
    a: 'Simply paste a YouTube channel link, @handle, or playlist URL into our scanner. The search engine inspects playlist manifests, extracts video IDs, and flags videos that do not appear in the standard public uploads list.',
  },
  {
    q: 'How to watch unlisted videos on YouTube on mobile browsers?',
    a: 'Paste the channel or playlist link into our mobile-responsive finder tool. Once the unlisted videos are discovered, you can tap on any video card to open it directly in the YouTube mobile app or browser player.',
  },
  {
    q: 'Is this YouTube unlisted video search engine free?',
    a: 'Yes, 100% free with no login, no API key setup, and no software installation required.',
  },
];

export default function HiddenVideoFinderPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/hidden-video-finder',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Unlisted & Hidden Video Finder', url: '/hidden-video-finder' },
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
        <Breadcrumbs items={[{ label: 'Hidden Video Finder' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <FolderSearch className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Playlist &amp; Video Scanner</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Unlisted &amp; Hidden Video Finder
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Scan any YouTube channel or playlist to discover unlisted videos, find hidden playlist items, and detect locked private video slots.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <HiddenVideoFinderClient />

        {/* How It Works Section */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How the YouTube Unlisted Video Search Engine Works
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Our automated discovery engine crawls accessible public video manifests, playlist collections, and upload registries:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <ListVideo className="w-4 h-4 text-[#7C3AED]" />
                <h3>1. Index All Playlists</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                The scanner analyzes public playlists created by the creator, looking for indexed video references.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <EyeOff className="w-4 h-4 text-amber-500" />
                <h3>2. Flag Unlisted Items</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Videos that exist inside playlists but are omitted from the main uploads feed are identified as unlisted.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Lock className="w-4 h-4 text-rose-500" />
                <h3>3. Private Slot Detection</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Detects deleted or privately locked videos embedded inside public playlists with transparent status indicators.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy vs Unlisted Notice */}
        <section className="space-y-4 pt-6 border-t border-[#EDE8F9]">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
            Understanding YouTube Video Privacy Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-emerald-700 block font-bold text-[15px]">Public Videos</strong>
              Visible on channel home, searchable across YouTube, and recommended in the algorithm to all viewers.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-amber-700 block font-bold text-[15px]">Unlisted Videos</strong>
              Hidden from search and channel feeds, but accessible to anyone who has the direct link or finds them in a playlist.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-rose-700 block font-bold text-[15px]">Private Videos</strong>
              Completely locked on Google servers. Accessible only to the channel owner and specifically authorized accounts.
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
        <RelatedTools currentToolId="hidden-video-finder" />
      </div>
    </>
  );
}
