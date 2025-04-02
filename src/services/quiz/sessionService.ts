
import { supabase } from '@/integrations/supabase/client';

/**
 * Get a specific quiz session by ID
 * @param sessionId The ID of the session to retrieve
 * @returns The quiz session data or error
 */
export const getQuizSession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select(`
        *,
        quiz_answered_questions(
          *,
          question:question_id(*)
        )
      `)
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching quiz session:", error);
    return null;
  }
};

/**
 * Get all quiz sessions for the current user
 * @returns Array of quiz sessions
 */
export const getUserQuizSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user quiz sessions:", error);
    return [];
  }
};
