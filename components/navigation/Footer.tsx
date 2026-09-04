import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#FCFCFB] border-t border-[#E8E7E3] pt-16 pb-12 text-[#16181C]"
    >
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#E8E7E3]">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-block tap-press">
              <Logo size={32} showText={true} />
            </Link>
            <p className="text-[14px] text-[#5B6169] leading-relaxed">
              Fast, accurate, free YouTube creator utility platform. Research channel monetization, copy channel IDs, estimate revenue, and inspect public video metadata without login or software installs.
            </p>
          </div>

          {/* Channel Tools */}
          <div className="space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-[#16181C]">
              Channel Tools
            </div>
            <ul className="space-y-2 text-[14px] text-[#5B6169]">
              <li>
                <Link href="/monetization-checker" id="footer-link-monetization" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Monetization Checker
                </Link>
              </li>
              <li>
                <Link href="/channel-id-finder" id="footer-link-channel-id" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Channel ID Finder
                </Link>
              </li>
              <li>
                <Link href="/image-downloader" id="footer-link-image-downloader" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Image Downloader
                </Link>
              </li>
              <li>
                <Link href="/shadowban-detector" id="footer-link-shadowban" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Shadowban Detector
                </Link>
              </li>
            </ul>
          </div>

          {/* Video & Analytics Tools */}
          <div className="space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-[#16181C]">
              Video &amp; Analytics
            </div>
            <ul className="space-y-2 text-[14px] text-[#5B6169]">
              <li>
                <Link href="/earnings-calculator" id="footer-link-earnings" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Earnings Calculator
                </Link>
              </li>
              <li>
                <Link href="/thumbnail-downloader" id="footer-link-thumbnail" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Thumbnail Downloader
                </Link>
              </li>
              <li>
                <Link href="/tag-extractor" id="footer-link-tags" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Tag Extractor
                </Link>
              </li>
              <li>
                <Link href="/data-viewer" id="footer-link-data" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  YouTube Metadata Viewer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-[#16181C]">
              Information &amp; Trust
            </div>
            <ul className="space-y-2 text-[14px] text-[#5B6169]">
              <li>
                <Link href="/faq" id="footer-link-faq" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" id="footer-link-privacy" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" id="footer-link-terms" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/contact" id="footer-link-contact" className="hover:text-[#D6293C] active:text-[#D6293C] transition-colors block">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 space-y-4 text-[13px] text-[#5B6169] leading-relaxed">
          <p id="footer-disclaimer">
            <strong>Disclaimer:</strong> YT MONETIZE is an independent third-party creator utility and is not affiliated with, endorsed by, or sponsored by YouTube, LLC or Google LLC. YouTube and the YouTube logo are trademarks of Google LLC. All estimations and public signals are calculated for educational and diagnostic purposes.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-[#E8E7E3] text-[12px]">
            <div>© {new Date().getFullYear()} YT MONETIZE (youtubemonetizationchecker.online). All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>English (US)</span>
              <span>•</span>
              <span>100% Free &amp; Anonymous</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
