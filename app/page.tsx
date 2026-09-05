import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  Copy,
  Link2,
  Wrench,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { HeroCheckerClient } from '@/components/tools/HeroCheckerClient';
import { HomeFaqClient } from '@/components/tools/HomeFaqClient';
import { TOOLS } from '@/lib/constants/site';
import { ToolIcon, CategoryIcon } from '@/components/common/ToolIcon';
import { constructMetadata, generateWebSiteSchema, generateOrganizationSchema, generateFAQSchema } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Tools & Monetization Checker',
  description:
    'Free YouTube tools to check monetization signals, find channel IDs, estimate earnings, download thumbnails, extract tags, and explore YouTube data.',
  path: '/',
});

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
        <section id="hero-section" className="space-y-6 text-center max-w-[840px] mx-auto pt-6 pb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8E7E3] shadow-sm text-[12px] font-semibold text-[#5B6169]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E6B] animate-pulse" />
            <span>YT MONETIZE · 100% Free · No Login Required · Instant Analysis</span>
          </div>

          <h1 className="text-[36px] sm:text-[46px] md:text-[54px] font-extrabold text-[#16181C] tracking-tight leading-[1.1]">
            All-in-One YouTube Creator Suite &amp; Tools
          </h1>
          <p className="text-[16px] md:text-[19px] text-[#5B6169] leading-relaxed max-w-[700px] mx-auto">
            The free, privacy-first platform built for YouTube creators, marketers, and researchers. Check public monetization signals, calculate creator earnings, extract SEO tags, and retrieve channel metadata in seconds.
          </p>

          <div className="pt-3 max-w-[760px] mx-auto">
            <div className="tool-card-3d p-5 sm:p-7 text-left">
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F0EFEB]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D6293C] shrink-0" />
                  <span className="text-[12px] sm:text-[14px] font-bold text-[#16181C] uppercase tracking-wider truncate">
                    Quick Monetization &amp; Channel Checker
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#5B6169] bg-[#F7F6F3] px-2.5 py-1 rounded-full border border-[#E8E7E3] whitespace-nowrap shrink-0">
                  Instant Check
                </span>
              </div>
              <HeroCheckerClient />
            </div>
          </div>
        </section>

        {/* 2. MORE FREE TOOLS GRID WITH 3D ROUNDED CARDS */}
        <section id="tools-grid-section" className="space-y-10">
          <div className="text-center space-y-3 max-w-[640px] mx-auto">
            <div className="inline-block px-3.5 py-1 text-[11px] font-bold text-[#D6293C] uppercase tracking-wider bg-[rgba(214,41,60,0.08)] rounded-full border border-[#D6293C]/20 whitespace-nowrap shrink-0">
              All 8 Creator Utilities
            </div>
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#16181C] tracking-tight">
              Explore All YouTube Creator Tools
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#5B6169] leading-relaxed">
              Every tool is completely free, runs client-safe queries, and requires no registration or API keys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                id={`home-tool-card-${tool.id}`}
                className="tool-card-3d group p-7 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl border border-[#E3E2DE] bg-[#F9F9F8] flex items-center justify-center group-hover:border-[#16181C] group-hover:bg-white group-hover:scale-105 transition-all shadow-2xs">
                      <ToolIcon name={tool.icon} className="w-6 h-6 text-[#16181C]" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#5B6169] bg-[#F9F9F8] rounded-full uppercase tracking-wider border border-[#E3E2DE] whitespace-nowrap shrink-0">
                      <CategoryIcon category={tool.category} className="w-3 h-3" />
                      {tool.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[19px] font-bold text-[#16181C] group-hover:text-[#D6293C] transition-colors leading-snug">
                      {tool.name}
                    </h3>
                    <p className="text-[14px] text-[#5B6169] leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-[#F0EFEB] flex items-center justify-between text-[13px] font-bold text-[#16181C] group-hover:text-[#D6293C] transition-colors">
                  <span className="flex items-center gap-1.5">
                    Open Tool
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[12px] text-[#5B6169] font-medium bg-[#F9F9F8] px-2.5 py-0.5 rounded-full border border-[#E3E2DE] whitespace-nowrap shrink-0">Free</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS (3 steps with rounded cards) */}
        <section id="how-it-works-section" className="space-y-10">
          <div className="text-center space-y-2 max-w-[500px] mx-auto">
            <h2 className="text-[24px] md:text-[30px] font-bold text-[#16181C]">How It Works</h2>
            <p className="text-[15px] text-[#5B6169]">
              Three simple, frictionless steps to inspect any public YouTube resource.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="tool-card-3d p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#16181C] text-white flex items-center justify-center font-mono-data font-bold text-[16px] shadow-sm">
                  1
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-[#D6293C]" />
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#16181C]">Enter YouTube Link</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Paste any public YouTube channel URL, @handle, 24-character channel ID, or individual video URL into the search field.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#16181C] text-white flex items-center justify-center font-mono-data font-bold text-[16px] shadow-sm">
                  2
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#16181C]" />
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#16181C]">Pick Your Utility</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Analyze monetization, extract SEO tags, calculate expected ad revenues, download HD thumbnails, or retrieve channel metadata.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#16181C] text-white flex items-center justify-center font-mono-data font-bold text-[16px] shadow-sm">
                  3
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#16181C]">Export or Copy Results</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                View instant confidence-rated monetization results, copy data cleanly to your clipboard, or download full-resolution image assets.
              </p>
            </div>
          </div>
        </section>

        {/* 4. WHY USE YT MONETIZE (Rounded 3D Feature Cards) */}
        <section id="why-us-section" className="space-y-8">
          <div className="text-center space-y-2 max-w-[600px] mx-auto">
            <h2 className="text-[24px] md:text-[30px] font-bold text-[#16181C]">Why Creators Use YT MONETIZE</h2>
            <p className="text-[15px] text-[#5B6169]">
              Designed for transparent research without artificial paywalls, intrusive ads, or forced accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center text-[#1E9E6B]">
                <ShieldCheck className="w-5 h-5 text-[#1E9E6B]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16181C]">Honest Confidence-Aware Signals</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                We never manufacture fake certainty or claim private access to YouTube&apos;s internal financial accounts. Every check explains the observable public signals used to reach its estimate.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center text-[#D6293C]">
                <Zap className="w-5 h-5 text-[#D6293C]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16181C]">Completely Free &amp; No Signup</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                No credit card, no email collection, and no annoying popups. Get the answer you came for within seconds, copy what you need, and proceed with your workflow.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center text-[#16181C]">
                <Gauge className="w-5 h-5 text-[#16181C]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16181C]">High-Performance Edge Architecture</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Built with Next.js App Router and edge caching. Lookups execute rapidly without client-side bloat, heavy tracking libraries, or invasive cookies.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center text-[#5B6169]">
                <Copy className="w-5 h-5 text-[#5B6169]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16181C]">One-Click Copy &amp; Clean Downloads</h3>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Copy Channel IDs, video tags, and metadata cleanly to your clipboard without hidden promotional watermarks. Direct full-resolution media downloads for thumbnails and channel banners.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section id="faq-section" className="space-y-6 max-w-[800px] mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-[24px] md:text-[30px] font-bold text-[#16181C]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#5B6169]">
              Answers to common questions regarding monetization checks and YouTube creator utilities.
            </p>
          </div>

          <div className="tool-card-3d p-6 md:p-8">
            <HomeFaqClient faqs={HOME_FAQS} />
          </div>

          <div className="text-center pt-2">
            <Link
              href="/faq"
              id="view-all-faqs-link"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#16181C] hover:text-[#D6293C] active:scale-95 transition-all px-4 py-2 rounded-full border border-[#E8E7E3] bg-white shadow-xs"
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
