import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';
import { evaluateSwipe, sanitizeProfile } from '../matching.js';

const DEMO_USER_ID = 'demo-user-1';

// Per-user write serialization queue to prevent race conditions on rapid concurrent swipes
const userLocks = new Map();

function serializeForUser(userId, task) {
  const previous = userLocks.get(userId) || Promise.resolve();
  const current = previous.catch(() => {}).then(task);
  userLocks.set(userId, current);

  current.finally(() => {
    if (userLocks.get(userId) === current) {
      userLocks.delete(userId);
    }
  });

  return current;
}

/**
 * POST /api/swipe & POST /swipe
 * Records a swipe action ('like' | 'pass') on a profile.
 *
 * Requirements:
 * - Reject invalid actions (only 'like' | 'pass') and unknown profile IDs.
 * - Idempotent on repeat swipes (never creates duplicate swipes or matches).
 * - Returns ONLY `{ matched: boolean, match?: profile }`.
 * - No difference in status or body between a pass and a pending one-sided like.
 */
export const handleSwipe = async (req, res, next) => {
  try {
    const { profileId, action } = req.body;
    const demoUserId = req.body.userId || DEMO_USER_ID;

    // 1. Validate inputs
    if (!profileId) {
      return res.status(400).json({
        error: 'profileId is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({
        error: 'Invalid profileId format',
      });
    }

    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({
        error: 'Action must be either "like" or "pass"',
      });
    }

    // 2. Validate profile existence in DB
    const targetProfile = await Profile.findById(profileId).select('+likedDemoUser');
    if (!targetProfile) {
      return res.status(404).json({
        error: 'Profile not found',
      });
    }

    // 3. Process write safely with serialized lock per user
    const result = await serializeForUser(demoUserId, async () => {
      // Check for an existing swipe (idempotency)
      const existingSwipe = await Swipe.findOne({ demoUserId, profileId });
      if (existingSwipe) {
        const existingMatch = await Match.findOne({ demoUserId, profileId });
        if (existingMatch) {
          return {
            matched: true,
            match: sanitizeProfile(targetProfile),
          };
        }
        return {
          matched: false,
        };
      }

      // Record new swipe
      await Swipe.create({
        demoUserId,
        profileId,
        action,
      });

      // Evaluate matching using pure matching module
      const evaluation = evaluateSwipe({ action, targetProfile });

      if (evaluation.matched) {
        await Match.findOneAndUpdate(
          { demoUserId, profileId },
          { demoUserId, profileId, createdAt: new Date() },
          { upsert: true, new: true }
        );
      }

      return evaluation;
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error.code === 11000) {
      // Rare unique-index collision: handle idempotently
      const existingMatch = await Match.findOne({
        demoUserId: req.body.userId || DEMO_USER_ID,
        profileId: req.body.profileId,
      });
      return res.status(200).json({
        matched: Boolean(existingMatch),
      });
    }
    next(error);
  }
};
