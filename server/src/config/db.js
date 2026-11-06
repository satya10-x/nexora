import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.success(`MongoDB connected successfully [Host: ${conn.connection.host}]`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export const getDbStatus = () => {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost. State: disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB runtime connection error: ${err.message}`);
});

export default connectDB;

