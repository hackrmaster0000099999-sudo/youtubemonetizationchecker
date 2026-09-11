import React from 'react';
import { Loader2 } from 'lucide-react';

interface ToolLoadingProps {
  message?: string;
}

export function ToolLoading({ message = 'Checking...' }: ToolLoadingProps) {
  return (
    <div
      id="tool-loading-state"
      className="p-8 my-6 bg-white border border-[#EDE8F9] rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shadow-xs"
    >
      <Loader2 className="w-6 h-6 text-[#7C3AED] animate-spin" />
      <div className="text-[15px] font-bold text-[#181135]">{message}</div>
      <div className="text-[13px] text-[#635B80]">Analyzing public signals and retrieving metadata...</div>
    </div>
  );
}
