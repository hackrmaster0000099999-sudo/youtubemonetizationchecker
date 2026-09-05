import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedTools } from '@/components/common/RelatedTools';
import { EarningsCalculatorClient } from '@/components/tools/EarningsCalculatorClient';
import { constructMetadata, generateWebApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { HelpCircle, CheckCircle2, Info, Calculator } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'YouTube Earnings Calculator',
  description: 'Estimate YouTube ad revenue and creator earnings based on views, CPM/RPM, and niche. Transparent formulas with industry benchmark RPM rates.',
  path: '/earnings-calculator',
});

const faqs = [
  {
    q: 'How are YouTube earnings calculated?',
    a: 'YouTube ad earnings depend on the formula: Estimated Revenue = (Total Views × Monetized Playback Rate ÷ 1,000) × RPM. The RPM (Revenue Per Mille) represents the actual earnings a creator receives per 1,000 monetized views after YouTube standard 45% ad rev-share cut.',
  },
  {
    q: 'What is the difference between CPM and RPM?',
    a: 'CPM (Cost Per Mille) is what advertisers pay to YouTube for 1,000 ad impressions. RPM (Revenue Per Mille) is what the creator actually earns after YouTube takes its 45% revenue split and accounts for views where no ads were served.',
  },
  {
    q: 'Why do different niches have different RPM rates?',
    a: 'High-ticket topics like personal finance, B2B software, and investing have advertisers willing to bid $20–$50+ CPM because customer lifetime value is immense. Gaming or casual comedy typically has wider youth viewership with lower advertiser bids ($1–$4 RPM).',
  },
  {
    q: 'Does this calculator estimate YouTube Shorts revenue?',
    a: 'This calculator is modeled on long-form video ad inventory. YouTube Shorts revenue operates through the Shorts Creator Pool model, which typically yields $0.03 to $0.08 per 1,000 views.',
  },
];

export default function EarningsCalculatorPage() {
  const appSchema = generateWebApplicationSchema({
    name: 'YouTube Earnings Calculator',
    description: 'Estimate prospective YouTube ad earnings based on video views, RPM, and niche with YT MONETIZE.',
    path: '/earnings-calculator',
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3E2DE] text-[12px] font-bold text-[#5B6169] uppercase tracking-wider shadow-2xs">
            <Calculator className="w-3.5 h-3.5 text-[#D6293C]" />
            <span>Revenue Analytics</span>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-bold text-[#16181C] tracking-tight leading-[1.15]">
            YouTube Earnings Calculator &amp; Revenue Estimator
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Estimate prospective video or channel earnings by pasting any YouTube link, or calculate custom revenue based on views, CPM/RPM, and audience ad-rates.
          </p>
        </div>

        {/* Interactive Tool Widget */}
        <EarningsCalculatorClient />

        {/* How The Calculator Works */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <div className="space-y-2">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
              Understanding YouTube Revenue &amp; RPM
            </h2>
            <p className="text-[15px] text-[#5B6169] leading-relaxed">
              Actual creator income fluctuates based on key variables that influence ad inventory supply and advertiser demand:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>1. Audience Geography</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Viewers in Tier-1 countries (US, UK, Canada, Australia) command substantially higher CPMs compared to regions with lower digital ad spend.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>2. Video Length &amp; Mid-rolls</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Videos longer than 8 minutes are eligible for multiple mid-roll ad placements, which can double or triple effective RPM rates.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#16181C]">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6B]" />
                <h3>3. Content Seasonality</h3>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                Advertiser budgets peak during Q4 (holiday shopping in November and December) and typically contract in January (Q1 drop).
              </p>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-4 bg-[#FCFCFB] border border-[#E8E7E3] text-[14px] text-[#5B6169] space-y-2">
            <p>
              Want to see if a channel is already monetized? Check with our{' '}
              <Link href="/monetization-checker" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Monetization Checker
              </Link>{' '}
              or inspect video tags and metadata with the{' '}
              <Link href="/tag-extractor" className="text-[#D6293C] font-semibold hover:underline">
                YouTube Tag Extractor
              </Link>
              .
            </p>
          </div>

          {/* Transparent Notice */}
          <div className="p-5 border border-[#E8E7E3] bg-[#FCFCFB] flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#5B6169] shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#5B6169] leading-relaxed space-y-1">
              <div className="font-semibold text-[#16181C]">Disclaimer: Revenue Estimates</div>
              <p>
                This calculation provides an estimate based on mathematical RPM averages and publicly observable metrics. Actual creator payouts are governed directly by YouTube and Google AdSense according to specific contractual terms and viewer interaction.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-[#E8E7E3]">
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[#16181C]">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-[#E8E7E3] border border-[#E8E7E3] bg-white">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 space-y-2">
                <h3 className="text-[16px] font-semibold text-[#16181C] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#5B6169]" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-[14px] text-[#5B6169] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentToolId="earnings-calculator" />
      </div>
    </>
  );
}
