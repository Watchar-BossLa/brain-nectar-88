/**
 * Flashcard component prop types
 */

/**
 * @typedef {import('../flashcard').Flashcard} Flashcard
 * @typedef {import('../flashcard').FlashcardLearningStats} FlashcardLearningStats
 */

/**
 * @typedef {Object} FlashcardListHeaderProps
 * @property {Function} onAddNew - Callback when adding a new flashcard
 */

/**
 * @typedef {Object} EmptyFlashcardStateProps
 * @property {Function} onAddNew - Callback when adding a new flashcard
 */

/**
 * @typedef {Object} FlashcardGridProps
 * @property {Flashcard[]} flashcards - Array of flashcards to display
 * @property {Function} [onDelete] - Callback when deleting a flashcard
 * @property {Function} [onCardUpdated] - Callback when a card is updated
 */

/**
 * @typedef {Object} FlashcardsHeaderProps
 * @property {boolean} isCreating - Whether the user is creating a flashcard
 * @property {Function} onCreateSimpleFlashcard - Callback to create a simple flashcard
 * @property {Function} onCreateAdvancedFlashcard - Callback to create an advanced flashcard
 */

/**
 * @typedef {Object} FlashcardsEmptyStateProps
 * @property {string} title - Title for the empty state
 * @property {string} description - Description for the empty state
 * @property {Function} onCreateSimpleFlashcard - Callback to create a simple flashcard
 * @property {Function} onCreateAdvancedFlashcard - Callback to create an advanced flashcard
 */

/**
 * @typedef {Object} DeleteFlashcardDialogProps
 * @property {boolean} isOpen - Whether the dialog is open
 * @property {Function} onOpenChange - Callback when the open state changes
 * @property {Function} onConfirm - Callback when deletion is confirmed
 */

/**
 * @typedef {Object} FlashcardStatsProps
 * @property {Object} stats - Statistics about flashcards
 * @property {number} stats.totalCards - Total number of cards
 * @property {number} stats.masteredCards - Number of mastered cards
 * @property {number} stats.dueCards - Number of cards due for review
 * @property {number} stats.reviewsToday - Number of reviews completed today
 * @property {number} stats.averageDifficulty - Average difficulty rating
 */

/**
 * @typedef {Object} FlashcardPreviewProps
 * @property {string} frontContent - Content for the front of the card
 * @property {string} backContent - Content for the back of the card
 * @property {boolean} [useLatex] - Whether to use LaTeX rendering
 */

/**
 * @typedef {Object} DifficultyRatingButtonsProps
 * @property {Function} onRate - Callback when a rating is selected
 * @property {number|null} selectedRating - The currently selected rating
 * @property {boolean} [isSubmitting] - Whether the form is submitting
 */

/**
 * @typedef {Object} FlashcardContentProps
 * @property {string} content - The content to display
 * @property {boolean} [isAnswer] - Whether this is the answer side
 * @property {Function} [onClick] - Callback when clicked
 * @property {boolean} [isFlipped] - Whether the card is flipped
 */

/**
 * @typedef {Object} MemoryRetentionIndicatorProps
 * @property {number} retention - The retention percentage
 * @property {number} repetitionCount - Number of repetitions
 */

/**
 * @typedef {Object} ContentTypeSelectorProps
 * @property {'text'|'formula'|'financial'} contentType - The type of content
 * @property {Function} setContentType - Callback to set the content type
 * @property {Function} setUseLatex - Callback to set whether to use LaTeX
 */

/**
 * @typedef {Object} FinancialContentInputProps
 * @property {string} frontContent - Content for the front of the card
 * @property {Function} setFrontContent - Callback to set front content
 * @property {string} backContent - Content for the back of the card
 * @property {Function} setBackContent - Callback to set back content
 * @property {string} financialType - The type of financial content
 * @property {Function} setFinancialType - Callback to set financial type
 */

/**
 * @typedef {Object} FormButtonsProps
 * @property {boolean} isSubmitting - Whether the form is submitting
 * @property {Function} onCancel - Callback when cancelled
 * @property {string} frontContent - Content for the front of the card
 * @property {string} backContent - Content for the back of the card
 */

