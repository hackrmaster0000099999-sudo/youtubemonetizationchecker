'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  id?: string;
}

export function CopyButton({ textToCopy, label = 'Copy', className = '', id }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-semibold border rounded-xl transition-all duration-150 cursor-pointer select-none ${
        copied
          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981] shadow-xs'
          : 'bg-white/80 border-[#DDD0FA] text-[#181135] hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-white'
      } ${className}`}
      aria-label={copied ? 'Copied to clipboard' : label}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#10B981] animate-in zoom-in-75 duration-150" />
          <span className="font-semibold text-[#10B981]">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
