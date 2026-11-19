import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import app from '../server.js';
import Profile from '../models/Profile.js';
import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';
import connectDB from '../config/db.js';

// Helper to make fast internal HTTP requests against Express app
const request = async (method, path, body = null) => {
  const server = app.listen(0);
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}${path}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json();
    return { status: res.status, data };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
});

test.after(async () => {
  await mongoose.connection.close();
});

test('Scenario 1: GET /api/feed returns profiles and strictly protects privacy', async () => {
  const { status, data } = await request('GET', '/api/feed');
  assert.equal(status, 200);
  assert.equal(data.success, true);
  assert.ok(data.profiles.length > 0, 'Feed should return available profiles');

  // Verify privacy: likedDemoUser must NEVER exist on any feed profile
  for (const profile of data.profiles) {
    assert.equal(profile.likedDemoUser, undefined, 'likedDemoUser must NOT be exposed in feed');
    assert.ok(profile.name, 'Profile must have name');
    assert.ok(profile.photo, 'Profile must have photo');
    assert.ok(profile.bio, 'Profile must have bio');
  }
});

test('Scenario 2: Like a profile that has NOT liked demo user -> No match created & profile excluded on subsequent feed', async () => {
  const testUserId = `test-user-${Date.now()}`;

  // Find a profile where likedDemoUser is false
  const notLikedProfile = await Profile.findOne({ likedDemoUser: false }).select('+likedDemoUser');
  assert.ok(notLikedProfile, 'Should find profile with likedDemoUser: false');

  // Perform 'like' swipe
  const { status, data } = await request('POST', '/api/swipe', {
    userId: testUserId,
    profileId: notLikedProfile._id.toString(),
    action: 'like',
  });

  assert.equal(status, 200);
  assert.equal(data.success, true);
  assert.equal(data.matched, false, 'Should NOT create match when mutual like is missing');
  assert.equal(data.match, undefined, 'Should not return match object');

  // Verify profile is now excluded from the user feed
  const feedRes = await request('GET', `/api/feed?userId=${testUserId}`);
  const ids = feedRes.data.profiles.map((p) => p._id);
  assert.ok(!ids.includes(notLikedProfile._id.toString()), 'Swiped profile must not appear in feed');
});

test('Scenario 3: Like a profile that HAS liked demo user -> Mutual match created and appears in /api/matches', async () => {
  const testUserId = `test-user-${Date.now()}`;

  // Find a profile with likedDemoUser: true
  const secretCrushProfile = await Profile.findOne({ likedDemoUser: true }).select('+likedDemoUser');
  assert.ok(secretCrushProfile, 'Should find profile with likedDemoUser: true');

  // Perform 'like' swipe
  const { status, data } = await request('POST', '/api/swipe', {
    userId: testUserId,
    profileId: secretCrushProfile._id.toString(),
    action: 'like',
  });

  assert.equal(status, 200);
  assert.equal(data.success, true);
  assert.equal(data.matched, true, 'Mutual like must result in a match');
  assert.ok(data.match, 'Match payload must be returned on mutual match');
  assert.equal(data.match.profile.name, secretCrushProfile.name);

  // Fetch /api/matches
  const matchRes = await request('GET', `/api/matches?userId=${testUserId}`);
  assert.equal(matchRes.status, 200);
  assert.equal(matchRes.data.success, true);
  assert.equal(matchRes.data.count, 1);
  assert.equal(matchRes.data.matches[0].profile.name, secretCrushProfile.name);
  assert.equal(matchRes.data.matches[0].profile.likedDemoUser, undefined, 'Privacy preserved in matches');
});

test('Scenario 4: Pass action never creates match and removes profile from feed', async () => {
  const testUserId = `test-user-${Date.now()}`;

  // Choose a profile that liked demo user, but user passes
  const secretCrushProfile = await Profile.findOne({ likedDemoUser: true }).select('+likedDemoUser');

  const { status, data } = await request('POST', '/api/swipe', {
    userId: testUserId,
    profileId: secretCrushProfile._id.toString(),
    action: 'pass',
  });

  assert.equal(status, 200);
  assert.equal(data.success, true);
  assert.equal(data.matched, false, 'Passing must NEVER create a match even if they liked you');

  // Verify matches list is empty
  const matchRes = await request('GET', `/api/matches?userId=${testUserId}`);
  assert.equal(matchRes.data.count, 0);

  // Verify excluded from feed
  const feedRes = await request('GET', `/api/feed?userId=${testUserId}`);
  const ids = feedRes.data.profiles.map((p) => p._id);
  assert.ok(!ids.includes(secretCrushProfile._id.toString()), 'Passed profile must not appear in feed');
});

test('Scenario 5: Duplicate swipe prevention (409 Conflict)', async () => {
  const testUserId = `test-user-${Date.now()}`;
  const profile = await Profile.findOne();

  // First swipe
  const res1 = await request('POST', '/api/swipe', {
    userId: testUserId,
    profileId: profile._id.toString(),
    action: 'like',
  });
  assert.equal(res1.status, 200);

  // Duplicate swipe
  const res2 = await request('POST', '/api/swipe', {
    userId: testUserId,
    profileId: profile._id.toString(),
    action: 'like',
  });
  assert.equal(res2.status, 409, 'Duplicate swipe must return 409 Conflict');
  assert.equal(res2.data.success, false);
});

