import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { RandomCommentPickerClient } from '@/components/tools/RandomCommentPickerClient';
import {
  constructMetadata,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { Trophy, ShieldCheck, Filter, Users } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Random Comment Picker - Free Giveaway Winner Generator',
  description:
    'Free and unbiased YouTube Random Comment Picker. Filter duplicate users, search giveaway hashtags/keywords, set minimum likes, and pick contest winners instantly.',
  path: '/random-comment-picker',
});

const faqs = [
  {
    q: 'What is a YouTube Random Comment Picker?',
    a: 'A YouTube Random Comment Picker is a free creator tool that connects to a YouTube video, collects all eligible public comments, and fairly selects random winners for giveaways, raffles, and contests without any human bias.',
  },
  {
    q: 'Does it filter out duplicate comments from the same user?',
    a: 'Yes! By default, the "Filter Duplicate Users" option is enabled. Even if a participant posts dozens of comments on your video, their channel is counted only once in the giveaway pool to guarantee fairness.',
  },
  {
    q: 'Can I pick multiple winners at once?',
    a: 'Yes. You can select between 1 and 10 winners simultaneously. Each chosen winner is uniquely selected from the pool without repeats.',
  },
  {
    q: 'Can I require a specific keyword or hashtag (e.g. #giveaway)?',
    a: 'Yes. Use the keyword filter input to ensure only comments containing your designated contest keyword, question answer, or raffle hashtag are eligible for the drawing.',
  },
  {
    q: 'Is it completely free and requires no YouTube login?',
    a: 'Yes. YT MONETIZE Random Comment Picker is 100% free with no account creation, sign-in, or channel permissions required. Simply paste your video link and pick your winners.',
  },
];

export default function RandomCommentPickerPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Random Comment Picker',
    description:
      'Select fair, transparent, and randomized giveaway winners from any YouTube video comment section.',
    path: '/random-comment-picker',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Random Comment Picker', url: '/random-comment-picker' },
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
        <Breadcrumbs items={[{ label: 'Random Comment Picker' }]} />

        {/* Header Intro */}
        <div className="space-y-3 max-w-[820px]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-[#DDD0FA] text-[#7C3AED] text-[12px] font-bold tracking-wide rounded-full shadow-2xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>Fair Giveaway Generator</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Random Comment Picker
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Pick fair, transparent, and unbiased winners for your YouTube giveaways, raffles, and community contests.
            Filter duplicate entries, match specific keywords, and announce winners with confidence.
          </p>
        </div>

        {/* Client Interactive Applet */}
        <RandomCommentPickerClient />

        {/* Key Features Overview */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              Why Use Our YouTube Giveaway Winner Picker?
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Designed specifically for YouTubers and community managers to ensure 100% fair and transparent drawings:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3>Duplicate User Filtering</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Prevents spamming by granting every unique commenter exactly one entry ticket, regardless of how many times they commented.
              </p>
            </div>

            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Filter className="w-4 h-4 text-[#7C3AED]" />
                <h3>Keyword &amp; Hashtag Rules</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Require participants to answer a specific question, include a secret code, or tag with a custom giveaway hashtag.
              </p>
            </div>

            <div className="tool-card-3d p-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#181135]">
                <Users className="w-4 h-4 text-blue-600" />
                <h3>Multi-Winner Support</h3>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Draw 1, 2, 3, 5, or up to 10 winners simultaneously without duplicate selections in a single clean drawing.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="space-y-4 pt-4">
          <h2 className="text-[20px] md:text-[24px] font-bold text-[#181135]">
            How to Host a Successful YouTube Giveaway
          </h2>
          <div className="p-6 tool-card-3d space-y-4 text-[15px] text-[#181135] leading-relaxed">
            <p className="text-[#635B80]">
              Hosting transparent contests builds massive subscriber loyalty. Follow these standard guidelines when picking winners:
            </p>
            <ul className="space-y-2.5 list-disc list-inside text-[#635B80]">
              <li>
                <strong className="text-[#181135]">Screen Record the Draw:</strong> Record your screen while clicking the &ldquo;Pick Random Winner Now&rdquo; button to share proof in your Community tab or next video.
              </li>
              <li>
                <strong className="text-[#181135]">Set Clear Entry Criteria:</strong> Announce entry deadlines and any mandatory keywords clearly in your video description.
              </li>
              <li>
                <strong className="text-[#181135]">Verify Winner Ownership:</strong> Check the winner&apos;s channel link and pin a verification comment under their winning post.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#635B80]">
              Everything you need to know about conducting fair YouTube comment drawings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="tool-card-3d p-5 space-y-2">
                <h3 className="text-[15px] font-bold text-[#181135] flex items-start gap-2">
                  <span className="text-[#7C3AED] font-bold">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#635B80] leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentToolId="random-comment-picker" />
      </div>
    </>
  );
}
