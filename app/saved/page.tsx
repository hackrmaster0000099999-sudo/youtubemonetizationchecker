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

      <div className="border-b border-[#E3E2DE] pb-5">
        <div className="flex items-center gap-2 text-[12px] font-bold text-[#D6293C] uppercase tracking-wider mb-1">
          <Bookmark className="w-4 h-4 fill-[#D6293C]" />
          <span>Offline Browser Storage</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#16181C]">
          Saved Creator Records
        </h1>
        <p className="text-[14px] text-[#5B6169] mt-1">
          Access your bookmarked channels, monetization checks, calculators, and media saved privately on your device.
        </p>
      </div>

      <SavedPageClient />
    </div>
  );
}
