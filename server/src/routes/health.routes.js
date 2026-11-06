import { Router } from 'express';
import { getHealth, testGroq } from '../controllers/health.controller.js';

const router = Router();

router.get('/', getHealth);
router.post('/groq-test', testGroq);

export default router;
