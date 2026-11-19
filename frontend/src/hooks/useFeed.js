import { useState, useEffect, useCallback } from 'react';
import { fetchFeed, sendSwipe, resetFeed } from '../services/api';

export const useFeed = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeed();
      if (data && data.success) {
        setProfiles(data.profiles || []);
        setCurrentIndex(0);
      } else {
        setError(data.message || 'Failed to fetch profiles');
      }
    } catch (err) {
      console.error('[useFeed] Error loading feed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to Coy server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const currentProfile = profiles[currentIndex] || null;
  const nextProfile = profiles[currentIndex + 1] || null;
  const hasMore = currentIndex < profiles.length;

  /**
   * Handle swipe action on the active card.
   * @param {'like' | 'pass'} action
   */
  const handleSwipe = useCallback(
    async (action) => {
      if (!currentProfile || isSubmitting) return;

      const profileToSwipe = currentProfile;
      setIsSubmitting(true);

      try {
        const result = await sendSwipe(profileToSwipe._id, action);

        // Advance to next profile in stack immediately for fluid UX
        setCurrentIndex((prev) => prev + 1);

        if (result && result.matched && result.match) {
          setCurrentMatch(result.match);
        }
      } catch (err) {
        console.error(`[useFeed] Swipe failed:`, err);
        // If conflict (already swiped), skip past it
        if (err.response?.status === 409) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setError(err.response?.data?.message || 'Swipe action failed. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentProfile, isSubmitting]
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
      console.error('[useFeed] Error resetting feed:', err);
      setError('Could not reset demo feed.');
      setLoading(false);
    }
  }, [loadFeed]);

  return {
    profiles,
    currentIndex,
    currentProfile,
    nextProfile,
    hasMore,
    loading,
    error,
    isSubmitting,
    currentMatch,
    handleSwipe,
    dismissMatch,
    reloadFeed: loadFeed,
    resetFeed: handleResetFeed,
  };
};

export default useFeed;

