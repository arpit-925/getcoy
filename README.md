# Coy Discover – Full Stack SDE Intern Assignment

> **Coy Discover** is a high-performance, privacy-first swipe-based discovery platform inspired by Coy's core premise: an anonymous crush platform where your identity and interest are only revealed when the feeling is 100% mutual.

Built with the **MERN** stack (React.js, Node.js, Express, MongoDB, Tailwind CSS, Framer Motion, and Lucide React) for the Coy SDE Intern take-home assignment.

---

## 📸 Overview & Features

### Core Capabilities
1. **Interactive Fluid Swiping**:
   - Touch gestures and mouse drag physics with **Framer Motion** (`drag="x"`, spring velocity, dynamic card rotation).
   - Dynamic **LIKE** (#F53683) and **PASS** visual stamp indicators based on swipe distance and velocity.
   - Dedicated floating action buttons with keyboard shortcuts (`←` for Pass, `→` for Like).
   - Immediate double-submit prevention and debounced gesture locks during transitions.

2. **Genuine Privacy-First Mutual Matching**:
   - **One-Sided Likes Kept Secret**: Users who like you are never leaked in the feed, API responses, or frontend payloads.
   - **Mutual Attraction Trigger**: A match is created *only* when both the demo user and the profile like each other.
   - **Celebration Modal**: "It's a Match!" celebration with confetti burst, pulsing mutual hearts, and side-by-side circular avatars.

3. **Persistent Feed State**:
   - Swiped profiles (both liked and passed) are permanently tracked in MongoDB and will **never reappear** across page reloads or browser restarts.
   - Clean empty state with friendly copy and a "Reset Demo Feed" action for testing.

4. **Mutual Matches Tab**:
   - Displays all confirmed mutual matches with real-time badge count synchronization.
   - Click to inspect full profile details (college, city, bio, and pill-shaped interest tags).

5. **Responsive & Coy-Inspired Brand Design**:
   - Palette: Primary `#F53683`, Background `#FAF8FC`, White cards, Dark text `#19151F`, Muted grey `#716B7B`.
   - Desktop: Sticky top navigation with active tab indicator and Demo user avatar.
   - Mobile: Compact top header and bottom tab bar (`Home`, `Discover`, `Matches`).
   - Clean typography using the **Inter** font family.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (Vite), JavaScript (ES Modules), Tailwind CSS, Framer Motion, Lucide React, Axios, React Router DOM, Canvas-Confetti |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Morgan, Dotenv, CORS |
| **Database** | MongoDB with compound indexes for duplicate prevention |
| **Testing** | Node.js Native Test Runner (`node:test`, `node:assert`) |

---

## 📁 Project Structure

```text
getcoy/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/
│   │   ├── feedController.js     # GET /api/feed logic with strict privacy projections
│   │   ├── swipeController.js    # POST /api/swipe logic & mutual match evaluation
│   │   └── matchController.js    # GET /api/matches & reset helpers
│   ├── data/
│   │   └── profiles.json         # 32 diverse, realistic Indian mock profiles
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── Match.js              # Match schema with unique compound index
│   │   ├── Profile.js            # Profile schema with hidden likedDemoUser flag
│   │   └── Swipe.js              # Swipe schema with unique index per user/profile
│   ├── routes/
│   │   ├── feedRoutes.js
│   │   ├── matchRoutes.js
│   │   └── swipeRoutes.js
│   ├── scripts/
│   │   └── seed.js               # Database seeder (cleans and seeds 32 profiles)
│   ├── tests/
│   │   └── api.test.js           # Comprehensive automated API & privacy test suite
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express application entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BottomNavigation.jsx # Mobile navigation bar
│   │   │   ├── EmptyState.jsx       # Polished empty state with action CTAs
│   │   │   ├── InterestTags.jsx     # Pill-shaped tags
│   │   │   ├── LoadingSkeleton.jsx  # Shimmer card skeleton
│   │   │   ├── MatchModal.jsx       # Celebration modal with confetti
│   │   │   ├── Navbar.jsx           # Desktop navigation header
│   │   │   ├── ProfileCard.jsx      # Framer Motion draggable card with stamps
│   │   │   └── SwipeButtons.jsx     # Like and Pass action controls
│   │   ├── hooks/
│   │   │   └── useFeed.js           # Feed state, swipe queue, and match management
│   │   ├── pages/
│   │   │   ├── Discover.jsx         # Primary discovery experience
│   │   │   ├── Home.jsx             # Minimalist placeholder
│   │   │   └── Matches.jsx          # Mutual matches grid & inspection modal
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.jsx                  # Route definitions and layout shell
│   │   ├── index.css                # Tailwind directives and custom utilities
│   │   └── main.jsx                 # React root mounting
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js           # Brand colors (#F53683) and styling
│   └── vite.config.js
└── README.md
```

---

## 🚀 Local Installation & Setup

### Prerequisites
- **Node.js** >= 18.x (tested on v24)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas connection string

### 1. Clone & Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Seed MongoDB with 32 realistic mock profiles
npm run seed

# Run automated backend test suite
npm test

# Start the backend server (runs on http://localhost:5000)
npm start
```

### 2. Setup Frontend
In a separate terminal:
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 🔒 API Documentation & Privacy Guarantees

### 1. `GET /api/feed`
Returns unswiped profiles for the active demo user.

- **Privacy Guarantee**: `likedDemoUser` is excluded from both the Mongoose schema default select and explicit projection (`.select('-likedDemoUser -__v')`). Clients can never determine incoming likes ahead of time.
- **Filtering**: Profiles with existing `Swipe` records (whether `'like'` or `'pass'`) are excluded via `$nin`.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "_id": "673f...",
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

---

### 2. `POST /api/swipe`
Records a user's swipe action on a profile.

**Request Body:**
```json
{
  "profileId": "673f...",
  "action": "like"
}
```
*(action can be `"like"` or `"pass"`)*

- **Duplicate Swipe Handling**: Returns `409 Conflict` if the profile has already been swiped on.
- **Mutual Match Evaluation**: Checks if `targetProfile.likedDemoUser === true` strictly on the server.
- **Privacy Guarantee**: If `matched: false`, no incoming like data is revealed.

**Response on Mutual Match (200 OK):**
```json
{
  "success": true,
  "matched": true,
  "match": {
    "id": "673f...",
    "profile": {
      "id": "673f...",
      "name": "Priya Sharma",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "city": "Bengaluru",
      "college": "BMS College of Architecture",
      "bio": "...",
      "interests": ["Architecture", "Filter Coffee"]
    }
  }
}
```

**Response on Non-Match or Pass (200 OK):**
```json
{
  "success": true,
  "matched": false
}
```

---

### 3. `GET /api/matches`
Returns all mutual matches for the demo user.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": "673f...",
      "createdAt": "2026-11-19T00:15:28.915Z",
      "profile": {
        "id": "673f...",
        "name": "Priya Sharma",
        "age": 21,
        "photo": "https://images.unsplash.com/...",
        "bio": "Architecture student...",
        "city": "Bengaluru",
        "college": "BMS College of Architecture",
        "interests": ["Architecture", "Filter Coffee"]
      }
    }
  ]
}
```

---

### 4. `POST /api/matches/reset`
Convenience development endpoint to clear the demo user's swipes and matches so the evaluator can test multiple discovery sessions.

---

## 🧪 Testing Scenarios (Automated Suite)

The automated test suite (`backend/tests/api.test.js`) validates all five assignment scenarios:

1. **Scenario 1**: `GET /api/feed` returns profiles and strictly verifies that `likedDemoUser` is absent.
2. **Scenario 2**: Liking a profile that hasn't liked the demo user produces `matched: false`, no match object, and permanently excludes the profile from subsequent feeds.
3. **Scenario 3**: Liking a profile that has liked the demo user creates an immediate mutual match, returns the full matched profile, and makes it accessible in `GET /api/matches`.
4. **Scenario 4**: Passing a profile never creates a match even if they liked the user, and removes it from the feed across reloads.
5. **Scenario 5**: Duplicate swipes on the same profile return `409 Conflict`.

Run all tests:
```bash
cd backend && npm test
```

---

## 📱 Interactive User Journey (Demo Flow)

1. Open `http://localhost:5173/discover`.
2. Observe the current profile card with high-resolution photo, name, college, city, bio, and interest tags.
3. Swipe **Right** or click the **Heart** button:
   - If that person secretly liked you (e.g. Priya Sharma, Ananya Sen, Meera Nambiar), the **"It's a Match!" celebration modal** appears with confetti and dual avatars!
4. Swipe **Left** or click the **X** button:
   - The card smoothly passes and is permanently dismissed.
5. Navigate to the **Matches** tab:
   - View your confirmed mutual matches in a responsive card grid. Click any card to inspect their complete bio.
6. Refresh the browser at any time:
   - Notice that none of the swiped profiles ever reappear.
7. Upon swiping all 32 profiles:
   - An elegant empty state appears with a one-click button to reset the demo feed.

---

## 🚢 Deployment Guidelines

- **Frontend**: Deployable to **Vercel** / **Netlify** / **Cloudflare Pages** by running `npm run build` and serving the `dist/` directory. Set `VITE_API_URL` to the production backend URL.
- **Backend**: Deployable to **Render**, **Railway**, or **AWS EC2/Elastic Beanstalk**. Set `MONGO_URI` to a MongoDB Atlas cluster URI and `CLIENT_URL` to your production frontend domain.

