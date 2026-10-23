import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1.5' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px] px-2' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-xs px-2.5' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', badge: 'text-xs px-3' },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 3D Woven Ribbon Mark */}
      <div className={`relative ${sizeMap[size].icon} flex-shrink-0 group cursor-pointer`}>
        <div className="absolute inset-0 bg-indigo/30 rounded-xl blur-md group-hover:bg-indigo/50 transition-all duration-300" />
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 transform group-hover:scale-105 transition-transform duration-300"
        >
          <defs>
            <linearGradient id="loomGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#635BFF" />
              <stop offset="100%" stopColor="#A99BFF" />
            </linearGradient>
            <linearGradient id="loomGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#635BFF" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Loom Ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#loomGrad1)"
            strokeWidth="6"
            strokeDasharray="180 30"
            className="animate-spin"
            style={{ animationDuration: '24s' }}
          />

          {/* Intersecting Dimensional Ribbons */}
          <path
            d="M26 50 C26 32, 50 24, 74 50 C74 68, 50 76, 26 50 Z"
            fill="none"
            stroke="url(#loomGrad1)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M50 26 C68 26, 76 50, 50 74 C32 74, 24 50, 50 26 Z"
            fill="none"
            stroke="#F5F6FF"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Central Luminous Core Node */}
          <circle cx="50" cy="50" r="8" fill="#635BFF" filter="url(#glow)" />
          <circle cx="50" cy="50" r="4" fill="#F5F6FF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-display font-bold tracking-tight text-white ${sizeMap[size].text}`}>
              INKLOOM<span className="text-lavender ml-1 font-mono text-[0.8em]">AI</span>
            </span>
            <span
              className={`rounded-full bg-indigo-subtle border border-indigo/40 text-electric-lavender font-mono font-medium tracking-wide uppercase ${sizeMap[size].badge} text-lavender`}
            >
              ASTRA3
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted tracking-widest uppercase -mt-0.5">
            Brand Governance Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
