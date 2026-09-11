import React from 'react';
import { Metadata } from 'next';
import { SavedPageClient } from '@/components/tools/SavedPageClient';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Bookmark, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Saved Items (Browser Cache) | YT MONETIZE',
  description:
    'View and manage your saved YouTube channels, videos, thumbnails, and monetization records saved locally in your browser.',
};

export default function SavedPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Saved in Browser', href: '/saved' },
        ]}
      />

      <div className="border-b border-[#EDE8F9] pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-[#DDD0FA] text-[#7C3AED] text-[12px] font-bold tracking-wide rounded-full shadow-2xs mb-3">
          <Bookmark className="w-3.5 h-3.5 fill-[#7C3AED]" />
          <span>Offline Browser Storage</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#181135]">
          Saved Creator Records
        </h1>
        <p className="text-[15px] text-[#635B80] mt-1">
          Access your bookmarked channels, monetization checks, calculators, and media saved privately on your device.
        </p>
      </div>

      <SavedPageClient />
    </div>
  );
}
