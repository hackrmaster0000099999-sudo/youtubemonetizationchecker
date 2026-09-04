import React from 'react';
import { Loader2 } from 'lucide-react';

interface ToolLoadingProps {
  message?: string;
}

export function ToolLoading({ message = 'Checking...' }: ToolLoadingProps) {
  return (
    <div
      id="tool-loading-state"
      className="p-8 my-6 bg-white border border-[#E8E7E3] flex flex-col items-center justify-center text-center space-y-3"
    >
      <Loader2 className="w-6 h-6 text-[#D6293C] animate-spin" />
      <div className="text-[15px] font-medium text-[#16181C]">{message}</div>
      <div className="text-[13px] text-[#5B6169]">Analyzing public signals and retrieving metadata...</div>
    </div>
  );
}
