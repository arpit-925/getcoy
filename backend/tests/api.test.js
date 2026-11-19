import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Profile from '../models/Profile.js';
import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';
import connectDB from '../config/db.js';
import { isMutualMatch, sanitizeProfile, evaluateSwipe } from '../matching.js';

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
});

test.after(async () => {
  await mongoose.connection.close();
});

// -------------------------------------------------------------
// Unit Tests: Pure Matching Logic (matching.js)
// -------------------------------------------------------------
test('Unit: isMutualMatch returns true only on like + target liked user', () => {
  assert.equal(isMutualMatch('like', true), true);
  assert.equal(isMutualMatch('like', false), false);
  assert.equal(isMutualMatch('pass', true), false, 'Pass must never match even if liked');
  assert.equal(isMutualMatch('pass', false), false);
  assert.equal(isMutualMatch('invalid', true), false);
});

test('Unit: sanitizeProfile completely strips private like fields', () => {
  const mockRaw = {
    _id: '673f1234567890abcdef1234',
    name: 'Test Candidate',
    likedDemoUser: true,
    likesMe: true,
    likedYou: true,
    incomingLike: true,
    __v: 0,
  };

  const clean = sanitizeProfile(mockRaw);
  assert.equal(clean.likedDemoUser, undefined);
  assert.equal(clean.likesMe, undefined);
  assert.equal(clean.likedYou, undefined);
  assert.equal(clean.incomingLike, undefined);
  assert.equal(clean.__v, undefined);
  assert.equal(clean.name, 'Test Candidate');
});

test('Unit: evaluateSwipe returns correct matched payload shape', () => {
  const likedProfile = {
    _id: 'p1',
    name: 'Priya',
    likedDemoUser: true,
  };

  const matchRes = evaluateSwipe({ action: 'like', targetProfile: likedProfile });
  assert.equal(matchRes.matched, true);
  assert.equal(matchRes.match.name, 'Priya');
  assert.equal(matchRes.match.likedDemoUser, undefined);

  const passRes = evaluateSwipe({ action: 'pass', targetProfile: likedProfile });
  assert.equal(passRes.matched, false);
  assert.equal(passRes.match, undefined);
});

// -------------------------------------------------------------
// Integration Tests: REST APIs (supertest)
// -------------------------------------------------------------

test('1. like + existing like from profile => match', async () => {
  const testUserId = `test-user-${Date.now()}-1`;
  const secretCrush = await Profile.findOne({ likedDemoUser: true }).select('+likedDemoUser');
  assert.ok(secretCrush, 'Seeded profile with likedDemoUser: true must exist');

  const res = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: secretCrush._id.toString(),
      action: 'like',
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.matched, true);
  assert.ok(res.body.match, 'Must include match profile');
  assert.equal(res.body.match.name, secretCrush.name);
  assert.equal(res.body.match.likedDemoUser, undefined);

  // Check /matches
  const matchesRes = await request(app).get(`/api/matches?userId=${testUserId}`);
  assert.equal(matchesRes.status, 200);
  assert.equal(matchesRes.body.count, 1);
  assert.equal(matchesRes.body.matches[0].profile.name, secretCrush.name);
});

test('2. like without a prior like from profile => no match', async () => {
  const testUserId = `test-user-${Date.now()}-2`;
  const unrequited = await Profile.findOne({ likedDemoUser: false }).select('+likedDemoUser');
  assert.ok(unrequited, 'Seeded profile with likedDemoUser: false must exist');

  const res = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: unrequited._id.toString(),
      action: 'like',
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.matched, false);
  assert.equal(res.body.match, undefined);

  // Check /matches remains empty
  const matchesRes = await request(app).get(`/api/matches?userId=${testUserId}`);
  assert.equal(matchesRes.body.count, 0);
});

test('3. pass never creates a match', async () => {
  const testUserId = `test-user-${Date.now()}-3`;
  // Even if profile liked the user
  const secretCrush = await Profile.findOne({ likedDemoUser: true }).select('+likedDemoUser');

  const res = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: secretCrush._id.toString(),
      action: 'pass',
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.matched, false);
  assert.equal(res.body.match, undefined);

  // Matches must be empty
  const matchesRes = await request(app).get(`/api/matches?userId=${testUserId}`);
  assert.equal(matchesRes.body.count, 0);
});

