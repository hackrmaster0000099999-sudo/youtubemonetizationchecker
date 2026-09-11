'use client';

import React, { useState, useRef } from 'react';
import { Search, X, ClipboardPaste, Check, Sparkles, ArrowRight } from 'lucide-react';

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
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const [pastedFeedback, setPastedFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setValue(initialValue);
  }

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setValue(text.trim());
          setPastedFeedback(true);
          setTimeout(() => setPastedFeedback(false), 2000);
          inputRef.current?.focus();
        }
      } else {
        inputRef.current?.focus();
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="w-full space-y-3.5">
      {/* 3D Elevated Input Bar - Ultra Clean Liquid Glass */}
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 sm:p-2 bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white shadow-[0_16px_36px_-8px_rgba(124,58,237,0.08),0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] transition-all focus-within:border-[#DDD0FA] focus-within:ring-4 focus-within:ring-[#7C3AED]/10">
        <div className="relative flex-1 flex items-center min-w-0">
          <label htmlFor={`${id}-input`} className="sr-only">
            YouTube channel or video URL
          </label>
          <div className="pl-3.5 sm:pl-4 flex items-center pointer-events-none text-[#7C3AED] shrink-0">
            <Search className="w-5 h-5 opacity-85" />
          </div>

          <input
            ref={inputRef}
            id={`${id}-input`}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-3 pr-20 sm:pr-24 py-3 sm:py-3.5 text-[15px] sm:text-[16px] text-[#181135] bg-transparent placeholder-[#8F87A3] focus:outline-none disabled:opacity-60 font-medium"
          />

          {/* Right Action Icons inside input (Clear & Paste) */}
          <div className="absolute right-2 flex items-center gap-1 shrink-0">
            {value && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setValue('');
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-[#8F87A3] hover:text-[#181135] hover:bg-[#F3EEFE] rounded-lg transition-colors cursor-pointer"
                title="Clear input"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Quick One-Click Paste Button */}
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              disabled={isLoading}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-semibold rounded-xl transition-colors cursor-pointer ${
                pastedFeedback
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                  : 'bg-[#F3EEFE] hover:bg-[#EAE1FC] text-[#7C3AED] border border-[#DDD0FA] hover:border-[#CBB9F7]'
              }`}
              title="Paste link from clipboard"
              aria-label="Paste from clipboard"
            >
              {pastedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Pasted</span>
                </>
              ) : (
                <>
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Paste</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3D Primary Action Button (SiamPay Style with Sheen) */}
        <button
          id={`${id}-submit-btn`}
          type="submit"
          disabled={isLoading || !value.trim()}
          className="btn-siampay-primary px-7 py-3 sm:py-3.5 text-[15px] sm:text-[16px] font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center justify-center gap-2 select-none shadow-md"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>{loadingText}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
