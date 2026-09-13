'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Search,
  FolderSearch,
  Download,
  ShieldAlert,
  Calculator,
  ImageIcon,
  Tag,
  BarChart2,
  MessageSquare,
  Trophy,
  ThumbsDown,
  FileText,
  EyeOff,
  ShieldCheck,
  HelpCircle,
  Mail,
  AlertCircle,
  Sparkles,
  MessageSquareQuote,
  Heart,
  Flame,
  CloudRain,
  Zap,
  Compass,
  Users,
  Moon,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { CategoryIcon } from '@/components/common/ToolIcon';

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#FCFCFB] border-t border-[#EDE8F9] pt-16 pb-12 text-[#181135]"
    >
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-12 border-b border-[#EDE8F9]">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block tap-press">
              <Logo size={32} showText={true} />
            </Link>
            <p className="text-[13px] text-[#635B80] leading-relaxed max-w-sm">
              Fast, accurate, free YouTube creator utility &amp; content platform. Research channel monetization, estimate revenue, inspect video metadata, and grab viral Bangla &amp; English captions without login.
            </p>
          </div>

          {/* Channel Tools */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#181135]">
              <CategoryIcon category="Channel" className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Channel Tools</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#635B80]">
              <li>
                <Link href="/monetization-checker" id="footer-link-monetization" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <DollarSign className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Monetization Checker</span>
                </Link>
              </li>
              <li>
                <Link href="/channel-id-finder" id="footer-link-channel-id" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Search className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Channel ID Finder</span>
                </Link>
              </li>
              <li>
                <Link href="/hidden-video-finder" id="footer-link-hidden-videos" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <FolderSearch className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Unlisted Video Finder</span>
                </Link>
              </li>
              <li>
                <Link href="/image-downloader" id="footer-link-image-downloader" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Download className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Image Downloader</span>
                </Link>
              </li>
              <li>
                <Link href="/shadowban-detector" id="footer-link-shadowban" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Shadowban Detector</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Video & Analytics Tools */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#181135]">
              <CategoryIcon category="Analytics" className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Video &amp; Analytics</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#635B80]">
              <li>
                <Link href="/earnings-calculator" id="footer-link-earnings" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Calculator className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Earnings Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/thumbnail-downloader" id="footer-link-thumbnail" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Thumbnail Downloader</span>
                </Link>
              </li>
              <li>
                <Link href="/tag-extractor" id="footer-link-tags" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Tag className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Tag Extractor</span>
                </Link>
              </li>
              <li>
                <Link href="/data-viewer" id="footer-link-data" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <BarChart2 className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Metadata Viewer</span>
                </Link>
              </li>
              <li>
                <Link href="/dislike-checker" id="footer-link-dislikes" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <ThumbsDown className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Dislike Checker</span>
                </Link>
              </li>
              <li>
                <Link href="/random-comment-picker" id="footer-link-picker" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Trophy className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Random Comment Picker</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Captions Hub (NEW) */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#7C3AED]">
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Captions Hub</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#635B80]">
              <li>
                <Link href="/captions" id="footer-link-all-captions" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                  <span>All Bangla &amp; English Captions</span>
                </Link>
              </li>
              <li>
                <Link href="/captions?category=motivational" id="footer-link-captions-motivational" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Flame className="w-3.5 h-3.5 text-[#635B80] group-hover:text-amber-500 shrink-0 transition-colors" />
                  <span>Motivational (মোটিভেশনাল)</span>
                </Link>
              </li>
              <li>
                <Link href="/captions?category=attitude" id="footer-link-captions-attitude" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Zap className="w-3.5 h-3.5 text-[#635B80] group-hover:text-pink-500 shrink-0 transition-colors" />
                  <span>Attitude &amp; Swag (অ্যাটিটিউড)</span>
                </Link>
              </li>
              <li>
                <Link href="/captions?category=romantic" id="footer-link-captions-romantic" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Heart className="w-3.5 h-3.5 text-[#635B80] group-hover:text-rose-500 shrink-0 transition-colors" />
                  <span>Romantic &amp; Love (ভালোবাসা)</span>
                </Link>
              </li>
              <li>
                <Link href="/captions?category=sad" id="footer-link-captions-sad" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <CloudRain className="w-3.5 h-3.5 text-[#635B80] group-hover:text-indigo-500 shrink-0 transition-colors" />
                  <span>Sad &amp; Pain (কষ্টের স্ট্যাটাস)</span>
                </Link>
              </li>
              <li>
                <Link href="/captions?category=life" id="footer-link-captions-life" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Compass className="w-3.5 h-3.5 text-[#635B80] group-hover:text-emerald-500 shrink-0 transition-colors" />
                  <span>Life &amp; Reality (বাস্তবতা)</span>
                </Link>
              </li>
              <li>
                <Link href="/captions?category=friendship" id="footer-link-captions-friendship" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Users className="w-3.5 h-3.5 text-[#635B80] group-hover:text-cyan-500 shrink-0 transition-colors" />
                  <span>Friendship (বন্ধুত্ব ও আড্ডা)</span>
                </Link>
              </li>
              <li>
                <Link href="/captions?category=islamic" id="footer-link-captions-islamic" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Moon className="w-3.5 h-3.5 text-[#635B80] group-hover:text-teal-600 shrink-0 transition-colors" />
                  <span>Islamic &amp; Moral (ইসলামিক)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#181135]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Trust &amp; Legal</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#635B80]">
              <li>
                <Link href="/privacy-policy" id="footer-link-privacy" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" id="footer-link-terms" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <FileText className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" id="footer-link-faq" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Platform FAQs</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" id="footer-link-contact" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Contact &amp; Inquiries</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Site-Wide SEO Crawl & Linking Hub */}
        <div className="py-8 border-b border-[#EDE8F9] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#181135]">
              Quick Creator Utilities &amp; Index
            </span>
            <span className="text-[11px] text-[#8E87A8]">
              No Login Required • 100% Free
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2.5 text-[12px] text-[#635B80]">
            <Link href="/captions" className="text-[#7C3AED] font-semibold hover:underline transition-colors whitespace-nowrap">
              Bangla &amp; English Captions (New)
            </Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/monetization-checker" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">YouTube Monetization Checker</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/channel-id-finder" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Channel ID Finder</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/earnings-calculator" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">YouTube Earnings Calculator</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/thumbnail-downloader" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Thumbnail Downloader HD</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/tag-extractor" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">YouTube Tag Extractor</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/dislike-checker" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">YouTube Dislike Checker</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/random-comment-picker" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Random Comment Giveaway Picker</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/description-viewer" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Description Grabber</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/comment-viewer" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Comment Search &amp; Viewer</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/data-viewer" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Metadata &amp; Upload Time Viewer</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/private-viewer" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Private Incognito Viewer</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/shadowban-detector" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Shadowban Diagnostic</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/hidden-video-finder" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Unlisted Video Search</Link>
            <span className="text-[#DDD0FA] hidden sm:inline">•</span>
            <Link href="/image-downloader" className="hover:text-[#7C3AED] transition-colors whitespace-nowrap">Banner &amp; Avatar Downloader</Link>
          </div>
        </div>

        {/* Bottom Bar / Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#635B80]">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || 'YT MONETIZE'}. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-center md:text-right">
            <AlertCircle className="w-3.5 h-3.5 text-[#8E87A8] shrink-0" />
            <span>Independent third-party tool. Not affiliated with, endorsed by, or sponsored by YouTube, LLC or Google LLC.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
