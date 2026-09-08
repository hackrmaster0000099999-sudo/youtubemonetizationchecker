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
      className="sticky top-0 z-50 h-[72px] bg-white border-b border-[#E3E2DE] w-full"
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
                ? 'text-[#D6293C] border-[#E3E2DE] bg-[#F9F9F8] shadow-2xs'
                : 'text-[#16181C] border-transparent hover:border-[#E3E2DE] hover:text-[#D6293C]'
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
                  ? 'text-[#D6293C] border-[#E3E2DE] bg-[#F9F9F8]'
                  : 'text-[#16181C] border-transparent hover:border-[#E3E2DE] hover:text-[#D6293C]'
              }`}
              aria-expanded={toolsDropdownOpen}
            >
              <Wrench className="w-4 h-4 text-[#5B6169]" />
              <span>All Creator Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#5B6169] transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div
                id="tools-dropdown-menu"
                className="absolute left-0 mt-2 w-[420px] bg-white border border-[#E3E2DE] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold text-[#5B6169] uppercase tracking-wider border-b border-[#F0EFEB] mb-2 bg-[#F9F9F8] rounded-xl">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#D6293C]" />
                    {TOOLS.length} Free YouTube Creator Tools
                  </span>
                  <span className="text-[10px] text-[#1E9E6B] font-bold bg-[rgba(30,158,107,0.1)] px-2 py-0.5 rounded-full">
                    No Login
                  </span>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {Array.from(new Set(TOOLS.map(t => t.category))).map((category) => (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#5B6169] uppercase tracking-wider bg-[#F9F9F8] rounded-md mx-1">
                        <CategoryIcon category={category} className="w-3.5 h-3.5 text-[#D6293C]" />
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
                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                              isActive
                                ? 'text-[#D6293C] font-semibold bg-[#F9F9F8] border-[#E3E2DE]'
                                : 'text-[#16181C] border-transparent hover:bg-[#F9F9F8] hover:border-[#E3E2DE]'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'border-[#D6293C]/30 bg-white text-[#D6293C]'
                                : 'border-[#E3E2DE] bg-white text-[#5B6169]'
                            }`}>
                              <ToolIcon name={tool.icon} className="w-4 h-4 text-inherit" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-[13px] truncate block">{tool.name}</span>
                              <p className="text-[11px] text-[#5B6169] truncate mt-0.5">{tool.description}</p>
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
                ? 'text-[#D6293C] font-semibold border-[#E3E2DE] bg-[#F9F9F8]'
                : 'text-[#16181C] border-transparent hover:border-[#E3E2DE] hover:text-[#D6293C]'
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
                ? 'text-[#D6293C] font-semibold border-[#E3E2DE] bg-[#F9F9F8]'
                : 'text-[#16181C] border-transparent hover:border-[#E3E2DE] hover:text-[#D6293C]'
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
                ? 'text-[#D6293C] font-semibold border-[#E3E2DE] bg-[#F9F9F8]'
                : 'text-[#16181C] border-transparent hover:border-[#E3E2DE] hover:text-[#D6293C]'
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
                ? 'text-[#D6293C] border-[#D6293C]/30 bg-[#FDF2F3]'
                : 'text-[#16181C] border-[#E3E2DE] bg-white hover:border-[#16181C]'
            }`}
            title="View saved channels, videos & metrics in your browser cache"
          >
            <Bookmark className="w-4 h-4 text-[#D6293C] fill-[#D6293C]" />
            <span>Saved</span>
            {isClient && count > 0 && (
              <span className="text-[10px] font-mono-data font-bold bg-[#D6293C] text-white px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            )}
          </button>

          <div
            id="lang-indicator"
            className="flex items-center gap-1.5 text-[11px] font-mono-data font-bold text-[#5B6169] border border-[#E3E2DE] px-2.5 py-1.5 rounded-xl bg-[#F9F9F8]"
          >
            <Sparkles className="w-3 h-3 text-[#1E9E6B]" />
            <span>v1.0 • FREE</span>
          </div>
        </nav>

        {/* Mobile menu right side: Saved button + Menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            id="mobile-saved-toggle"
            onClick={() => setSavedDrawerOpen(true)}
            className="flex items-center gap-1 p-2 text-[13px] font-bold text-[#16181C] border border-[#E3E2DE] rounded-xl bg-[#F9F9F8] active:scale-95 transition-transform cursor-pointer"
            aria-label="Open saved items"
          >
            <Bookmark className="w-4 h-4 text-[#D6293C] fill-[#D6293C]" />
            {isClient && count > 0 && (
              <span className="text-[10px] font-mono-data font-bold bg-[#D6293C] text-white px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            )}
          </button>

          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#16181C] hover:text-[#D6293C] active:scale-90 transition-transform cursor-pointer"
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
          className="md:hidden bg-white border-b border-[#E3E2DE] px-5 py-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto"
        >
          {/* Main Home Button */}
          <Link
            href="/"
            id="mobile-nav-home-btn"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between py-3 px-4 rounded-xl border text-[15px] font-bold transition-all shadow-xs ${
              pathname === '/'
                ? 'text-[#D6293C] border-[#D6293C]/30 bg-[rgba(214,41,60,0.06)]'
                : 'text-[#16181C] border-[#E3E2DE] bg-[#F9F9F8] hover:border-[#16181C]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-5 h-5 text-inherit" />
              <span>Home Dashboard</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5B6169] bg-white border border-[#E3E2DE] px-2 py-0.5 rounded-md">
              Main
            </span>
          </Link>

          <div className="flex items-center justify-between text-[11px] font-bold text-[#5B6169] uppercase tracking-wider pt-2 pb-1 border-b border-[#F0EFEB]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D6293C]" />
              All {TOOLS.length} Free YouTube Tools
            </span>
          </div>

          <div className="space-y-4">
            {Array.from(new Set(TOOLS.map(t => t.category))).map((category) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-1.5 px-1 text-[12px] font-bold text-[#16181C] uppercase tracking-wider">
                  <CategoryIcon category={category} className="w-4 h-4 text-[#D6293C]" />
                  <span>{category} Tools</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {TOOLS.filter(t => t.category === category).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      id={`mobile-nav-tool-${tool.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center p-2.5 rounded-xl border transition-all ${
                        pathname === tool.path 
                          ? 'text-[#D6293C] font-semibold bg-[#F9F9F8] border-[#E3E2DE]' 
                          : 'text-[#16181C] border-[#E3E2DE] hover:bg-[#F9F9F8]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                          pathname === tool.path
                            ? 'border-[#D6293C]/30 bg-white text-[#D6293C]'
                            : 'border-[#E3E2DE] bg-white text-[#5B6169]'
                        }`}>
                          <ToolIcon name={tool.icon} className="w-4 h-4 text-inherit" />
                        </div>
                        <span className="text-[14px] font-semibold truncate block">{tool.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0EFEB] flex justify-between items-center text-[13px]">
            <Link
              href="/faq"
              id="mobile-faq-link"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-[#16181C] font-semibold active:text-[#D6293C]"
            >
              <HelpCircle className="w-4 h-4 text-[#5B6169]" />
              <span>Platform FAQ &amp; Guides</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-[#5B6169] hover:text-[#16181C]"
            >
              <LifeBuoy className="w-4 h-4 text-[#5B6169]" />
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
