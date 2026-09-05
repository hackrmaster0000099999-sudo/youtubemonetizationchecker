import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { ThumbnailDownloaderClient } from '@/components/tools/ThumbnailDownloaderClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { CheckCircle2, Info, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Thumbnail Downloader',
  description: 'Download high-quality YouTube video thumbnails in HD 1080p, 720p, HQ, and SD. Free, instant extraction from any YouTube video link.',
  path: '/thumbnail-downloader',
});

const faqs = [
  {
    q: 'How do I download a YouTube video thumbnail in HD 1080p?',
    a: 'Paste any public YouTube video link or Shorts URL into the input field and click "Get Thumbnails". If the creator uploaded a high-resolution 1280x720 or 1920x1080 custom thumbnail, the HD maxres option will be unlocked for direct one-click download.',
  },
  {
    q: 'Why do some older videos not have the Maxres 1080p option?',
    a: 'YouTube only stores maxresdefault.jpg (1280x720) if the channel owner originally uploaded a high-resolution custom thumbnail. For older videos or videos where no custom image was provided, YouTube automatically generates standard 480x360 (HQ) frames.',
  },
  {
    q: 'Can I download YouTube Shorts thumbnails?',
    a: 'Yes. Paste the YouTube Shorts link (e.g. youtube.com/shorts/VIDEO_ID), and the tool will extract the primary thumbnail preview image stored on YouTube CDN servers.',
  },
  {
    q: 'Is it free to download YouTube thumbnails?',
    a: 'Yes, 100% free with no registration, watermark, or daily limits.',
  },
];

export default function ThumbnailDownloaderPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Thumbnail Downloader',
    description: 'Download high-quality YouTube video thumbnails in HD 1080p, HQ, and standard resolutions with YT MONETIZE.',
    path: '/thumbnail-downloader',
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3E2DE] text-[12px] font-bold text-[#5B6169] uppercase tracking-wider shadow-2xs">
            <ImageIcon className="w-3.5 h-3.5 text-[#D6293C]" />
            <span>Creative Asset Utility</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Thumbnail Downloader
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Extract and download full-resolution YouTube video thumbnails in HD 1080p, 720p, High Quality (HQ), and Standard Definition directly from YouTube CDN servers.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ThumbnailDownloaderClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              How to Download YouTube Thumbnails
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Our downloader connects directly to YouTube official static image servers to retrieve original asset files:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>1. Paste Video URL</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Paste any standard watch URL (<code className="font-mono-data text-[12px] bg-[#FCFCFB] px-1">watch?v=...</code>), short URL (<code className="font-mono-data text-[12px] bg-[#FCFCFB] px-1">youtu.be/...</code>), or Shorts link.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>2. Preview Image Quality</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                The tool scans available CDN image buckets (MaxRes 1280x720, SD 640x480, HQ 480x360) and renders a crisp visual preview.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>3. One-Click JPG Save</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Save the clean JPG file directly to your desktop or mobile device without compression artifacts or watermarks.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] text-[14px] text-[#5B6169] space-y-2">
            <p>
              Looking for channel avatars or banner artwork instead? Use our{' '}
              <Link href="/image-downloader" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Image Downloader
              </Link>{' '}
              or inspect hidden video tags with the{' '}
              <Link href="/tag-extractor" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Tag Extractor
              </Link>
              .
            </p>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#E8E7E3]">
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
            When to Use a YouTube Thumbnail Downloader
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Graphic Design &amp; Inspiration:</strong>
              Analyze color schemes, typography, and visual layout compositions used by top-performing creators in your niche.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Presentation &amp; Case Studies:</strong>
              Embed original high-res cover art in marketing decks, creator reports, and educational articles.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Asset Recovery:</strong>
              Retrieve your own original cover art files if you accidentally deleted local copies of your past uploads.
            </div>
            <div className="p-4 bg-white border border-[#E8E7E3] text-[14px] text-[#5B6169]">
              <strong className="text-[#16181C] block mb-1">Video Embedding:</strong>
              Generate fast static poster images for custom website video players and blog headers.
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
        <RelatedTools currentToolId="thumbnail-downloader" />
      </div>
    </>
  );
}
