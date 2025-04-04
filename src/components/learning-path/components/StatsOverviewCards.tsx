
import React from 'react';
import { CheckCircle, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LearningPathStats } from '@/types/learningPath';

interface StatsOverviewCardsProps {
  stats: LearningPathStats;
}

const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            Completed Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.completedTopics} / {stats.totalTopics}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.masteredTopics} topics mastered
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Average Mastery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageMastery}%
          </div>
          <Progress value={stats.averageMastery} className="h-1.5 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            Estimated Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.estimatedCompletionDays} days
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Current streak: {stats.streak} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverviewCards;
