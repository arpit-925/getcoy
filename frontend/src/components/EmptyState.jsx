import React from 'react';
import { Sparkles, RefreshCw, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = "You're All Caught Up!",
  description = "You've discovered everyone in your area for now. Check back soon for new profiles, or revisit your mutual matches.",
  actionText = "Check Your Matches",
  actionLink = "/matches",
  onReset = null,
  resetText = "Reset Demo Feed",
}) => {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.2] sm:aspect-[3/4.5] max-h-[640px] rounded-3xl bg-white border border-coy-border shadow-coy-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-coy-pink-soft rounded-full filter blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-coy-subtle rounded-full filter blur-3xl opacity-70 pointer-events-none" />

      {/* Floating icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-coy-pink/10 to-coy-pink/20 flex items-center justify-center text-coy-pink shadow-inner border border-coy-pink/20">
          <Icon className="w-10 h-10 animate-bounce duration-1000" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-coy-pink text-white flex items-center justify-center shadow-md">
          <Heart className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-coy-text mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-coy-muted max-w-xs mb-8 leading-relaxed">
        {description}
      </p>

      <div className="w-full space-y-3 z-10">
        {actionLink ? (
          <Link
            to={actionLink}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-coy-pink hover:bg-coy-pink-hover text-white font-semibold shadow-coy-pink transition-all transform active:scale-95"
          >
            <Heart className="w-4 h-4 fill-current" />
            {actionText}
          </Link>
        ) : null}

        {onReset && (
          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-coy-bg hover:bg-coy-subtle text-coy-text font-medium border border-coy-border transition-all transform active:scale-95 text-xs sm:text-sm"
          >
            <RefreshCw className="w-4 h-4 text-coy-muted" />
            {resetText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

