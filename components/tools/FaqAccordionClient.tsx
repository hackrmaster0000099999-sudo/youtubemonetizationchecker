'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQCategory {
  category: string;
  items: { q: string; a: string }[];
}

export function FaqAccordionClient({ data }: { data: FAQCategory[] }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'Monetization & Partner Program-0': true,
    'Using Creator Tools-0': true,
  });

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10">
      {data.map((cat, catIdx) => (
        <div key={catIdx} className="space-y-4">
          <h2 className="text-[20px] font-bold text-[#181135] border-b border-[#EDE8F9] pb-2">
            {cat.category}
          </h2>

          <div className="tool-card-3d overflow-hidden divide-y divide-[#EDE8F9]">
            {cat.items.map((item, itemIdx) => {
              const key = `${cat.category}-${itemIdx}`;
              const isOpen = Boolean(openItems[key]);

              return (
                <div key={itemIdx} className="p-5">
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="w-full text-left flex items-center justify-between gap-4 text-[15px] md:text-[16px] font-bold text-[#181135] hover:text-[#7C3AED] transition-colors cursor-pointer select-none"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#635B80] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#7C3AED]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-3 text-[14px] text-[#635B80] leading-relaxed animate-in fade-in-50 duration-150">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
