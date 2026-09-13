import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CaptionsClient } from '@/components/captions/CaptionsClient';
import {
  CAPTION_CATEGORIES,
  CaptionCategory,
} from '@/lib/constants/captions';
import { SITE_NAME, SITE_URL } from '@/lib/constants/site';
import {
  Sparkles,
  Flame,
  Zap,
  Heart,
  CloudRain,
  Compass,
  Users,
  Moon,
  CheckCircle2,
  HelpCircle,
  Share2,
  Bookmark,
  ArrowRight,
} from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return CAPTION_CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = CAPTION_CATEGORIES.find((c) => c.id === categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found | YT MONETIZE',
      description: 'The requested caption category could not be found.',
    };
  }

  const title = `${category.seoTitle} | YT MONETIZE`;
  const description = category.seoDescription;
  const canonicalUrl = `${SITE_URL}/captions/${category.id}`;

  return {
    title,
    description,
    keywords: category.seoKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'article',
      locale: 'bn_BD',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryCaptionPage({
  params,
}: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = CAPTION_CATEGORIES.find((c) => c.id === categorySlug);

  if (!category) {
    notFound();
  }

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      case 'CloudRain':
        return <CloudRain className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'Moon':
        return <Moon className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  // Structured Data: BreadcrumbList + CollectionPage + FAQPage
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Captions',
        item: `${SITE_URL}/captions`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${category.name} (${category.banglaName})`,
        item: `${SITE_URL}/captions/${category.id}`,
      },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Captions Bangla & English`,
    headline: category.seoTitle,
    description: category.seoDescription,
    url: `${SITE_URL}/captions/${category.id}`,
    inLanguage: ['bn', 'en'],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: category.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const otherCategories = CAPTION_CATEGORIES.filter((c) => c.id !== category.id);

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Structured Data Scripts for Programmatic SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Captions', href: '/captions' },
          { label: category.name, href: `/captions/${category.id}` },
        ]}
      />

      {/* Main Interactive Captions Client */}
      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center bg-white border border-[#EDE8F9] rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]" />
          </div>
        }
      >
        <CaptionsClient initialCategoryId={category.id} />
      </Suspense>

      {/* Programmatic SEO FAQ Section - Clean typography without nested boxes */}
      {category.faqs && category.faqs.length > 0 && (
        <section
          id="faq-section"
          aria-label="Frequently Asked Questions"
          className="bg-white border border-[#EDE8F9] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xs"
        >
          <div className="flex items-center gap-2 text-[#7C3AED]">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#181135]">
              সাধারণ জিজ্ঞাসা ও প্রশ্নোত্তর (FAQ)
            </h2>
          </div>
          <div className="divide-y divide-[#F0ECFA]">
            {category.faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`space-y-2 ${idx === 0 ? 'pb-5' : 'py-5'}`}
              >
                <h3 className="font-bold text-[16px] text-[#181135] leading-snug flex items-start gap-2.5">
                  <span className="text-[#7C3AED] font-extrabold text-[15px]">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-[14px] text-[#554C75] leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internal Linking Network: Other Caption Categories */}
      <div className="bg-[#FAF8FE] border border-[#DDD0FA] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#181135]">
              অন্যান্য জনপ্রিয় ক্যাপশন ক্যাটাগরি এক্সপ্লোর করুন
            </h2>
            <p className="text-[13px] text-[#635B80] mt-0.5">
              সোশ্যাল মিডিয়া প্রোফাইলের প্রতিটি মোমেন্টের জন্য সঠিক ক্যাপশন খুঁজে নিন
            </p>
          </div>
          <Link
            href="/captions"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-bold text-[#7C3AED] hover:underline"
          >
            <span>সব ক্যাটাগরি দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {otherCategories.map((other) => (
            <Link
              key={other.id}
              href={`/captions/${other.id}`}
              className="bg-white border border-[#EDE8F9] hover:border-[#7C3AED] rounded-2xl p-3.5 flex flex-col items-center text-center space-y-2 transition-all group shadow-2xs hover:shadow-xs"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105"
                style={{ backgroundColor: other.color }}
              >
                {getCategoryIcon(other.icon)}
              </div>
              <div className="w-full">
                <span className="block text-[13px] font-bold text-[#181135] group-hover:text-[#7C3AED] transition-colors truncate">
                  {other.name}
                </span>
                <span className="block text-[11px] text-[#635B80] truncate">
                  {other.banglaName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
