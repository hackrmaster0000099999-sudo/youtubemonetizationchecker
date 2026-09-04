import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DollarSign,
  Search,
  Calculator,
  Image as ImageIcon,
  Download,
  Tag,
  ShieldAlert,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { HeroCheckerClient } from '@/components/tools/HeroCheckerClient';
import { HomeFaqClient } from '@/components/tools/HomeFaqClient';
import { TOOLS } from '@/lib/constants/site';
import { constructMetadata, generateWebSiteSchema, generateOrganizationSchema, generateFAQSchema } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Monetization Checker — Free Creator Utilities',
  description: 'Check if any YouTube channel or video is monetized. Free suite of creator utilities including Channel ID finder, thumbnail downloader, earnings calculator, and tag extractor.',
  path: '/',
});

const ICON_MAP: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="w-5 h-5 text-[#16181C]" />,
  Search: <Search className="w-5 h-5 text-[#16181C]" />,
  Calculator: <Calculator className="w-5 h-5 text-[#16181C]" />,
  Image: <ImageIcon className="w-5 h-5 text-[#16181C]" />,
  Download: <Download className="w-5 h-5 text-[#16181C]" />,
  Tag: <Tag className="w-5 h-5 text-[#16181C]" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-[#16181C]" />,
  BarChart2: <BarChart2 className="w-5 h-5 text-[#16181C]" />,
};

const HOME_FAQS = [
  {
    q: 'Can I check whether another YouTube channel is monetized?',
    a: 'Yes. You can paste any public channel URL, @handle, or video link. YT MONETIZE analyzes publicly observable indicators such as channel membership availability, merch store shelves, video ad placement signals, and subscriber milestones.',
  },
  {
    q: 'Can YouTube monetization be checked with 100% certainty?',
    a: 'No third-party tool can see private YouTube Partner Program contracts or AdSense backend accounts. Any platform claiming 100% official confirmation is misleading. Our tool provides an objective, confidence-weighted estimate based exclusively on real observable signals.',
  },
  {
    q: 'What is required for official YouTube monetization?',
    a: 'To qualify for the YouTube Partner Program (YPP), creators typically need at least 1,000 subscribers and 4,000 valid public watch hours in the past 12 months (or 10 million valid public Shorts views in 90 days), along with adherence to YouTube community guidelines and copyright policies.',
  },
  {
    q: 'Are any login credentials or channel access permissions required?',
    a: 'Never. YT MONETIZE is 100% free, requires no login, does not ask for Google OAuth access to your channel, and never collects personal user information.',
  },
];

