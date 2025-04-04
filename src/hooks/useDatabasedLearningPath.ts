
import { useContext } from 'react';
import { 
  useDatabasedLearningPath as useContextDatabasedLearningPath,
} from '@/context/learning/DatabasedLearningPathContext';

/**
 * Re-export the hook for backward compatibility
 * This allows other components to import the hook from this location
 * without directly depending on the context implementation
 */
export const useDatabasedLearningPath = useContextDatabasedLearningPath;

/**
 * Hook to access only recommended topics from the learning path
 * @returns Recommended topics sorted by priority
 */
export const useRecommendedTopics = () => {
  const { modules, isLoading } = useContextDatabasedLearningPath();
  
  // Get all topics and filter recommended ones
  const recommendedTopics = !isLoading
    ? modules
        .flatMap(module => 
          module.topics.map(topic => ({
            ...topic,
            moduleId: module.id,
            moduleTitle: module.title
          }))
        )
        .filter(topic => topic.recommended)
        .sort((a, b) => a.mastery - b.mastery)
    : [];
  
  return {
    recommendedTopics,
    isLoading
  };
};

/**
 * Hook to access learning progress statistics
 * @returns Statistics and loading state
 */
export const useLearningStats = () => {
  const { stats, isLoading } = useContextDatabasedLearningPath();
  
  return {
    stats,
    isLoading
  };
};
