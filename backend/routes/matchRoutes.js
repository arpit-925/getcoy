import express from 'express';
import { getMatches, resetDemoData } from '../controllers/matchController.js';

const router = express.Router();

router.get('/', getMatches);
router.post('/reset', resetDemoData);

export default router;

