# Coy Discover

> **Coy Discover** is a standalone anonymous-crush discovery application built with React, Vite, Node.js, Express, MongoDB, Tailwind CSS, and Framer Motion for the Coy SDE Intern assignment.
> It introduces a swipe-based discovery interface where user interest is kept strictly private unless it is completely mutual.

---

## 🎨 Design Philosophy & Brand Identity

The interface avoids generic AI-generated templates, glowing gradient pills, and neon shadows in favor of a restrained, editorial dating product identity:
- **Warm cream background**: `#FAF6F0`
- **Near-black ink**: `#1A1715`
- **Single muted accent**: Deep rose / warm tomato `#D6455D`
- **Typography**: Display serif font (**Fraunces**) for wordmark, headings, and profile names, paired with **DM Sans** for legible body text.
- **Microcopy with voice**:
  - Pass action: *"Not this time"*
  - Like action: *"Maybe..."*
  - Empty state: *"Nobody left to judge. Check back soon."*
  - Match celebration: *"You two. Finally."*
  - Matches view: *"Mutual only. That's the whole point."*
- **Viewports**: Crafted to fit comfortably on 390×844 mobile screens (and up) without vertical clipping or awkward scrolling.

---

## 🔒 Privacy Architecture (Core Promise)

In Coy, an unrequited crush is never revealed to the recipient:
1. **Server-Side Field Stripping**:
   The `likedDemoUser` flag is defined with `select: false` in Mongoose and is stripped server-side from all `/feed` responses along with any potential aliases (`likesMe`, `likedYou`, `incomingLike`).
2. **Neutral Feed Ordering**:
   Unswiped profiles in `/feed` are randomized using a server-side Fisher-Yates shuffle. Position in the feed never leaks who has pre-liked you.
3. **Identical Signals for Non-Matches**:
   Passing and one-sided liking return the exact same HTTP 200 payload:
   ```json
   { "matched": false }
   ```
   No counts, badges, or header variations are sent for unrequited likes.
4. **Idempotent Swipes**:
   Repeat swipes on the same profile return the existing match status without duplicating records in MongoDB or throwing client errors.

---

## 👥 Demo Profiles & Guaranteed Mutual Matches

The database seeds **32 distinct, realistic Indian profiles** across top colleges (IITs, St. Xavier's, BITS Pilani, NIFT, LSR, COEP).

To test mutual matches during a demo, the following seeded profiles have **already liked the demo user** (`likedDemoUser: true`):
- **Priya Sharma** (21, Architecture student, BMS College, Bengaluru)
- **Ananya Sen** (20, Literature major, St. Xavier's College, Kolkata)
- **Tara Iyer** (22, Neuroscience researcher, TIFR Mumbai)
- **Meera Nambiar** (23, Classical dancer & coder, CUSAT, Kochi)
- **Sanya Kapoor** (21, Fashion communication, NIFT Delhi)
- **Zoya Akhtar** (22, Psychology major, Christ University, Bengaluru)

Liking any of these profiles immediately triggers the **"You two. Finally."** match screen and adds them to your `/matches` view. Liking any profile without a pre-existing like (e.g. *Rohan Deshmukh*, *Kabir Malhotra*, *Arjun Singhal*) records the swipe but produces no match.

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB running on `127.0.0.1:27017` (or configured via `MONGO_URI` in `backend/.env`)

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds 32 profiles and resets swipes/matches
npm test         # Runs automated unit & integration test suite
npm start        # Starts server on http://localhost:5000
```

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts Vite on http://localhost:5173
```

---

## 📡 API Contract

### 1. `GET /feed` (or `GET /api/feed`)
Returns unswiped profiles for the active user, randomly shuffled, with all private like flags stripped.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "id": "673f...",
      "name": "Priya Sharma",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture student obsessed with brutalist buildings...",
      "city": "Bengaluru",
      "college": "BMS College of Architecture",
      "interests": ["Architecture", "Filter Coffee", "Indie Music"]
    }
  ]
}
```

### 2. `POST /swipe` (or `POST /api/swipe`)
Records a swipe action (`"like"` or `"pass"`).

**Request Body:**
```json
{
  "profileId": "673f...",
  "action": "like"
}
```

**Response on Mutual Match (200 OK):**
```json
{
  "matched": true,
  "match": {
    "id": "673f...",
    "name": "Priya Sharma",
    "age": 21,
    "photo": "https://images.unsplash.com/...",
    "bio": "...",
    "city": "Bengaluru",
    "college": "BMS College of Architecture",
    "interests": ["Architecture", "Filter Coffee"]
  }
}
```

**Response on Non-Match or Pass (200 OK):**
```json
{
  "matched": false
}
```

### 3. `GET /matches` (or `GET /api/matches`)
Returns confirmed mutual matches only.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": "673f...",
      "createdAt": "2026-11-19T05:00:00.000Z",
      "profile": {
        "id": "673f...",
        "name": "Priya Sharma",
        "age": 21,
        "photo": "https://images.unsplash.com/...",
        "bio": "...",
        "city": "Bengaluru",
        "college": "BMS College of Architecture",
        "interests": ["Architecture", "Filter Coffee"]
      }
    }
  ]
}
```

