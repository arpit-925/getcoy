import { useState, useEffect, useCallback } from 'react';
import { fetchFeed, sendSwipe, resetFeed } from '../services/api';

export const useFeed = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastError, setToastError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [exitDirection, setExitDirection] = useState(null);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeed();
      if (data && data.success) {
        setProfiles(data.profiles || []);
        setCurrentIndex(0);
      } else {
        setError(data?.message || 'Failed to fetch profiles');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const currentProfile = profiles[currentIndex] || null;
  const secondProfile = profiles[currentIndex + 1] || null;
  const thirdProfile = profiles[currentIndex + 2] || null;
  const hasMore = currentIndex < profiles.length;

  /**
   * Optimistically swipe on the active card.
   * Advances the stack immediately and triggers haptic feedback.
   * If the API fails, restores the card and shows a toast.
   *
   * @param {'like' | 'pass'} action
   */
  const handleSwipe = useCallback(
    async (action) => {
      if (!currentProfile || isSubmitting) return;

      const swipedProfile = currentProfile;
      const swipedIndex = currentIndex;
      const profileId = swipedProfile._id || swipedProfile.id;

      // Light haptic feedback if supported by browser/device
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(10);
        } catch (_) {}
      }

      setIsSubmitting(true);
      // Optimistically advance to next card immediately
      setCurrentIndex((prev) => prev + 1);

      try {
        const result = await sendSwipe(profileId, action);

        if (result && result.matched && result.match) {
          setCurrentMatch(result.match);
        }
      } catch (err) {
        // Rollback optimistic advance on failure
        setCurrentIndex(swipedIndex);
        setToastError('Could not record swipe. Card restored.');
        setTimeout(() => setToastError(null), 3000);
      } finally {
        setIsSubmitting(false);
        setExitDirection(null);
      }
    },
    [currentProfile, currentIndex, isSubmitting]
  );

  const dismissMatch = useCallback(() => {
    setCurrentMatch(null);
  }, []);

  const handleResetFeed = useCallback(async () => {
    try {
      setLoading(true);
      await resetFeed();
      await loadFeed();
    } catch (err) {
      setError('Could not reset demo feed.');
      setLoading(false);
    }
  }, [loadFeed]);

  return {
    profiles,
    currentIndex,
    currentProfile,
    secondProfile,
    thirdProfile,
    hasMore,
    loading,
    error,
    toastError,
    isSubmitting,
    currentMatch,
    exitDirection,
    setExitDirection,
    handleSwipe,
    dismissMatch,
    reloadFeed: loadFeed,
    resetFeed: handleResetFeed,
  };
};

export default useFeed;
