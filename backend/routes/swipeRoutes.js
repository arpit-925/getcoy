import express from 'express';
import { handleSwipe } from '../controllers/swipeController.js';

const router = express.Router();

router.post('/', handleSwipe);

export default router;

