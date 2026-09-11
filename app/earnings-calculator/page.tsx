import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { PopularSearchQueries } from '@/components/common/PopularSearchQueries';
import { EarningsCalculatorClient } from '@/components/tools/EarningsCalculatorClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { TOOL_SEO_MAP } from '@/lib/constants/tool-seo';
import { CheckCircle2, Info, Calculator, DollarSign } from 'lucide-react';
import Link from 'next/link';

const seo = TOOL_SEO_MAP['earnings-calculator'];

export const metadata: Metadata = constructMetadata({
  title: seo.title,
  description: seo.metaDescription,
  path: '/earnings-calculator',
  keywords: seo.keywords,
});

const faqs = [
  {
    q: 'How much YouTube pays for 1 million views calculator?',
    a: 'On average, YouTube pays between $2,000 and $7,000 for 1 million views depending on creator niche, audience location (Tier 1 vs Tier 3 countries), video length, and RPM rate. High CPM niches like finance or tech can pay $10,000 to $25,000+ for 1M views.',
  },
  {
    q: 'How much money per 1000 views on YouTube?',
    a: 'For 1,000 monetized views, creators typically earn between $1.50 and $7.00 RPM. YouTube takes a 45% revenue cut, leaving 55% for the channel owner.',
  },
  {
    q: 'How to calculate YouTube earnings based on views and CPM?',
    a: 'Use the formula: Estimated Revenue = (Total Monetized Views ÷ 1,000) × RPM. The RPM (Revenue Per Mille) reflects actual creator take-home pay after ad blocker adjustments and platform rev-share.',
  },
  {
    q: 'Does this calculate YouTube Shorts monetization earnings?',
    a: 'Yes. YouTube Shorts monetization operates through the Creator Pool with average RPMs between $0.03 and $0.08 per 1,000 views ($30 to $80 per 1 million Shorts views).',
  },
  {
    q: 'How to estimate YouTube channel net worth and monthly revenue?',
    a: 'By combining average monthly views, 30-day upload cadence, niche CPM multipliers, and sponsorship revenue estimates (typically 1.5x-2x AdSense), you can estimate accurate monthly creator earnings.',
  },
];

export default function EarningsCalculatorPage() {
  const appSchema = generateWebApplicationSchema({
    name: seo.name,
    description: seo.metaDescription,
    path: '/earnings-calculator',
    keywords: seo.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'YouTube Earnings Calculator', url: '/earnings-calculator' },
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
        <Breadcrumbs items={[{ label: 'Earnings Calculator' }]} />

        {/* Header & Tool Intro */}
        <div className="space-y-3 max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EDE8F9] text-[12px] font-bold text-[#7C3AED] uppercase tracking-wider shadow-2xs backdrop-blur-md">
            <Calculator className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Revenue Estimator</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#181135] tracking-tight leading-[1.15]">
            YouTube Money &amp; Earnings Calculator
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Estimate potential AdSense revenue, RPM per 1,000 views, YouTube Shorts income, and monthly channel earnings based on realistic industry metrics.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <EarningsCalculatorClient />

        {/* Educational Content on YouTube Monetization Formula */}
        <section className="space-y-6 pt-6 border-t border-[#EDE8F9]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#181135]">
              How YouTube Money &amp; AdSense Revenue is Calculated
            </h2>
            <p className="text-[15px] text-[#635B80] leading-relaxed">
              Creator income is driven by four primary advertising factors:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 tool-card-3d space-y-2.5">
              <h3 className="font-bold text-[#181135] text-[16px]">
                1. CPM vs RPM Difference
              </h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                <strong>CPM (Cost Per Mille)</strong> is the price advertisers pay per 1,000 impressions. <strong>RPM (Revenue Per Mille)</strong> is what the creator actually receives per 1,000 total views after YouTube&apos;s 45% revenue cut.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <h3 className="font-bold text-[#181135] text-[16px]">
                2. Audience Geography (Tier 1 vs Tier 3)
              </h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Views from United States, UK, Canada, Australia, and Germany carry significantly higher advertiser bids ($8–$25+ CPM) compared to global emerging markets ($0.50–$2.50 CPM).
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <h3 className="font-bold text-[#181135] text-[16px]">
                3. Channel Topic &amp; Commercial Niche
              </h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Finance, crypto, software, e-commerce, and real estate yield the highest RPMs due to high advertiser ROI. Entertainment, gaming, and lifestyle have lower CPMs but higher viral volume.
              </p>
            </div>

            <div className="p-6 tool-card-3d space-y-2.5">
              <h3 className="font-bold text-[#181135] text-[16px]">
                4. Video Duration &amp; Mid-Roll Ads
              </h3>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                Videos longer than 8 minutes qualify for mid-roll ad placements, often doubling or tripling total ad impressions per single viewer session.
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

        {/* Popular SEO Search Queries */}
        <PopularSearchQueries
          mainKeyword={seo.mainKeyword}
          searchQueries={seo.searchQueries}
        />

        {/* Related Tools */}
        <RelatedTools currentToolId="earnings-calculator" />
      </div>
    </>
  );
}
