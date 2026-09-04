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
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border active:scale-95 transition-all duration-150 cursor-pointer select-none ${
        copied
          ? 'bg-[#E8F8F0] border-[#1E9E6B] text-[#1E9E6B] shadow-xs'
          : 'bg-white border-[#E8E7E3] text-[#16181C] hover:border-[#16181C] hover:bg-[#FCFCFB] active:bg-[#F2F1EE]'
      } ${className}`}
      aria-label={copied ? 'Copied to clipboard' : label}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#1E9E6B] animate-in zoom-in-75 duration-150" />
          <span className="font-semibold">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-[#5B6169]" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
