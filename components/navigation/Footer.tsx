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
      className="w-full bg-[#FCFCFB] border-t border-[#EDE8F9] pt-16 pb-12 text-[#181135]"
    >
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#EDE8F9]">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-block tap-press">
              <Logo size={32} showText={true} />
            </Link>
            <p className="text-[13px] text-[#635B80] leading-relaxed">
              Fast, accurate, free YouTube creator utility platform. Research channel monetization, copy channel IDs, estimate revenue, and inspect public video metadata without login or software installs.
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
                  <span>YouTube Monetization Checker</span>
                </Link>
              </li>
              <li>
                <Link href="/channel-id-finder" id="footer-link-channel-id" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Search className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Channel ID Finder</span>
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
                  <span>YouTube Image Downloader</span>
                </Link>
              </li>
              <li>
                <Link href="/shadowban-detector" id="footer-link-shadowban" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Shadowban Detector</span>
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
                  <span>YouTube Earnings Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/thumbnail-downloader" id="footer-link-thumbnail" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Thumbnail Downloader</span>
                </Link>
              </li>
              <li>
                <Link href="/tag-extractor" id="footer-link-tags" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Tag className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Tag Extractor</span>
                </Link>
              </li>
              <li>
                <Link href="/data-viewer" id="footer-link-data" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <BarChart2 className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Metadata Viewer</span>
                </Link>
              </li>
              <li>
                <Link href="/comment-viewer" id="footer-link-comments" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <MessageSquare className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Comment Viewer</span>
                </Link>
              </li>
              <li>
                <Link href="/random-comment-picker" id="footer-link-picker" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <Trophy className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Random Comment Picker</span>
                </Link>
              </li>
              <li>
                <Link href="/dislike-checker" id="footer-link-dislikes" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <ThumbsDown className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Dislike Checker</span>
                </Link>
              </li>
              <li>
                <Link href="/description-viewer" id="footer-link-description" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <FileText className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>YouTube Description Viewer</span>
                </Link>
              </li>
              <li>
                <Link href="/private-viewer" id="footer-link-private" className="group flex items-center gap-2 hover:text-[#7C3AED] active:text-[#7C3AED] transition-colors">
                  <EyeOff className="w-3.5 h-3.5 text-[#635B80] group-hover:text-[#7C3AED] shrink-0" />
                  <span>Private YouTube Viewer</span>
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
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-[#635B80]">
            <Link href="/monetization-checker" className="hover:text-[#7C3AED] transition-colors">YouTube Monetization Checker</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/channel-id-finder" className="hover:text-[#7C3AED] transition-colors">Channel ID Finder</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/earnings-calculator" className="hover:text-[#7C3AED] transition-colors">YouTube Earnings Calculator</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/thumbnail-downloader" className="hover:text-[#7C3AED] transition-colors">Thumbnail Downloader HD</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/tag-extractor" className="hover:text-[#7C3AED] transition-colors">YouTube Tag Extractor</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/dislike-checker" className="hover:text-[#7C3AED] transition-colors">YouTube Dislike Checker</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/random-comment-picker" className="hover:text-[#7C3AED] transition-colors">Random Comment Giveaway Picker</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/description-viewer" className="hover:text-[#7C3AED] transition-colors">Description Grabber</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/comment-viewer" className="hover:text-[#7C3AED] transition-colors">Comment Search &amp; Viewer</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/data-viewer" className="hover:text-[#7C3AED] transition-colors">Metadata &amp; Upload Time Viewer</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/private-viewer" className="hover:text-[#7C3AED] transition-colors">Private Incognito Viewer</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/shadowban-detector" className="hover:text-[#7C3AED] transition-colors">Shadowban Diagnostic</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/hidden-video-finder" className="hover:text-[#7C3AED] transition-colors">Unlisted Video Search</Link>
            <span className="text-[#DDD0FA]">•</span>
            <Link href="/image-downloader" className="hover:text-[#7C3AED] transition-colors">Banner &amp; Avatar Downloader</Link>
          </div>
        </div>

        {/* Bottom Bar / Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#635B80]">
          <div>
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
