import React, { useEffect, useCallback, useState } from 'react';
import useFeed from '../hooks/useFeed';
import ProfileCard from '../components/ProfileCard';
import SwipeButtons from '../components/SwipeButtons';
import MatchModal from '../components/MatchModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Discover = ({ onMatchCreated }) => {
  const {
    currentProfile,
    secondProfile,
    thirdProfile,
    hasMore,
    loading,
    error,
    toastError,
    isSubmitting,
    currentMatch,
    handleSwipe,
    dismissMatch,
    reloadFeed,
    resetFeed,
  } = useFeed();

  const [animatingDirection, setAnimatingDirection] = useState(null);

  // Notify parent of mutual match so global navbar badge updates
  useEffect(() => {
    if (currentMatch && onMatchCreated) {
      onMatchCreated(currentMatch);
    }
  }, [currentMatch, onMatchCreated]);

  // Programmatic swipe action for buttons and arrow keys
  const triggerSwipeAction = useCallback(
    (action) => {
      if (isSubmitting || !currentProfile || currentMatch || animatingDirection) return;
      setAnimatingDirection(action);
    },
    [isSubmitting, currentProfile, currentMatch, animatingDirection]
  );

  // Keyboard shortcut support (Left Arrow = Pass, Right Arrow = Like)
  const handleKeyDown = useCallback(
    (e) => {
      if (isSubmitting || !currentProfile || currentMatch || animatingDirection) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerSwipeAction('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerSwipeAction('like');
      }
    },
    [triggerSwipeAction, isSubmitting, currentProfile, currentMatch, animatingDirection]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const onCardSwiped = useCallback(
    (action) => {
      setAnimatingDirection(null);
      handleSwipe(action);
    },
    [handleSwipe]
  );

  return (
    <div className="w-full h-[calc(100vh-7rem)] md:h-[calc(100vh-4.5rem)] max-w-sm mx-auto flex flex-col justify-between py-2 sm:py-3 px-3">
      {/* Toast Notification for optimistic error rollback */}
      {toastError && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1A1715] text-white text-xs px-3.5 py-1.5 rounded-full shadow-md animate-fade-in">
          {toastError}
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
            disabled={isSubmitting}
          />
        ) : (
          <EmptyState onReset={resetFeed} />
        )}
      </div>

      {/* Action Buttons: fits within viewport without crowding card */}
      <div className="w-full py-2 flex items-center justify-center">
        {!loading && !error && hasMore && currentProfile && (
          <SwipeButtons
            onPass={() => triggerSwipeAction('pass')}
            onLike={() => triggerSwipeAction('like')}
            disabled={isSubmitting || Boolean(animatingDirection)}
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
