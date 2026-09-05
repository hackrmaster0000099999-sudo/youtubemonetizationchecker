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
    <section id="related-tools-section" className="mt-16 pt-12 border-t border-[#E3E2DE]">
      <div className="space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3E2DE] text-[11px] font-bold text-[#5B6169] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#D6293C]" />
          <span>Recommended Utilities</span>
        </div>
        <h2 className="text-[22px] md:text-[28px] font-bold text-[#16181C]">Related YouTube Creator Tools</h2>
        <p className="text-[14px] text-[#5B6169]">
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
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F9F9F8] border border-[#E3E2DE] flex items-center justify-center text-[#16181C] group-hover:border-[#16181C] group-hover:bg-white group-hover:scale-105 transition-all shadow-2xs">
                  <ToolIcon name={tool.icon} className="w-5 h-5 text-inherit" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#5B6169] bg-[#F9F9F8] rounded-full uppercase tracking-wider border border-[#E3E2DE] whitespace-nowrap shrink-0">
                  <CategoryIcon category={tool.category} className="w-3 h-3" />
                  {tool.category}
                </span>
              </div>

              <div>
                <h3 className="text-[17px] font-bold text-[#16181C] group-hover:text-[#D6293C] transition-colors mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-[13px] text-[#5B6169] leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-[#F0EFEB] flex items-center justify-between text-[13px] font-bold text-[#16181C] group-hover:text-[#D6293C] transition-colors">
              <span className="flex items-center gap-1.5">
                Launch Utility
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="text-[11px] text-[#5B6169] font-semibold bg-[#F9F9F8] px-2 py-0.5 rounded-md border border-[#E3E2DE]">100% Free</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
