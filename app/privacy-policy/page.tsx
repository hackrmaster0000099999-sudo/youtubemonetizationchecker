import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { constructMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'Privacy Policy',
  description:
    'Read the YT MONETIZE Privacy Policy to understand how website usage, tool requests, cookies, and other information are handled.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-8 py-4 max-w-[840px]">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="space-y-3">
          <h1 className="text-[28px] md:text-[36px] font-semibold text-[#16181C] tracking-tight">
            Privacy Policy
          </h1>
          <div className="text-[14px] text-[#5B6169]">Last Updated: January 2026</div>
        </div>

        <div className="p-8 bg-white border border-[#E8E7E3] space-y-6 text-[15px] text-[#5B6169] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">1. Overview &amp; Commitment</h2>
            <p>
              YT MONETIZE (&quot;we,&quot; &quot;our,&quot; or &quot;the Service&quot;) operates as a free, no-login utility suite for creators, marketers, and researchers. We respect your privacy and believe in total data transparency. We do not require registration, do not collect personal profiles, and do not track individual users across the web.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">2. Information We Do Not Collect</h2>
            <p>Because YT MONETIZE does not feature a user login or account system:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We do NOT collect your name, email address, password, or physical address.</li>
              <li>We do NOT request OAuth access or write permissions to your private YouTube or Google Studio accounts.</li>
              <li>We do NOT collect payment card numbers, billing information, or financial details.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">3. Information We Process Automatically</h2>
            <p>
              When you use our search or analysis tools, our servers receive the YouTube URL, handle, or ID you enter. This input is processed solely to query publicly available YouTube metadata and return the requested indicators. Lookups are temporarily cached in server memory to minimize redundant external requests and protect API rate limits. Cache entries expire automatically and are not linked to identifiable individuals.
            </p>
            <p>
              Standard web server logs (such as IP addresses, browser user-agent strings, and request timestamps) are processed transiently for security purposes, anti-abuse DDoS mitigation, and rate limiting enforcement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">4. YouTube API Services &amp; Google Policies</h2>
            <p>
              YT MONETIZE uses YouTube API Services to retrieve public channel and video information. By using our website, you agree to be bound by the{' '}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D6293C] underline hover:no-underline font-medium"
              >
                YouTube Terms of Service
              </a>
              .
            </p>
            <p>
              Please refer to the{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D6293C] underline hover:no-underline font-medium"
              >
                Google Privacy Policy
              </a>{' '}
              for detailed information regarding Google&apos;s data collection and processing standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">5. Cookies &amp; Tracking Technologies</h2>
            <p>
              YT MONETIZE does not utilize tracking cookies, third-party analytics pixels, or cross-site tracking scripts. Any browser local storage used is strictly functional (such as remembering your active UI preferences or recent tool calculations during your visit).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">6. Updates to This Policy</h2>
            <p>
              We may occasionally update this Privacy Policy to reflect modifications in our tooling or legal requirements. Updates will be posted on this page with a revised &quot;Last Updated&quot; date.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">7. Contacting Us</h2>
            <p>
              If you have questions regarding this Privacy Policy or our data handling practices, please submit an inquiry via our{' '}
              <Link href="/contact" className="text-[#D6293C] underline hover:no-underline font-medium">
                Contact Page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
