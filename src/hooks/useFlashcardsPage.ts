
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/flashcards';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface FlashcardHookResult {
  flashcards: Flashcard[];
  loading: boolean;
  reloadFlashcards: () => Promise<void>;
  dueFlashcards?: Flashcard[];
  stats?: {
    total: number;
    mastered: number;
    learning: number;
    due: number;
  };
  refreshFlashcards?: () => Promise<void>;
}

export function useFlashcardsPage(): FlashcardHookResult {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    mastered: 0,
    learning: 0,
    due: 0
  });
  const { toast } = useToast();
  
  const loadUserFlashcards = async () => {
    
    try {
      setLoading(true);
      
      // Get current user with updated method
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication Error",
          description: "You must be signed in to view flashcards.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch flashcards for the user
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching flashcards:", error);
        toast({
          title: "Flashcard Error",
          description: "Failed to load flashcards.",
          variant: "destructive",
        });
      } else if (data) {
        // Convert to the unified Flashcard type (including both DB and UI field names)
        const convertedFlashcards: Flashcard[] = data.map(card => ({
          ...card,
          // Add UI field names for backward compatibility
          front: card.front_content,
          back: card.back_content,
          userId: card.user_id,
          topicId: card.topic_id,
          repetitionCount: card.repetition_count,
          masteryLevel: card.mastery_level || 0,
          easinessFactor: card.easiness_factor || 2.5,
        }));
        
        setFlashcards(convertedFlashcards);
        
        // Also update stats
        setStats({
          total: data.length,
          mastered: data.filter(card => card.mastery_level && card.mastery_level > 0.8).length,
          learning: data.filter(card => card.mastery_level && card.mastery_level <= 0.8 && card.mastery_level > 0).length,
          due: data.filter(card => new Date(card.next_review_date || '') <= new Date()).length
        });
        
        // Get due flashcards
        const dueCards = data.filter(card => new Date(card.next_review_date || '') <= new Date());
        const convertedDueCards: Flashcard[] = dueCards.map(card => ({
          ...card,
          // Add UI field names for backward compatibility
          front: card.front_content,
          back: card.back_content,
          userId: card.user_id,
          topicId: card.topic_id,
          repetitionCount: card.repetition_count,
          masteryLevel: card.mastery_level || 0,
          easinessFactor: card.easiness_factor || 2.5,
        }));
        
        setDueFlashcards(convertedDueCards);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while loading flashcards.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUserFlashcards();
  }, []);
  
  return {
    flashcards,
    dueFlashcards,
    loading,
    stats,
    reloadFlashcards: loadUserFlashcards,
    refreshFlashcards: loadUserFlashcards
  };
}

export type { Flashcard }; // Re-export the Flashcard type
