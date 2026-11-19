# Coy Discover — Swipe-Based Crush Discovery

A standalone, mobile-first discovery experience inspired by swipe-based platforms like Tinder and Bumble, built as part of the **Coy SDE Internship Take-Home Assignment**.

Users can discover profiles, like or pass on them, and get notified when a mutual like creates a match. The application follows Coy's core privacy principle: **a user's incoming likes are never revealed unless a mutual match occurs.**

## Live Demo

- **Frontend:** https://getcoy.vercel.app
- **Backend API:** https://getcoy-backend.onrender.com
- **GitHub Repository:** https://github.com/arpit-925/getcoy

## Assignment Overview

The assignment required building a standalone Discover tab alongside a placeholder Home tab, without access to Coy's existing codebase.

The implementation focuses on:

- Displaying at least 30 seeded mock profiles.
- Providing a one-profile-at-a-time swipe experience.
- Supporting Like and Pass actions.
- Detecting mutual likes and creating matches.
- Keeping previously swiped profiles out of the feed.
- Persisting swipes and matches across page reloads.
- Protecting the privacy of users who have liked the demo user.

## Features

### 1. Discover Profiles

- Browse a collection of mock user profiles.
- Display one profile card at a time.
- Profile information includes:
  - Name
  - Age
  - Profile photo
  - Short bio
  - City or college
  - Interests
- Responsive, mobile-first interface.

### 2. Swipe Experience

- Swipe right to Like a profile.
- Swipe left to Pass on a profile.
- Drag gestures for mobile interaction.
- Like and Pass buttons for desktop interaction.
- Smooth card transitions and visual feedback.
- Previously swiped profiles are excluded from subsequent feeds.
- A clear empty state appears when no profiles remain.

### 3. Mutual Matching

A match is created only when both users have liked each other.

- Liking someone who has already liked the demo user creates a mutual match.
- An "It's a match!" experience is displayed when a mutual match is detected.
- The Matches page displays confirmed mutual matches.
- One-sided incoming likes are never exposed through the feed or matches API.

### 4. Privacy

Privacy is a core part of the application.

- Incoming likes are kept secret.
- Users only see profiles available for discovery.
- A profile that has already been liked or passed does not appear again.
- A match is revealed only after both users have liked each other.
- No endpoint exposes the list of people who have liked the demo user without a mutual match.

### 5. Persistent Data

MongoDB Atlas is used for persistent storage.

- Profile data is stored in the database.
- Swipe actions are recorded.
- Mutual matches are stored.
- Previously swiped profiles remain excluded after refreshing or reopening the application.

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript (ES6+)
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- JavaScript ES Modules
- Mongoose
- MongoDB Atlas
- CORS
- Morgan
- dotenv

### Deployment

- Vercel — Frontend hosting
- Render — Backend hosting
- MongoDB Atlas — Database hosting

## Application Architecture

```text
                 User
                  |
                  v
          React + Vite Frontend
                  |
          Axios HTTP Requests
                  |
                  v
          Express.js Backend
                  |
             API Routes
                  |
        +---------+---------+
        |         |         |
        v         v         v
       Feed     Swipe    Matches
        |         |         |
        +---------+---------+
                  |
                  v
             Mongoose
                  |
                  v
            MongoDB Atlas
```

## Project Structure

