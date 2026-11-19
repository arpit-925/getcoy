import React, { useEffect, useCallback, useState, useRef } from 'react';
import useFeed from '../hooks/useFeed';
import ProfileCard from '../components/ProfileCard';
import SwipeButtons from '../components/SwipeButtons';
import MatchModal from '../components/MatchModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { AlertCircle, RefreshCw, X, RotateCcw } from 'lucide-react';

const Discover = ({ onMatchCreated }) => {
  const {
    currentProfile,
    secondProfile,
    thirdProfile,
    hasMore,
    loading,
    error,
    toastNotification,
    currentMatch,
    handleSwipe,
    retrySwipe,
    restoreProfile,
    dismissMatch,
    dismissToast,
    reloadFeed,
    resetFeed,
  } = useFeed();

  const [animatingDirection, setAnimatingDirection] = useState(null);
  const isTransitioningRef = useRef(false);

  // Auto-dismiss toast notification after 6 seconds
  useEffect(() => {
    if (!toastNotification) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 6000);
    return () => clearTimeout(timer);
  }, [toastNotification, dismissToast]);

  // Notify parent of mutual match so global navbar badge updates
  useEffect(() => {
    if (currentMatch && onMatchCreated) {
      onMatchCreated(currentMatch);
    }
  }, [currentMatch, onMatchCreated]);

  // Programmatic swipe action for buttons and arrow keys
  // Debounced during the 220ms card exit animation to prevent duplicate swipes on the same card
  const triggerSwipeAction = useCallback(
    (action) => {
      if (isTransitioningRef.current || !currentProfile || currentMatch || animatingDirection) {
        return;
      }
      isTransitioningRef.current = true;
      setAnimatingDirection(action);
    },
    [currentProfile, currentMatch, animatingDirection]
  );

  // Keyboard shortcut support (Left Arrow = Pass, Right Arrow = Like)
  const handleKeyDown = useCallback(
    (e) => {
      if (isTransitioningRef.current || !currentProfile || currentMatch || animatingDirection) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerSwipeAction('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerSwipeAction('like');
      }
    },
    [triggerSwipeAction, currentProfile, currentMatch, animatingDirection]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const onCardSwiped = useCallback(
    (action) => {
      setAnimatingDirection(null);
      isTransitioningRef.current = false;
      handleSwipe(action);
    },
    [handleSwipe]
  );

  return (
    <div className="w-full h-[calc(100vh-7rem)] md:h-[calc(100vh-4.5rem)] max-w-sm mx-auto flex flex-col justify-between py-2 sm:py-3 px-3">
      {/* Toast Notification with Retry & Restore support for background API failures */}
      {toastNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-[#1A1715] text-white text-xs px-3.5 py-2.5 rounded-[14px] shadow-xl flex items-center justify-between gap-2.5 border border-white/10 animate-fade-in">
          <span className="truncate text-[11px] text-white/90">
            {toastNotification.message}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {toastNotification.profile && (
              <>
                <button
                  type="button"
                  onClick={() => retrySwipe(toastNotification.profile, toastNotification.action)}
                  className="px-2 py-1 rounded-md bg-coy-accent hover:bg-coy-accent-hover text-white text-[10px] font-medium transition-colors"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => restoreProfile(toastNotification.profile)}
                  className="px-2 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white text-[10px] font-medium transition-colors inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Restore
                </button>
              </>
            )}
            <button
              type="button"
              onClick={dismissToast}
              className="text-white/50 hover:text-white p-0.5 ml-0.5 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main card viewport stage */}
      <div className="w-full flex-1 flex items-center justify-center min-h-[460px]">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="w-full max-w-[340px] h-[450px] mx-auto rounded-[20px] bg-white border border-coy-border p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-coy-accent mb-2 stroke-[1.5]" />
            <h3 className="font-display text-lg font-medium text-coy-ink mb-1">Could not load feed</h3>
            <p className="text-xs text-coy-muted mb-4">{error}</p>
            <button
              onClick={reloadFeed}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-coy-accent text-white text-xs font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[1.5]" />
              Try again
            </button>
          </div>
        ) : hasMore && currentProfile ? (
          <ProfileCard
            key={currentProfile._id || currentProfile.id}
            profile={currentProfile}
            secondProfile={secondProfile}
            thirdProfile={thirdProfile}
            onSwipe={onCardSwiped}
            animatingDirection={animatingDirection}
            disabled={Boolean(animatingDirection)}
          />
        ) : (
          <EmptyState onReset={resetFeed} />
        )}
      </div>

      {/* Action Buttons: Never blocked by background API latency */}
      <div className="w-full py-2 flex items-center justify-center">
        {!loading && !error && hasMore && currentProfile && (
          <SwipeButtons
            onPass={() => triggerSwipeAction('pass')}
            onLike={() => triggerSwipeAction('like')}
            disabled={Boolean(animatingDirection)}
          />
        )}
      </div>

      {/* Match Celebration Modal */}
      {currentMatch && (
        <MatchModal
          match={currentMatch}
          onClose={dismissMatch}
        />
      )}
    </div>
  );
};

export default Discover;
