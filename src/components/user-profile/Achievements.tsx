
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LearningStats } from './useUserProfileData';

interface AchievementsProps {
  learningStats: LearningStats;
}

const Achievements = ({ learningStats }: AchievementsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Learning Achievements</h3>
      <div className="flex flex-wrap gap-2">
        {learningStats.totalFlashcards > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            First Flashcard Created
          </Badge>
        )}
        {learningStats.reviewedFlashcards > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            Started Learning
          </Badge>
        )}
        {learningStats.reviewedFlashcards > 10 && (
          <Badge variant="secondary" className="px-3 py-1">
            Consistent Learner
          </Badge>
        )}
        {learningStats.masteredFlashcards > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            First Card Mastered
          </Badge>
        )}
        {learningStats.masteredFlashcards > 10 && (
          <Badge variant="secondary" className="px-3 py-1">
            Knowledge Builder
          </Badge>
        )}
        {learningStats.averageRetention > 75 && (
          <Badge variant="secondary" className="px-3 py-1">
            Excellent Memory
          </Badge>
        )}
      </div>
    </div>
  );
};

export default Achievements;