/**
 * @typedef {Object} FormulaContentInputProps
 * @property {string} frontContent - Content for the front of the card
 * @property {Function} setFrontContent - Callback to set front content
 * @property {string} backContent - Content for the back of the card
 * @property {Function} setBackContent - Callback to set back content
 */

/**
 * @typedef {Object} TextContentInputProps
 * @property {string} frontContent - Content for the front of the card
 * @property {Function} setFrontContent - Callback to set front content
 * @property {string} backContent - Content for the back of the card
 * @property {Function} setBackContent - Callback to set back content
 */

/**
 * @typedef {Object} EmptyReviewStateProps
 * @property {Function} [onRefresh] - Callback to refresh
 */

/**
 * @typedef {Object} FlashcardViewProps
 * @property {Flashcard} flashcard - The flashcard to display
 * @property {boolean} isFlipped - Whether the card is flipped
 * @property {Function} onFlip - Callback when flipped
 * @property {Function} [onRating] - Callback when rated
 */

/**
 * @typedef {Object} LoadingSkeletonProps
 * @property {string} [message] - Loading message
 */

/**
 * @typedef {Object} RatingButtonsProps
 * @property {boolean} isFlipped - Whether the card is flipped
 * @property {Function} onRating - Callback when rated
 * @property {Function} [onSkip] - Callback when skipped
 * @property {Function} onRevealAnswer - Callback to reveal the answer
 */

/**
 * @typedef {Object} ReviewHeaderProps
 * @property {number} reviewsCompleted - Number of reviews completed
 * @property {number} totalToReview - Total number to review
 */

/**
 * @typedef {Object} ReviewCardProps
 * @property {Flashcard} [flashcard] - The flashcard to review
 * @property {Flashcard} [currentCard] - The current card
 * @property {boolean} isFlipped - Whether the card is flipped
 * @property {Function} onFlip - Callback when flipped
 * @property {Function} [onRate] - Callback when rated
 */

/**
 * @typedef {Object} ReviewCompleteProps
 * @property {Object} [stats] - Review statistics
 * @property {number} stats.easy - Number rated easy
 * @property {number} stats.medium - Number rated medium
 * @property {number} stats.hard - Number rated hard
 * @property {number} stats.averageRating - Average rating
 * @property {number} stats.totalReviewed - Total number reviewed
 * @property {Function} [onComplete] - Callback when complete
 */

/**
 * @typedef {Object} ReviewLoadingProps
 * @property {string} [message] - Loading message
 */

/**
 * @typedef {Object} ReviewProgressProps
 * @property {number} currentIndex - Current index
 * @property {number} totalCards - Total number of cards
 */

/**
 * @typedef {Object} AllFlashcardsTabProps
 * @property {boolean} isLoading - Whether data is loading
 * @property {Flashcard[]} flashcards - Array of flashcards
 * @property {Function} onDeleteFlashcard - Callback when a flashcard is deleted
 * @property {Function} onCardUpdated - Callback when a card is updated
 * @property {Function} onCreateSimpleFlashcard - Callback to create a simple flashcard
 * @property {Function} onCreateAdvancedFlashcard - Callback to create an advanced flashcard
 */

/**
 * @typedef {Object} CreateFlashcardTabProps
 * @property {boolean} isAdvancedForm - Whether to show the advanced form
 * @property {Function} onFlashcardCreated - Callback when a flashcard is created
 * @property {Function} onCancel - Callback when cancelled
 */

/**
 * @typedef {Object} DueFlashcardsTabProps
 * @property {Flashcard[]} flashcards - Array of flashcards
 * @property {Function} onStartReview - Callback to start review
 * @property {Function} onDeleteFlashcard - Callback when a flashcard is deleted
 * @property {Function} onCardUpdated - Callback when a card is updated
 * @property {Function} onCreateSimpleFlashcard - Callback to create a simple flashcard
 * @property {Function} onCreateAdvancedFlashcard - Callback to create an advanced flashcard
 */

export {};
