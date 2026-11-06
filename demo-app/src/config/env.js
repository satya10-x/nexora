import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

// Load environment variables from demo-app/.env
dotenv.config({ path: envPath });

if (!process.env.DEMO_USER_EMAIL) {
  throw new Error(
    '[ShopEase Demo App Config Error] Missing required environment variable: DEMO_USER_EMAIL. ' +
    'Please set DEMO_USER_EMAIL in your demo-app/.env file.'
  );
}

if (!process.env.DEMO_USER_PASSWORD) {
  throw new Error(
    '[ShopEase Demo App Config Error] Missing required environment variable: DEMO_USER_PASSWORD. ' +
    'Please set DEMO_USER_PASSWORD in your demo-app/.env file.'
  );
}

export const env = Object.freeze({
  PORT: process.env.DEMO_PORT || 4000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
  DEMO_USER_EMAIL: process.env.DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD: process.env.DEMO_USER_PASSWORD,
  DEMO_USER_NAME: process.env.DEMO_USER_NAME || 'Alex Morgan',
});

export default env;
