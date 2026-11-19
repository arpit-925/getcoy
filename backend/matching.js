/**
 * Pure matching and privacy sanitization logic.
 * Keeps matching decisions independent of transport / HTTP layers.
 */

/**
 * Determines whether a swipe results in a mutual match.
 *
 * Rule: A match only happens when:
 * 1. The swiping user takes action === 'like'
 * 2. The target profile has already liked the swiping user (likedUser === true)
 *
 * @param {'like' | 'pass'} action - The swipe action taken by user
 * @param {boolean} targetLikedUser - Whether target profile has liked the user
 * @returns {boolean}
 */
export function isMutualMatch(action, targetLikedUser) {
  if (action !== 'like') {
    return false;
  }
  return Boolean(targetLikedUser);
}

/**
 * Strips any incoming-like or private fields before returning a profile to client.
 * Guarantees no likesMe / likedDemoUser / incomingLike leaks.
 *
 * @param {object} profile - Raw profile document or object
 * @returns {object}
 */
export function sanitizeProfile(profile) {
  if (!profile) return null;

  const raw = profile._doc || profile;
  const {
    likedDemoUser,
    likesMe,
    likedYou,
    hasLiked,
    incomingLike,
    isIncomingLike,
    __v,
    ...safe
  } = raw;

  return {
    ...safe,
    id: safe._id ? String(safe._id) : safe.id,
  };
}

/**
 * Evaluates a swipe action on a target profile.
 *
 * @param {Object} params
 * @param {'like' | 'pass'} params.action
 * @param {Object} params.targetProfile
 * @param {boolean} [params.hasExistingMatch]
 * @returns {{ matched: boolean, match?: Object }}
 */
export function evaluateSwipe({ action, targetProfile, hasExistingMatch = false }) {
  if (hasExistingMatch) {
    return {
      matched: true,
      match: sanitizeProfile(targetProfile),
    };
  }

  const targetLikedUser = Boolean(targetProfile?.likedDemoUser);
  const matched = isMutualMatch(action, targetLikedUser);

  if (matched) {
    return {
      matched: true,
      match: sanitizeProfile(targetProfile),
    };
  }

  return {
    matched: false,
  };
}