export default function HomePage() {
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();
  const faqSchema = generateFAQSchema(HOME_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-24 py-6">
        {/* 1. HERO SECTION */}
        <section id="hero-section" className="space-y-6 text-center max-w-[760px] mx-auto pt-6 pb-2">
          <h1 className="text-[32px] md:text-[44px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Monetization Checker
          </h1>
          <p className="text-[16px] md:text-[17px] text-[#5B6169] leading-relaxed max-w-[620px] mx-auto">
            Check whether a YouTube channel or video shows public signals associated with monetization. Fast, accurate, and completely free.
          </p>

          <HeroCheckerClient />
        </section>

        {/* 2. MORE FREE TOOLS GRID */}
        <section id="tools-grid-section" className="space-y-8">
          <div className="text-center space-y-2 max-w-[600px] mx-auto">
            <h2 className="text-[24px] md:text-[30px] font-semibold text-[#16181C] tracking-tight">
              Free YouTube Creator Utilities
            </h2>
            <p className="text-[15px] text-[#5B6169]">
              A complete suite of utility tools built for YouTube creators, marketers, and video researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                id={`home-tool-card-${tool.id}`}
                className="tool-card-interactive group p-6 bg-white border border-[#E8E7E3] hover:border-[#16181C] active:scale-[0.98] transition-all flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2 border border-[#E8E7E3] bg-[#FCFCFB] inline-block group-hover:border-[#16181C] transition-colors">
                      {ICON_MAP[tool.icon] || <Search className="w-5 h-5 text-[#16181C]" />}
                    </div>
                    <span className="text-[11px] font-semibold text-[#5B6169] uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-[17px] font-semibold text-[#16181C] group-hover:text-[#D6293C] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-[14px] text-[#5B6169] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8E7E3] flex items-center justify-between text-[13px] font-semibold text-[#16181C] group-hover:text-[#D6293C] transition-colors">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS (3 steps per PRD Section 52) */}
        <section id="how-it-works-section" className="space-y-8 bg-white border border-[#E8E7E3] p-8 md:p-12 shadow-xs">
          <div className="text-center space-y-2 max-w-[500px] mx-auto">
            <h2 className="text-[24px] md:text-[28px] font-semibold text-[#16181C]">How It Works</h2>
            <p className="text-[15px] text-[#5B6169]">
              Three straightforward steps to inspect any YouTube resource.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-3">
              <div className="w-10 h-10 border border-[#E8E7E3] bg-[#FCFCFB] flex items-center justify-center font-mono-data font-semibold text-[18px] text-[#16181C]">
                1
              </div>
              <h3 className="text-[18px] font-semibold text-[#16181C]">Enter YouTube URL</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Paste a link to any public YouTube channel, @handle, channel ID, or individual video URL into the search box.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 border border-[#E8E7E3] bg-[#FCFCFB] flex items-center justify-center font-mono-data font-semibold text-[18px] text-[#16181C]">
                2
              </div>
              <h3 className="text-[18px] font-semibold text-[#16181C]">Choose or Use the Tool</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Click Check Now or select a focused creator utility like Thumbnail Downloader, Tag Extractor, or Channel ID Finder.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 border border-[#E8E7E3] bg-[#FCFCFB] flex items-center justify-center font-mono-data font-semibold text-[18px] text-[#16181C]">
                3
              </div>
              <h3 className="text-[18px] font-semibold text-[#16181C]">Get Your Result</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Instantly view confidence-aware monetization signals, copy key channel identifiers, or download clean high-res media.
              </p>
            </div>
          </div>
        </section>

        {/* 4. WHY USE YT MONETIZE */}
        <section id="why-us-section" className="space-y-8">
          <div className="text-center space-y-2 max-w-[600px] mx-auto">
            <h2 className="text-[24px] md:text-[28px] font-semibold text-[#16181C]">Why Creators Use YT MONETIZE</h2>
            <p className="text-[15px] text-[#5B6169]">
              Designed for transparent research without artificial barriers, paywalls, or forced accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#E8E7E3] space-y-2 shadow-xs">
              <h3 className="text-[18px] font-semibold text-[#16181C]">Honest Confidence-Aware Signals</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                We never fabricate certainty or claim private access to YouTube&apos;s internal financial systems. Every monetization check explains the observable public signals used to reach its estimate.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E7E3] space-y-2 shadow-xs">
              <h3 className="text-[18px] font-semibold text-[#16181C]">Completely Free &amp; No Signup</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                No credit card, no email collection, and no annoying popups. Get the answer you came for within seconds, copy what you need, and proceed with your day.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E7E3] space-y-2 shadow-xs">
              <h3 className="text-[18px] font-semibold text-[#16181C]">High-Performance Architecture</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Built with Next.js App Router and server-side request caching. Lookups execute rapidly without client-side bloat, heavy tracking libraries, or invasive trackers.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E7E3] space-y-2 shadow-xs">
              <h3 className="text-[18px] font-semibold text-[#16181C]">One-Click Copy &amp; Clean Downloads</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Copy Channel IDs, video tags, and metadata cleanly to your clipboard without hidden promotional watermarks. Direct full-resolution media downloads for thumbnails and channel art.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section id="faq-section" className="space-y-6 max-w-[800px] mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-[24px] md:text-[28px] font-semibold text-[#16181C]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#5B6169]">
              Answers to common questions regarding monetization checks and YouTube creator utilities.
            </p>
          </div>

          <HomeFaqClient faqs={HOME_FAQS} />

          <div className="text-center pt-4">
            <Link
              href="/faq"
              id="view-all-faqs-link"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#16181C] hover:text-[#D6293C] active:scale-95 transition-all"
            >
              <span>View all creator FAQs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
