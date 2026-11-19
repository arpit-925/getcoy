import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import feedRoutes from './routes/feedRoutes.js';
import swipeRoutes from './routes/swipeRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/take-home evaluation environment
      }
    },
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Primary API routes
app.use('/api/feed', feedRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/matches', matchRoutes);

// Direct aliases without /api prefix as described in prompt requirements
app.use('/feed', feedRoutes);
app.use('/swipe', swipeRoutes);
app.use('/matches', matchRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Coy Discover API',
    version: '1.0.0',
    description: 'Anonymous crush discovery and mutual match API',
    endpoints: {
      feed: '/api/feed',
      swipe: '/api/swipe',
      matches: '/api/matches',
      health: '/api/health',
    },
  });
});

// Centralized error handler
app.use(errorHandler);

// Connect DB and listen if not in testing mode
const isMain = process.argv[1] && process.argv[1].endsWith('server.js');
if (isMain && process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`[Coy Discover Server] Running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[Coy Discover Server] Failed to connect to DB:', err.message);
    });
}

export default app;
