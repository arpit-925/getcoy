import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.2] sm:aspect-[3/4.5] max-h-[640px] rounded-3xl bg-white border border-coy-border/80 shadow-coy-card overflow-hidden flex flex-col justify-end p-6 relative animate-pulse">
      {/* Top simulated avatar or photo area shimmer */}
      <div className="absolute inset-0 bg-gradient-to-b from-coy-subtle/40 via-coy-subtle/60 to-coy-subtle/90" />

      {/* Content skeleton */}
      <div className="relative z-10 space-y-4">
        {/* Name and age bar */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-44 bg-coy-border rounded-lg" />
          <div className="h-6 w-12 bg-coy-border/70 rounded-full" />
        </div>

        {/* Location / College bar */}
        <div className="h-4 w-52 bg-coy-border/60 rounded" />

        {/* Bio skeleton lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3.5 w-full bg-coy-border/60 rounded" />
          <div className="h-3.5 w-4/5 bg-coy-border/50 rounded" />
        </div>

        {/* Interest tags skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 bg-coy-border/60 rounded-full" />
          <div className="h-7 w-24 bg-coy-border/60 rounded-full" />
          <div className="h-7 w-16 bg-coy-border/60 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;

