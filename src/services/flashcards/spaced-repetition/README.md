
# Spaced Repetition System

This directory contains the implementation of the Spaced Repetition System (SRS) used for flashcard review scheduling and retention optimization.

## Key Components

### Types (`types.ts`)

The system uses several key types to model the spaced repetition logic:

- `FlashcardReviewResult`: Records the outcome of a flashcard review session including difficulty rating and timing data.
- `RepetitionAlgorithmParams`: Configuration parameters for the spaced repetition algorithm.
- `ReviewResults`: The output of the algorithm, including next review date and mastery metrics.
- `FlashcardReviewStats`: Historical statistics about flashcard reviews to inform future scheduling.
- `RetentionCalculationParams`: Parameters used for calculating memory retention rates.
- `ReviewDifficulty`: Enumeration of difficulty ratings a user can provide for a card.

### Algorithm (`algorithm.ts`)

The implementation is based on the SuperMemo SM-2 algorithm with modifications for:
- Personalized retention curve modeling
- Dynamic difficulty adjustment
- Adaptive interval scaling

### Services

- `review-service.ts`: Handles the recording and processing of user reviews
- `retrieval-service.ts`: Manages the selection and prioritization of cards for review
- `stats-service.ts`: Tracks and analyzes user performance metrics

## Usage Guidelines

When integrating with the spaced repetition system:

1. Use the typed interfaces to ensure proper data exchange
2. Don't modify algorithm parameters without testing impact on retention curves
3. Always pass complete review data to get accurate scheduling

## Type Safety

The system uses strict TypeScript typing to prevent common errors:
- Difficulty ratings are constrained to valid enum values
- Review results follow a consistent structure
- Algorithm parameters are properly documented with appropriate constraints
