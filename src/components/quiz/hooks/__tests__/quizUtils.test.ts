
import { describe, it, expect } from 'vitest';
import { 
  calculateQuizResults, 
  prepareQuizQuestions, 
  evaluateAnswer 
} from '../quizUtils';
import { QuizQuestion, AnsweredQuestion } from '../../types';

describe('Quiz Utility Functions', () => {
  // Mock data for testing
  const mockQuestions: QuizQuestion[] = [
    {
      id: '1',
      text: 'What is the accounting equation?',
      type: 'multiple-choice',
      difficulty: 1,
      options: [
        'Assets = Liabilities + Equity',
        'Assets = Liabilities - Equity',
        'Assets + Liabilities = Equity',
        'Assets - Equity = Liabilities'
      ],
      correctAnswer: 'Assets = Liabilities + Equity',
      explanation: 'The accounting equation is Assets = Liabilities + Equity',
      topic: 'Accounting Basics'
    },
    {
      id: '2',
      text: 'Calculate the current ratio if current assets are $100,000 and current liabilities are $50,000',
      type: 'calculation',
      difficulty: 2,
      correctAnswer: '2',
      explanation: 'Current ratio = Current Assets / Current Liabilities = 100000 / 50000 = 2',
      topic: 'Financial Ratios'
    },
    {
      id: '3',
      text: 'Is depreciation a non-cash expense?',
      type: 'true-false',
      difficulty: 1,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Depreciation is a non-cash expense that allocates the cost of an asset over its useful life.',
      topic: 'Depreciation'
    },
    {
      id: '4',
      text: 'Explain the difference between FIFO and LIFO inventory methods.',
      type: 'essay',
      difficulty: 3,
      explanation: 'FIFO (First-In, First-Out) assumes that the oldest inventory items are sold first. LIFO (Last-In, First-Out) assumes that the newest inventory items are sold first.',
      topic: 'Inventory'
    }
  ];

  const mockAnsweredQuestions: AnsweredQuestion[] = [
    { id: '1', isCorrect: true, userAnswer: 'Assets = Liabilities + Equity', timeTaken: 10000 },
    { id: '2', isCorrect: false, userAnswer: '3', timeTaken: 15000 },
    { id: '3', isCorrect: true, userAnswer: 'True', timeTaken: 5000 },
    { id: '4', isCorrect: false, userAnswer: 'SKIPPED', timeTaken: 0 }
  ];

  describe('calculateQuizResults', () => {
    it('should calculate correct quiz results', () => {
      const results = calculateQuizResults(mockAnsweredQuestions, mockQuestions);
      
      expect(results.questionsAttempted).toBe(4);
      expect(results.correctAnswers).toBe(2);
      expect(results.incorrectAnswers).toBe(1);
      expect(results.skippedQuestions).toBe(1);
      expect(results.timeSpent).toBe(30000); // 10000 + 15000 + 5000 + 0
      
      // Check topic performance
      expect(results.performanceByTopic['Accounting Basics'].correct).toBe(1);
      expect(results.performanceByTopic['Accounting Basics'].total).toBe(1);
      expect(results.performanceByTopic['Financial Ratios'].correct).toBe(0);
      expect(results.performanceByTopic['Financial Ratios'].total).toBe(1);
      
      // Check difficulty performance
      expect(results.performanceByDifficulty['Easy'].correct).toBe(2);
      expect(results.performanceByDifficulty['Easy'].total).toBe(2);
      expect(results.performanceByDifficulty['Medium'].correct).toBe(0);
      expect(results.performanceByDifficulty['Medium'].total).toBe(1);
      expect(results.performanceByDifficulty['Hard'].correct).toBe(0);
      expect(results.performanceByDifficulty['Hard'].total).toBe(1);
    });

    it('should handle empty answered questions', () => {
      const results = calculateQuizResults([], mockQuestions);
      
      expect(results.questionsAttempted).toBe(0);
      expect(results.correctAnswers).toBe(0);
      expect(results.incorrectAnswers).toBe(0);
      expect(results.skippedQuestions).toBe(0);
      expect(results.timeSpent).toBe(0);
    });
  });

  describe('prepareQuizQuestions', () => {
    it('should filter questions by selected topics', () => {
      const selectedTopics = ['Accounting Basics'];
      const result = prepareQuizQuestions(mockQuestions, selectedTopics, 2, 5);
      
      expect(result.length).toBeLessThanOrEqual(5);
      expect(result.every(q => selectedTopics.includes(q.topic) || q.difficulty === 2)).toBe(true);
    });

    it('should prioritize questions with the selected difficulty', () => {
      const result = prepareQuizQuestions(mockQuestions, [], 2, 2);
      
      // Since we have only one question with difficulty 2, and we're asking for 2 questions,
      // it should include the difficulty 2 question and one other question
      expect(result.length).toBe(2);
      expect(result.some(q => q.difficulty === 2)).toBe(true);
    });

    it('should limit to the requested quiz length', () => {
      const result = prepareQuizQuestions(mockQuestions, [], 1, 2);
      
      expect(result.length).toBe(2);
    });

    it('should use all questions if no topics match', () => {
      const result = prepareQuizQuestions(mockQuestions, ['Non-existent Topic'], 1, 3);
      
      expect(result.length).toBe(3);
      // Should pull from all available questions since no topics match
      expect(result.some(q => mockQuestions.includes(q))).toBe(true);
    });
    
    it('should handle empty questions array', () => {
      const result = prepareQuizQuestions([], [], 1, 5);
      
      expect(result.length).toBe(0);
    });
  });

  describe('evaluateAnswer', () => {
    it('should correctly evaluate multiple-choice answers', () => {
      const result = evaluateAnswer(mockQuestions[0], 'Assets = Liabilities + Equity');
      expect(result).toBe(true);
      
      const incorrectResult = evaluateAnswer(mockQuestions[0], 'Assets = Liabilities - Equity');
      expect(incorrectResult).toBe(false);
    });

    it('should correctly evaluate true-false answers', () => {
      const result = evaluateAnswer(mockQuestions[2], 'True');
      expect(result).toBe(true);
      
      const incorrectResult = evaluateAnswer(mockQuestions[2], 'False');
      expect(incorrectResult).toBe(false);
    });

    it('should correctly evaluate calculation answers with tolerance', () => {
      const exactResult = evaluateAnswer(mockQuestions[1], '2');
      expect(exactResult).toBe(true);
      
      const closeResult = evaluateAnswer(mockQuestions[1], '2.001');
      expect(closeResult).toBe(true);
      
      const incorrectResult = evaluateAnswer(mockQuestions[1], '3');
      expect(incorrectResult).toBe(false);
    });

    it('should handle essay answers (always return false for automated grading)', () => {
      const result = evaluateAnswer(mockQuestions[3], 'Any answer');
      expect(result).toBe(false);
    });
    
    it('should handle undefined or null answers', () => {
      const result = evaluateAnswer(mockQuestions[0], '');
      expect(result).toBe(false);
    });
  });
});
