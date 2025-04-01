
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpenIcon, BrainIcon } from 'lucide-react';
import { LearningStats as LearningStatsType } from './useUserProfileData';
import Achievements from './Achievements';

interface LearningStatsProps {
  learningStats: LearningStatsType;
}

const LearningStats = ({ learningStats }: LearningStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Statistics</CardTitle>
        <CardDescription>
          Your progress and learning achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5" />
                Flashcards
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{learningStats.totalFlashcards}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Mastered</p>
                  <p className="text-2xl font-bold">{learningStats.masteredFlashcards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainIcon className="h-5 w-5" />
                Memory Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Retention</p>
                  <p className="text-2xl font-bold">{learningStats.averageRetention}%</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Reviews</p>
                  <p className="text-2xl font-bold">{learningStats.reviewedFlashcards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Achievements learningStats={learningStats} />
      </CardContent>
    </Card>
  );
};

export default LearningStats;
