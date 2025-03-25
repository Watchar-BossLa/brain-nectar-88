
import { useState } from 'react';
import { QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizQuestions';

export function useQuizSetup() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2); // Start with medium difficulty
  const [quizLength, setQuizLength] = useState(5);
  
  // Get unique topics for topic selection
  const allTopics = [...new Set(quizQuestions.map(q => q.topic))];
  
  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  return {
    selectedTopics,
    setSelectedTopics,
    currentDifficulty,
    setCurrentDifficulty,
    quizLength,
    setQuizLength,
    allTopics,
    toggleTopic,
    quizQuestions
  };
}
