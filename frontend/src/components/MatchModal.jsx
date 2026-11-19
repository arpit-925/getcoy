import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircleHeart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { DEMO_USER } from '../services/api';

const MatchModal = ({ match, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (match) {
      // Fire festive celebration confetti burst!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F53683', '#FFA8CC', '#FFFFFF', '#FFD166'],
        });
      } catch (err) {
        // Fallback gracefully if confetti fails
      }
    }
  }, [match]);

  if (!match) return null;

  const matchedProfile = match.profile;

  const handleGoToMatches = () => {
    onClose();
    navigate('/matches');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-coy-pink/20 text-center overflow-hidden z-10"
        >
          {/* Decorative glowing gradient backdrop */}
          <div className="absolute -top-16 -left-16 w-44 h-44 bg-coy-pink/20 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-coy-pink-soft rounded-full filter blur-3xl pointer-events-none" />

          {/* Celebration Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coy-pink-soft text-coy-pink text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Mutual Attraction
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-coy-pink via-pink-600 to-rose-500 tracking-tight mb-2">
            It's a Match!
          </h2>

          <p className="text-sm text-coy-muted mb-6">
            You and <span className="font-semibold text-coy-text">{matchedProfile.name}</span> secretly liked each other!
          </p>

          {/* Dual Avatars with Connected Heart */}
          <div className="flex items-center justify-center -space-x-4 mb-8 relative">
            {/* Demo User Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-coy-subtle">
                <img
                  src={DEMO_USER.photo}
                  alt={DEMO_USER.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-white/95 text-coy-text px-2 py-0.5 rounded-full border border-coy-border shadow-xs">
                You
              </span>
            </div>

            {/* Glowing Heart Bridge */}
            <div className="z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-coy-pink to-rose-400 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            {/* Matched Profile Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-coy-subtle">
                <img
                  src={matchedProfile.photo}
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-white/95 text-coy-text px-2 py-0.5 rounded-full border border-coy-border shadow-xs truncate max-w-[80px]">
                {matchedProfile.name}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <button
              onClick={handleGoToMatches}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-coy-pink hover:bg-coy-pink-hover text-white font-semibold text-sm shadow-coy-pink transition-all transform active:scale-95"
            >
              <MessageCircleHeart className="w-4 h-4" />
              View in Matches
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center py-3 px-6 rounded-full bg-coy-bg hover:bg-coy-subtle text-coy-text font-medium text-sm border border-coy-border transition-all transform active:scale-95"
            >
              Continue Discovering
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MatchModal;

