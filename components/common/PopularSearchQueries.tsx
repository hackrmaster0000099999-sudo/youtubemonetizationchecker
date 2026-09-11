import React from 'react';
import { Search } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface PopularQueriesProps {
  mainKeyword: string;
  searchQueries: string[];
  faqs?: FaqItem[];
}

export function PopularSearchQueries({
  mainKeyword,
  searchQueries,
}: PopularQueriesProps) {
  if (!searchQueries || searchQueries.length === 0) return null;

  return (
    <section className="space-y-4 pt-6 border-t border-[#EDE8F9]">
      <div className="space-y-1">
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#181135] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#7C3AED]" />
          <span>Popular Search Queries for {mainKeyword}</span>
        </h2>
        <p className="text-[14px] text-[#635B80]">
          Frequently searched topics and creator questions related to this tool:
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {searchQueries.map((query, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-[#EDE8F9] text-[12.5px] font-medium text-[#4A4165] hover:border-[#7C3AED]/30 hover:text-[#7C3AED] transition-colors shadow-2xs"
          >
            <span className="text-[#7C3AED] font-bold">#</span>
            {query}
          </span>
        ))}
      </div>
    </section>
  );
}