test('4. swiped profiles never reappear in /feed', async () => {
  const testUserId = `test-user-${Date.now()}-4`;
  const profileToSwipe = await Profile.findOne();

  // Initial feed contains this profile
  const feed1 = await request(app).get(`/api/feed?userId=${testUserId}`);
  const initialIds = feed1.body.profiles.map((p) => String(p._id || p.id));
  assert.ok(initialIds.includes(String(profileToSwipe._id)));

  // Swipe on it
  await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: profileToSwipe._id.toString(),
      action: 'pass',
    });

  // Subsequent feed must exclude it
  const feed2 = await request(app).get(`/api/feed?userId=${testUserId}`);
  const subsequentIds = feed2.body.profiles.map((p) => String(p._id || p.id));
  assert.ok(!subsequentIds.includes(String(profileToSwipe._id)));
});

test('5. /feed JSON contains no field revealing who liked the user', async () => {
  const res = await request(app).get('/api/feed');
  assert.equal(res.status, 200);
  assert.ok(res.body.profiles.length > 0);

  for (const profile of res.body.profiles) {
    assert.equal(profile.likedDemoUser, undefined);
    assert.equal(profile.likesMe, undefined);
    assert.equal(profile.likedYou, undefined);
    assert.equal(profile.incomingLike, undefined);
    assert.equal(profile.isIncomingLike, undefined);
    assert.ok(profile.name);
    assert.ok(profile.photo);
  }
});

test('6. duplicate swipe on the same profile is handled safely (idempotent)', async () => {
  const testUserId = `test-user-${Date.now()}-6`;
  const crush = await Profile.findOne({ likedDemoUser: true }).select('+likedDemoUser');

  // First swipe: should produce match
  const res1 = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: crush._id.toString(),
      action: 'like',
    });
  assert.equal(res1.status, 200);
  assert.equal(res1.body.matched, true);

  // Second duplicate swipe: should be idempotent, returning same match without duplicate DB records
  const res2 = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: crush._id.toString(),
      action: 'like',
    });
  assert.equal(res2.status, 200);
  assert.equal(res2.body.matched, true);

  // Check DB counts for this user and profile
  const swipeCount = await Swipe.countDocuments({
    demoUserId: testUserId,
    profileId: crush._id,
  });
  const matchCount = await Match.countDocuments({
    demoUserId: testUserId,
    profileId: crush._id,
  });
  assert.equal(swipeCount, 1, 'Must have exactly 1 Swipe record');
  assert.equal(matchCount, 1, 'Must have exactly 1 Match record');
});

test('7. invalid profile ID / invalid action returns an error', async () => {
  const testUserId = `test-user-${Date.now()}-7`;

  // Invalid action
  const resBadAction = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: new mongoose.Types.ObjectId().toString(),
      action: 'superlike',
    });
  assert.equal(resBadAction.status, 400);
  assert.ok(resBadAction.body.error);

  // Invalid profileId format
  const resBadId = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: 'not-a-valid-object-id',
      action: 'like',
    });
  assert.equal(resBadId.status, 400);

  // Non-existent profile
  const resNotFound = await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: new mongoose.Types.ObjectId().toString(),
      action: 'like',
    });
  assert.equal(resNotFound.status, 404);
});

test('8. persistence: data is still there after querying database collections', async () => {
  const testUserId = `test-user-${Date.now()}-8`;
  const crush = await Profile.findOne({ likedDemoUser: true }).select('+likedDemoUser');

  // Perform swipe
  await request(app)
    .post('/api/swipe')
    .send({
      userId: testUserId,
      profileId: crush._id.toString(),
      action: 'like',
    });

  // Query MongoDB collections directly to ensure persistent storage
  const persistedSwipe = await Swipe.findOne({ demoUserId: testUserId, profileId: crush._id });
  const persistedMatch = await Match.findOne({ demoUserId: testUserId, profileId: crush._id });

  assert.ok(persistedSwipe, 'Swipe must be written to MongoDB');
  assert.equal(persistedSwipe.action, 'like');
  assert.ok(persistedMatch, 'Match must be written to MongoDB');
  assert.equal(String(persistedMatch.profileId), String(crush._id));
});
