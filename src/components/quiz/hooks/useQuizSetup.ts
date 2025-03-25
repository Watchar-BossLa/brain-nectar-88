
import { useState } from 'react';
import { QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizQuestions';

export function useQuizSetup() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('accounting');
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2); // Start with medium difficulty
  const [quizLength, setQuizLength] = useState(5);
  
  // Get all available subjects
  const allSubjects = [...new Set(quizQuestions.map(q => q.subject || 'accounting'))];
  
  // Get unique topics for the selected subject
  const allTopics = [...new Set(
    quizQuestions
      .filter(q => !selectedSubject || q.subject === selectedSubject || (!q.subject && selectedSubject === 'accounting'))
      .map(q => q.topic)
  )];
  
  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  // Get filtered questions
  const getFilteredQuestions = () => {
    return quizQuestions.filter(q => {
      // Filter by subject
      const subjectMatch = !selectedSubject || q.subject === selectedSubject || (!q.subject && selectedSubject === 'accounting');
      
      // Filter by topics if any are selected
      const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(q.topic);
      
      return subjectMatch && topicMatch;
    });
  };
  
  return {
    selectedTopics,
    setSelectedTopics,
    selectedSubject,
    setSelectedSubject,
    currentDifficulty,
    setCurrentDifficulty,
    quizLength,
    setQuizLength,
    allTopics,
    allSubjects,
    toggleTopic,
    getFilteredQuestions
  };
}
