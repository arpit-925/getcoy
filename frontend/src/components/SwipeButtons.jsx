import React from 'react';
import { X, Heart } from 'lucide-react';

const SwipeButtons = ({ onPass, onLike, disabled = false }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-8 sm:gap-12">
        {/* Pass Button */}
        <button
          onClick={onPass}
          disabled={disabled}
          type="button"
          aria-label="Pass profile (Left Arrow)"
          className={`group relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border border-coy-border text-coy-muted shadow-md transition-all duration-200 transform ${
            disabled
              ? 'opacity-40 cursor-not-allowed scale-95'
              : 'hover:scale-110 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 hover:shadow-lg active:scale-95'
          }`}
        >
          <X className="w-8 h-8 transition-transform group-hover:rotate-12 stroke-[2.5]" />
          <span className="sr-only">Pass</span>
        </button>

        {/* Like Button */}
        <button
          onClick={onLike}
          disabled={disabled}
          type="button"
          aria-label="Like profile (Right Arrow)"
          className={`group relative flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white border border-coy-pink/30 text-coy-pink shadow-coy-pink transition-all duration-200 transform ${
            disabled
              ? 'opacity-40 cursor-not-allowed scale-95'
              : 'hover:scale-110 hover:bg-coy-pink hover:text-white hover:border-coy-pink hover:shadow-coy-pink active:scale-95'
          }`}
        >
          <Heart className="w-9 h-9 fill-coy-pink group-hover:fill-white stroke-[2] transition-transform group-hover:scale-110" />
          <span className="sr-only">Like</span>
        </button>
      </div>

      {/* Keyboard Shortcut Hints for Desktop */}
      <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-coy-muted/80 tracking-wide select-none">
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-coy-border shadow-xs text-xs">←</kbd> Pass
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-coy-border shadow-xs text-xs">→</kbd> Like
        </span>
      </div>
    </div>
  );
};

export default SwipeButtons;

