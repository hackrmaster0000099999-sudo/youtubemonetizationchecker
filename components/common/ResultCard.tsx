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
      ? 'bg-[rgba(16,185,129,0.12)] text-[#10B981]'
      : statusType === 'caution'
      ? 'bg-[rgba(245,158,11,0.12)] text-[#D97706]'
      : 'bg-[#F2ECFE] text-[#635B80]';

  return (
    <div id={id} className="p-5 sm:p-7 bg-white border border-[#EDE8F9] rounded-2xl shadow-xs space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EDE8F9]">
        <div className="flex items-center gap-3.5 min-w-0">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={title}
              className="w-14 h-14 rounded-full object-cover border border-[#EDE8F9] shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-[18px] sm:text-[22px] font-bold text-[#181135] leading-snug break-words">
              {title}
            </h2>
            {subtitle && <div className="text-[13px] text-[#635B80] break-all">{subtitle}</div>}
          </div>
        </div>

        {status && (
          <div className="shrink-0">
            <span
              id="result-status-badge"
              className={`inline-block px-3.5 py-1.5 text-[12px] font-bold rounded-xl tracking-wide whitespace-nowrap shrink-0 ${badgeClass}`}
            >
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Description / Summary */}
      {description && (
        <div className="text-[13px] text-[#181135] leading-relaxed bg-[#F8F5FE] p-4 rounded-xl border border-[#EDE8F9] break-words">
          {description}
        </div>
      )}

      {/* Data Rows */}
      {dataRows.length > 0 && (
        <div className="divide-y divide-[#EDE8F9]">
          {dataRows.map((row, idx) => (
            <div
              key={idx}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4"
            >
              <span className="text-[13px] text-[#635B80] shrink-0">{row.label}</span>
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-[14px] font-semibold text-[#181135] break-all ${
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
        <div className="pt-4 border-t border-[#EDE8F9] flex flex-wrap gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
}
