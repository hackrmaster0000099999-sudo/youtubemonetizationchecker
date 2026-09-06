import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Search,
  Download,
  ShieldAlert,
  Calculator,
  Image as ImageIcon,
  Tag,
  BarChart2,
  HelpCircle,
  ShieldCheck,
  FileText,
  Mail,
  AlertCircle,
  Layers,
  Tv,
  MessageSquare,
  Trophy,
  ThumbsDown,
  EyeOff,
  FolderSearch,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { CategoryIcon } from '@/components/common/ToolIcon';

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#FCFCFB] border-t border-[#E3E2DE] pt-16 pb-12 text-[#16181C]"
    >
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E3E2DE]">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-block tap-press">
              <Logo size={32} showText={true} />
            </Link>
            <p className="text-[13px] text-[#5B6169] leading-relaxed">
              Fast, accurate, free YouTube creator utility platform. Research channel monetization, copy channel IDs, estimate revenue, and inspect public video metadata without login or software installs.
            </p>
          </div>

          {/* Channel Tools */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#16181C]">
              <CategoryIcon category="Channel" className="w-3.5 h-3.5 text-[#D6293C]" />
              <span>Channel Tools</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#5B6169]">
              <li>
                <Link href="/monetization-checker" id="footer-link-monetization" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <DollarSign className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Monetization Checker</span>
                </Link>
              </li>
              <li>
                <Link href="/channel-id-finder" id="footer-link-channel-id" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <Search className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Channel ID Finder</span>
                </Link>
              </li>
              <li>
                <Link href="/hidden-video-finder" id="footer-link-hidden-videos" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <FolderSearch className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>Unlisted Video Finder</span>
                </Link>
              </li>
              <li>
                <Link href="/image-downloader" id="footer-link-image-downloader" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <Download className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Image Downloader</span>
                </Link>
              </li>
              <li>
                <Link href="/shadowban-detector" id="footer-link-shadowban" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Shadowban Detector</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Video & Analytics Tools */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#16181C]">
              <CategoryIcon category="Analytics" className="w-3.5 h-3.5 text-[#D6293C]" />
              <span>Video &amp; Analytics</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#5B6169]">
              <li>
                <Link href="/earnings-calculator" id="footer-link-earnings" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <Calculator className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Earnings Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/thumbnail-downloader" id="footer-link-thumbnail" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Thumbnail Downloader</span>
                </Link>
              </li>
              <li>
                <Link href="/tag-extractor" id="footer-link-tags" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <Tag className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Tag Extractor</span>
                </Link>
              </li>
              <li>
                <Link href="/data-viewer" id="footer-link-data" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <BarChart2 className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Metadata Viewer</span>
                </Link>
              </li>
              <li>
                <Link href="/comment-viewer" id="footer-link-comments" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <MessageSquare className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Comment Viewer</span>
                </Link>
              </li>
              <li>
                <Link href="/random-comment-picker" id="footer-link-picker" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <Trophy className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>Random Comment Picker</span>
                </Link>
              </li>
              <li>
                <Link href="/dislike-checker" id="footer-link-dislikes" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <ThumbsDown className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Dislike Checker</span>
                </Link>
              </li>
              <li>
                <Link href="/description-viewer" id="footer-link-description" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <FileText className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>YouTube Description Viewer</span>
                </Link>
              </li>
              <li>
                <Link href="/private-viewer" id="footer-link-private" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <EyeOff className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>Private YouTube Viewer</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#16181C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E6B]" />
              <span>Information &amp; Trust</span>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#5B6169]">
              <li>
                <Link href="/faq" id="footer-link-faq" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>Frequently Asked Questions</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" id="footer-link-privacy" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" id="footer-link-terms" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <FileText className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" id="footer-link-contact" className="group flex items-center gap-2 hover:text-[#D6293C] active:text-[#D6293C] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#5B6169] group-hover:text-[#D6293C] shrink-0" />
                  <span>Contact Support</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 space-y-4 text-[13px] text-[#5B6169] leading-relaxed">
          <div id="footer-disclaimer" className="flex items-start gap-2.5 p-4 rounded-xl bg-[#F9F9F8] border border-[#E3E2DE]">
            <AlertCircle className="w-4 h-4 text-[#D6293C] shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> YT MONETIZE is an independent third-party creator utility and is not affiliated with, endorsed by, or sponsored by YouTube, LLC or Google LLC. YouTube and the YouTube logo are trademarks of Google LLC. All estimations and public signals are calculated for educational and diagnostic purposes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-[#E3E2DE] text-[12px]">
            <div>© {new Date().getFullYear()} YT MONETIZE (youtubemonetizationchecker.online). All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>English (US)</span>
              <span>•</span>
              <span className="text-[#1E9E6B] font-semibold">100% Free Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
