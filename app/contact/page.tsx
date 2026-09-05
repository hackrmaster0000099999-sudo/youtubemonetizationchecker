import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ContactFormClient } from '@/components/forms/ContactFormClient';
import { constructMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { Mail, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = constructMetadata({
  title: 'Contact YT MONETIZE',
  description:
    'Contact YT MONETIZE with questions, feedback, technical issues, suggestions, or other inquiries about our free YouTube tools.',
  path: '/contact',
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-8 py-4 max-w-[840px]">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="space-y-3">
          <h1 className="text-[28px] md:text-[36px] font-semibold text-[#16181C] tracking-tight">
            Contact Us &amp; Creator Support
          </h1>
          <p className="text-[16px] text-[#5B6169] leading-relaxed">
            Have questions about our monetization analysis, suggestions for new creator tools, or bug reports? We welcome your feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-8 p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-6 shadow-xs">
            <ContactFormClient />
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-6 bg-white border border-[#E8E7E3] space-y-3">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-[#16181C]">
                <Mail className="w-4 h-4 text-[#D6293C]" />
                <span>Direct Inquiries</span>
              </div>
              <p className="text-[14px] text-[#5B6169] leading-relaxed">
                For direct business or technical correspondence:
              </p>
              <div className="text-[13px] font-mono-data text-[#16181C] pt-1 select-all">
                support@youtubemonetizationchecker.online
              </div>
            </div>

            <div className="p-6 bg-[#FCFCFB] border border-[#E8E7E3] space-y-2">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#16181C]">
                <HelpCircle className="w-4 h-4 text-[#5B6169]" />
                <span>Frequently Asked Questions</span>
              </div>
              <p className="text-[13px] text-[#5B6169] leading-relaxed">
                Check our FAQ page for fast answers regarding YouTube Partner Program policies and monetization metrics.
              </p>
              <div className="pt-2">
                <Link
                  href="/faq"
                  className="text-[13px] font-semibold text-[#D6293C] hover:underline"
                >
                  Visit FAQ Guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
