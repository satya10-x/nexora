import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const requiredKeys = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(
      `[SentinelQA Config Error] Missing required environment variable: ${key}. ` +
      `Please define ${key} in your server/.env file.`
    );
  }
}

const optionalKeys = [
  'GROQ_API_KEY',
  'GROQ_MODEL',
  'JIRA_BASE_URL',
  'JIRA_EMAIL',
  'JIRA_API_TOKEN',
  'JIRA_PROJECT_KEY',
];

const missingOptionalKeys = optionalKeys.filter((key) => !process.env[key]);
if (missingOptionalKeys.length > 0) {
  logger.warn(
    `Optional environment variables not configured: ${missingOptionalKeys.join(', ')}. ` +
    `Related external integrations (Groq LLM / Jira) will run in disabled/mock state.`
  );
}

export const env = Object.freeze({
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || '',
  DEMO_APP_URL: process.env.DEMO_APP_URL || 'http://localhost:4000',
  JIRA_BASE_URL: process.env.JIRA_BASE_URL || '',
  JIRA_EMAIL: process.env.JIRA_EMAIL || '',
  JIRA_API_TOKEN: process.env.JIRA_API_TOKEN || '',
  JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY || '',
});

export default env;