---

## 🧪 Automated Tests

The test suite in `backend/tests/api.test.js` covers:
- Pure unit tests of `backend/matching.js` (`isMutualMatch`, `sanitizeProfile`, `evaluateSwipe`)
- Like + existing like from profile => produces mutual match
- Like without prior like from profile => produces no match
- Pass action => never creates a match
- Swiped profiles => never reappear in `/feed` across reloads
- Privacy assertion => `/feed` JSON contains no `likedDemoUser`, `likesMe`, or incoming like fields
- Idempotency => duplicate swipes on the same profile do not corrupt or duplicate data
- Input validation => invalid action, invalid ObjectId, or non-existent profile returns 400/404
- Storage persistence => data persists in MongoDB across operations

Run tests:
```bash
cd backend && npm test
```

---

## 🛠️ Project Structure

```text
getcoy/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── feedController.js     # /feed handler with shuffle & privacy filter
│   │   ├── swipeController.js    # /swipe handler with serialized writes & idempotency
│   │   └── matchController.js    # /matches handler
│   ├── data/profiles.json        # 32 seeded mock profiles
│   ├── matching.js               # Pure matching logic (unit-testable)
│   ├── models/                   # Profile, Swipe, Match Mongoose models
│   ├── routes/                   # Express routes with /api and direct aliases
│   ├── scripts/seed.js           # Database reset and seeder
│   ├── server.js                 # Express application
│   └── tests/api.test.js         # Integration and unit tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BottomNavigation.jsx  # Mobile 3-tab navigation bar
│   │   │   ├── EmptyState.jsx        # Handcrafted empty state illustration
│   │   │   ├── InterestTags.jsx      # Neutral outline interest chips
│   │   │   ├── LoadingSkeleton.jsx   # Card loading placeholder
│   │   │   ├── MatchModal.jsx        # "You two. Finally." celebration modal
│   │   │   ├── Navbar.jsx            # Desktop top navigation
│   │   │   ├── ProfileCard.jsx       # 3-card stack, gestures, LIKE/PASS stamps
│   │   │   └── SwipeButtons.jsx      # "Not this time" & "Maybe..." buttons
│   │   ├── hooks/useFeed.js          # Optimistic swipe queue & rollback
│   │   ├── pages/
│   │   │   ├── Discover.jsx          # Swipe discovery experience
│   │   │   ├── Home.jsx              # Intentionally minimal placeholder
│   │   │   └── Matches.jsx           # Responsive mutual matches grid
│   │   ├── services/api.js           # Axios API client
│   │   ├── App.jsx                   # Layout shell & routes
│   │   └── index.css                 # Custom scrollbars & Tailwind base
│   ├── index.html                    # Fraunces & DM Sans typography
│   └── tailwind.config.js            # Coy color palette & radii
└── README.md
```
