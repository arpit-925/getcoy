import Profile from '../models/Profile.js';
import Swipe from '../models/Swipe.js';

const DEMO_USER_ID = 'demo-user-1';

/**
 * GET /api/feed
 * Returns profiles that the demo user has NOT yet swiped on.
 * Excludes both 'liked' and 'passed' profiles.
 * Strict privacy: NEVER returns `likedDemoUser` or incoming like status.
 */
export const getFeed = async (req, res, next) => {
  try {
    const demoUserId = req.query.userId || DEMO_USER_ID;

    // Fetch all profile IDs already swiped on by this user
    const userSwipes = await Swipe.find({ demoUserId }).select('profileId').lean();
    const swipedProfileIds = userSwipes.map((s) => s.profileId);

    // Fetch unswiped profiles only, excluding private flags
    const profiles = await Profile.find({
      _id: { $nin: swipedProfileIds },
    })
      .select('-likedDemoUser -__v')
      .lean();

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    next(error);
  }
};

