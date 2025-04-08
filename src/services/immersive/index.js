/**
 * Immersive learning services index
 * This file exports all immersive learning-related services and utilities
 */

import { ImmersiveLearningService, useImmersiveLearning } from './ImmersiveLearningService';
import { runMigrations } from './database-migrations';

export {
  ImmersiveLearningService,
  useImmersiveLearning,
  runMigrations
};
