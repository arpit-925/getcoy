import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-[340px] sm:max-w-[370px] h-[450px] sm:h-[490px] mx-auto rounded-[20px] bg-white border border-[#E5DFD5] shadow-card-soft p-5 flex flex-col justify-end relative overflow-hidden animate-pulse">
      <div className="space-y-3 relative z-10">
        <div className="h-6 w-36 bg-coy-surface rounded-md" />
        <div className="h-3.5 w-44 bg-coy-surface rounded-md" />
        <div className="h-3 w-full bg-coy-surface rounded-md" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-16 bg-coy-surface rounded-[8px]" />
          <div className="h-5 w-20 bg-coy-surface rounded-[8px]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
