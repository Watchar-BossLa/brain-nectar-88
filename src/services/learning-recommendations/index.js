/**
 * Learning Recommendations Service
 * This file exports all learning recommendations-related services and utilities
 */

import { RecommendationService, useRecommendations } from './RecommendationService';
import { LearningProfileService, useLearningProfile } from './LearningProfileService';
import { ContentAnalysisService, useContentAnalysis } from './ContentAnalysisService';
import { runMigrations } from './database-migrations';

export {
  RecommendationService,
  useRecommendations,
  LearningProfileService,
  useLearningProfile,
  ContentAnalysisService,
  useContentAnalysis,
  runMigrations
};
