/**
 * AI services index
 * This file exports all AI-related services and utilities
 */

import { AdaptiveLearningEngine, useAdaptiveLearning } from './AdaptiveLearningEngine';
import { runMigrations } from './database-migrations';

export {
  AdaptiveLearningEngine,
  useAdaptiveLearning,
  runMigrations
};
