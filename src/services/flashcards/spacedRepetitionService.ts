
/**
 * This file is now a facade that re-exports functionality from the 
 * specialized modules in the spaced-repetition directory.
 */

import { 
  spacedRepetitionService as service,
  SpacedRepetitionService,
  FlashcardReviewResult
} from './spaced-repetition';

// Export the types
export type { FlashcardReviewResult };

// Export the class for type definitions
export { SpacedRepetitionService };

// Export a singleton instance for direct use
export const spacedRepetitionService = service;
