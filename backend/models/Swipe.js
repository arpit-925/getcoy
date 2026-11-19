import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema(
  {
    demoUserId: {
      type: String,
      default: 'demo-user-1',
      required: true,
      index: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: [true, 'Profile ID is required'],
      index: true,
    },
    action: {
      type: String,
      enum: {
        values: ['like', 'pass'],
        message: 'Action must be either "like" or "pass"',
      },
      required: [true, 'Action is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Enforce strictly one swipe per profile per demo user
swipeSchema.index({ demoUserId: 1, profileId: 1 }, { unique: true });

const Swipe = mongoose.model('Swipe', swipeSchema);

export default Swipe;

