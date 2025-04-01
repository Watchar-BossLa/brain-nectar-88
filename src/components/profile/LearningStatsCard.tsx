
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { LearningStats } from './types';

interface LearningStatsCardProps {
  isLoading: boolean;
  learningStats: LearningStats | null;
}

const LearningStatsCard = ({ isLoading, learningStats }: LearningStatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spaced Repetition Performance</CardTitle>
        <CardDescription>
          Your flashcard learning statistics and mastery metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1 text-center">
              <h3 className="text-3xl font-bold text-primary">
                {learningStats?.totalReviews || 0}
              </h3>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
            
            <div className="space-y-1 text-center">
              <h3 className="text-3xl font-bold text-primary">
                {Math.round((learningStats?.retentionRate || 0) * 100)}%
              </h3>
              <p className="text-sm text-muted-foreground">Retention Rate</p>
            </div>
            
            <div className="space-y-1 text-center">
              <h3 className="text-3xl font-bold text-primary">
                {learningStats?.masteredCardCount || 0}
              </h3>
              <p className="text-sm text-muted-foreground">Mastered Cards</p>
            </div>
            
            <div className="space-y-1 text-center">
              <h3 className="text-3xl font-bold text-primary">
                {Math.round((learningStats?.averageEaseFactor || 0) * 100) / 100}
              </h3>
              <p className="text-sm text-muted-foreground">Ease Factor</p>
            </div>
            
            <div className="space-y-1 text-center">
              <h3 className="text-3xl font-bold text-primary">
                {Math.round((learningStats?.learningEfficiency || 0) * 100)}%
              </h3>
              <p className="text-sm text-muted-foreground">Learning Efficiency</p>
            </div>
            
            <div className="space-y-1 text-center">
              <h3 className="text-3xl font-bold text-primary">
                {learningStats?.recommendedDailyReviews || 0}
              </h3>
              <p className="text-sm text-muted-foreground">Recommended Daily</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningStatsCard;
