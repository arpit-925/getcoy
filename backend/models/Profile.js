import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be at least 18'],
      max: [99, 'Age must be realistic'],
    },
    photo: {
      type: String,
      required: [true, 'Photo URL is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
      maxlength: 300,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    // Seeded incoming-like flag: whether this profile has expressed interest in the demo user.
    // MUST NEVER be exposed in public feed responses to respect privacy!
    likedDemoUser: {
      type: Boolean,
      default: false,
      select: false, // Hidden by default from queries unless explicitly selected
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting / querying
profileSchema.index({ createdAt: -1 });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;

