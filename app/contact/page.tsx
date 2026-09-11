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

      <div className="space-y-8 py-4 max-w-[900px] mx-auto">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="space-y-3">
          <h1 className="text-[28px] md:text-[36px] font-bold text-[#181135] tracking-tight">
            Contact Us &amp; Creator Support
          </h1>
          <p className="text-[16px] text-[#635B80] leading-relaxed">
            Have questions about our monetization analysis, suggestions for new creator tools, or bug reports? We welcome your feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-8 p-6 md:p-8 tool-card-3d space-y-6">
            <ContactFormClient />
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-6 tool-card-3d space-y-3">
              <div className="flex items-center gap-2 text-[15px] font-bold text-[#181135]">
                <Mail className="w-4 h-4 text-[#7C3AED]" />
                <span>Direct Inquiries</span>
              </div>
              <p className="text-[14px] text-[#635B80] leading-relaxed">
                For direct business or technical correspondence:
              </p>
              <div className="text-[13px] font-mono-data text-[#7C3AED] font-bold pt-1 select-all break-all">
                support@youtubemonetizationchecker.online
              </div>
            </div>

            <div className="p-6 tool-card-3d space-y-2">
              <div className="flex items-center gap-2 text-[14px] font-bold text-[#181135]">
                <HelpCircle className="w-4 h-4 text-[#7C3AED]" />
                <span>Frequently Asked Questions</span>
              </div>
              <p className="text-[13px] text-[#635B80] leading-relaxed">
                Check our FAQ page for fast answers regarding YouTube Partner Program policies and monetization metrics.
              </p>
              <div className="pt-2">
                <Link
                  href="/faq"
                  className="text-[13px] font-bold text-[#7C3AED] hover:underline"
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
