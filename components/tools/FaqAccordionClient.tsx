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
          <h2 className="text-[20px] font-semibold text-[#16181C] border-b border-[#E8E7E3] pb-2">
            {cat.category}
          </h2>

          <div className="divide-y divide-[#E8E7E3] border border-[#E8E7E3] bg-white">
            {cat.items.map((item, itemIdx) => {
              const key = `${cat.category}-${itemIdx}`;
              const isOpen = Boolean(openItems[key]);

              return (
                <div key={itemIdx} className="p-5">
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="w-full text-left flex items-center justify-between gap-4 text-[15px] md:text-[16px] font-semibold text-[#16181C] hover:text-[#D6293C] active:scale-[0.99] transition-all cursor-pointer select-none"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5B6169] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#D6293C]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-3 text-[14px] text-[#5B6169] leading-relaxed animate-in fade-in-50 duration-150">
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
