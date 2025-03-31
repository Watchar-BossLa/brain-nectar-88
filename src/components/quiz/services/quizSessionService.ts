
import { supabase } from '@/integrations/supabase/client';
import { QuizResults, AnsweredQuestion } from '@/types/quiz';
import { QuizSessionSummary } from '@/types/quiz-session';
import { useAuth } from '@/context/auth/AuthContext';

// Save a quiz session to Supabase
export const saveQuizSession = async (
  userId: string,
  results: QuizResults,
  answeredQuestions: AnsweredQuestion[],
  selectedTopics: string[],
  initialDifficulty: 1 | 2 | 3
) => {
  try {
    // First, save the session
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        score_percentage: Math.round((results.correctAnswers / results.questionsAttempted) * 100),
        correct_answers: results.correctAnswers,
        total_questions: results.questionsAttempted,
        time_spent: results.timeSpent,
        difficulty: initialDifficulty,
        topics: results.performanceByTopic,
        selected_topics: selectedTopics,
        initial_difficulty: initialDifficulty
      })
      .select('id')
      .single();

    if (sessionError) {
      console.error('Error saving quiz session:', sessionError);
      return null;
    }

    const sessionId = sessionData.id;

    // Then, save the answered questions
    const answeredQuestionsToInsert = answeredQuestions.map(question => ({
      session_id: sessionId,
      question_id: question.id,
      is_correct: question.isCorrect,
      user_answer: question.userAnswer || 'SKIPPED',
      time_taken: question.timeTaken,
      confidence_level: question.confidenceLevel,
      topic: question.topic,
      difficulty: question.difficulty
    }));

    const { error: answersError } = await supabase
      .from('quiz_answered_questions')
      .insert(answeredQuestionsToInsert);

    if (answersError) {
      console.error('Error saving quiz answers:', answersError);
    }

    // Update performance metrics for each topic
    const topicPerformance = {};
    answeredQuestions.forEach(question => {
      if (!question.topic) return;

      if (!topicPerformance[question.topic]) {
        topicPerformance[question.topic] = {
          correct: 0,
          total: 0,
          confidence: [],
          time: []
        };
      }

      topicPerformance[question.topic].total++;
      
      if (question.isCorrect) {
        topicPerformance[question.topic].correct++;
      }
      
      if (question.confidenceLevel) {
        topicPerformance[question.topic].confidence.push(question.confidenceLevel);
      }
      
      topicPerformance[question.topic].time.push(question.timeTaken);
    });

    // Update performance metrics for each topic
    for (const [topic, data] of Object.entries(topicPerformance)) {
      const performance = data as { correct: number; total: number; confidence: number[]; time: number[] };
      const averageConfidence = performance.confidence.length > 0
        ? performance.confidence.reduce((sum, value) => sum + value, 0) / performance.confidence.length
        : null;
      const averageTime = performance.time.length > 0
        ? performance.time.reduce((sum, value) => sum + value, 0) / performance.time.length
        : null;

      // Upsert performance metrics for this topic
      const { error: metricsError } = await supabase
        .from('quiz_performance_metrics')
        .upsert({
          user_id: userId,
          topic,
          correct_count: supabase.rpc('increment', { row_count: performance.correct }),
          total_count: supabase.rpc('increment', { row_count: performance.total }),
          average_confidence: averageConfidence,
          average_time: averageTime,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id, topic'
        });

      if (metricsError) {
        console.error(`Error updating performance metrics for topic ${topic}:`, metricsError);
      }
    }

    return sessionId;
  } catch (error) {
    console.error('Error in saveQuizSession:', error);
    return null;
  }
};

// Fetch all quiz sessions for a user
export const fetchQuizSessions = async (userId: string): Promise<QuizSessionSummary[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching quiz sessions:', error);
      return [];
    }

    return data.map(session => ({
      id: session.id,
      date: session.date,
      scorePercentage: session.score_percentage,
      correctAnswers: session.correct_answers,
      totalQuestions: session.total_questions,
      timeSpent: session.time_spent,
      difficulty: ['Easy', 'Medium', 'Hard'][session.difficulty - 1],
      topics: session.selected_topics || []
    }));
  } catch (error) {
    console.error('Error in fetchQuizSessions:', error);
    return [];
  }
};

