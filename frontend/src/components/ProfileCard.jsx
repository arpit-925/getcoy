import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { MapPin, GraduationCap, User } from 'lucide-react';
import InterestTags from './InterestTags';

const ProfileCard = ({
  profile,
  secondProfile,
  thirdProfile,
  onSwipe,
  animatingDirection = null,
  disabled = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Reset imageError state whenever the profile changes
  useEffect(() => {
    setImageError(false);
  }, [profile?._id, profile?.id, profile?.photo]);

  // Rotation proportional to drag x-offset (-12 deg to +12 deg)
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);

  // Stamp opacities fade in smoothly as card is dragged
  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const passOpacity = useTransform(x, [-90, -20], [1, 0]);

  // Animate programmatic trigger (from buttons or keyboard arrows)
  useEffect(() => {
    let active = true;

    if (animatingDirection === 'like') {
      controls.start({
        x: 450,
        rotate: 15,
        opacity: 0,
        transition: { duration: 0.22, ease: 'easeOut' },
      }).then(() => {
        if (active) {
          onSwipe('like');
        }
      });
    } else if (animatingDirection === 'pass') {
      controls.start({
        x: -450,
        rotate: -15,
        opacity: 0,
        transition: { duration: 0.22, ease: 'easeOut' },
      }).then(() => {
        if (active) {
          onSwipe('pass');
        }
      });
    }

    return () => {
      active = false;
    };
  }, [animatingDirection, controls, onSwipe]);

  const handleDragEnd = async (event, info) => {
    if (disabled || animatingDirection) return;

    const threshold = 90;
    const velocityThreshold = 450;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      await controls.start({
        x: 450,
        rotate: 15,
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
      });
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      await controls.start({
        x: -450,
        rotate: -15,
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
      });
      onSwipe('pass');
    } else {
      // Spring back if threshold not met
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: 'spring', damping: 20, stiffness: 300 },
      });
    }
  };

  if (!profile) return null;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[370px] h-[450px] sm:h-[490px] mx-auto select-none">
      {/* 3rd Card in Stack (Deepest preview) */}
      {thirdProfile && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[20px] bg-coy-surface border border-coy-border overflow-hidden pointer-events-none transform scale-[0.88] translate-y-5 opacity-40 z-0"
        >
          <img
            src={thirdProfile.photo}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
        </div>
      )}

      {/* 2nd Card in Stack (Directly behind top card) */}
      {secondProfile && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[20px] bg-white border border-coy-border overflow-hidden pointer-events-none transform scale-[0.94] translate-y-2.5 opacity-80 z-[1] shadow-xs"
        >
          <img
            src={secondProfile.photo}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white/80">
            <h3 className="font-display text-lg font-medium">
              {secondProfile.name}, {secondProfile.age}
            </h3>
            <p className="text-xs text-white/60 truncate">
              {secondProfile.college || secondProfile.city}
            </p>
          </div>
        </div>
      )}

      {/* Top Active Interactive Card */}
      <motion.div
        style={{ x, rotate }}
        animate={controls}
        drag={disabled || animatingDirection ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.65}
        onDragEnd={handleDragEnd}
        className={`absolute inset-0 rounded-[20px] bg-white border border-[#E5DFD5] shadow-card-soft overflow-hidden flex flex-col justify-end cursor-grab active:cursor-grabbing z-[2] ${
          disabled ? 'pointer-events-none' : ''
        }`}
      >
        {/* Profile Image */}
        <div className="absolute inset-0 bg-coy-surface">
          {!imageError ? (
            <img
              src={profile.photo}
              alt={profile.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover pointer-events-none"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-coy-surface text-coy-muted">
              <User className="w-16 h-16 mb-2 stroke-[1.25] opacity-40" />
              <span className="font-display text-sm">{profile.name}</span>
            </div>
          )}
        </div>

        {/* Subtle, restrained gradient overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

        {/* LIKE Stamp (Top-Left) */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 left-6 z-30 pointer-events-none transform -rotate-12"
        >
          <div className="px-3.5 py-1 rounded-[6px] border-2 border-coy-accent bg-black/30 backdrop-blur-xs">
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-coy-accent uppercase">
              LIKE
            </span>
          </div>
        </motion.div>

        {/* PASS Stamp (Top-Right) */}
        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute top-6 right-6 z-30 pointer-events-none transform rotate-12"
        >
          <div className="px-3.5 py-1 rounded-[6px] border-2 border-[#D8D0C5] bg-black/30 backdrop-blur-xs">
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-[#FAF6F0] uppercase">
              PASS
            </span>
          </div>
        </motion.div>

        {/* Bottom Card Content */}
        <div className="relative z-20 p-5 text-white space-y-2 pointer-events-none">
          {/* Name & Age (Display Serif Font) */}
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight">
              {profile.name}
            </h2>
            <span className="font-sans text-lg text-white/80 font-normal">
              {profile.age}
            </span>
          </div>

          {/* Location & College (One subtle line) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/80 font-normal">
            {profile.college && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-white/70 stroke-[1.75]" />
                {profile.college}
              </span>
            )}
            {profile.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-white/70 stroke-[1.75]" />
                {profile.city}
              </span>
            )}
          </div>

          {/* Short Bio */}
          {profile.bio && (
            <p className="text-xs text-white/90 leading-relaxed line-clamp-2 font-normal pt-0.5">
              {profile.bio}
            </p>
          )}

          {/* Neutral outline chips for interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="pt-1">
              <InterestTags interests={profile.interests} limit={4} variant="overlay" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;
