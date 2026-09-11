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

      <div className="space-y-24 py-4 relative">
        {/* Ambient Top Violet Glow & Water Glass Highlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[920px] max-w-full h-[420px] bg-gradient-to-b from-[#7C3AED]/12 via-[#A78BFA]/6 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-24 left-1/4 w-72 h-72 bg-white/40 rounded-full blur-2xl pointer-events-none -z-10" />

        {/* 1. HERO SECTION (iOS 26 / Android 16 Pure Water Glassmorphism) */}
        <section id="hero-section" className="space-y-6 text-center max-w-[900px] mx-auto pt-6 pb-2">
          {/* Top Pill Announcement - Ultra Clear Water Glass Capsule */}
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full glass-pill text-[12.5px] font-semibold text-[#181135] shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
            <span className="font-bold text-[#7C3AED]">YT MONETIZE</span>
            <span className="text-[#DDD0FA]">•</span>
            <span className="text-[#635B80]">100% Free</span>
            <span className="text-[#DDD0FA]">•</span>
            <span className="text-[#635B80]">No Login Required</span>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <span className="text-[#7C3AED] font-medium hidden sm:inline">Real-time Signals</span>
          </div>

          {/* Display Headline with Pure Water White & Violet Glass Gradient */}
          <h1 className="text-[36px] sm:text-[50px] md:text-[58px] font-extrabold text-[#181135] tracking-tight leading-[1.12]">
            All-in-One YouTube{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#9061F9] to-[#6D28D9] drop-shadow-[0_2px_12px_rgba(124,58,237,0.15)]">
              Creator Suite &amp; Tools
            </span>
          </h1>

          {/* Subheading - Calm, Eye-Safe & Relaxing Glass Note */}
          <p className="text-[16px] md:text-[18px] text-[#554E70] leading-relaxed max-w-[720px] mx-auto font-normal">
            The free, privacy-first platform built for creators, marketers, and researchers. Check public monetization signals, calculate earnings, extract SEO tags, and explore YouTube data in seconds.
          </p>

          {/* 3D Elevated Main Tool Card (Pure Liquid Water Glass) */}
          <div className="pt-3 max-w-[820px] mx-auto">
            <div className="tool-card-3d p-5 sm:p-7 text-left">
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#EDE8F9]/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] shrink-0 shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                  <span className="text-[12px] sm:text-[14px] font-bold text-[#181135] uppercase tracking-wider truncate">
                    Quick Monetization &amp; Channel Checker
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#7C3AED] bg-[#F3EEFE]/90 px-3 py-1 rounded-full border border-[#DDD0FA] whitespace-nowrap shrink-0 shadow-2xs">
                  ⚡ Instant Analysis
                </span>
              </div>
              <HeroCheckerClient />
            </div>
          </div>

          {/* 4 Metric / Highlight Cards (Directly matching SiamPay 3D Cards from Screenshot 2) */}
          <div className="pt-4 max-w-[800px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="tool-card-3d p-4 sm:p-5 text-center space-y-1">
              <div className="text-[24px] sm:text-[28px] font-black text-[#7C3AED] tracking-tight font-mono-data">
                &lt; 1s
              </div>
              <div className="text-[11px] font-bold text-[#635B80] tracking-wider uppercase">
                Instant Analysis
              </div>
            </div>

            <div className="tool-card-3d p-4 sm:p-5 text-center space-y-1">
              <div className="text-[24px] sm:text-[28px] font-black text-[#7C3AED] tracking-tight font-mono-data">
                100%
              </div>
              <div className="text-[11px] font-bold text-[#635B80] tracking-wider uppercase">
                Free &amp; No Login
              </div>
            </div>

            <div className="tool-card-3d p-4 sm:p-5 text-center space-y-1">
              <div className="text-[24px] sm:text-[28px] font-black text-[#7C3AED] tracking-tight font-mono-data">
                13+
              </div>
              <div className="text-[11px] font-bold text-[#635B80] tracking-wider uppercase">
                Creator Utilities
              </div>
            </div>

            <div className="tool-card-3d p-4 sm:p-5 text-center space-y-1">
              <div className="text-[24px] sm:text-[28px] font-black text-[#7C3AED] tracking-tight font-mono-data">
                0%
              </div>
              <div className="text-[11px] font-bold text-[#635B80] tracking-wider uppercase">
                No Logs / Private
              </div>
            </div>
          </div>

          {/* Action Navigation Buttons (SiamPay Primary & Secondary Style) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/monetization-checker"
              id="hero-primary-cta"
              className="btn-siampay-primary w-full sm:w-auto px-8 py-3.5 text-[15px] font-bold text-white flex items-center justify-center gap-2 group"
            >
              <span>Check Monetization Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#tools-grid-section"
              id="hero-secondary-cta"
              className="btn-siampay-secondary w-full sm:w-auto px-7 py-3.5 text-[15px] font-bold flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Explore All 13+ Tools</span>
            </a>
          </div>
        </section>

        {/* 2. MORE FREE TOOLS GRID WITH 3D ROUNDED CARDS */}
        <section id="tools-grid-section" className="space-y-10">
          <div className="text-center space-y-3 max-w-[640px] mx-auto">
            <div className="inline-block px-3.5 py-1 text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#F3EEFE] rounded-full border border-[#DDD0FA] whitespace-nowrap shrink-0">
              All {TOOLS.length} Creator Utilities
            </div>
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#181135] tracking-tight">
              Explore All YouTube Creator Tools
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#635B80] leading-relaxed">
              Every tool is completely free, runs client-safe queries, and requires no registration or API keys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                id={`home-tool-card-${tool.id}`}
                className="tool-card-3d group p-7 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-[18px] bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center group-hover:border-[#7C3AED] transition-colors shadow-2xs">
                      <ToolIcon name={tool.icon} className="w-6 h-6 text-[#7C3AED]" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {tool.badge === 'MOST POPULAR' && (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-white bg-gradient-to-r from-[#7C3AED] to-[#9333EA] rounded-full uppercase tracking-wider shadow-2xs">
                          MOST POPULAR
                        </span>
                      )}
                      {tool.badge === 'POPULAR' && (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-[#7C3AED] bg-[#F2ECFE] border border-[#DDD0FA] rounded-full uppercase tracking-wider">
                          POPULAR
                        </span>
                      )}
                      {tool.badge === 'NEW' && (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full uppercase tracking-wider">
                          NEW
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#7C3AED] bg-[#F4EFFE] rounded-full uppercase tracking-wider border border-[#DDD0FA] whitespace-nowrap shrink-0">
                        <CategoryIcon category={tool.category} className="w-3 h-3 text-[#7C3AED]" />
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[19px] font-bold text-[#181135] group-hover:text-[#7C3AED] transition-colors leading-snug">
                      {tool.name}
                    </h3>
                    <p className="text-[14px] text-[#635B80] leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-[#EDE8F9] flex items-center justify-between text-[13px] font-bold text-[#7C3AED] group-hover:text-[#6D28D9] transition-colors">
                  <span className="flex items-center gap-1.5">
                    Open Tool
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[11px] text-[#7C3AED] font-bold bg-[#F2ECFE] px-3 py-0.5 rounded-full border border-[#DDD0FA] whitespace-nowrap shrink-0">
                    Free
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS (3 steps with 3D SiamPay cards) */}
        <section id="how-it-works-section" className="space-y-10">
          <div className="text-center space-y-2 max-w-[500px] mx-auto">
            <h2 className="text-[24px] md:text-[30px] font-bold text-[#181135]">How It Works</h2>
            <p className="text-[15px] text-[#635B80]">
              Three simple, frictionless steps to inspect any public YouTube resource.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="tool-card-3d p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center font-mono-data font-bold text-[16px] shadow-[0_6px_16px_rgba(124,58,237,0.3)]">
                  1
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F3EEFE] border border-[#DDD0FA] flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-[#7C3AED]" />
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#181135]">Enter YouTube Link</h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Paste any public YouTube channel URL, @handle, 24-character channel ID, or individual video URL into the search field with one click.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center font-mono-data font-bold text-[16px] shadow-[0_6px_16px_rgba(124,58,237,0.3)]">
                  2
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F3EEFE] border border-[#DDD0FA] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#7C3AED]" />
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#181135]">Pick Your Utility</h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Analyze monetization, extract SEO tags, calculate expected ad revenues, download HD thumbnails, or retrieve channel metadata.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center font-mono-data font-bold text-[16px] shadow-[0_6px_16px_rgba(124,58,237,0.3)]">
                  3
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F3EEFE] border border-[#DDD0FA] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#181135]">Export or Copy Results</h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                View instant confidence-rated monetization results, copy data cleanly to your clipboard, or download full-resolution image assets.
              </p>
            </div>
          </div>
        </section>

        {/* 4. WHY USE YT MONETIZE (Rounded 3D Feature Cards) */}
        <section id="why-us-section" className="space-y-8">
          <div className="text-center space-y-2 max-w-[600px] mx-auto">
            <h2 className="text-[24px] md:text-[30px] font-bold text-[#181135]">Why Creators Use YT MONETIZE</h2>
            <p className="text-[15px] text-[#635B80]">
              Designed for transparent research without artificial paywalls, intrusive ads, or forced accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#181135]">Honest Confidence-Aware Signals</h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                We never manufacture fake certainty or claim private access to YouTube&apos;s internal financial accounts. Every check explains the observable public signals used to reach its estimate.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
                <Zap className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#181135]">Completely Free &amp; No Signup</h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                No credit card, no email collection, and no annoying popups. Get the answer you came for within seconds, copy what you need, and proceed with your workflow.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEFE] border border-[#DDD0FA] flex items-center justify-center text-[#7C3AED]">
                <Gauge className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#181135]">High-Performance Edge Architecture</h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Built with Next.js App Router and edge caching. Lookups execute rapidly without client-side bloat, heavy tracking libraries, or invasive cookies.
              </p>
            </div>

            <div className="tool-card-3d p-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#635B80]/10 border border-[#635B80]/20 flex items-center justify-center text-[#635B80]">
                <Copy className="w-5 h-5 text-[#635B80]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#181135]">One-Click Copy &amp; Clean Downloads</h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Copy Channel IDs, video tags, and metadata cleanly to your clipboard without hidden promotional watermarks. Direct full-resolution media downloads for thumbnails and channel banners.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section id="faq-section" className="space-y-6 max-w-[800px] mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-[24px] md:text-[30px] font-bold text-[#181135]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#635B80]">
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
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-all px-5 py-2.5 rounded-full border border-[#DDD0FA] bg-[#F3EEFE] hover:bg-[#EAE1FC] shadow-2xs"
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
