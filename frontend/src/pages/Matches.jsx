import React, { useState, useEffect } from 'react';
import { fetchMatches } from '../services/api';
import { Heart, GraduationCap, MapPin, Sparkles, X, UserCheck, Calendar } from 'lucide-react';
import InterestTags from '../components/InterestTags';
import EmptyState from '../components/EmptyState';

const Matches = ({ onMatchesCountChange }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMatches();
        if (data && data.success) {
          setMatches(data.matches || []);
          if (onMatchesCountChange) {
            onMatchesCountChange(data.matches?.length || 0);
          }
        } else {
          setError(data.message || 'Failed to load matches');
        }
      } catch (err) {
        console.error('[Matches] Error fetching matches:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [onMatchesCountChange]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-coy-text tracking-tight">
            Mutual Matches
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-coy-pink text-white">
            {matches.length}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-coy-muted mt-1">
          People you liked who also secretly expressed interest in you.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-white border border-coy-border animate-pulse p-3 flex flex-col justify-end"
            >
              <div className="h-4 w-3/4 bg-coy-border rounded mb-2" />
              <div className="h-3 w-1/2 bg-coy-border/60 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-center text-sm">
          {error}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Mutual Matches Yet"
          description="Keep discovering profiles! When someone you like has also liked you back, they will appear here secretly."
          actionText="Find Crushes on Discover"
          actionLink="/discover"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {matches.map((item) => {
            const profile = item.profile;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMatch(profile)}
                className="group relative aspect-[3/4.2] rounded-2xl overflow-hidden bg-white border border-coy-border shadow-sm hover:shadow-coy-card cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Photo */}
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Match indicator pill */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-coy-pink flex items-center gap-1 shadow-xs">
                  <Heart className="w-2.5 h-2.5 fill-current" />
                  Matched
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-sm">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-[11px] text-white/80 truncate">
                    {profile.college || profile.city}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Profile Inspection Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedMatch(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-coy-border max-h-[90vh] flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile image header */}
            <div className="relative aspect-[4/3] w-full bg-coy-subtle">
              <img
                src={selectedMatch.photo}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-coy-text">
                    {selectedMatch.name}, {selectedMatch.age}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-coy-pink-soft text-coy-pink text-xs font-semibold">
                    Mutual Crush
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-xs text-coy-muted mt-1.5 font-medium">
                  {selectedMatch.college && (
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-coy-pink" />
                      {selectedMatch.college}
                    </span>
                  )}
                  {selectedMatch.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-coy-pink" />
                      {selectedMatch.city}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {selectedMatch.bio && (
                <div className="p-3.5 rounded-2xl bg-coy-bg border border-coy-border/60">
                  <p className="text-xs sm:text-sm text-coy-text leading-relaxed">
                    "{selectedMatch.bio}"
                  </p>
                </div>
              )}

              {/* Interests */}
              {selectedMatch.interests && selectedMatch.interests.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-coy-muted uppercase tracking-wider mb-2">
                    Interests & Passions
                  </h4>
                  <InterestTags interests={selectedMatch.interests} />
                </div>
              )}

              <button
                onClick={() => setSelectedMatch(null)}
                className="w-full py-3 rounded-full bg-coy-bg hover:bg-coy-subtle text-coy-text font-medium text-xs border border-coy-border transition-colors mt-2"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;

