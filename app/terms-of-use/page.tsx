import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { constructMetadata, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Terms of Use',
  description: 'Terms of Use and service conditions for YT MONETIZE. Independent service disclaimers and guidelines for using our free YouTube creator utilities.',
  path: '/terms-of-use',
});

export default function TermsOfUsePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms of Use', url: '/terms-of-use' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-8 py-4 max-w-[840px]">
        <Breadcrumbs items={[{ label: 'Terms of Use' }]} />

        <div className="space-y-3">
          <h1 className="text-[28px] md:text-[36px] font-semibold text-[#16181C] tracking-tight">
            Terms of Use
          </h1>
          <div className="text-[14px] text-[#5B6169]">Last Updated: January 2026</div>
        </div>

        <div className="p-8 bg-white border border-[#E8E7E3] space-y-6 text-[15px] text-[#5B6169] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the YT MONETIZE website (the &quot;Site&quot; or &quot;Service&quot;), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">2. Independent Service Disclaimer</h2>
            <p>
              YT MONETIZE is an independent third-party creator utility and is <strong>not affiliated with, endorsed by, sponsored by, or associated with YouTube, LLC or Google LLC</strong>. YouTube, YouTube Studio, and the YouTube logo are registered trademarks of Google LLC.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">3. Nature of Estimates and Inferences</h2>
            <p>
              All evaluations regarding YouTube monetization, YouTube Partner Program (YPP) status, projected earnings, RPMs, and shadowban indicators are <strong>estimates based strictly on publicly observable information and heuristic models</strong>.
            </p>
            <p>
              Public data cannot confirm a creator&apos;s private internal contractual status with YouTube. YT MONETIZE makes no warranties or representations regarding the complete accuracy or commercial fitness of these estimates. Creators, agencies, and businesses should never use our estimates as sole financial proof for investments or acquisitions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">4. Permitted &amp; Prohibited Use</h2>
            <p>
              You agree to use the Service only for legitimate channel research, media asset acquisition, and content optimization. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Attempt to bypass rate limits or access internal APIs through unauthorized automation.</li>
              <li>Launch denial-of-service (DDoS) attacks or deliberately overload server infrastructure.</li>
              <li>Use the Service in violation of YouTube Terms of Service or applicable local laws.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">5. Intellectual Property</h2>
            <p>
              The software, branding, layout design, and algorithms of YT MONETIZE are the intellectual property of YT MONETIZE. All YouTube video thumbnails, channel avatars, and channel banners remain the exclusive copyright and property of their respective creators and YouTube.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[#16181C]">6. Limitation of Liability</h2>
            <p>
              In no event shall YT MONETIZE or its operators be liable for any damages (including, without limitation, damages for loss of data, profit, or business interruption) arising out of the use or inability to use the tools or materials on YT MONETIZE.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
