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
    <div className="tool-card-3d overflow-hidden divide-y divide-[#EDE8F9]">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="p-5">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full text-left flex items-center justify-between gap-4 text-[15px] md:text-[16px] font-bold text-[#181135] hover:text-[#7C3AED] transition-colors cursor-pointer select-none"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#635B80] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#7C3AED]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="pt-3 text-[14px] text-[#635B80] leading-relaxed animate-in fade-in-50 duration-150">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
