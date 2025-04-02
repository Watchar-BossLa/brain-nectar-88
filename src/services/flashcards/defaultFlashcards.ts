
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';
import { DefaultFlashcard } from './types';
import { accountingFlashcards } from './defaultFlashcardCategories/accounting';
import { financeFlashcards } from './defaultFlashcardCategories/finance';
import { standardsFlashcards } from './defaultFlashcardCategories/standards';

// Re-export the individual categories for direct access if needed
export { accountingFlashcards, financeFlashcards, standardsFlashcards };

/**
 * Load default flashcards for a new user
 * @param userId - The ID of the user to load flashcards for
 * @returns Promise resolving to a boolean indicating success or failure
 */
export async function loadDefaultFlashcardsForUser(userId: string): Promise<boolean> {
  try {
    console.log(`Attempting to load default flashcards for user ${userId}`);
    
    // First check if the user already has flashcards
    const { data: existingCards, error: fetchError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Error checking for existing flashcards:', fetchError);
      return false;
    }
    
    // Only load default flashcards if user has no flashcards
    if (existingCards && existingCards.length > 0) {
      console.log('User already has flashcards, skipping default flashcards load');
      return true;
    }
    
    console.log('No existing flashcards found, creating defaults...');
    const now = new Date().toISOString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Combine all flashcards
    const allDefaultFlashcards = [
      ...accountingFlashcards, 
      ...financeFlashcards, 
      ...standardsFlashcards
    ];
    
    console.log(`Preparing to insert ${allDefaultFlashcards.length} default flashcards`);
    
    // Map to Supabase format
    const flashcardsToInsert = allDefaultFlashcards.map(card => ({
      user_id: userId,
      front_content: card.front_content,
      back_content: card.back_content,
      topic_id: null, // We don't have topic IDs for default cards
      difficulty: card.difficulty,
      next_review_date: tomorrow.toISOString(),
      repetition_count: 0,
      mastery_level: 0,
      easiness_factor: 2.5, // Default easiness factor
      created_at: now,
      updated_at: now,
      last_retention: 0.85 // Default retention
    }));
    
    // Insert all flashcards
    const { error: insertError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert);
      
    if (insertError) {
      console.error('Error inserting default flashcards:', insertError);
      return false;
    }
    
    console.log(`Successfully loaded ${flashcardsToInsert.length} default flashcards for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error loading default flashcards:', error);
    return false;
  }
}
