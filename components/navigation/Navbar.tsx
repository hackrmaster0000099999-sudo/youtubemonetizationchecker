'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  DollarSign,
  Calculator,
  HelpCircle,
  Sparkles,
  LifeBuoy,
  Layers,
  Bookmark,
  Flame,
  CloudRain,
  Zap,
  Heart,
  Compass,
  Users,
  Moon,
  MessageSquareQuote,
} from 'lucide-react';
import { TOOLS } from '@/lib/constants/site';
import { CAPTION_CATEGORIES } from '@/lib/constants/captions';
import { Logo } from '@/components/common/Logo';
import { ToolIcon, CategoryIcon } from '@/components/common/ToolIcon';
import { useSavedItems } from '@/lib/saved-items/storage';

function NavbarContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [captionsDropdownOpen, setCaptionsDropdownOpen] = useState(false);
  const [userToggledYoutube, setUserToggledYoutube] = useState<boolean | null>(null);
  const [userToggledCaptions, setUserToggledCaptions] = useState<boolean | null>(null);

  const { count, isClient } = useSavedItems();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const isCaptionsActive = pathname === '/captions' || pathname.startsWith('/captions/');
  const pathCategory = pathname.startsWith('/captions/') ? pathname.replace('/captions/', '').split('?')[0].split('/')[0] : null;
  const activeCaptionCategory = pathCategory || (pathname === '/captions' ? (currentCategory || 'islamic') : null);
  const isToolsActive = TOOLS.some((t) => t.path === pathname);

  const mobileYoutubeOpen = userToggledYoutube !== null ? userToggledYoutube : isToolsActive;
  const mobileCaptionsOpen = userToggledCaptions !== null ? userToggledCaptions : isCaptionsActive;

  const toggleMobileYoutube = () => setUserToggledYoutube(!mobileYoutubeOpen);
  const toggleMobileCaptions = () => setUserToggledCaptions(!mobileCaptionsOpen);

  const getCaptionCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Flame':
        return <Flame className={className} />;
      case 'CloudRain':
        return <CloudRain className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  const CAPTION_GROUPS = [
    {
      title: 'Inspirations & Emotions (অনুপ্রেরণা ও আবেগ)',
      icon: Flame,
      items: CAPTION_CATEGORIES.filter((c) =>
        ['motivational', 'attitude', 'romantic', 'sad'].includes(c.id)
      ),
    },
    {
      title: 'Life & Society (বাস্তবতা ও সমাজ)',
      icon: Compass,
      items: CAPTION_CATEGORIES.filter((c) =>
        ['life', 'friendship', 'islamic'].includes(c.id)
      ),
    },
  ];

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
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {/* Section 1: YouTube Creator Tools Dropdown */}
          <div className="relative">
            <button
              id="youtube-tools-dropdown-btn"
              type="button"
              onClick={() => {
                setToolsDropdownOpen(!toolsDropdownOpen);
                setCaptionsDropdownOpen(false);
              }}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 250)}
              className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                toolsDropdownOpen
                  ? 'text-[#7C3AED] border-[#DDD0FA] bg-[#F3EEFE]'
                  : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
              }`}
              aria-expanded={toolsDropdownOpen}
            >
              <Layers className="w-4 h-4 text-[#7C3AED]" />
              <span>YouTube Creator Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#635B80] transition-transform duration-200 ${
                  toolsDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {toolsDropdownOpen && (
              <div
                id="tools-dropdown-menu"
                className="absolute left-0 mt-2 w-[420px] bg-white border border-[#EDE8F9] rounded-3xl shadow-[0_20px_40px_-10px_rgba(124,58,237,0.12)] p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold text-[#635B80] uppercase tracking-wider border-b border-[#EDE8F9] mb-2 bg-[#F3EEFE] rounded-xl">
                  <span className="flex items-center gap-1.5 text-[#7C3AED] whitespace-nowrap">
                    <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
                    {TOOLS.length} YouTube Creator Services
                  </span>
                  <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded-full whitespace-nowrap">
                    100% Free
                  </span>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {Array.from(new Set(TOOLS.map((t) => t.category))).map((category) => (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#635B80] uppercase tracking-wider bg-[#F8F5FE] rounded-md mx-1">
                        <CategoryIcon category={category} className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>{category}</span>
                      </div>
                      {TOOLS.filter((t) => t.category === category).map((tool) => {
                        const isActive = pathname === tool.path;
                        return (
                          <Link
                            key={tool.id}
                            href={tool.path}
                            id={`nav-tool-${tool.id}`}
                            onClick={() => setToolsDropdownOpen(false)}
                            className={`flex items-center gap-3 p-2 rounded-2xl border transition-all ${
                              isActive
                                ? 'text-[#7C3AED] font-semibold bg-[#F3EEFE] border-[#DDD0FA]'
                                : 'text-[#181135] border-transparent hover:bg-[#F8F5FE] hover:border-[#EDE8F9]'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                              <ToolIcon name={tool.icon} className="w-4 h-4 text-[#7C3AED]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="font-semibold text-[13px] truncate block text-[#181135]">
                                  {tool.name}
                                </span>
                                {tool.badge === 'MOST POPULAR' && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white uppercase tracking-wider shrink-0 shadow-2xs whitespace-nowrap">
                                    MOST POPULAR
                                  </span>
                                )}
                                {tool.badge === 'POPULAR' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#F2ECFE] text-[#7C3AED] border border-[#DDD0FA] uppercase tracking-wider shrink-0 whitespace-nowrap">
                                    POPULAR
                                  </span>
                                )}
                                {tool.badge === 'NEW' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider shrink-0 whitespace-nowrap">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#635B80] truncate mt-0.5">
                                {tool.description}
                              </p>
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

          {/* Section 2: Bangla & English Captions Dropdown */}
          <div className="relative">
            <button
              id="captions-dropdown-btn"
              type="button"
              onClick={() => {
                setCaptionsDropdownOpen(!captionsDropdownOpen);
                setToolsDropdownOpen(false);
              }}
              onBlur={() => setTimeout(() => setCaptionsDropdownOpen(false), 250)}
              className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                captionsDropdownOpen || pathname === '/captions'
                  ? 'text-[#7C3AED] border-[#DDD0FA] bg-[#F3EEFE]'
                  : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
              }`}
              aria-expanded={captionsDropdownOpen}
            >
              <MessageSquareQuote className="w-4 h-4 text-[#7C3AED]" />
              <span>Bangla &amp; English Captions</span>
              <span className="text-[9px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-1.5 py-0.2 rounded-full">
                NEW
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#635B80] transition-transform duration-200 ${
                  captionsDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {captionsDropdownOpen && (
              <div
                id="captions-dropdown-menu"
                className="absolute left-0 mt-2 w-[440px] bg-white border border-[#EDE8F9] rounded-3xl shadow-[0_20px_40px_-10px_rgba(124,58,237,0.12)] p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold text-[#635B80] uppercase tracking-wider border-b border-[#EDE8F9] mb-2 bg-[#F3EEFE] rounded-xl">
                  <span className="flex items-center gap-1.5 text-[#7C3AED] whitespace-nowrap">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-[#7C3AED]" />
                    Bangla &amp; English Captions Hub
                  </span>
                  <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded-full whitespace-nowrap">
                    1-Click Copy
                  </span>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Category Groups */}
                  {CAPTION_GROUPS.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                      <div key={group.title} className="space-y-1">
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#635B80] uppercase tracking-wider bg-[#F8F5FE] rounded-md mx-1">
                          <GroupIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>{group.title}</span>
                        </div>

                        {group.items.map((cat) => {
                          const isCatActive = activeCaptionCategory === cat.id;
                          return (
                            <Link
                              key={cat.id}
                              href={`/captions/${cat.id}`}
                              id={`nav-caption-${cat.id}`}
                              onClick={() => setCaptionsDropdownOpen(false)}
                              className={`flex items-center gap-3 p-2 rounded-2xl border transition-all group ${
                                isCatActive
                                  ? 'text-[#7C3AED] font-semibold bg-[#F3EEFE] border-[#DDD0FA] shadow-2xs'
                                  : 'text-[#181135] border-transparent hover:bg-[#F8F5FE] hover:border-[#EDE8F9]'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-all ${
                                  isCatActive
                                    ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                                    : 'bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] group-hover:scale-105 group-hover:bg-[#7C3AED] group-hover:text-white'
                                }`}
                              >
                                {getCaptionCategoryIcon(cat.icon, 'w-4 h-4 text-inherit')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span
                                    className={`font-semibold text-[13px] truncate block transition-colors ${
                                      isCatActive
                                        ? 'text-[#7C3AED] font-bold'
                                        : 'text-[#181135] group-hover:text-[#7C3AED]'
                                    }`}
                                  >
                                    {cat.name}
                                  </span>
                                  {isCatActive ? (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#7C3AED] text-white uppercase tracking-wider shrink-0 shadow-2xs whitespace-nowrap">
                                      ACTIVE
                                    </span>
                                  ) : cat.badge ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#F2ECFE] text-[#7C3AED] border border-[#DDD0FA] uppercase tracking-wider shrink-0 whitespace-nowrap">
                                      {cat.badge}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex items-center justify-between text-[11px] truncate mt-0.5">
                                  <span
                                    className={`truncate ${
                                      isCatActive ? 'text-[#7C3AED]/80 font-medium' : 'text-[#635B80]'
                                    }`}
                                  >
                                    {cat.shortDesc || cat.banglaName}
                                  </span>
                                  <span
                                    className={`text-[10px] shrink-0 font-medium ml-2 ${
                                      isCatActive ? 'text-[#7C3AED]' : 'text-[#8E87A8]'
                                    }`}
                                  >
                                    {cat.banglaName.split(' ')[0]}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Direct Flagship Tool: Monetization Checker */}
          <Link
            href="/monetization-checker"
            id="nav-monetization-link"
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all whitespace-nowrap ${
              pathname === '/monetization-checker'
                ? 'text-[#7C3AED] font-semibold border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-inherit" />
            <span>Monetization Checker</span>
          </Link>

          {/* FAQ */}
          <Link
            href="/faq"
            id="nav-faq-link"
            className={`hidden xl:flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all whitespace-nowrap ${
              pathname === '/faq'
                ? 'text-[#7C3AED] font-semibold border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-transparent hover:border-[#EDE8F9] hover:text-[#7C3AED]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-inherit" />
            <span>FAQ</span>
          </Link>

          {/* Saved Items Button (Browser Cache) */}
          <Link
            href="/saved"
            id="nav-saved-btn"
            className={`flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
              pathname === '/saved'
                ? 'text-[#7C3AED] border-[#DDD0FA] bg-[#F3EEFE]'
                : 'text-[#181135] border-[#EDE8F9] bg-white hover:border-[#DDD0FA]'
            }`}
            title="View saved items in your browser cache"
          >
            <Bookmark className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
            <span>Saved</span>
            {isClient && count > 0 && (
              <span className="text-[10px] font-mono-data font-bold bg-[#7C3AED] text-white px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile menu right side: Saved button + Menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/saved"
            id="mobile-saved-toggle"
            className="flex items-center gap-1 p-2 text-[13px] font-bold text-[#181135] border border-[#EDE8F9] rounded-xl bg-[#F8F5FE] transition-colors cursor-pointer"
            aria-label="Open saved items"
          >
            <Bookmark className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
            {isClient && count > 0 && (
              <span className="text-[10px] font-mono-data font-bold bg-[#7C3AED] text-white px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            )}
          </Link>

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
          className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-[#EDE8F9] px-4 sm:px-5 py-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto"
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

          {/* Section 1: YouTube Creator Tools Accordion */}
          <div className="border border-[#EDE8F9] rounded-2xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={toggleMobileYoutube}
              className="w-full flex items-center justify-between p-3.5 text-left transition-all hover:bg-[#F8F5FE] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F2ECFE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#181135] block">
                    YouTube Creator Tools
                  </span>
                  <span className="text-[11px] text-[#635B80]">
                    ১৪টি ক্রিয়েটর টুলস ও সার্ভিস
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#7C3AED] bg-[#F3EEFE] px-2 py-0.5 rounded-full">
                  {TOOLS.length} Tools
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#635B80] transition-transform duration-200 ${
                    mobileYoutubeOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* When clicked, YouTube tools are shown line by line */}
            {mobileYoutubeOpen && (
              <div className="p-3 bg-[#F8F5FE]/60 border-t border-[#EDE8F9] space-y-3">
                {Array.from(new Set(TOOLS.map((t) => t.category))).map((category) => (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider bg-white rounded-lg border border-[#EDE8F9]">
                      <CategoryIcon category={category} className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{category} Tools</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {TOOLS.filter((t) => t.category === category).map((tool) => (
                        <Link
                          key={tool.id}
                          href={tool.path}
                          id={`mobile-nav-tool-${tool.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                            pathname === tool.path
                              ? 'text-[#7C3AED] font-semibold bg-[#F3EEFE] border-[#DDD0FA]'
                              : 'text-[#181135] border-[#EDE8F9] bg-white hover:bg-[#F8F5FE]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center shrink-0">
                              <ToolIcon name={tool.icon} className="w-4 h-4 text-[#7C3AED]" />
                            </div>
                            <span className="text-[13px] font-semibold truncate block text-[#181135]">
                              {tool.name}
                            </span>
                          </div>
                          <div className="shrink-0 pl-1.5">
                            {tool.badge && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F2ECFE] text-[#7C3AED] border border-[#DDD0FA]">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Bangla & English Captions Accordion */}
          <div
            className={`border rounded-2xl overflow-hidden transition-all ${
              isCaptionsActive ? 'border-[#DDD0FA] bg-white' : 'border-[#EDE8F9] bg-white'
            }`}
          >
            <button
              type="button"
              onClick={toggleMobileCaptions}
              className={`w-full flex items-center justify-between p-3.5 text-left transition-all cursor-pointer ${
                isCaptionsActive ? 'bg-[#F3EEFE]/60' : 'hover:bg-[#F8F5FE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isCaptionsActive
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-gradient-to-br from-[#F2ECFE] to-[#FCE7F3] text-[#7C3AED]'
                  }`}
                >
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <div>
                  <span
                    className={`text-[14px] font-bold block ${
                      isCaptionsActive ? 'text-[#7C3AED]' : 'text-[#181135]'
                    }`}
                  >
                    Bangla &amp; English Captions
                  </span>
                  <span className="text-[11px] text-[#635B80]">
                    বাংলা ও ইংরেজি সোশ্যাল ক্যাপশন হাব
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isCaptionsActive ? (
                  <span className="text-[10px] font-bold text-[#7C3AED] bg-white border border-[#DDD0FA] px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-[#635B80] transition-transform duration-200 ${
                    mobileCaptionsOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* When clicked, Captions categories are shown */}
            {mobileCaptionsOpen && (
              <div className="p-3 bg-[#F8F5FE]/60 border-t border-[#EDE8F9] space-y-3">
                {CAPTION_GROUPS.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <div key={group.title} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider bg-white rounded-lg border border-[#EDE8F9]">
                        <GroupIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>{group.title}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {group.items.map((cat) => {
                          const isCatActive = activeCaptionCategory === cat.id;
                          return (
                            <Link
                              key={cat.id}
                              href={`/captions/${cat.id}`}
                              id={`mobile-nav-caption-${cat.id}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                isCatActive
                                  ? 'text-[#7C3AED] font-semibold bg-[#F3EEFE] border-[#DDD0FA]'
                                  : 'text-[#181135] border-[#EDE8F9] bg-white hover:bg-[#F8F5FE]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isCatActive
                                      ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                                      : 'bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED]'
                                  }`}
                                >
                                  {getCaptionCategoryIcon(cat.icon, 'w-4 h-4 text-inherit')}
                                </div>
                                <div className="min-w-0">
                                  <span
                                    className={`text-[13px] font-semibold truncate block ${
                                      isCatActive ? 'text-[#7C3AED] font-bold' : 'text-[#181135]'
                                    }`}
                                  >
                                    {cat.name}
                                  </span>
                                  <span
                                    className={`text-[11px] truncate block ${
                                      isCatActive ? 'text-[#7C3AED]/80 font-medium' : 'text-[#635B80]'
                                    }`}
                                  >
                                    {cat.shortDesc || cat.banglaName}
                                  </span>
                                </div>
                              </div>
                              <div className="shrink-0 pl-1.5 flex items-center gap-1.5">
                                {isCatActive ? (
                                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#7C3AED] text-white uppercase tracking-wider">
                                    ACTIVE
                                  </span>
                                ) : cat.badge ? (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F2ECFE] text-[#7C3AED] border border-[#DDD0FA]">
                                    {cat.badge}
                                  </span>
                                ) : null}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Bottom Links & FAQ */}
          <div className="pt-2 border-t border-[#EDE8F9] flex justify-between items-center text-[13px]">
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
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 h-[72px] bg-white/75 backdrop-blur-2xl border-b border-white/80 shadow-[0_4px_24px_-4px_rgba(124,58,237,0.06)] w-full">
          <div className="max-w-[1120px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="YT MONETIZE Home">
              <Logo size={36} showText={true} />
            </Link>
          </div>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
