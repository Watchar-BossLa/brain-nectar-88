
import { CognitiveProfile } from '../types/profileTypes';

/**
 * Profile Update Options
 */
export interface ProfileUpdateOptions {
  userId: string;
  newData: Partial<CognitiveProfile>;
}

/**
 * Profile Analysis Result
 */
export interface ProfileAnalysisResult {
  userId: string;
  learningStyleStrengths: Record<string, number>;
  recommendedContentFormats: string[];
  attention: {
    optimalSessionLength: number;
    recommendedBreakFrequency: number;
  };
  timestamp: string;
}
