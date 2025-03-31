
import { useState, useCallback, useEffect } from 'react';
import { QuizQuestion } from '../../types';
import { QuizStateWithSetters } from './types';

export function useQuestionSelection(quizState: QuizStateWithSetters) {
  const { 
    currentDifficulty, 
    answeredQuestions, 
    setCurrentQuestion,
    userConfidence
  } = quizState;
  
  const [questionPool, setQuestionPool] = useState<QuizQuestion[]>([]);
  
  // Track topic performance to enable topic-based selection
  const [topicPerformance, setTopicPerformance] = useState<Record<string, {
    accuracy: number;
    count: number;
    lastSeen: number; // Question index when last seen
  }>>({});
  
  // Set the initial question pool
  const initializeQuestionPool = useCallback((availableQuestions: QuizQuestion[]) => {
    setQuestionPool(availableQuestions);
  }, []);

  // Update topic performance whenever answeredQuestions changes
  useEffect(() => {
    const newTopicPerformance = { ...topicPerformance };
    
    // Process latest answered question if available
    if (answeredQuestions.length > 0) {
      const latestQuestion = answeredQuestions[answeredQuestions.length - 1];
      const topic = latestQuestion.topic || 'unknown';
      
      // Initialize topic if not exists
      if (!newTopicPerformance[topic]) {
        newTopicPerformance[topic] = {
          accuracy: 0,
          count: 0,
          lastSeen: 0,
        };
      }
      
      // Update topic stats
      const topicData = newTopicPerformance[topic];
      const newCount = topicData.count + 1;
      const oldCorrect = topicData.accuracy * topicData.count;
      const newCorrect = oldCorrect + (latestQuestion.isCorrect ? 1 : 0);
      
      newTopicPerformance[topic] = {
        accuracy: newCorrect / newCount,
        count: newCount,
        lastSeen: answeredQuestions.length - 1 // Current index
      };
    }
    
    setTopicPerformance(newTopicPerformance);
  }, [answeredQuestions.length]);

  // Calculate a priority score for each question
  const calculateQuestionPriority = useCallback((question: QuizQuestion): number => {
    // Base priority based on difficulty match
    let priority = 10 - Math.abs(question.difficulty - currentDifficulty) * 3;
    
    // Topic-based adjustment
    const topic = question.topic;
    const topicData = topicPerformance[topic];
    
    if (topicData) {
      // Prioritize topics with lower accuracy (user needs practice)
      if (topicData.accuracy < 0.5 && topicData.count >= 2) {
        priority += 2; // Significant boost for weak topics
      }
      
      // Time-based priority: prioritize topics not seen recently
      const questionsSinceSeen = answeredQuestions.length - topicData.lastSeen;
      if (questionsSinceSeen > 10) {
        priority += 1.5; // Boost for topics not seen in a while
      }
      
      // Avoid over-focusing on a single topic
      if (topicData.count > 5 && Object.keys(topicPerformance).length > 1) {
        priority -= 1; // Slightly reduce priority for frequently seen topics
      }
    } else {
      // New topics get a boost to ensure coverage
      priority += 1;
    }
    
    // Confidence-based adjustment (if available)
    if (userConfidence !== undefined) {
      // For high-confidence users, prioritize more challenging questions
      if (userConfidence > 0.7) {
        priority += (question.difficulty / 3); // Slight preference for harder questions
      }
      // For low-confidence users, prioritize appropriate level questions
      else if (userConfidence < 0.4) {
        priority -= Math.abs(question.difficulty - currentDifficulty); // Stronger preference for matching difficulty
      }
    }
    
    return priority;
  }, [currentDifficulty, topicPerformance, answeredQuestions.length, userConfidence]);

  // The enhanced adaptive algorithm for selecting the next question
  const selectNextQuestion = useCallback(() => {
    // Filter out already answered questions
    const unansweredQuestions = questionPool.filter(q => 
      !answeredQuestions.some(aq => aq.id === q.id)
    );
    
    // If no questions left at all
    if (unansweredQuestions.length === 0) {
      return null;
    }
    
    // Calculate priority scores for each question
    const questionsWithPriority = unansweredQuestions.map(q => ({
      question: q,
      priority: calculateQuestionPriority(q)
    }));
    
    // Sort by priority (highest first)
    questionsWithPriority.sort((a, b) => b.priority - a.priority);
    
    // Add some randomness to avoid predictability (top 3 questions)
    // This creates variety while still respecting priorities
    const topCandidates = questionsWithPriority.slice(0, Math.min(3, questionsWithPriority.length));
    
    // Apply weighted random selection among top candidates
    const totalPriority = topCandidates.reduce((sum, item) => sum + item.priority, 0);
    let randomPoint = Math.random() * totalPriority;
    
    for (const candidate of topCandidates) {
      randomPoint -= candidate.priority;
      if (randomPoint <= 0) {
        return candidate.question;
      }
    }
    
    // Fallback to highest priority if weighted selection fails
    return topCandidates[0].question;
  }, [questionPool, calculateQuestionPriority, answeredQuestions]);

  return {
    questionPool,
    initializeQuestionPool,
    selectNextQuestion,
    topicPerformance
  };
}
