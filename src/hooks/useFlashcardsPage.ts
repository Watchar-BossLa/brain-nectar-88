
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Flashcard } from '@/types/supabase';

export const useFlashcardsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [currentReviewCard, setCurrentReviewCard] = useState<Flashcard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });

  useEffect(() => {
    if (user) {
      fetchFlashcards();
      fetchDueFlashcards();
      fetchStats();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFlashcards(data || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: 'Error fetching flashcards',
        description: 'There was a problem loading your flashcards.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDueFlashcards = async () => {
    if (!user) return;
    
    try {
      const dueCards = await spacedRepetitionService.getDueFlashcards(user.id);
      setDueFlashcards(dueCards);
      
      // Set the first due card for review if we're in review mode
      if (dueCards.length > 0 && isReviewing) {
        setCurrentReviewCard(dueCards[0]);
      }
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
    }
  };
  
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const flashcardStats = await spacedRepetitionService.getFlashcardStats(user.id);
      setStats(flashcardStats);
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
    }
  };

  const handleCreateFlashcard = () => {
    setIsCreating(true);
    setActiveTab('create');
  };

  const handleFlashcardCreated = () => {
    setIsCreating(false);
    setActiveTab('all');
    fetchFlashcards();
    fetchDueFlashcards();
    fetchStats();
    
    toast({
      title: 'Flashcard created',
      description: 'Your new flashcard has been added.',
    });
  };

  const handleStartReview = () => {
    if (dueFlashcards.length === 0) {
      toast({
        title: 'No cards to review',
        description: 'You don\'t have any flashcards due for review right now.',
      });
      return;
    }
    
    setIsReviewing(true);
    setCurrentReviewCard(dueFlashcards[0]);
    setActiveTab('review');
  };

  const handleCompleteReview = () => {
    // Move to the next card or finish review
    const currentIndex = dueFlashcards.findIndex(card => card.id === currentReviewCard?.id);
    if (currentIndex < dueFlashcards.length - 1) {
      // Move to next card
      setCurrentReviewCard(dueFlashcards[currentIndex + 1]);
    } else {
      // Finish review
      setIsReviewing(false);
      setCurrentReviewCard(null);
      fetchDueFlashcards();
      fetchStats();
      setActiveTab('all');
      
      toast({
        title: 'Review complete',
        description: 'Your progress has been saved.',
      });
    }
  };

  const handleUpdateStats = () => {
    fetchStats();
  };

  return {
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    flashcards,
    dueFlashcards,
    currentReviewCard,
    isLoading,
    isReviewing,
    stats,
    fetchFlashcards,
    handleCreateFlashcard,
    handleFlashcardCreated,
    handleStartReview,
    handleCompleteReview,
    handleUpdateStats
  };
};
