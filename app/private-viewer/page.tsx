import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { PrivateViewerClient } from '@/components/tools/PrivateViewerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { ShieldCheck, EyeOff, Lock, Sparkles, Tv, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['private-viewer'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/private-viewer',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to watch YouTube videos anonymously without history and tracking?',
    a: 'Our private web player utilizes YouTube official Privacy-Enhanced sandbox (youtube-nocookie.com). In this mode, video viewing sessions are isolated without setting tracking cookies or logging watch history to your Google account.',
  },
  {
    q: 'Can I watch YouTube without login or signing into a Google account?',
    a: 'Yes! Simply paste any public video link into the search box. You can watch videos immediately without signing into Google or linking your personal profile.',
  },
  {
    q: 'Does watching videos here pollute my YouTube algorithm recommendations?',
    a: 'No. Because the player operates without cookies or account authorization, the videos you watch will never influence your main YouTube homepage recommendations or subscription feeds.',
  },
  {
    q: 'Is there an incognito player web tool for mobile browsers?',
    a: 'Yes! You can use this web tool on iPhone Safari, Android Chrome, tablets, or desktop browsers without installing apps or browser extensions.',
  },
  {
    q: 'Is this private YouTube video player free and safe?',
    a: 'Yes, 100% free, fully compliant with YouTube embedded privacy standards, and designed for distraction-free study and research.',
  },
];

export default function PrivateViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/private-viewer',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Private YouTube Viewer', url: '/private-viewer' },
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
        <Breadcrumbs items={[{ label: 'Private Viewer' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <EyeOff className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Incognito Video Player</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            Private YouTube Viewer (Anonymous Mode)
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Watch YouTube videos privately and anonymously without tracking cookies, Google account watch history, or distracting algorithm recommendation feeds.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <PrivateViewerClient />

        {/* Privacy Advantages */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              Why Use Private YouTube Viewing Mode?
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Experience video content with maximum privacy and focus:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3>Zero Watch History Tracking</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Prevents one-off research queries from altering your personal YouTube recommendations and suggestions.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Lock className="w-4 h-4 text-[#7C3AED]" />
                <h3>No Account Sign-In Needed</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Watch public videos cleanly on shared computers or work devices without logging into Google.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3>Distraction-Free Focus</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Removes distracting sidebars, clickbait thumbnails, and comment drama so you can focus on learning.
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
        <RelatedTools currentToolId="private-viewer" />
      </div>
    </>
  );
}
