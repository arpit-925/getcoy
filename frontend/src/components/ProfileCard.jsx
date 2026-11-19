import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, GraduationCap, BadgeCheck, Sparkles, User } from 'lucide-react';
import InterestTags from './InterestTags';

const ProfileCard = ({
  profile,
  nextProfile,
  onSwipe,
  isTopCard = true,
  disabled = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const x = useMotionValue(0);

  // Rotation and scale dynamics based on drag distance
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (disabled) return;

    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  if (!profile) return null;

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.2] sm:aspect-[3/4.5] max-h-[640px] select-none">
      {/* Background stack card (shows next profile underneath for physical depth) */}
      {nextProfile && isTopCard && (
        <div className="absolute inset-0 rounded-3xl bg-white border border-coy-border/80 shadow-md overflow-hidden transform scale-[0.94] translate-y-3 pointer-events-none opacity-80 z-0">
          <img
            src={nextProfile.photo}
            alt={nextProfile.name}
            className="w-full h-full object-cover filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white/90">
            <h3 className="text-xl font-bold">
              {nextProfile.name}, {nextProfile.age}
            </h3>
            <p className="text-xs text-white/70">{nextProfile.college}</p>
          </div>
        </div>
      )}

      {/* Active interactive top card */}
      <motion.div
        style={{ x: isTopCard ? x : 0, rotate: isTopCard ? rotate : 0 }}
        drag={isTopCard && !disabled ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={
          isTopCard
            ? { scale: 1, y: 0, opacity: 1 }
            : { scale: 0.94, y: 12, opacity: 0.8 }
        }
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`absolute inset-0 rounded-3xl bg-white border border-coy-border shadow-coy-card overflow-hidden flex flex-col justify-end cursor-grab active:cursor-grabbing z-10 ${
          disabled ? 'pointer-events-none' : ''
        }`}
      >
        {/* Profile Image / Fallback */}
        <div className="absolute inset-0 bg-coy-subtle">
          {!imageError ? (
            <img
              src={profile.photo}
              alt={profile.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover pointer-events-none"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-coy-pink/20 to-coy-subtle text-coy-pink">
              <User className="w-24 h-24 mb-2 opacity-50" />
              <span className="text-sm font-medium">{profile.name}</span>
            </div>
          )}
        </div>

        {/* Dramatic high-contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Visual stamp indicators for gestures */}
        {isTopCard && (
          <>
            {/* LIKE STAMP (Right Swipe) */}
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 left-8 z-30 pointer-events-none transform -rotate-12"
            >
              <div className="px-5 py-2 rounded-2xl border-4 border-coy-pink bg-coy-pink/20 backdrop-blur-sm shadow-lg">
                <span className="text-2xl sm:text-3xl font-black tracking-widest text-coy-pink uppercase drop-shadow-md">
                  LIKE
                </span>
              </div>
            </motion.div>

            {/* PASS STAMP (Left Swipe) */}
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-8 right-8 z-30 pointer-events-none transform rotate-12"
            >
              <div className="px-5 py-2 rounded-2xl border-4 border-gray-300 bg-black/30 backdrop-blur-sm shadow-lg">
                <span className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase drop-shadow-md">
                  PASS
                </span>
              </div>
            </motion.div>
          </>
        )}

        {/* Card Content Overlay */}
        <div className="relative z-20 p-5 sm:p-6 text-white space-y-3 pointer-events-none">
          {/* Name, Age & Verified Tag */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                {profile.name}, {profile.age}
              </h2>
              <span title="Verified Student / Member">
                <BadgeCheck className="w-6 h-6 text-coy-pink fill-white" />
              </span>
            </div>

            {/* College & City */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-white/90 font-medium pt-1">
              {profile.college && (
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-white/80" />
                  {profile.college}
                </span>
              )}
              {profile.city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white/80" />
                  {profile.city}
                </span>
              )}
            </div>
          </div>

          {/* Short Bio */}
          {profile.bio && (
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-3 font-normal drop-shadow-sm">
              "{profile.bio}"
            </p>
          )}

          {/* Interest Tags */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="pt-1">
              <InterestTags interests={profile.interests} limit={4} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;

