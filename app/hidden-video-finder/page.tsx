import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { HiddenVideoFinderClient } from '@/components/tools/HiddenVideoFinderClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { FolderSearch, EyeOff, Lock, ShieldCheck, ListVideo } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Unlisted & Hidden Video Finder - Scan Channel Playlists',
  description:
    'Scan any YouTube channel or playlist to discover unlisted videos, find hidden playlist items, and detect locked private video slots. Free creator utility.',
  path: '/hidden-video-finder',
});

const faqs = [
  {
    q: 'How does the YouTube Unlisted Video Finder work?',
    a: 'When creators set videos to "Unlisted", they are hidden from the public channel video feed but can still be added to public or custom playlists. Our scanner indexes the channel’s public playlists and uploads to detect any unlisted video links and playlist items.',
  },
  {
    q: 'Can this tool play or unlock genuinely Private YouTube videos?',
    a: 'No, and neither can any legitimate tool on the internet. Private videos are strictly locked on Google’s secure servers and require the channel owner’s authenticated Google account. Our tool transparently detects private video slots inside playlists, but does not fabricate or violate Google security protocols.',
  },
  {
    q: 'What is the difference between Unlisted and Private YouTube videos?',
    a: 'Unlisted videos can be watched by anyone who has the link or finds them inside a playlist. Private videos can only be watched by the channel owner and up to 50 specific invited Google accounts.',
  },
  {
    q: 'Can I scan a specific YouTube playlist link directly?',
    a: 'Yes! You can paste a playlist URL (e.g. youtube.com/playlist?list=PL...), and our scanner will analyze all items in that playlist to identify unlisted videos, public items, and deleted or privated slots.',
  },
  {
    q: 'Is this scanner free to use?',
    a: 'Yes, 100% free with no login, no API key setup, and no software installation required.',
  },
];

export default function HiddenVideoFinderPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Unlisted & Hidden Video Finder',
    description:
      'Scan YouTube channels and playlists to discover unlisted videos and inspect locked private video slots.',
    path: '/hidden-video-finder',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hidden Video Finder', url: '/hidden-video-finder' },
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
        <Breadcrumbs items={[{ label: 'Unlisted & Hidden Video Finder' }]} />

        {/* Header Intro */}
        <div className="space-y-3 max-w-[820px]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D6293C]/10 text-[#D6293C] text-[12px] font-bold tracking-wide rounded-full">
            <FolderSearch className="w-3.5 h-3.5" />
            <span>Channel &amp; Playlist Unlisted Scanner</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Unlisted &amp; Hidden Video Finder
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Scan any YouTube channel or playlist to uncover unlisted videos hidden inside public playlists, inspect collection structures, and identify privated video slots.
          </p>
        </div>

        {/* Client Interactive Tool */}
        <HiddenVideoFinderClient />

        {/* Contextual / Educational Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Understanding YouTube Video Visibility States
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              YouTube provides creators with three distinct privacy settings for uploaded content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <ListVideo className="w-4 h-4 text-[#1E9E6B]" />
                <h3>1. Public Videos</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Indexed in YouTube search, featured on the creator’s channel tab, and recommended across the YouTube algorithm.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <EyeOff className="w-4 h-4 text-[#F59E0B]" />
                <h3>2. Unlisted Videos</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Hidden from search results and the main videos feed, but fully accessible to anyone who has the direct link or accesses them through a playlist.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <Lock className="w-4 h-4 text-[#D6293C]" />
                <h3>3. Private Videos</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Strictly encrypted by Google. Playback is locked exclusively to the creator’s logged-in Google account and specific whitelisted email invites.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Scam Warning Notice */}
        <section className="space-y-4 pt-4">
          <h2 className="text-[20px] md:text-[24px] font-semibold text-[#16181C]">
            Beware of &quot;Private Video Viewer&quot; Scams
          </h2>
          <div className="p-6 bg-white border border-[#E8E7E3] space-y-3 text-[14px] text-[#5B6169] leading-relaxed">
            <p>
              Many fraudulent websites and browser extensions claim to &quot;unlock&quot; or &quot;download&quot; private YouTube videos. In reality:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong className="text-[#16181C]">No third-party tool can bypass Google OAuth:</strong> YouTube’s streaming endpoints verify account credentials server-side before delivering video data packets.
              </li>
              <li>
                <strong className="text-[#16181C]">Beware of malware and credential stealers:</strong> Never download unknown software or input your Google password into websites claiming to reveal private videos.
              </li>
              <li>
                <strong className="text-[#16181C]">Our commitment to accuracy:</strong> We provide real, verifiable scanning of unlisted videos indexed in playlists while honestly reporting the true privacy state of protected items.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#5B6169]">
              Everything you need to know about finding unlisted and hidden YouTube videos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-5 bg-white border border-[#E8E7E3] space-y-2">
                <h3 className="text-[15px] font-semibold text-[#16181C] flex items-start gap-2">
                  <span className="text-[#D6293C] font-bold">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#5B6169] leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentToolId="hidden-video-finder" />
      </div>
    </>
  );
}
