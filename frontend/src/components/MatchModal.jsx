import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DEMO_USER } from '../services/api';

const MatchModal = ({ match, onClose }) => {
  const navigate = useNavigate();

  if (!match) return null;

  // Handles both { profile: { ... } } and direct profile object { name, photo, ... }
  const matchedProfile = match.profile || match;

  if (!matchedProfile || !matchedProfile.name) return null;

  const handleGoToMatches = () => {
    onClose();
    navigate('/matches');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Soft, neutral backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1A1715]/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-[360px] bg-coy-bg rounded-[20px] p-6 sm:p-7 border border-coy-border shadow-xl text-center z-10"
        >
          {/* Overlapping Profile Photos with slight rotation */}
          <div className="flex items-center justify-center -space-x-4 my-4">
            {/* User photo */}
            <div className="w-24 h-28 rounded-[16px] overflow-hidden border-2 border-white shadow-md transform -rotate-6 bg-coy-surface">
              <img
                src={DEMO_USER.photo}
                alt={DEMO_USER.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Matched profile photo */}
            <div className="w-24 h-28 rounded-[16px] overflow-hidden border-2 border-white shadow-md transform rotate-6 bg-coy-surface z-10">
              <img
                src={matchedProfile.photo}
                alt={matchedProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Microcopy with authentic voice */}
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-coy-ink mt-3 mb-1">
            You two. Finally.
          </h2>

          <p className="text-xs text-coy-muted mb-6 leading-relaxed">
            You and <span className="text-coy-ink font-medium">{matchedProfile.name}</span> secretly liked each other.
          </p>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleGoToMatches}
              className="w-full py-2.5 px-5 rounded-full bg-coy-accent hover:bg-coy-accent-hover text-white text-xs font-medium transition-colors"
            >
              View matches
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-5 rounded-full bg-white hover:bg-coy-surface text-coy-ink text-xs font-medium border border-coy-border transition-colors"
            >
              Keep swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MatchModal;
