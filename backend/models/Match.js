import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Prevent duplicate matches for the same profile and user
matchSchema.index({ demoUserId: 1, profileId: 1 }, { unique: true });

const Match = mongoose.model('Match', matchSchema);

export default Match;

