
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const AchievementsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Achievements</CardTitle>
        <CardDescription>
          Track your learning milestones and accomplishments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <h3 className="font-medium">No achievements yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Continue learning to earn achievements and track your progress
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;
