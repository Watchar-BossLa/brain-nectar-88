
import { useCallback } from 'react';
import { QuizQuestion } from '../../types';
import { quizQuestions } from '../../data/quizQuestions';
import { QuizStateWithSetters } from './types';

export function useTopicSelection(quizState: QuizStateWithSetters) {
  const {
    selectedTopics,
    setSelectedTopics,
    selectedSubject
  } = quizState;

  // Get all available subjects
  const allSubjects = [...new Set(quizQuestions.map(q => q.subject || 'accounting'))];
  
  // Get unique topics for the selected subject
  const allTopics = [...new Set(
    quizQuestions
      .filter(q => !selectedSubject || q.subject === selectedSubject || (!q.subject && selectedSubject === 'accounting'))
      .map(q => q.topic)
  )];
  
  // Toggle topic selection
  const toggleTopic = useCallback((topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  }, [selectedTopics, setSelectedTopics]);
  
  // Get filtered questions
  const getFilteredQuestions = useCallback(() => {
    return quizQuestions.filter(q => {
      // Filter by subject
      const subjectMatch = !selectedSubject || q.subject === selectedSubject || (!q.subject && selectedSubject === 'accounting');
      
      // Filter by topics if any are selected
      const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(q.topic);
      
      return subjectMatch && topicMatch;
    });
  }, [selectedSubject, selectedTopics]);
  
  return {
    allTopics,
    allSubjects,
    toggleTopic,
    getFilteredQuestions
  };
}
