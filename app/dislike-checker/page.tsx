import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { DislikeCheckerClient } from '@/components/tools/DislikeCheckerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { ThumbsDown, ShieldCheck, BarChart2, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Dislike Checker - View Dislikes & Like-to-Dislike Ratio',
  description:
    'Free YouTube Dislike Checker. See hidden YouTube dislikes, calculate like-to-dislike ratios, view approval ratings, and inspect community feedback metrics for any video.',
  path: '/dislike-checker',
});

const faqs = [
  {
    q: 'Can you still see dislikes on YouTube videos?',
    a: 'While YouTube officially removed the public dislike counter for regular viewers in December 2021, the Return YouTube Dislike (RYD) community API and creator data archives preserve statistical models and user votes to restore estimated dislike counts and ratings accurately.',
  },
  {
    q: 'Can anyone see which individual users or accounts disliked a video?',
    a: 'No. YouTube has never made individual voter identities public. Votes are completely anonymous to protect viewer privacy, and even creators in YouTube Studio can only see aggregate counts, never individual account names.',
  },
  {
    q: 'How is the YouTube like-to-dislike ratio calculated?',
    a: 'The like-to-dislike ratio compares total likes against total dislikes. The approval percentage is calculated as [Likes / (Likes + Dislikes)] × 100. For example, 9,500 likes and 500 dislikes equals a 95% approval rating.',
  },
  {
    q: 'What is considered a healthy like/dislike ratio on YouTube?',
    a: 'For most tutorials, vlogs, and entertainment content, an approval rating above 90% is considered healthy. Ratios above 95% indicate overwhelmingly positive audience feedback, while ratios below 75% often suggest controversy, misleading titles, or community pushback.',
  },
  {
    q: 'Is this tool free and does it require logging into YouTube?',
    a: 'Yes! The YT MONETIZE YouTube Dislike Checker is 100% free with no registration, Google login, or browser extensions required. Simply paste any video link to inspect its metrics instantly.',
  },
];

export default function DislikeCheckerPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Dislike & Sentiment Checker',
    description:
      'Check hidden YouTube dislikes, calculate like vs dislike percentages, and view community sentiment ratings.',
    path: '/dislike-checker',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Dislike Checker', url: '/dislike-checker' },
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
        <Breadcrumbs items={[{ label: 'YouTube Dislike Checker' }]} />

        {/* Header Intro */}
        <div className="space-y-3 max-w-[820px]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D6293C]/10 text-[#D6293C] text-[12px] font-bold tracking-wide rounded-full">
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Video Sentiment &amp; Ratio Inspector</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Dislike &amp; Sentiment Checker
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Uncover hidden YouTube dislike counts, visualize like-to-dislike ratios, and evaluate true audience approval ratings without installing third-party browser extensions.
          </p>
        </div>

        {/* Client Interactive Tool */}
        <DislikeCheckerClient />

        {/* Contextual & Educational Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Understanding YouTube Dislike Metrics
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Why dislike ratios matter for viewers, creators, and marketers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <ShieldCheck className="w-4 h-4 text-[#1E9E6B]" />
                <h3>Verify Tutorial Credibility</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Before spending time on a tutorial or repair guide, inspect the dislike ratio to avoid misleading or outdated advice.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <BarChart2 className="w-4 h-4 text-[#2563EB]" />
                <h3>Creator Retention Feedback</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Creators can assess whether a format change, sponsorship, or thumbnail style resonated positively with their community.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#D6293C]" />
                <h3>Brand Safety &amp; Sponsorships</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Brands and sponsors can verify that influencer videos maintain strong approval ratings before partnering on campaigns.
              </p>
            </div>
          </div>
        </section>

        {/* Benchmarks Section */}
        <section className="space-y-4 pt-4">
          <h2 className="text-[20px] md:text-[24px] font-semibold text-[#16181C]">
            YouTube Like vs. Dislike Ratio Benchmarks
          </h2>
          <div className="p-6 bg-white border border-[#E8E7E3] space-y-4 text-[15px] text-[#383B40] leading-relaxed">
            <p>
              Audience reception on YouTube typically follows clear statistical patterns across different niches:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#E8E7E3] bg-[#F9F9F8] text-[#16181C]">
                    <th className="py-2.5 px-3 font-bold">Approval %</th>
                    <th className="py-2.5 px-3 font-bold">Sentiment Grade</th>
                    <th className="py-2.5 px-3 font-bold">Audience Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E7E3] text-[#5B6169]">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#1E9E6B]">95% – 100%</td>
                    <td className="py-2.5 px-3 font-semibold text-[#16181C]">Overwhelmingly Positive</td>
                    <td className="py-2.5 px-3">Exceptional satisfaction, viral quality, strong viewer trust.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#2563EB]">85% – 94%</td>
                    <td className="py-2.5 px-3 font-semibold text-[#16181C]">Mostly Positive</td>
                    <td className="py-2.5 px-3">Normal healthy engagement for mainstream YouTube videos.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#B45309]">70% – 84%</td>
                    <td className="py-2.5 px-3 font-semibold text-[#16181C]">Mixed Sentiment</td>
                    <td className="py-2.5 px-3">Debatable topic, polarizing opinions, or minor pacing issues.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#D6293C]">&lt; 70%</td>
                    <td className="py-2.5 px-3 font-semibold text-[#16181C]">High Dislike Ratio</td>
                    <td className="py-2.5 px-3">Significant community disapproval, misleading content, or clickbait.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#5B6169]">
              Common questions about YouTube dislikes and community sentiment analysis.
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
        <RelatedTools currentToolId="dislike-checker" />
      </div>
    </>
  );
}
