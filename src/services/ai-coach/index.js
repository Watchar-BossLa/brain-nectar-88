/**
 * AI Coach services index
 * This file exports all AI coach-related services and utilities
 */

import { AICoachProfileService, useAICoachProfile } from './AICoachProfileService';
import { AICoachSessionService, useAICoachSession } from './AICoachSessionService';
import { AICoachInsightService, useAICoachInsight } from './AICoachInsightService';
import { AICoachGoalService, useAICoachGoal } from './AICoachGoalService';
import { AICoachStudyPlanService, useAICoachStudyPlan } from './AICoachStudyPlanService';
import { runMigrations } from './database-migrations';

export {
  AICoachProfileService,
  useAICoachProfile,
  AICoachSessionService,
  useAICoachSession,
  AICoachInsightService,
  useAICoachInsight,
  AICoachGoalService,
  useAICoachGoal,
  AICoachStudyPlanService,
  useAICoachStudyPlan,
  runMigrations
};
