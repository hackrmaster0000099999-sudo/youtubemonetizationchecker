import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Bangla & English Captions (বাংলা ও ইংরেজি ক্যাপশন) - Quotes, Status & Viral Bio | YT MONETIZE',
  description:
    'Best collection of Bangla & English captions for Facebook, Instagram, TikTok, and YouTube Shorts. Find motivational, sad, romantic, attitude, and life quotes with trending hashtags. Free 1-click copy.',
  alternates: {
    canonical: `${SITE_URL}/captions/islamic`,
  },
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function CaptionsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const targetCategory = category || 'islamic';
  redirect(`/captions/${targetCategory}`);
}

