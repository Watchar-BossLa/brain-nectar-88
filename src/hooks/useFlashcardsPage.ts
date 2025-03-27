
import { useState, useEffect } from 'react';
import { 
  getUserFlashcards, 
  getDueFlashcards, 
  getFlashcardStats,
  type FlashcardLearningStats 
} from '@/services/spacedRepetition';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  dueDate?: Date;
  lastReviewed?: Date;
  repetitionCount?: number;
  easinessFactor?: number;
  interval?: number;
  topicId?: string | null;
}

export function useFlashcardsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<FlashcardLearningStats>({
    totalCards: 0,
    dueCards: 0,
    masteredCards: 0,
    learningCards: 0,
    newCards: 0,
    reviewedToday: 0,
    averageRetention: 0,
    streakDays: 0
  });

  // Load flashcards and stats
  const loadFlashcards = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be API calls to get data from the backend
      const userFlashcards = await getUserFlashcards();
      const dueCards = await getDueFlashcards();
      const flashcardStats = await getFlashcardStats();
      
      setFlashcards(userFlashcards || []);
      setDueFlashcards(dueCards || []);
      setStats(flashcardStats || {
        totalCards: userFlashcards?.length || 0,
        dueCards: dueCards?.length || 0,
        masteredCards: 0,
        learningCards: 0,
        newCards: 0,
        reviewedToday: 0,
        averageRetention: 0,
        streakDays: 0
      });
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  // Create a new flashcard
  const handleCreateFlashcard = () => {
    setIsCreating(true);
    setActiveTab('create');
  };

  // Flashcard created handler
  const handleFlashcardCreated = () => {
    setIsCreating(false);
    setActiveTab('all');
    loadFlashcards();
  };

  // Start review handler
  const handleStartReview = () => {
    setActiveTab('review');
  };

  // Update stats handler
  const handleUpdateStats = () => {
    loadFlashcards();
  };

  return {
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    flashcards,
    dueFlashcards,
    isLoading,
    stats,
    handleCreateFlashcard,
    handleFlashcardCreated,
    handleStartReview,
    handleUpdateStats
  };
}
