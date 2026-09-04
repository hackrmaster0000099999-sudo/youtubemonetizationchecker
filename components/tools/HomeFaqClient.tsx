'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export function HomeFaqClient({ faqs }: { faqs: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-[#E8E7E3] border border-[#E8E7E3] bg-white">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="p-5">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full text-left flex items-center justify-between gap-4 text-[15px] md:text-[16px] font-semibold text-[#16181C] hover:text-[#D6293C] active:scale-[0.99] transition-all cursor-pointer select-none"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#5B6169] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#D6293C]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="pt-3 text-[14px] text-[#5B6169] leading-relaxed animate-in fade-in-50 duration-150">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
