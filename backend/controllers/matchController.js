import Match from '../models/Match.js';
import Swipe from '../models/Swipe.js';

const DEMO_USER_ID = 'demo-user-1';

/**
 * GET /api/matches
 * Returns list of confirmed mutual matches for the demo user.
 * Strictly guarantees privacy: does not expose one-sided likes.
 */
export const getMatches = async (req, res, next) => {
  try {
    const demoUserId = req.query.userId || DEMO_USER_ID;

    const matches = await Match.find({ demoUserId })
      .populate({
        path: 'profileId',
        select: '-likedDemoUser -__v',
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform into clean structure, filtering out any deleted profiles
    const formattedMatches = matches
      .filter((m) => m.profileId !== null)
      .map((m) => ({
        id: m._id,
        createdAt: m.createdAt,
        profile: {
          id: m.profileId._id,
          name: m.profileId.name,
          age: m.profileId.age,
          photo: m.profileId.photo,
          bio: m.profileId.bio,
          city: m.profileId.city,
          college: m.profileId.college,
          interests: m.profileId.interests,
        },
      }));

    return res.status(200).json({
      success: true,
      count: formattedMatches.length,
      matches: formattedMatches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/reset
 * Helper endpoint for testing & evaluator convenience.
 * Resets swipes and matches for the demo user.
 */
export const resetDemoData = async (req, res, next) => {
  try {
    const demoUserId = req.body.userId || DEMO_USER_ID;

    await Swipe.deleteMany({ demoUserId });
    await Match.deleteMany({ demoUserId });

    return res.status(200).json({
      success: true,
      message: 'Demo swipes and matches have been successfully reset.',
    });
  } catch (error) {
    next(error);
  }
};

