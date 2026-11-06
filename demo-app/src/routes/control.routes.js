import { Router } from 'express';
import {
  getState,
  updateMutations,
  updateBugs,
  resetToggles,
  randomizeToggles,
} from '../state/toggles.js';

const router = Router();

// GET /__control/health -> health probe
router.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// GET /__control/state -> current toggle state
router.get('/state', (req, res) => {
  res.status(200).json(getState());
});

// POST /__control/mutations -> merge mutation toggles
router.post('/mutations', (req, res) => {
  try {
    const newState = updateMutations(req.body);
    return res.status(200).json(newState);
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// POST /__control/bugs -> merge bug toggles
router.post('/bugs', (req, res) => {
  try {
    const newState = updateBugs(req.body);
    return res.status(200).json(newState);
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// POST /__control/reset -> reset all toggles to false
router.post('/reset', (req, res) => {
  const newState = resetToggles();
  return res.status(200).json(newState);
});

// POST /__control/randomize -> enable random mutations & optional bug
router.post('/randomize', (req, res) => {
  const { count = 2, includeBugs = false } = req.body || {};

  if (typeof count !== 'number' || count < 1 || count > 6) {
    return res.status(400).json({
      success: false,
      error: 'Count must be an integer between 1 and 6',
    });
  }

  if (typeof includeBugs !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'includeBugs must be a boolean',
    });
  }

  const result = randomizeToggles({ count, includeBugs });
  return res.status(200).json(result);
});

export default router;

