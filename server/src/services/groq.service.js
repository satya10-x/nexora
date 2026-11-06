import Groq from 'groq-sdk';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

let groqClient = null;

/**
 * Lazily initialize and return the Groq SDK client instance.
 * @returns {Groq}
 */
const getGroqClient = () => {
  if (!env.GROQ_API_KEY) {
    throw new ApiError(500, 'GROQ_API_KEY is not configured on the server');
  }
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: env.GROQ_API_KEY,
      timeout: 15000, // 15-second timeout for LLM calls
    });
  }
  return groqClient;
};

/**
 * Sanitizes strings to prevent any accidental exposure of the Groq API key.
 * @param {string} text
 * @returns {string}
 */
const sanitizeOutput = (text) => {
  if (typeof text !== 'string') return text;
  if (!env.GROQ_API_KEY) return text;
  return text.replaceAll(env.GROQ_API_KEY, '[REDACTED_GROQ_API_KEY]');
};

/**
 * Executes a verification test completion against the configured Groq model.
 * @param {string} prompt Prompt to evaluate
 * @returns {Promise<{ model: string, modelName: string, response: string, responseTimeMs: number }>}
 */
export const testGroqConnection = async (
  prompt = 'Explain in two sentences why automated software testing is important.'
) => {
  if (!env.GROQ_API_KEY) {
    throw new ApiError(500, 'GROQ_API_KEY is not configured in environment variables');
  }
  if (!env.GROQ_MODEL) {
    throw new ApiError(500, 'GROQ_MODEL is not configured in environment variables');
  }

  const client = getGroqClient();
  const startTime = Date.now();

  try {
    const completion = await client.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    const responseTimeMs = Date.now() - startTime;
    const content = completion.choices?.[0]?.message?.content?.trim() || '';

    return {
      model: env.GROQ_MODEL,
      modelName: env.GROQ_MODEL,
      response: sanitizeOutput(content),
      responseTimeMs,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;
    const rawMessage = error.message || 'Groq API request failed';
    const sanitizedMessage = sanitizeOutput(rawMessage);

    logger.error(`Groq integration test failed after ${responseTimeMs}ms: ${sanitizedMessage}`);

    // Map common Groq / OpenAI error types to appropriate HTTP status codes
    if (error.name === 'APIConnectionTimeoutError' || rawMessage.toLowerCase().includes('timeout')) {
      throw new ApiError(504, 'Groq API request timed out after 15 seconds');
    }
    if (error.status === 401 || error.name === 'AuthenticationError') {
      throw new ApiError(401, 'Groq authentication failed. Please verify GROQ_API_KEY.');
    }
    if (error.status === 429 || error.name === 'RateLimitError') {
      throw new ApiError(429, 'Groq API rate limit exceeded.');
    }
    if (error.status === 404 || error.name === 'NotFoundError') {
      throw new ApiError(404, `Groq model not found: ${env.GROQ_MODEL}`);
    }

    throw new ApiError(error.status || 502, `Groq API Error: ${sanitizedMessage}`);
  }
};

export default {
  testGroqConnection,
};

