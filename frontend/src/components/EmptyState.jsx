import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

const EmptyState = ({ onReset = null }) => {
  return (
    <div className="w-full max-w-[340px] sm:max-w-[370px] h-[450px] sm:h-[490px] mx-auto rounded-[20px] bg-white border border-[#E5DFD5] shadow-card-soft p-6 flex flex-col items-center justify-center text-center">
      {/* Handcrafted minimalist SVG illustration: empty bench & fallen leaf */}
      <div className="w-24 h-24 mb-4 text-coy-muted/60 flex items-center justify-center">
        <svg
          viewBox="0 0 80 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-20 h-20 text-coy-muted/70"
        >
          {/* Minimalist bench outline */}
          <line x1="16" y1="52" x2="64" y2="52" />
          <line x1="20" y1="44" x2="60" y2="44" />
          <line x1="24" y1="44" x2="24" y2="60" />
          <line x1="56" y1="44" x2="56" y2="60" />
          <path d="M22 36 C22 36, 28 32, 40 32 C52 32, 58 36, 58 36" />
          <circle cx="40" cy="22" r="3" strokeWidth="1.25" fill="#FAF6F0" />
        </svg>
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-medium text-coy-ink mb-1.5 tracking-tight">
        Nobody left to judge.
      </h3>

      <p className="text-xs text-coy-muted max-w-[240px] mb-6 leading-relaxed">
        You've seen everyone for now. Check back soon or see who matched.
      </p>

      <div className="w-full space-y-2 max-w-[220px]">
        <Link
          to="/matches"
          className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full bg-coy-accent hover:bg-coy-accent-hover text-white text-xs font-medium transition-colors"
        >
          View matches
        </Link>

        {onReset && (
          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-coy-surface hover:bg-coy-border text-coy-muted hover:text-coy-ink text-[11px] font-normal transition-colors"
          >
            <RefreshCw className="w-3 h-3 stroke-[1.5]" />
            Reset demo feed
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
