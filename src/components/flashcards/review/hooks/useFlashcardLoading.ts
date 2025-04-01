
import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { getDueFlashcards } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for loading flashcards for review
 */
export const useFlashcardLoading = (
  setFlashcards: (cards: any[]) => void,
  setIsLoading: (loading: boolean) => void,
  setReviewComplete: (complete: boolean) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Load due flashcards
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await getDueFlashcards(user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFlashcards(data);
        } else {
          setReviewComplete(true);
        }
      } catch (err) {
        toast({
          title: 'Error loading flashcards',
          description: 'There was a problem loading your flashcards for review.',
          variant: 'destructive',
        });
        console.error('Error loading flashcards:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlashcards();
  }, [user, toast, setFlashcards, setIsLoading, setReviewComplete]);
};
