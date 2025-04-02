
import { supabase } from '@/integrations/supabase/client';

/**
 * Create a new flashcard in the database
 */
export const createFlashcard = async (
  frontContentOrUserId: string, 
  backContent: string, 
  topicIdOrNull?: string | null
) => {
  try {
    // Get current user with updated syntax
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    let userId: string;
    let frontContent: string;
    
    // Handle different function signatures
    if (session && session.user && session.user.id === frontContentOrUserId) {
      // If first argument is userId (old signature)
      userId = frontContentOrUserId;
      frontContent = backContent;
      backContent = topicIdOrNull as string;
      topicIdOrNull = null;
    } else {
      // If first argument is frontContent (new signature)
      userId = session?.user?.id || '';
      frontContent = frontContentOrUserId;
    }
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Create the flashcard
    const response = await supabase
      .from('flashcards')
      .insert({
        front_content: frontContent,
        back_content: backContent,
        topic_id: topicIdOrNull || null,
        user_id: userId,
        difficulty: 0,
        repetition_count: 0,
        mastery_level: 0,
        easiness_factor: 2.5,
        next_review_date: new Date().toISOString()
      })
      .select();
      
    // Return the created flashcard
    return response.data?.[0] || null;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};

/**
 * Delete a flashcard from the database
 */
export const deleteFlashcard = async (flashcardId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Delete the flashcard
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return false;
  }
};

/**
 * Update a flashcard in the database
 */
export const updateFlashcard = async (
  flashcardId: string, 
  updates: { 
    front_content?: string; 
    back_content?: string;
    topic_id?: string;
    difficulty?: number;
  }
): Promise<any> => {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Update the flashcard
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', flashcardId)
      .eq('user_id', userId)
      .select();
      
    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    return null;
  }
};
