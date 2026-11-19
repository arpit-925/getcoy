import React from 'react';

const InterestTags = ({ interests = [], limit, variant = 'light' }) => {
  if (!interests || interests.length === 0) return null;

  const displayList = limit ? interests.slice(0, limit) : interests;
  const remainingCount = limit && interests.length > limit ? interests.length - limit : 0;

  // On dark photo overlay: clean white/translucent outline chips
  // In light modals/detail: neutral warm-ink outline chips
  const isOverlay = variant === 'overlay';

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {displayList.map((interest, idx) => (
        <span
          key={idx}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-[11px] font-normal tracking-wide transition-colors ${
            isOverlay
              ? 'border border-white/25 text-white/90 bg-black/20 backdrop-blur-xs'
              : 'border border-coy-border text-coy-ink bg-transparent'
          }`}
        >
          {interest}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[8px] text-[11px] font-normal ${
            isOverlay
              ? 'border border-white/25 text-white/75 bg-black/20'
              : 'border border-coy-border text-coy-muted bg-transparent'
          }`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default InterestTags;
