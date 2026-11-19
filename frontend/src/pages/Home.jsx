import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
      {/* Intentionally minimal placeholder page as required by assignment specification */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-coy-pink to-rose-400 flex items-center justify-center text-white shadow-coy-pink mb-6">
        <Heart className="w-8 h-8 fill-current" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coy-pink-soft text-coy-pink text-xs font-semibold uppercase tracking-wider mb-3">
        <Sparkles className="w-3.5 h-3.5 fill-current" />
        Anonymous Crush Discovery
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-coy-text tracking-tight mb-3">
        Welcome to <span className="text-coy-pink">Coy</span>
      </h1>

      <p className="text-sm sm:text-base text-coy-muted mb-8 leading-relaxed max-w-md">
        Express interest in people while keeping your identity private. 
        Your crush is only revealed when the feeling is completely mutual.
      </p>

      {/* Primary CTA to start discovery */}
      <Link
        to="/discover"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-coy-pink hover:bg-coy-pink-hover text-white font-semibold text-sm sm:text-base shadow-coy-pink transition-all transform active:scale-95"
      >
        <Compass className="w-5 h-5" />
        Start Discovering
      </Link>

      <div className="mt-12 pt-8 border-t border-coy-border/60 flex items-center justify-center gap-2 text-xs text-coy-muted">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Privacy Protected • Mutual Matches Only</span>
      </div>
    </div>
  );
};

export default Home;

