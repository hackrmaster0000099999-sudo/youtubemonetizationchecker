import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      id="breadcrumb-nav"
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-[13px] text-[#635B80] mb-6 flex-wrap"
    >
      <Link href="/" className="hover:text-[#7C3AED] transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-[#635B80] shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#7C3AED] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#181135] font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
