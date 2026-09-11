import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { ImageDownloaderClient } from '@/components/tools/ImageDownloaderClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { CheckCircle2, Info, Download } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['image-downloader'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/image-downloader',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How do I download a YouTube channel banner or cover image in HD?',
    a: 'Paste any YouTube channel link, creator handle (e.g. @MrBeast), or video URL from that channel into the search box. Our tool extracts the full-width 2560x1440 high-res banner art for one-click downloading.',
  },
  {
    q: 'Can I download the high-resolution channel profile avatar (PFP)?',
    a: 'Yes. The tool automatically resolves the highest-resolution 800x800 pixel avatar directly from Google CDN servers rather than the compressed mobile icon.',
  },
  {
    q: 'What is the standard size for a YouTube channel banner image?',
    a: 'YouTube recommends 2560 x 1440 pixels for channel banners, with a central "safe area" of 1546 x 423 pixels that displays across all mobile devices, tablets, and desktop browsers.',
  },
  {
    q: 'How to download youtube banner image on mobile devices?',
    a: 'Simply open this page in your mobile browser, paste the channel URL or handle, click Download Image, and long-press or tap Save Image to store it in your phone gallery in full resolution.',
  },
  {
    q: 'Is it free to extract images, logos, and channel art from YouTube?',
    a: 'Yes, this tool is 100% free with no registration, watermark, or download caps.',
  },
];

export default function ImageDownloaderPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/image-downloader',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Image Downloader', url: '/image-downloader' },
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
        <Breadcrumbs items={[{ label: 'Image Downloader' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <Download className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Channel Art &amp; Image Downloader</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Image Downloader &amp; Channel Banner Grabber HD
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Extract and download high-resolution YouTube channel banner images (2560x1440), profile picture avatars (800x800 PFP), and channel logos directly from source Google CDN servers.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <ImageDownloaderClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How to Download YouTube Channel Banner &amp; Profile Picture in HD
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Our high-resolution extractor parses official Google UserContent CDN manifests to serve unaltered source images:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Input Channel or Video</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Paste any channel URL, creator @handle, or video uploaded by the creator to identify the parent channel art.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Full-Res Extraction</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                We extract the master 2560px banner asset and maximum quality 800px profile avatar without compression loss.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. Save Direct JPG Files</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Download the high-resolution files directly to your device for design references, brand mood boards, or backup archives.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4.5 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl text-[14px] text-[#635B80] space-y-2 shadow-2xs">
            <p>
              Looking for individual video thumbnails instead? Check the{' '}
              <Link href="/thumbnail-downloader" className="text-[#7C3AED] font-bold hover:underline">
                YouTube Thumbnail Downloader
              </Link>{' '}
              or get the channel&apos;s unique ID with the{' '}
              <Link href="/channel-id-finder" className="text-[#7C3AED] font-bold hover:underline">
                YouTube Channel ID Finder
              </Link>
              .
            </p>
          </div>
        </section>

        {/* When to Use This Tool */}
        <section className="space-y-4 pt-6 border-t border-[#EDE8F9]">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
            Key Use Cases for YouTube Channel Art &amp; Avatar Downloader
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">Brand Design Research:</strong>
              Examine visual identities and banner compositions created by top YouTubers in your vertical.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">Creator Profile Backups:</strong>
              Save original assets when re-branding or migrating your channel.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">Media Kits &amp; Sponsorships:</strong>
              Assemble sponsor decks and influencer campaign reports with authentic high-res channel imagery.
            </div>
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-1.5">
              <strong className="text-[#181135] block font-bold">Podcast &amp; Collaboration Showcases:</strong>
              Embed accurate guest channel artwork in your show notes or podcast website.
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
        <RelatedTools currentToolId="image-downloader" />
      </div>
    </>
  );
}
