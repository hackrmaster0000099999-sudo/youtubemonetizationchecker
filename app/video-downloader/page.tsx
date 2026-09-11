import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { VideoDownloaderClient } from '@/components/tools/VideoDownloaderClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { CheckCircle2, Info, Film, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Video Downloader (1080p, 720p, MP4, MP3 with File Size)',
  description:
    'Free YouTube video downloader supporting all resolutions (1080p Full HD, 720p HD, 480p, 360p, 240p, 144p) and MP3 audio with instant MB file size calculation.',
  path: '/video-downloader',
});

const faqs = [
  {
    q: 'How do I download a YouTube video in 1080p Full HD?',
    a: 'Simply paste the YouTube video link into the input field and click "Get Video Downloads". The tool will instantly analyze all available streams and present 1080p Full HD, 720p HD, 480p, 360p, and MP3 audio with their exact calculated file sizes in MB.',
  },
  {
    q: 'How is the file size (MB) calculated for each resolution?',
    a: 'The file size is dynamically computed by multiplying the stream video/audio bitrate (e.g. 5,200 kbps for 1080p) by the exact video duration in seconds using the formula: (Bitrate × Duration) / 8 / 1024. This gives you an accurate estimate before downloading.',
  },
  {
    q: 'Can I download audio only as MP3 or M4A?',
    a: 'Yes. Switch to the "Audio Only" tab in the tool results to choose between 320 kbps studio MP3 audio, 256 kbps AAC/M4A, 128 kbps standard audio, and 64 kbps voice mode.',
  },
  {
    q: 'Does it work with YouTube Shorts and mobile devices?',
    a: 'Yes, full support is provided for YouTube Shorts URLs (youtube.com/shorts/...) as well as standard watch links. It works smoothly across all iPhone, Android, iPad, Mac, and Windows browsers without requiring app installs or user login.',
  },
  {
    q: 'Is this YouTube video downloader 100% free?',
    a: 'Yes, YT MONETIZE provides this utility completely free of charge with zero account registration, no watermarks, and no usage limits.',
  },
];

export default function VideoDownloaderPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Video Downloader',
    description: 'Download YouTube videos in MP4, WEBM, and MP3 formats across all resolutions with real-time file size calculation.',
    path: '/video-downloader',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Video Downloader', url: '/video-downloader' },
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
        <Breadcrumbs items={[{ label: 'Video Downloader' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[840px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <Film className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Media Download &amp; Resolution Utility</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Video Downloader
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Analyze and download YouTube videos across all available resolutions (1080p Full HD, 720p HD, 480p, 360p, 240p, 144p) and MP3 audio with instant calculated file sizes in MB.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <VideoDownloaderClient />

        {/* How The Tool Works */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How to Download YouTube Videos with File Size Estimation
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Follow these simple steps to inspect video resolutions and retrieve your files:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>1. Paste YouTube URL</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Paste any standard watch URL, Short link, or 11-character video ID into the input field above.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>2. Check MB Size &amp; Quality</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Filter between MP4, WEBM, and MP3 audio. View exact video bitrates, frames per second (FPS), and calculated MB storage requirements.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3>3. Save to Device</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Click download on your desired resolution to save the media file directly to your desktop, smartphone, or tablet.
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4.5 bg-white/70 backdrop-blur-md border border-[#EDE8F9] rounded-2xl text-[14px] text-[#635B80] space-y-2 shadow-2xs">
            <p>
              Need to extract cover artwork? Use our{' '}
              <Link href="/thumbnail-downloader" className="text-[#7C3AED] font-bold hover:underline">
                YouTube Thumbnail Downloader
              </Link>{' '}
              or inspect hidden metadata with the{' '}
              <Link href="/data-viewer" className="text-[#7C3AED] font-bold hover:underline">
                YouTube Data Viewer
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-4 pt-6 border-t border-[#EDE8F9]">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
            Why Use YT MONETIZE Video Downloader?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-2">
              <div className="flex items-center gap-2 text-[#181135] font-bold">
                <HardDrive className="w-4 h-4 text-[#7C3AED]" />
                <span>Live File Size Calculation</span>
              </div>
              <p>
                Know exact download sizes in MB and GB before starting the download so you never run out of disk storage or mobile bandwidth.
              </p>
            </div>

            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-2">
              <div className="flex items-center gap-2 text-[#181135] font-bold">
                <Film className="w-4 h-4 text-[#7C3AED]" />
                <span>All Resolution Tiers</span>
              </div>
              <p>
                Full support for 1080p Full HD, 720p HD, 480p, 360p, 240p, and 144p data saver formats across MP4 and WEBM codecs.
              </p>
            </div>

            <div className="p-5 tool-card-3d text-[14px] text-[#635B80] space-y-2">
              <div className="flex items-center gap-2 text-[#181135] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                <span>No Account or Software Needed</span>
              </div>
              <p>
                100% web-based without software installation, browser plugins, or registration hurdles.
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

        {/* Related Tools */}
        <RelatedTools currentToolId="video-downloader" />
      </div>
    </>
  );
}
