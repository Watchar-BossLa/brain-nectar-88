import { useState, useEffect } from 'react';
import { Flashcard } from '@/services/flashcardService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useFlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
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
      } else {
        setFlashcards(data as Flashcard[]);
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
    loading,
    reloadFlashcards: loadUserFlashcards
  };
}
