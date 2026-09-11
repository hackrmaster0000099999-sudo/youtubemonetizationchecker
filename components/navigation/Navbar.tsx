'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Wrench,
  Home,
  DollarSign,
  Calculator,
  HelpCircle,
  Sparkles,
  LifeBuoy,
  Layers,
  Bookmark,
} from 'lucide-react';
import { TOOLS } from '@/lib/constants/site';
import { Logo } from '@/components/common/Logo';
import { ToolIcon, CategoryIcon } from '@/components/common/ToolIcon';
import { useSavedItems } from '@/lib/saved-items/storage';
import { SavedItemsDrawer } from '@/components/common/SavedItemsDrawer';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const { count, isClient } = useSavedItems();
  const pathname = usePathname();

  return (
    <header
      id="main-header"
      className="sticky top-0 z-50 h-[72px] bg-white/75 backdrop-blur-2xl border-b border-white/80 shadow-[0_4px_24px_-4px_rgba(124,58,237,0.06)] w-full"
    >
      <div className="max-w-[1120px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
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
        <nav id="desktop-nav" className="hidden md:flex items-center gap-2 lg:gap-3">
          <Link
            href="/"
            id="nav-home-link"
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all ${
              pathname === '/'
                ? 'text-[#7C3AED] border-[#DDD0FA] bg-[#F3EEFE] shadow-2xs'
                : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
            }`}
          >
            <Home className="w-4 h-4 text-inherit" />
            <span>Home</span>
          </Link>

          {/* Tools Dropdown with Icons and Category Badges */}
          <div className="relative">
            <button
              id="tools-dropdown-btn"
              type="button"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 250)}
              className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
                toolsDropdownOpen
                  ? 'text-[#7C3AED] border-[#DDD0FA] bg-[#F3EEFE]'
                  : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
              }`}
              aria-expanded={toolsDropdownOpen}
            >
              <Wrench className="w-4 h-4 text-[#635B80]" />
              <span>All Creator Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#635B80] transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div
                id="tools-dropdown-menu"
                className="absolute left-0 mt-2 w-[420px] bg-white border border-[#EDE8F9] rounded-3xl shadow-[0_20px_40px_-10px_rgba(124,58,237,0.12)] p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold text-[#635B80] uppercase tracking-wider border-b border-[#EDE8F9] mb-2 bg-[#F3EEFE] rounded-xl">
                  <span className="flex items-center gap-1.5 text-[#7C3AED]">
                    <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
                    {TOOLS.length} Free YouTube Creator Tools
                  </span>
                  <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                    No Login
                  </span>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {Array.from(new Set(TOOLS.map(t => t.category))).map((category) => (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#635B80] uppercase tracking-wider bg-[#F8F5FE] rounded-md mx-1">
                        <CategoryIcon category={category} className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>{category}</span>
                      </div>
                      {TOOLS.filter(t => t.category === category).map((tool) => {
                        const isActive = pathname === tool.path;
                        return (
                          <Link
                            key={tool.id}
                            href={tool.path}
                            id={`nav-tool-${tool.id}`}
                            onClick={() => setToolsDropdownOpen(false)}
                            className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                              isActive
                                ? 'text-[#7C3AED] font-semibold bg-[#F3EEFE] border-[#DDD0FA]'
                                : 'text-[#181135] border-transparent hover:bg-[#F8F5FE] hover:border-[#EDE8F9]'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-[13px] bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                              <ToolIcon name={tool.icon} className="w-4.5 h-4.5 text-[#7C3AED]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="font-semibold text-[13px] truncate block text-[#181135]">{tool.name}</span>
                                {tool.badge === 'MOST POPULAR' && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white uppercase tracking-wider shrink-0 shadow-2xs">
                                    MOST POPULAR
                                  </span>
                                )}
                                {tool.badge === 'POPULAR' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#F2ECFE] text-[#7C3AED] border border-[#DDD0FA] uppercase tracking-wider shrink-0">
                                    POPULAR
                                  </span>
                                )}
                                {tool.badge === 'NEW' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider shrink-0">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#635B80] truncate mt-0.5">{tool.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/monetization-checker"
            id="nav-monetization-link"
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all ${
              pathname === '/monetization-checker'
                ? 'text-[#7C3AED] font-semibold border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-inherit" />
            <span>Monetization Checker</span>
          </Link>

          <Link
            href="/earnings-calculator"
            id="nav-earnings-link"
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all ${
              pathname === '/earnings-calculator'
                ? 'text-[#7C3AED] font-semibold border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
            }`}
          >
            <Calculator className="w-4 h-4 text-inherit" />
            <span>Earnings Calculator</span>
          </Link>

          <Link
            href="/faq"
            id="nav-faq-link"
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all ${
              pathname === '/faq'
                ? 'text-[#7C3AED] font-semibold border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-inherit" />
            <span>FAQ</span>
          </Link>

          {/* Saved Items Button (Browser Cache) */}
          <button
            type="button"
            id="nav-saved-btn"
            onClick={() => setSavedDrawerOpen(true)}
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
              pathname === '/saved' || savedDrawerOpen
                ? 'text-[#7C3AED] border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-[#EDE8F9] bg-white hover:border-[#DDD0FA]'
            }`}
            title="View saved channels, videos & metrics in your browser cache"
          >
            <Bookmark className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
            <span>Saved</span>
            {isClient && count > 0 && (
              <span className="text-[10px] font-mono-data font-bold bg-[#7C3AED] text-white px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            )}
          </button>

          <div
            id="lang-indicator"
            className="flex items-center gap-1.5 text-[11px] font-mono-data font-bold text-[#635B80] border border-[#EDE8F9] px-2.5 py-1.5 rounded-xl bg-[#F3EEFE]"
          >
            <Sparkles className="w-3 h-3 text-[#7C3AED]" />
            <span>v1.0 • FREE</span>
          </div>
        </nav>

        {/* Mobile menu right side: Saved button + Menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            id="mobile-saved-toggle"
            onClick={() => setSavedDrawerOpen(true)}
            className="flex items-center gap-1 p-2 text-[13px] font-bold text-[#181135] border border-[#EDE8F9] rounded-xl bg-[#F8F5FE] transition-colors cursor-pointer"
            aria-label="Open saved items"
          >
            <Bookmark className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
            {isClient && count > 0 && (
              <span className="text-[10px] font-mono-data font-bold bg-[#7C3AED] text-white px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            )}
          </button>

          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#181135] hover:text-[#7C3AED] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-[#EDE8F9] px-5 py-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto"
        >
          {/* Main Home Button */}
          <Link
            href="/"
            id="mobile-nav-home-btn"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between py-3 px-4 rounded-2xl border text-[15px] font-bold transition-all shadow-xs ${
              pathname === '/'
                ? 'text-[#7C3AED] border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-[#EDE8F9] bg-[#F8F5FE] hover:border-[#DDD0FA]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-5 h-5 text-inherit" />
              <span>Home Dashboard</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] bg-white border border-[#DDD0FA] px-2.5 py-0.5 rounded-full">
              Main
            </span>
          </Link>

          <div className="flex items-center justify-between text-[11px] font-bold text-[#635B80] uppercase tracking-wider pt-2 pb-1 border-b border-[#EDE8F9]">
            <span className="flex items-center gap-1.5 text-[#7C3AED]">
              <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
              All {TOOLS.length} Free YouTube Tools
            </span>
            <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded-full">
              No Login
            </span>
          </div>

          <div className="space-y-4">
            {Array.from(new Set(TOOLS.map(t => t.category))).map((category) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-1.5 px-1 text-[12px] font-bold text-[#181135] uppercase tracking-wider">
                  <CategoryIcon category={category} className="w-4 h-4 text-[#7C3AED]" />
                  <span>{category} Tools</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {TOOLS.filter(t => t.category === category).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      id={`mobile-nav-tool-${tool.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        pathname === tool.path 
                          ? 'text-[#7C3AED] font-semibold bg-[#F3EEFE] border-[#DDD0FA]' 
                          : 'text-[#181135] border-[#EDE8F9] bg-white hover:bg-[#F8F5FE]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-[13px] bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                          <ToolIcon name={tool.icon} className="w-4.5 h-4.5 text-[#7C3AED]" />
                        </div>
                        <span className="text-[14px] font-semibold truncate block text-[#181135]">{tool.name}</span>
                      </div>
                      <div className="shrink-0 pl-2">
                        {tool.badge === 'MOST POPULAR' && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white uppercase tracking-wider shadow-2xs">
                            POPULAR
                          </span>
                        )}
                        {tool.badge === 'POPULAR' && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F2ECFE] text-[#7C3AED] border border-[#DDD0FA] uppercase tracking-wider">
                            POPULAR
                          </span>
                        )}
                        {tool.badge === 'NEW' && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                            NEW
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EDE8F9] flex justify-between items-center text-[13px]">
            <Link
              href="/faq"
              id="mobile-faq-link"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-[#181135] font-semibold hover:text-[#7C3AED]"
            >
              <HelpCircle className="w-4 h-4 text-[#635B80]" />
              <span>Platform FAQ &amp; Guides</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-[#635B80] hover:text-[#7C3AED]"
            >
              <LifeBuoy className="w-4 h-4 text-[#635B80]" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      )}

      {/* Saved Items Drawer (Client-Side Storage) */}
      <SavedItemsDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
      />
    </header>
  );
}