// Fetch a specific quiz session with its answered questions
export const fetchQuizSessionDetails = async (sessionId: string) => {
  try {
    // Fetch session data
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      console.error('Error fetching quiz session:', sessionError);
      return null;
    }

    // Fetch answered questions for this session
    const { data: answeredQuestionsData, error: answersError } = await supabase
      .from('quiz_answered_questions')
      .select('*')
      .eq('session_id', sessionId);

    if (answersError) {
      console.error('Error fetching answered questions:', answersError);
      return { session: sessionData, answeredQuestions: [] };
    }

    // Transform data to match the expected format
    const answeredQuestions = answeredQuestionsData.map(question => ({
      id: question.question_id,
      isCorrect: question.is_correct,
      userAnswer: question.user_answer,
      timeTaken: question.time_taken,
      confidenceLevel: question.confidence_level,
      topic: question.topic,
      difficulty: question.difficulty
    }));

    // Reconstruct results object
    const results = {
      questionsAttempted: sessionData.total_questions,
      correctAnswers: sessionData.correct_answers,
      incorrectAnswers: sessionData.total_questions - sessionData.correct_answers,
      skippedQuestions: answeredQuestions.filter(q => q.userAnswer === 'SKIPPED').length,
      performanceByTopic: sessionData.topics || {},
      performanceByDifficulty: {}, // We'll reconstruct this from answered questions
      timeSpent: sessionData.time_spent,
      score: sessionData.score_percentage
    };

    // Reconstruct performance by difficulty
    const difficultyMap = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
    answeredQuestions.forEach(question => {
      if (!question.difficulty) return;
      
      const diffLabel = difficultyMap[question.difficulty as keyof typeof difficultyMap];
      
      if (!results.performanceByDifficulty[diffLabel]) {
        results.performanceByDifficulty[diffLabel] = { correct: 0, total: 0 };
      }
      
      results.performanceByDifficulty[diffLabel].total++;
      
      if (question.isCorrect) {
        results.performanceByDifficulty[diffLabel].correct++;
      }
    });

    return {
      id: sessionData.id,
      date: sessionData.date,
      results,
      answeredQuestions,
      selectedTopics: sessionData.selected_topics || [],
      initialDifficulty: sessionData.initial_difficulty as 1 | 2 | 3,
      questionCount: sessionData.total_questions
    };
  } catch (error) {
    console.error('Error in fetchQuizSessionDetails:', error);
    return null;
  }
};

// Delete a specific quiz session
export const deleteQuizSession = async (sessionId: string) => {
  try {
    // First delete the related answered questions (due to foreign key constraints)
    const { error: answersError } = await supabase
      .from('quiz_answered_questions')
      .delete()
      .eq('session_id', sessionId);

    if (answersError) {
      console.error('Error deleting quiz answers:', answersError);
      return false;
    }

    // Then delete the session
    const { error: sessionError } = await supabase
      .from('quiz_sessions')
      .delete()
      .eq('id', sessionId);

    if (sessionError) {
      console.error('Error deleting quiz session:', sessionError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteQuizSession:', error);
    return false;
  }
};

// Delete all quiz sessions for a user
export const clearUserQuizHistory = async (userId: string) => {
  try {
    // First get all session IDs
    const { data: sessions, error: fetchError } = await supabase
      .from('quiz_sessions')
      .select('id')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error fetching session IDs:', fetchError);
      return false;
    }

    const sessionIds = sessions.map(s => s.id);

    // Delete all related answered questions
    const { error: answersError } = await supabase
      .from('quiz_answered_questions')
      .delete()
      .in('session_id', sessionIds);

    if (answersError) {
      console.error('Error deleting quiz answers:', answersError);
      return false;
    }

    // Delete all sessions
    const { error: sessionsError } = await supabase
      .from('quiz_sessions')
      .delete()
      .eq('user_id', userId);

    if (sessionsError) {
      console.error('Error deleting quiz sessions:', sessionsError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in clearUserQuizHistory:', error);
    return false;
  }
};

// Create a function to help with the increment
export const createIncrementFunction = async () => {
  try {
    const { error } = await supabase.rpc('create_increment_function');
    if (error) {
      console.error('Error creating increment function:', error);
    }
  } catch (error) {
    console.error('Error creating increment function:', error);
  }
};
