import React from 'react';
import { CopyButton } from './CopyButton';

export interface DataRow {
  label: string;
  value: string | number | null | undefined;
  copyable?: boolean;
  copyValue?: string;
  isMono?: boolean;
}

interface ResultCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  status?: string;
  statusType?: 'positive' | 'caution' | 'neutral';
  description?: string;
  dataRows?: DataRow[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function ResultCard({
  id = 'result-card',
  title,
  subtitle,
  avatarUrl,
  status,
  statusType = 'positive',
  description,
  dataRows = [],
  actions,
  children,
}: ResultCardProps) {
  const badgeClass =
    statusType === 'positive'
      ? 'bg-[rgba(30,158,107,0.12)] text-[#1E9E6B]'
      : statusType === 'caution'
      ? 'bg-[rgba(199,124,17,0.12)] text-[#C77C11]'
      : 'bg-[#F2F1EE] text-[#5B6169]';

  return (
    <div id={id} className="p-6 md:p-8 bg-white border border-[#E8E7E3] space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E7E3]">
        <div className="flex items-center gap-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={title}
              className="w-16 h-16 rounded-full object-cover border border-[#E8E7E3] shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="space-y-1">
            <h2 className="text-[20px] md:text-[22px] font-semibold text-[#16181C] leading-snug">
              {title}
            </h2>
            {subtitle && <div className="text-[14px] text-[#5B6169]">{subtitle}</div>}
          </div>
        </div>

        {status && (
          <div className="shrink-0">
            <span
              id="result-status-badge"
              className={`inline-block px-3 py-1.5 text-[13px] font-medium tracking-wide ${badgeClass}`}
            >
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Description / Summary */}
      {description && (
        <div className="text-[14px] text-[#5B6169] leading-relaxed bg-[#FCFCFB] p-4 border border-[#E8E7E3]">
          {description}
        </div>
      )}

      {/* Data Rows */}
      {dataRows.length > 0 && (
        <div className="divide-y divide-[#E8E7E3]">
          {dataRows.map((row, idx) => (
            <div
              key={idx}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
            >
              <span className="text-[14px] text-[#5B6169]">{row.label}</span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[15px] font-medium text-[#16181C] ${
                    row.isMono ? 'font-mono-data' : ''
                  }`}
                >
                  {row.value ?? 'Not publicly available'}
                </span>
                {row.copyable && row.value && (
                  <CopyButton
                    textToCopy={row.copyValue || String(row.value)}
                    label="Copy"
                    id={`copy-row-${idx}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional children content */}
      {children}

      {/* Action buttons */}
      {actions && (
        <div className="pt-4 border-t border-[#E8E7E3] flex flex-wrap gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
