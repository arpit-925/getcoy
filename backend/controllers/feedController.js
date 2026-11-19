import Profile from '../models/Profile.js';
import Swipe from '../models/Swipe.js';
import { sanitizeProfile } from '../matching.js';

const DEMO_USER_ID = 'demo-user-1';

/**
 * Fisher-Yates shuffle to randomize feed order so ordering can never leak like-state.
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * GET /api/feed & GET /feed
 * Returns profiles that the demo user has NOT yet swiped on.
 * Excludes both 'liked' and 'passed' profiles.
 *
 * Strict Privacy Guarantees:
 * - Server-side stripped: NO `likedDemoUser`, `likesMe`, `likedYou`, or any like flags.
 * - Randomly shuffled: Position/order cannot leak who liked the user.
 */
export const getFeed = async (req, res, next) => {
  try {
    const demoUserId = req.query.userId || DEMO_USER_ID;

    // Fetch all profile IDs already swiped on by this user
    const userSwipes = await Swipe.find({ demoUserId }).select('profileId').lean();
    const swipedProfileIds = userSwipes.map((s) => s.profileId);

    // Fetch unswiped profiles only, strictly excluding hidden flags
    const rawProfiles = await Profile.find({
      _id: { $nin: swipedProfileIds },
    })
      .select('-likedDemoUser -__v')
      .lean();

    // Sanitize every profile to guarantee no hidden/internal fields leak
    const sanitized = rawProfiles.map(sanitizeProfile);

    // Randomize feed order so position can never leak prior interest
    const shuffledFeed = shuffle(sanitized);

    return res.status(200).json({
      success: true,
      count: shuffledFeed.length,
      profiles: shuffledFeed,
    });
  } catch (error) {
    next(error);
  }
};
