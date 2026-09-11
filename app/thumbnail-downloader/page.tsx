import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { ThumbnailDownloaderClient } from '@/components/tools/ThumbnailDownloaderClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { CheckCircle2, Info, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['thumbnail-downloader'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/thumbnail-downloader',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How to download YouTube video thumbnail in Full HD 1080p and 4K quality?',
    a: 'Paste any public YouTube video link or Shorts URL into the input field and click "Get Thumbnails". If the creator uploaded a high-resolution 1280x720 or 1920x1080 custom thumbnail, the HD maxres option will be unlocked for direct one-click download.',
  },
  {
    q: 'How to download YouTube Shorts thumbnail in high quality?',
    a: 'Paste the YouTube Shorts link (e.g. youtube.com/shorts/VIDEO_ID), and our grabber will extract the original maximum-resolution thumbnail image stored on YouTube CDN servers without watermarks.',
  },
  {
    q: 'How to download YouTube thumbnail on Android and iPhone mobile?',
    a: 'Open this page on your mobile browser, paste the video link, tap "Download Thumbnail", and tap "Save Image" to download the high-resolution JPG directly to your phone gallery.',
  },
  {
    q: 'Why do some older videos not have the Maxres 1080p option?',
    a: 'YouTube only generates maxresdefault.jpg if the channel owner originally uploaded a high-resolution custom thumbnail. For older videos, YouTube serves high-quality (HQ 480x360) and standard quality images.',
  },
  {
    q: 'Is it free to download YouTube thumbnail images without watermark?',
    a: 'Yes, 100% free with zero watermarks, no registration, and unlimited daily downloads.',
  },
];

export default function ThumbnailDownloaderPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/thumbnail-downloader',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Thumbnail Downloader', url: '/thumbnail-downloader' },
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
        <Breadcrumbs items={[{ label: 'Thumbnail Downloader' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <ImageIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Image Extraction Utility</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Thumbnail Downloader (HD 1080p, 4K &amp; Shorts)
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Download high-resolution YouTube video and Shorts thumbnails in Full HD (1080p), High Quality (HQ), and standard resolutions for free.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ThumbnailDownloaderClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How to Save High-Quality YouTube Thumbnails
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Our thumbnail grabber directly queries YouTube&apos;s image CDN (i.ytimg.com) across all official resolution tiers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Paste Any Video URL</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Supports standard watch links, shortened youtu.be links, and mobile YouTube Shorts links.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Instant Resolution Check</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                The tool verifies availability of Maxres (1080p), High (720p/480p), Medium, and Standard images.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. One-Click Save</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Download the exact master JPG file directly to your desktop or mobile photo gallery.
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
        <RelatedTools currentToolId="thumbnail-downloader" />
      </div>
    </>
  );
}
