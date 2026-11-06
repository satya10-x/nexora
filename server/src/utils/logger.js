const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  success: '\x1b[32m',
};

const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, ...args) => {
    console.log(`${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.info}[INFO]${colors.reset} ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.warn}[WARN]${colors.reset} ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.error}[ERROR]${colors.reset} ${message}`, ...args);
  },
  success: (message, ...args) => {
    console.log(`${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.success}[SUCCESS]${colors.reset} ${message}`, ...args);
  },
};

export default logger;

