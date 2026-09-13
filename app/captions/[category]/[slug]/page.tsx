import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { CAPTION_CATEGORIES } from '@/lib/constants/captions';
import { getCaptionBySlug, getCaptions } from '@/lib/firebase';
import { SingleCaptionView } from '@/components/captions/SingleCaptionView';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId, slug } = await params;
  const category = CAPTION_CATEGORIES.find((c) => c.id === categoryId);
  const caption = await getCaptionBySlug(categoryId, slug);

  if (!caption || !category) {
    return {
      title: 'ক্যাপশন পাওয়া যায়নি | YT MONETIZE',
      description: 'অনুরোধকৃত ক্যাপশনটি পাওয়া যায়নি।',
    };
  }

  const title =
    caption.metaTitle ||
    caption.title ||
    `${caption.text.slice(0, 55)}... - ${category.banglaName} ক্যাপশন ও ফটো স্ট্যাটাস`;

  const description =
    caption.metaDescription ||
    `${caption.text.slice(0, 150)} - ${category.banglaName} ক্যাটাগরির সেরা উক্তি ও সোশ্যাল মিডিয়া স্ট্যাটাস।`;

  const canonicalUrl = `https://youtubemonetizationchecker.online/captions/${categoryId}/${slug}`;

  return {
    title: `${title} | YT MONETIZE`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: caption.metaKeywords
      ? caption.metaKeywords.split(',').map((k) => k.trim())
      : [...category.seoKeywords, slug, 'photo status', 'facebook caption'],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'YT MONETIZE',
      type: 'article',
      images: caption.imageUrl
        ? [
            {
              url: caption.imageUrl,
              width: 1200,
              height: 630,
              alt: caption.title || caption.text.slice(0, 40),
            },
          ]
        : [],
    },
    twitter: {
      card: caption.imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: caption.imageUrl ? [caption.imageUrl] : [],
    },
  };
}

export default async function SingleCaptionPage({ params }: PageProps) {
  const { category: categoryId, slug } = await params;
  const category = CAPTION_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  const caption = await getCaptionBySlug(categoryId, slug);
  if (!caption) {
    notFound();
  }

  // Fetch related captions from the same category
  const allCategoryCaptions = await getCaptions({ category: categoryId });
  const relatedCaptions = allCategoryCaptions.filter(
    (c) => c.id !== caption.id && c.slug !== caption.slug
  );

  const postUrl = `https://youtubemonetizationchecker.online/captions/${category.id}/${caption.slug || slug}`;

  // Structured Data (JSON-LD)
  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://youtubemonetizationchecker.online',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Captions',
        item: 'https://youtubemonetizationchecker.online/captions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://youtubemonetizationchecker.online/captions/${category.id}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: caption.title || caption.slug || 'Post',
        item: postUrl,
      },
    ],
  };

  const jsonLdCreativeWork = {
    '@context': 'https://schema.org',
    '@type': 'SocialMediaPosting',
    headline: caption.title || caption.text.slice(0, 60),
    articleBody: caption.text,
    url: postUrl,
    inLanguage: caption.language === 'bangla' ? 'bn' : 'en',
    keywords: caption.tags?.join(', ') || category.name,
    image: caption.imageUrl || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'YT MONETIZE',
      url: 'https://youtubemonetizationchecker.online',
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCreativeWork) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm text-[#827A9E] overflow-x-auto whitespace-nowrap pb-1">
        <ol className="flex items-center gap-1.5 sm:gap-2">
          <li>
            <Link href="/" className="hover:text-[#7C3AED] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-[#DDD0FA]" />
          </li>
          <li>
            <Link href="/captions" className="hover:text-[#7C3AED] transition-colors">
              ক্যাপশন
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-[#DDD0FA]" />
          </li>
          <li>
            <Link href={`/captions/${category.id}`} className="hover:text-[#7C3AED] transition-colors font-medium">
              {category.banglaName}
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-[#DDD0FA]" />
          </li>
          <li className="text-[#181135] font-semibold max-w-[200px] truncate" aria-current="page">
            {caption.title || caption.slug || 'পোস্ট'}
          </li>
        </ol>
      </nav>

      {/* Main Single Caption Card View */}
      <SingleCaptionView
        caption={caption}
        category={category}
        relatedCaptions={relatedCaptions}
      />
    </div>
  );
}
