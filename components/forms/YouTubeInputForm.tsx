'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface YouTubeInputFormProps {
  initialValue?: string;
  buttonText?: string;
  placeholder?: string;
  loadingText?: string;
  onSubmit: (input: string) => Promise<void> | void;
  isLoading?: boolean;
  id?: string;
}

export function YouTubeInputForm({
  initialValue = '',
  buttonText = 'Check Now',
  placeholder = 'Paste YouTube channel or video URL (e.g. youtube.com/@handle)',
  loadingText = 'Checking...',
  onSubmit,
  isLoading = false,
  id = 'youtube-input-form',
}: YouTubeInputFormProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <label htmlFor={`${id}-input`} className="sr-only">
            YouTube channel or video URL
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B6169]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id={`${id}-input`}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-10 pr-9 py-3 text-[15px] text-[#16181C] bg-white border border-[#E8E7E3] placeholder-[#5B6169] focus:outline-none focus:border-[#16181C] disabled:bg-[#FCFCFB] transition-colors"
          />
          {value && !isLoading && (
            <button
              type="button"
              onClick={() => setValue('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5B6169] hover:text-[#16181C] active:scale-90 transition-transform"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id={`${id}-submit-btn`}
          type="submit"
          disabled={isLoading || !value.trim()}
          className="btn-interactive px-7 py-3 text-[15px] font-semibold text-white bg-[#D6293C] hover:bg-[#B8202F] active:bg-[#9E1423] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 transition-all flex items-center justify-center gap-2"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          <span>{isLoading ? loadingText : buttonText}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[12px] text-[#5B6169] flex-wrap">
        <span className="font-medium">Supported formats:</span>
        <span className="bg-white border border-[#E8E7E3] px-2 py-0.5 font-mono-data text-[11px]">@handle</span>
        <span className="bg-white border border-[#E8E7E3] px-2 py-0.5 font-mono-data text-[11px]">youtube.com/watch?v=...</span>
        <span className="bg-white border border-[#E8E7E3] px-2 py-0.5 font-mono-data text-[11px]">channel/UC...</span>
        <span className="bg-white border border-[#E8E7E3] px-2 py-0.5 font-mono-data text-[11px]">youtu.be/...</span>
      </div>
    </form>
  );
}
