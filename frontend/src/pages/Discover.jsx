import React, { useEffect, useCallback } from 'react';
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
    nextProfile,
    hasMore,
    loading,
    error,
    isSubmitting,
    currentMatch,
    handleSwipe,
    dismissMatch,
    reloadFeed,
    resetFeed,
  } = useFeed();

  // Notify parent of mutual match so global navbar badge can update
  useEffect(() => {
    if (currentMatch && onMatchCreated) {
      onMatchCreated(currentMatch);
    }
  }, [currentMatch, onMatchCreated]);

  // Keyboard shortcut support (Left Arrow = Pass, Right Arrow = Like)
  const handleKeyDown = useCallback(
    (e) => {
      if (isSubmitting || !currentProfile || currentMatch) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('like');
      }
    },
    [handleSwipe, isSubmitting, currentProfile, currentMatch]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col items-center justify-between py-4 sm:py-6 px-4">
      {/* Top micro-status */}
      <div className="h-6 flex items-center justify-center">
        {isSubmitting && (
          <span className="text-[11px] font-medium text-coy-pink animate-pulse">
            Connecting...
          </span>
        )}
      </div>

      {/* Main card stage */}
      <div className="w-full flex-1 flex items-center justify-center my-2">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.2] rounded-3xl bg-white border border-red-200 p-8 flex flex-col items-center justify-center text-center shadow-coy-card">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-coy-text mb-2">Connection Issue</h3>
            <p className="text-xs sm:text-sm text-coy-muted mb-6">{error}</p>
            <button
              onClick={reloadFeed}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coy-pink text-white text-sm font-semibold shadow-coy-pink"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : hasMore && currentProfile ? (
          <ProfileCard
            profile={currentProfile}
            nextProfile={nextProfile}
            onSwipe={handleSwipe}
            isTopCard={true}
            disabled={isSubmitting}
          />
        ) : (
          <EmptyState
            title="You've Discovered Everyone!"
            description="There are no more new profiles in your feed right now. You can check your mutual matches or reset the demo feed to test again."
            onReset={resetFeed}
            resetText="Reset Demo Feed (32 Profiles)"
          />
        )}
      </div>

      {/* Swipe Action Buttons */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto h-24 flex items-center justify-center">
        {!loading && !error && hasMore && currentProfile && (
          <SwipeButtons
            onPass={() => handleSwipe('pass')}
            onLike={() => handleSwipe('like')}
            disabled={isSubmitting}
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

