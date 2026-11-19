import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchFeed, sendSwipe, resetFeed } from '../services/api';

export const useFeed = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);

  // Set of profile IDs that have already been swiped in this session (prevents duplicates)
  const swipedIdsRef = useRef(new Set());
  // Queue for matches that arrive while a match modal is already open
  const matchQueueRef = useRef([]);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeed();
      if (data && data.success) {
        setProfiles(data.profiles || []);
        setCurrentIndex(0);
        swipedIdsRef.current.clear();
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

  // Preload upcoming images so cards appear instantaneously with zero visual delay
  useEffect(() => {
    if (!profiles.length) return;
    const upcoming = profiles.slice(currentIndex + 1, currentIndex + 4);
    upcoming.forEach((p) => {
      if (p && p.photo) {
        const img = new Image();
        img.referrerPolicy = 'no-referrer';
        img.src = p.photo;
      }
    });
  }, [currentIndex, profiles]);

  const currentProfile = profiles[currentIndex] || null;
  const secondProfile = profiles[currentIndex + 1] || null;
  const thirdProfile = profiles[currentIndex + 2] || null;
  const hasMore = currentIndex < profiles.length;

  /**
   * Helper to surface match results safely.
   */
  const handleMatchResult = useCallback((matchPayload) => {
    const matchData = matchPayload?.profile || matchPayload;
    if (!matchData) return;

    setCurrentMatch((prev) => {
      if (prev) {
        // A match modal is already open, queue this one
        matchQueueRef.current.push(matchData);
        return prev;
      }
      return matchData;
    });
  }, []);

  /**
   * Optimistically swipe on the active card.
   * Advances the stack immediately without waiting for the backend response.
   * The API call runs asynchronously in the background.
   *
   * @param {'like' | 'pass'} action
   */
  const handleSwipe = useCallback(
    (action) => {
      if (!currentProfile) return;

      const swipedProfile = currentProfile;
      const profileId = swipedProfile._id || swipedProfile.id;

      // Prevent duplicate swipe submissions for the same profile
      if (swipedIdsRef.current.has(profileId)) {
        return;
      }
      swipedIdsRef.current.add(profileId);

      // Light haptic feedback if supported by browser/device
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(10);
        } catch (_) {}
      }

      // Optimistically advance to the next card immediately
      setCurrentIndex((prev) => prev + 1);

      // Send the swipe API request asynchronously in the background
      sendSwipe(profileId, action)
        .then((result) => {
          if (result && result.matched && result.match) {
            handleMatchResult(result.match);
          }
        })
        .catch((err) => {
          console.error(`Swipe failed for ${swipedProfile.name}:`, err);
          // Show error toast with retry and restore capabilities
          setToastNotification({
            id: `${profileId}-${Date.now()}`,
            message: `Could not save swipe for ${swipedProfile.name}.`,
            profile: swipedProfile,
            action,
          });
        });
    },
    [currentProfile, handleMatchResult]
  );

  /**
   * Retry a failed swipe request in the background.
   */
  const retrySwipe = useCallback(
    async (profile, action) => {
      setToastNotification(null);
      const profileId = profile._id || profile.id;

      try {
        const result = await sendSwipe(profileId, action);
        if (result && result.matched && result.match) {
          handleMatchResult(result.match);
        }
      } catch (err) {
        setToastNotification({
          id: `${profileId}-${Date.now()}`,
          message: `Retry failed for ${profile.name}. Check your connection.`,
          profile,
          action,
        });
      }
    },
    [handleMatchResult]
  );

  /**
   * Restore a profile back to the top of the feed if the user wants to un-swipe / retry visually.
   */
  const restoreProfile = useCallback(
    (profile) => {
      setToastNotification(null);
      const profileId = profile._id || profile.id;

      // Allow this profile to be swiped again
      swipedIdsRef.current.delete(profileId);

      // Insert profile right at the current index so it appears next
      setProfiles((prev) => {
        const updated = [...prev];
        updated.splice(currentIndex, 0, profile);
        return updated;
      });
    },
    [currentIndex]
  );

  /**
   * Dismiss current match modal. If another match is queued, show it next.
   */
  const dismissMatch = useCallback(() => {
    if (matchQueueRef.current.length > 0) {
      const nextMatch = matchQueueRef.current.shift();
      setCurrentMatch(nextMatch);
    } else {
      setCurrentMatch(null);
    }
  }, []);

  const dismissToast = useCallback(() => {
    setToastNotification(null);
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
    toastNotification,
    currentMatch,
    handleSwipe,
    retrySwipe,
    restoreProfile,
    dismissMatch,
    dismissToast,
    reloadFeed: loadFeed,
    resetFeed: handleResetFeed,
  };
};

export default useFeed;
