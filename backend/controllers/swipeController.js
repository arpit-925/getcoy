import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';

const DEMO_USER_ID = 'demo-user-1';

/**
 * POST /api/swipe
 * Body: { profileId: string, action: 'like' | 'pass' }
 *
 * Requirements:
 * - Validate profileId and action.
 * - Prevent duplicate swipes (409 Conflict if already swiped).
 * - Save swipe to MongoDB.
 * - Check whether the profile has already liked the demo user.
 * - Only mutual likes trigger a match.
 * - Return { success: true, matched: boolean, match?: object }.
 * - Never expose one-sided incoming likes.
 */
export const handleSwipe = async (req, res, next) => {
  try {
    const { profileId, action } = req.body;
    const demoUserId = req.body.userId || DEMO_USER_ID;

    // 1. Validation
    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'profileId is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profileId format',
      });
    }

    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "like" or "pass"',
      });
    }

    // 2. Check if target profile exists
    // Explicitly select likedDemoUser here on the server only to evaluate mutual interest
    const targetProfile = await Profile.findById(profileId).select('+likedDemoUser');
    if (!targetProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // 3. Duplicate swipe check
    const existingSwipe = await Swipe.findOne({ demoUserId, profileId });
    if (existingSwipe) {
      return res.status(409).json({
        success: false,
        message: 'You have already swiped on this profile',
      });
    }

    // 4. Record swipe
    await Swipe.create({
      demoUserId,
      profileId,
      action,
    });

    // 5. Evaluate matching condition
    // Only if action is 'like' and the target profile previously liked the demo user
    if (action === 'like' && targetProfile.likedDemoUser === true) {
      // Create match (with idempotency)
      const match = await Match.findOneAndUpdate(
        { demoUserId, profileId },
        { demoUserId, profileId, createdAt: new Date() },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        success: true,
        matched: true,
        match: {
          id: match._id,
          profile: {
            id: targetProfile._id,
            name: targetProfile.name,
            age: targetProfile.age,
            photo: targetProfile.photo,
            city: targetProfile.city,
            college: targetProfile.college,
            bio: targetProfile.bio,
            interests: targetProfile.interests,
          },
        },
      });
    }

    // Pass or one-sided like -> No match created, do not return match object
    return res.status(200).json({
      success: true,
      matched: false,
    });
  } catch (error) {
    // Catch unique index violation race condition gracefully
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already swiped on this profile',
      });
    }
    next(error);
  }
};

