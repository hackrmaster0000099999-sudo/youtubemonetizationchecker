'use client';

import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  showText = true,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('/logo.png');
  const [useSvgFallback, setUseSvgFallback] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {!useSvgFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt="YT MONETIZE Logo"
          width={size}
          height={size}
          className="shrink-0 object-contain"
          onError={() => {
            if (imgSrc === '/logo.png') {
              setImgSrc('/logo.svg');
            } else {
              setUseSvgFallback(true);
            }
          }}
        />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-xs"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logoRedRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1E2F" />
              <stop offset="55%" stopColor="#E50914" />
              <stop offset="100%" stopColor="#A80008" />
            </linearGradient>
            <linearGradient id="logoDarkT" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#30353F" />
              <stop offset="45%" stopColor="#1E2128" />
              <stop offset="100%" stopColor="#121417" />
            </linearGradient>
          </defs>
          <g>
            <path
              d="M 215 118 L 396 118 C 418 118 430 132 422 152 L 406 168 C 398 176 384 182 370 182 L 306 182 L 306 332 C 306 350 292 364 274 364 C 256 364 242 350 242 332 L 242 182 C 242 144 200 134 215 118 Z"
              fill="url(#logoDarkT)"
            />
            <rect x="306" y="176" width="54" height="164" rx="27" fill="url(#logoDarkT)" />
            <path
              d="M 108 124 C 96 124 88 132 94 146 L 194 330 C 204 350 226 358 240 344 C 252 332 250 310 238 288 L 164 150 C 156 134 144 124 124 124 Z"
              fill="url(#logoRedRibbon)"
            />
          </g>
        </svg>
      )}

      {showText && (
        <div className="flex items-baseline tracking-tight font-black font-sans">
          <span className="text-[19px] text-[#181135]">YT</span>
          <span className="text-[19px] text-[#7C3AED] ml-1">MONETIZE</span>
        </div>
      )}
    </div>
  );
};
