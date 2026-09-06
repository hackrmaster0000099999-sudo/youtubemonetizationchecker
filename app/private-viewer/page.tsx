import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PrivateViewerClient } from '@/components/tools/PrivateViewerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { ShieldCheck, EyeOff, Lock, Sparkles, Tv, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Private YouTube Viewer - Watch YouTube Videos Anonymously',
  description:
    'Watch YouTube videos privately and anonymously without tracking cookies, Google account watch history, or distracting algorithm recommendation feeds. Free distraction-free player.',
  path: '/private-viewer',
});

const faqs = [
  {
    q: 'How does the Private YouTube Viewer protect my privacy?',
    a: 'Our player uses YouTube’s official Privacy-Enhanced Mode (youtube-nocookie.com). In this mode, YouTube does not set tracking cookies or connect your viewing session to your Google/YouTube account watch history.',
  },
  {
    q: 'Will videos I watch here appear in my YouTube search or watch history?',
    a: 'No. Because playback occurs in an isolated, privacy-enhanced sandbox without account synchronization, none of the videos you watch will be saved to your YouTube watch history or influence your homepage recommendations.',
  },
  {
    q: 'Can I watch YouTube videos without sidebar recommendations and distractions?',
    a: 'Yes! The Private Viewer removes the endless algorithmic recommendation sidebar, comments, and recommended rabbit holes, providing a clean, distraction-free environment ideal for studying, work, and focused research.',
  },
  {
    q: 'Do I need to install an extension or sign up for an account?',
    a: 'No sign-up, login, or extension is required. Simply paste any public YouTube video link and begin watching anonymously in seconds.',
  },
  {
    q: 'Does this violate YouTube terms of service or copyright laws?',
    a: 'No. The player uses YouTube’s official embedded player API and youtube-nocookie.com domain, which Google specifically provides for privacy compliance and web integration.',
  },
];

export default function PrivateViewerPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'Private YouTube Viewer (Anonymous Mode)',
    description:
      'Watch YouTube videos privately and anonymously without tracking cookies, Google account watch history, or distracting algorithm recommendation feeds.',
    path: '/private-viewer',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Private Viewer', url: '/private-viewer' },
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
        <Breadcrumbs items={[{ label: 'Private YouTube Viewer' }]} />

        {/* Header Intro */}
        <div className="space-y-3 max-w-[820px]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1E9E6B]/10 text-[#1E9E6B] text-[12px] font-bold tracking-wide rounded-full">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Anonymous &amp; Distraction-Free Playback</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            Private YouTube Viewer – Watch Videos Anonymously
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Watch any YouTube video without tracking cookies, Google account history synchronization, or distracting algorithm recommendations. Perfect for studying, research, and private browsing.
          </p>
        </div>

        {/* Client Interactive Tool */}
        <PrivateViewerClient />

        {/* Educational / Benefits Grid */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Why Use an Anonymous YouTube Viewer?
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Mainstream YouTube is designed to maximize watch time through aggressive behavioral tracking and algorithm rabbit holes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <Lock className="w-4 h-4 text-[#1E9E6B]" />
                <h3>Protect Your Algorithm</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Watching a one-off tutorial, controversial topic, or random clip will not ruin your YouTube homepage with days of unwanted recommendations.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <EyeOff className="w-4 h-4 text-[#2563EB]" />
                <h3>Zero Watch History Footprint</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Videos played through privacy-enhanced mode are completely isolated and never recorded into your personal Google activity log.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <Tv className="w-4 h-4 text-[#D6293C]" />
                <h3>Distraction-Free Focus</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Enjoy videos without autoplay traps, sensationalist comment sections, clickbait thumbnails, or endless notification pings.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="space-y-4 pt-4">
          <h2 className="text-[20px] md:text-[24px] font-semibold text-[#16181C]">
            Standard YouTube vs. Private Anonymous Viewer
          </h2>
          <div className="overflow-x-auto border border-[#E8E7E3] bg-white">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#F9F9F8] border-b border-[#E8E7E3] text-[#16181C] font-semibold">
                <tr>
                  <th className="p-3.5">Privacy &amp; Experience Metric</th>
                  <th className="p-3.5 text-[#D6293C]">Standard YouTube</th>
                  <th className="p-3.5 text-[#1E9E6B]">YT MONETIZE Private Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E7E3] text-[#5B6169]">
                <tr>
                  <td className="p-3.5 font-medium text-[#16181C]">Watch History Logging</td>
                  <td className="p-3.5 text-[#D6293C]">Logged to Google Profile</td>
                  <td className="p-3.5 text-[#1E9E6B] font-semibold">Blocked &amp; Isolated</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-[#16181C]">Tracking Cookies</td>
                  <td className="p-3.5 text-[#D6293C]">Active cross-site tracking</td>
                  <td className="p-3.5 text-[#1E9E6B] font-semibold">youtube-nocookie.com mode</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-[#16181C]">Algorithmic Recommendation Bias</td>
                  <td className="p-3.5 text-[#D6293C]">Rewrites homepage feed</td>
                  <td className="p-3.5 text-[#1E9E6B] font-semibold">Zero influence on feed</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-[#16181C]">Distraction Level</td>
                  <td className="p-3.5 text-[#D6293C]">High (Sidebar, Shorts, Comments)</td>
                  <td className="p-3.5 text-[#1E9E6B] font-semibold">Minimal (Focus &amp; Theater Mode)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-[#16181C]">Account Requirement</td>
                  <td className="p-3.5 text-[#5B6169]">Prompts sign-in constantly</td>
                  <td className="p-3.5 text-[#1E9E6B] font-semibold">100% Free &amp; No Login</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#5B6169]">
              Common questions about watching YouTube videos privately and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-5 bg-white border border-[#E8E7E3] space-y-2">
                <h3 className="text-[15px] font-semibold text-[#16181C] flex items-start gap-2">
                  <span className="text-[#1E9E6B] font-bold">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#5B6169] leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentToolId="private-viewer" />
      </div>
    </>
  );
}
