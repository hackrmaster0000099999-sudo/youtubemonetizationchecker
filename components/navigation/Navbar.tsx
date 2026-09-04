'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Wrench } from 'lucide-react';
import { TOOLS } from '@/lib/constants/site';
import { Logo } from '@/components/common/Logo';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      id="main-header"
      className="sticky top-0 z-50 h-[72px] bg-white border-b border-[#E8E7E3] w-full"
    >
      <div className="max-w-[1120px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Official Brand Logo */}
        <Link
          href="/"
          id="brand-logo"
          className="flex items-center gap-2 tap-press transition-transform"
          aria-label="YT MONETIZE Home"
        >
          <Logo size={36} showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-6">
          <div className="relative">
            <button
              id="tools-dropdown-btn"
              type="button"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 250)}
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#16181C] hover:text-[#D6293C] active:scale-95 transition-all py-2 cursor-pointer"
              aria-expanded={toolsDropdownOpen}
            >
              <Wrench className="w-4 h-4 text-[#5B6169]" />
              <span>All Creator Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#5B6169] transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div
                id="tools-dropdown-menu"
                className="absolute left-0 mt-2 w-80 bg-white border border-[#E8E7E3] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="px-4 py-1.5 text-[11px] font-semibold text-[#5B6169] uppercase tracking-wider border-b border-[#E8E7E3] mb-1">
                  8 Production YouTube Tools
                </div>
                {TOOLS.map((tool) => {
                  const isActive = pathname === tool.path;
                  return (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      id={`nav-tool-${tool.id}`}
                      onClick={() => setToolsDropdownOpen(false)}
                      className={`block px-4 py-2.5 text-[14px] active:bg-[#F2F1EE] active:scale-[0.98] transition-all ${
                        isActive
                          ? 'text-[#D6293C] font-semibold bg-[#FCFCFB]'
                          : 'text-[#16181C] hover:text-[#D6293C] hover:bg-[#FCFCFB]'
                      }`}
                    >
                      <div className="font-medium text-[13px]">{tool.name}</div>
                      <div className="text-[12px] text-[#5B6169] truncate mt-0.5">{tool.description}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/monetization-checker"
            id="nav-monetization-link"
            className={`text-[14px] font-medium py-1.5 px-3 border border-transparent hover:border-[#E8E7E3] active:scale-95 transition-all ${
              pathname === '/monetization-checker'
                ? 'text-[#D6293C] font-semibold border-[#E8E7E3] bg-[#FCFCFB]'
                : 'text-[#16181C] hover:text-[#D6293C]'
            }`}
          >
            Monetization Checker
          </Link>

          <Link
            href="/earnings-calculator"
            id="nav-earnings-link"
            className={`text-[14px] font-medium py-1.5 px-3 border border-transparent hover:border-[#E8E7E3] active:scale-95 transition-all ${
              pathname === '/earnings-calculator'
                ? 'text-[#D6293C] font-semibold border-[#E8E7E3] bg-[#FCFCFB]'
                : 'text-[#16181C] hover:text-[#D6293C]'
            }`}
          >
            Earnings Calculator
          </Link>

          <Link
            href="/faq"
            id="nav-faq-link"
            className={`text-[14px] font-medium py-1.5 px-3 border border-transparent hover:border-[#E8E7E3] active:scale-95 transition-all ${
              pathname === '/faq'
                ? 'text-[#D6293C] font-semibold border-[#E8E7E3] bg-[#FCFCFB]'
                : 'text-[#16181C] hover:text-[#D6293C]'
            }`}
          >
            FAQ
          </Link>

          <div
            id="lang-indicator"
            className="text-[12px] font-mono-data font-semibold text-[#5B6169] border border-[#E8E7E3] px-2.5 py-1 bg-[#FCFCFB]"
          >
            v1.0 • FREE
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-toggle"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#16181C] hover:text-[#D6293C] active:scale-90 transition-transform"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-white border-b border-[#E8E7E3] px-6 py-4 space-y-3 shadow-xl"
        >
          <div className="text-[11px] font-semibold text-[#5B6169] uppercase tracking-wider pb-1 border-b border-[#E8E7E3]">
            All 8 Free YouTube Tools
          </div>
          <div className="grid grid-cols-1 gap-1">
            {TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                id={`mobile-nav-tool-${tool.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-2 text-[14px] font-medium active:bg-[#F2F1EE] active:scale-[0.98] transition-all ${
                  pathname === tool.path ? 'text-[#D6293C] font-semibold bg-[#FCFCFB]' : 'text-[#16181C]'
                }`}
              >
                {tool.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-[#E8E7E3] flex justify-between items-center text-[13px]">
            <Link
              href="/faq"
              id="mobile-faq-link"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#16181C] font-semibold active:text-[#D6293C]"
            >
              Platform FAQ &amp; Guides
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5B6169] hover:text-[#16181C]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
