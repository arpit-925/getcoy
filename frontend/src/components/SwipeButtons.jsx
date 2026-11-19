import React from 'react';
import { X, Heart } from 'lucide-react';

const SwipeButtons = ({ onPass, onLike, disabled = false }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-6 sm:gap-8">
        {/* Pass Button */}
        <button
          onClick={onPass}
          disabled={disabled}
          type="button"
          aria-label="Pass profile (Left Arrow: Not this time)"
          className={`group flex items-center gap-2 min-w-[44px] min-h-[44px] px-5 py-2.5 rounded-full bg-white border border-coy-border text-coy-muted text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coy-border ${
            disabled
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:text-coy-ink hover:border-coy-ink/30 active:scale-95'
          }`}
        >
          <X className="w-4 h-4 stroke-[2] transition-transform group-hover:-rotate-90" />
          <span>Not this time</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded text-[10px] bg-coy-surface border border-coy-border text-coy-muted">
            ←
          </kbd>
        </button>

        {/* Like Button */}
        <button
          onClick={onLike}
          disabled={disabled}
          type="button"
          aria-label="Like profile (Right Arrow: Maybe...)"
          className={`group flex items-center gap-2 min-w-[44px] min-h-[44px] px-6 py-2.5 rounded-full bg-coy-accent hover:bg-coy-accent-hover text-white text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coy-accent ${
            disabled
              ? 'opacity-50 cursor-not-allowed' // Slightly higher opacity for readability when disabled
              : 'active:scale-95 hover:scale-105'
          }`}
        >
          <Heart className="w-4 h-4 stroke-[2] fill-current transition-transform group-hover:scale-110" />
          <span>Maybe...</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white">
            →
          </kbd>
        </button>
      </div>
    </div>
  );
};

export default SwipeButtons;
