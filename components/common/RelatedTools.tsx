import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RELATED_TOOLS_MAP, TOOLS, ToolItem } from '@/lib/constants/site';
import { ToolIcon, CategoryIcon } from '@/components/common/ToolIcon';

interface RelatedToolsProps {
  currentToolId: string;
}

export function RelatedTools({ currentToolId }: RelatedToolsProps) {
  const relatedIds = RELATED_TOOLS_MAP[currentToolId] || ['monetization-checker', 'channel-id-finder', 'earnings-calculator'];
  const relatedTools = relatedIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is ToolItem => Boolean(t));

  if (relatedTools.length === 0) return null;

  return (
    <section id="related-tools-section" className="mt-16 pt-12 border-t border-[#EDE8F9]">
      <div className="space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFFE] border border-[#DDD0FA] text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#7C3AED]" />
          <span>Recommended Utilities</span>
        </div>
        <h2 className="text-[22px] md:text-[28px] font-bold text-[#181135]">Related YouTube Creator Tools</h2>
        <p className="text-[14px] text-[#635B80]">
          Explore complementary free utilities to inspect channel diagnostics, extract tags, calculate earnings, and retrieve creative assets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            id={`related-tool-card-${tool.id}`}
            className="tool-card-3d group p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="w-11 h-11 rounded-[16px] bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center group-hover:border-[#7C3AED] transition-colors shadow-2xs">
                  <ToolIcon name={tool.icon} className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {tool.badge === 'MOST POPULAR' && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold text-white bg-gradient-to-r from-[#7C3AED] to-[#9333EA] rounded-full uppercase tracking-wider shadow-2xs">
                      POPULAR
                    </span>
                  )}
                  {tool.badge === 'POPULAR' && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold text-[#7C3AED] bg-[#F2ECFE] border border-[#DDD0FA] rounded-full uppercase tracking-wider">
                      POPULAR
                    </span>
                  )}
                  {tool.badge === 'NEW' && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full uppercase tracking-wider">
                      NEW
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#7C3AED] bg-[#F4EFFE] rounded-full uppercase tracking-wider border border-[#DDD0FA] whitespace-nowrap shrink-0">
                    <CategoryIcon category={tool.category} className="w-3 h-3 text-[#7C3AED]" />
                    {tool.category}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-[17px] font-bold text-[#181135] group-hover:text-[#7C3AED] transition-colors mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-[13px] text-[#635B80] leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-[#EDE8F9] flex items-center justify-between text-[13px] font-bold text-[#7C3AED] group-hover:text-[#6D28D9] transition-colors">
              <span className="flex items-center gap-1.5">
                Launch Utility
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="text-[11px] text-[#7C3AED] font-bold bg-[#F2ECFE] px-2.5 py-0.5 rounded-full border border-[#DDD0FA]">100% Free</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
