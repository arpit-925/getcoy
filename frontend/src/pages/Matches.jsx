import React, { useState, useEffect } from 'react';
import { fetchMatches } from '../services/api';
import { GraduationCap, MapPin, X, Heart } from 'lucide-react';
import InterestTags from '../components/InterestTags';

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
          setError(data?.message || 'Failed to load matches');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [onMatchesCountChange]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      {/* Header Container (Perfect alignment with Navbar) */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-coy-ink tracking-tight">
            Matches
          </h1>
          <span className="text-xs font-normal text-coy-muted">
            ({matches.length})
          </span>
        </div>
        <p className="text-xs text-coy-muted mt-1">
          Mutual only. That's the whole point.
        </p>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4.2] rounded-[20px] bg-white border border-coy-border animate-pulse p-3 flex flex-col justify-end"
            >
              <div className="h-4 w-3/4 bg-coy-surface rounded mb-2" />
              <div className="h-3 w-1/2 bg-coy-surface rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-coy-border text-coy-muted p-6 rounded-[20px] text-center text-xs">
          {error}
        </div>
      ) : matches.length === 0 ? (
        <div className="w-full max-w-sm mx-auto my-12 p-8 rounded-[20px] bg-white border border-[#E5DFD5] shadow-card-soft text-center">
          <Heart className="w-8 h-8 text-coy-muted/50 stroke-[1.5] mx-auto mb-3" />
          <h3 className="font-display text-lg font-medium text-coy-ink mb-1">
            No matches yet.
          </h3>
          <p className="text-xs text-coy-muted leading-relaxed">
            When someone you like also likes you back, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {matches.map((item) => {
            const profile = item.profile;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMatch(profile)}
                className="group relative aspect-[3/4.2] rounded-[20px] overflow-hidden bg-white border border-[#E5DFD5] shadow-card-soft cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Photo */}
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Bottom info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-display font-medium text-base sm:text-lg leading-snug drop-shadow-xs">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-[11px] text-white/75 truncate mt-0.5">
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
            className="absolute inset-0 bg-[#1A1715]/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-[360px] bg-white rounded-[20px] overflow-hidden shadow-xl z-10 border border-coy-border max-h-[85vh] flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 stroke-[2]" />
            </button>

            {/* Profile image header */}
            <div className="relative aspect-[4/3] w-full bg-coy-surface">
              <img
                src={selectedMatch.photo}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3.5 overflow-y-auto">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="font-display text-2xl font-medium text-coy-ink">
                    {selectedMatch.name}
                  </h2>
                  <span className="text-base text-coy-muted font-normal">
                    {selectedMatch.age}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 text-xs text-coy-muted mt-1">
                  {selectedMatch.college && (
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-coy-muted stroke-[1.75]" />
                      {selectedMatch.college}
                    </span>
                  )}
                  {selectedMatch.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-coy-muted stroke-[1.75]" />
                      {selectedMatch.city}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {selectedMatch.bio && (
                <div className="p-3 rounded-[12px] bg-coy-surface/60 border border-coy-border/60">
                  <p className="text-xs text-coy-ink leading-relaxed">
                    {selectedMatch.bio}
                  </p>
                </div>
              )}

              {/* Interests (Neutral outline style) */}
              {selectedMatch.interests && selectedMatch.interests.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-medium text-coy-muted uppercase tracking-wider mb-1.5">
                    Interests
                  </h4>
                  <InterestTags interests={selectedMatch.interests} variant="light" />
                </div>
              )}

              <button
                onClick={() => setSelectedMatch(null)}
                className="w-full py-2 px-4 rounded-full bg-coy-surface hover:bg-coy-border text-coy-ink text-xs font-medium border border-coy-border transition-colors mt-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
