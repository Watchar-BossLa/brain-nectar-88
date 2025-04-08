
/**
 * @fileoverview Hook for managing quiz functionality with offline support
 */
import { useState, useEffect, useCallback } from 'react';
import { useOfflineMode } from './useOfflineMode';
import { useOfflineAnalytics } from '@/utils/offlineAnalytics';
import { cacheQuizDataForOffline } from '@/registerServiceWorker';
import { useAuth } from '@/context/auth';
import { toast } from 'react-toastify';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing quiz functionality with offline support
 * @returns {Object} Quiz methods and state
 */
export function useOfflineQuiz() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const { user } = useAuth();
  const { isOnline, saveQuizProgress, getQuizData } = useOfflineMode();
  const { trackEvent } = useOfflineAnalytics();
  
  /**
   * Loads quiz questions from server or local storage
   * @param {Array} topics - Topics to filter questions by
   * @param {string} difficulty - Difficulty level
   */
  const loadQuizQuestions = useCallback(async (topics = [], difficulty = 'medium') => {
    setIsLoading(true);
    
    try {
      if (isOnline) {
        // Online mode: get from server
        let query = supabase
          .from('questions')
          .select('*');
          
        // Apply filters if provided
        if (topics && topics.length > 0) {
          query = query.in('topic', topics);
        }
        
        if (difficulty) {
          // Map difficulty string to numeric values
          const difficultyMap = { 
            easy: 1,
            medium: 2,
            hard: 3
          };
          
          const difficultyValue = difficultyMap[difficulty.toLowerCase()] || 2;
          query = query.eq('difficulty', difficultyValue);
        }
        
        const { data, error } = await query.limit(20);
        
        if (error) throw error;
        
        if (data) {
          setQuizQuestions(data);
          
          // Cache quiz data for offline use
          cacheQuizDataForOffline(data);
          
          // Also save to local storage
          const sessionId = `quiz_${Date.now()}`;
          await saveQuizProgress(sessionId, data);
          
          trackEvent('quiz_questions_loaded', { count: data.length });
        }
      } else {
        // Offline mode: get from local storage
        const offlineQuizData = await getQuizData();
        
        // Use the most recent quiz data
        const quizDataKeys = Object.keys(offlineQuizData);
        if (quizDataKeys.length > 0) {
          // Sort by timestamp (newest first)
          quizDataKeys.sort((a, b) => {
            const timeA = offlineQuizData[a]._offlineData?.timestamp || 0;
            const timeB = offlineQuizData[b]._offlineData?.timestamp || 0;
            return timeB - timeA;
          });
          
          const latestQuizData = offlineQuizData[quizDataKeys[0]].data;
          setQuizQuestions(latestQuizData);
          
          toast.info('Using cached quiz questions. Some features may be limited while offline.');
        } else {
          setQuizQuestions([]);
          toast.error('No quiz data available offline.');
        }
      }
    } catch (error) {
      console.error('Error loading quiz questions:', error);
      toast.error('Failed to load quiz questions');
      
      // Try to load from local storage as fallback
      const offlineQuizData = await getQuizData();
      const quizDataKeys = Object.keys(offlineQuizData);
      
      if (quizDataKeys.length > 0) {
        // Get the most recent quiz data
        quizDataKeys.sort((a, b) => {
          const timeA = offlineQuizData[a]._offlineData?.timestamp || 0;
          const timeB = offlineQuizData[b]._offlineData?.timestamp || 0;
          return timeB - timeA;
        });
        
        setQuizQuestions(offlineQuizData[quizDataKeys[0]].data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, saveQuizProgress, getQuizData, trackEvent]);
  
  /**
   * Starts a quiz session
   * @param {Object} params - Quiz parameters
   */
  const startQuiz = useCallback(async (params) => {
    const { topics, difficulty } = params || {};
    
    setActiveQuiz(true);
    setQuizResults(null);
    
    await loadQuizQuestions(topics, difficulty);
    
    trackEvent('quiz_started', { 
      topics,
      difficulty,
      timestamp: Date.now(),
      offline: !isOnline
    });
  }, [loadQuizQuestions, trackEvent, isOnline]);
  
  /**
   * Submits a quiz answer
   * @param {string} questionId - Question ID
   * @param {string} answer - User's answer
   * @param {boolean} isCorrect - Whether the answer is correct
   * @param {number} timeTaken - Time taken to answer (in seconds)
   */
  const submitAnswer = useCallback(async (questionId, answer, isCorrect, timeTaken) => {
    try {
      const answerData = {
        question_id: questionId,
        user_answer: answer,
        is_correct: isCorrect,
        time_taken: timeTaken,
        created_at: new Date().toISOString(),
        user_id: user?.id
      };
      
      if (isOnline) {
        // If online, submit to server
        const { error } = await supabase
          .from('quiz_answered_questions')
          .insert(answerData);
          
        if (error) throw error;
      } else {
        // If offline, store locally
        const answerId = `answer_${Date.now()}_${questionId}`;
        await saveQuizProgress(answerId, answerData);
      }
      
      trackEvent('quiz_answer_submitted', {
        questionId,
        isCorrect,
        timeTaken,
        offline: !isOnline
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting answer:', error);
      
      // Even if the server submission fails, store locally
      if (isOnline) {
        const answerId = `answer_${Date.now()}_${questionId}`;
        await saveQuizProgress(answerId, {
          question_id: questionId,
          user_answer: answer,
          is_correct: isCorrect,
          time_taken: timeTaken,
          created_at: new Date().toISOString(),
          user_id: user?.id
        });
      }
      
      return false;
    }
  }, [isOnline, saveQuizProgress, trackEvent, user]);
  
  /**
   * Finishes a quiz session and saves results
   * @param {Object} results - Quiz results
   */
  const finishQuiz = useCallback(async (results) => {
    setActiveQuiz(false);
    setQuizResults(results);
    
    try {
      const sessionData = {
        user_id: user?.id,
        score_percentage: results.scorePercentage,
        correct_answers: results.correctCount,
        total_questions: results.totalQuestions,
        time_spent: results.totalTime,
        difficulty: results.difficulty,
        selected_topics: results.topics,
        date: new Date().toISOString()
      };
      
      if (isOnline) {
        // If online, save to server
        const { error } = await supabase
          .from('quiz_sessions')
          .insert(sessionData);
          
        if (error) throw error;
      } else {
        // If offline, store locally
        const sessionId = `session_${Date.now()}`;
        await saveQuizProgress(sessionId, sessionData);
        toast.info('Quiz results saved offline. They will sync when you reconnect.');
      }
      
      trackEvent('quiz_completed', {
        score: results.scorePercentage,
        questions: results.totalQuestions,
        timeSpent: results.totalTime,
        offline: !isOnline
      });
      
    } catch (error) {
      console.error('Error saving quiz results:', error);
      
      // Even if server submission fails, store locally
      if (isOnline) {
        const sessionId = `session_${Date.now()}`;
        await saveQuizProgress(sessionId, {
          user_id: user?.id,
          score_percentage: results.scorePercentage,
          correct_answers: results.correctCount,
          total_questions: results.totalQuestions,
          time_spent: results.totalTime,
          difficulty: results.difficulty,
          selected_topics: results.topics,
          date: new Date().toISOString()
        });
      }
    }
  }, [isOnline, saveQuizProgress, trackEvent, user]);

  return {
    quizQuestions,
    isLoading,
    activeQuiz,
    quizResults,
    loadQuizQuestions,
    startQuiz,
    submitAnswer,
    finishQuiz
  };
}
