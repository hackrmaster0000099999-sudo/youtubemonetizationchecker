import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RELATED_TOOLS_MAP, TOOLS, ToolItem } from '@/lib/constants/site';

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
    <section id="related-tools-section" className="mt-16 pt-12 border-t border-[#E8E7E3]">
      <div className="space-y-2 mb-6">
        <h2 className="text-[22px] md:text-[28px] font-semibold text-[#16181C]">Related YouTube Creator Tools</h2>
        <p className="text-[14px] text-[#5B6169]">
          Explore complementary free utilities to inspect channel diagnostics, extract tags, calculate earnings, and retrieve creative assets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            id={`related-tool-card-${tool.id}`}
            className="group block p-5 bg-white border border-[#E8E7E3] hover:border-[#16181C] active:bg-[#F7F6F3] active:scale-[0.985] transition-all duration-150 rounded-none cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#5B6169] uppercase tracking-wider">
                {tool.category}
              </span>
              <ArrowRight className="w-4 h-4 text-[#5B6169] group-hover:text-[#D6293C] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-[16px] font-semibold text-[#16181C] group-hover:text-[#D6293C] transition-colors mb-1.5">
              {tool.name}
            </h3>
            <p className="text-[13px] text-[#5B6169] leading-relaxed line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
