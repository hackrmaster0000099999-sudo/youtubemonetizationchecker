import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FaqAccordionClient } from '@/components/tools/FaqAccordionClient';
import { constructMetadata, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Tools FAQ',
  description:
    'Find answers to common questions about YouTube monetization checks, earnings estimates, channel IDs, thumbnails, tags, data, and other YT MONETIZE tools.',
  path: '/faq',
});

const FAQS_DATA = [
  {
    category: 'Monetization & Partner Program',
    items: [
      {
        q: 'How does YT MONETIZE detect whether a YouTube channel is monetized?',
        a: 'Our algorithms inspect publicly accessible indicators exposed by YouTube video player instances and channel profiles. These include active channel memberships ("Join" buttons), official merchandising shelves, video ad placement cue configurations, family-friendly ad classifications, and subscriber milestones. When these indicators align, the channel is evaluated with high confidence.',
      },
      {
        q: 'Can a third-party service see private AdSense or YouTube Studio earnings?',
        a: 'No. YouTube never exposes private earnings, RPMs, or internal Partner Program contracts via public APIs. Any website claiming to show 100% exact private revenue is generating estimated figures. We prioritize transparency by clearly labeling all results as confidence-weighted estimates based on public signals.',
      },
      {
        q: 'What are the current requirements to qualify for YouTube monetization?',
        a: 'Under current YouTube Partner Program (YPP) requirements, standard ad revenue eligibility requires at least 1,000 subscribers AND either 4,000 valid public watch hours in the past 12 months OR 10 million valid public Shorts views within the past 90 days. YouTube also offers an earlier fan-funding tier (Memberships, Super Chats) at 500 subscribers and 3,000 watch hours.',
      },
      {
        q: 'Why does a channel show ads if it is not in the YouTube Partner Program?',
        a: 'In 2020, YouTube updated its Terms of Service with the "Right to Monetize". This policy allows YouTube to place ads on videos from channels not enrolled in YPP, without paying revenue to the creator. Therefore, the mere presence of an ad does not alone prove Partner Program membership, which is why our checker evaluates additional structural signals.',
      },
    ],
  },
  {
    category: 'Using Creator Tools',
    items: [
      {
        q: 'Do I need to sign up or log in to use any tools on YT MONETIZE?',
        a: 'No. YT MONETIZE is 100% free and requires zero login, account creation, or email collection. You can inspect any channel or video instantly.',
      },
      {
        q: 'What formats can I enter into the search boxes?',
        a: 'Our parser supports standard video URLs (youtube.com/watch?v=...), shortened URLs (youtu.be/...), channel @handles (youtube.com/@username), custom URLs (youtube.com/c/name), direct Channel IDs (UCxxxxxxxxxxxxxxxx), and raw video IDs.',
      },
      {
        q: 'How do I download full-resolution 1080p/HD YouTube thumbnails?',
        a: 'Use our Thumbnail Downloader tool, paste the video link, and click "Download" next to the Maximum Resolution (1280x720) card. If the creator uploaded an HD original, you receive the raw uncompressed graphic.',
      },
      {
        q: 'Are YouTube tags still important for channel SEO in 2026?',
        a: 'According to YouTube Creator Liaison, tags play a minimal role compared to title clarity, thumbnail click-through rate, and viewer retention. However, tags remain valuable for capturing common misspellings, technical acronyms, and secondary language translations.',
      },
    ],
  },
  {
    category: 'Privacy, Data, & Legality',
    items: [
      {
        q: 'Is YT MONETIZE affiliated with YouTube or Google LLC?',
        a: 'No. YT MONETIZE is an independent third-party creator utility and is not affiliated with, endorsed by, or sponsored by YouTube, LLC or Google LLC. YouTube and the YouTube logo are registered trademarks of Google LLC.',
      },
      {
        q: 'Do you store or track the channels that I look up?',
        a: 'No personal identification is tracked. Lookups pass through short-lived in-memory caches strictly to protect API quotas and maximize page delivery speed. We do not maintain user search profiles or sell creator research data.',
      },
    ],
  },
];

export default function FAQPage() {
  const allFaqs = FAQS_DATA.flatMap((cat) => cat.items);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Frequently Asked Questions', url: '/faq' },
  ]);
  const faqSchema = generateFAQSchema(allFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-12 py-4">
        <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

        <div className="space-y-3 max-w-[800px]">
          <h1 className="text-[28px] md:text-[38px] font-semibold text-[#16181C] tracking-tight leading-[1.15]">
            Frequently Asked Questions
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Detailed guidance on YouTube Partner Program thresholds, monetization evaluation methodology, creator tools, and platform policies.
          </p>
        </div>

        <FaqAccordionClient data={FAQS_DATA} />

        <div className="p-6 bg-[#FCFCFB] border border-[#E8E7E3] space-y-2">
          <h2 className="text-[18px] font-semibold text-[#16181C]">Have a question that is not covered here?</h2>
          <p className="text-[14px] text-[#5B6169]">
            Feel free to reach out to our team via our{' '}
            <Link href="/contact" className="text-[#D6293C] font-semibold hover:underline">
              Contact Page
            </Link>
            . We typically respond within 24–48 hours.
          </p>
        </div>
      </div>
    </>
  );
}
