import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ToolErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ToolError({ title = 'Error', message, onRetry }: ToolErrorProps) {
  return (
    <div
      id="tool-error-state"
      className="p-6 my-6 bg-white border border-[#E8E7E3] space-y-3"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#D6293C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-[15px] font-semibold text-[#16181C]">{title}</div>
          <div className="text-[14px] text-[#5B6169] leading-relaxed">{message}</div>
        </div>
      </div>

      {onRetry && (
        <div className="pt-2">
          <button
            id="tool-retry-btn"
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-[#16181C] bg-white border border-[#E8E7E3] hover:border-[#5B6169] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5B6169]" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
