
import { QuizQuestion, AnsweredQuestion, QuizResults } from '../types';

// Calculate quiz results based on answered questions and quiz questions
export function calculateQuizResults(
  answeredQuestions: AnsweredQuestion[],
  questions: QuizQuestion[]
): QuizResults {
  const results: QuizResults = {
    questionsAttempted: answeredQuestions.length,
    correctAnswers: answeredQuestions.filter(q => q.isCorrect).length,
    incorrectAnswers: answeredQuestions.filter(q => !q.isCorrect && q.userAnswer !== 'SKIPPED').length,
    skippedQuestions: answeredQuestions.filter(q => q.userAnswer === 'SKIPPED').length,
    performanceByTopic: {},
    performanceByDifficulty: {
      'Easy': { correct: 0, total: 0 },
      'Medium': { correct: 0, total: 0 },
      'Hard': { correct: 0, total: 0 }
    },
    timeSpent: answeredQuestions.reduce((total, q) => total + q.timeTaken, 0)
  };
  
  // Calculate performance by topic and difficulty
  for (const answered of answeredQuestions) {
    const question = questions.find(q => q.id === answered.id);
    if (question) {
      const { topic, difficulty } = question;
      
      // Performance by topic
      if (!results.performanceByTopic[topic]) {
        results.performanceByTopic[topic] = { correct: 0, total: 0 };
      }
      results.performanceByTopic[topic].total += 1;
      if (answered.isCorrect) {
        results.performanceByTopic[topic].correct += 1;
      }
      
      // Performance by difficulty
      const difficultyLabel = difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard';
      results.performanceByDifficulty[difficultyLabel].total += 1;
      if (answered.isCorrect) {
        results.performanceByDifficulty[difficultyLabel].correct += 1;
      }
    }
  }
  
  return results;
}

// Filter and shuffle questions based on topics and difficulty
export function prepareQuizQuestions(
  allQuestions: QuizQuestion[],
  selectedTopics: string[],
  currentDifficulty: 1 | 2 | 3,
  quizLength: number
): QuizQuestion[] {
  // Filter questions based on selected topics (if any)
  let questionsPool = selectedTopics.length > 0
    ? allQuestions.filter(q => selectedTopics.includes(q.topic))
    : allQuestions;
  
  // If no questions match the criteria, use all questions
  if (questionsPool.length === 0) {
    questionsPool = allQuestions;
  }
  
  // Start with questions at the current difficulty level
  let initialQuestions = questionsPool.filter(q => q.difficulty === currentDifficulty);
  
  // If not enough questions at current difficulty, add questions from other difficulties
  if (initialQuestions.length < quizLength) {
    const remainingQuestions = questionsPool.filter(q => q.difficulty !== currentDifficulty);
    initialQuestions = [...initialQuestions, ...remainingQuestions];
  }
  
  // Shuffle and limit to quiz length
  const shuffled = initialQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, quizLength);
}

// Evaluate if answer is correct based on question type
export function evaluateAnswer(
  question: QuizQuestion, 
  selectedAnswer: string
): boolean {
  if (question.type === 'multiple-choice' || question.type === 'true-false') {
    return selectedAnswer === question.correctAnswer;
  } else if (question.type === 'calculation') {
    // For calculation questions, allow a small tolerance for rounding errors
    const userAnswer = parseFloat(selectedAnswer);
    const correctAnswer = parseFloat(question.correctAnswer as string);
    return !isNaN(userAnswer) && Math.abs(userAnswer - correctAnswer) < 0.01;
  } else if (question.type === 'essay') {
    // Essay questions are marked as "review needed" - no automatic scoring
    return false; // Will be manually evaluated
  }
  
  return false;
}
