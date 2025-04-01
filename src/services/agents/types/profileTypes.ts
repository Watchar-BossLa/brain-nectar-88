
/**
 * Cognitive Profile Types
 */

export interface CognitiveProfile {
  userId: string;
  learningSpeed: Record<string, number>;
  preferredContentFormats: string[];
  knowledgeGraph: Record<string, any>;
  attentionSpan: number;
  retentionRates: Record<string, number>;
  lastUpdated: string;
}

export interface ProfileUpdateOptions {
  userId: string;
  newData: Partial<CognitiveProfile>;
}

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
