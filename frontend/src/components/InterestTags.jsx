import React from 'react';

const InterestTags = ({ interests = [], limit }) => {
  if (!interests || interests.length === 0) return null;

  const displayList = limit ? interests.slice(0, limit) : interests;
  const remainingCount = limit && interests.length > limit ? interests.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {displayList.map((interest, idx) => (
        <span
          key={idx}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-coy-text backdrop-blur-sm border border-coy-border/60 shadow-sm transition-transform hover:scale-105"
        >
          {interest}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-coy-pink-soft text-coy-pink border border-coy-pink/20">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default InterestTags;

