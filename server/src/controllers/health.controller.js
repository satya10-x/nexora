import env from '../config/env.js';
import { getDbStatus } from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { testGroqConnection } from '../services/groq.service.js';

export const getHealth = asyncHandler(async (req, res) => {
  const hasGroq = Boolean(env.GROQ_API_KEY && env.GROQ_MODEL);
  const hasJira = Boolean(
    env.JIRA_BASE_URL &&
    env.JIRA_EMAIL &&
    env.JIRA_API_TOKEN &&
    env.JIRA_PROJECT_KEY
  );

  res.status(200).json({
    success: true,
    service: 'SentinelQA API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: getDbStatus(),
    integrations: {
      groq: hasGroq,
      jira: hasJira,
    },
  });
});

/**
 * Temporary development-only verification endpoint for Groq LLM integration.
 * POST /api/health/groq-test
 */
export const testGroq = asyncHandler(async (req, res) => {
  // Requirement 7: Restrict this endpoint to development mode
  if (env.NODE_ENV !== 'development') {
    throw new ApiError(403, 'The groq-test endpoint is restricted to development mode only.');
  }

  const prompt =
    req.body?.prompt || 'Explain in two sentences why automated software testing is important.';

  const result = await testGroqConnection(prompt);

  res.status(200).json({
    success: true,
    model: result.model,
    modelName: result.modelName,
    response: result.response,
    responseTimeMs: result.responseTimeMs,
  });
});

export default {
  getHealth,
  testGroq,
};