```text
getcoy/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── vercel.json
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   │   └── seed.js
│   ├── tests/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Backend API Documentation

The backend exposes the following REST API endpoints.

Base URL:

```text
https://getcoy-backend.onrender.com/api
```

### 1. Get Discover Feed

**Endpoint:** `GET /api/feed`

Returns profiles that the demo user has not previously swiped on.

```http
GET /api/feed
```

Expected behavior:

- Returns available discovery profiles.
- Excludes profiles already liked or passed.
- Does not reveal incoming one-sided likes.

### 2. Submit a Swipe

**Endpoint:** `POST /api/swipe`

Records a Like or Pass action.

```http
POST /api/swipe
Content-Type: application/json
```

Example request:

```json
{
  "profileId": "PROFILE_ID",
  "action": "like"
}
```

Supported actions:

- `like`
- `pass`

The API records the swipe and checks whether it creates a mutual match.

### 3. Get Matches

**Endpoint:** `GET /api/matches`

Returns confirmed mutual matches for the demo user.

```http
GET /api/matches
```

Expected behavior:

- Returns only mutual matches.
- Does not reveal profiles that have only liked the demo user.

### 4. Health Check

**Endpoint:** `GET /api/health`

Checks whether the backend is running.

```http
GET /api/health
```

## Database and Seed Data

The project includes a seed script that populates the database with mock profiles and incoming likes for demonstration.

Current demo dataset:

- **32 mock profiles**
- **13 profiles** have already liked the demo user.
- Swipes and matches are initially reset when the seed script is executed.

To seed the database:

```bash
cd backend
npm install
npm run seed
```

**Important:** The seed script cleans existing demo data before inserting the profiles. Running it again resets existing swipes and matches.

## Getting Started Locally

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account or a MongoDB connection
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/arpit-925/getcoy.git
cd getcoy
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Replace the MongoDB connection string with your own database URI. Do not commit your `.env` file.

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Seed the Database

Open another terminal:

```bash
cd backend
npm run seed
```

This inserts the mock profiles and prepares the initial demo state.

### 4. Configure the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend origin for CORS configuration |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

For production, configure:

```env
VITE_API_URL=https://getcoy-backend.onrender.com/api
```

Environment variables must be configured in the respective hosting dashboards for production deployment.

## Deployment

### Frontend — Vercel

- Import the GitHub repository.
- Set the Root Directory to `frontend`.
- Select Vite as the framework preset.
- Build Command: `npm run build`
- Output Directory: `dist`
- Add the `VITE_API_URL` environment variable.
- Deploy the application.

The project includes `frontend/vercel.json` for SPA route handling.

### Backend — Render

- Connect the GitHub repository.
- Set the Root Directory to `backend`.
- Build Command: `npm install`
- Start Command: `npm start`
- Configure the required backend environment variables.
- Deploy the service.

### Database — MongoDB Atlas

- Create a MongoDB Atlas database.
- Configure database network access and credentials.
- Set the MongoDB connection string in the Render environment variables.
- Run the seed script to populate the demo dataset.

## Testing

The backend includes an API test script.

Run:

```bash
cd backend
npm test
```

The following behaviors should be verified:

- Feed returns available profiles.
- Liking a profile records the swipe.
- Passing a profile records the swipe.
- Previously swiped profiles do not reappear.
- Mutual likes create matches.
- One-sided incoming likes remain private.
- Matches persist across page reloads.
- The application displays an empty state when no profiles remain.

## Design Decisions

### Single Demo User

External authentication was not required by the assignment. The application assumes a single logged-in demo user.

### Mock Profiles

Mock profiles are seeded into the database to make the discovery and matching experience demonstrable without requiring real user accounts.

### Privacy-First Matching

Incoming likes are intentionally hidden. Only mutual matches are returned to the user.

### Persistent Swipe State

Swipe records are stored in MongoDB rather than relying only on frontend state, ensuring that previously swiped profiles remain excluded after reloads.

## Assignment Requirements Checklist

| Assignment requirement | Implementation |
|---|---|
| Standalone application | React frontend and Express backend |
| Placeholder Home tab | Included |
| Discover tab | Included |
| At least 30 mock profiles | 32 seeded profiles |
| Profile details | Name, age, photo, bio, city/college, interests |
| Incoming likes for demo | 13 seeded incoming likes |
| One card at a time | Discover experience |
| Mobile drag gestures | Swipe interaction |
| Desktop Like/Pass buttons | Swipe controls |
| Smooth animations | Card transitions |
| No resurfacing swiped profiles | Backend-persisted swipe state |
| Empty state | Included |
| Mutual matching | Backend match detection |
| Match confirmation | Match experience |
| Matches view | Matches page |
| Hide one-sided likes | Privacy-preserving API behavior |
| GET /feed | Implemented |
| POST /swipe | Implemented |
| GET /matches | Implemented |
| Persistence across reloads | MongoDB Atlas |

## Limitations and Scope

- This is a standalone assignment implementation, not an integration with Coy's production codebase.
- The application assumes one demo user.
- Profiles and incoming likes are mock data.
- External authentication and real user registration are outside the assignment scope.

## Author

**Arpit Mishra**

- GitHub: https://github.com/arpit-925
- Project Repository: https://github.com/arpit-925/getcoy

---

Built as part of the Coy SDE Internship Take-Home Assignment.
